"""
LSTM-based stock price prediction model.

Provides the StockPredictor class which handles the full lifecycle of
fetching data, preprocessing, building an LSTM network, training,
saving / loading, and generating future price predictions.
"""

import os
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

from config import Config
from utils import (
    calculate_metrics,
    format_predictions,
    generate_mock_stock_data,
)

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


class StockPredictor:
    """End-to-end LSTM predictor for a single stock symbol.

    Attributes:
        symbol: Uppercase ticker symbol (e.g. ``"AAPL"``).
        sequence_length: Number of past time-steps fed into the LSTM.
        model: The compiled / loaded Keras Sequential model (or ``None``).
        scaler: A fitted ``MinMaxScaler`` used for normalisation.
        model_path: File path where the Keras model is persisted.
        scaler_path: File path where the scaler is persisted.
        training_history: Keras ``History`` object from the last ``fit`` call.
    """

    def __init__(
        self, symbol: str, sequence_length: int = Config.SEQUENCE_LENGTH
    ) -> None:
        """Initialise the predictor for *symbol*.

        Args:
            symbol: Stock ticker symbol.
            sequence_length: Sliding-window length for sequence generation.
        """
        self.symbol: str = symbol.upper()
        self.sequence_length: int = sequence_length
        self.model: Optional[Any] = None  # keras.Sequential
        self.scaler: MinMaxScaler = MinMaxScaler(feature_range=(0, 1))
        self.model_path: str = os.path.join(
            Config.MODEL_DIR, f"{self.symbol}_lstm_model.keras"
        )
        self.scaler_path: str = os.path.join(
            Config.MODEL_DIR, f"{self.symbol}_scaler.pkl"
        )
        self.training_history: Optional[Any] = None

        # Ensure the models directory exists
        os.makedirs(Config.MODEL_DIR, exist_ok=True)

    # ------------------------------------------------------------------
    # Data fetching
    # ------------------------------------------------------------------

    def fetch_data(self, period: str = Config.HISTORICAL_PERIOD) -> pd.DataFrame:
        """Download historical OHLCV data from Yahoo Finance.

        If the download fails (network error, invalid symbol, etc.) the
        method falls back to generating realistic synthetic data so that
        training and prediction can still proceed offline.

        Args:
            period: Look-back period understood by ``yfinance``
                    (e.g. ``"2y"``, ``"1y"``, ``"6mo"``).

        Returns:
            DataFrame with columns ``[Open, High, Low, Close, Volume]``
            indexed by date.
        """
        try:
            import yfinance as yf

            logger.info(
                "Fetching %s historical data from Yahoo Finance (period=%s)...",
                self.symbol,
                period,
            )
            ticker = yf.Ticker(self.symbol)
            data: pd.DataFrame = ticker.history(period=period)

            if data.empty:
                raise ValueError(
                    f"No data returned by yfinance for symbol '{self.symbol}'."
                )

            # Keep only the columns we need
            required_cols = ["Open", "High", "Low", "Close", "Volume"]
            for col in required_cols:
                if col not in data.columns:
                    raise ValueError(f"Missing expected column: {col}")

            data = data[required_cols].copy()
            logger.info(
                "Fetched %d rows for %s.", len(data), self.symbol
            )
            return data

        except Exception as exc:
            logger.warning(
                "yfinance fetch failed for %s: %s. Using synthetic data.",
                self.symbol,
                exc,
            )
            return self._generate_fallback_data(period)

    def _generate_fallback_data(self, period: str = "2y") -> pd.DataFrame:
        """Generate synthetic data as a fallback when yfinance is unavailable.

        Args:
            period: Approximate look-back period to determine the number
                    of synthetic trading days.

        Returns:
            Synthetic OHLCV DataFrame.
        """
        period_days_map: Dict[str, int] = {
            "1mo": 22,
            "3mo": 66,
            "6mo": 132,
            "1y": 252,
            "2y": 504,
            "5y": 1260,
        }
        days = period_days_map.get(period, 504)
        logger.info(
            "Generating %d days of synthetic data for %s.", days, self.symbol
        )
        return generate_mock_stock_data(self.symbol, days=days)

    # ------------------------------------------------------------------
    # Data preparation
    # ------------------------------------------------------------------

    def prepare_data(
        self,
        data: pd.DataFrame,
        feature_col: str = "Close",
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Normalise data and create sliding-window sequences for the LSTM.

        Steps:
        1. Extract the *feature_col* column and reshape to 2-D.
        2. Fit a ``MinMaxScaler`` and transform the values to [0, 1].
        3. Build (X, y) pairs using a sliding window of size
           ``self.sequence_length``.
        4. Split into training (80 %) and test (20 %) sets.

        Args:
            data: OHLCV DataFrame.
            feature_col: Column name to use as the prediction target.

        Returns:
            Tuple of ``(X_train, X_test, y_train, y_test)`` where each
            ``X`` has shape ``(samples, sequence_length, 1)`` and each
            ``y`` has shape ``(samples,)``.
        """
        values: np.ndarray = data[feature_col].values.reshape(-1, 1)

        # Fit and transform
        scaled: np.ndarray = self.scaler.fit_transform(values)

        # Create sequences
        X: List[np.ndarray] = []
        y: List[float] = []
        for i in range(self.sequence_length, len(scaled)):
            X.append(scaled[i - self.sequence_length : i, 0])
            y.append(scaled[i, 0])

        X_arr = np.array(X)
        y_arr = np.array(y)

        # Reshape X for LSTM: (samples, time_steps, features)
        X_arr = X_arr.reshape(X_arr.shape[0], X_arr.shape[1], 1)

        # Train / test split (no shuffle -- time series)
        split_idx = int(len(X_arr) * Config.TRAIN_SPLIT)
        X_train = X_arr[:split_idx]
        X_test = X_arr[split_idx:]
        y_train = y_arr[:split_idx]
        y_test = y_arr[split_idx:]

        logger.info(
            "Prepared data -- X_train: %s, X_test: %s",
            X_train.shape,
            X_test.shape,
        )
        return X_train, X_test, y_train, y_test

    # ------------------------------------------------------------------
    # Model architecture
    # ------------------------------------------------------------------

    def build_model(self, input_shape: Tuple[int, int]) -> Any:
        """Construct and compile a stacked-LSTM model.

        Architecture:
            LSTM(128, return_sequences=True) -> Dropout(0.2)
            LSTM(64,  return_sequences=True) -> Dropout(0.2)
            LSTM(32)                          -> Dropout(0.2)
            Dense(16, relu)
            Dense(1)

        Args:
            input_shape: ``(sequence_length, num_features)`` -- the shape
                         of a single input sample.

        Returns:
            A compiled Keras ``Sequential`` model.
        """
        try:
            from tensorflow.keras.models import Sequential
            from tensorflow.keras.layers import LSTM, Dense, Dropout
            from tensorflow.keras.optimizers import Adam
        except ImportError:
            from keras.models import Sequential
            from keras.layers import LSTM, Dense, Dropout
            from keras.optimizers import Adam

        model = Sequential(
            [
                LSTM(
                    Config.LSTM_UNITS_1,
                    return_sequences=True,
                    input_shape=input_shape,
                ),
                Dropout(Config.DROPOUT_RATE),
                LSTM(Config.LSTM_UNITS_2, return_sequences=True),
                Dropout(Config.DROPOUT_RATE),
                LSTM(Config.LSTM_UNITS_3),
                Dropout(Config.DROPOUT_RATE),
                Dense(Config.DENSE_UNITS, activation="relu"),
                Dense(1),
            ]
        )

        model.compile(
            optimizer=Adam(learning_rate=Config.LEARNING_RATE),
            loss="mean_squared_error",
            metrics=["mae"],
        )

        logger.info("Built LSTM model with input shape %s.", input_shape)
        model.summary(print_fn=logger.info)
        return model

    # ------------------------------------------------------------------
    # Training
    # ------------------------------------------------------------------

    def train(
        self,
        epochs: int = Config.DEFAULT_EPOCHS,
        batch_size: int = Config.BATCH_SIZE,
    ) -> Dict[str, Any]:
        """Fetch data, build the LSTM, train, persist, and return metrics.

        Args:
            epochs: Number of training epochs.
            batch_size: Mini-batch size.

        Returns:
            Dictionary containing:
            - ``metrics``: MSE, RMSE, MAE, R2 on the test set.
            - ``training_history``: Per-epoch loss and MAE.
            - ``training_info``: Epochs, sequence length, features used.
            - ``data_points``: Number of training / test samples.
        """
        try:
            # 1. Fetch historical data
            data = self.fetch_data()

            # 2. Prepare sequences
            X_train, X_test, y_train, y_test = self.prepare_data(data)

            if len(X_train) == 0 or len(X_test) == 0:
                raise ValueError(
                    "Insufficient data to create training / test sequences. "
                    f"Need at least {self.sequence_length + 2} data points."
                )

            # 3. Build model
            self.model = self.build_model(
                input_shape=(X_train.shape[1], X_train.shape[2])
            )

            # 4. Train
            logger.info(
                "Training %s model for %d epochs (batch=%d)...",
                self.symbol,
                epochs,
                batch_size,
            )

            try:
                from tensorflow.keras.callbacks import EarlyStopping
            except ImportError:
                from keras.callbacks import EarlyStopping

            early_stop = EarlyStopping(
                monitor="val_loss",
                patience=10,
                restore_best_weights=True,
            )

            history = self.model.fit(
                X_train,
                y_train,
                epochs=epochs,
                batch_size=batch_size,
                validation_split=0.1,
                callbacks=[early_stop],
                verbose=1,
            )
            self.training_history = history

            # 5. Evaluate on test set
            predictions_scaled = self.model.predict(X_test)
            predictions = self.scaler.inverse_transform(predictions_scaled)
            actuals = self.scaler.inverse_transform(y_test.reshape(-1, 1))

            metrics = calculate_metrics(actuals, predictions)

            # 6. Save model and scaler
            self.save_model()

            # Build response
            training_history = {
                "loss": [float(v) for v in history.history.get("loss", [])],
                "val_loss": [
                    float(v) for v in history.history.get("val_loss", [])
                ],
                "mae": [float(v) for v in history.history.get("mae", [])],
                "val_mae": [
                    float(v) for v in history.history.get("val_mae", [])
                ],
            }

            result: Dict[str, Any] = {
                "symbol": self.symbol,
                "metrics": metrics,
                "training_history": training_history,
                "training_info": {
                    "epochs_completed": len(history.history.get("loss", [])),
                    "epochs_requested": epochs,
                    "sequence_length": self.sequence_length,
                    "features_used": ["Close"],
                    "batch_size": batch_size,
                },
                "data_points": {
                    "total": len(data),
                    "training": len(X_train),
                    "testing": len(X_test),
                },
            }

            logger.info(
                "Training complete for %s. Metrics: %s",
                self.symbol,
                metrics,
            )
            return result

        except Exception as exc:
            logger.error("Training failed for %s: %s", self.symbol, exc)
            raise RuntimeError(
                f"Model training failed for {self.symbol}: {exc}"
            ) from exc

    # ------------------------------------------------------------------
    # Prediction
    # ------------------------------------------------------------------

    def predict_future(self, days: int = Config.DEFAULT_PREDICTION_DAYS) -> Dict[str, Any]:
        """Predict the next *days* closing prices iteratively.

        If no saved model exists for the symbol the model is trained first.

        Args:
            days: Number of future business days to predict.

        Returns:
            Dictionary with ``predictions``, ``model_metrics``,
            ``historical`` prices, and ``training_info``.
        """
        try:
            # Ensure model and scaler are available
            if self.model is None:
                loaded = self.load_model()
                if not loaded:
                    logger.info(
                        "No saved model for %s. Training now...",
                        self.symbol,
                    )
                    train_result = self.train()
                    metrics = train_result["metrics"]
                    training_info = train_result["training_info"]
                else:
                    metrics = {"mse": 0, "rmse": 0, "mae": 0, "r2_score": 0}
                    training_info = {
                        "epochs_completed": "loaded_from_disk",
                        "sequence_length": self.sequence_length,
                        "features_used": ["Close"],
                    }
            else:
                metrics = {"mse": 0, "rmse": 0, "mae": 0, "r2_score": 0}
                training_info = {
                    "epochs_completed": "already_in_memory",
                    "sequence_length": self.sequence_length,
                    "features_used": ["Close"],
                }

            # Fetch latest data for the prediction seed
            data = self.fetch_data()
            close_prices = data["Close"].values.reshape(-1, 1)
            scaled_data = self.scaler.transform(close_prices)

            # Seed: last sequence_length points
            current_sequence = scaled_data[-self.sequence_length :].tolist()

            predictions_scaled: List[float] = []
            for _ in range(days):
                input_seq = np.array(current_sequence[-self.sequence_length :])
                input_seq = input_seq.reshape(1, self.sequence_length, 1)
                pred = self.model.predict(input_seq, verbose=0)
                predicted_val = float(pred[0, 0])
                predictions_scaled.append(predicted_val)
                current_sequence.append([predicted_val])

            # Inverse-transform predictions
            predictions_arr = np.array(predictions_scaled).reshape(-1, 1)
            predictions_actual = self.scaler.inverse_transform(predictions_arr).flatten()

            # Format with dates
            last_date = data.index[-1].to_pydatetime() if hasattr(
                data.index[-1], "to_pydatetime"
            ) else datetime.now()
            formatted_predictions = format_predictions(
                predictions_actual, start_date=last_date + pd.Timedelta(days=1)
            )

            # Historical data (last 90 days)
            hist_days = min(90, len(data))
            historical = [
                {
                    "date": idx.strftime("%Y-%m-%d")
                    if hasattr(idx, "strftime")
                    else str(idx),
                    "actual_price": round(float(row["Close"]), 2),
                }
                for idx, row in data.tail(hist_days).iterrows()
            ]

            # Compute quick test-set metrics if we have enough data
            if len(close_prices) > self.sequence_length + 20:
                _, X_test, _, y_test = self.prepare_data(data)
                if len(X_test) > 0:
                    test_pred = self.model.predict(X_test, verbose=0)
                    test_pred_inv = self.scaler.inverse_transform(test_pred)
                    test_actual_inv = self.scaler.inverse_transform(
                        y_test.reshape(-1, 1)
                    )
                    metrics = calculate_metrics(test_actual_inv, test_pred_inv)

            return {
                "symbol": self.symbol,
                "predictions": formatted_predictions,
                "model_metrics": metrics,
                "historical": historical,
                "training_info": training_info,
            }

        except Exception as exc:
            logger.error(
                "Prediction failed for %s: %s", self.symbol, exc
            )
            raise RuntimeError(
                f"Prediction failed for {self.symbol}: {exc}"
            ) from exc

    # ------------------------------------------------------------------
    # Comparison (actual vs predicted)
    # ------------------------------------------------------------------

    def get_comparison(self, days: int = 90) -> Dict[str, Any]:
        """Compare actual vs model-predicted prices over the last *days*.

        Useful for evaluating model accuracy on recent historical data.

        Args:
            days: Number of recent trading days to include.

        Returns:
            Dictionary with ``comparison`` list and ``metrics``.
        """
        try:
            # Ensure model is loaded
            if self.model is None:
                loaded = self.load_model()
                if not loaded:
                    logger.info(
                        "No model for %s. Training first...", self.symbol
                    )
                    self.train()

            data = self.fetch_data()
            close_prices = data["Close"].values.reshape(-1, 1)
            scaled_data = self.scaler.transform(close_prices)

            # We need at least sequence_length + days data points
            available = len(scaled_data) - self.sequence_length
            compare_days = min(days, available)

            if compare_days <= 0:
                return {
                    "symbol": self.symbol,
                    "comparison": [],
                    "metrics": {},
                    "message": "Insufficient data for comparison.",
                }

            start_idx = len(scaled_data) - compare_days
            actuals: List[float] = []
            preds: List[float] = []
            dates: List[str] = []

            for i in range(start_idx, len(scaled_data)):
                seq = scaled_data[i - self.sequence_length : i]
                seq = seq.reshape(1, self.sequence_length, 1)
                pred = self.model.predict(seq, verbose=0)
                pred_price = self.scaler.inverse_transform(pred)[0, 0]
                actual_price = close_prices[i, 0]

                preds.append(float(pred_price))
                actuals.append(float(actual_price))

                idx = data.index[i]
                date_str = (
                    idx.strftime("%Y-%m-%d")
                    if hasattr(idx, "strftime")
                    else str(idx)
                )
                dates.append(date_str)

            metrics = calculate_metrics(np.array(actuals), np.array(preds))

            comparison = [
                {
                    "date": d,
                    "actual_price": round(a, 2),
                    "predicted_price": round(p, 2),
                    "difference": round(a - p, 2),
                    "percent_error": round(abs(a - p) / a * 100, 2) if a != 0 else 0.0,
                }
                for d, a, p in zip(dates, actuals, preds)
            ]

            return {
                "symbol": self.symbol,
                "comparison": comparison,
                "metrics": metrics,
                "days_compared": len(comparison),
            }

        except Exception as exc:
            logger.error(
                "Comparison failed for %s: %s", self.symbol, exc
            )
            raise RuntimeError(
                f"Comparison failed for {self.symbol}: {exc}"
            ) from exc

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------

    def load_model(self) -> bool:
        """Load a previously saved Keras model and scaler from disk.

        Returns:
            ``True`` if both model and scaler were loaded successfully,
            ``False`` otherwise.
        """
        try:
            if not os.path.exists(self.model_path) or not os.path.exists(
                self.scaler_path
            ):
                logger.info(
                    "No saved model/scaler found for %s.", self.symbol
                )
                return False

            try:
                from tensorflow.keras.models import load_model as keras_load
            except ImportError:
                from keras.models import load_model as keras_load

            self.model = keras_load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)

            logger.info("Loaded model and scaler for %s.", self.symbol)
            return True

        except Exception as exc:
            logger.error(
                "Failed to load model for %s: %s", self.symbol, exc
            )
            return False

    def save_model(self) -> bool:
        """Save the current Keras model and fitted scaler to disk.

        Returns:
            ``True`` on success, ``False`` otherwise.
        """
        try:
            if self.model is None:
                logger.warning("No model to save for %s.", self.symbol)
                return False

            os.makedirs(Config.MODEL_DIR, exist_ok=True)
            self.model.save(self.model_path)
            joblib.dump(self.scaler, self.scaler_path)

            logger.info(
                "Saved model to %s and scaler to %s.",
                self.model_path,
                self.scaler_path,
            )
            return True

        except Exception as exc:
            logger.error(
                "Failed to save model for %s: %s", self.symbol, exc
            )
            return False
