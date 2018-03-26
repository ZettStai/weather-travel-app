
// https://developers.google.com/maps/documentation/javascript/examples/directions-simple
// https://developers.google.com/maps/documentation/distance-matrix/start
// https://www.aspsnippets.com/Articles/Google-Maps-V3-Calculate-Distance-Travel-Duration-draw-plot-Route-and-display-Directions-between-two-locations.aspx
// https://developers.google.com/maps/documentation/javascript/distancematrix
// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_parsing_the_results
// https://developers.google.com/maps/documentation/distance-matrix/policies

/* ======= Model ======= */

var model = {
  loc_start: 'San Jose, CA',
  loc_stop: 'San Francisco, CA',
  time_start: null,
  time_stop: null
};


/* ======= ViewModel ======= */

var viewModel = {
  init: function() {
    model.time_start = new Date(Date.now() + 300000);  // 5 minutes from now
    
    listView.init();
  },

  getStartLocation: function() {
    return model.loc_start;
  },
  
  getStopLocation: function() {
    return model.loc_stop;
  },
  
  getStartTime: function() {
    return model.time_start;
  },
  
  getStopTime: function() {
    return model.time_stop;
  },
  
  setStartTime: function(new_time) {
    model.time_start = new_time;
  },
  
  setStopTime: function(new_time) {
    model.time_stop = new_time;
  }
};


/* ======= View ======= */

var listView = {

  init: function() {
    this.loc_start = document.getElementById('loc-start');
    this.loc_stop = document.getElementById('loc-stop');
    this.time_start = document.getElementById('time-start');
    this.time_stop = document.getElementById('time-stop');
    
    this.render();
  },

  render: function() {    
    this.loc_start.textContent = viewModel.getStartLocation();
    this.loc_stop.textContent = viewModel.getStopLocation();
    this.time_start.textContent = viewModel.getStartTime().toLocaleTimeString();
    
    // Show map:
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);

    // Show route on map:
    directionsService.route({
      origin: viewModel.getStartLocation(),
      destination: viewModel.getStopLocation(),
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === 'OK') {
          // Does this line actually add the route to the map?
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [viewModel.getStartLocation()],
      destinations: [viewModel.getStopLocation()],
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: viewModel.getStartTime()
      }
    }, function (response, status) {
        var duration = response.rows[0].elements[0].duration_in_traffic.value;
        var new_time = new Date(viewModel.getStartTime().getTime() + duration*1000);
        viewModel.setStopTime(new_time);
        listView.updateStopTime();
    });
  }, 
  
  updateStopTime: function() {
    this.time_stop.textContent = viewModel.getStopTime().toLocaleTimeString();
  }
  // initMap: function() {
  // }, 

};


mapError = function() {
  // Handle google maps API error:
  console.log("There was an error loading the map.")
};

