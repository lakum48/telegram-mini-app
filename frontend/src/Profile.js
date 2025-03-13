import React from 'react';
import './Profile.css'; // Подключаем стили

function Profile() {
  const tg = window.Telegram.WebApp;
  const user = tg?.initDataUnsafe?.user || null; // Безопасное получение данных пользователя

  if (!user) {
    return (
      <div className="profile-container">
        <h2 className="profile-title">Профиль</h2>
        <p className="profile-text">Данные пользователя недоступны</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Профиль</h2>
      <div className="profile-card">
        {user.photo_url && <img className="profile-photo" src={user.photo_url} alt="Фото профиля" />}
        <div className="profile-details">
          <p className="profile-text"><strong>Имя:</strong> <span className="highlighted-text">{user.first_name}</span></p>
          {user.last_name && <p className="profile-text"><strong>Фамилия:</strong> <span className="highlighted-text">{user.last_name}</span></p>}
          {user.username && <p className="profile-text"><strong>Юзернейм:</strong> <span className="highlighted-text">@{user.username}</span></p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
