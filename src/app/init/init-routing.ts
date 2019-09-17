import { ModuleWithProviders } from '@angular/core';
import { RouterModule }        from '@angular/router';

import { CoverComponent } from './cover/cover.component'
import { SummaryComponent } from './summary/summary.component'
import {ExclusiveContentComponent} from "./exclusive-content/exclusive-content.component";


export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'initCover', component: CoverComponent},
  { path: 'initSummary', component: SummaryComponent},
  { path: 'exclusiveContent', component: ExclusiveContentComponent}
]);
