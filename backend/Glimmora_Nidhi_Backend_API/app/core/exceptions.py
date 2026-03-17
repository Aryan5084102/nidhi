from fastapi import HTTPException, status


class AppException(HTTPException):
    def __init__(self, status_code: int, error: str, code: str):
        super().__init__(status_code=status_code, detail={"error": error, "code": code})


class UnauthorizedException(AppException):
    def __init__(self, error: str = "Authentication required", code: str = "UNAUTHORIZED"):
        super().__init__(status.HTTP_401_UNAUTHORIZED, error, code)


class ForbiddenException(AppException):
    def __init__(self, error: str = "Access denied", code: str = "FORBIDDEN"):
        super().__init__(status.HTTP_403_FORBIDDEN, error, code)


class NotFoundException(AppException):
    def __init__(self, error: str = "Resource not found", code: str = "NOT_FOUND"):
        super().__init__(status.HTTP_404_NOT_FOUND, error, code)


class BadRequestException(AppException):
    def __init__(self, error: str, code: str = "BAD_REQUEST"):
        super().__init__(status.HTTP_400_BAD_REQUEST, error, code)


class ConflictException(AppException):
    def __init__(self, error: str, code: str = "CONFLICT"):
        super().__init__(status.HTTP_409_CONFLICT, error, code)
