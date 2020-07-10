package com.frauas.covidmobileapp.fcm;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import static android.content.ContentValues.TAG;

@NativePlugin()
public class FCMPlugin extends Plugin {
    FCMImplementation fcm;

    @PluginMethod()
    public void register(PluginCall call) {

        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w(TAG, "getInstanceId failed", task.getException());
                    call.reject("getInstanceId failed" + task.getException());
                    return;
                }

                // Get new Instance ID token
                String token = task.getResult().getToken();

                // Log and toast
                // String msg = getString(R.string.msg_token_fmt, token);
                Log.d(TAG, "Token" + token);
                // Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                JSObject ret = new JSObject();
                ret.put("token", token);

                call.resolve(ret);

                Toast.makeText(fcm, "fcm instantiated", Toast.LENGTH_SHORT).show();
            }
        });

    }
}
