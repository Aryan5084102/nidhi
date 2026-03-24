import secrets
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Glimmora Nidhi API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Security — override via .env in production
    SECRET_KEY: str = secrets.token_hex(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 min access token

    DATABASE_URL: str = "sqlite:///./glimmora_nidhi.db"

    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Rate limiting
    RATE_LIMIT_AUTH: str = "5/minute"

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
