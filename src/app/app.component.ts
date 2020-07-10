import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

// import {
//     Plugins,
//     PushNotification,
//     PushNotificationToken,
//     PushNotificationActionPerformed
// } from '@capacitor/core';
// import {FCM} from 'capacitor-fcm';

// const {PushNotifications, Geolocation} = Plugins;
// const {FCMPlugin} = Plugins;
// const fcm = new FCM();

import {jsGlobalObjectValue} from '@angular/compiler-cli/src/ngtsc/partial_evaluator/src/known_declaration';
import {HttpClientService} from './services/http/http-client.service';
import {AuthService} from './services/auth/auth.service';
// import {
//     BackgroundGeolocation,
//     BackgroundGeolocationConfig,
//     BackgroundGeolocationEvents,
//     BackgroundGeolocationResponse
// } from '@ionic-native/background-geolocation/ngx';
import {GeoLocationService} from './services/location/geo-location.service';
import {from, Observable} from 'rxjs';
import {NotificationService} from './services/notification/notification.service';

// import {FCM} from '@ionic-native/fcm/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    private locationWatcher;
    private isSubscribed: boolean;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private http: HttpClientService,
        private auth: AuthService,
        private notification: NotificationService,
        // private backgroundGeolocation: BackgroundGeolocation,
        private geoLocationService: GeoLocationService
        // private firebaseMsg: FCM,
    ) {
        this.initializeApp();
    }

    ngOnInit(): void {
        console.log('Initializing App');
        // FCMPlugin.register()
        //     .then(token => {
        //         alert('token received: ' + token);
        //         console.log('token received: ', token);
        //     })
        //     .error(error => {
        //         alert('error occurred: ' + error);
        //         console.log('error during registration: ', error);
        //     });
    }

    ngOnDestroy(): void {
    }

    // private initNotificationService() {
    //
    //     // Request permission to use push notifications
    //     // iOS will prompt user and return if they granted permission or not
    //     // Android will just grant without prompting
    //     PushNotifications.requestPermission().then(result => {
    //         if (result.granted) {
    //             // Register with Apple / Google to receive push via APNS/FCM
    //             PushNotifications.register();
    //         } else {
    //             // Show some error
    //             alert(JSON.stringify(result));
    //         }
    //     });
    //
    //     // On success, we should be able to receive notifications
    //     PushNotifications.addListener('registration',
    //         (token: PushNotificationToken) => {
    //             alert('Push registration success, token: ' + token.value);
    //             console.log('PUSH NOTIFICATION REGISTRATION\nTOKEN: ' + JSON.stringify(token));
    //             // this.http.getNative('http://192.168.0.132:8085/send')
    //             //     .then(r => console.log('native get send', JSON.stringify(r)));
    //             this.http.postNative('/subscribe', {token: token.value})
    //                 .then(r => {
    //                     console.log('native post send', JSON.stringify(r));
    //                     this.auth.token = token.value;
    //                     this.initGeoLocationService();
    //                 });
    //             // this.http.get('http://192.168.0.132:8085/send').subscribe();
    //             // this.http.post('http://192.168.0.132:8085/token', {token: token.value, location: 'init'} as object).subscribe();
    //         }
    //     );
    //
    //     // Some issue with our setup and push will not work
    //     PushNotifications.addListener('registrationError',
    //         (error: any) => {
    //             console.log('PUSH NOTIFICATION REGISTRATION ERROR\n' + JSON.stringify(error));
    //             alert('Error on registration: ' + JSON.stringify(error));
    //         }
    //     );
    //
    //     // Show us the notification payload if the app is open on our device
    //     PushNotifications.addListener('pushNotificationReceived',
    //         (notification: PushNotification) => {
    //             console.log('PUSH NOTIFICATION RECEIVED\n' + JSON.stringify(notification));
    //             alert('Push received: ' + JSON.stringify(notification));
    //         }
    //     );
    //
    //     // Method called when tapping on a notification
    //     PushNotifications.addListener('pushNotificationActionPerformed',
    //         (notification: PushNotificationActionPerformed) => {
    //             console.log('PUSH NOTIFICATION PERFORMED\n' + JSON.stringify(notification));
    //             alert('Push action performed: ' + JSON.stringify(notification));
    //         }
    //     );
    // }

    /* private initFCMService() {
         this.firebaseMsg.subscribeToTopic('marketing');

         this.firebaseMsg.getToken().then(token => {
             // backend.registerToken(token);
             alert('token: ' + JSON.stringify(token));
             console.log('token', token);
         });

         this.firebaseMsg.onNotification().subscribe(data => {
             if (data.wasTapped) {
                 console.log('Received in background', data);
             } else {
                 console.log('Received in foreground', data);
             }
         });

         this.firebaseMsg.onTokenRefresh().subscribe(token => {
             // backend.registerToken(token);
             console.log('token refreshed: ', token);
         });

         // this.firebaseMsg.unsubscribeFromTopic('marketing');
     }*/

    // private initGeoLocationService() {
    //     this.geolocation.getCurrentPosition(
    //         (resp) => {
    //             // resp.coords.latitude
    //             // resp.coords.longitude
    //             console.log('position received: ', resp);
    //         },
    //         (error) => {
    //             console.log('Error getting location', error);
    //         });
    //
    //     const watch = this.geolocation.watchPosition((resp) => {
    //             // resp.coords.latitude
    //             // resp.coords.longitude
    //             console.log(resp);
    //         },
    //         (error) => {
    //             console.log('Error getting location', error);
    //         });
    // }

    // private initGeoLocationService() {
    //     // this.getCurrentPosition().then(x => console.log('GEOLOCATION DATA RECEIVED:'));
    //     this.geoLocationService.startWatch();
    // }

    // private getCurrentPosition() {
    //     return Geolocation.getCurrentPosition();
    // }

    // watchPosition() {
    // {
    //     "coords":
    //         {
    //             "latitude":50.1244914,
    //             "longitude":8.7585605,
    //             "accuracy":11.986000061035156,
    //             "altitude":160.70001220703125,
    //             "altitudeAccuracy":2,
    //             "speed":0.010653138160705566,
    //             "heading":47.901851654052734
    //         },
    //     "timestamp":1593124285699
    // }
    // const wait = Geolocation.watchPosition({}, (position, err) => {
    //     console.log('GEOLOCATION WATCH: ', JSON.stringify(position), err);
    // });
    // this.locationWatcher = setInterval(() => {
    //     this.getCurrentPosition().then(x => {
    //         this.processLocationData(x);
    //     });
    // }, 5 * 60 * 1000);


    // setTimeout(this.watchPosition, 5 * 60 * 1000);
    // }

    // private processLocationData(x) {
    //     //  todo: separate background and foreground data;
    //     //  todo: check if there is variation in location coordinates and skip sending to server if below threshold.
    //     this.geoLocationService.captureLocation(x);
    // }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // this.initBackGroundGeoLocationService();


            // this.initNotificationService();
            // this.initFCMService();


        });
    }

    private initBackGroundGeoLocationService() {
        // const config: BackgroundGeolocationConfig = {
        //     desiredAccuracy: 10,
        //     stationaryRadius: 20,
        //     distanceFilter: 30,
        //     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        //     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        // };
        //
        // this.backgroundGeolocation.configure(config)
        //     .then(() => {
        //         console.log('\n\n\n\n\n\n\n\n\nBACKGROUND GEO LOCATION SERVICE CONFIGURED\n\n\n\n\n\n\n\n');
        //         this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
        //             .subscribe((location: BackgroundGeolocationResponse) => {
        //                 console.log('background geolocation' + location);
        //                 this.geoLocationService.captureBackgroundLocation(location);
        //                 // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        //                 // and the background-task may be completed.
        //                 // You must do this regardless if your operations are successful or not.
        //                 // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //                 this.backgroundGeolocation.finish(); // FOR IOS ONLY
        //             });
        //
        //     });
        //
        // // start recording location
        // this.backgroundGeolocation.start();

    }
}
