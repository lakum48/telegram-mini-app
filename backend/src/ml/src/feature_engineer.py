import numpy as np
import pandas as pd
from tqdm import tqdm

class FeatureEngineer:
    def _calculate_rsi(self, series, window=14):
        delta = series.diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window, min_periods=1).mean()  # min_periods=1
        avg_loss = loss.rolling(window, min_periods=1).mean()  # min_periods=1
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    def add_features(self, df):
        if df.empty:
            print("Предупреждение: Пустой DataFrame на входе")
            return pd.DataFrame()
        
        features = []
        for symbol in tqdm(df['symbol'].unique(), desc="Обработка монет"):
            coin_df = df[df['symbol'] == symbol].copy()
            
            # Проверка минимального количества данных
            if len(coin_df) < 20:  # Минимум 20 строк для расчета индикаторов
                print(f"Предупреждение: Недостаточно данных для {symbol} ({len(coin_df)} строк)")
                continue
            
            # Технические индикаторы
            coin_df['rsi'] = self._calculate_rsi(coin_df['close'])
            coin_df['sma_20'] = coin_df['close'].rolling(20, min_periods=1).mean()
            coin_df['ema_50'] = coin_df['close'].ewm(span=50, min_periods=1).mean()
            coin_df['macd'] = coin_df['close'].ewm(span=12, min_periods=1).mean() - coin_df['close'].ewm(span=26, min_periods=1).mean()
            
            # Очистка данных
            coin_df.replace([np.inf, -np.inf], np.nan, inplace=True)
            coin_df.dropna(inplace=True)
            
            if not coin_df.empty:
                features.append(coin_df)
            else:
                print(f"Предупреждение: Нет данных после очистки для {symbol}")
        
        if not features:
            print("Ошибка: Не удалось сгенерировать фичи ни для одной пары")
            return pd.DataFrame()
            
        return pd.concat(features)