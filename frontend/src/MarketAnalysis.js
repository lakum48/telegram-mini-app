import React, { useState, useEffect, useRef } from 'react';
import './MarketAnalysis.css';

function MarketAnalysis() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Пользователь');
  const messagesEndRef = useRef(null);
  const tgWebApp = useRef(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      tgWebApp.current = window.Telegram.WebApp;
      tgWebApp.current.expand();
      tgWebApp.current.enableClosingConfirmation();
      setUsername(tgWebApp.current.initDataUnsafe?.user?.username || 'Пользователь');
      
      // Отключаем автоматическое изменение размера
      tgWebApp.current.onEvent('viewportChanged', () => {
        tgWebApp.current.expand();
      });
    }
  }, []);

  // Начальное сообщение только от поддержки
  const initialMessages = [
    { 
      id: 1, 
      text: 'Здравствуйте! Чем могу помочь?', 
      sender: 'support',
      username: 'Cube'
    },
  ];

  // Инициализация чата
  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Добавляем новое сообщение пользователя
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      username: username
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Фиксируем высоту перед добавлением ответа
    if (tgWebApp.current) {
      tgWebApp.current.expand();
    }

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportResponse = {
        id: Date.now() + 1,
        text: 'Спасибо за ваше сообщение. Наш специалист скоро ответит вам.',
        sender: 'support',
        username: 'Cube'
      };
      setMessages(prev => [...prev, supportResponse]);
      
      // Снова фиксируем высоту после добавления ответа
      if (tgWebApp.current) {
        setTimeout(() => tgWebApp.current.expand(), 100);
      }
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">CubeAnalyst</div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
          >
            <div className="message-username">@{message.username}</div>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите ваше сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default MarketAnalysis;