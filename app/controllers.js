'use strict';

var rahApp = angular.module('rahApp');

rahApp.controller('camController',function($scope,$http){
    
    $scope.numfiles=2;
    $scope.dt = new Date();
    $scope.format = 'dd.MM.yyyy';
    
    $scope.dateOptions = {
	startingDay: 1,
	showWeeks:false
    };
  
    
    $scope.open = function($event) {
	$event.preventDefault();
	$event.stopPropagation();
	$scope.opened = true;
    }
    
    $http.get('/rest/getcamnames?cam=rumation2&numfiles='+$scope.numfiles).success(function(data){
	$scope.restdata = data;
	$scope.timelapseDir = '../../img/runnas_public'+data.camfolder+'/';
	$scope.files = data.files;
    });
    
    $scope.numFilesSet = function(val){
	$scope.numfiles+=val;
	if($scope.numfiles<0) $scope.numfiles=0;
	$scope.numfilesChanged();
    }
    
    $scope.numfilesChanged = function(){
	$http.get('/rest/getcamnames?cam=rumation2&numfiles='+$scope.numfiles).success(function(data){
	$scope.restdata = data;
	$scope.timelapseDir = '../../img/runnas_public'+data.camfolder+'/';
	$scope.files = data.files;
	});
    }
    
    var getCamFiles = function(camname,numfiles){
	
    }

});
