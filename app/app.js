'use strict';

var rahApp = angular.module('rahApp', ['ui.bootstrap','ngRoute']);

rahApp.config(['$routeProvider',
    function($routeProvider){
	$routeProvider.
		when('/cameras',{
		    templateUrl:'partials/camera/camera.html',
		    controller:'camController'
		}).
		when('/pirs',{
		    templateUrl:'partials/pir/pir.html',
		    controller:'pirController'
		}).
		otherwise({redirectTo:'/cameras'});
    }]);
