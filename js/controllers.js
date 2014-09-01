var departuresApp = angular.module('departuresApp', ['ngResource']);

departuresApp.controller('DeparturesCtrl', function($scope, ReleaseSvc) {

    ReleaseSvc.all().then(function(events) {
        console.log(events);
        $scope.events = events;    
    });

});