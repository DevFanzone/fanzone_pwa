import { Subscription } from 'rxjs';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AuthService,
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';
import { environment } from './../../../environments/environment';

//app
import { Credentials } from '../../shared/models/credentials.interface';
import { UserRegistration } from '../../shared/models/user.registration.interface';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit, OnDestroy {
  private subscription:Subscription;
  urlShareSN:string = environment.urlAPP;
  private user:SocialUser;
  public authorized:boolean = false;

  //User (client) account info
  memberShip:string = "";
  userName:string = "";
  memberShipLabel:string;
  userProfilePicture:string = "";

  //Player settings
  playerPrimaryColor:string = environment.playerPrimaryColor;
  playerSecondaryColor:string = environment.playerSecondaryColor;
  playerName:string = environment.playerName
  assetsDir:string = environment.assetsDir;

  //Social login
  isSocialSigned:boolean = false
  socialData:any = {
    email: '',
    first_name: '',
    last_name: 'N/D',
    phone: '',
    plan: 5,
    socialNetwork: '',
    socialId: '',
    profile_picture: ''
  };
  isTryingRegister:boolean = false;
  isTryingLogin:boolean = false;

  brandNew:boolean;
  errors:string;
  isRequesting:boolean;
  submitted:boolean = false;
  credentials:Credentials = {email: '', password: ''};

  //facebook login
  private authWindow:Window;
  failed:boolean;
  error:string;
  errorDescription:string;

  constructor(private userService:UserService, private router:Router, private activatedRoute:ActivatedRoute, private socialAuthService:AuthService) {
  }

  ngOnInit() {
     let userProfile = localStorage.getItem("fanzone_profile_picture");
     if (userProfile) {
       this.userProfilePicture = userProfile
     }

    this.memberShip = localStorage.getItem("role");
    this.userName = localStorage.getItem("fanzone_name");

    switch (this.memberShip) {
      case "ROLE_SINGLE":
        this.memberShipLabel = "Single membership";
        break;
      case "ROLE_DOUBLE":
        this.memberShipLabel = "Double membership";
        break;
    }
  }

  public socialSignIn(socialPlatform:string) {

    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        if (userData != null) {
          this.authorized = true;
          this.user = userData;
          this.socialData.email = userData.email
          this.socialData.first_name = userData.name
          this.socialData.socialId = userData.id
          this.socialData.profile_picture = userData.image
          this.socialData.socialNetwork = socialPlatformProvider

          //Check if user is registered
          this.autoLogin()
          this.isSocialSigned = true;
        }
      }
    );
  }

  registerUser() {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    this.userService.register(
      this.socialData.email,
      this.socialData.socialId, //we use the value "socialId" to encrypt it and generate user's password
      this.socialData.first_name,
      this.socialData.last_name, //field 'last_name' is empty, we don't need it anymore
      this.socialData.phone, //field 'phone' is empty, we don't need it anymore
      this.socialData.plan,
      this.socialData.socialNetwork,
      this.socialData.socialId,
      this.socialData.profile_picture)
      .finally(() => this.isRequesting = false)
      .subscribe(
        result  => {
        if (result) {
          this.autoLogin();
        }
      },
        errors => {
        this.errors = errors;
        this.router.navigate(['/'])
      }
    );
  } //function

  public signOut() {
    this.socialAuthService.signOut();
    this.authorized = false;
  }

  launchFbLogin() {
    alert("Under construction...")
  }

  handleMessage(event:Event) {
    const message = event as MessageEvent;

    this.authWindow.close();
    const result = JSON.parse(message.data);

    if (!result.status) {
      this.failed = true;
      this.error = result.error;
      this.errorDescription = result.errorDescription;
    }
    else {
      this.failed = false;
      this.isRequesting = true;

      //Get profile data
      this.userService.getUserFacebookProfile(result.accessToken)
        .finally(() => this.isRequesting = false)
        .subscribe(
          result => {
          if (result) {
            //Send to register page
            this.router.navigate(['/register'], {queryParams: {fb: JSON.stringify(result)}, skipLocationChange: true});

          }
        },
          error => {
          this.failed = true;
          this.error = error;
        });
    }
  } //function


  ngOnDestroy() {
  } //function

  login({ value, valid }: { value: Credentials, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService.login(value.email, value.password)
        .finally(() => this.isRequesting = false)
        .subscribe(
          result => {
          if (result) {
            alert("result login comp: " + JSON.stringify(result))
            document.location.reload();
          }
        },
          error => {
          console.log("erores login: " + JSON.stringify(this.errors))
        }
      );
    }
  } //function

  autoLogin() {
    this.userService.login(this.socialData.email, this.socialData.socialId)
      .finally(() => this.isRequesting = false)
      .subscribe(
        result => {
        if (result) {
          this.router.navigate(['/']);
        }
      },
        error => {
        localStorage.setItem('tryingLogin', "1");
        this.registerUser();
      }
    );

  } //function

  cancelRegister() {
    window.location.href = '';
  }

  tryAction(action) {
    if (action == "register") {
      this.isTryingRegister = true
      this.isTryingLogin = false
    }
    if (action == "login") {
      this.isTryingRegister = false
      this.isTryingLogin = true
    }

  }

  clientLogout() {
    localStorage.removeItem('role');
    localStorage.removeItem('fanzone_username');
    localStorage.removeItem('fanzone_profile_picture');
    window.location.href = '';
  } //function

  getUserInfo() {
    this.userService.getUserInfo().subscribe(
      data => {
        if(data.usuarioInstance.length > 0) {
          localStorage.setItem('fanzone_profile_picture', data.usuarioInstance[0].foto_perfil)
          localStorage.setItem('fanzone_name', data.usuarioInstance[0].nombre)
        }
      }
    );
  }
}
