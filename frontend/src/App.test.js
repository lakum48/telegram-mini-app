import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App Component', () => {
  test('Переход на страницу FAQ', () => {
    render(<App />);

    const faqButton = screen.getByAltText('FAQ');
    fireEvent.click(faqButton);

    expect(screen.getByText('Часто задаваемые вопросы')).toBeInTheDocument();
  });

  test('Переход на страницу Market', () => {
    render(<App />);

    const marketButton = screen.getByAltText('Market');
    fireEvent.click(marketButton);

    expect(screen.getByText('Анализ рынка')).toBeInTheDocument();
  });

  test('Переход на страницу Predictions', () => {
    render(<App />);

    const predictionsButton = screen.getByAltText('Predictions');
    fireEvent.click(predictionsButton);

    expect(screen.getByText('Прогнозы')).toBeInTheDocument();
  });

  test('Переход на страницу Home', () => {
    render(<App />);

    const homeButton = screen.getByAltText('Home');
    fireEvent.click(homeButton);
  });
});
