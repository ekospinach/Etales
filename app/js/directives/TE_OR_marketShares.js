define(['directives', 'services'], function(directives) {

	directives.directive('overviewMarketShares', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
		function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
			return {
				scope: {
					isPageShown: '=',
					isPageLoading: '=',
					feedBack: '=',
					selectedPeriod: '='
				},
				restrict: 'E',
				templateUrl: '../../partials/singleReportTemplate/OR_marketShares.html',
				link: function(scope, element, attrs) {
					var initializePage = function() {
						console.log('initializePage OR_marketShares small...');
						scope.isPageLoading = true;
						scope.isResultShown = false;
						scope.Label = Label;
						//if(scope.feedBack!=undefined&&scope.salesReady)
						getResult();
					}

					var getResult = function() {
						var currentCategories = [];
						for (var i = -3; i <= scope.selectedPeriod; i++) {
							currentCategories.push(i);
						}
						/*highchart data init start*/
						var currentElecssoriesVolume = new Array({
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
							name: Label.getContent('Supplier') + '-4',
							data: [],
							color: PlayerColor.s4
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						}, {
							name: Label.getContent('Retailer') + '-3',
							data: [],
							color: PlayerColor.r3
						});
						var currentElecssoriesValue = new Array({
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
							name: Label.getContent('Supplier') + '-4',
							data: [],
							color: PlayerColor.s4
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						}, {
							name: Label.getContent('Retailer') + '-3',
							data: [],
							color: PlayerColor.r3
						});
						var currentHealthBeautiesVolume = new Array({
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
							name: Label.getContent('Supplier') + '-4',
							data: [],
							color: PlayerColor.s4
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						}, {
							name: Label.getContent('Retailer') + '-3',
							data: [],
							color: PlayerColor.r3
						});
						var currentHealthBeautiesValue = new Array({
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
							name: Label.getContent('Supplier') + '-4',
							data: [],
							color: PlayerColor.s4
						}, {
							name: Label.getContent('Retailer') + '-1',
							data: [],
							color: PlayerColor.r1
						}, {
							name: Label.getContent('Retailer') + '-2',
							data: [],
							color: PlayerColor.r2
						}, {
							name: Label.getContent('Retailer') + '-3',
							data: [],
							color: PlayerColor.r3
						});
						/*highchart data init end*/
						/*highchart set data  start*/
						//share Volume

						currentCategories.forEach(function(data) {
							scope.feedBack.f_VolumeMarketShares.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 1) {
										currentElecssoriesVolume[singleData.actorID - 1].data.push(singleData.value * 100);
									} else if (singleData.categoryID == 2) {
										currentHealthBeautiesVolume[singleData.actorID - 1].data.push(singleData.value * 100);
									}
								}
							})
							scope.feedBack.f_ValueMarketShares.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 1) {
										currentElecssoriesValue[singleData.actorID - 1].data.push(singleData.value * 100);
									} else if (singleData.categoryID == 2) {
										currentHealthBeautiesValue[singleData.actorID - 1].data.push(singleData.value * 100);
									}
								}
							})
						})

						/*highchart set data end*/
						/*set highchart function start*/
						scope.currentSharesVolumeElecssories = {
							options: {
								title: {
									text: Label.getContent('Volume Shares'),
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
							series: currentElecssoriesVolume,
							loading: false
						}
						scope.currentSharesVolumeHealthBeauties = {
							options: {
								title: {
									text: Label.getContent('Volume Shares'),
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
							series: currentHealthBeautiesVolume,
							loading: false
						}
						scope.currentSharesValueElecssories = {
							options: {
								title: {
									text: Label.getContent('Value Shares'),
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
							series: currentElecssoriesValue,
							loading: false
						}
						scope.currentSharesValueHealthBeauties = {
							options: {
								title: {
									text: Label.getContent('Value Shares'),
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
							series: currentHealthBeautiesValue,
							loading: false
						}
						scope.isPageLoading = false;
						scope.isResultShown = true;
						console.log('shareReady');
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