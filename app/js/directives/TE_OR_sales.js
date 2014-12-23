define(['directives', 'services'], function(directives) {

	directives.directive('overviewSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor',
		function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor) {
			return {
				scope: {
					isPageShown: '=',
					isPageLoading: '=',
					feedBack: '=',
					selectedPeriod: '='

				},
				restrict: 'E',
				templateUrl: 'singleReportTemplate/OR_sales.html',
				link: function(scope, element, attrs) {
					var initializePage = function() {
						console.log('initializePage OR_sales small...');
						scope.isPageLoading = true;
						scope.isResultShown = false;
						scope.Label = Label;
						//if(scope.feedBack!=undefined&&scope.salesStart)
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
						});;
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
						});;
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
						});;
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
						});;
						/*highchart data init end*/
						/*highchart set data  start*/
						//sales Volume

						currentCategories.forEach(function(data) {
							scope.feedBack.f_MarketSalesVolume.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 1) {
										currentElecssoriesVolume[singleData.actorID - 1].data.push(singleData.value);
									} else if (singleData.categoryID == 2) {
										currentHealthBeautiesVolume[singleData.actorID - 1].data.push(singleData.value);
									}
								}
							})
							scope.feedBack.f_MarketSalesValue.forEach(function(singleData) {
								if (singleData.period == data) {
									if (singleData.categoryID == 1) {
										currentElecssoriesValue[singleData.actorID - 1].data.push(singleData.value);
									} else if (singleData.categoryID == 2) {
										currentHealthBeautiesValue[singleData.actorID - 1].data.push(singleData.value);
									}
								}
							})
						})

						/*highchart set data end*/
						/*set highchart function start*/
						scope.currentSalesVolumeElecssories = {
							options: {
								title: {
									text: Label.getContent('Sales Volumes'),
								},
								chart: {
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('units mln')
									},
									gridLineColor: 'transparent'
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: {
										duration: 6000 //数据加载完成为6秒
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('units mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
						scope.currentSalesVolumeHealthBeauties = {
							options: {
								title: {
									text: Label.getContent('Sales Volumes'),
								},
								chart: {
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('units mln')
									},
									gridLineColor: 'transparent'
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: {
										duration: 6000 //数据加载完成为6秒
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('units mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
						scope.currentSalesValueElecssories = {
							options: {
								title: {
									text: Label.getContent('Sales Values'),
								},
								chart: {
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('$mln')
									},
									gridLineColor: 'transparent'
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: {
										duration: 6000 //数据加载完成为6秒
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
						scope.currentSalesValueHealthBeauties = {
							options: {
								title: {
									text: Label.getContent('Sales Values'),
								},
								chart: {
									type: 'line',
									backgroundColor: 'transparent',
								},
								yAxis: {
									title: {
										text: Label.getContent('$mln')
									},
									gridLineColor: 'transparent'
								},
								xAxis: {
									categories: currentCategories,
									title: {
										text: Label.getContent('Period')
									}
								},
								series: {
									animation: {
										duration: 6000 //数据加载完成为6秒
									}
								},
								tooltip: {
									formatter: function() {
										var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
						console.log('salesReady');
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