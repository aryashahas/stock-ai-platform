"""
Configuration settings for the ML stock prediction service.

Centralizes all configurable parameters including model hyperparameters,
directory paths, and supported stock symbols.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration loaded from environment variables with sensible defaults."""

    # Directory paths
    MODEL_DIR: str = os.getenv("MODEL_DIR", "models")
    DATA_DIR: str = os.getenv("DATA_DIR", "data")

    # Model hyperparameters
    SEQUENCE_LENGTH: int = int(os.getenv("SEQUENCE_LENGTH", "60"))
    DEFAULT_EPOCHS: int = int(os.getenv("DEFAULT_EPOCHS", "50"))
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "32"))
    TRAIN_SPLIT: float = float(os.getenv("TRAIN_SPLIT", "0.8"))

    # Prediction settings
    DEFAULT_PREDICTION_DAYS: int = int(os.getenv("DEFAULT_PREDICTION_DAYS", "30"))

    # LSTM architecture
    LSTM_UNITS_1: int = 128
    LSTM_UNITS_2: int = 64
    LSTM_UNITS_3: int = 32
    DROPOUT_RATE: float = 0.2
    DENSE_UNITS: int = 16
    LEARNING_RATE: float = 0.001

    # Data settings
    HISTORICAL_PERIOD: str = "2y"
    FEATURE_COLUMNS: list = ["Close", "Volume", "High", "Low", "Open"]

    # Supported stock symbols
    SUPPORTED_SYMBOLS: list = [
        "AAPL",
        "GOOGL",
        "MSFT",
        "AMZN",
        "TSLA",
        "META",
        "NFLX",
        "NVDA",
    ]

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
