from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine
from app.core.exceptions import AppException

# Import all models so they are registered before create_all
from app.models import (  # noqa: F401
    User, Member, ChitScheme, ChitEnrollment,
    Auction, Bid, Loan, EMISchedule, LoanDefault,
    Deposit, DepositScheme, Collection, Payment, RecoveryCase,
    ComplianceChecklist, KYCMonitoring, AMLAlert, RegulatoryFiling,
    FraudCase, TransactionAnomaly, Notification, SystemConfig,
    AuditLog, PasswordResetToken,
)

from app.routers import (
    auth, members, chit_schemes, chit_enrollments, auctions,
    loans, deposits, collections, compliance, fraud,
    ai_risk, notifications, reports, config, dashboard,
    ai_assistant, profile,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade REST API for Glimmora Nidhi — a Nidhi company management system",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    detail = exc.detail if isinstance(exc.detail, dict) else {"error": str(exc.detail), "code": "ERROR"}
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, **detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0].get("msg", "Validation error") if errors else "Validation error"
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": msg, "code": "VALIDATION_ERROR"},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error", "code": "INTERNAL_ERROR"},
    )


PREFIX = settings.API_V1_PREFIX

app.include_router(auth.router, prefix=PREFIX)
app.include_router(members.router, prefix=PREFIX)
app.include_router(chit_schemes.router, prefix=PREFIX)
app.include_router(chit_enrollments.router, prefix=PREFIX)
app.include_router(auctions.router, prefix=PREFIX)
app.include_router(loans.router, prefix=PREFIX)
app.include_router(deposits.router, prefix=PREFIX)
app.include_router(collections.router, prefix=PREFIX)
app.include_router(compliance.router, prefix=PREFIX)
app.include_router(fraud.router, prefix=PREFIX)
app.include_router(ai_risk.router, prefix=PREFIX)
app.include_router(notifications.router, prefix=PREFIX)
app.include_router(reports.router, prefix=PREFIX)
app.include_router(config.router, prefix=PREFIX)
app.include_router(dashboard.router, prefix=PREFIX)
app.include_router(ai_assistant.router, prefix=PREFIX)
app.include_router(profile.router, prefix=PREFIX)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
