import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ShareButtonsModule } from '@ngx-share/buttons';
import { FormsModule }  from '@angular/forms';
import { UICarouselModule } from "ui-carousel";
import { NguCarouselModule } from '@ngu/carousel';
import {SlideshowModule} from 'ng-simple-slideshow';

//Video player
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';


//services and routing
import { InitService  } from './services/init.service';
import { routing } from './init-routing';

//components
import { CoverComponent } from './cover/cover.component';
import { SummaryComponent } from './summary/summary.component';
import { ExclusiveContentComponent } from './exclusive-content/exclusive-content.component';

@NgModule({
  imports: [
    CommonModule,
    UICarouselModule,
    NguCarouselModule,
    InfiniteScrollModule,
    HttpClientModule,
    ShareButtonsModule.forRoot(),
    FormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SlideshowModule,
    routing
  ],
  declarations: [CoverComponent, SummaryComponent, ExclusiveContentComponent],
  providers:    [ InitService ]
})
export class InitModule { }
