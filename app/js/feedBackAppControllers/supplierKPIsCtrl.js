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


        $http({
            method:'GET',
            url:url
        }).then(function(data){
            var tradeSpendingElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var tradeSpendingHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var marketingSpendingElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var marketingSpendingHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var bmChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var bmChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var onlineChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var onlineChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});

            //add Retailer
            var portfolioStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var portfolioStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_TradeSpendingEffectiveness.length;i++){
                    if(data.data.f_TradeSpendingEffectiveness[i].period==currentCategories[j]){
                        if(data.data.f_TradeSpendingEffectiveness[i].categoryID==1){
                            tradeSpendingElecssories[data.data.f_TradeSpendingEffectiveness[i].supplierID-1].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                        }else if(data.data.f_TradeSpendingEffectiveness[i].categoryID==2){
                            tradeSpendingHealthBeauties[data.data.f_TradeSpendingEffectiveness[i].supplierID-1].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                        }
                    }
                }
            }

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_MarketingSpendingEffectiveness.length;i++){
                    if(data.data.f_MarketingSpendingEffectiveness[i].period==currentCategories[j]){
                        if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==1){
                            marketingSpendingElecssories[data.data.f_MarketingSpendingEffectiveness[i].supplierID-1].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                        }else if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==2){
                            marketingSpendingHealthBeauties[data.data.f_MarketingSpendingEffectiveness[i].supplierID-1].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                        }
                    }
                }
            }

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_PortfolioStrength.length;i++){
                    if(data.data.f_PortfolioStrength[i].period==currentCategories[j]){
                        if(data.data.f_PortfolioStrength[i].categoryID==1){
                            portfolioStrengthElecssories[data.data.f_PortfolioStrength[i].ownerID-1].data.push(data.data.f_PortfolioStrength[i].value);
                        }else if(data.data.f_PortfolioStrength[i].categoryID==2){
                            portfolioStrengthHealthBeauties[data.data.f_PortfolioStrength[i].ownerID-1].data.push(data.data.f_PortfolioStrength[i].value);
                        }
                    }
                }
            }

            //bmChannelStrength
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersBMValueSalesShare.length;i++){
                    if(data.data.f_SuppliersBMValueSalesShare[i].period==testCategories[j]){
                        if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==1){
                            bmChannelStrengthElecssories[data.data.f_SuppliersBMValueSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                        }else if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==2){
                            bmChannelStrengthHealthBeauties[data.data.f_SuppliersBMValueSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                        }
                    }
                }
            }
            for(var i=0;i<3;i++){
                bmChannelStrengthElecssories[i].data.push('');
                bmChannelStrengthHealthBeauties[i].data.push('');
            }
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersBMVolumeSalesShare.length;i++){
                    if(data.data.f_SuppliersBMVolumeSalesShare[i].period==testCategories[j]){
                        if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==1){
                            bmChannelStrengthElecssories[data.data.f_SuppliersBMVolumeSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                        }else if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==2){
                            bmChannelStrengthHealthBeauties[data.data.f_SuppliersBMVolumeSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                        }
                    }
                }
            }
            for(var i=0;i<3;i++){
                bmChannelStrengthElecssories[i].data.push('');
                bmChannelStrengthHealthBeauties[i].data.push('');
            }
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersBMShareOfShoppers.length;i++){
                    if(data.data.f_SuppliersBMShareOfShoppers[i].period==testCategories[j]){
                        if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==1){
                            bmChannelStrengthElecssories[data.data.f_SuppliersBMShareOfShoppers[i].supplierID-1].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                        }else if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==2){
                            bmChannelStrengthHealthBeauties[data.data.f_SuppliersBMShareOfShoppers[i].supplierID-1].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                        }
                    }
                }
            }
            //onlineChannelStrength
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersOnlineValueSalesShare.length;i++){
                    if(data.data.f_SuppliersOnlineValueSalesShare[i].period==testCategories[j]){
                        if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==1){
                            onlineChannelStrengthElecssories[data.data.f_SuppliersOnlineValueSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                        }else if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==2){
                            onlineChannelStrengthHealthBeauties[data.data.f_SuppliersOnlineValueSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                        }
                    }
                }
            }
            for(var i=0;i<3;i++){
                onlineChannelStrengthElecssories[i].data.push('');
                onlineChannelStrengthHealthBeauties[i].data.push('');
            }
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersOnlineVolumeSalesShare.length;i++){
                    if(data.data.f_SuppliersOnlineVolumeSalesShare[i].period==testCategories[j]){
                        if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==1){
                            onlineChannelStrengthElecssories[data.data.f_SuppliersOnlineVolumeSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                        }else if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==2){
                            onlineChannelStrengthHealthBeauties[data.data.f_SuppliersOnlineVolumeSalesShare[i].supplierID-1].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                        }
                    }
                }
            }
            for(var i=0;i<3;i++){
                onlineChannelStrengthElecssories[i].data.push('');
                onlineChannelStrengthHealthBeauties[i].data.push('');
            }
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersOnlineShareOfShoppers.length;i++){
                    if(data.data.f_SuppliersOnlineShareOfShoppers[i].period==testCategories[j]){
                        if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==1){
                            onlineChannelStrengthElecssories[data.data.f_SuppliersOnlineShareOfShoppers[i].supplierID-1].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                        }else if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==2){
                            onlineChannelStrengthHealthBeauties[data.data.f_SuppliersOnlineShareOfShoppers[i].supplierID-1].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                        }
                    }
                }
            }

            
            $scope.tradeSpendingElecssories = {
                options: {
                    title:{
                        text:'Elecssories',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Return on Investment'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Return on Investment'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Return on Investment'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Return on Investment'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Average Brand Awareness(%)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Average Brand Awareness(%)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
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
                    text: 'Elecssories'
                },
                subtitle: {
                    text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Value Sales</p><p style="font-size:20px" class="text-right">Share of Value Sales</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
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
                    text: 'HealthBeauties'
                },
                subtitle: {
                    text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Value Sales</p><p style="font-size:20px" class="text-right">Share of Value Sales</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
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
                    text: 'Elecssories'
                },
                subtitle: {
                    text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Value Sales</p><p style="font-size:20px" class="text-right">Share of Value Sales</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
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
                    text: 'HealthBeauties'
                },
                subtitle: {
                    text: '<p style="font-size:20px" class="text-left">Share of Value Sales</p><p style="font-size:20px" class="text-center">Share of Value Sales</p><p style="font-size:20px" class="text-right">Share of Value Sales</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }

        });
    }
    initPage();
}

