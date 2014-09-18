define(['directives', 'services'], function(directives) {

	directives.directive('overviewProfits', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor',
		function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor) {
			return {
				scope: {
					isPageShown: '=',
					isPageLoading: '=',
					feedBack: '=',
					selectedPeriod: '='
				},
				restrict: 'E',
				templateUrl: '../../partials/singleReportTemplate/OR_profits.html',
				link: function(scope, element, attrs) {
					var initializePage = function() {
						console.log('initializePage some small...');
						scope.isPageLoading = true;
						scope.isResultShown = false;
						scope.Label = Label;
						if (scope.feedBack != undefined)
							getResult();
					}

					var getResult = function() {
						var currentCategories = new Array();
						for (var i = -3; i <= scope.selectedPeriod; i++) {
							currentCategories.push(i);
						}
						/*highchart data init start*/
						var currentOperatingProfits = new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]});
						var currentOperatingProfitMargins = new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]});
						var currentNetProfits = new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]});
						var currentNetProfitMargins = new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]});
						/*highchart data init end*/
						/*highchart set data  start*/
						//OperatingProfits
						for (var j = 0; j < currentCategories.length; j++) {
							for (var i = 0; i < scope.feedBack.f_OperatingProfit.length; i++) {
								if (scope.feedBack.f_OperatingProfit[i].period == currentCategories[j]) {
									if (scope.feedBack.f_OperatingProfit[i].categoryID == 3) {
										if (scope.feedBack.f_OperatingProfit[i].actorID < 4) {
											currentOperatingProfits[scope.feedBack.f_OperatingProfit[i].actorID - 1].data.push(scope.feedBack.f_OperatingProfit[i].value);
										} else if (scope.feedBack.f_OperatingProfit[i].actorID > 4 && scope.feedBack.f_OperatingProfit[i].actorID < 7) {
											currentOperatingProfits[scope.feedBack.f_OperatingProfit[i].actorID - 2].data.push(scope.feedBack.f_OperatingProfit[i].value);
										}
									}
								}
							}
						}
						//OperatingProfitMargins
						for (var j = 0; j < currentCategories.length; j++) {
							for (var i = 0; i < scope.feedBack.f_OperatingProfitMargin.length; i++) {
								if (scope.feedBack.f_OperatingProfitMargin[i].period == currentCategories[j]) {
									if (scope.feedBack.f_OperatingProfitMargin[i].categoryID == 3) {
										if (scope.feedBack.f_OperatingProfitMargin[i].actorID < 4) {
											currentOperatingProfitMargins[scope.feedBack.f_OperatingProfitMargin[i].actorID - 1].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
										} else if (scope.feedBack.f_OperatingProfitMargin[i].actorID > 4 && scope.feedBack.f_OperatingProfitMargin[i].actorID < 7) {
											currentOperatingProfitMargins[scope.feedBack.f_OperatingProfitMargin[i].actorID - 2].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
										}
									}
								}
							}
						}
						//NetProfits
						for (var j = 0; j < currentCategories.length; j++) {
							for (var i = 0; i < scope.feedBack.f_NetProfit.length; i++) {
								if (scope.feedBack.f_NetProfit[i].period == currentCategories[j]) {
									if (scope.feedBack.f_NetProfit[i].categoryID == 3) {
										if (scope.feedBack.f_NetProfit[i].actorID < 4) {
											currentNetProfits[scope.feedBack.f_NetProfit[i].actorID - 1].data.push(scope.feedBack.f_NetProfit[i].value);
										} else if (scope.feedBack.f_NetProfit[i].actorID > 4 && scope.feedBack.f_NetProfit[i].actorID < 7) {
											currentNetProfits[scope.feedBack.f_NetProfit[i].actorID - 2].data.push(scope.feedBack.f_NetProfit[i].value);
										}
									}
								}
							}
						}
						//NetProfitMargins
						for (var j = 0; j < currentCategories.length; j++) {
							for (var i = 0; i < scope.feedBack.f_NetProfitMargin.length; i++) {
								if (scope.feedBack.f_NetProfitMargin[i].period == currentCategories[j]) {
									if (scope.feedBack.f_NetProfitMargin[i].categoryID == 3) {
										if (scope.feedBack.f_NetProfitMargin[i].actorID < 4) {
											currentNetProfitMargins[scope.feedBack.f_NetProfitMargin[i].actorID - 1].data.push(scope.feedBack.f_NetProfitMargin[i].value);
										} else if (scope.feedBack.f_NetProfitMargin[i].actorID > 4 && scope.feedBack.f_NetProfitMargin[i].actorID < 7) {
											currentNetProfitMargins[scope.feedBack.f_NetProfitMargin[i].actorID - 2].data.push(scope.feedBack.f_NetProfitMargin[i].value);
										}
									}
								}
							}
						}

						/*highchart set data end*/
						/*set highchart function start*/
						scope.currentOperatingProfits = {
							options: {
								title: {
									text: Label.getContent('Operating Profits'),
								},
								chart: {
									width:550,
									height:500,
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: '$mln'
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>Period:' + this.key + '</p>' + '<p>$mln:' + this.point.y.toFixed(2) + '</p>';
										return s;
									},
									shared: false,
									useHTML: true
								},
								credits: {
									enabled: false
								}
							},
							series: currentOperatingProfits,
							loading: false
						}
						scope.currentOperatingProfitMargins = {
							options: {
								title: {
									text: Label.getContent('Operating Profit Margins'),
								},
								chart: {
									width:550,
									height:500,
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: '$mln'
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>Period:' + this.key + '</p>' + '<p>$mln:' + this.point.y.toFixed(2) + '</p>';
										return s;
									},
									shared: false,
									useHTML: true
								},
								credits: {
									enabled: false
								}
							},
							series: currentOperatingProfitMargins,
							loading: false
						}
						scope.currentNetProfits = {
							options: {
								title: {
									text: Label.getContent('Net Profits'),
								},
								chart: {
									width:550,
									height:500,
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: '%'
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>Period:' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
										return s;
									},
									shared: false,
									useHTML: true
								},
								credits: {
									enabled: false
								}
							},
							series: currentNetProfits,
							loading: false
						}
						scope.currentNetProfitMargins = {
							options: {
								title: {
									text: Label.getContent('Net Profit Margins'),
								},
								chart: {
									width:550,
									height:500,
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: '%'
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>Period:' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
										return s;
									},
									shared: false,
									useHTML: true
								},
								credits: {
									enabled: false
								}
							},
							series: currentNetProfitMargins,
							loading: false
						}
						scope.isPageLoading = false;
						scope.isResultShown = true;
						/*set highchart function end*/

					}

					scope.$watch('isPageShown', function(newValue, oldValue) {
						console.log('watch is actived');
						if (newValue == true) {
							initializePage();
						}
					})

				}
			}
		}
	])
})