import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/Rx';

import {environment} from './../../../environments/environment';
import {UserRegistration} from '../models/user.registration.interface';
import {ConfigService} from '../utils/config.service';
import {BaseService} from "./base.service";

// Add the RxJS Observable operators we need in this app.
import '../../rxjs-operators';

@Injectable()

export class UserService extends BaseService {
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  private loggedIn = false;

  public baseUrl: string = '';
  public authNavStatus$ = this._authNavStatusSource.asObservable();
  public usernameAPI: string;
  public passwordAPI: string;
  public headers: Headers;

  constructor(private http: Http, private configService: ConfigService) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
    this._authNavStatusSource.next(this.loggedIn);
    this.baseUrl = environment.apiURI;
    this.usernameAPI = environment.userAPICM;
    this.passwordAPI = environment.passwordAPICM;
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: string, plan: string, socialNetwork: string, socialId: string, profile_picture: string): Observable<UserRegistration> {
    let body = JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      phone,
      plan,
      socialNetwork,
      socialId,
      profile_picture
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + "/createAccount", body, options)
      .map(res => res.json())
      .map(res => {
        return true;
      })
      .catch(this.handleError);
  }

  login(userName, passWord) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let username = userName;
    let password = passWord;
    let url = this.baseUrl + '/login';
    let params = JSON.stringify({username, password})

    return this.http.post(url, params, {headers})
      .map(res => res.json())
      .map(res => {
        localStorage.setItem('auth_token', res.auth_token);
        localStorage.setItem('role', res.roles[0]);
        localStorage.setItem('fanzone_username', res.username);

        this.getUserInfo().subscribe(data => {
          if(data.usuarioInstance.length > 0) {
            localStorage.setItem('fanzone_profile_picture', data.usuarioInstance[0].foto_perfil)
            localStorage.setItem('fanzone_name', data.usuarioInstance[0].nombre)
          }
        })
        this.loggedIn = true;
        this._authNavStatusSource.next(true);
        return true;
      })
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  facebookLogin(accessToken: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({accessToken});
    return this.http
      .post(
        this.baseUrl + '/externalauth/facebook', body, {headers})
      .map(res => res.json())
      .map(res => {
        localStorage.setItem('auth_token', res.auth_token);
        this.loggedIn = true;
        this._authNavStatusSource.next(true);
        return true;
      })
      .catch(this.handleError);
  }

  getUserFacebookProfile(accessToken: string): Observable<any> {
    var fields = ['email', 'first_name', 'last_name'];
    var graphApiUrl = 'https://graph.facebook.com/v3.0/me?fields=' + fields.join(',');

    return this.http.get(graphApiUrl + '&access_token=' + accessToken + '')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  loginAPI() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let username = this.usernameAPI;
    let password = this.passwordAPI;
    let url = this.baseUrl + '/login';
    let params = JSON.stringify({username, password})
    let token = "NONE";

    return this.http
      .post(url, params, {headers})
      .map(res => res.json())
      .map(res => {
        localStorage.setItem("auth_token_api", res.access_token);
        return true;
      })
      .catch(this.handleError);

  }

  getUserInfo() {
    let userName = localStorage.getItem("fanzone_username");
    let headers = this.headers;
    let url = this.baseUrl + "/userInfo?userName=" + userName;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  sendMailSupport(message): Observable<any> {
    let body = JSON.stringify(message);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = "http://192.168.100.9:8080/api/supportEmail";

    return this.http.post(url, body, options)
      .map(res => res.json())
      .map(res => {
        return true;
      })
      .catch(this.handleError);
  }
}

