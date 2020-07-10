package com.frauas.covidmobileapp.fcm;

import android.app.ActivityManager;
import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.frauas.covidmobileapp.MainActivity;
import com.frauas.covidmobileapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import static android.content.ContentValues.TAG;
// 2020-06-08 03:53:45.856 16506-16506/com.frauas.covidmobileapp D/ContentValues: eGIHPwf4RUyXfTHBIlrqWU:APA91bGjyfsLXevZFPr9QRRIW3FDcdswzrPp__lMy6Dbhr1JIhUJ2mKdPmi4cbx7FuszsLLedYR_toZSxMayQv2YCabG6Yk4UhRztgYqEiyipQAqsBn22q_MmT6zSyUYv_UJtxrFgsea

public class FCMImplementation extends FirebaseMessagingService {

    public FCMImplementation() {
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String token = task.getResult().getToken();

                        // Log and toast
                        // String msg = getString(R.string.msg_token_fmt, token);
                        Log.d(TAG, "Token: " + token);
                        // Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                        sendRegistrationToServer(token);
                    }
                });
    }

    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the InstanceID token
     * is initially generated so this is where you would retrieve the token.
     */
    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        sendRegistrationToServer(token);
    }


    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        String msg = "\n\n\n\n\nReceived message: \n" +
                "title: " + remoteMessage.getNotification().getTitle() + "\n" +
                "body: " + remoteMessage.getNotification().getBody();
        Log.d(TAG, msg);
    }

    private boolean isAppOnForeground(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    private void sendRegistrationToServer(String token) {
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = "http://192.168.0.132:8085/token";

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("token", token);
            jsonObject.put("location", "just testing");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonObjectRequest jsonObjReq = new JsonObjectRequest(
                Request.Method.POST,
                url,
                jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, "Response is: " + response.toString());
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d(TAG, "Error Occured ");
                    }
                }
        );

// Add the request to the RequestQueue.
        queue.add(jsonObjReq);
    }
}
