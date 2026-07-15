from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    WRITE_DATABASE_URL: str
    READ_DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )