import React, { useState } from 'react';
import './FAQ.css';

function FAQ() {
  // Состояние для отслеживания открытых вопросов
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: 'Как пользоваться ботом?',
      answer: 'Просто выберите нужный раздел в меню и следуйте инструкциям.',
    },
    {
      question: 'Как обновить данные?',
      answer: 'Данные обновляются автоматически каждые 10 минут.',
    },
    {
      question: 'Как получать новости по криптовалютам?',
      answer: 'Просто зайдите в раздел "Новости", и все последние обновления будут доступны.',
    },
    {
      question: 'Как связаться с поддержкой?',
      answer: 'Напишите нашему оператору: @Baskaev_Daniel',
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-title">Часто задаваемые вопросы</h2>

      {faqData.map((item, index) => (
        <div key={index} className="faq-item">
          <div
            className="faq-question"
            onClick={() => toggleQuestion(index)}
          >
            {item.question}
          </div>
          <div className={`faq-answer ${openQuestion === index ? 'open' : ''}`}>
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
