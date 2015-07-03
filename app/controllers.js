'use strict';

var rahApp = angular.module('rahApp');

rahApp.controller('rahController',function($scope){
    $scope.appName = 'rah';
});

// PIR controller --------------------------------------------------------------
rahApp.controller('pirController',function($scope,$http,$interval){
    var led1;
    var sock;
    function getPirLogs(pirname,limit,date){
	    $http.get('/rest/getpirslog?limit='+limit).success(function(data){
	    $scope.logdata = data;
	    });
    }

    function init(){
        led1 = new steelseries.Led('canvasLed1', {
                            width: 50,
                            height: 50
                            });
        led1.setLedColor(steelseries.LedColor.GREEN_LED);
        led1.setLedOnOff(false);
        
        sock = new WebSocket('ws://'+window.location.host+'/ws/pir');
        sock.onopen = function(){ 
		    console.log("Connected websocket");
		    console.log("Sending ping..");
                    sock.send("Ping!");
		    console.log("Ping sent..");
		  };
        sock.onerror = function(){ console.log("Websocket error"); };
        sock.onmessage = function(evt){
            //var pirData = JSON.parse(evt.data);
            console.log(evt.data);
            $scope.pirdata=evt.data;
            if(evt.data=="1"){
                $scope.alertTyp="alert-danger";
                led1.setLedColor(steelseries.LedColor.RED_LED);
                led1.setLedOnOff(true);
                getPirLogs('jmeno pirka',$scope.limit,$scope.dt);
            }
            else{
                $scope.alertTyp="alert-success";
                led1.setLedColor(steelseries.LedColor.GREEN_LED);
                led1.setLedOnOff(false);
            }
	};
        
        
    }
    $scope.pirdata=null;
    $scope.limit=10;
    $scope.dt = new Date();
    $scope.alertTyp="alert-success";
    var dt = $scope.dt;
    init();
    getPirLogs('jmeno pirka',$scope.limit,dt);
    
    $interval(function(){
        $scope.dt=new Date();
    },500);
});
//------------------------------------------------------------------------------




rahApp.controller('camController',function($scope,$http){

    $scope.cams = [
	{
	    name:'rumation2',
	    description:'obývací pokoj',
	    active:true,
	    disabled:false
	},
	{
	    name:'rpipokojik',
	    description:'dětský pokoj',
	    active:false,
	    disabled:false
	},
    ];
    
    $scope.camName = 'rumation2';
    
    $scope.takePictureNow = function(){
	$scope.numfiles = 1;
	var now = new Date();
	$scope.dt = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59,999);
	console.log('takePictureNow');
	$http.get('/rest/takepicturenow?cam='+$scope.camName).success(function(data){
	    $http.get('/rest/getcamnames?cam='+$scope.camName+'&numfiles='+$scope.numfiles+'&date='+$scope.dt.getTime()).success(function(data){
		$scope.restdata = data;
		$scope.timelapseDir = '../../img/runnas_public'+data.camfolder+'/';
		$scope.files = data.files;
	    });
	});
    }
    
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
    
    $scope.numfiles=1;
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
