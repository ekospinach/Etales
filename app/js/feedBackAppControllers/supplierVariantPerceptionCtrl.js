var supplierVariantPerceptionCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var loadValue = function(data, store, market) {
        var array = _.find(data, function(obj) {
            return (obj.storeID == store && obj.marketID == market)
        });
        return array;
    }

    var organiseArray = function(data, category, market) {

        var result = {
            'quality1s': [],
            'quality2s': [],
            'quality3s': [],
            'quality5s': [],
            'quality6s': [],
            'price1s': [],
            'price2s': [],
            'price3s': [],
            'price5s': [],
            'price6s': [],
            'mySeries1':{},
            'mySeries2':{}
        }

        data.variantInfo.forEach(function(singleData) {
            if (category == singleData.parentCategoryID && market == singleData.marketID) {
                //variantInfo[].parentCompanyID decide the player
                //quality data (variantInfo[].latestPerception[StaticValues.perception.quality],variantInfo[].latestPerception[StaticValues.perception.easy],fullName)--> use fullName to pop the info of this circle
                //prices data (1,latestPerception[StaticValues.perception.appeal],fullName) -->use num '1' to posit all the circle in line . and use fullName to pop the info of this circle
                switch (singleData.parentCompanyID) {
                    case 1:
                        result.quality1s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                        result.price1s.push([1, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                        break;
                    case 2:
                        result.quality2s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                        result.price2s.push([2, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                        break;
                    case 3:
                        result.quality3s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                        result.price3s.push([3, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                        break;
                    case 5:
                        result.quality5s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                        result.price5s.push([4, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                        break;
                    case 6:
                        result.quality6s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                        result.price6s.push([5, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                        break;
                }
            }
        })

        result.mySeries1 = [{
            name: Label.getContent('Supplier') + ' 1',
            data: result.quality1s,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: result.quality2s,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: result.quality3s,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: result.quality5s,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: result.quality6s,
            color: PlayerColor.r2
        }];
        result.mySeries2 = [{
            name: Label.getContent('Supplier') + ' 1',
            data: result.price1s,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: result.price2s,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: result.price3s,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: result.price5s,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: result.price6s,
            color: PlayerColor.r2
        }];
        return result;
    }

    var initPage = function() {

        var result = {
            'urban_ele': {},
            'urban_hea': {},
            'rural_ele': {},
            'rural_hea': {}
        }

        result.urban_ele = organiseArray($scope.variantPerception, 1, 1);
        result.rural_ele = organiseArray($scope.variantPerception, 1, 2);
        result.urban_hea = organiseArray($scope.variantPerception, 2, 1);
        result.rural_hea = organiseArray($scope.variantPerception, 2, 2);

        $scope.xTitle1 = Label.getContent("Ease of Use");
        $scope.yTitle1 = Label.getContent("Quality");
        $scope.yTitle2 = Label.getContent("Price Appeal");

        $scope.brand = result;
        $scope.myModel = Label.getContent("Ease of Use");
    }
    $scope.$watch('variantPerception', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}