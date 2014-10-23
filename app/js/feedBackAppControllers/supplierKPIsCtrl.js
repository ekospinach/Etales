var supplierKPIsCtrl=function($scope,$http){
    function GetRequest() {
       var url = document.location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    }
    var initPage=function(){
        var Request = GetRequest();
        var url='/getFeedBack/'+Request['seminar']+'/'+Request['period'];
        var myCategories=new Array();
        var currentCategories=new Array();
        var previousCategories=new Array();

        for(var i=-3;i<=Request['period'];i++){
            if(i!=Request['period']){
                currentCategories.push(i);
                previousCategories.push(i); 
            }else{
                currentCategories.push(i);
            }
        }

        testCategories=[Request['period']-2,Request['period']-1];
        myCategories=[Request['period']-2,Request['period']-1,'',Request['period']-2,Request['period']-1,'',Request['period']-2,Request['period']-1];

        var tradeSpendingElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var tradeSpendingHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var marketingSpendingElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var marketingSpendingHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var bmChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var bmChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var onlineChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
        var onlineChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});

        //add Retailer
        var portfolioStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7', ownerID : 1},
            {name:'Supplier-2',data:new Array(),color:'#B11E22', ownerID : 2},
            {name:'Supplier-3',data:new Array(),color:'#F6B920', ownerID : 3},
            //{name:'Supplier-4',data:new Array(),color:'#329444', ownerID : 4},
            {name:'Retailer-1',data:new Array(),color:'#8B288B', ownerID : 5},
            {name:'Retailer-2',data:new Array(),color:'#F05422', ownerID : 6});

        var portfolioStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7', ownerID : 1},
            {name:'Supplier-2',data:new Array(),color:'#B11E22', ownerID : 2},
            {name:'Supplier-3',data:new Array(),color:'#F6B920', ownerID : 3},
            //{name:'Supplier-4',data:new Array(),color:'#329444', ownerID : 4},
            {name:'Retailer-1',data:new Array(),color:'#8B288B', ownerID : 5},
            {name:'Retailer-2',data:new Array(),color:'#F05422', ownerID : 6});

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_TradeSpendingEffectiveness.length;i++){
                if($scope.feedBack.f_TradeSpendingEffectiveness[i].period==currentCategories[j]){
                    if($scope.feedBack.f_TradeSpendingEffectiveness[i].categoryID==1){
                        tradeSpendingElecssories[$scope.feedBack.f_TradeSpendingEffectiveness[i].supplierID-1].data.push($scope.feedBack.f_TradeSpendingEffectiveness[i].value  * 100);
                    }else if($scope.feedBack.f_TradeSpendingEffectiveness[i].categoryID==2){
                        tradeSpendingHealthBeauties[$scope.feedBack.f_TradeSpendingEffectiveness[i].supplierID-1].data.push($scope.feedBack.f_TradeSpendingEffectiveness[i].value  * 100);
                    }
                }
            }
        }

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_MarketingSpendingEffectiveness.length;i++){
                if($scope.feedBack.f_MarketingSpendingEffectiveness[i].period==currentCategories[j]){
                    if($scope.feedBack.f_MarketingSpendingEffectiveness[i].categoryID==1){
                        marketingSpendingElecssories[$scope.feedBack.f_MarketingSpendingEffectiveness[i].supplierID-1].data.push($scope.feedBack.f_MarketingSpendingEffectiveness[i].value * 100);
                    }else if($scope.feedBack.f_MarketingSpendingEffectiveness[i].categoryID==2){
                        marketingSpendingHealthBeauties[$scope.feedBack.f_MarketingSpendingEffectiveness[i].supplierID-1].data.push($scope.feedBack.f_MarketingSpendingEffectiveness[i].value * 100);
                    }
                }
            }
        }

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_PortfolioStrength.length;i++){
                if($scope.feedBack.f_PortfolioStrength[i].period==currentCategories[j]){
                    if($scope.feedBack.f_PortfolioStrength[i].categoryID==1){
                        
                        portfolioStrengthElecssories.forEach(function(value, item, array){
                            if($scope.feedBack.f_PortfolioStrength[i].ownerID == array[item].ownerID){
                                array[item].data.push($scope.feedBack.f_PortfolioStrength[i].value);
                            }
                        })

                    }else if($scope.feedBack.f_PortfolioStrength[i].categoryID==2){
                        portfolioStrengthHealthBeauties.forEach(function(value, item, array){
                            if($scope.feedBack.f_PortfolioStrength[i].ownerID == array[item].ownerID){
                                array[item].data.push($scope.feedBack.f_PortfolioStrength[i].value);
                            }
                        })

                    }
                }
            }
        }

        //bmChannelStrength
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersBMValueSalesShare.length;i++){
                if($scope.feedBack.f_SuppliersBMValueSalesShare[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersBMValueSalesShare[i].categoryID==1){
                        bmChannelStrengthElecssories[$scope.feedBack.f_SuppliersBMValueSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMValueSalesShare[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersBMValueSalesShare[i].categoryID==2){
                        bmChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersBMValueSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMValueSalesShare[i].value * 100);
                    }
                }
            }
        }
        for(var i=0;i<3;i++){
            bmChannelStrengthElecssories[i].data.push('');
            bmChannelStrengthHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersBMVolumeSalesShare.length;i++){
                if($scope.feedBack.f_SuppliersBMVolumeSalesShare[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersBMVolumeSalesShare[i].categoryID==1){
                        bmChannelStrengthElecssories[$scope.feedBack.f_SuppliersBMVolumeSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMVolumeSalesShare[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersBMVolumeSalesShare[i].categoryID==2){
                        bmChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersBMVolumeSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMVolumeSalesShare[i].value * 100);
                    }
                }
            }
        }
        for(var i=0;i<3;i++){
            bmChannelStrengthElecssories[i].data.push('');
            bmChannelStrengthHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersBMShareOfShoppers.length;i++){
                if($scope.feedBack.f_SuppliersBMShareOfShoppers[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersBMShareOfShoppers[i].categoryID==1){
                        bmChannelStrengthElecssories[$scope.feedBack.f_SuppliersBMShareOfShoppers[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMShareOfShoppers[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersBMShareOfShoppers[i].categoryID==2){
                        bmChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersBMShareOfShoppers[i].supplierID-1].data.push($scope.feedBack.f_SuppliersBMShareOfShoppers[i].value * 100);
                    }
                }
            }
        }
        //onlineChannelStrength
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersOnlineValueSalesShare.length;i++){
                if($scope.feedBack.f_SuppliersOnlineValueSalesShare[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersOnlineValueSalesShare[i].categoryID==1){
                        onlineChannelStrengthElecssories[$scope.feedBack.f_SuppliersOnlineValueSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineValueSalesShare[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersOnlineValueSalesShare[i].categoryID==2){
                        onlineChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersOnlineValueSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineValueSalesShare[i].value * 100);
                    }
                }
            }
        }
        for(var i=0;i<3;i++){
            onlineChannelStrengthElecssories[i].data.push('');
            onlineChannelStrengthHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersOnlineVolumeSalesShare.length;i++){
                if($scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].categoryID==1){
                        onlineChannelStrengthElecssories[$scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].categoryID==2){
                        onlineChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineVolumeSalesShare[i].value * 100);
                    }
                }
            }
        }
        for(var i=0;i<3;i++){
            onlineChannelStrengthElecssories[i].data.push('');
            onlineChannelStrengthHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_SuppliersOnlineShareOfShoppers.length;i++){
                if($scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].period==testCategories[j]){
                    if($scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].categoryID==1){
                        onlineChannelStrengthElecssories[$scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].value * 100);
                    }else if($scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].categoryID==2){
                        onlineChannelStrengthHealthBeauties[$scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].supplierID-1].data.push($scope.feedBack.f_SuppliersOnlineShareOfShoppers[i].value * 100);
                    }
                }
            }
        }

        
        $scope.tradeSpendingElecssories = {
            options: {
                title:{
                    text:'Elecssories',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Return on Investment (%)',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Return on Investment:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: tradeSpendingElecssories,
            loading: false
        }
        $scope.tradeSpendingHealthBeauties = {
            options: {
                title:{
                    text:'HealthBeauties',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Return on Investment (%)',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Return on Investment:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: tradeSpendingHealthBeauties,
            loading: false
        }
        $scope.marketingSpendingElecssories = {
            options: {
                title:{
                    text:'Elecssories',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Return on Investment (%)',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Return on Investment:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: marketingSpendingElecssories,
            loading: false
        }
        $scope.marketingSpendingHealthBeauties = {
            options: {
                title:{
                    text:'HealthBeauties',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Return on Investment (%)',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Return on Investment:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: marketingSpendingHealthBeauties,
            loading: false
        }
        $scope.portfolioStrengthElecssories = {
            options: {
                title:{
                    text:'Elecssories',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Strength Index',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Average Brand Awareness:'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: portfolioStrengthElecssories,
            loading: false
        }
        $scope.portfolioStrengthHealthBeauties = {
            options: {
                title:{
                    text:'HealthBeauties',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: 'Strength Index',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Average Brand Awareness:'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: portfolioStrengthHealthBeauties,
            loading: false
        }
        $scope.bmChannelStrengthElecssories={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: bmChannelStrengthElecssories,
            title: {
                text: 'Elecssories',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Volume Sales</p><p style="font-size:20px" class="text-right">Share of Shoppers</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.bmChannelStrengthHealthBeauties={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: bmChannelStrengthHealthBeauties,
            title: {
                text: 'HealthBeauties',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Volume Sales</p><p style="font-size:20px" class="text-right">Share of Shoppers</p>',
                useHTML:true,
            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.onlineChannelStrengthElecssories={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: onlineChannelStrengthElecssories,
            title: {
                text: 'Elecssories',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Volume Sales</p><p style="font-size:20px" class="text-right">Share of Shoppers</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.onlineChannelStrengthHealthBeauties={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: onlineChannelStrengthHealthBeauties,
            title: {
                text: 'HealthBeauties',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Volume Sales</p><p style="font-size:20px" class="text-right">Share of Shoppers</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }


    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

