package com.frauas.covidmobileapp.fcm;

import com.google.firebase.messaging.RemoteMessage;

public interface FCMListener {
    void onMessageReceived(RemoteMessage msg);
}
