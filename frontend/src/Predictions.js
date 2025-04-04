import React, { useState } from 'react';
import './Predictions.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Predictions() {
  const [inputs, setInputs] = useState({
    refreshInterval: '5 мин',
    timePeriod: '1 месяц',
    historicalData: '6 месяцев'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Отправляем данные на сервер
      const response = await fetch('https://195.133.48.208/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_interval: inputs.refreshInterval,
          time_period: inputs.timePeriod,
          historical_data: inputs.historicalData
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      
      const data = await response.json();
      setPredictionData(data);
      
    } catch (err) {
      setError(err.message);
      console.error('Ошибка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Подготовка данных для графика
  const chartData = {
    labels: predictionData?.dates || [],
    datasets: [
      {
        label: 'Прогноз цены',
        data: predictionData?.prices || [],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Прогноз стоимости криптовалюты',
        color: '#000000'
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#000000'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#000000'
        }
      }
    }
  };

  return (
    <div className="predictions-container">
      <h2 className="predictions-title">Анализ криптовалют</h2>
      
      <form onSubmit={handleSubmit} className="predictions-form">
        <div>
          <label className="predictions-label">
            Время обновления графика:
          </label>
          <select
            name="refreshInterval"
            value={inputs.refreshInterval}
            onChange={handleInputChange}
            className="predictions-input"
          >
            <option value="1 мин">1 минута</option>
            <option value="5 мин">5 минут</option>
            <option value="15 мин">15 минут</option>
            <option value="1 час">1 час</option>
          </select>
        </div>
        
        <div>
          <label className="predictions-label">
            Временной период прогноза:
          </label>
          <select
            name="timePeriod"
            value={inputs.timePeriod}
            onChange={handleInputChange}
            className="predictions-input"
          >
            <option value="1 день">1 день</option>
            <option value="1 неделя">1 неделя</option>
            <option value="1 месяц">1 месяц</option>
            <option value="3 месяца">3 месяца</option>
          </select>
        </div>
        
        <div>
          <label className="predictions-label">
            Исторические данные:
          </label>
          <select
            name="historicalData"
            value={inputs.historicalData}
            onChange={handleInputChange}
            className="predictions-input"
          >
            <option value="1 месяц">1 месяц</option>
            <option value="3 месяца">3 месяца</option>
            <option value="6 месяцев">6 месяцев</option>
            <option value="1 год">1 год</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="predictions-button"
          disabled={isLoading}
        >
          {isLoading ? 'Анализ...' : 'Получить прогноз'}
        </button>
      </form>
      
      {isLoading && <p className="predictions-loading">Загрузка данных...</p>}
      
      {error && (
        <div className="predictions-error">
          <h3>Ошибка:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {predictionData && (
        <div className="predictions-results">
          <div className="predictions-chart">
            <Line data={chartData} options={options} />
          </div>
          
          <div className="predictions-analysis">
            <h3 className="predictions-output-title">Аналитический отчет:</h3>
            <div className="predictions-metrics">
              <div className="predictions-metric">
                <span>Текущая цена:</span>
                <strong>${predictionData.current_price?.toFixed(2) || 'N/A'}</strong>
              </div>
              <div className="predictions-metric">
                <span>Прогноз через {inputs.timePeriod}:</span>
                <strong>${predictionData.predicted_price?.toFixed(2) || 'N/A'}</strong>
              </div>
              <div className="predictions-metric">
                <span>Вероятность роста:</span>
                <strong>{predictionData.probability_up?.toFixed(2) || 'N/A'}%</strong>
              </div>
            </div>
            
            <div className="predictions-recommendations">
              <h4>Рекомендации:</h4>
              <p>{predictionData.recommendation || 'Нет данных для рекомендаций'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Predictions;