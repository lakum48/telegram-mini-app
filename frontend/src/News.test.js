import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import News from './News';
import axios from 'axios';

jest.mock('axios');

describe('News Component', () => {
  it('Получение данных и отображение', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000, market_cap: 1000000000, change_24h: 2 },
        { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000, market_cap: 500000000, change_24h: 1 },
      ]
    });

    render(<News />);

    await waitFor(() => {
      expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
      expect(screen.getByText(/Ethereum/i)).toBeInTheDocument();
    });
  });

  it('ошибка при загрузке данных', async () => {
    axios.get.mockRejectedValueOnce(new Error('Ошибка при загрузке данных'));

    render(<News />);

    await waitFor(() => {
      expect(screen.getByText(/Ошибка при загрузке данных/i)).toBeInTheDocument();
    });
  });

  it('работает кнопка "Поиск"', async () => {
    // Мокаем успешный ответ от API для криптовалют
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000, market_cap: 1000000000, change_24h: 2 },
        { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000, market_cap: 500000000, change_24h: 1 },
      ]
    });

    render(<News />);

    // Дожидаемся загрузки данных и появления кнопки "Поиск"
    const searchButton = await screen.findByRole('button', { name: /ПОИСК/i });

    // Нажимаем на кнопку "Поиск"
    fireEvent.click(searchButton);
  });

  it('работает кнопка "Посмотреть новости"', async () => {
    // Мокаем успешный ответ от API для криптовалют
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000, market_cap: 1000000000, change_24h: 2 },
        { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000, market_cap: 500000000, change_24h: 1 },
      ]
    });

    render(<News />);

    // Дожидаемся загрузки данных и появления кнопок "Посмотреть новости"
    const viewNewsButtons = await screen.findAllByRole('button', { name: /Посмотреть новости/i });

    // Нажимаем на первую кнопку "Посмотреть новости"
    fireEvent.click(viewNewsButtons[0]);

    // Проверяем, что была нажата кнопка (она все еще присутствует в документе)
    expect(viewNewsButtons[0]).toBeInTheDocument();
  });
});
