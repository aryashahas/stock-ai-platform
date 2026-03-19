"""
FastAPI application for the AI-powered stock prediction ML service.

Endpoints:
    POST /predict          - Predict future stock prices.
    POST /train            - Train (or retrain) an LSTM model for a symbol.
    GET  /predict/history/{symbol} - Actual vs predicted comparison.
    GET  /health           - Service health check.
    GET  /models           - List all persisted models and their metadata.
"""

import os
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import Config
from model import StockPredictor
from utils import validate_symbol

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Stock AI Prediction Service",
    description=(
        "LSTM-based stock price prediction service. Fetches historical market "
        "data, trains deep-learning models, and generates multi-day forecasts."
    ),
    version="1.0.0",
)

# CORS -- allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------


class PredictRequest(BaseModel):
    """Request body for the /predict endpoint."""

    symbol: str = Field(
        ..., description="Stock ticker symbol (e.g. AAPL).", examples=["AAPL"]
    )
    days: int = Field(
        default=Config.DEFAULT_PREDICTION_DAYS,
        ge=1,
        le=365,
        description="Number of future business days to predict.",
    )


class TrainRequest(BaseModel):
    """Request body for the /train endpoint."""

    symbol: str = Field(
        ..., description="Stock ticker symbol.", examples=["AAPL"]
    )
    epochs: int = Field(
        default=Config.DEFAULT_EPOCHS,
        ge=1,
        le=500,
        description="Number of training epochs.",
    )


class PredictionItem(BaseModel):
    """A single predicted data point."""

    date: str
    predicted_price: float


class HistoricalItem(BaseModel):
    """A single historical data point."""

    date: str
    actual_price: float


class PredictResponse(BaseModel):
    """Response body for the /predict endpoint."""

    symbol: str
    predictions: List[Dict[str, Any]]
    model_metrics: Dict[str, float]
    historical: List[Dict[str, Any]]
    training_info: Dict[str, Any]


class TrainResponse(BaseModel):
    """Response body for the /train endpoint."""

    symbol: str
    metrics: Dict[str, float]
    training_history: Dict[str, Any]
    training_info: Dict[str, Any]
    data_points: Dict[str, Any]


class HealthResponse(BaseModel):
    """Response body for /health."""

    status: str
    timestamp: str
    version: str
    supported_symbols: List[str]


class ModelInfo(BaseModel):
    """Metadata for a single persisted model."""

    symbol: str
    model_file: str
    scaler_file: str
    model_size_mb: float
    last_modified: str


class ModelsResponse(BaseModel):
    """Response body for /models."""

    models: List[ModelInfo]
    total: int


# ---------------------------------------------------------------------------
# In-memory predictor cache (avoids reloading models on every request)
# ---------------------------------------------------------------------------
_predictor_cache: Dict[str, StockPredictor] = {}


def _get_predictor(symbol: str) -> StockPredictor:
    """Return a cached ``StockPredictor`` for *symbol*, creating one if needed.

    Args:
        symbol: Uppercase stock ticker.

    Returns:
        A ``StockPredictor`` instance (model may or may not be loaded yet).
    """
    symbol = symbol.upper()
    if symbol not in _predictor_cache:
        _predictor_cache[symbol] = StockPredictor(symbol)
    return _predictor_cache[symbol]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest) -> Dict[str, Any]:
    """Generate stock price predictions for the requested symbol.

    The model is loaded from disk if available, otherwise it is trained
    on-the-fly. Predictions are produced iteratively for the specified
    number of future business days.
    """
    symbol = request.symbol.upper()

    # Validate symbol
    is_valid, msg = validate_symbol(symbol)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    try:
        predictor = _get_predictor(symbol)
        result = predictor.predict_future(days=request.days)

        logger.info(
            "Prediction complete for %s (%d days).", symbol, request.days
        )
        return result

    except Exception as exc:
        logger.error("Prediction endpoint error for %s: %s", symbol, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed for {symbol}: {str(exc)}",
        )


@app.post("/train", response_model=TrainResponse)
async def train(request: TrainRequest) -> Dict[str, Any]:
    """Train (or retrain) an LSTM model for the given symbol.

    The trained model and scaler are persisted to the ``models/`` directory.
    """
    symbol = request.symbol.upper()

    is_valid, msg = validate_symbol(symbol)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    try:
        predictor = _get_predictor(symbol)
        result = predictor.train(epochs=request.epochs)

        logger.info("Training complete for %s.", symbol)
        return result

    except Exception as exc:
        logger.error("Training endpoint error for %s: %s", symbol, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Training failed for {symbol}: {str(exc)}",
        )


@app.get("/predict/history/{symbol}")
async def predict_history(symbol: str) -> Dict[str, Any]:
    """Return the last 90 days of actual vs model-predicted prices.

    Useful for visualising how well the model tracks real market data.
    """
    symbol = symbol.upper()

    is_valid, msg = validate_symbol(symbol)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    try:
        predictor = _get_predictor(symbol)
        result = predictor.get_comparison(days=90)

        logger.info("Comparison retrieved for %s.", symbol)
        return result

    except Exception as exc:
        logger.error("History endpoint error for %s: %s", symbol, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Comparison failed for {symbol}: {str(exc)}",
        )


@app.get("/health", response_model=HealthResponse)
async def health() -> Dict[str, Any]:
    """Return the current service health status."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "supported_symbols": Config.SUPPORTED_SYMBOLS,
    }


@app.get("/models", response_model=ModelsResponse)
async def list_models() -> Dict[str, Any]:
    """List all trained models currently saved on disk.

    Scans the ``models/`` directory for ``.keras`` files and returns
    metadata including file size and last-modified timestamp.
    """
    models: List[Dict[str, Any]] = []

    try:
        model_dir = Config.MODEL_DIR
        if not os.path.exists(model_dir):
            return {"models": [], "total": 0}

        for filename in os.listdir(model_dir):
            if filename.endswith("_lstm_model.keras"):
                symbol = filename.replace("_lstm_model.keras", "")
                model_path = os.path.join(model_dir, filename)
                scaler_file = f"{symbol}_scaler.pkl"
                scaler_path = os.path.join(model_dir, scaler_file)

                # Gather metadata
                model_stat = os.stat(model_path)
                size_mb = round(model_stat.st_size / (1024 * 1024), 2)
                last_modified = datetime.fromtimestamp(
                    model_stat.st_mtime
                ).isoformat()

                models.append(
                    {
                        "symbol": symbol,
                        "model_file": filename,
                        "scaler_file": scaler_file
                        if os.path.exists(scaler_path)
                        else "missing",
                        "model_size_mb": size_mb,
                        "last_modified": last_modified,
                    }
                )

        logger.info("Listed %d models.", len(models))
        return {"models": models, "total": len(models)}

    except Exception as exc:
        logger.error("Error listing models: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list models: {str(exc)}",
        )


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    logger.info(
        "Starting ML service on %s:%d ...", Config.HOST, Config.PORT
    )
    uvicorn.run(
        "app:app",
        host=Config.HOST,
        port=Config.PORT,
        reload=Config.DEBUG,
    )
