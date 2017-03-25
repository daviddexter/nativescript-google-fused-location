import * as application from "application";
import { Observable,EventData } from "data/observable";

declare const com:any;
let location = android.location.Location;
let connectionResult = com.google.android.gms.common.ConnectionResult;
let googleApiClient =  com.google.android.gms.common.api.GoogleApiClient;
let locationListener = com.google.android.gms.location.LocationListener;
let locationRequest = com.google.android.gms.location.LocationRequest;
let locationServices = com.google.android.gms.location.LocationServices;

const UPDATE_INTERVAL_IN_MILLISECONDS = 10000;
const FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = UPDATE_INTERVAL_IN_MILLISECONDS/2;

export class LocationData{
    latitude:any
    longitude:any
}

export class LocationService extends Observable{   
    public _lastLocationData:LocationData;
    public gApiClient:any

    constructor(){ 
        super()
        this._lastLocationData = new LocationData();
        let isAvailble = com.google.android.gms.common.GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(application.android.context);
        let conRes = com.google.android.gms.common.ConnectionResult.SUCCESS;        
        if(isAvailble === conRes){
            this.locationLocator();
        }                       
    }
    
    public locationLocator(){
        console.log("calling locator");
        let currentLocation:any;
        let callbackConnection = new googleApiClient.ConnectionCallbacks({             
            onConnected:function(){
                console.log("Connected called");
                let isLocationAvailable = locationServices.FusedLocationApi.getLocationAvailability(this.gApiClient);
                if(isLocationAvailable.isLocationAvailable()){
                    currentLocation = locationServices.FusedLocationApi.getLastLocation(this.gApiClient); 
                    console.log(currentLocation);              
                    this.serializeLocation(currentLocation); 
                    let eventData: EventData = {eventName: "lastLocation",object: this} 
                    this.notify(eventData) 
                }else{                    
                   let eventData: EventData = {eventName: "nolastLocation",object: this} 
                   this.notify(eventData)  
                }
            }.bind(this),
            onConnectionSuspended:function(){                
                console.log("Connection suspended");
            }.bind(this)
        })

        let callbackFailed = new googleApiClient.OnConnectionFailedListener({
            onConnectionFailed:function(){               
               console.log("Connection failed"); 
            }.bind(this)
        })

         this.gApiClient = new googleApiClient.Builder(application.android.context)
                        .addConnectionCallbacks(callbackConnection)
                        .addOnConnectionFailedListener(callbackFailed)                       
                        .addApi(locationServices.API)
                        .build();                
        this.gApiClient.connect();           
        
    }

    public serializeLocation(location){
        //console.log(location);       
       this._lastLocationData.latitude = location.getLatitude();
       this._lastLocationData.longitude = location.getLongitude();
    }

    public getTheLastLocation(){
        return this._lastLocationData;
    }

    public watchLocationRequest(){ 
        console.log("watcher called");     
        let createRequest = new locationRequest();
        createRequest.setInterval(UPDATE_INTERVAL_IN_MILLISECONDS);
        createRequest.setFastestInterval(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS);
        createRequest.setPriority(locationRequest.PRIORITY_HIGH_ACCURACY); 
        createRequest.setNumUpdates(1)

        let theLocationListener = new locationListener({
            onLocationChanged:function(location){                
                 this.serializeLocation(location);
                 let eventData: EventData = {eventName: "watcher",object: this} 
                 this.notify(eventData)            
            }.bind(this)            
        });
        locationServices.FusedLocationApi.requestLocationUpdates(this.gApiClient,createRequest,theLocationListener);
        
    }  

    
}