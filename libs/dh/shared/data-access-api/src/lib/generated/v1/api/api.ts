export * from './charge-links-http.service';
import { ChargeLinksHttp } from './charge-links-http.service';
export * from './metering-point-http.service';
import { MeteringPointHttp } from './metering-point-http.service';
export * from './weather-forecast-http.service';
import { WeatherForecastHttp } from './weather-forecast-http.service';
export const APIS = [ChargeLinksHttp, MeteringPointHttp, WeatherForecastHttp];
