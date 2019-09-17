import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import '../../rxjs-operators';
import {environment} from './../../../environments/environment';

//App
import {BaseService} from '../../shared/services/base.service';
import {CommentInterface} from '../interfaces/comment-interface';
import {PostlikeInterface} from '../interfaces/postlike-interface';

@Injectable()
export class InitService extends BaseService {

  baseUrl: string = '';
  headers: Headers;
  atletaId: string = environment.atletaId

  constructor(private http: Http) {
    super();
    this.baseUrl = environment.apiURI;
    let authTokenAPI = localStorage.getItem('auth_token_api');
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', `Bearer ${authTokenAPI}`);
  }

  getCollections() {
    let headers = this.headers;
    let url = this.baseUrl + "/collections?atletaId=" + this.atletaId;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getLatestPosts(offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/latestPosts?atletaId=" + this.atletaId + "&max=" + limit + "&offset=" + offset;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getLatestPostsExclusive(offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/latestPostsExclusive?atletaId=" + this.atletaId + "&max=" + limit + "&offset=" + offset;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPosts(collectionId, offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/postsInCollection?collectionId=" + collectionId + "&max=" + limit + "&offset=" + offset;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPostsExclusive(collectionId, offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/postsInCollectionExclusive?collectionId=" + collectionId + "&max=" + limit + "&offset=" + offset;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getSponsoredPosts(offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/postPublicity?atletaId=" + this.atletaId + "&max=" + limit + "&offset=" + offset;
    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getSliders() {
    let headers = this.headers;
    let url = this.baseUrl + "/listSliders?atletaId=" + this.atletaId;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }


  getPostComments(postId) {
    let headers = this.headers;
    let url = this.baseUrl + "/listComments?postId=" + postId;

    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  createComment(comment: CommentInterface): Observable<CommentInterface> {
    let headers = this.headers;
    let url = this.baseUrl + "/postComment";
    let body = JSON.stringify(comment);

    return this.http.post(url, body, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  createPostLike(like: PostlikeInterface): Observable<PostlikeInterface> {
    let headers = this.headers;
    let url = this.baseUrl + "/postLike";
    let body = JSON.stringify(like);

    return this.http.post(url, body, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  searchPosts(keyword, limit, offset, username) {
    let headers = this.headers;
    let url = this.baseUrl + "/searchPosts?atletaId=" + this.atletaId + "&keyword=" + keyword + "&max=" + limit + "&offset=" + offset + "&username=" + username;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPostLikes(postId) {
    let headers = this.headers;
    let url = this.baseUrl + "/listLikes?postId=" + postId;

    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPostSocialCounts(postId) {
    let headers = this.headers;
    let url = this.baseUrl + "/postSocialCounts?postId=" + postId;

    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getExclusivePosts(offset, limit) {
    let headers = this.headers;
    let url = this.baseUrl + "/getExclusivePost?typePost=1&atletaId=" + this.atletaId + "&max=" + limit + "&offset=" + offset;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPWAVersion() {
    let headers = this.headers;
    let url = this.baseUrl + "/getVersions?platform=pwa&atletaId=" + this.atletaId;

    return this.http.get(url, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getCollectionsPreferences(userName) {
    let url = this.baseUrl + "/getCollectionsPreferences?userName=" + userName;

    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  saveCollectionPreference(preference, collectionId, userName): Observable<any> {
    let headers = this.headers;
    let url = this.baseUrl + "/postLike";
    let params = {
      preference: preference,
      collectionId: collectionId
    }
    let body = JSON.stringify(params);

    return this.http.post(url, body, {headers})
      .map(response => response.json())
      .catch(this.handleError);
  }

}
