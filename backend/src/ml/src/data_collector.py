import pandas as pd
from config import config
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
import time

class DataCollector:
    def __init__(self):
        self.exchange = config.exchange
        self.retry_count = 3
        self.delay = 1  # Задержка между попытками

    def fetch_ohlcv(self, symbol, timeframe='1h', limit=100):
        """Сбор данных для одной пары"""
        for i in range(self.retry_count):
            try:
                data = self.exchange.fetch_ohlcv(
                    symbol,
                    timeframe=timeframe,
                    limit=limit
                )
                if data:
                    df = pd.DataFrame(data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                    df['symbol'] = symbol
                    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
                    return df
            except Exception as e:
                print(f"Ошибка для {symbol}: {str(e)}")
                if i < self.retry_count - 1:
                    time.sleep(self.delay)
        return pd.DataFrame()

    def collect_data(self, timeframe='1h', limit=100):
        """Параллельный сбор данных"""
        all_data = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(self.fetch_ohlcv, symbol, timeframe, limit): symbol 
                      for symbol in config.coins}
            
            for future in futures:
                symbol = futures[future]
                try:
                    result = future.result()
                    if not result.empty:
                        all_data.append(result)
                        print(f"Собрано {len(result)} строк для {symbol}")
                    else:
                        print(f"Предупреждение: Нет данных для {symbol}")
                except Exception as e:
                    print(f"Ошибка сбора данных для {symbol}: {str(e)}")
        
        if not all_data:
            print("Ошибка: Не удалось собрать данные ни для одной пары")
            return pd.DataFrame()
            
        return pd.concat(all_data).reset_index(drop=True)