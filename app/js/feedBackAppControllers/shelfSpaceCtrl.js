var shelfSpaceCtrl=function($scope,$http){
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
        var previousCategories=new Array();

        for(var i=-3;i<=Request['period'];i++){
            if(i!=Request['period']){
                currentCategories.push(i);
                previousCategories.push(i); 
            }else{
                currentCategories.push(i);
            }
        }

        $http({
            method:'GET',
            url:url
        }).then(function(data){
            var currentShelfSpaceElecssories=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var currentShelfSpaceHealthBeauties=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_ShelfSpaceAllocation.length;i++){
                    if(data.data.f_ShelfSpaceAllocation[i].period==currentCategories[j]){
                        switch(data.data.f_ShelfSpaceAllocation[i].actorID){
                            case 1:
                            if(data.data.f_ShelfSpaceAllocation[i].categoryID==1){
                                currentShelfSpaceElecssories[0].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }else if(data.data.f_ShelfSpaceAllocation[i].categoryID==2){
                                currentShelfSpaceHealthBeauties[0].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_ShelfSpaceAllocation[i].categoryID==1){
                                currentShelfSpaceElecssories[1].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }else if(data.data.f_ShelfSpaceAllocation[i].categoryID==2){
                                currentShelfSpaceHealthBeauties[1].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_ShelfSpaceAllocation[i].categoryID==1){
                                currentShelfSpaceElecssories[2].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }else if(data.data.f_ShelfSpaceAllocation[i].categoryID==2){
                                currentShelfSpaceHealthBeauties[2].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }
                            break;
                            case 4:
                            if(data.data.f_ShelfSpaceAllocation[i].categoryID==1){
                                currentShelfSpaceElecssories[3].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }else if(data.data.f_ShelfSpaceAllocation[i].categoryID==2){
                                currentShelfSpaceHealthBeauties[3].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }
                            break;
                            case 5:
                            if(data.data.f_ShelfSpaceAllocation[i].categoryID==1){
                                currentShelfSpaceElecssories[4].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }else if(data.data.f_ShelfSpaceAllocation[i].categoryID==2){
                                currentShelfSpaceHealthBeauties[4].data.push(data.data.f_ShelfSpaceAllocation[i].value);
                            }
                            break;
                        }
                    }
                }
            }
            
            $scope.currentShelfSpaceElecssories = {
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
                            text: 'Shelf Space Allocation (%)'
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
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Shelf Space Allocation:'+this.point.y.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: currentShelfSpaceElecssories,
                loading: false
            }
            $scope.currentShelfSpaceHealthBeauties = {
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
                            text: 'Shelf Space Allocation (%)'
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
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Shelf Space Allocation:'+this.point.y.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: currentShelfSpaceHealthBeauties,
                loading: false
            }

        });
    }
    initPage();
}

