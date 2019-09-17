import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular5-social-login";


//App
import { SharedModule }   from '../shared/modules/shared.module';
import { UserService }  from '../shared/services/user.service';
import { EmailValidator } from '../directives/email.validator.directive';
import { routing }  from './account.routing';
import { LoginFormComponent } from './login-form/login-form.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { SupportComponent } from './support/support.component';
import { PrivacyComponent } from './privacy/privacy.component';

// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("2098414726917851") //Titan23
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("1081574973026-5k5gusjpjv3jqe8dr9c68nqvc97oo1q2.apps.googleusercontent.com") //Titan23
      },
    ]
);
  return config;
}

@NgModule({
  imports: [
    CommonModule,FormsModule,routing,SharedModule,
    SocialLoginModule, BrowserModule, BrowserAnimationsModule,
    UiSwitchModule.forRoot({
      size: 'small',
      checkedLabel: 'following',
      uncheckedLabel: 'unfollowing'
    })
  ],
  declarations: [EmailValidator, LoginFormComponent, UpgradeComponent, SupportComponent, PrivacyComponent],
  providers:    [ UserService, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  } ]
})
export class AccountModule { }
