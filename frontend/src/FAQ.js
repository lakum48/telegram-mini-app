import React, { useState, useEffect } from 'react';
import './FAQ.css';

function FAQ() {
  // Состояние для отслеживания открытых вопросов
  const [openQuestion, setOpenQuestion] = useState(null);

  // Функция для обработки нажатия на стрелочку
  const toggleQuestion = (index) => {
    if (openQuestion === index) {
      // Если вопрос уже открыт, закрываем его
      setOpenQuestion(null);
    } else {
      // Иначе открываем новый вопрос
      setOpenQuestion(index);
    }
  };

  // Данные для вопросов и ответов
  const faqData = [
    {
      question: 'Как пользоваться ботом?',
      answer: 'Просто выберите нужный раздел в меню и следуйте инструкциям.',
    },
    {
      question: 'Как я могу обратиться в поддержку?',
      answer: 'Напишите нам в поддержку через Telegram: @Baskaev_Daniel',
    },
    {
      question: 'Как обновить данные?',
      answer: 'Данные обновляются автоматически каждые 5 минут.',
    },
    {
      question: 'Каки монеты я могу отследить?',
      answer: 'Вы можете отследить и посмотреть новости по любым монетам',
    },
  ];

  // Символы для анимации
  const characters = ['@', '#', '$', '%', '&', '*', '!', '+', '.', ',', ':', ';'];

  // Состояние для анимации
  const [animatedText, setAnimatedText] = useState(generateRandomText());

  // Функция для генерации случайного текста
  function generateRandomText() {
    const rows = 5; // Количество строк
    const cols = 30; // Длина каждой строки
    let randomText = '';
    for (let i = 0; i < rows; i++) {
      let row = '';
      for (let j = 0; j < cols; j++) {
        row += characters[Math.floor(Math.random() * characters.length)];
      }
      randomText += row + '\n';
    }
    return randomText;
  }

  // Функция для обновления текста анимации
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedText(generateRandomText());
    }, 100); // Обновление текста каждую сотую долю секунды

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  return (
    <div>
      <h2>Часто задаваемые вопросы</h2>
      <div className="faq-container">
        {/* Динамичные строки с ASCII символами */}
        <pre style={{ fontFamily: 'monospace', color: '#000', whiteSpace: 'pre-wrap' }}>
          {animatedText}
        </pre>

        {/* Вопросы и ответы */}
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleQuestion(index)}
            >
              {item.question}
              <span className={`faq-icon ${openQuestion === index ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <div className={`faq-answer ${openQuestion === index ? 'open' : ''}`}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
