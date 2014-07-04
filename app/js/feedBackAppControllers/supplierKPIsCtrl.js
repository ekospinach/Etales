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
            var portfolioStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var portfolioStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var bmChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var bmChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var onlineChannelStrengthElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});
            var onlineChannelStrengthHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'});

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_TradeSpendingEffectiveness.length;i++){
                    if(data.data.f_TradeSpendingEffectiveness[i].period==currentCategories[j]){
                        switch(data.data.f_TradeSpendingEffectiveness[i].supplierID){
                            case 1:
                            if(data.data.f_TradeSpendingEffectiveness[i].categoryID==1){
                                tradeSpendingElecssories[0].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }else if(data.data.f_TradeSpendingEffectiveness[i].categoryID==2){
                                tradeSpendingHealthBeauties[0].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_TradeSpendingEffectiveness[i].categoryID==1){
                                tradeSpendingElecssories[1].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }else if(data.data.f_TradeSpendingEffectiveness[i].categoryID==2){
                                tradeSpendingHealthBeauties[1].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_TradeSpendingEffectiveness[i].categoryID==1){
                                tradeSpendingElecssories[2].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }else if(data.data.f_TradeSpendingEffectiveness[i].categoryID==2){
                                tradeSpendingHealthBeauties[2].data.push(data.data.f_TradeSpendingEffectiveness[i].value);
                            }
                            break;
                        }
                    }
                }
            }

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_MarketingSpendingEffectiveness.length;i++){
                    if(data.data.f_MarketingSpendingEffectiveness[i].period==currentCategories[j]){
                        switch(data.data.f_MarketingSpendingEffectiveness[i].supplierID){
                            case 1:
                            if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==1){
                                marketingSpendingElecssories[0].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }else if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==2){
                                marketingSpendingHealthBeauties[0].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==1){
                                marketingSpendingElecssories[1].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }else if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==2){
                                marketingSpendingHealthBeauties[1].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==1){
                                marketingSpendingElecssories[2].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }else if(data.data.f_MarketingSpendingEffectiveness[i].categoryID==2){
                                marketingSpendingHealthBeauties[2].data.push(data.data.f_MarketingSpendingEffectiveness[i].value);
                            }
                            break;
                        }
                    }
                }
            }

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_PortfolioStrength.length;i++){
                    if(data.data.f_PortfolioStrength[i].period==currentCategories[j]){
                        switch(data.data.f_PortfolioStrength[i].supplierID){
                            case 1:
                            if(data.data.f_PortfolioStrength[i].categoryID==1){
                                portfolioStrengthElecssories[0].data.push(data.data.f_PortfolioStrength[i].value);
                            }else if(data.data.f_PortfolioStrength[i].categoryID==2){
                                portfolioStrengthHealthBeauties[0].data.push(data.data.f_PortfolioStrength[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_PortfolioStrength[i].categoryID==1){
                                portfolioStrengthElecssories[1].data.push(data.data.f_PortfolioStrength[i].value);
                            }else if(data.data.f_PortfolioStrength[i].categoryID==2){
                                portfolioStrengthHealthBeauties[1].data.push(data.data.f_PortfolioStrength[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_PortfolioStrength[i].categoryID==1){
                                portfolioStrengthElecssories[2].data.push(data.data.f_PortfolioStrength[i].value);
                            }else if(data.data.f_PortfolioStrength[i].categoryID==2){
                                portfolioStrengthHealthBeauties[2].data.push(data.data.f_PortfolioStrength[i].value);
                            }
                            break;
                        }
                    }
                }
            }

            //bmChannelStrength
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersBMValueSalesShare.length;i++){
                    if(data.data.f_SuppliersBMValueSalesShare[i].period==testCategories[j]){
                        switch(data.data.f_SuppliersBMValueSalesShare[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[0].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[1].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[2].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMValueSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersBMValueSalesShare[i].value);
                            }
                            break;
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
                        switch(data.data.f_SuppliersBMVolumeSalesShare[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[0].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[1].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==1){
                                bmChannelStrengthElecssories[2].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersBMVolumeSalesShare[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersBMVolumeSalesShare[i].value);
                            }
                            break;
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
                        switch(data.data.f_SuppliersBMShareOfShoppers[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==1){
                                bmChannelStrengthElecssories[0].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==1){
                                bmChannelStrengthElecssories[1].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==1){
                                bmChannelStrengthElecssories[2].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersBMShareOfShoppers[i].categoryID==2){
                                bmChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersBMShareOfShoppers[i].value);
                            }
                            break;
                        }
                    }
                }
            }
            //onlineChannelStrength
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_SuppliersOnlineValueSalesShare.length;i++){
                    if(data.data.f_SuppliersOnlineValueSalesShare[i].period==testCategories[j]){
                        switch(data.data.f_SuppliersOnlineValueSalesShare[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[0].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[1].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[2].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineValueSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersOnlineValueSalesShare[i].value);
                            }
                            break;
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
                        switch(data.data.f_SuppliersOnlineVolumeSalesShare[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[0].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[1].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==1){
                                onlineChannelStrengthElecssories[2].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }else if(data.data.f_SuppliersOnlineVolumeSalesShare[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersOnlineVolumeSalesShare[i].value);
                            }
                            break;
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
                        switch(data.data.f_SuppliersOnlineShareOfShoppers[i].supplierID){
                            case 1:
                            if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==1){
                                onlineChannelStrengthElecssories[0].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[0].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==1){
                                onlineChannelStrengthElecssories[1].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[1].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==1){
                                onlineChannelStrengthElecssories[2].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }else if(data.data.f_SuppliersOnlineShareOfShoppers[i].categoryID==2){
                                onlineChannelStrengthHealthBeauties[2].data.push(data.data.f_SuppliersOnlineShareOfShoppers[i].value);
                            }
                            break;
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

