define(['directives', 'services'], function(directives){

    directives.directive('retailerPrivateLabelPortfolioManagement', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo','$modal', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo,$modal){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_privateLabelPortfolioManagement.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    scope.currentPeriod=PeriodInfo.getCurrentPeriod();
                    scope.packs = [{
                        value: 1, text: Label.getContent('ECONOMY')
                    },{
                        value: 2, text: Label.getContent('STANDARD')
                    },{
                        value: 3, text: Label.getContent('PREMIUM')
                    }]; 
                    scope.parameter="NewBrand";/*default add new Brand*/                    
					RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
						scope.pageBase = base;
					}).then(function(){
						return showView();
					}), function(reason){
						console.log('from ctr: ' + reason);
					}, function(update){
						console.log('from ctr: ' + update);
					};                    
                }

                var loadSelectCategory=function(category){
                    var count=0,categoryID=1;
                    var products=new Array();
                    var postDatas=new Array();
                    var allRetCatDecisions=_.filter(scope.pageBase.retCatDecision,function(obj){
                        if(category=="HealthBeauty"){
                            return (obj.categoryID==2);
                        }else{
                            return (obj.categoryID==1);
                        }
                    });
                    if(category=="HealthBeauty"){
                        categoryID=2;
                    }else{
                        categoryID=1;
                    }

                    for(var i=0;i<allRetCatDecisions.length;i++){
		      			for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
							if(allRetCatDecisions[i].privateLabelDecision[j]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=0){      				
			      				for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
				      				//if varName is null -->var is null
				      				if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=""){
				      				//if varID is 0 -->var is null
				      					products.push(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]);
					      				products[count].category=category;
					      				products[count].parentBrandName=allRetCatDecisions[i].privateLabelDecision[j].brandName;
					      				if(products[count].packFormat=="ECONOMY"){
					   						products[count].packFormat=1;
					   					}
					      				else if(products[count].packFormat=="STANDARD"){
					      					products[count].packFormat=2;
					      				}
					      				else if(products[count].packFormat=="PREMIUM"){
					      					products[count].packFormat=3;
					   					}
					   					count++;
				  					}
			      				}
			      			}
	      				}
		      		}
                    for(var i=0;i<products.length;i++){
                        postDatas[i]={
                            period : PeriodInfo.getCurrentPeriod(),
                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
                            brandName : products[i].parentBrandName,
                            varName : products[i].varName,
                            catID : categoryID,
                            userRole :  4,
                            userID : parseInt(PlayerInfo.getPlayer()),
                        }
                    }
                    (function multipleRequestShooter(postDatas,idx){
                        $http({
                            method:'POST',
                            url:'/getCurrentUnitCost',
                            data:postDatas[idx]
                        }).then(function(data){
                            products[idx].unitCost=data.data.result;
                        },function(data){
                            idx=postDatas.length-1;
                        }).finally(function(){
                            if(idx!=postDatas.length-1){
                                idx++;
                                multipleRequestShooter(postDatas,idx);
                            }else{
                                if (category == "Elecssories") {
                                    scope.productes = products;
                                } else {
                                    scope.producths = products;
                                }
                                if(scope.productes.length!=0&&scope.producths.length!=0){
                                    scope.selectPacks = selectPacks;
                                }
                            }
                        })
                    })(postDatas,0)
                }

                var selectPacks = function(category,parentBrandName,varName) {
                    var selected,postion=-1;
                    if(scope.productes.length>1&&scope.producths.length>1){
                        if(category=="Elecssories"){
                            for(var i=0;i<scope.productes.length;i++){
                                if(scope.productes[i].parentBrandName==parentBrandName&&scope.productes[i].varName==varName){
                                    selected = $filter('filter')(scope.packs, {value: scope.productes[i].packFormat});
                                    postion=i;
                                    break;
                                }
                            }
                            if(postion!=-1&&selected!=undefined){
                                return (scope.productes[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
                            }
                            else{
                                return Label.getContent('Not set'); 
                            }
                        }else{
                            for(var i=0;i<scope.producths.length;i++){
                                if(scope.producths[i].parentBrandName==parentBrandName&&scope.producths[i].varName==varName){
                                    selected = $filter('filter')(scope.packs, {value: scope.producths[i].packFormat});
                                    postion=i;
                                    break;
                                }
                            }
                            if(postion!=-1&&selected!=undefined){
                                return (scope.producths[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
                            }
                            else{
                                return Label.getContent('Not set'); 
                            }
                        } 
                    }else{
                        return Label.getContent('Not set'); 
                    }
                        
                }

                /*
                Private Labels are produced by supplier 4. 
                It's Acquired Technology Level and others are constantly upgraded 
                and are supposed to be used for "Hi-Tech" products competing with 
                with products from S1, S2, S3. Production of Private Labels is a 
                sort of spin-off activity. Producer 4 is not using its highest 
                technology, designn, etc levels to produce Private Labels.

                So, for Private Labels, yoy have to take everything three levels below. 

                For instance, if Producer 4 has Acquired Technology Level = 12, 
                he can produce his own hi-tech products using ATL=12, 
                but private labels ordered at producer 4 can only use ATL = 9 = (12 -3)
                */               

                //Design Level range : 1 ~ (AcquiredDesignLevel - 3)
				scope.checkDesign=function(category,brandName,varName,location,additionalIdx,index,value){
					var d = $q.defer();	
					var categoryID=0,max=0;
					var filter=/^[0-9]*[1-9][0-9]*$/;
					if(!filter.test(value)){
						d.resolve(Label.getContent('Input a Integer'));
					}
					var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/4';
					$http({
						method:'GET',
						url:url
					}).then(function(data){
					   if(category=="Elecssories"){
                            categoryID=1;
                        }else{
                            categoryID=2;
                        }
                        max=data.data.acquiredDesignLevel[categoryID-1]-3;
                        if(value<1||value>max){
                            d.resolve(Label.getContent('Input range')+':1~'+max);
                        }else{
                            d.resolve();
                        }	
					},function(){
						d.resolve(Label.getContent('fail'));
					});
					return d.promise;
				}
                //Technology range : 1 ~ (AcquiredDesignLevel - 3)
				scope.checkTechnology=function(category,brandName,varName,location,additionalIdx,index,value){
					var d=$q.defer();
					var categoryID=0,max=0;
					var filter=/^[0-9]*[1-9][0-9]*$/;
					if(!filter.test(value)){
						d.resolve(Label.getContent('Input a Integer'));
					}
					var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
					$http({
						method:'GET',
						url:url
					}).then(function(data){
                        if(category=="Elecssories"){
                            categoryID=1;
                        }else{
                            categoryID=2;
                        }
                        max=data.data.acquiredTechnologyLevel[categoryID-1]-3;
                        if(value<1||value>max){
                            d.resolve(Label.getContent('Input range')+':1~'+max);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    })
					return d.promise;
				}

                //Quality-of-Raw Materials & Smoothener Level Range : 1 ~ CurrentTechnologyLevel + 2
				scope.checkValue=function(category,brandName,varName,location,additionalIdx,index,value){
					var d=$q.defer();
					var categoryID=0,max=0;
					var filter=/^[0-9]*[1-9][0-9]*$/;
					if(!filter.test(value)){
						d.resolve(Label.getContent('Input a Integer'));
					}
					var url="/retailerCurrentDecision/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+brandName+'/'+varName;
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
						max=data.data.composition[1]+2;
						if(value<1||value>max){
							d.resolve(Label.getContent('Input range')+':1~'+max);
						}else{
							d.resolve();
						}
					},function(){
						d.resolve(Label.getContent('fail'));
					});
					return d.promise;
				}

                scope.openProductModal = function () {
                    var modalInstance=$modal.open({
                        templateUrl:'../../partials/modal/retailerNewProductModal.html',
                        controller:retailerNewProductModalCtrl
                    });

                    modalInstance.result.then(function(){
                        console.log('retailerNewProductModal');
                    })
                };

                
                var retailerNewProductModalCtrl=function($rootScope,$scope,$modalInstance,Label,SeminarInfo,RoleInfo,PeriodInfo,PlayerInfo,ProducerDecisionBase){
                    $scope.Label=Label;
                    $scope.pageBase=scope.pageBase;
                    /*set add function is lauch new Brand*/
                    var setAddNewBrand=function(){
                        $scope.parameter="NewBrand";/*add new Brand*/
                        $scope.newBrand=true;
                        $scope.newVariant=false;
                        $scope.lauchNewCategory=1;
                        setBrandName($scope.lauchNewCategory);
                    }   
                    /*set add function is add under a existed brand*/
                    var setAddNewProUnderBrand=function(){
                        $scope.parameter="ExistedBrand";/*add new product under existed Brand*/
                        $scope.newBrand=false;
                        $scope.newVariant=true;
                        $scope.addNewCategory=1;
                        loadAllBrand($scope.addNewCategory);
                    }
                    /*SetBrand first and last name*/
                    var setBrandName=function(category){
                        $scope.lauchNewCategory=category;
                        if(category==1){
                            category="Elecssories";
                            $scope.brandFirstName="E";
                        }else{
                            category="HealthBeauty";
                            $scope.brandFirstName="H";
                        }
                        $scope.brandLastName=parseInt(parseInt(PlayerInfo.getPlayer()))+4;/*need check*/
                    }
                    var loadByCategory=function(category){
                        return _.filter($scope.pageBase.retCatDecision,function(obj){
                            if(category=="HealthBeauty"){
                                return (obj.categoryID==2);
                            }else{
                                return (obj.categoryID==1);
                            }
                        });
                    }
                    /*LoadAllBrand by category*/
                    var loadAllBrand=function(category){
                        $scope.addNewCategory=category;
                        if(category==1){
                            category="Elecssories";
                        }else{
                            category="HealthBeauty";
                        }
                        var allretCatDecisions=loadByCategory(category);
                        var allBrands=new Array();
                        for(var i=0;i<allretCatDecisions.length;i++){
                            for(var j=0;j<allretCatDecisions[i].privateLabelDecision.length;j++){
                                if(allretCatDecisions[i].privateLabelDecision[j]!=undefined&&allretCatDecisions[i].privateLabelDecision[j].brandID!=undefined&&allretCatDecisions[i].privateLabelDecision[j].brandID!=0){
                                    allBrands.push({'BrandID':allretCatDecisions[i].privateLabelDecision[j].brandID,'BrandName':allretCatDecisions[i].privateLabelDecision[j].brandName});
                                }
                            }   
                        }
                        $scope.allBrands=allBrands;
                        $scope.addChooseBrand=allBrands[0].BrandID;
                    }
                    var showbubleMsg = function(content, status){
                        $scope.bubleMsg = ' ' + content;
                        switch(status){
                            case 1: 
                                $scope.bubleClassName = 'alert alert-danger'; 
                                $scope.bubleTitle = Label.getContent('Error')+'!';
                                break;
                            case 2: 
                                $scope.bubleClassName = 'alert alert-success'; 
                                $scope.bubleTitle = Label.getContent('Success')+'!';
                                break;
                            case 3:
                                $scope.bubleClassName = 'alert alert-block'; 
                                $scope.bubleTitle = Label.getContent('Warning')+'!';
                                break;              
                            default:
                             $scope.bubleClassName = 'alert'; 
                        }
                        $scope.infoBuble = true;
                    }
                    
                    var addNewProduct=function(parameter){
                        var newBrand=new RetailerDecision();
                        var nullDecision=new RetailerDecision();
                        nullDecision.varName="";
                        nullDecision.varID=0;
                        nullDecision.parentBrandID=0;
                        nullDecision.dateOfBirth=0;
                        nullDecision.dateOfDeath=0;
                        nullDecision.packFormat="ECONOMY";
                        nullDecision.composition=new Array(1,1,1);
                        nullDecision.discontinue=false;

                        var newretailerDecision=new RetailerDecision();
                        newretailerDecision.packFormat="ECONOMY";
                        newretailerDecision.dateOfBirth=PeriodInfo.getCurrentPeriod();
                        newretailerDecision.dateOfDeath=10;
                        newretailerDecision.composition=new Array(1,1,1);
                        newretailerDecision.discontinue=false;
                        var url="";
                        if(parameter=="NewBrand"){/*lauch new Brand*/
                            var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
                                return (obj.categoryID==$scope.lauchNewCategory);
                            });
                            newBrand.brandID=calculateBrandID(retVariantDecision,PlayerInfo.getPlayer());
                            newBrand.brandName=$scope.brandFirstName+myForm[1].value+(parseInt(PlayerInfo.getPlayer())+4);
                            newBrand.parentCompanyID=PlayerInfo.getPlayer()+4;
                            newBrand.dateOfDeath=10;
                            newBrand.dateOfBirth=PeriodInfo.getCurrentPeriod();
                            newBrand.privateLabelVarDecision=new Array();
                            newretailerDecision.parentBrandID=newBrand.brandID;
                            newretailerDecision.varName='_'+myForm[1].value;/*need check*/
                            newretailerDecision.varID=10*newBrand.brandID+1;/*need check*/
                            newBrand.privateLabelVarDecision.push(newretailerDecision,nullDecision,nullDecision);
                            
                            url="/checkRetailerProduct/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+$scope.lauchNewCategory+'/brand/'+newBrand.brandName+'/'+newretailerDecision.varName;
                            $http({
                                method:'GET',
                                url:url
                            }).then(function(data){
                                RetailerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
                                showbubleMsg(Label.getContent('Add new brand successful'),2);
                                cancel();
                            },function(data){
                                showbubleMsg(Label.getContent('Add new brand fail')+','+Label.getContent(data.data.message),1);
                            })
                        }else{/*add new product under existed Brand*/
                            var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
                                return (obj.categoryID==$scope.addNewCategory);
                            }); 
                            newretailerDecision.parentBrandID=parseInt(myForm[4].value);
                            newretailerDecision.varName='_'+myForm[5].value;/*need check*/
                            var privateLabelDecision=_.find(retVariantDecision.privateLabelDecision,function(obj){
                                return (obj.brandID==newretailerDecision.parentBrandID);
                            });
                            newretailerDecision.varID=calculateVarID(privateLabelDecision,newretailerDecision.parentBrandID);//121;/*need check*/
                            var newBrandName="";
                            for(var i=0;i<$scope.allBrands.length;i++){
                                if($scope.allBrands[i].BrandID==newretailerDecision.parentBrandID){
                                    newBrandName=$scope.allBrands[i].BrandName;
                                    break;
                                }
                            }
                            url="/checkRetailerProduct/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+$scope.addNewCategory+'/variant/'+newBrandName+'/'+newretailerDecision.varName;
                            $http({
                                method:'GET',
                                url:url
                            }).then(function(data){
                                RetailerDecisionBase.addProductExistedBrand(newretailerDecision,$scope.addNewCategory,newBrandName);
                                showbubleMsg(Label.getContent('Add new variant successful'),2);
                                cancel();
                            },function(data){
                                showbubleMsg(Label.getContent('Add new variant fail')+','+Label.getContent(data.data.message),1);
                            });                     
                        }
                    }

                    $scope.setAddNewBrand=setAddNewBrand;
                    $scope.setAddNewProUnderBrand=setAddNewProUnderBrand;
                    $scope.addNewProduct=addNewProduct;
                    $scope.setBrandName=setBrandName;
                    $scope.loadAllBrand=loadAllBrand;
                    $scope.loadByCategory=loadByCategory;
                    $scope.showbubleMsg=showbubleMsg;
                    setAddNewBrand();
                    var calculateBrandID=function(retVariantDecision,retailerID){
                        var result=0,min=10*(retailerID+4)+1,max=(retailerID+4)*10+4;
                        var nums=new Array();
                        for(var i=0;i<retVariantDecision.privateLabelDecision.length;i++){
                            if(retVariantDecision.privateLabelDecision[i]!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=""){
                                nums.push(retVariantDecision.privateLabelDecision[i].brandID);
                            }
                        }
                        nums.sort(function(a,b){return a>b?1:-1});
                        //未到最大值
                        if(max!=nums[nums.length-1]){
                            result=nums[nums.length-1]+1;
                        }
                        //已经到最大值 最小值删除
                        else if(min!=nums[0]){
                            result=min;
                        }
                        else{
                            for(var i=0;i<nums.length-1;i++){
                                if(nums[i+1]-nums[i]!=1){
                                    result=nums[i]+1;
                                    break;
                                }
                            }
                        }
                        return result;
                    }

                    var calculateVarID=function(privateLabelDecision,parentBrandID){
                        var result=0;min=parentBrandID*10+1,max=parentBrandID*10+3;
                        var nums=new Array();
                        for(var i=0;i<privateLabelDecision.privateLabelVarDecision.length;i++){
                            if(privateLabelDecision.privateLabelVarDecision[i]!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varName!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varName!=""){
                                nums.push(privateLabelDecision.privateLabelVarDecision[i].varID);
                            }
                        }
                        nums.sort(function(a,b){return a>b?1:-1});
                        //未到最大值
                        if(max!=nums[nums.length-1]){
                            result=nums[nums.length-1]+1;
                        }
                        //已经到最大值 最小值删除
                        else if(min!=nums[0]){
                            result=min;
                        }
                        else{
                            result=min+1;
                        }
                        return result;
                    }

                    var cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.cancel=cancel;
                }

                scope.updateRetailerDecision=function(category,brandName,varName,location,addtionalIdx,index,value){
					var categoryID;
					if(category=="Elecssories"){
						categoryID=1;
					}
					else{
						categoryID=2;
					}
					if(location=="composition"){
						RetailerDecisionBase.setRetailerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,value);							
					}
					else{
						RetailerDecisionBase.setRetailerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,value);													
					}
					scope.$broadcast('retailerDecisionBaseChanged');
				}

                

                scope.deleteProduct=function(category,brandName,varName){
			    	if(category=="Elecssories"){
			    		category=1;
			    	}else{
			    		category=2;
			    	}
			    	RetailerDecisionBase.deleteProduct(category,brandName,varName);	
			    }

                var showView=function(){
                    var d=$q.defer();
                    loadSelectCategory('Elecssories');
                    loadSelectCategory('HealthBeauty');
                    scope.isResultShown = true;
                    scope.isPageLoading = false; 
					return d.promise;      
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
                
                scope.$on('retailerDecisionBaseChangedFromServer', function(event, data, newBase) {  
                            scope.pageBase = newBase;
                            showView();
                });             

            }
        }
    }])
})