define(['directives', 'services'], function(directives) {

	directives.directive('overviewProfits', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
		function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
			return {
				scope: {
					isPageShown: '=',
					isPageLoading: '=',
					feedBack: '=',
					selectedPeriod: '='
				},
				restrict: 'E',
				templateUrl: 'singleReportTemplate/OR_profits.html',
				link: function(scope, element, attrs) {
					var initializePage = function() {
						console.log('initializePage OR_profits small...');
						scope.isPageLoading = true;
						scope.isResultShown = false;
						scope.Label = Label;
						//if (scope.feedBack != undefined && scope.shareReady)
						getResult();
					}

					var getResult = function() {
						var currentCategories = new Array();
						for (var i = -3; i <= scope.selectedPeriod; i++) {
							currentCategories.push(i);
						}
						/*highchart data init start*/
						var currentOperatingProfits = new Array({
							name: Label.getContent('Supplier') + '-1',
							data: [],
							color: PlayerColor.s1
						}, {
							name: Label.getContent('Supplier') + '-2',
							data: [],
							color: PlayerColor.s2
						}, {
							name: Label.getContent('Supplier') + '-3',
							data: [],
							color: PlayerColor.s3
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						});
						var currentOperatingProfitMargins = new Array({
							name: Label.getContent('Supplier') + '-1',
							data: [],
							color: PlayerColor.s1
						}, {
							name: Label.getContent('Supplier') + '-2',
							data: [],
							color: PlayerColor.s2
						}, {
							name: Label.getContent('Supplier') + '-3',
							data: [],
							color: PlayerColor.s3
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						});
						var currentNetProfits = new Array({
							name: Label.getContent('Supplier') + '-1',
							data: [],
							color: PlayerColor.s1
						}, {
							name: Label.getContent('Supplier') + '-2',
							data: [],
							color: PlayerColor.s2
						}, {
							name: Label.getContent('Supplier') + '-3',
							data: [],
							color: PlayerColor.s3
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						});
						var currentNetProfitMargins = new Array({
							name: Label.getContent('Supplier') + '-1',
							data: [],
							color: PlayerColor.s1
						}, {
							name: Label.getContent('Supplier') + '-2',
							data: [],
							color: PlayerColor.s2
						}, {
							name: Label.getContent('Supplier') + '-3',
							data: [],
							color: PlayerColor.s3
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						});
						/*highchart data init end*/
						/*highchart set data  start*/
						//OperatingProfits

						currentCategories.forEach(function(data) {
							scope.feedBack.f_OperatingProfit.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 3) {
										if (singleData.actorID < 4) {
											currentOperatingProfits[singleData.actorID - 1].data.push(singleData.value);
										} else if (singleData.actorID > 4 && singleData.actorID < 7) {
											currentOperatingProfits[singleData.actorID - 2].data.push(singleData.value);
										}
									}
								}
							})

							scope.feedBack.f_OperatingProfitMargin.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 3) {
										if (singleData.actorID < 4) {
											currentOperatingProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
										} else if (singleData.actorID > 4 && singleData.actorID < 7) {
											currentOperatingProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
										}
									}
								}
							})

							scope.feedBack.f_NetProfit.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 3) {
										if (singleData.actorID < 4) {
											currentNetProfits[singleData.actorID - 1].data.push(singleData.value * 100);
										} else if (singleData.actorID > 4 && singleData.actorID < 7) {
											currentNetProfits[singleData.actorID - 2].data.push(singleData.value * 100);
										}
									}
								}
							})

							scope.feedBack.f_NetProfitMargin.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 3) {
										if (singleData.actorID < 4) {
											currentNetProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
										} else if (singleData.actorID > 4 && singleData.actorID < 7) {
											currentNetProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
										}
									}
								}
							})

						})


						/*highchart set data end*/
						/*set highchart function start*/
						scope.currentOperatingProfits = {
							options: {
								title: {
									text: Label.getContent('Operating Profits'),
								},
								chart: {

									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('$mln')
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: false
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
								series: {
									animation: false
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
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

									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('$mln')
									}
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: false
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
								series: {
									animation: false
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
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
						console.log('profitReady');
						/*set highchart function end*/

					}

					scope.$watch('isPageShown', function(newValue, oldValue) {
						if (newValue == true) {
							initializePage();
						}
					})

				}
			}
		}
	])
})