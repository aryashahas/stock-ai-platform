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
        # Technology
        "AAPL", "GOOGL", "MSFT", "AMZN", "META", "NVDA", "NFLX", "TSLA",
        "AMD", "INTC", "CRM", "ORCL", "ADBE", "CSCO", "AVGO", "QCOM",
        "TXN", "NOW", "IBM", "SHOP", "SQ", "SNAP", "UBER", "LYFT",
        "PLTR", "NET", "CRWD", "ZS", "PANW", "SNOW", "DDOG", "MDB",
        "TWLO", "ZM", "DOCU", "AMAT", "LRCX", "KLAC", "MRVL", "MU",
        "HPQ", "DELL", "SMCI", "ARM",
        # Finance
        "JPM", "BAC", "WFC", "GS", "MS", "C", "V", "MA", "PYPL",
        "AXP", "SCHW", "BLK", "SPGI", "COF", "USB", "PNC", "COIN", "HOOD",
        # Healthcare
        "JNJ", "UNH", "PFE", "ABBV", "MRK", "LLY", "TMO", "ABT",
        "BMY", "AMGN", "GILD", "MDT", "CVS", "MRNA", "BIIB", "REGN", "VRTX", "ZTS",
        # Energy
        "XOM", "CVX", "COP", "SLB", "EOG", "MPC", "PSX", "VLO", "OXY", "HAL",
        "ENPH", "FSLR", "NEE", "DUK", "SO",
        # Consumer / Retail
        "WMT", "COST", "HD", "LOW", "TGT", "NKE", "SBUX", "MCD",
        "KO", "PEP", "PG", "CL", "EL", "LULU", "ETSY", "BABA", "JD",
        "EBAY", "DG", "DLTR", "YUM", "CMG", "ABNB",
        # Industrials
        "BA", "CAT", "GE", "HON", "RTX", "LMT", "NOC", "GD", "DE",
        "UPS", "FDX", "MMM", "EMR",
        # Communication
        "DIS", "CMCSA", "T", "VZ", "TMUS", "SPOT", "ROKU", "WBD",
        "PARA", "EA", "TTWO", "RBLX", "PINS",
        # Real Estate
        "AMT", "PLD", "CCI", "SPG", "O",
        # Materials
        "LIN", "APD", "SHW", "FCX", "NEM", "GOLD",
        # ETFs
        "SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "ARKK",
        # Indian ADRs
        "INFY", "WIT", "HDB", "IBN", "TTM", "RDY",
        # Automotive
        "F", "GM", "RIVN", "LCID", "NIO", "XPEV", "LI", "RACE", "TM",
        # Food & Beverage
        "MDLZ", "KHC", "GIS", "K", "HSY", "STZ", "BUD",
        # Travel
        "MAR", "HLT", "BKNG", "EXPE", "RCL", "CCL", "DAL", "UAL", "AAL", "LUV",
        # Insurance
        "BRK.B", "ALL", "MET", "PRU", "AIG",
        # Other
        "SOFI", "AFRM", "U", "PATH", "AI", "IONQ", "MELI", "SE",
    ]

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
