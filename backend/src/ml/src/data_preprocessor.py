from config import config
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class DataPreprocessor:
    def __init__(self):
        self.scalers = {}
        self.min_samples = 50  # Минимум 50 наблюдений
        
    def prepare(self, df):
        processed = {}
        for symbol in df['symbol'].unique():
            symbol_df = df[df['symbol'] == symbol].copy()
            
            if len(symbol_df) < self.min_samples:
                logger.warning(f"Пропуск {symbol}: недостаточно данных ({len(symbol_df)} samples)")
                continue
                
            try:
                # Генерация целевой переменной
                symbol_df[config.TARGET] = (symbol_df['close'].shift(-1) > symbol_df['close']).astype(int)
                
                # Удаление последней строки с NaN
                symbol_df = symbol_df.iloc[:-1]
                
                # Разделение данных
                X = symbol_df[config.FEATURES]
                y = symbol_df[config.TARGET]
                
                if len(X) < self.min_samples:
                    continue
                    
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y,
                    test_size=config.TEST_SIZE,
                    shuffle=False,
                    random_state=config.RANDOM_STATE
                )
                
                # Нормализация
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                
                processed[symbol] = {
                    'X_train': X_train_scaled,
                    'X_test': X_test_scaled,
                    'y_train': y_train,
                    'y_test': y_test,
                    'scaler': scaler
                }
                
            except Exception as e:
                logger.error(f"Ошибка обработки {symbol}: {str(e)}")
                continue
                
        return processed