import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherForecastService {
  googleMapsApiBase: string;
  googleMapsApiKey: string;
  weatherApiBase: string;
  weatherApiKey: string;

  constructor(private http: Http) {
    this.googleMapsApiBase = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    this.googleMapsApiKey  = 'AIzaSyDI-MPoDrmVJnK2qAYtDZr9aR9pOzHCSiI';
    this.weatherApiBase = 'https://api.apixu.com/v1/';
    this.weatherApiKey = 'cb61805cd0e54021b5c115809170501';
  }

  // Get Today's weather from openWeatherApi
  getTodayWeather(location) {
    return this.http.get(this.weatherApiBase +
      'current.json?key=' +  this.weatherApiKey +
      '&q=' + location)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWeatherForecast(location) {
    return this.http.get(this.weatherApiBase + '' +
      'forecast.json?key=' +  this.weatherApiKey +
      '&q=' + location + '&days=10')
      .map(this.extractData)
      .catch(this.handleError);
  }

  // Get location from device or default then get long/lat from Google Maps
  getLocation(position) {
    return this.http.get(this.googleMapsApiBase +
      position.coords.latitude + ',' +
      position.coords.longitude + '&key=' +
      this.googleMapsApiKey)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
