import React from 'react';

function Profile() {
  // Получаем данные пользователя из Telegram Web Apps API
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;

  // Если данные пользователя недоступны, показываем сообщение
  if (!user) {
    return (
      <div>
        <h2>Профиль</h2>
        <p>Данные пользователя недоступны.</p>
      </div>
    );
  }

  // Отображаем данные пользователя
  return (
    <div>
      <h2>Профиль</h2>
      <div className="profile-info">
        {user.photo_url && (
          <img
            src={user.photo_url}
            alt="Profile"
            className="profile-photo"
          />
        )}
        <div className="profile-details">
          <p><strong>Имя:</strong> {user.first_name}</p>
          {user.last_name && <p><strong>Фамилия:</strong> {user.last_name}</p>}
          {user.username && <p><strong>Username:</strong> @{user.username}</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;