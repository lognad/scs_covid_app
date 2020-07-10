import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';
import {ExploreContainerComponentModule} from '../explore-container/explore-container.module';

import {Tab2PageRoutingModule} from './tab2-routing.module';
import {MapComponent} from '../components/maps/olmap/map.component';
import {InfoPopUpComponent} from '../components/maps/shared/info-pop-up/info-pop-up.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab2PageRoutingModule
    ],
    declarations: [
        Tab2Page,
        MapComponent,
        InfoPopUpComponent
    ],
    entryComponents: [
        MapComponent
    ]
})
export class Tab2PageModule {
}
