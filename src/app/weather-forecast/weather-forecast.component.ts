import { Component, OnInit } from '@angular/core';
import { WeatherForecastService } from './weather-forecast.service';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  providers: [ WeatherForecastService ]
})
export class WeatherForecastComponent implements OnInit {

  errorMessage = '';
  defaultLocation = 'London';
  isLoading = true;
  forecastLoading = true;
  forecastShowing = false;
  weatherData: any;
  forecastData: any;
  positionData: any;
  positionString: string;

  constructor(private weatherForecastService: WeatherForecastService) { }

  ngOnInit() {
    this.checkLocation();
  }

  setWeather(weather) {
    this.weatherData = weather;
    this.isLoading = false;
  }

  setForecast(forecast) {
    this.forecastData = forecast;
    this.forecastLoading = false;
  }

  refreshData() {
    this.setPosition(this.positionData);
  }

  checkLocation() {
    if ('geolocation' in navigator) {
      // Get Location from Google if available else use default
      navigator.geolocation.getCurrentPosition((position) => {
        this.weatherForecastService.getLocation(position).subscribe(
          location => this.setPosition(location),
          error => this.manageError(error)
        );
      });
    } else {
      // console.log('No geolocation');
      this.errorMessage = 'Please enable location services';
      return false;
    }
  }

  setPosition(position) {
    this.isLoading = true;
    this.positionData = position;
    if (this.positionData.results[0].address_components[2].long_name) {
      this.positionString = this.positionData.results[0].address_components[2].long_name;
    } else {
      this.positionString = this.defaultLocation;
    }
    // Get Today's Weather
    this.weatherForecastService.getTodayWeather(this.positionString).subscribe(
      weather => this.setWeather(weather),
      error => this.manageError(error)
    );
    // Get Weather Forecast
    this.weatherForecastService.getWeatherForecast(this.positionString).subscribe(
      forecast => this.setForecast(forecast),
      error => this.manageError(error)
    );

  }

  manageError(error) {
    this.errorMessage = error;
  }

}
