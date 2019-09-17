import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from './../../../environments/environment';
import { BaseService  } from "../services/base.service";


@Injectable()
export class ConfigService extends BaseService {

  apiURI:string;
  username:string;
  password:string;

  constructor(private http:Http) {
    super();
    this.apiURI = environment.apiURI;
    this.username = environment.userAPICM;
    this.password = "dfsdfdf";
  }

  getApiURI() {
    return this.apiURI;
  }

  loginAPI() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let username = this.username;
    let password = this.password;
    let url = this.apiURI + '/login';
    let params = JSON.stringify({username, password})
    let token = "NONE";

    return this.http
      .post(url, params, {headers})
      .map(res => res.json())
      .map(res => {
        console.log("res: " + JSON.stringify(res))
        localStorage.setItem('auth_token_api', res.auth_token);
        return true;
      })
      .catch(this.handleError);


  } //function

}
