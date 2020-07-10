import {Component} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Coordinates} from '../models/Coordinates';
import {GeoLocationService} from '../services/location/geo-location.service';
import {ToastController} from '@ionic/angular';
import {falseIfMissing} from 'protractor/built/util';
import {Vibration} from '@ionic-native/vibration/ngx';


@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    currentUserLocation: Subject<Coordinates> = new BehaviorSubject(null);

    private isToastDisplayed: boolean;
    private toast: HTMLIonToastElement;

    constructor(public locationService: GeoLocationService,
                private toastController: ToastController,
                private vibration: Vibration
    ) {
    }

    handleMapEvent(evt: { type: string, data: any }) {
        if (evt && evt.type === 'toast') {
            if (!evt.data.status) {
                if (this.toast) {
                    this.toast.dismiss();
                }
                this.isToastDisplayed = false;
                return;
            }
            let msg = '';


            // todo: if area is same as the one being displayed in the toast, skip showing new toast.
            if (evt.data.info.active > 20) {
                msg = `Careful!! You entered a highly affected COVID-19 region.
Total cases: ${evt.data.info.total}
Active cases: ${evt.data.info.active}`;
            } else if (evt.data.info.active > 10) {
                msg = `You entered an affected COVID-19 region.
Total cases: ${evt.data.info.total}
Active cases: ${evt.data.info.active}`;
            }

            if (!this.isToastDisplayed) {
                this.presentToastWithOptions(
                    msg, evt.data.status);
            } else {
                this.toast.message = msg;
                this.toast.color = evt.data.status;
            }

        }
    }

    async presentToastWithOptions(msg: string, bgColor?: string) {
        this.toast = await this.toastController.create({
            header: 'Warning',
            message: msg,
            // duration: 5000,
            position: 'bottom',
            color: bgColor || '',
            buttons: [
                {
                    side: 'start',
                    icon: 'warning',
                    // text: 'Favorite',
                    handler: () => {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.toast.onDidDismiss().then(() => {
            this.isToastDisplayed = false;
            console.log('toast dismissed');
            this.vibration.vibrate(0);
        });
        this.toast.present().then(() => this.isToastDisplayed = true);

        this.vibration.vibrate([1000, 1000, 1000]);
    }
}
