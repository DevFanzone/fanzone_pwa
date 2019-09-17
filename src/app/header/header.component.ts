import {Component, OnInit, OnDestroy, AfterViewChecked} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {environment} from './../../environments/environment';
import {Router} from '@angular/router';

//app
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewChecked, OnDestroy {
  subscription: Subscription;
  baseRef: String = environment.baseRef;
  status: boolean;
  assetsDir: String = environment.assetsDir;
  memberShip: String = localStorage.getItem("role");

  //Player config
  playerName: String = environment.playerName;
  playerPrimaryColor: String = environment.playerPrimaryColor;
  playerSecondaryColor: String = environment.playerSecondaryColor;
  shopifyStore: String = environment.shopifyStore;

  //Models
  search: String = "";
  navbarOpen = false;
  userProfilePicture: String = this.assetsDir + '/user-icon.png';
  userProfilePictureClass: String = '';

  constructor(private userService: UserService, private router: Router) {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.loginAPI();
    this.subscription = this.userService.authNavStatus$.subscribe(status => this.status = status);
    this.getUserInfo();
  }

  ngAfterViewChecked(): void {
    let userProfile = localStorage.getItem("fanzone_profile_picture");
    if (userProfile) {
      this.userProfilePicture = userProfile
      this.userProfilePictureClass = 'rounded-circle'
    }
  }

  loginAPI() {
    this.userService.loginAPI()
      .subscribe(
        result => {
        },
        error => {
          alert("loginAPI failed")
        }
      );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchPosts({value, valid}: { value: any, valid: boolean }) {
    if (valid) {
      this.router.navigate(['/'], {queryParams: {search: value.keyword}});
    }
  }

  goHome() {
    window.location.href = '';
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe(
      data => {
        if (data.usuarioInstance.length > 0) {
          localStorage.setItem('fanzone_profile_picture', data.usuarioInstance[0].foto_perfil)
          localStorage.setItem('fanzone_name', data.usuarioInstance[0].nombre)
        }
      }
    );
  }
}
