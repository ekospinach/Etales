var retailerKPIsCtrl=function($scope,$http){
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
                myCategories.push(i);
                currentCategories.push(i);
                previousCategories.push(i); 
            }else{
                currentCategories.push(i);
                myCategories.push(i);
            }
        }
        myCategories.push('');
        for(var i=-3;i<=Request['period'];i++){
            myCategories.push(i);
        }

        var salesValueElecssories=new Array();


        $http({
            method:'GET',
            url:url
        }).then(function(data){
            var rotationIndexSalesValueElecssories=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesValueHealthBeauties=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesVolumeElecssories=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesVolumeHealthBeauties=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            //rotationIndexSalesValue
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersValueRotationIndex.length;i++){
                    if(data.data.f_RetailersValueRotationIndex[i].period==currentCategories[j]){
                        if(data.data.f_RetailersValueRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==2){
                                rotationIndexSalesValueElecssories[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersValueRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==2){
                                rotationIndexSalesValueHealthBeauties[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }
                    }
                }
            }
            for(var i=0;i<2;i++){
                rotationIndexSalesValueElecssories[i].data.push('');
                rotationIndexSalesValueHealthBeauties[i].data.push('');
            }
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersValueRotationIndex.length;i++){
                    if(data.data.f_RetailersValueRotationIndex[i].period==currentCategories[j]){
                        if(data.data.f_RetailersValueRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==1){
                                rotationIndexSalesValueElecssories[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersValueRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==1){
                                rotationIndexSalesValueHealthBeauties[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }
                    }
                }
            }
            //rotationIndexSalesVolume
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersVolumeRotationIndex.length;i++){
                    if(data.data.f_RetailersVolumeRotationIndex[i].period==currentCategories[j]){
                        if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==2){
                                rotationIndexSalesVolumeElecssories[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==2){
                                rotationIndexSalesVolumeHealthBeauties[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }
                    }
                }
            }
            for(var i=0;i<2;i++){
                rotationIndexSalesVolumeElecssories[i].data.push('');
                rotationIndexSalesVolumeHealthBeauties[i].data.push('');
            }
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersVolumeRotationIndex.length;i++){
                    if(data.data.f_RetailersVolumeRotationIndex[i].period==currentCategories[j]){
                        if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==1){
                                rotationIndexSalesVolumeElecssories[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==1){
                                rotationIndexSalesVolumeHealthBeauties[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }
                    }
                }
            }



            $scope.rotationIndexSalesValueElecssories={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '$mln'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    // legend: {
                    //     layout: 'vertical',
                    //     align: 'right',
                    //     verticalAlign: 'middle'
                    // },
                    credits: {
                        enabled: false
                    }
                },
                series: rotationIndexSalesValueElecssories,
                title: {
                    text: 'Elecssories - Sales Value'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }
            $scope.rotationIndexSalesValueHealthBeauties={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '$mln'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    // legend: {
                    //     layout: 'vertical',
                    //     align: 'right',
                    //     verticalAlign: 'middle'
                    // },
                    credits: {
                        enabled: false
                    }
                },
                series: rotationIndexSalesValueHealthBeauties,
                title: {
                    text: 'HealthBeauties - Sales Value'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }

            $scope.rotationIndexSalesVolumeElecssories={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: 'mln units'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    // legend: {
                    //     layout: 'vertical',
                    //     align: 'right',
                    //     verticalAlign: 'middle'
                    // },
                    credits: {
                        enabled: false
                    }
                },
                series: rotationIndexSalesVolumeElecssories,
                title: {
                    text: 'Elecssories - Sales Volume'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }
            $scope.rotationIndexSalesVolumeHealthBeauties={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: 'mln units'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    // legend: {
                    //     layout: 'vertical',
                    //     align: 'right',
                    //     verticalAlign: 'middle'
                    // },
                    credits: {
                        enabled: false
                    }
                },
                series: rotationIndexSalesVolumeHealthBeauties,
                title: {
                    text: 'HealthBeauties - Sales Volume'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
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

