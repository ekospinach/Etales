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

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_ShoppersShare.length;i++){
                    if(data.data.f_ShoppersShare[i].period==currentCategories[j]){
                        switch(data.data.f_ShoppersShare[i].shopperKind){
                            case 'BMS':
                                if(data.data.f_ShoppersShare[i].marketID==1){
                                    urbanBM[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }else if(data.data.f_ShoppersShare[i].marketID==2){
                                    ruralBM[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }
                            break; 
                            case 'NETIZENS':
                                if(data.data.f_ShoppersShare[i].marketID==1){
                                    urbanOnline[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }else if(data.data.f_ShoppersShare[i].marketID==2){
                                    ruralOnline[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }
                            break; 
                            case 'MIXED':
                                if(data.data.f_ShoppersShare[i].marketID==1){
                                    urbanMixed[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }else if(data.data.f_ShoppersShare[i].marketID==2){
                                    ruralMixed[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }
                            break; 
                            case 'ALLSHOPPERS':
                                if(data.data.f_ShoppersShare[i].marketID==1){
                                    urbanTotal[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }else if(data.data.f_ShoppersShare[i].marketID==2){
                                    ruralTotal[data.data.f_ShoppersShare[i].actorID-1].data.push(data.data.f_ShoppersShare[i].value);
                                }
                            break; 
                        }

                    }
                }
            }
            $scope.urbanOnlineShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: urbanOnline,
                title: {
                    text: 'Online Only'
                },
                loading: false
            }
            $scope.urbanBMShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: urbanBM,
                title: {
                    text: 'B & M Only'
                },
                loading: false
            }
            $scope.urbanMixedShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: urbanMixed,
                title: {
                    text: 'Mixed'
                },
                loading: false
            }
            $scope.urbanTotalShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: urbanTotal,
                title: {
                    text: 'Total'
                },
                loading: false
            }
            $scope.ruralOnlineShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: ruralOnline,
                title: {
                    text: 'Online Only'
                },
                loading: false
            }
            $scope.ruralBMShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: ruralBM,
                title: {
                    text: 'B & M Only'
                },
                loading: false
            }
            $scope.ruralMixedShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: ruralMixed,
                title: {
                    text: 'Mixed'
                },
                loading: false
            }
            $scope.ruralTotalShareOfShoppers={
                options: {
                    xAxis: {
                        categories: currentCategories,
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
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: ruralTotal,
                title: {
                    text: 'Total'
                },
                loading: false
            }




        });
    }
    initPage();
}

