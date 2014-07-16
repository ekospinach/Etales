var shareOfShoppersCtrl=function($scope,$http){
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
        var currentCategories=new Array();

        for(var i=-3;i<=Request['period'];i++){
            currentCategories.push(i);
        }
        

        $http({
            method:'GET',
            url:url
        }).then(function(data){

            var urbanOnline=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var urbanBM=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var urbanMixed=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var urbanTotal=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var ruralOnline=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var ruralBM=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var ruralMixed=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            var ruralTotal=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});


            // for(var j=0;j<currentCategories.length;j++){
            //     for(var i=0;i<data.data.f_ShoppersShare.length;i++){
            //         if(data.data.f_ShoppersShare[i].period==currentCategories[j]){
            //             if()
            //         }
            //     }
            // }

            // //B&M Shoppers
            // for(var j=0;j<testCategories.length;j++){
            //     for(var i=0;i<data.data.f_RetailersBMShoppersShare.length;i++){
            //         if(data.data.f_RetailersBMShoppersShare[i].period==testCategories[j]){
            //             if(data.data.f_RetailersBMShoppersShare[i].categoryID==3){
            //                 if(data.data.f_RetailersBMShoppersShare[i].marketID==2){
            //                     ruralShareOfShoppers[data.data.f_RetailersBMShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersBMShoppersShare[i].value);
            //                 }else if(data.data.f_RetailersBMShoppersShare[i].marketID==1){
            //                     urbanShareOfShoppers[data.data.f_RetailersBMShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersBMShoppersShare[i].value);
            //                 }
            //             }
            //         }
            //     }
            // }
            // //ALL Shoppers is not ready
            // for(var i=0;i<2;i++){
            //     ruralShareOfShoppers[i].data.push('');
            //     urbanShareOfShoppers[i].data.push('');
            // }
            // for(var j=0;j<testCategories.length;j++){
            //     for(var i=0;i<data.data.f_RetailersAllShoppersShare.length;i++){
            //         if(data.data.f_RetailersAllShoppersShare[i].period==testCategories[j]){
            //             if(data.data.f_RetailersAllShoppersShare[i].categoryID==3){
            //                 if(data.data.f_RetailersAllShoppersShare[i].marketID==2){
            //                     ruralShareOfShoppers[data.data.f_RetailersAllShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersAllShoppersShare[i].value);
            //                 }else if(data.data.f_RetailersAllShoppersShare[i].marketID==1){
            //                     urbanShareOfShoppers[data.data.f_RetailersAllShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersAllShoppersShare[i].value);
            //                 }
            //             }
            //         }
            //     }
            // }

            // $scope.ruralShareOfShoppers={
            //     options: {
            //         xAxis: {
            //             categories: myCategories,
            //             title: {
            //                 text: 'Period'
            //             }
            //         },
            //         yAxis:{
            //             title: {
            //                 text: '%'
            //             },
            //             gridLineColor: 'transparent'
            //         },
            //         chart: {
            //             type: 'column',
            //             backgroundColor: 'transparent',
            //         },
            //         tooltip: {
            //             formatter: function() {
            //                 var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
            //                 return s;
            //             },
            //             shared: false,
            //             useHTML: true
            //         },
            //         plotOptions: {
            //             series: {
            //                 stacking: 'percent'
            //             }
            //         },
            //         // legend: {
            //         //     layout: 'vertical',
            //         //     align: 'right',
            //         //     verticalAlign: 'middle'
            //         // },
            //         credits: {
            //             enabled: false
            //         }
            //     },
            //     series: ruralShareOfShoppers,
            //     title: {
            //         text: 'Rural Market'
            //     },
            //     subtitle: {
            //         text: '<p style="font-size:20px;float:left;" class="text-left">B&M Shoppers</p><p style="font-size:20px;float:right;" class="text-right">All Shoppers</p>',
            //         useHTML:true,

            //     },
            //     credits: {
            //         enabled: false
            //     },
            //     loading: false
            // }
            // $scope.urbanShareOfShoppers={
            //     options: {
            //         xAxis: {
            //             categories: myCategories,
            //             title: {
            //                 text: 'Period'
            //             }
            //         },
            //         yAxis:{
            //             title: {
            //                 text: '%'
            //             },
            //             gridLineColor: 'transparent'
            //         },
            //         chart: {
            //             type: 'column',
            //             backgroundColor: 'transparent',
            //         },
            //         tooltip: {
            //             formatter: function() {
            //                 var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
            //                 return s;
            //             },
            //             shared: false,
            //             useHTML: true
            //         },
            //         plotOptions: {
            //             series: {
            //                 stacking: 'percent'
            //             }
            //         },
            //         // legend: {
            //         //     layout: 'vertical',
            //         //     align: 'right',
            //         //     verticalAlign: 'middle'
            //         // },
            //         credits: {
            //             enabled: false
            //         }
            //     },
            //     series: urbanShareOfShoppers,
            //     title: {
            //         text: 'Urban Market'
            //     },
            //     subtitle: {
            //         text: '<p style="font-size:20px;float:left;" class="text-left">B&M Shoppers</p><p style="font-size:20px;float:right;" class="text-right">All Shoppers</p>',
            //         useHTML:true,

            //     },
            //     credits: {
            //         enabled: false
            //     },
            //     loading: false
            // }

        });
    }
    initPage();
}

