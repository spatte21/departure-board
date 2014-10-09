angular.module('departures', [
  'ngResource', 
  'ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '',
        templateUrl: '/partials/board',
        resolve: {
          releaseSvc: 'releaseSvc'
        },
        controller: function($scope, releaseSvc) {
          releaseSvc.all()
            .then(function(events) {
              $scope.events = events;    
            });
        }
      });
  });
