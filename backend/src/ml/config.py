import ccxt
from pathlib import Path

class Config:
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {'defaultType': 'spot'}
        })
        
        # Параметры временных интервалов
        self.TIMEFRAME_SETTINGS = {
            '1m': {'interval': 60, 'max_files': 240},
            '3m': {'interval': 180, 'max_files': 80},
            '5m': {'interval': 300, 'max_files': 48},
            '15m': {'interval': 900, 'max_files': 48},
            '30m': {'interval': 1800, 'max_files': 48},
            '1h': {'interval': 3600, 'max_files': 48},
            '4h': {'interval': 14400, 'max_files': 48},
            '1d': {'interval': 86400, 'max_files': 42},
            '1w': {'interval': 604800, 'max_files': 7}
        }
        
        # Фичи и целевая переменная
        self.FEATURES = ['close', 'volume', 'rsi', 'sma_20', 'ema_50', 'macd']
        self.TARGET = 'target'
        self.TEST_SIZE = 0.2
        self.RANDOM_STATE = 42
        
        # Параметры модели
        self.MODEL_PARAMS = {
            'n_estimators': 50,  # Уменьшим число деревьев
            'max_depth': 3,       # Упростим модель
            'learning_rate': 0.1,
            'n_jobs': -1,
            'verbose': 1
        }
        
        # Пути
        self.MODEL_PATH = Path("models/crypto_models.pkl").absolute()
        self.MODEL_PATH.parent.mkdir(exist_ok=True)  # Создаем папку при инициализации
        self.PREDICTIONS_DIR = "predictions"
        self.COINS = self._load_top_coins()
        self.HISTORY_LIMIT = 1000
        self.MIN_SAMPLES = 10  # Минимальное количество наблюдений
        self.MODEL_MIN_ACCURACY = 0.48  # Снизим порог точности

    def _load_top_coins(self):
        """Загрузка топ-100 пар с фильтрацией"""
        try:
            markets = self.exchange.fetch_tickers()
            return [
                symbol for symbol in markets
                if symbol.endswith('/USDT') 
                and markets[symbol].get('quoteVolume', 0) > 5_000_000  # Более либеральный фильтр
            ][:100]  # Явно задаем нужное количество
            
        except Exception as e:
            print(f"Ошибка: {str(e)}")
            return []

config = Config()