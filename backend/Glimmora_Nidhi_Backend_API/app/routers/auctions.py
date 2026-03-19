from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException, BadRequestException
from ..models.auction import Auction, Bid
from ..models.chit_scheme import ChitScheme
from ..models.chit_enrollment import ChitEnrollment
from ..models.member import Member
from ..models.user import User
from ..schemas.auction import BidCreate

router = APIRouter(tags=["Auctions"])


def _bid_out(bid: Bid, member: Member) -> dict:
    return {
        "bidId": bid.id,
        "memberId": bid.member_id,
        "memberName": member.name if member else "Unknown",
        "bidAmount": bid.bid_amount,
        "discount": bid.discount,
        "sti": member.sti if member else 0,
        "time": bid.time.isoformat() + "Z",
        "isWinning": bid.is_winning,
    }


def _auction_out(a: Auction) -> dict:
    return {
        "auctionId": a.id,
        "schemeId": a.scheme_id,
        "month": a.month,
        "date": a.date,
        "potSize": a.pot_size,
        "foremanCommission": a.foreman_commission,
        "availablePot": a.available_pot,
        "status": a.status,
        "winner": a.winner_id,
        "winningBid": a.winning_bid,
        "totalBidders": a.total_bidders,
    }


@router.get("/chit-schemes/{scheme_id}/auctions")
def get_scheme_auctions(
    scheme_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scheme = db.query(ChitScheme).filter(ChitScheme.id == scheme_id).first()
    if not scheme:
        raise NotFoundException("Chit scheme not found")
    auctions = db.query(Auction).filter(Auction.scheme_id == scheme_id).all()
    return {"success": True, "data": [_auction_out(a) for a in auctions]}


@router.get("/auctions/{auction_id}/live")
def get_live_auction(
    auction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise NotFoundException("Auction not found")
    scheme = db.query(ChitScheme).filter(ChitScheme.id == auction.scheme_id).first()
    bids_with_members = (
        db.query(Bid, Member)
        .join(Member, Bid.member_id == Member.id)
        .filter(Bid.auction_id == auction_id)
        .order_by(Bid.bid_amount.asc())
        .all()
    )
    return {
        "success": True,
        "data": {
            "auctionId": auction.id,
            "schemeId": auction.scheme_id,
            "schemeName": scheme.name if scheme else "",
            "potSize": auction.pot_size,
            "foremanCommission": auction.foreman_commission,
            "availablePot": auction.available_pot,
            "minBid": auction.min_bid,
            "status": auction.status,
            "timeRemaining": auction.time_remaining,
            "totalBidders": auction.total_bidders,
            "bids": [_bid_out(b, m) for b, m in bids_with_members],
        },
    }


@router.post("/auctions/{auction_id}/bid", status_code=201)
def place_bid(
    auction_id: str,
    payload: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise NotFoundException("Auction not found")
    if auction.status != "Live":
        raise BadRequestException("Auction is not currently live", "AUCTION_NOT_LIVE")

    member = db.query(Member).filter(Member.id == payload.memberId).first()
    if not member:
        raise NotFoundException("Member not found")

    # Validate enrollment
    enrolled = (
        db.query(ChitEnrollment)
        .filter(
            ChitEnrollment.scheme_id == auction.scheme_id,
            ChitEnrollment.member_id == payload.memberId,
            ChitEnrollment.has_won_auction == False,
            ChitEnrollment.status == "Active",
        )
        .first()
    )
    if not enrolled:
        raise BadRequestException("Member is not eligible to bid in this auction", "NOT_ELIGIBLE")

    # Check bid is below available pot
    if payload.bidAmount > auction.available_pot:
        raise BadRequestException(
            f"Bid must be lower than available pot of {auction.available_pot}",
            "BID_TOO_HIGH",
        )

    # Check winning bid
    current_winning = db.query(Bid).filter(Bid.auction_id == auction_id, Bid.is_winning == True).first()
    if current_winning and payload.bidAmount >= current_winning.bid_amount:
        raise BadRequestException(
            f"Bid must be lower than current winning bid of {current_winning.bid_amount}",
            "BID_TOO_HIGH",
        )

    # Mark previous winning bid as not winning
    if current_winning:
        current_winning.is_winning = False

    foreman_commission = auction.pot_size * 0.05  # default 5%
    discount = auction.pot_size - payload.bidAmount - foreman_commission
    bid = Bid(
        id=f"BID-{uuid.uuid4().hex[:6].upper()}",
        auction_id=auction_id,
        member_id=payload.memberId,
        bid_amount=payload.bidAmount,
        discount=discount,
        is_winning=True,
        time=datetime.utcnow(),
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return {
        "success": True,
        "data": {
            "bidId": bid.id,
            "memberId": bid.member_id,
            "bidAmount": bid.bid_amount,
            "discount": bid.discount,
            "time": bid.time.isoformat() + "Z",
        },
        "message": "Bid placed successfully",
    }


@router.post("/auctions/{auction_id}/close")
def close_auction(
    auction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "BRANCH_MANAGER")),
):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise NotFoundException("Auction not found")
    if auction.status == "Completed":
        raise BadRequestException("Auction is already completed", "ALREADY_COMPLETED")

    winning_bid = (
        db.query(Bid)
        .filter(Bid.auction_id == auction_id, Bid.is_winning == True)
        .first()
    )
    if not winning_bid:
        raise BadRequestException("No bids placed in this auction", "NO_BIDS")

    winner = db.query(Member).filter(Member.id == winning_bid.member_id).first()
    scheme = db.query(ChitScheme).filter(ChitScheme.id == auction.scheme_id).first()

    enrolled_count = (
        db.query(ChitEnrollment)
        .filter(
            ChitEnrollment.scheme_id == auction.scheme_id,
            ChitEnrollment.status == "Active",
        )
        .count()
    )
    dividend = (auction.pot_size - winning_bid.bid_amount) / enrolled_count if enrolled_count else 0

    auction.status = "Completed"
    auction.winner_id = winning_bid.member_id
    auction.winning_bid = winning_bid.bid_amount
    auction.dividend_per_member = dividend
    auction.closed_at = datetime.utcnow()
    auction.closed_by = current_user.id

    # Mark winner's enrollment
    enrollment = (
        db.query(ChitEnrollment)
        .filter(
            ChitEnrollment.scheme_id == auction.scheme_id,
            ChitEnrollment.member_id == winning_bid.member_id,
        )
        .first()
    )
    if enrollment:
        enrollment.has_won_auction = True

    db.commit()
    return {
        "success": True,
        "data": {
            "auctionId": auction.id,
            "winnerId": winning_bid.member_id,
            "winnerName": winner.name if winner else "Unknown",
            "winningBid": winning_bid.bid_amount,
            "discount": winning_bid.discount,
            "dividendPerMember": dividend,
            "status": "Completed",
        },
        "message": f"Auction closed. Winner: {winner.name if winner else 'Unknown'}",
    }
