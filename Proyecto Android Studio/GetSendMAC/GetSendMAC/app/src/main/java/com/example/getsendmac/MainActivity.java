package com.example.getsendmac;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.Context;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.Priority;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Looper;
import android.os.StrictMode;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.RadioGroup;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.params.HttpConnectionParams;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.TestOnly;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import org.apache.*;
import java.net.MalformedURLException;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Collections;
import java.util.List;
import java.util.Locale;


import javax.net.ssl.HttpsURLConnection;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;




public class MainActivity extends AppCompatActivity {

    //Inicializar variables
    private Button getMAC, sendMAC, switch1;
    private TextView showMAC, request, response, miUbicacion;
    private String data;
    private FusedLocationProviderClient fusedLocationProviderClient;



    private void setterMAC(String data) {
        showMAC.setText(data);
    }

    private void setRequest(String data) {
        request.setText(data);
        request.setVisibility(View.VISIBLE);
    }

    private void setResponse(String data){
        response.setText(data);
        response.setVisibility(View.VISIBLE);

    }

    public void post (URL url) throws IOException {
        OkHttpClient client = new OkHttpClient();
        RequestBody formBody = new FormBody.Builder()
                .add("dato", data)
                .build();
        Request request = new Request.Builder()
                .url(url)
                .post(formBody)
                .build();
        Call call = client.newCall(request);
        Response response = call.execute();

        setRequest(request.toString());
        setResponse(response.toString());
    }

    public void postData (URL url) {



    }

    private void getLocation() {
        fusedLocationProviderClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() {
            @Override
            //TASK: API que representa llamadas a métodos asíncronas

            //Recibir una notificación cuando la tarea se realice correctamente
            public void onComplete(@NonNull Task<Location> task) {

                //Task completada con éxito

                //Iniciamos localización
                Location location = task.getResult();
                if (location != null){

                    try {
                        //Iniciamos geoCoder
                        Geocoder geocoder = new Geocoder(MainActivity.this,
                                Locale.getDefault());
                        //Inicializamos lista de direcciones
                        List<Address> direcciones = geocoder.getFromLocation(
                                location.getLatitude(),location.getLongitude(),1
                        );
                        //Latitud y longitud a texto
                        String texto =
                                "Latitud: " + String.format("%.3f", direcciones.get(0).getLatitude())  + "\n" +
                                        "Longitud: " + String.format("%.3f", direcciones.get(0).getLongitude()) + "\n" +
                                        "País: " + direcciones.get(0).getCountryName() + "\n" +
                                        "Localidad: " + direcciones.get(0).getLocality() + "\n" +
                                        "Dirección: " + direcciones.get(0).getAddressLine(0);
                        miUbicacion.setText(texto);



                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        //Asignar variables
        getMAC = findViewById(R.id.getMAC);
        showMAC = findViewById(R.id.showMAC);
        sendMAC = findViewById(R.id.sendMAC);
        request = findViewById(R.id.request);
        response = findViewById(R.id.response);
        switch1 = findViewById(R.id.switch1);
        miUbicacion = findViewById(R.id.miUbicacion);



        //Inicializamos fusedLocationProviderClient
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        //Variables globales
        data = "";

        getMAC.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                    try {
                            data = "";
                            List<NetworkInterface> networkInterfaceList = Collections.list(NetworkInterface.getNetworkInterfaces());


                            for (NetworkInterface networkInterface : networkInterfaceList) {
                                if (networkInterface.getName().equalsIgnoreCase("wlan0")) {
                                    for (int i = 0; i < networkInterface.getHardwareAddress().length; i++) {
                                        String stringMacByte = Integer.toHexString(networkInterface.getHardwareAddress()[i] & 0xFF);

                                        if (stringMacByte.length() == 1) {
                                            stringMacByte = "0" + stringMacByte;
                                        }
                                        data = data + stringMacByte.toUpperCase();
                                        if (i != networkInterface.getHardwareAddress().length - 1) {
                                            data = data + ":";
                                        }
                                    }
                                    break;
                                }
                            }
                            setterMAC(data);
                            sendMAC.setVisibility(View.VISIBLE);
                    }
                    catch (SocketException e) {
                        e.printStackTrace();
                    }

            }
        });



        sendMAC.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                try {
                    StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
                    URL url = new URL("https://elpais.com");
                    post(url);
                    Log.d("Posted:", "OK");
                }
                catch (Exception e) {
                    e.printStackTrace();
                    Log.d("Error:", e.toString());
                }



            }
        });


        switch1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Chequeamos permisos
                if(ActivityCompat.checkSelfPermission(MainActivity.this
                ,Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
                    //Cuando se da permiso
                    getLocation();
                }
                else {
                    //Cuando no se da permiso
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.ACCESS_FINE_LOCATION},44);
                }
            }
        });

    }


}