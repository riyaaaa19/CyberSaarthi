from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "CyberSaarthi API"
    APP_ENV: str = "local"
    APP_DEBUG: bool = True

    API_V1_PREFIX: str = "/v1"
    ALLOWED_ORIGINS: str = "*"

    API_KEY: str | None = None

    DATABASE_URL: str = "sqlite:///./cybersaarthi.db"

    PHISHING_MODEL_PATH: str = "app/data/models/phishing_model.joblib"
    BLOCKLIST_PATH: str = "app/data/blocklist_domains.txt"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        if "," in self.ALLOWED_ORIGINS:
            return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
        return [self.ALLOWED_ORIGINS]

@lru_cache
def get_settings() -> Settings:
    return Settings()
