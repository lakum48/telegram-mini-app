import ccxt

class Config:
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {
                'adjustForTimeDifference': True
            }
        })
        self.base_currency = 'USDT'
        self.FEATURES = [
            'open', 'high', 'low', 'close', 'volume', 
            'rsi', 'sma_20', 'ema_50', 'macd'
        ]
        self.TARGET = 'target'
        self.TEST_SIZE = 0.2
        self.RANDOM_STATE = 42

    @property
    def coins(self):
        markets = self.exchange.load_markets()
        return [
            symbol for symbol in markets 
            if symbol.endswith(f'/{self.base_currency}') 
            and markets[symbol]['active']
        ][:50]  # Топ-50 монет

config = Config()