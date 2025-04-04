from src.data_collector import DataCollector
from src.feature_engineer import FeatureEngineer
from src.model_trainer import ModelTrainer
from config import config
import pandas as pd

def train():
    print("🚀 Запуск обучения модели...")
    
    # Инициализация компонентов
    collector = DataCollector()
    engineer = FeatureEngineer()
    trainer = ModelTrainer()
    
    # Сбор данных
    print("\nЭтап 1/3: Сбор данных...")
    data = collector.collect_data(timeframe='1h', limit=500)
    
    if data.empty:
        raise ValueError("Не удалось собрать данные")
    
    # Генерация признаков
    print("\nЭтап 2/3: Генерация признаков...")
    featured_data = engineer.add_features(data)
    
    # Обучение моделей
    print("\nЭтап 3/3: Обучение моделей...")
    trainer.train(featured_data)
    
    print("\nОбучение завершено успешно!")

if __name__ == "__main__":
    train()