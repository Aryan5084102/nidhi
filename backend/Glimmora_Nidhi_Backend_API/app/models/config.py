from sqlalchemy import Column, String, Integer, Boolean, DateTime, Float
from datetime import datetime
from ..core.database import Base


class SystemConfig(Base):
    __tablename__ = "system_config"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String, unique=True, nullable=False, index=True)
    value = Column(String, nullable=False)
    category = Column(String, nullable=False)  # company, deposits, loans, chitFunds, ai, notifications
    description = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(String, nullable=True)
