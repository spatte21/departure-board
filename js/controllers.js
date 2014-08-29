var departuresApp = angular.module('departuresApp', []);

departuresApp.controller('DeparturesCtrl', function($scope, ReleaseSvc) {

    $scope.events = ReleaseSvc.all();

});