import os
from pydantic_settings import BaseSettings, SettingsConfigDict


env_file = '.env'

if os.path.exists(env_file):
    model_config = SettingsConfigDict(env_file=".env")
else:
    model_config = None

class Settings(BaseSettings):
    app_name: str = "Awesome API"
    cors_origins: str
    sqlalchemy_database_url: str

    isochrone_service_url: str
    optimized_route_service_url: str

    model_config = model_config


settings = Settings()
