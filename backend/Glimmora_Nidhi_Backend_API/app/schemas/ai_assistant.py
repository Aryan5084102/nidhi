from pydantic import BaseModel
from typing import Optional, List, Any


class ChatRequest(BaseModel):
    message: str
    conversationId: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    conversationId: str
    sources: List[str]
    suggestions: List[str]


class QueryRequest(BaseModel):
    query: str
    format: str = "table"


class QueryResponse(BaseModel):
    columns: List[str]
    rows: List[List[Any]]
    totalResults: int


class InsightOut(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    category: str
    generatedAt: str
    actionable: bool
    suggestedAction: Optional[str] = None
