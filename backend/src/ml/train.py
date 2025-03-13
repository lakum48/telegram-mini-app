from src.data_collector import DataCollector
from src.feature_engineer import FeatureEngineer
from src.model_trainer import ModelTrainer

def train_models():
    print("Собираем данные для обучения...")
    collector = DataCollector()
    raw_data = collector.collect_data(days=30)  # 30 дней данных
    
    print("\nГенерация фичей...")
    engineer = FeatureEngineer()
    featured_data = engineer.add_features(raw_data)
    
    print("\nОбучение моделей...")
    trainer = ModelTrainer()
    trainer.train(featured_data)
    
    print("\nМодели успешно обучены и сохранены в models/multi_coin_models.pkl")

if __name__ == "__main__":
    train_models()