import {Injectable} from '@angular/core';
import {
    Plugins,
    PushNotification,
    PushNotificationToken,
    PushNotificationActionPerformed
} from '@capacitor/core';
import {HttpClientService} from '../http/http-client.service';
import {AuthService} from '../auth/auth.service';
import {Platform} from '@ionic/angular';

const {PushNotifications} = Plugins;


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClientService,
                private auth: AuthService,
                private platform: Platform) {
        this.initNotificationService();
    }


    private initNotificationService() {

        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        PushNotifications.requestPermission().then(result => {
            if (result.granted) {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
            } else {
                // Show some error
                alert(JSON.stringify(result));
            }
        });

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token: PushNotificationToken) => {
                alert('Push registration success, token: ' + token.value);
                console.log('PUSH NOTIFICATION REGISTRATION\nTOKEN: ' + JSON.stringify(token));
                // this.http.getNative('http://192.168.0.132:8085/send')
                //     .then(r => console.log('native get send', JSON.stringify(r)));
                this.http.postNative('/subscribe', {token: token.value})
                    .then(r => {
                        console.log('native post send', JSON.stringify(r));
                        this.auth.token = token.value;
                        // this.initGeoLocationService();
                    });
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error: any) => {
                console.log('PUSH NOTIFICATION REGISTRATION ERROR\n' + JSON.stringify(error));
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotification) => {
                console.log('PUSH NOTIFICATION RECEIVED\n' + JSON.stringify(notification));
                alert('Push received: ' + JSON.stringify(notification));
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
                console.log('PUSH NOTIFICATION PERFORMED\n' + JSON.stringify(notification));
                alert('Push action performed: ' + JSON.stringify(notification));
            }
        );
    }
}
