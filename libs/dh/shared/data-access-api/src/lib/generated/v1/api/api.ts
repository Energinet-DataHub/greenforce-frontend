export * from './metering-point-http.service';
import { MeteringPointHttp } from './metering-point-http.service';
export * from './weather-forecast-http.service';
import { WeatherForecastHttp } from './weather-forecast-http.service';
export const APIS = [MeteringPointHttp, WeatherForecastHttp];
