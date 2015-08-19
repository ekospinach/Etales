var productPortfolioCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var getFormatValue = function(packFormat) {
        var result = 0;
        switch (packFormat) {
            case 'ECONOMY':
                result = 1;
                break;
            case 'STANDARD':
                result = 2;
                break;
            case 'PREMIUM':
                result = 3;
                break;
        }
        return result;
    }

    // var xf_ProductPortfolios = [{
    //     "categoryID": 1,
    //     "xfpp_Attributes": [{
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 5,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 5,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }],
    //     "xfpp_PackFormat": [{
    //         "packFormat": "ECONOMY",
    //         "ownerID": 1,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 3,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 5,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 6,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }]
    // }, {
    //     "categoryID": 2,
    //     "xfpp_Attributes": [{
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 5,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 5,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "level": 5,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 1,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 2,
    //         "ownerID": 3,
    //         "count": 3,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 2,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 2,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 4,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 5,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 2,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 6,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 7,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "level": 9,
    //         "index": 3,
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }],
    //     "xfpp_PackFormat": [{
    //         "packFormat": "ECONOMY",
    //         "ownerID": 1,
    //         "count": 7,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 1,
    //         "count": 6,
    //         "isNewProduct": true
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 2,
    //         "count": 8,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 2,
    //         "count": 7,
    //         "isNewProduct": true
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 3,
    //         "count": 6,
    //         "isNewProduct": false
    //     },{
    //         "packFormat": "ECONOMY",
    //         "ownerID": 3,
    //         "count": 6,
    //         "isNewProduct": true
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 5,
    //         "count": 2,
    //         "isNewProduct": false
    //     },{
    //         "packFormat": "ECONOMY",
    //         "ownerID": 5,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "packFormat": "ECONOMY",
    //         "ownerID": 6,
    //         "count": 2,
    //         "isNewProduct": false
    //     },{
    //         "packFormat": "ECONOMY",
    //         "ownerID": 6,
    //         "count": 2,
    //         "isNewProduct": true
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "STANDARD",
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 1,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 2,
    //         "count": 1,
    //         "isNewProduct": false
    //     }, {
    //         "packFormat": "PREMIUM",
    //         "ownerID": 3,
    //         "count": 1,
    //         "isNewProduct": false
    //     }]
    // }];

    var organiseArray = function(data, category) {
        var result = {
            'technology': {},
            'design': {},
            'active': {},
            'pack': {}
        }

        var points_x = [0, -0.3, 0.3, 0, -0.3, 0.3, 0, -0.3, 0.3, 0, -0.3, 0.3, 0];
        var points_y = [0, 0, 0, 0.25, 0.25, -0.25];
        var new_points_y = [0.5, 0.5, 0.5, 0.75, 0.75, 0.75];

        var pack_points_x = [0, -0.1, 0.1, -0.2, 0.2, -0.3, 0.3, -0.4, 0.4];
        var pack_points_y = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
        var new_pack_points_y = [1, 1, 1, 1, 1, 1, 1, 1, 1];



        result.pack = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];



        result.active = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];
        result.design = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];
        result.technology = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 7
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];

        var temp = -1;

        data.forEach(function(singleData) {
            if (singleData.categoryID == category) {

                singleData.xfpp_Attributes.forEach(function(singleAttributes) {

                    switch (singleAttributes.index) {
                        case 1:
                            if (singleAttributes.ownerID < 4) {
                                temp = -1;
                            } else if (singleAttributes.ownerID > 4) {
                                temp = -2;
                            }
                            if (singleAttributes.isNewProduct) {

                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.design[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + new_points_y[i],
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                }
                            } else {
                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.design[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + points_y[i],
                                    })
                                }
                            }
                            break;
                        case 2:
                            if (singleAttributes.ownerID < 4) {
                                temp = -1;
                            } else if (singleAttributes.ownerID > 4) {
                                temp = -2;
                            }
                            if (singleAttributes.isNewProduct) {

                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.technology[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + new_points_y[i],
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                }
                            } else {
                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.technology[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + points_y[i],
                                    })
                                }
                            }
                            break;
                        case 3:
                            if (singleAttributes.ownerID < 4) {
                                temp = -1;
                            } else if (singleAttributes.ownerID > 4) {
                                temp = -2;
                            }
                            if (singleAttributes.isNewProduct) {

                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.active[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + new_points_y[i],
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                }
                            } else {
                                for (var i = 0; i < singleAttributes.count; i++) {
                                    result.active[singleAttributes.ownerID + temp].data.push({
                                        x: singleAttributes.level + points_x[i],
                                        y: singleAttributes.ownerID + points_y[i],
                                    })
                                }
                            }
                            break;
                    }
                })

                singleData.xfpp_PackFormat.forEach(function(singeFormat) {

                    if (singeFormat.ownerID < 4) {
                        temp = -1;
                    } else if (singeFormat.ownerID > 4) {
                        temp = -2;
                    }
                    if (singeFormat.isNewProduct) {

                        for (var i = 0; i < singeFormat.count; i++) {
                            result.pack[singeFormat.ownerID + temp].data.push({
                                x: getFormatValue(singeFormat.packFormat) + pack_points_x[i],
                                y: singeFormat.ownerID+temp + new_pack_points_y[i],
                                marker: {
                                    symbol: 'triangle'
                                }
                            })
                        }
                    } else {
                        for (var i = 0; i < singeFormat.count; i++) {
                            result.pack[singeFormat.ownerID + temp].data.push({
                                x: getFormatValue(singeFormat.packFormat) + pack_points_x[i],
                                y: singeFormat.ownerID+temp + pack_points_y[i],
                            })
                        }
                    }
                })

            }
        })
        return result;
    }

    var initPage = function() {
        var result = {
            'ele': {},
            'hea': {}
        }
        result.ele = organiseArray($scope.feedback.xf_ProductPortfolios, 1);
        result.hea = organiseArray($scope.feedback.xf_ProductPortfolios, 2);


        $scope.ele_technology = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }
            },
            title: {
                text: Label.getContent('Technology Level')
            },
            series: result.ele.technology,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_design = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Design Level')
            },
            series: result.ele.design,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_active = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Quality-of-Raw-Materials')
            },
            series: result.ele.active,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_pack = {
            options: {
                xAxis: {
                    labels: {
                        formatter: function() {
                            var label = '';

                            switch (this.value) {
                                case 1:
                                    label = Label.getContent('ECONOMY');
                                    break;
                                case 2:
                                    label = Label.getContent('STANDARD');
                                    break;
                                case 3:
                                    label = Label.getContent('PREMIUM');
                                    break;
                                default:
                                    label = '';
                                    break;
                            }
                            return label;
                        }
                    }
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Pack Format')
            },
            series: result.ele.pack,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_technology = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Technology Level')
            },
            series: result.hea.technology,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_design = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Design Level')
            },
            series: result.hea.design,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_active = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Active agent')
            },
            series: result.hea.active,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_pack = {
            options: {
                xAxis: {
                    labels: {
                        formatter: function() {
                            var label = '';

                            switch (this.value) {
                                case 1:
                                    label = Label.getContent('ECONOMY');
                                    break;
                                case 2:
                                    label = Label.getContent('STANDARD');
                                    break;
                                case 3:
                                    label = Label.getContent('PREMIUM');
                                    break;
                                default:
                                    label = '';
                                    break;
                            }
                            return label;
                        }
                    }
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Value') + ':' + this.point.x.toFixed(0) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                }

            },
            title: {
                text: Label.getContent('Pack Format')
            },
            series: result.hea.pack,
            credits: {
                enabled: false
            },
            loading: false
        }


    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}