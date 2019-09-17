import { ModuleWithProviders } from '@angular/core';
import { RouterModule }        from '@angular/router';


import { LoginFormComponent }    from './login-form/login-form.component';
import { UpgradeComponent }    from './upgrade/upgrade.component';
import {PrivacyComponent} from "./privacy/privacy.component";
import {SupportComponent} from "./support/support.component";

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'login', component: LoginFormComponent},
  { path: 'upgrade', component: UpgradeComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'support', component: SupportComponent}

]);
