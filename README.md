# nativescript-google-fused-location
A script that uses Google Play Services to get the most accurate device location on Android devices in a NativeScript app.

Read the full story here https://medium.com/@daviddextermwangi/nativescript-fused-location-5a8c24a26a86#.afjnu4nyc

HOW TO USE

`
import { Component } from "@angular/core";
import { LocationService } from "./locate.service";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    constructor(){       
       
       let locationService = new LocationService();
       
       locationService.on("lastLocation",(eventData)=>{
           console.log(eventData.eventName + " has been raised! by: " + eventData.object);  
       })

       locationService.on("nolastLocation",(eventData)=>{
           console.log(eventData.eventName + " has been raised! by: " + eventData.object);
       })
       
       locationService.on("watcher",(eventData)=>{
           console.log(eventData.eventName + " has been raised! by: " + eventData.object);
       })
       
       
 }
}
`


