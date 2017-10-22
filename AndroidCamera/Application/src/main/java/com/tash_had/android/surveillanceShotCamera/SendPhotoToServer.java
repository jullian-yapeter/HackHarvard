package com.tash_had.android.surveillanceShotCamera;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;
import java.util.UUID;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


/**
 * Created by tash-had on 2017-10-21.
 */

public class SendPhotoToServer {
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    static OkHttpClient client;

    static void sendPhoto(HashMap<String, String> photoDetailsMap) throws IOException{
        client = new OkHttpClient();
        String URL = "https://ia8s1k2mhd.execute-api.us-west-2.amazonaws.com/dev/detect";
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("uuid", Config.uuid);
            for (String key : photoDetailsMap.keySet()){
                jsonObject.put(key, photoDetailsMap.get(key));
                Log.w("JSON_OBJECT_TAG", key + " " + photoDetailsMap.get(key));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
//        new makePostRequest().execute(URL, jsonObject.toString());
        Log.w("JSON_TAG", jsonObject.toString());
    }

    static void handleServerResponse(String responseString){

    }
    private static class makePostRequest extends AsyncTask<String, Integer, Boolean>{

        @Override
        protected Boolean doInBackground(String... strings) {
            // Create request body
            okhttp3.RequestBody  body = RequestBody.create(JSON, strings[1]);
            // Prepare request
            okhttp3.Request request = new Request.Builder()
                    .url(strings[0])
                    .addHeader("content-type", "application/json; charset=utf-8")
                    .post(body)
                    .build();
            // Send request
            okhttp3.Response response = null;
            try {
                response = client.newCall(request).execute();
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (response != null){
                String responseString =  response.body().toString();
                try {
                    Log.w("JSON_RESPONSE_TAG", response.body().string());
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return responseString.toLowerCase().equals("true");
            }return false;
        }

        @Override
        protected void onPostExecute(Boolean aBoolean) {
            super.onPostExecute(aBoolean);
            Toast.makeText(Config.cameraActivity, aBoolean.toString(), Toast.LENGTH_SHORT).show();
        }
    }
}
