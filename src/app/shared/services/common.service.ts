import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
// Add the RxJS Observable operators we need in this app.
import '../../rxjs-operators';

//Servicios base app
import { ConfigService  } from '../utils/config.service';
import { BaseService  } from './base.service';

import { PostlikeInterface } from '../models/postlike-interface';

@Injectable()
export class CommonService  extends BaseService {
  baseUrl: string = '';
  headers: Headers;

  constructor(private http: Http, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem('auth_token_api');
    this.headers.append('Authorization', `Bearer ${authToken}`);
  }


}
