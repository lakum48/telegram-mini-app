import pandas as pd
import time
import ccxt
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
from config import config

class DataCollector:
    def __init__(self):
        self.exchange = config.exchange
        self.max_workers = 10  # Увеличенное число потоков
        self.request_delay = 0.1

    def fetch_ohlcv(self, symbol, timeframe, limit):
        """Оптимизированный запрос данных"""
        for attempt in range(3):
            try:
                data = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
                if not data:
                    return pd.DataFrame()
                    
                df = pd.DataFrame(data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                df['symbol'] = symbol
                df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
                return df
                
            except Exception as e:
                time.sleep(1)
        return pd.DataFrame()

    def collect_data(self, timeframe='1h', limit=None):
        """Сбор данных с повторными попытками"""
        limit = limit or config.HISTORY_LIMIT
        successful = 0
        
        with ThreadPoolExecutor(max_workers=15) as executor:  # Увеличили потоки
            futures = {executor.submit(
                self._fetch_with_retry,  # Новая функция с повторами
                symbol, 
                timeframe, 
                limit
            ): symbol for symbol in config.COINS}
            
            results = []
            for future in tqdm(as_completed(futures), total=len(futures)):
                if not future.result().empty:
                    successful += 1
                    results.append(future.result())
                    
        print(f"\n✅ Собрано данных для {successful}/{len(config.COINS)} монет")
        return pd.concat(results) if results else pd.DataFrame()

    def _fetch_with_retry(self, symbol, timeframe, limit, max_retries=5):
        """Повторные попытки с экспоненциальной задержкой"""
        for attempt in range(max_retries):
            try:
                data = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
                df = pd.DataFrame(data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                df['symbol'] = symbol
                return df
            except Exception as e:
                sleep_time = 2 ** attempt
                time.sleep(sleep_time)
        return pd.DataFrame()