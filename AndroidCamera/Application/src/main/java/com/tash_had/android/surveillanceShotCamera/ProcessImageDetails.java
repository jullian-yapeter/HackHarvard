package com.tash_had.android.surveillanceShotCamera;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.support.v4.app.ActivityCompat;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.HashMap;

/**
 * Created by tash-had on 2017-10-21.
 */

public class ProcessImageDetails extends AsyncTask<String, Integer, HashMap<String, String>> {
    private HashMap<String, String> imageDetailsMap = new HashMap<>();
    private Context context;

    String timeStamp;
    LocationManager lm;
    String lon;
    String lat;
    Bitmap bitmap;

    public ProcessImageDetails(){
        super();
        context = Config.cameraActivity.getApplicationContext();
        setLatLon();
    }
    @Override
    protected HashMap<String, String> doInBackground(String... strings) {

        /**
         * trying to do the green comments below.
         * where im at:
         * In order for locationmanager to have context, it must get it from constructor. But constructor
         * must get it from class that called it (BasicCameraFragment). but basiccaerafragment is not an activity
         * and so it has no context and it must come from cameraactivity. how do i do that
         * */
        // convert to base 64
        // get location deets
        // timestamp comes from time picture is taken
        // another class will handle the sending of that data using the instance of dis class


        // OPTIMIZATION : IMPLEMENT THIS WITHOUT HAVING TO SAVE IMAGE.


        // Store path
//        String path = strings[0];

        // Convert to byte array
//        Bitmap bm = BitmapFactory.decodeFile(path);
//        String imagePath = strings[0];


        return this.imageDetailsMap;
    }

    void setImageData(){
        imageDetailsMap.put("timestamp", timeStamp);
        imageDetailsMap.put("lat", lat);
        imageDetailsMap.put("lon", lon);

        try{
            new EncodeImage().execute(this.bitmap);
        }catch (OutOfMemoryError e){
            e.printStackTrace();
        }
    }

//    void setImageWithFile(String file){
////        File imgFile = new File(file);
//        Bitmap bm = BitmapFactory.decodeFile(file);
//        this.bitmap = bm;
////        setImageAsBase64String();
//    }
//    private void setImageAsBase64String(){
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        this.bitmap.compress(Bitmap.CompressFormat.JPEG, 60, baos);
//        byte[] imageAsByteArray = baos.toByteArray();
//        String encodedImage = Base64.encodeToString(imageAsByteArray, Base64.DEFAULT);
//        imageDetailsMap.put("image", encodedImage);
//        Log.w("BSAE64_TAG", imageDetailsMap.get("image"));
//    }

    @Override
    protected void onPostExecute(HashMap<String, String> stringObjectHashMap) {
        super.onPostExecute(stringObjectHashMap);
    }
    private void setLatLon() {
        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        Location location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);

        this.lat = Double.toString(location.getLatitude());
        this.lon = Double.toString(location.getLongitude());
    }

    class EncodeImage extends AsyncTask<Bitmap, Integer, String>{
        String encodedImage;
        @Override
        protected String doInBackground(Bitmap... bitmaps) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmaps[0].compress(Bitmap.CompressFormat.JPEG, 90, baos);
            byte[] imageAsByteArray = baos.toByteArray();
            encodedImage = Base64.encodeToString(imageAsByteArray, Base64.NO_WRAP);
            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            imageDetailsMap.put("image", encodedImage);
        }
    }

}
