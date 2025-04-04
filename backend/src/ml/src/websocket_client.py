import websocket
import json
import threading
import time
from config import config

class BinanceWebSocket:
    def __init__(self, timeframe: str):
        self.timeframe = timeframe
        self.ws = None
        self.active = False
        self.subscriptions = set()
        self._connect()  # Автоподключение при инициализации

    def _connect(self):
        """Инициализация соединения"""
        self.ws = websocket.WebSocketApp(
            "wss://stream.binance.com:9443/ws",
            on_message=self._on_message,
            on_error=self._on_error,
            on_close=self._on_close
        )
        self.active = True
        threading.Thread(target=self.ws.run_forever, daemon=True).start()
        time.sleep(1)  # Пауза для инициализации

    def subscribe(self, symbol: str):
        """Подписка на поток данных"""
        stream = f"{symbol.lower()}@kline_{self.timeframe}"
        if stream not in self.subscriptions:
            self.subscriptions.add(stream)
            self.ws.send(json.dumps({
                "method": "SUBSCRIBE",
                "params": [stream],
                "id": 1
            }))

    def _on_message(self, ws, message):
        """Обработка данных"""
        data = json.loads(message)
        if 'k' in data:
            print(f"[WS] {data['s']} {data['k']['i']}: {data['k']['c']}")

    def _on_error(self, ws, error):
        print(f"WebSocket error: {str(error)}")

    def _on_close(self, ws, close_status_code, close_msg):
        print("WebSocket connection closed")
        self.active = False