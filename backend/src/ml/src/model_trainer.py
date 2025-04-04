# model_trainer.py
import joblib
from lightgbm import LGBMClassifier
from sklearn.base import clone
import numpy as np
from tqdm import tqdm
from config import config
from datetime import datetime

class ModelTrainer:
    def __init__(self):
        self.models = {}
        self.base_model = LGBMClassifier(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            n_jobs=-1,
            random_state=42
        )

    def train(self, featured_data):
        """Исправленное обучение с сохранением метаданных"""
        try:
            # Проверка наличия целевой переменной
            if config.TARGET not in featured_data.columns:
                raise ValueError(f"Отсутствует целевая переменная '{config.TARGET}'")
            
            # Группировка по символам
            symbols = featured_data['symbol'].unique()
            print(f"Начало обучения для {len(symbols)} монет")
            
            for symbol in tqdm(symbols, desc="Обучение моделей"):
                symbol_data = featured_data[featured_data['symbol'] == symbol]
                
                # Проверка минимального объема данных
                if len(symbol_data) < 100:
                    continue
                
                # Подготовка данных
                X = symbol_data[config.FEATURES]
                y = symbol_data[config.TARGET]
                
                # Обучение модели
                model = clone(self.base_model)
                model.fit(X, y)
                
                # Сохранение модели
                self.models[symbol] = {
                    'model': model,
                    'features': config.FEATURES,
                    'last_trained': datetime.now()
                }

            # Сохранение с проверкой структуры
            if self.models:
                joblib.dump(
                    {
                        'models': self.models,
                        'metadata': {
                            'features': config.FEATURES,
                            'target': config.TARGET,
                            'version': datetime.now().strftime("%Y%m%d")
                        }
                    },
                    config.MODEL_PATH
                )
                print(f"✅ Модели успешно сохранены: {len(self.models)} монет")
            else:
                raise ValueError("Не удалось обучить ни одну модель")
                
        except Exception as e:
            print(f"❌ Критическая ошибка обучения: {str(e)}")
            raise