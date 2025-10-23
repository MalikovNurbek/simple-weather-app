import { type IListResponse, type ICity, Units } from '~/service/api.interface';

const API_KEY = '5796abbde9106b7da4febfae8c44c232';
const apiFetch = $fetch.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  query: { units: Units.METRIC, appid: API_KEY },
});

export const WeatherService = {
  findCities: (q: string) => {
    return apiFetch<IListResponse<ICity>>('/find', { query: { q: q } });
  },

  getCity: (id: string | number) => {
    return apiFetch<ICity>('/weather', { query: { id } });
  },

  getForecast: (query: { lat: number; lon: number; units?: Units }) => {
    return apiFetch('/onecall', { query });
  },
};
