import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FAQ from './FAQ';

describe('FAQ Component', () => {
  test('Открытие и закрытие 1 вопроса', () => {
    render(<FAQ />);

    const question = screen.getByText('Как пользоваться ботом?');
    const answer = screen.getByText('Просто выберите нужный раздел в меню и следуйте инструкциям.');

    expect(answer).not.toHaveClass('open'); // Ответ изначально скрыт
    fireEvent.click(question);
    expect(answer).toHaveClass('open'); // Ответ открылся
    fireEvent.click(question);
    expect(answer).not.toHaveClass('open'); // Ответ закрылся
  });

  test('Открытие и закрытие 2 вопроса', () => {
    render(<FAQ />);

    const question = screen.getByText('Как обновить данные?');
    const answer = screen.getByText('Данные обновляются автоматически каждые 10 минут.');

    expect(answer).not.toHaveClass('open');
    fireEvent.click(question);
    expect(answer).toHaveClass('open');
    fireEvent.click(question);
    expect(answer).not.toHaveClass('open');
  });

  test('Открытие и закрытие 3 вопроса', () => {
    render(<FAQ />);

    const question = screen.getByText('Как получать новости по криптовалютам?');
    const answer = screen.getByText('Просто зайдите в раздел "Новости", и все последние обновления будут доступны.');

    expect(answer).not.toHaveClass('open');
    fireEvent.click(question);
    expect(answer).toHaveClass('open');
    fireEvent.click(question);
    expect(answer).not.toHaveClass('open');
  });

  test('Открытие и закрытие 4 вопроса', () => {
    render(<FAQ />);

    const question = screen.getByText('Как связаться с поддержкой?');
    const answer = screen.getByText('Напишите нашему оператору: @Baskaev_Daniel');

    expect(answer).not.toHaveClass('open');
    fireEvent.click(question);
    expect(answer).toHaveClass('open');
    fireEvent.click(question);
    expect(answer).not.toHaveClass('open');
  });
});
