document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/api/cryptos');
    const cryptos = await response.json();
  
    const cryptoList = document.getElementById('crypto-list');
    cryptos.forEach((crypto) => {
      const li = document.createElement('li');
      li.textContent = `${crypto.name}: $${crypto.price}`;
      cryptoList.appendChild(li);
    });
  
    const predictButton = document.getElementById('predict-button');
    predictButton.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [1, 2, 3] }), // Пример данных для прогноза
      });
      const result = await response.json();
      alert(`Prediction: ${result.prediction}`);
    });
  });