import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { BaseRequestOptions, Http, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// Import API Stubs
import { CurrentForecast } from './weather-forecast.data.current.mock';
import { WeeklyForecast } from './weather-forecast.data.forecast.mock';
import { locationData } from './weather-forecast.data.location.mock';

import { WeatherForecastService } from './weather-forecast.service';

describe('WeatherForecastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherForecastService,
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        },
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}
      ]
    });
  });

  it('should be created', inject([WeatherForecastService], (service: WeatherForecastService) => {
    expect(service).toBeTruthy();
  }));

  it('should have a baseUrl for Apixu API', inject([WeatherForecastService], (service: WeatherForecastService) => {
    expect(service.weatherApiBase).toBe('https://api.apixu.com/v1/');
  }));

  it('should have a baseUrl for Google Maps API', inject([WeatherForecastService], (service: WeatherForecastService) => {
    expect(service.googleMapsApiBase).toBe('https://maps.googleapis.com/maps/api/geocode/json?latlng=');
  }));

  it('should retrieve current location details based on lat/long',
    inject([WeatherForecastService, MockBackend], fakeAsync((forecastService: WeatherForecastService, mockBackend: MockBackend) => {
      let res: Response;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('https://maps.googleapis.com/maps/api/geocode/json?latlng=51.449,-0.323&key=AIzaSyDI-MPoDrmVJnK2qAYtDZr9aR9pOzHCSiI');
        const response = new ResponseOptions({body: locationData});
        c.mockRespond(new Response(response));
      });
      const position = {
        coords: {
          latitude: 51.449,
          longitude: -0.323
        }
      };
      forecastService.getLocation(position).subscribe((response) => {
        res = response;
      });
      tick();
      expect(res[0].results[0].address_components[2].short_name).toBe('Twickenham');
    }))
  );

  it('should retrieve current forecast details based on location string',
    inject([WeatherForecastService, MockBackend], fakeAsync((forecastService: WeatherForecastService, mockBackend: MockBackend) => {
      let res: Response;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('https://api.apixu.com/v1/current.json?key=cb61805cd0e54021b5c115809170501&q=Twickenham');
        const response = new ResponseOptions({body: CurrentForecast});
        c.mockRespond(new Response(response));
      });
      forecastService.getTodayWeather('Twickenham').subscribe((response) => {
        res = response;
      });
      tick();
      expect(res[0].location.name).toBe('Twickenham');
      expect(res[0].current.temp_c).toBe(20.0);
      expect(res[0].current.condition.text).toBe('Sunny');
    }))
  );

  it('should retrieve weekly forecast details based on location string',
    inject([WeatherForecastService, MockBackend], fakeAsync((forecastService: WeatherForecastService, mockBackend: MockBackend) => {
      let res: Response;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('https://api.apixu.com/v1/forecast.json?key=cb61805cd0e54021b5c115809170501&q=Twickenham&days=10');
        const response = new ResponseOptions({body: WeeklyForecast});
        c.mockRespond(new Response(response));
      });
      forecastService.getWeatherForecast('Twickenham').subscribe((response) => {
        res = response;
      });
      tick();
      expect(res[0].location.name).toBe('Twickenham');
      expect(res[0].forecast.forecastday.length).toBe(10);
    }))
  );
});
