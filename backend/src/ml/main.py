from config import config
from src.predictor import Predictor
import threading
import time

def main():
    print("🚀 Запуск системы прогнозирования криптовалют")
    print("=" * 50)
    print(f"Отслеживаемые пары: {len(config.COINS)}")
    print("Примеры:", ', '.join(config.COINS[:5]))
    
    # Проверка модели
    if not config.MODEL_PATH.exists():
        print("❌ Модель не найдена! Сначала выполните train.py")
        return
    
    # Запуск прогнозирования
    predictors = []
    for tf in config.TIMEFRAME_SETTINGS:
        try:
            predictor = Predictor(tf)
            thread = threading.Thread(target=predictor.run_forever, daemon=True)
            thread.start()
            predictors.append(thread)
            print(f"✅ {tf} прогнозирование запущено")
        except Exception as e:
            print(f"❌ Ошибка {tf}: {str(e)}")
    
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        print("\nЗавершение работы...")

if __name__ == "__main__":
    main()