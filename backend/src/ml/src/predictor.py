import json
import joblib
import pandas as pd
from datetime import datetime
from pathlib import Path
import threading
import time
from tqdm import tqdm
from config import config
from .data_collector import DataCollector
from .feature_engineer import FeatureEngineer

class Predictor:
    def __init__(self, timeframe: str):
        # Инициализация основных параметров
        self.timeframe = timeframe
        self.settings = config.TIMEFRAME_SETTINGS.get(self.timeframe, {})
        
        # Инициализация компонентов данных
        self.collector = DataCollector()
        self.engineer = FeatureEngineer()
        
        # Настройка путей сохранения
        self.save_dir = Path(config.PREDICTIONS_DIR) / self.timeframe
        self.save_dir.mkdir(parents=True, exist_ok=True)
        
        # Загрузка модели
        self.models = {}
        self.feature_order = []
        self._load_models()
        
        print(f"✅ Инициализация Predictor для {self.timeframe} завершена")
        print(f"🔢 Загружено моделей: {len(self.models)}")
        print(f"📊 Фичи: {self.feature_order[:5]}...")

    def _load_models(self):
        """Правильная загрузка моделей"""
        try:
            model_data = joblib.load(config.MODEL_PATH)
            self.models = model_data['models']  # Доступ к словарю моделей
            self.feature_order = model_data['metadata']['features']
        except Exception as e:
            print(f"Ошибка загрузки моделей: {str(e)}")
            self.models = {}

    def _process_symbol(self, symbol: str, data: pd.DataFrame) -> dict:
        """Исправленный метод обработки символа"""
        try:
            if symbol not in self.models:
                return None
                
            # Извлекаем модель из словаря
            model_info = self.models[symbol]
            model = model_info['model']  # Получаем объект модели
            
            symbol_data = data[data['symbol'] == symbol]
            
            if symbol_data.empty:
                return None
                
            # Проверка фичей
            X = symbol_data[self.feature_order]
            if X.empty:
                return None
                
            # Прогнозирование
            prediction = model.predict(X)[-1]
            proba = model.predict_proba(X)[-1].max()
            
            return {
                'symbol': symbol,
                'decision': 'BUY' if prediction == 1 else 'SELL',
                'confidence': round(float(proba), 4),
                'price': symbol_data['close'].iloc[-1]
            }
        except Exception as e:
            print(f"Ошибка обработки {symbol}: {str(e)}")
            return None

    def run_forever(self):
        """Основной цикл выполнения"""
        print(f"🚀 Запуск прогнозирования для {self.timeframe}")
        while True:
            try:
                start_time = time.time()
                
                # Сбор данных
                raw_data = self.collector.collect_data(self.timeframe, 100)
                if raw_data.empty:
                    print(f"⏳ Нет данных для {self.timeframe}")
                    time.sleep(10)
                    continue
                
                # Генерация признаков
                featured_data = self.engineer.add_features(raw_data)
                if featured_data.empty:
                    print(f"⏳ Нет признаков для {self.timeframe}")
                    time.sleep(10)
                    continue
                
                # Генерация прогнозов
                predictions = []
                for symbol in featured_data['symbol'].unique():
                    result = self._process_symbol(symbol, featured_data)
                    if result:
                        predictions.append(result)
                
                # Сохранение результатов
                if predictions:
                    self._save_predictions(predictions)
                    print(f"✅ Успешных прогнозов: {len(predictions)}")
                else:
                    print("⚠️ Нет валидных прогнозов")
                
                # Подсчет времени выполнения
                elapsed = time.time() - start_time
                sleep_time = max(0, self.settings.get('interval', 60) - elapsed)
                time.sleep(sleep_time)
                
            except Exception as e:
                print(f"❌ Критическая ошибка цикла: {str(e)}")
                time.sleep(30)

    def _save_predictions(self, predictions: list):
        """Сохранение прогнозов в файл"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = self.save_dir / f"predictions_{timestamp}.json"
            
            output = {
                "timeframe": self.timeframe,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "predictions": predictions
            }
            
            with open(filename, 'w') as f:
                json.dump(output, f, indent=2)
                
            print(f"💾 Сохранено в {filename}")
            
        except Exception as e:
            print(f"❌ Ошибка сохранения: {str(e)}")

if __name__ == "__main__":
    # Пример использования
    predictor = Predictor('1h')
    predictor.run_forever()