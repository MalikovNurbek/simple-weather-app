export enum Units {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
}

export interface ICoordinates {
  lat: number;
  lon: number;
}

export interface IMainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface IWind {
  speed: number;
  deg: number;
}

export interface ISystemInfo {
  country: string;
}

export interface IRain {
  [key: string]: number;
}

export interface ISnow {
  [key: string]: number;
}

export interface IClouds {
  all: number;
}

export interface IWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ICity {
  id: number;
  name: string;
  coord: ICoordinates;
  main: IMainWeather;
  dt: number;
  wind: IWind;
  sys: ISystemInfo;
  rain: IRain | null;
  snow: ISnow | null;
  clouds: IClouds;
  weather: IWeather[];
}

export interface IListResponse<T> {
  count: number;
  message: string;
  list: T[];
}
