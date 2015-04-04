var XMap = (function(){

    //Base options to set map
    var mapOptions = {
        center: {
            lat: 41.29246,
            lng: 12.5736108
        },
        zoom: 6
    }

    //Markers container
    var markers = [];

    //Object to contain map
    var map;

    /*
     * Private function to remove specified marker
     */
    var removeMarker = function(marker){
        marker.setMap(null);
        var pos = markers.indexOf(marker);
        markers.splice(pos, 1);
    }

    /*
     * Function to add specified markers
     * @Param obj = {
     *      lat: numer,
     *      lng: number,
     *      name: string
     * }
     */
    var addMarker = function(obj){

        //Set default postion if obj is not defined
        var position = obj != undefined ? new google.maps.LatLng(obj.lat, obj.lon) : map.getCenter();

        //Make new marker
        var marker = new google.maps.Marker({
            map: map,
            position: position
        });

        //Add listener to rightclick event
        marker.addListener('rightclick', function(){
            removeMarker(marker);
        });

        //Add marker in container
        markers.push(marker);

        //Add information only if obj is defined
        if(obj != undefined){
            var infowindow = new google.maps.InfoWindow();

            infowindow.setContent('<b>'+obj.name+'</b>');

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }

    }

    //Public functions
    return{
        init: function(){
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            map.setOptions({disableDoubleClickZoom: true });
            
            map.addListener('dblclick', function(event){
                addMarker({
                    lat: event.latLng.lat(),
                    lon: event.latLng.lng(),
                    name: event.latLng.lat() + " " + event.latLng.lng()
                })
            });

        },
        center: function(){
            map.setZoom(16);
            map.setCenter(new google.maps.LatLng(42.0464645, 14.7283107));
        },
        setCenter: function(zoom, lat, lon){
            map.setZoom(zoom);
            map.setCenter(new google.maps.LatLng(lat, lon));
        },
        addMarker: addMarker,
        removeMarkers: function(){
            for(i in markers){
                markers[i].setMap(null);
            }
            markers = [];
        }

    }


})();
/*
 * Function to take city list
 */
var CityList = (function(){
    
    //List of city
    var list;

    /*
     * Easy async task implementation
     */
    var call = function(file, callback){
        var request = new XMLHttpRequest();
        request.open("GET","cities.json",true);
        request.send();

        var interval = setInterval(
            function(){
                if(request.status){
                    clearInterval(interval);
                    callback(JSON.parse(request.responseText));
                }
            },10
        );
    }

    /*
     * Function to interact with DOM
     */
    var repeat = function(info){

        var element = document.getElementById("container-city");

        var div = document.createElement("div");
        div.className = "city-list";

        var text = document.createTextNode(info.name);
        div.appendChild(text);

        div.onclick = function(){
            XMap.setCenter(info.zoom || 12, info.lat, info.lon);
        }

        element.appendChild(div);
    }

    //Public functions
    return {
        init: function(){
            call("cities.json", function(data){
                list = data;
                for(i in list){
                    repeat(list[i]);
                }
            });



        },
        addCityMarkers: function(){
            for(i in list){
                XMap.addMarker(list[i]);
            }
        }
    }



})();

XMap.init();
CityList.init();
