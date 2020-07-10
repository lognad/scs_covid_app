import {Component} from '@angular/core';

import {
    Plugins,
} from '@capacitor/core';
import {HttpClientService} from '../services/http/http-client.service';
import {AuthService} from '../services/auth/auth.service';

const {Geolocation} = Plugins;


@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    constructor(private http: HttpClientService, private auth: AuthService) {
    }

    async getCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log('GET CURRENT POSITION', JSON.stringify(coordinates));
        const coords = {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude};
        // if (this.auth.token) {
        this.http.postNative('/position', {token: this.auth.token, location: coords})
            .then(r => console.log('native post send', JSON.stringify(r)));
        // }
    }
}
