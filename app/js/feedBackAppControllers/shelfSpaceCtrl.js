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

        var currentShelfSpaceElecssories=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7', actorID : 1},
            {name:'Supplier-2',data:new Array(),color:'#B11E22', actorID : 2},
            {name:'Supplier-3',data:new Array(),color:'#F6B920', actorID : 3},
            //{name:'Supplier-4',data:new Array(),color:'#329444', actorID : 4},
            {name:'Retailer-1',data:new Array(),color:'#8B288B', actorID : 5},
            {name:'Retailer-2',data:new Array(),color:'#329444', actorID : 6},
            {name:'Retailer-3',data:new Array(),color:'#00AFEF', actorID : 7});
        var currentShelfSpaceHealthBeauties=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7', actorID : 1},
            {name:'Supplier-2',data:new Array(),color:'#B11E22', actorID : 2},
            {name:'Supplier-3',data:new Array(),color:'#F6B920', actorID : 3},
            //{name:'Supplier-4',data:new Array(),color:'#329444', actorID : 4},
            {name:'Retailer-1',data:new Array(),color:'#8B288B', actorID : 5},
            {name:'Retailer-2',data:new Array(),color:'#329444', actorID : 6},
            {name:'Retailer-3',data:new Array(),color:'#00AFEF', actorID : 7});

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_ShelfSpaceAllocation.length;i++){
                if($scope.feedBack.f_ShelfSpaceAllocation[i].period==currentCategories[j]){

                    if($scope.feedBack.f_ShelfSpaceAllocation[i].categoryID==1){

                        currentShelfSpaceElecssories.forEach(function(value, item, array){
                            if($scope.feedBack.f_ShelfSpaceAllocation[i].actorID == array[item].actorID){
                                array[item].data.push($scope.feedBack.f_ShelfSpaceAllocation[i].value * 100);
                            }
                        })

                    }else if($scope.feedBack.f_ShelfSpaceAllocation[i].categoryID==2){
                        currentShelfSpaceHealthBeauties.forEach(function(value, item, array){
                            if($scope.feedBack.f_ShelfSpaceAllocation[i].actorID == array[item].actorID){
                                array[item].data.push($scope.feedBack.f_ShelfSpaceAllocation[i].value * 100);
                            }
                        })

                    }
                }
            }
        }
        

        $scope.currentShelfSpaceElecssories = {
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
                        text: 'Shelf Space Allocation (%)',
                        style: {
                            'font-size':'16px'
                        }
                    },

                    gridLineColor: 'transparent',
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
                        text: 'Shelf Space Allocation (%)',
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

    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

