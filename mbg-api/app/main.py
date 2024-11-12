from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import router
from settings import settings

app = FastAPI()
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello mbg!"}
