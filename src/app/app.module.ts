import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { AuthenticateXHRBackend } from './authenticate-xhr.backend';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { routing } from './app.routing';

/* App Root */
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

//Public modules
import { InitModule } from './init/init.module';

//Private modules
import { AccountModule }  from './account/account.module';


import { ConfigService } from './shared/utils/config.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    InitModule,
    AccountModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  providers: [ConfigService, {
    provide: XHRBackend,
    useClass: AuthenticateXHRBackend
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
