 // var token = $('[ng-controller="add"]').scope().tdata;
 // localStorage.setItem("storageKey", "storedValueGoesHere"); //save into local storage
 // console.log(localStorage.getItem("token")); //get value from local storage
 // console.log(test);
 // var street_name = $('[ng-controller="add"]').scope().streetName;
 // var app = angular.module('myApp', ['ngStorage']).controller('myCtrl', function($scope, $http, $window, $localStorage) {

 map = new L.Map('map', {
     zoomControl: false
 });
 // L.control.zoom({
 //     position: 'bottomright'
 // }).addTo(map);


 var marker;
 var circles;
 // create the tile layer with correct attribution
 var osmUrl = 'http://49.156.148.124/map/{z}/{x}/{y}.png';
 // var osmAttrib='Map data Â© <a href="http://openstreetmap.org"> OpenStreetMap</a> contributors';
 var osm = new L.TileLayer(osmUrl, {
     minZoom: 5,
     maxZoom: 20
 });

 // start the map in South-East England
 map.setView(new L.LatLng(17.4457309, 78.4881306), 9);
 map.addLayer(osm);



 setInterval(getLoc, 10000);

 function getLoc() {
     // body...
     console.log("getLoc is in action.!");
     $('.leaflet-marker-pane,.leaflet-shadow-pane').html('');
     $.ajax({
         url: 'http://49.156.148.124:8080/workforce/track/td',
         headers: {
             "X-AUTH-TOKEN": localStorage.getItem("token")
         },
         async: false,
         success: function(response) {
             var res = response.Tracks;
             // alert()
             for (var i = 0; i < res.length; i++) {
                 if (res[i].track != null) {
                     appendMarker(res[i].track['loc']['lat'], res[i].track['loc']['lng'], res[i].name, res[i]['currentTrack']['trackkey'], res[i]['track']['bat'], res[i]['currentTrack']['tstat'], res[i]['currentTrack']['startedat'], res[i]['currentTrack']['endedat'], '12332', res[i]['currentTrack']['kmtr'], res[i]['currentTrack']['exeid']);
                 }
                 if (res[i]['currentTrack']['trackkey'] == null) {
                     $('.leaflet-overlay-pane svg g').html('');
                 }

             }
         }
     });

 }
 getLoc();
 // var z = 1;
 // setInterval(logs, 1000);

 // function logs() {
 //     // body...

 //     console.log(z++);
 // }


 // alert(JSON.stringify(ex));



 function viewTrack(loc) {
     // body...
     for (var i = 0; i < loc.length; i++) {
         // viewTrack(tr[i]['loc']['lat'],tr[i]['loc']['lng']);
         circles = new L.circle([loc[i]['loc']['lat'], loc[i]['loc']['lng']], {
             color: 'blue',
             fillColor: 'blue',
             fillOpacity: 1,
             radius: 0.2
         });
         map.addLayer(circles);
         if (i > 0) {
             var polyline = L.polyline([
                 [loc[i - 1]['loc']['lat'], loc[i - 1]['loc']['lng']],
                 [loc[i]['loc']['lat'], loc[i]['loc']['lng']]
             ], {
                 color: 'red'
             }).addTo(map);
             // zoom the map to the polyline
             map.fitBounds(polyline.getBounds());
         }

     }
 }

 function appendMarker(lat, lng, msg, tk, bat, stat, st, et, id, dis, exeid) {


     marker = new L.Marker([lat, lng]);
     var d = new Date(st);
     marker.bindPopup("<b class='getinfo' id='" + tk + "' data-battery='" + bat + "'   data-status='" + (stat == 'TRACK_STARTED' ? 'Started' : 'NotStarted') + "' data-distance='" + dis + " km'  data-stime='" + d.getHours() + ":" + d.getMinutes() + " " + d.getSeconds() + "' data-etime='" + (et == null ? 0 : et) + "' data-id='" + id + "'  data-exeid='" + exeid + "'>" + msg + "</b></br><span class='gettrack' style='color:blue'>more info</span>").openPopup();
     map.addLayer(marker);
 }

 $(document).on('click', '.gettrack', function() {
     // event.preventDefault();
     /* Act on the event */
     // alert(this.id);

     // $('.leaflet-overlay-pane svg g').html('');
     // $('.leaflet-overlay-pane svg g').attr('id', this.id);
     // $.ajax({
     //     url: 'http://49.156.148.124:8080/workforce/track/td/' + this.id,
     //     headers: {
     //         "X-AUTH-TOKEN": $localStorage.TOKEN
     //     },
     //     async: false,
     //     success: function(response) {
     //         var tr = response.Locations;
     //         // alert(JSON.stringify(res));
     //         viewTrack(tr);
     //     }
     // });

     $(".Einfo .id .info-data").html($('.getinfo').attr('data-id'));
     $(".Einfo .name .info-data").html($('.getinfo').html());
     $(".Einfo .battery .info-data").html($('.getinfo').attr('data-battery'));
     $(".Einfo .status .info-data").html($('.getinfo').attr('data-status'));
     $(".Einfo .distance .info-data").html($('.getinfo').attr('data-distance'));
     $(".Einfo .stime .info-data").html($('.getinfo').attr('data-stime'));
     $(".Einfo .etime .info-data").html($('.getinfo').attr('data-etime'));
     $(".clocktrack .track").attr('id', $('.getinfo').attr('id'));
     $(".Einfo .exeid .info-data").html($('.getinfo').attr('data-exeid'));
     $(".Einfo").css({
         'display': 'block'
     });

 });

 $(document).on('click', '.clocktrack>.track', function() {
     $('.leaflet-overlay-pane svg g').html('');
     $('.leaflet-overlay-pane svg g').attr('id', this.id);
     $.ajax({
         url: 'http://49.156.148.124:8080/workforce/track/td/' + this.id,
         headers: {
             "X-AUTH-TOKEN": localStorage.getItem("token")
         },
         async: false,
         success: function(response) {
             var tr = response.Locations;
             // alert(JSON.stringify(res));
             viewTrack(tr);
         }
     });

 });


 var logo = L.control({
     position: 'bottomleft'
 });
 logo.onAdd = function(map) {
     this._div = L.DomUtil.create('div', 'myControl');
     var img_log = '<img src="http://www.neemiit.com/wp-content/uploads/2017/04/cropped-neemcropped.png" alt="NEEMiiT" class="NEEMMiiT"/>';
     this._div.innerHTML = img_log;
     return this._div;

 }
 logo.addTo(map);









 // });