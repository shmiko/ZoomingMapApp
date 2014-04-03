var app = angular.module('zoomingMapApp', [])
app.directive('map', function(){
  return {
    restrict: 'A',
    replace:true,
    transclude:true,
    templateUrl: 'map.html',
    controller:function($scope){
      this.updateZoom = function(zoomLevel){
        var approximateZoom = 8 + Math.round(zoomLevel / 40);

        $scope.map.setZoom(approximateZoom);
      }
    },
    link: function(scope, element, attrs) {
      var latitude = attrs.latitude;
      var longitude = attrs.longitude;
      var placeName = attrs.place;
      var zoomLevel = parseInt(attrs.zoom);
      var placeLatlng = new google.maps.LatLng(latitude,longitude);
      var mapOptions = {
        zoom: zoomLevel,
        center: placeLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
      scope.map = map;
      var marker = new google.maps.Marker({
        position: placeLatlng,
        map: map,
        title: placeName,
        animation: google.maps.Animation.DROP
      });
    }
  }
});
app.directive('dial', function(){
  return {
    restrict: 'A',
    replace:true,
    templateUrl: 'dial.html',
    require:'^map',
    link: function(scope, element, attrs, mapController) {
      var rotationSnap = 20;
      var rotationMin = 10;
      var rotationMax = 360;
      var dialValue = 0;
      var dial = document.getElementById('dial');
      Draggable.create(dial, {
        type:'rotation',
        throwProps:true,
        dragResistance :0.996,
        edgeResistance:0.9,
        bounds:{minRotation:rotationMin, maxRotation:rotationMax},
        snap:function(endValue) {
          //dialValue = Math.round(endValue / rotationSnap) * rotationSnap;
          dialValue = endValue;
          return endValue;
        },
        onThrowComplete:function() {
          mapController.updateZoom(dialValue);
        }
      });
      TweenMax.to(dial, 5, {css:{rotation:320},ease:Elastic.easeOut});
    }
  }
});