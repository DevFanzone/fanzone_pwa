/* import { Subscription } from 'rxjs';
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
  urlShareSN:String = environment.urlAPP;
  private user:SocialUser;
  public authorized:boolean = false;

  //User (client) account info
  memberShip:String = localStorage.getItem("role");
  userName:String = localStorage.getItem("username");
  memberShipLabel:String;

  //Player settings
  playerPrimaryColor:String = environment.playerPrimaryColor;
  playerSecondaryColor:String = environment.playerSecondaryColor;
  playerName:String = environment.playerName
  assetsDir:String = environment.assetsDir;

  //Social login
  isSocialSigned:boolean = false
  socialData:any = {
    email: '', first_name: '', last_name: '', plan: 5, socialNetwork: '', socialId: ''
  };

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
    /*if (window.addEventListener) {
     window.addEventListener("message", this.handleMessage.bind(this), false);
     } else {
     (<any>window).attachEvent("onmessage", this.handleMessage.bind(this));
     } /// esta estaba cometada como fin
  }

  ngOnInit() {
    // subscribe to router event
    /*this.subscription = this.activatedRoute.queryParams.subscribe(
     (param:any) => {
     this.brandNew = param['brandNew'];
     this.credentials.email = param['email'];
     });
      /// esta estaba cometada como fin

    //localStorage.setItem('tryingLogin', "0");

    console.log("memberShip role: " + this.memberShip);

    switch (this.memberShip) {
      case "ROLE_SINGLE":
        this.memberShipLabel = "Single membership";
        break;
      case "ROLE_DOUBLE":
        this.memberShipLabel = "Double membership";
        break;
    } //switch
  } //function

  public socialSignIn(socialPlatform:string) {

    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    console.dir(socialPlatformProvider)

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData);
        // Now sign-in with userData
        if (userData != null) {
          this.authorized = true;
          this.user = userData;
          this.socialData.email = userData.email
          this.socialData.first_name = userData.name
          this.socialData.socialId = userData.id
          this.socialData.socialNetwork = socialPlatformProvider

          //Check if user is registered
          this.autoLogin()

          this.isSocialSigned = true;


        }
      }
    );
  } //function

  /*registerUser({ value, valid }: { value: UserRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService.register(value.email, value.password, value.firstName, value.lastName, value.phone, value.plan, this.socialData.socialNetwork, this.socialData.socialId)
        .finally(() => this.isRequesting = false)
        .subscribe(
          result  => {
          if (result) {
            console.log("result: " + JSON.stringify(result));
            //this.router.navigate(['/login'], {queryParams: {brandNew: true, email: value.email}});
            //this.router.navigate(['/']);
            this.autoLogin();
          }
        },
          errors => {
          this.errors = errors;
          this.router.navigate(['/'])
        }
      );
    }
  } //function /// esta estaba cometada como fin

  public signOut() {
    this.socialAuthService.signOut();
    this.authorized = false;
  }

  launchFbLogin() {
    alert("Under construction...")
    //this.authWindow = window.open('https://www.facebook.com/v3.0/dialog/oauth?&response_type=token&display=popup&client_id=584557905264733&display=popup&redirect_uri=' + this.urlShareSN + 'facebook-auth.html&scope=public_profile', null, 'width=600,height=400');
  } //function

  handleMessage(event:Event) {
    const message = event as MessageEvent;
    // Only trust messages from the below origin.
    //if (message.origin !== "http://localhost:4200") return;

    this.authWindow.close();
    const result = JSON.parse(message.data);
    //alert(JSON.stringify(result))
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
            console.log(JSON.stringify(result))
            //Send to register page
            this.router.navigate(['/register'], {queryParams: {fb: JSON.stringify(result)}, skipLocationChange: true});

          }
        },
          error => {
          this.failed = true;
          this.error = error;
          //this.router.navigate(['/']);
        });


      /*this.userService.facebookLogin(result.accessToken)
       .finally(() => this.isRequesting = false)
       .subscribe(
       result => {
       if (result) {
       this.router.navigate(['/']);
       }
       },
       error => {
       this.failed = true;
       this.error = error;
       //this.router.navigate(['/']);
       }); /// esta estaba cometada como fin
    }
  } //function


  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    //this.subscription.unsubscribe();
  } //function

  login({ value, valid }: { value: Credentials, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    console.log("login cli: " + JSON.stringify(value))
    if (valid) {
      this.userService.login(value.email, value.password)
        .finally(() => this.isRequesting = false)
        .subscribe(
          result => {
          if (result) {
            console.log("result login comp: " + JSON.stringify(result))
            alert("result login comp: " + JSON.stringify(result))
            this.router.navigate(['/']);
          }
        },
          error => {
          //this.errors = error;
          //this.errors = error;
          this.errors = "We couldn't find an account with that email or password. Please verify your information ";
          ///alert("result login comp: " + JSON.stringify(this.errors))
          console.log("erores login: " + JSON.stringify(this.errors))
          //this.router.navigate(['/']);
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
          console.log("result login comp: " + JSON.stringify(result))
          //alert("result login comp: " + JSON.stringify(result))
          this.router.navigate(['/']);
        }
      },
        error => {
        localStorage.setItem('tryingLogin', "1");
        //this.errors = error;
        //this.errors = error;
        this.errors = "Login error. Please verify your information ";
        //alert("result login comp err: " + JSON.stringify(this.errors))
        console.log("erores login: " + JSON.stringify(this.errors))

        //this.router.navigate(['/']);
      }
    );

  } //function

  cancelRegister() {
    window.location.href = '';
  }


  clientLogout() {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '';
  } //function
} */
