import React, { useState } from 'react';

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
      question: 'Где я могу получить поддержку?',
      answer: 'Напишите нам в поддержку через Telegram: @support.',
    },
    {
      question: 'Как обновить данные?',
      answer: 'Данные обновляются автоматически каждые 5 минут.',
    },
  ];

  return (
    <div>
      <h2>Часто задаваемые вопросы</h2>
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
  );
}

export default FAQ;