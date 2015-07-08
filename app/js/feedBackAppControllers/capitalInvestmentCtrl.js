var capitalInvestmentCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
    function GetRequest() {
        var url = document.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var loadCapitalInvestment = function(data, category, period) {
        var result = {
            investmentsConfig: {},
            resultCapabilitiesConfig: {},
            flexibilityConfig: {},
            capacityConfig: {},
            investments: [{
                "name": Label.getContent('Supplier') + ' 1',
                "data": [],
                type: "column",
                color: PlayerColor.s1
            }, {
                "name": Label.getContent('Supplier') + ' 2',
                "data": [],
                type: "column",
                color: PlayerColor.s2
            }, {
                "name": Label.getContent('Supplier') + ' 3',
                "data": [],
                type: "column",
                color: PlayerColor.s3
            }],
            resultCapabilities: [{
                "name": Label.getContent('Supplier') + ' 1',
                "data": [],
                type: "column",
                color: PlayerColor.s1
            }, {
                "name": Label.getContent('Supplier') + ' 2',
                "data": [],
                type: "column",
                color: PlayerColor.s2
            }, {
                "name": Label.getContent('Supplier') + ' 3',
                "data": [],
                type: "column",
                color: PlayerColor.s3
            }],
            flexibility: [{
                "name": Label.getContent('Supplier') + ' 1',
                "data": [],
                type: "column",
                color: PlayerColor.s1
            }, {
                "name": Label.getContent('Supplier') + ' 2',
                "data": [],
                type: "column",
                color: PlayerColor.s2
            }, {
                "name": Label.getContent('Supplier') + ' 3',
                "data": [],
                type: "column",
                color: PlayerColor.s3
            }],
            capacity: [{
                "name": Label.getContent('Supplier') + ' 1',
                "data": [],
                type: "column",
                color: PlayerColor.s1
            }, {
                "name": Label.getContent('Supplier') + ' 2',
                "data": [],
                type: "column",
                color: PlayerColor.s2
            }, {
                "name": Label.getContent('Supplier') + ' 3',
                "data": [],
                type: "column",
                color: PlayerColor.s3
            }]
        }

        data.forEach(function(singleData) {
            if (singleData.categoryID == category && singleData.period == period) {

                if (singleData.producerID != 4) {
                    result.flexibility[singleData.producerID - 1].data.push(singleData.xfci_AcquiredFlexibility * 100);
                    result.capacity[singleData.producerID - 1].data.push(singleData.xfci_AvailableCapacity);
                    result.investments[singleData.producerID - 1].data.push(singleData.xfci_InvestedInTechnology);
                    result.investments[singleData.producerID - 1].data.push(singleData.xfci_InvestedInFlexibility);
                    result.resultCapabilities[singleData.producerID - 1].data.push(singleData.xfci_AcquiredTechnologyLevel);

                    result.investmentsCategories=[Label.getContent('Technology Level'),Label.getContent('Flexibility')];
                    result.resultCapabilitiesCategories=[Label.getContent('Technology Level')];

                    if (category == 1) {
                        result.investmentsCategories.push(Label.getContent('Design Level'));
                        result.resultCapabilitiesCategories.push(Label.getContent('Design Level'));
                        result.investments[singleData.producerID - 1].data.push(singleData.xfci_InvestedInDesign);
                        result.resultCapabilities[singleData.producerID - 1].data.push(singleData.xfci_AcquiredDesignLevel);
                    }
                }
            }
        })
    
        result.investmentsConfig = {
            options: {
                xAxis: {
                    categories: result.investmentsCategories
                },
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    }
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: ''
                    }
                }
            },
            series: result.investments,
            title: {
                text:''
            },
            credits: {
                enabled: false
            },
            loading: false
        }

        result.resultCapabilitiesConfig = {
            options: {
                xAxis: {
                    categories: result.resultCapabilitiesCategories
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        stacking: ''
                    }
                }
            },
            series: result.resultCapabilities,
            title: {
                text:''
            },
            credits: {
                enabled: false
            },
            loading: false
        }

        result.flexibilityConfig = {
            options: {
                xAxis: {
                    categories: [Label.getContent('Flexibility')]
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: ''
                    }
                }
            },
            series: result.flexibility,
            title: {
                text:''
            },
            credits: {
                enabled: false
            },
            loading: false
        }

        result.capacityConfig = {
            options: {
                xAxis: {
                    categories: [Label.getContent('Capacity')]
                },
                yAxis: {
                    title: {
                        text: Label.getContent('mln units')
                    }
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: ''
                    }
                }
            },
            series: result.capacity,
            title: {
                text:''
            },
            credits: {
                enabled: false
            },
            loading: false
        }

        return result;
    }

    var initPage = function() {

        var Request = GetRequest();
        var result = {
            'ele': {},
            'hea': {}
        }
        result.ele = loadCapitalInvestment($scope.feedback.xf_CapitalInvestments, StaticValues.categoryID.ele, Request['period']);
        result.hea = loadCapitalInvestment($scope.feedback.xf_CapitalInvestments, StaticValues.categoryID.hea, Request['period']);
        $scope.capitalInvestment = result;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}