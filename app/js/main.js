(function(){
	var root = this,
		require = root.require;

	 //fake 'has' if it's not available
	var has = root.has = root.has || function() {
	    return false;
	};

	require.config({
		paths: {
			angular: '../bower_components/angular/angular',
			//angularAnimate: '../bower_components/angular-animate/angular-animate',
			angularCookies: 		'../bower_components/angular-cookies/angular-cookies',
			angularRoute: 			'../bower_components/angular-route/angular-route',
			angularResource: 		'../bower_components/angular-resource/angular-resource',
			angularMocks: 			'../bower_components/angular-mocks/angular-mocks',
			angularLoadingBar : 	'../bower_components/angular-loading-bar/src/loading-bar',
			text: 					'../bower_components/requirejs-text/text',
			angularXeditable: 		'../bower_components/angular-xeditable/dist/js/xeditable',
			socketIO: 				'../bower_components/socket.io-client/dist/socket.io',
			jquery: 				'../bower_components/jquery/dist/jquery',
			bootstrapswitch: 		'../bower_components/bootstrap-switch/dist/js/bootstrap-switch',
			require: 				'../bower_components/requirejs/require',
			underscore: 			'../bower_components/underscore/underscore',
			bootstrap: 				'../bower_components/bootstrap/dist/js/bootstrap',
			angularBootstrap:  		'../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
			routingConfig :  		'./routingConfig',
			placeholder:  			'../bower_components/angular-placeholders/demo/assets/ui-bootstrap-tpls-0.1.0-SNAPSHOT.min',
			//jquery-jqplot-->Map.html
			jqplot: 				'../bower_components/jqplot/jquery.jqplot.min',
			bubbleRenderer: 		'./map/jqplot.bubbleRenderer',
			labelRenderer: 			'./map/jqplot.canvasAxisLabelRenderer.min',
			pieRenderer:  			'./map/jqplot.pieRenderer',
			textRenderer: 			'./map/jqplot.canvasTextRenderer.min',
			tree: 					'./map/bootstrap-tree',
			domReady:   			'../bower_components/requirejs-domready/domReady',
			labelBase:   			'./utils/labelBase',
			//highchart
			highchart:     			'../bower_components/highcharts/highcharts',
			highcharts:  			'../bower_components/highcharts-ng/src/highcharts-ng',
			angularBootstrapSwitch: '../bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch'
			//export
			//generatedata:'./jqxGrid/generatedata',
			//jqxgrid:'./jqxGrid/jqxgrid'
		},
		baseUrl: 'js',
		shim: {
			'angular' : {'exports' : 'angular'},
			'angularRoute': ['angular'],
			'angularResource':['angular'],
			'angularCookies': ['angular'],
			'angularMocks': {
				deps:['angular'],
				'exports':'angular.mock'
			},
			'angularXeditable': ['angular'],
			'bootstrap':['jquery'],
			'angularBootstrap':['jquery','bootstrap','angular'],
			'angularLoadingBar' : ['angular'],
			'jqplot':['jquery'],
			'jqxgrid':['jquery'],
			'bubbleRenderer':['jqplot','jquery'],
			'labelRenderer':['jqplot','jquery'],
			'textRenderer':['jqplot','jquery'],
			'tree':['jquery'],
			'highcharts':['jquery','angular','highchart'],
			'bootstrapswitch' : ['jquery'],
			'angularBootstrapSwitch':['angular','jquery','bootstrapswitch'],
			},
		priority: [
			"angular"
		],
		waitSeconds : 2000, //2000 seconds for prod mode on bootstrap and 2 seconds for dev mode

	});

	//this requires dom ready to update on ui, so this function expression
	//will be implemented later when domReady.
	var updateModuleProgress = function(context, map, depMaps) {
	    //when dom is not ready, do something more useful?
	    var console = root.console;
	    if (console && console.log) {
	      console.log('loading: ' + map.name + ' at ' + map.url);
	    }
	  };

	require.onResourceLoad = function(context, map, depMaps) {
	    updateModuleProgress(context, map, depMaps);
	};


	require(['domReady'], function(domReady) {
	    domReady(function() {
	      //re-implement updateModuleProgress here for domReady
	      updateModuleProgress = function(context, map, depMaps) {
	        var document = root.document;
	        var loadingStatusEl = document.getElementById('loading-status'),
	        	loadingModuleNameEl = document.getElementById('loading-module-name'),
	        	pageheader=document.getElementById('pageheader'),
	        	pagefooter=document.getElementById('pagefooter'),
	        	pageloader=document.getElementById('pageloader');
	        pageheader.style.display="none";
	        pagefooter.style.display="none";
	        if (loadingStatusEl && loadingModuleNameEl) {  	
	        	if(map.url=="js/routes.js"){
	        		pageheader.style.display="block";
	        		pagefooter.style.display="block";
	        		pageloader.style.display="none";
	        	}
	        	loadingStatusEl.innerHTML = loadingStatusEl.innerHTML += '.'; //add one more dot character
	        	loadingModuleNameEl.innerHTML = map.name + (map.url ? ' at ' + map.url : '') ;
	        } else {
	        	
	          //TODO later load, must have loading indicator for this then
	        }
	      };
	    });
	});

	// hey Angular, we're bootstrapping manually!
	window.name = "NG_DEFER_BOOTSTRAP!";

	require([
		'angular',
		'app',
		'routes',
		'bootstrapswitch',
	], function(angular, app, routes) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		angular.element().ready(function() {
			$html.addClass('ng-app');
			angular.bootstrap($html, [app['name']]);
		});
	});

}).call(this);
