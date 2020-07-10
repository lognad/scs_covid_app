import {Injectable, OnDestroy} from '@angular/core';
import {HttpClientService} from '../http/http-client.service';
import {AuthService} from '../auth/auth.service';
// import {BackgroundGeolocationResponse} from '@ionic-native/background-geolocation';
import {Coordinates} from '../../models/Coordinates';
import {BehaviorSubject, Subject} from 'rxjs';
import {LocationHelper} from '../../utils/map/LocationHelper';
import {InfoService} from '../data/info.service';
import {Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';

const {Geolocation} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService implements OnDestroy {

    areaPolygonData: any;

    currentUserLocation: Subject<Coordinates> = new BehaviorSubject(null);
    private tmpTimer: any;
    private x = [
        {lat: 8.6987194, lng: 50.1094499} as Coordinates,
        {lat: 8.6987084, lng: 50.1094499} as Coordinates,
        {lat: 8.6950259, lng: 50.1114096} as Coordinates,
        {lat: 8.6825043, lng: 50.1151804} as Coordinates,
        {lat: 8.6825043, lng: 50.1150914} as Coordinates,
        {lat: 8.6890106, lng: 50.1205127} as Coordinates,
        {lat: 8.6631302, lng: 50.1268061} as Coordinates,
    ];
    private counter = 0;
    private locationWatcher;

    constructor(private http: HttpClientService,
                private platform: Platform,
                private auth: AuthService,
                private infoService: InfoService) {
        // todo: initial value of user location. chane realtime location later
        this.currentUserLocation.next({lat: 8.7126998, lng: 50.1350391} as Coordinates);
        this.sendDummy();

        this.currentUserLocation.subscribe(x => {
            this.checkUserLocation(x);
        });


        this.platform.pause.subscribe(value => {
            clearInterval(this.locationWatcher);
            clearTimeout(this.tmpTimer);

            console.log('PLATFORM PAUSED');
        });
        this.platform.resume.subscribe(value => {
            this.sendDummy();
            this.startWatch();

            console.log('PLATFORM RESUMED');
        });
    }

    ngOnDestroy(): void {
        if (this.locationWatcher) {
            clearInterval(this.locationWatcher);
        }
    }


    private sendDummy() {
        clearTimeout(this.tmpTimer);
        this.tmpTimer = setTimeout(
            () => {
                this.currentUserLocation.next(this.x[this.counter % this.x.length]);
                this.counter = this.x.length === this.counter++ ? 0 : this.counter;
                this.sendDummy();
            }, 5 * 1000
        );
    }

    captureLocation(data) {
        console.log('LOCATION DATA: ' + data);
        const coords = {lat: data.coords.latitude, lng: data.coords.longitude} as Coordinates;
        this.pushLocation(coords);
        this.notifyUserLocation(coords);
    }

    captureBackgroundLocation(data/*: BackgroundGeolocationResponse*/) {
        console.log('LOCATION DATA: ' + data);
        const coords = {lat: data.latitude, lng: data.longitude} as Coordinates;
        this.pushLocation(coords);
    }

    notifyUserLocation(coords: Coordinates): void {
        this.currentUserLocation.next(coords);
    }

    private pushLocation(coords: Coordinates): void {
        this.http.postNative('/position', {token: this.auth.token, location: coords})
            .then(r => console.log('native post send', JSON.stringify(r)));
    }

    private checkUserLocation(coords: Coordinates) {
        this.infoService.getInfos();

        if (this.areaPolygonData) {
            const isUserInAffectedArea = LocationHelper.isInside(this.areaPolygonData, this.areaPolygonData.length, coords);
            console.log('user in affected area : ', isUserInAffectedArea);
        }
    }

    setAreaPolyonData(d) {
        this.areaPolygonData = d;
    }

    startWatch() {
        console.log('starting geo location watch');
        this.locationWatcher = setInterval(() => {
            this.getCurrentPosition().then(x => {
                console.log('LOCATION RECEIVED' + JSON.stringify(x));
                this.processLocationData(x);
            });
        }, 60 * 1000);
    }

    private getCurrentPosition() {
        return Geolocation.getCurrentPosition();
    }

    private processLocationData(x) {
        //  todo: separate background and foreground data;
        //  todo: check if there is variation in location coordinates and skip sending to server if below threshold.
        this.captureLocation(x);
    }
}
