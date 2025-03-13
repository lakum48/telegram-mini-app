import joblib
import numpy as np
from lightgbm import LGBMClassifier
from sklearn.metrics import accuracy_score
from sklearn.base import clone
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import logging
from config import config  # Добавьте этот импорт

logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self):
        self.base_model = LGBMClassifier(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            n_jobs=4,
            random_state=42
        )
        self.models = {}

    def train(self, featured_data):
        """Обучение моделей для каждой монеты"""
        if featured_data.empty:
            raise ValueError("Нет данных для обучения")
        
        for symbol in featured_data['symbol'].unique():
            try:
                # Фильтруем данные для текущей монеты
                symbol_data = featured_data[featured_data['symbol'] == symbol].copy()
                
                # Генерация целевой переменной
                symbol_data.loc[:, 'target'] = (symbol_data['close'].shift(-1) > symbol_data['close']).astype(int)
                symbol_data = symbol_data.dropna()
                
                if len(symbol_data) < 50:  # Минимум 50 наблюдений
                    logger.warning(f"Пропуск {symbol}: недостаточно данных")
                    continue
                
                # Разделение данных
                X = symbol_data[config.FEATURES]
                y = symbol_data['target']
                
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
                
                # Обучение модели
                model = clone(self.base_model)
                model.fit(X_train_scaled, y_train)
                
                # Валидация
                preds = model.predict(X_test_scaled)
                acc = accuracy_score(y_test, preds)
                print(f"{symbol} | Accuracy: {acc:.2%} | Samples: {len(X_train)}")
                
                # Сохранение модели и scaler
                self.models[symbol] = {
                    'model': model,
                    'scaler': scaler
                }
                
            except Exception as e:
                logger.error(f"Ошибка обучения {symbol}: {str(e)}")
                continue
        
        # Сохранение всех моделей
        if self.models:
            joblib.dump(self.models, 'models/multi_coin_models.pkl')
        else:
            raise ValueError("Не удалось обучить ни одну модель")