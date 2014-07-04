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
			angularCookies: 		'../bower_components/angular-cookies/angular-cookies',
			angularRoute: 			'../bower_components/angular-route/angular-route',
			angularResource: 		'../bower_components/angular-resource/angular-resource',
			angularMocks: 			'../bower_components/angular-mocks/angular-mocks',
			angularAnimate: 		'../bower_components/angular-animate/angular-animate.min',
			angularLoadingBar : 	'../bower_components/angular-loading-bar/src/loading-bar', 
			text: 					'../bower_components/requirejs-text/text',
			angularXeditable: 		'../bower_components/angular-xeditable/dist/js/xeditable',
			socketIO: 				'../bower_components/socket.io-client/dist/socket.io',
			jquery: 				'../bower_components/jquery/dist/jquery',
			bootstrapswitch: 		'../bower_components/bootstrap-switch/dist/js/bootstrap-switch',
			require: 				'../bower_components/requirejs/require',
			underscore: 			'../bower_components/underscore/underscore',
			bootstrap: 				'../bower_components/bootstrap/dist/js/bootstrap',
			angularBootstrap: 		'./steps/angular-bootstrap',
			routingConfig :  		'./routingConfig',
			jqplot: 				'../bower_components/jqplot/jquery.jqplot.min',
			bubbleRenderer: 		'./map/jqplot.bubbleRenderer',
			labelRenderer: 			'./map/jqplot.canvasAxisLabelRenderer.min',
			pieRenderer:  			'./map/jqplot.pieRenderer',
			textRenderer: 			'./map/jqplot.canvasTextRenderer.min',
			tree: 					'./map/bootstrap-tree',
			domReady:   			'../bower_components/requirejs-domready/domReady',
			labelBase:   			'./utils/labelBase',
			//highchart
			highchart:              '../bower_components/highcharts/highcharts',
			angularHighcharts:      '../bower_components/highcharts-ng/src/highcharts-ng',
			highchartMore:          '../bower_components/highcharts/highcharts-more',
			//revealJS for facilitator 
			reveal: 				'../bower_components/reveal.js/js/reveal.min',
			//angular notification 
			//toaster:               '../bower_components/angular-notify-toaster/toaster',
			ngNotify: 			   	'../bower_components/angular-notify/dist/angular-notify.min',
			doubleScroll: 			'./utils/jquery.doubleScroll',
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
			'highchartMore':['jquery','highchart'],
			'bootstrapswitch' : ['jquery'],
			'angularHighcharts' :['angular','highchart'],
			'angularBootstrapSwitch':['angular','jquery','bootstrapswitch'],
			'highchart' :['jquery'],
			//'toaster' :['jquery','angular','angularAnimate'],
			'ngNotify' :['jquery','angular'],
			'doubleScroll':['jquery']
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
	    	var percent=0,document = root.document;
	    	var loadingPercentage = document.getElementById('loading-percentage');
	    	updateModuleProgress = function(context, map, depMaps) {
	    		percent=parseFloat(percent)+100/Object.keys(context.urlFetched).length;
	    		if(percent>=100)percent=100;
	    		loadingPercentage.innerHTML=parseFloat(percent).toFixed(0)+'%';
	    	};
	    });
	});

	// hey Angular, we're bootstrapping manually!
	window.name = "NG_DEFER_BOOTSTRAP!";

	require([
		'angular',
		'app',
		'routes',
	], function(angular, app, routes) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		angular.element().ready(function() {
			$html.addClass('ng-app');
			angular.bootstrap($html, [app['name']]);
		});
	});

}).call(this);