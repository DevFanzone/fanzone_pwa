import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from './../../../environments/environment';
import {Subscription} from 'rxjs';
import {VgAPI} from 'videogular2/core';
import {NgZone} from '@angular/core';
import {InitService} from '../services/init.service';
import {CommentInterface} from '../interfaces/comment-interface';
import {PostlikeInterface} from '../interfaces/postlike-interface';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

declare var $: any;

//declare var FB: any;

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

export class CoverComponent implements OnInit {
  private subscription: Subscription;
  public apiVG: VgAPI;

  // Player settings
  public playerPrimaryColor: string = environment.playerPrimaryColor;
  public playerSecondaryColor: string = environment.playerSecondaryColor;
  public shopifyStore: string = environment.shopifyStore;
  public playerName: string = environment.playerName;

  // Config models
  public assetsDir: string = environment.assetsDir;

  // User (client) account info
  public memberShip: string = localStorage.getItem('role');
  public userName: string = localStorage.getItem('fanzone_username');

  // App models
  public collections: any;
  public like: PostlikeInterface = <PostlikeInterface>{};
  public posts: any = [];
  public collection: any = [{nombre: 'Loading name...'}];
  public limitRecords: number = 2;
  public limitRecordsAds: number = 1;
  public offsetRecords: number = 0;
  public offsetRecordsAds: number = 0;
  public comments: any;
  public likes: any;
  public activePostId: string;
  public activeCollectionId: string = '';
  public menuOpen = false;
  public videoPlayers: any = [];
  public collectionsPreferences: any;
  public sliders: any;
  public isShrunk: boolean = false;
  public isLoader: boolean = false;
  public videoInView: number;
  public vids: any;
  public videoMute: any;
  public height: any;
  public width: any;
  public bannersUrls = [];
  public recordSearch: string;
  public recordPublicity = 0;

  constructor(private initService: InitService, private activatedRoute: ActivatedRoute, zone: NgZone, private router: Router) {
    window.onscroll = () => {
      zone.run(() => {
        if (window.pageYOffset > 350) {
          this.isShrunk = true;
        } else {
          this.isShrunk = false;
        }
      });
    };
  }

  @HostListener('window:resize')
  onResize() {
    $('img[usemap]').rwdImageMaps();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    this.functionToTriggerOnScroll();
  }

  ngOnInit() {
    this.cdOfVideo();
    this.getCollections();
    this.getSliders();
    this.getPWAVersion();
    this.vids = document.getElementsByTagName('video');
    this.videoMute = {'mute': true, 'isFirst': true};

    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        if (param['search']) {
          this.getLatestPost(param['search'])
        } else {
          this.getLatestPost();
        }
      });

    $(document).ready(function () {
      setTimeout(() => {
        $('img[usemap]').rwdImageMaps();
      }, 2000)

      $('#sliders').carousel({
        interval: 10000,
        cycle: true
      });

      $('#sliders').on('slide.bs.carousel', function () {
        $('img[usemap]').rwdImageMaps();
      });
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onPlayerReady(api: VgAPI) {
    this.videoPlayers.push(api);
    this.apiVG = api;

    if (this.videoMute.mute) {
      this.apiVG.volume = 0;
    }

    this.apiVG.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        this.apiVG.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.handlePlayers.bind(this));
      }
    );
  }

  handlePlayers(playerId) {
    this.videoMute.mute = false;
    this.videoPlayers.forEach(api => {
      let idVP = api.videogularElement.id;

      if (idVP !== playerId) {
        api.pause();
      }

      if (this.videoMute.mute === false && this.videoMute.isFirst) {
        api.volume = 1;
      }
    });

    this.videoMute.isFirst = false;
  }

  getCollections() {
    this.initService.getCollections().subscribe(
      data => {
        this.collections = data.categorias
        this.setActiveCollection(0)
      }
    );
  }

  getCollectionsPreferences() {
    if (this.memberShip == 'ROLE_DOUBLE' || this.memberShip == 'ROLE_SINGLE') {
      this.collections.forEach(collection => {
        collection.estatus = 1
      })

      this.collectionsPreferences = [83, 84, 85];
      this.collectionsPreferences.forEach(collectionId => {
        let collectionInMenu = this.collections.find(item => item.id === collectionId)
        if (collectionInMenu) collectionInMenu.estatus = 0
      })
    }
  }

  getLatestPost(search?) {
    if (search) {
      if (this.recordSearch != search || !this.recordSearch) {
        this.clearRecords()
        setTimeout(() => {
          this.setActiveCollection(0)
        }, 500)
        this.activeCollectionId = ''
        this.isLoader = true
      }
      this.recordSearch = search;
      this.searchPosts(search);
    } else {
      this.initService.getLatestPosts(this.offsetRecords, this.limitRecords).subscribe(
        data => {
          this.posts = this.posts.concat(data.publicaciones);
          this.getSponsoredPosts();
        }
      );
    }
  }

  getExclusivePosts() {
    this.initService.getExclusivePosts(this.offsetRecords, this.limitRecords).subscribe(
      data => {
        this.posts = data.publicaciones;
      }
    );
  }

  getPWAVersion() {
    this.initService.getPWAVersion().subscribe(
      data => {
      }
    );
  }

  showCollection(collectionId, collectionName, lastDate, urlSplah, lastUpdateSplash) {
    this.clearRecords()
    this.recordSearch = ''

    this.router.navigate(['/'])
    this.activeCollectionId = collectionId;
    this.isLoader = true
    this.saveClickCollections(collectionId, collectionName, lastDate, urlSplah, lastUpdateSplash);

    this.getPosts(this.activeCollectionId, this.offsetRecords, this.limitRecords);
  }

  setActiveCollection(collectionId) {
    this.collections.forEach(element => {
      if (element.id === collectionId || collectionId === 0) {
        element.cssClass = true;
      } else {
        element.cssClass = false;
      }
    });
  }

  saveClickCollections(collectionId, collectionName, lastDate, urlSplah, lastUpdateSplash) {
    if (typeof (Storage) !== 'undefined' && urlSplah) {
      let isOld = false;
      let localCollections = [];
      const firstTimeView = {
        idCollection: collectionId,
        nameCollection: collectionName,
        lastDateCollection: lastDate,
        urlSplah: urlSplah,
        lastUpdateSplash: lastUpdateSplash
      };

      localCollections = JSON.parse(localStorage.getItem('firstTime') || '[]');
      if (localCollections.length > 0) {
        localCollections.forEach(element => {
          if (element.idCollection === collectionId) {
            isOld = true;
            if (element.lastUpdateSplash !== lastUpdateSplash) {
              this.showSplash(firstTimeView, localCollections);
              element.lastUpdateSplash = lastUpdateSplash;
            }
          }
        });

        if (isOld === false) {
          this.showSplash(firstTimeView, true);
        } else {
          localStorage.setItem('firstTime', JSON.stringify(localCollections));
        }
      } else {
        this.showSplash(firstTimeView, true);
      }
    }
  }

  showSplash(collections, addItem?) {
    if (addItem) {
      let collectionsView = [];
      collectionsView.push(collections);
      collectionsView = collectionsView.concat(JSON.parse(localStorage.getItem('firstTime') || '[]'));
      localStorage.setItem('firstTime', JSON.stringify(collectionsView));
    }

    Swal.fire({
      customClass: 'content-splah',
      background: '#fff url(' + collections.urlSplah + ')',
      showCloseButton: true,
      showConfirmButton: false,
      timer: 3000,
      allowOutsideClick: false
    });
  }

  getPosts(collectionId, offset, limit) {
    setTimeout(() => {
      this.initService.getPosts(collectionId, offset, limit).subscribe(
        data => {
          this.posts = this.posts.concat(data.publicaciones);
          this.isLoader = false
          this.setActiveCollection(collectionId);
          this.getSponsoredPosts();
        }
      );
    }, 500)
  }

  loadMorePosts() {
    this.vids = document.getElementsByTagName('video');
    if (this.activeCollectionId !== '') {
      this.offsetRecords = this.offsetRecords + this.limitRecords;
      this.getPosts(this.activeCollectionId, this.offsetRecords, this.limitRecords);
    } else {
      this.offsetRecords = this.offsetRecords + this.limitRecords;
      if (this.recordSearch) {
        this.getLatestPost(this.recordSearch);
      } else {
        this.getLatestPost();
      }
    }
  }

  functionToTriggerOnScroll() {
    for (let i = 0; i < this.vids.length; i++) {
      if (this.isElementInViewport(this.vids.item(i))) {
        if (this.videoInView !== i && (this.vids.item(i).paused || this.vids.item(i).ended || this.vids.item(i).seeking
          || this.vids.item(i).readyState < this.vids.item(i).HAVE_FUTURE_DATA)) {
          const mainVideo: HTMLVideoElement = <HTMLVideoElement>this.vids.item(i);
          mainVideo.play();
          this.videoInView = i;
        }
      } else {
        if (this.videoInView === i) {
          this.videoInView = undefined;
        }
        const mainVideo: HTMLVideoElement = <HTMLVideoElement>this.vids.item(i);
        mainVideo.pause();
      }
    }
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top - 100 > 0 &&
      rect.left > 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  cdOfVideo() {
    setTimeout(() => {
      for (let i = 0; i < this.vids.length; i++) {
        if (this.isElementInViewport(this.vids.item(i))) {
          this.vids.item(i).play();
        } else {
          this.vids.item(i).pause();
        }
      }
    }, 1000);
  }

  getSponsoredPosts() {
    if ((this.offsetRecords + this.limitRecords) >= 4) {
      if (this.recordPublicity == 0 || this.recordPublicity == this.posts.length) {
        this.initService.getSponsoredPosts(this.offsetRecordsAds, this.limitRecordsAds).subscribe(
          data => {
            this.posts = this.posts.concat(data.publicaciones);
            this.offsetRecordsAds = this.offsetRecordsAds + this.limitRecordsAds;
            if (data.publicaciones.length == 0) {
              this.offsetRecordsAds = 0
              this.getSponsoredPosts()
            } else {
              this.recordPublicity = this.posts.length + 4;
            }
          }
        );
      }
    }
  }

  getSliders() {
    this.initService.getSliders().subscribe(
      data => {
        this.sliders = data.sliders;
        this.sliders.forEach(banner => {
          this.bannersUrls.push({url: banner.urlArchivoOriginal, maps: banner.mapsOriginal});
        });
      }
    );
  }

  setActivePostId(postId) {
    this.activePostId = postId;
  }

  searchPosts(keyword: String) {
    this.initService.searchPosts(keyword, this.limitRecords, this.offsetRecords,this.userName).subscribe(
      data => {
        this.isLoader = false
        this.posts = this.posts.concat(data.publicaciones);
        this.getSponsoredPosts();

        if (this.posts.length <= 0) {
          this.recordSearch = ''
          this.router.navigate(['/'])
        }
      },
      err => {
        this.isLoader = false
      }
    );
  }

  createPostLike(postId) {
    if (this.memberShip == 'ROLE_DOUBLE' || this.memberShip == 'ROLE_SINGLE') {
      this.like.userId = "4";
      this.like.postId = postId;
      this.like.userName = this.userName;
      this.initService.createPostLike(this.like)
        .subscribe(
          result => {
            if (result) {
              this.updateSocialCounts(postId);
            }
          },
          error => {
            alert(error)

          });
    } else {
      this.inviteUserToLogin();
    }

  }

  createComment({value, valid}: { value: CommentInterface, valid: boolean }) {
    if (valid) {
      value.postId = this.activePostId;
      value.userId = "4";
      value.userName = this.userName;
      this.initService.createComment(value)
        .subscribe(
          result => {
            if (result) {
              this.getPostComments(this.activePostId);
              this.updateSocialCounts(this.activePostId);
            }
          },
          error => {
            alert(error)
          });
    }
  }

  getPostLikes(postId) {
    this.initService.getPostLikes(postId).subscribe(
      data => {
        this.likes = data.likes;
      },
      err => {
        alert("Loading content.. please wait a few moments 5: " + err);
      }
    );
  }

  getPostComments(postId) {
    this.initService.getPostComments(postId).subscribe(
      data => {
        this.comments = data.comentarios;
      },
      err => {
        alert("Loading content.. please wait a few moments 6: " + err);
      }
    );
  }

  getPostSocialCounts(postsList) {
    postsList.forEach(element => {
      this.initService.getPostSocialCounts(element.id).subscribe(
        data => {
          let commentsCount = data.commentsCount;
          let likesCount = data.likesCount;

          element.commentsCount = commentsCount;
          element.likesCount = likesCount;
        },
        err => {
          alert("Loading content.. please wait a few moments 7: " + err);
        }
      );

    });
  }

  updateSocialCounts(postId) {
    let post = this.getPostObject(postId);
    var postsList = [];
    postsList.push(post);
    this.getPostSocialCounts(postsList)
  }

  shareToFB(postPhoto, postDescription) {
    var app_id = environment.facebookAppId;
    var link = environment.urlAPP;
    var picture = postPhoto;
    var name = environment.playerName;
    var facebookRedirectUri = environment.facebookRedirectUri;
    var quote = encodeURIComponent(postDescription);

    var url = "https://www.facebook.com/dialog/feed?app_id=" + app_id + "&" +
      "link=" + link + "&" +
      "picture=" + picture + "&" +
      "name=" + name + "&" +
      "redirect_uri=" + facebookRedirectUri + "&" +
      "quote=" + quote + "&" +
      "display=popup";

    window.open(url, "", "width=600, height=350");
  }

  shareToTW(postDescription) {
    var text = encodeURIComponent(postDescription);
    var url = environment.urlAPP;
    var url = "https://twitter.com/intent/tweet?text=" + text + "&" + "url=" + url;

    window.open(url, "", "width=600, height=350");
  }

  getPostObject(postId) {
    return this.posts.find(post => post.id === postId);
  }

  inviteUserToLogin() {
    Swal.fire({
      text: "To like or share this content, you need to log in or create an account",
      type: 'warning',
      timer: 5000,
      position: 'top',
      showConfirmButton: false
    })
  }

  notifyAboutProduct(postId, circle, action) {
    circle.forEach(circle => {
      let circleElement = circle.coords[0] + "-" + postId;
      if (action == "max") {
        document.getElementById(circleElement).setAttribute('stroke-opacity', "3");
        document.getElementById(circleElement).setAttribute('r', "40");
        document.getElementById(circleElement).setAttribute('fill', this.playerPrimaryColor);
      }
      if (action == "min") {
        document.getElementById(circleElement).setAttribute('stroke-opacity', "1");
        document.getElementById(circleElement).setAttribute('r', "30");
        document.getElementById(circleElement).setAttribute('fill', "#F6F6F6");
      }
    });
  }

  clearRecords() {
    this.offsetRecords = 0;
    this.offsetRecordsAds = 0;
    this.recordPublicity = 0;
    this.posts = [];
  }
}
