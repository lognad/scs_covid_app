package com.frauas.covidmobileapp;

import android.os.Bundle;


import com.frauas.covidmobileapp.fcm.FCMImplementation;
import com.frauas.covidmobileapp.fcm.FCMPlugin;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.plugin.Geolocation;

import java.util.ArrayList;

// import io.stewan.capacitor.fcm.FCMPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            // Additional plugins you've installed go here
            // Ex: add(TotallyAwesomePlugin.class);
            // add(FCMPlugin.class);
            // add(Geolocation.class);
        }});
    }
}
