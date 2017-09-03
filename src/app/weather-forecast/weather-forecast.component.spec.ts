import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { WeatherForecastComponent } from './weather-forecast.component';
import { WeatherForecastService } from './weather-forecast.service';

// Import API Stubs
import { CurrentForecast } from './weather-forecast.data.current.mock';
import { WeeklyForecast } from './weather-forecast.data.forecast.mock';
import { locationData } from './weather-forecast.data.location.mock';

describe('WeatherForecastComponent', () => {
  let component: WeatherForecastComponent;
  let fixture: ComponentFixture<WeatherForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherForecastComponent ],
      providers: [WeatherForecastService,
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
        },
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be loading when initialised', () => {
    expect(component.isLoading).toBeTruthy();
  });

  it('should have a default location', () => {
    expect(component.defaultLocation).toBe('London');
  });

  it('should check location on init', () => {
    spyOn(component, 'checkLocation');
    component.ngOnInit();
    expect(component.checkLocation).toHaveBeenCalled();
  });

  it('should set loading to true when setting a position', () => {
    component.setPosition(locationData[0]);
    expect(component.isLoading).toBeTruthy();
  });

  it('should set location string when setting a position', () => {
    component.setPosition(locationData[0]);
    expect(component.positionString).toBe('Twickenham');
  });

  it('should set current weather data from retrieved data', () => {
    component.setWeather(CurrentForecast[0]);
    expect(component.weatherData).toBe(CurrentForecast[0]);
  });

  it('should set isLoading to false on setting current weather', () => {
    component.setWeather(CurrentForecast[0]);
    expect(component.isLoading).toBeFalsy();
  });

  it('should set forecast weather data from retrieved data', () => {
    component.setForecast(WeeklyForecast[0]);
    expect(component.forecastData).toBe(WeeklyForecast[0]);
  });

  it('should set forecastLoading to false on setting forecast weather', () => {
    component.setForecast(WeeklyForecast[0]);
    expect(component.forecastLoading).toBeFalsy();
  });

  it('should create a last updated date on setting forecast weather', () => {
    component.setForecast(WeeklyForecast[0]);
    const todayDate = new Date();
    expect(component.lastUpdated).toEqual(todayDate);
  });

  it('should set position again on refresh', () => {
    spyOn(component, 'setPosition');
    component.refreshData();
    expect(component.setPosition).toHaveBeenCalled();
  });

  it('should set error message on calling error function', () => {
    component.manageError('This is an error');
    expect(component.errorMessage).toEqual('This is an error');
  });
});
