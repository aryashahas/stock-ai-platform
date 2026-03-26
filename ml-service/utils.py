"""
Utility functions for the ML stock prediction service.

Provides helpers for synthetic data generation, metric calculation,
prediction formatting, business-day computation, and symbol validation.
"""

import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def generate_mock_stock_data(symbol: str, days: int = 730) -> pd.DataFrame:
    """Generate realistic synthetic OHLCV stock data using a random walk with drift.

    The generated data mimics real stock behaviour including:
    - Upward drift (positive expected return)
    - Volatility clustering via GARCH-like scaling
    - Realistic OHLCV relationships (High >= Close >= Low, etc.)
    - Volume that correlates loosely with price movement magnitude

    Args:
        symbol: Stock ticker symbol (used to seed the generator for reproducibility).
        days: Number of trading days to generate.

    Returns:
        A pandas DataFrame indexed by date with columns
        [Open, High, Low, Close, Volume].
    """
    # Seed from symbol for reproducibility
    seed = sum(ord(c) for c in symbol) * 42
    rng = np.random.RandomState(seed)

    # Symbol-specific base prices so different tickers look different
    symbol_prices: Dict[str, float] = {
        # Technology
        "AAPL": 175.0, "GOOGL": 140.0, "MSFT": 375.0, "AMZN": 185.0,
        "META": 350.0, "NVDA": 500.0, "NFLX": 480.0, "TSLA": 240.0,
        "AMD": 155.0, "INTC": 42.0, "CRM": 265.0, "ORCL": 125.0,
        "ADBE": 540.0, "CSCO": 52.0, "AVGO": 920.0, "QCOM": 155.0,
        "TXN": 172.0, "NOW": 700.0, "IBM": 168.0, "SHOP": 68.0,
        "SQ": 72.0, "SNAP": 14.0, "UBER": 62.0, "PLTR": 22.0,
        "NET": 78.0, "CRWD": 195.0, "PANW": 290.0, "SNOW": 170.0,
        "DDOG": 110.0, "MDB": 400.0, "ZM": 70.0, "AMAT": 160.0,
        "LRCX": 720.0, "MU": 80.0, "SMCI": 300.0, "ARM": 65.0,
        # Finance
        "JPM": 195.0, "BAC": 35.0, "WFC": 48.0, "GS": 420.0,
        "MS": 95.0, "C": 52.0, "V": 280.0, "MA": 420.0,
        "PYPL": 65.0, "AXP": 185.0, "BLK": 780.0, "COIN": 155.0,
        # Healthcare
        "JNJ": 160.0, "UNH": 530.0, "PFE": 28.0, "ABBV": 155.0,
        "MRK": 110.0, "LLY": 590.0, "TMO": 540.0, "ABT": 108.0,
        "AMGN": 285.0, "MRNA": 105.0, "REGN": 850.0, "VRTX": 390.0,
        # Energy
        "XOM": 108.0, "CVX": 160.0, "COP": 118.0, "NEE": 72.0,
        # Consumer
        "WMT": 165.0, "COST": 575.0, "HD": 340.0, "NKE": 105.0,
        "SBUX": 100.0, "MCD": 290.0, "KO": 60.0, "PEP": 178.0,
        "PG": 155.0, "LULU": 420.0, "BABA": 82.0, "CMG": 2200.0, "ABNB": 145.0,
        # Industrials
        "BA": 210.0, "CAT": 285.0, "GE": 120.0, "HON": 200.0,
        "LMT": 460.0, "DE": 400.0, "UPS": 155.0, "FDX": 265.0,
        # Communication
        "DIS": 92.0, "T": 17.0, "VZ": 36.0, "TMUS": 145.0, "SPOT": 180.0,
        # ETFs
        "SPY": 450.0, "QQQ": 380.0, "VOO": 415.0,
        # Indian ADRs
        "INFY": 18.0, "HDB": 62.0, "IBN": 25.0, "TTM": 28.0,
        # Automotive
        "F": 12.0, "GM": 38.0, "RIVN": 18.0, "NIO": 8.0, "TM": 185.0, "RACE": 340.0,
        # Travel
        "BKNG": 3200.0, "MAR": 210.0, "DAL": 42.0,
        # Other
        "MELI": 1450.0, "SOFI": 9.0,
    }
    base_price: float = symbol_prices.get(symbol.upper(), 100.0)

    # Random-walk parameters
    drift: float = 0.0003  # daily drift (~7.5 % annualised)
    volatility: float = 0.02  # daily vol (~32 % annualised)

    closes: List[float] = [base_price]
    for _ in range(1, days):
        daily_return = drift + volatility * rng.randn()
        new_price = closes[-1] * (1 + daily_return)
        closes.append(max(new_price, 1.0))  # price floor

    closes_arr = np.array(closes)

    # Build OHLCV from Close
    intraday_range = closes_arr * 0.02 * (0.5 + rng.rand(days))
    highs = closes_arr + intraday_range * rng.uniform(0.3, 1.0, days)
    lows = closes_arr - intraday_range * rng.uniform(0.3, 1.0, days)
    lows = np.maximum(lows, 0.5)
    opens = lows + (highs - lows) * rng.uniform(0.2, 0.8, days)

    # Volume: base volume with noise correlated to absolute returns
    base_volume = 50_000_000
    returns = np.abs(np.diff(closes_arr, prepend=closes_arr[0]) / closes_arr)
    volume = (base_volume * (1 + 10 * returns) * (0.5 + rng.rand(days))).astype(int)

    # Date index: business days ending today
    end_date = datetime.now()
    dates = pd.bdate_range(end=end_date, periods=days)

    df = pd.DataFrame(
        {
            "Open": opens,
            "High": highs,
            "Low": lows,
            "Close": closes_arr,
            "Volume": volume,
        },
        index=dates,
    )
    df.index.name = "Date"
    return df


def calculate_metrics(
    actual: np.ndarray, predicted: np.ndarray
) -> Dict[str, float]:
    """Calculate regression metrics between actual and predicted values.

    Args:
        actual: Ground-truth values as a 1-D array.
        predicted: Model predictions as a 1-D array of the same length.

    Returns:
        Dictionary with keys: mse, rmse, mae, r2_score.
    """
    actual = np.asarray(actual).flatten()
    predicted = np.asarray(predicted).flatten()

    mse_val: float = float(mean_squared_error(actual, predicted))
    rmse_val: float = float(np.sqrt(mse_val))
    mae_val: float = float(mean_absolute_error(actual, predicted))
    r2_val: float = float(r2_score(actual, predicted))

    return {
        "mse": round(mse_val, 6),
        "rmse": round(rmse_val, 6),
        "mae": round(mae_val, 6),
        "r2_score": round(r2_val, 6),
    }


def format_predictions(
    predictions: np.ndarray, start_date: Optional[datetime] = None
) -> List[Dict[str, Any]]:
    """Format raw prediction values into a list of {date, predicted_price} dicts.

    Args:
        predictions: 1-D array of predicted prices.
        start_date: The first prediction date. Defaults to the next business day
                    after today.

    Returns:
        List of dictionaries with 'date' (ISO string) and 'predicted_price' (float).
    """
    if start_date is None:
        start_date = datetime.now() + timedelta(days=1)

    business_days = get_business_days(start_date, len(predictions))

    formatted: List[Dict[str, Any]] = []
    for date, price in zip(business_days, predictions):
        formatted.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "predicted_price": round(float(price), 2),
            }
        )
    return formatted


def get_business_days(start_date: datetime, num_days: int) -> List[datetime]:
    """Return the next *num_days* business days starting from *start_date*.

    Skips weekends (Saturday and Sunday). Does not account for public holidays.

    Args:
        start_date: The date to start counting from.
        num_days: How many business days to return.

    Returns:
        List of datetime objects representing business days.
    """
    business_days: List[datetime] = []
    current = start_date

    while len(business_days) < num_days:
        # Monday=0 ... Sunday=6
        if current.weekday() < 5:
            business_days.append(current)
        current += timedelta(days=1)

    return business_days


def validate_symbol(symbol: str) -> Tuple[bool, str]:
    """Validate that a stock symbol string is well-formed.

    Rules:
    - Must be 1-5 uppercase alphabetic characters.
    - Must not be empty or contain special characters.

    Args:
        symbol: The ticker symbol to validate.

    Returns:
        Tuple of (is_valid, message).
    """
    if not symbol:
        return False, "Symbol cannot be empty."

    symbol = symbol.strip().upper()

    if not re.match(r"^[A-Z]{1,5}$", symbol):
        return False, (
            f"Invalid symbol '{symbol}'. "
            "Must be 1-5 uppercase letters (e.g. AAPL)."
        )

    return True, f"Symbol '{symbol}' is valid."
