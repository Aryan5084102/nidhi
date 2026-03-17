from pydantic import BaseModel
from typing import Any, Optional, List


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    code: str


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int


class PaginatedResponse(BaseModel):
    success: bool = True
    data: List[Any]
    pagination: PaginationMeta
