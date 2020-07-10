import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {InfoPopUpComponent} from './info-pop-up.component';

describe('InfoPopUpComponent', () => {
    let component: InfoPopUpComponent;
    let fixture: ComponentFixture<InfoPopUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InfoPopUpComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(InfoPopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
