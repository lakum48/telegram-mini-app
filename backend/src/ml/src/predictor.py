import joblib
import numpy as np
from config import config

class CryptoPredictor:
    def __init__(self):
        try:
            # Загрузка моделей
            self.models = joblib.load('models/multi_coin_models.pkl')
        except FileNotFoundError:
            raise Exception("Модели не найдены. Сначала обучите модели.")

    def predict(self, featured_data):
        """Основной метод для прогнозирования"""
        if featured_data.empty:
            raise ValueError("Нет данных для прогнозирования")
        
        predictions = {}
        for symbol, model_data in self.models.items():
            try:
                # Фильтруем данные для текущей монеты
                symbol_data = featured_data[featured_data['symbol'] == symbol]
                if symbol_data.empty:
                    print(f"Нет данных для {symbol}")
                    continue
                
                # Проверяем наличие всех фичей
                missing_features = set(config.FEATURES) - set(symbol_data.columns)
                if missing_features:
                    print(f"Отсутствуют фичи для {symbol}: {missing_features}")
                    continue
                
                # Нормализация и прогноз
                scaled = model_data['scaler'].transform(symbol_data[config.FEATURES])
                proba = model_data['model'].predict_proba(scaled)[:, 1]
                
                # Формируем результат
                predictions[symbol] = {
                    'probability_up': float(np.mean(proba)),
                    'decision': self._get_decision(np.mean(proba))
                }
            except Exception as e:
                print(f"Ошибка прогноза для {symbol}: {str(e)}")
                continue
                
        return predictions

    def _get_decision(self, probability):
        """Определяем решение на основе вероятности"""
        if probability > 0.55:
            return 'BUY'
        elif probability > 0.45:
            return 'HOLD'
        else:
            return 'SELL'