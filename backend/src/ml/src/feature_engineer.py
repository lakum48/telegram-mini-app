import numpy as np
import pandas as pd
from tqdm import tqdm
from config import config

class FeatureEngineer:
    @staticmethod
    def _calculate_rsi(series, window=14):
        """Векторизованный расчет RSI"""
        delta = series.diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        avg_gain = gain.rolling(window, min_periods=1).mean()
        avg_loss = loss.rolling(window, min_periods=1).mean()
        
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    def add_features(self, df):
        """Генерация признаков и целевой переменной"""
        if df.empty:
            return df
            
        # Генерация фичей
        df['rsi'] = self._calculate_rsi(df['close'])
        df['sma_20'] = df.groupby('symbol')['close'].rolling(20).mean().values
        df['ema_50'] = df.groupby('symbol')['close'].ewm(span=50).mean().values
        df['macd'] = df.groupby('symbol')['close'].ewm(span=12).mean().values - \
                    df.groupby('symbol')['close'].ewm(span=26).mean().values
        
        # Создание целевой переменной
        df['target'] = (df.groupby('symbol')['close'].shift(-1) > df['close']).astype(int)
        
        # Очистка данных
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.dropna().reset_index(drop=True)
        
        print("\nПроверка данных после генерации признаков:")
        print(f"Строки: {len(df)}")
        print("Пример данных:")
        print(df[['symbol', 'close', 'target'] + config.FEATURES].head(3))
        print(f"Пропуски: {df.isnull().sum().sum()}")
        return df