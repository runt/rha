'use strict';

var rahApp = angular.module('rahApp');

rahApp.controller('rahController',function($scope){
    $scope.appName = 'rah';
});

rahApp.controller('pirController',function($scope,$http,$interval){
    function getPirLogs(pirname,limit,date){
	    $http.get('/rest/getpirslog?limit='+limit).success(function(data){
	    $scope.logdata = data;
	    });
    }

    $scope.limit=25;
    $scope.dt = new Date();
    var dt = $scope.dt;
    getPirLogs('jmeno pirka',$scope.limit,dt);
    
    $interval(function(){$scope.dt=new Date();},500);
});

rahApp.controller('camController',function($scope,$http){

    $scope.cams = [
	{
	    name:'rumation2',
	    description:'popis ke kamere',
	    active:true,
	    disabled:false
	},
	{
	    name:'rumation',
	    description:'popis ke kamere 2',
	    active:false,
	    disabled:false
	},
    ];
    
    $scope.camName = 'rumation2';
    
    function getCamFiles(camname,numfiles,date){
	if(numfiles>0){
	    $http.get('/rest/getcamnames?cam='+camname+'&numfiles='+numfiles+'&date='+date.getTime()).success(function(data){
	    $scope.restdata = data;
	    $scope.timelapseDir = '../../img/runnas_public'+data.camfolder+'/';
	    $scope.files = data.files;
	    });
	}
	else{
	    $scope.files=null;
	    $scope.timelapseDir='';
	}
    }
    
    $scope.numfiles=0;
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
    
    getCamFiles($scope.camName,$scope.numfiles,$scope.dt);
    
    $scope.numFilesSet = function(val){
	$scope.numfiles+=val;
	if($scope.numfiles<0) $scope.numfiles=0;
	$scope.numfilesChanged();
    }
    
    $scope.numfilesChanged = function(){
	getCamFiles($scope.camName,$scope.numfiles,$scope.dt);
    }
});
