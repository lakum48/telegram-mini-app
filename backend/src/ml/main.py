from src.data_collector import DataCollector
from src.feature_engineer import FeatureEngineer
from src.predictor import CryptoPredictor

def get_timeframe():
    print("Выберите таймфрейм:")
    print("1. 1 час")
    print("2. 1 день")
    print("3. 1 неделя")
    print("4. 1 месяц")
    choice = input("Ваш выбор (1-4): ")
    
    timeframe_map = {
        '1': {'timeframe': '1h', 'limit': 100, 'name': '1 час'},
        '2': {'timeframe': '1d', 'limit': 100, 'name': '1 день'},
        '3': {'timeframe': '1w', 'limit': 100, 'name': '1 неделя'},
        '4': {'timeframe': '1M', 'limit': 100, 'name': '1 месяц'}
    }
    
    return timeframe_map.get(choice, timeframe_map['1'])

def main():
    # Выбор таймфрейма
    timeframe = get_timeframe()
    print(f"\nНачинаем анализ для таймфрейма: {timeframe['name']}")
    
    # Сбор данных
    print("\nСобираем данные...")
    collector = DataCollector()
    raw_data = collector.collect_data(
        timeframe=timeframe['timeframe'],
        limit=timeframe['limit']
    )
    
    if raw_data.empty:
        print("Ошибка: Не удалось собрать данные")
        return
    
    # Генерация фичей
    print("\nГенерация фичей...")
    engineer = FeatureEngineer()
    featured_data = engineer.add_features(raw_data)
    
    if featured_data.empty:
        print("Ошибка: Не удалось сгенерировать фичи")
        return
    
    # Прогноз
    print("\nДелаем прогноз...")
    predictor = CryptoPredictor()
    predictions = predictor.predict(featured_data)
    
    # Вывод результатов
    print("\nРезультаты прогноза:")
    for symbol, pred in predictions.items():
        print(f"{symbol}: {pred['decision']} (Вероятность роста: {pred['probability_up']:.2%})")

if __name__ == "__main__":
    main()