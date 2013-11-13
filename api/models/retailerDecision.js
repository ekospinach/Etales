var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    q = require('q');

var privateLabelVarDecision = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
    dateOfDeath : Number,
    dateOfBirth : Number,
    packFormat : String,
    composition : [Number],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    discontinue : Boolean    
})

var privateLabelDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,
    /*
        case 'P': brandID = (10 * userCount) + brandCount
        case 'R': brandID = (10 * (userCount +4)) + brandCount
        userCount = 1~4
        brandCount = 1~5
    */    
    parentCompanyID : Number,
    /*
        Prod_1_ID          = 1;
        Prod_2_ID          = 2;
        Prod_3_ID          = 3;
        Prod_4_ID          = 4;
        Ret_1_ID           = 5;
        Ret_2_ID           = 6;
        TradTrade_ID       = 7;
        E_Mall_ID          = 8;
        Admin_ID           = 9;
    */  
    dateOfBirth : Number, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
    dateOfDeath : Number, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
    privateLabelVarDecision : [privateLabelVarDecision] //length: TOneBrandVars(1~3)
})

//date strute for private labels (step 3)
var retCatDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    privateLabelDecision : [privateLabelDecisionSchema] //length: TPrivateLabels(1~4, effective number is 3)
})

var retVariantDecisionSchema = mongoose.Schema({
    brandID : Number,
    variantID : Number,
    brandName : String, //need Dariusz to add this in dataStruture
    varName : String, //need Dariusz to add this in dataStruture
    dateOfBirth : Number,
    dateOfDeath : Number,
    order : Number,
    pricePromotions : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1
    },
    retailerPrice : Number,
    shelfSpace : Number //saved as a %
})


var retQuarterAssortmentDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    retVariantDecision : [retVariantDecisionSchema] //length : TRetVariants(1~21)
})

//date struture for decision (step 2,4)
var retMarketDecisionSchema = mongoose.Schema({
    marketID : Number, //1~2
    categorySurfaceShare : [Number], //[1]for Elecssories [2]for HealthBeauty
    emptySpaceOptimised : Boolean,
    localAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number            
    },
    serviceLevel : String, //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
    retMarketAssortmentDecision : [retQuarterAssortmentDecisionSchema] //length : TCategories(1~2)
})

var retDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    retailerID : Number, //TAllRetailers (1~4)
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    onlineAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number
    },
    tradtionalAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number        
    },
    retCatDecision : [retCatDecisionSchema], //length: TCategories(1~2)
    retMarketDecision: [retMarketDecisionSchema] //length: TMarkets(1~2)
})

var retDecision = mongoose.model('retailerDecision', retDecisionSchema);


exports.addRetailerDecisions = function(options){
    var startFrom = options.startFrom,
    endWith = options.endWith,
    deferred = q.defer();    

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&retailerID=' + options.retailerID
      };
      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else{
            try {
              var singleDecision = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
              console.log(e);
            }
          }      
          if (!singleDecision) return; 
          retDecision.update({seminar: singleDecision.seminar, 
                              period: singleDecision.period,
                              retailerID: singleDecision.retailerID},
                              {nextBudgetExtension: singleDecision.nextBudgetExtension,
                               approvedBudgetExtension: singleDecision.approvedBudgetExtension,
                               onlineAdvertising: singleDecision.onlineAdvertising,
                               tradtionalAdvertising: singleDecision.tradtionalAdvertising,
                               retCatDecision: singleDecision.retCatDecision,
                               retMarketDecision: singleDecision.retMarketDecision},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) next(new Error(err));
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg:'retailerDecision(retailer:'+ options.retailerID + ', seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});                                    
                                  }
                                });   
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom addRetailerDecisions' + e.message,options: options}); 
      });
    })(endWith);

    return deferred.promise;
    
}

exports.newDoc=function(req,res,next){
    var newDoc=new retDecision({
        seminar : 'MAY',
        period : 0,
        retailerID:1,
        onlineAdvertising : {
            PRICE : 10,
            CONVENIENCE : 20,
            ASSORTMENT : 30
        },
        tradtionalAdvertising : {
            PRICE : 11,
            CONVENIENCE : 21,
            ASSORTMENT : 31        
        },
        nextBudgetExtension : 15,
        approvedBudgetExtension : 16,
        retCatDecision : [{
            categoryID:1,
            privateLabelDecision:[{
                brandName : 'ELISA5',
                brandID : 51,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                
                privateLabelVarDecision : [{
                    varName : '_A',
                    varID : 511,
                    parentBrandID : 51,
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    packFormat : 'STANDARD',
                    composition : [4,4,4],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                },{
                    varName : '_B',
                    varID : 512,
                    parentBrandID : 51,
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    packFormat : 'STANDARD',
                    composition : [5,5,5],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false                     
                }] //length: TOneBrandVars(1~3)
            },{
                brandName : 'ELEEX5',
                brandID : 52,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    varName : '_A',
                    varID : 521,
                    parentBrandID : 52,
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    packFormat : 'PREMIUM',
                    composition : [4,4,4],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)
            }]
        },{
            categoryID:2,
            privateLabelDecision:[{
                brandName : 'HARIS5',
                brandID : 51,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    varName : '_A',
                    varID : 511,
                    parentBrandID : 51,
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    packFormat : 'ECONOMY',
                    composition : [3,3,3],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)
            },{
                brandName : 'HICHY5',
                brandID : 52,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    varName : '_A',
                    varID : 521,
                    parentBrandID : 52,
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    packFormat : 'STANDARD',
                    composition : [6,6,6],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)                
            }]
        }], //length: TCategories(1~2)
        retMarketDecision: [{
            marketID : 1, //1~2
            categorySurfaceShare : [10,20], //[1]for Elecssories [2]for HealthBeauty
            emptySpaceOptimised : false,
            localAdvertising : {
                PRICE : 11,
                CONVENIENCE : 22,
                ASSORTMENT : 33            
            },
            serviceLevel : 'MEDIUM', //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
            retMarketAssortmentDecision : [{
                categoryID : 1, //1~2
                retVariantDecision : [{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Etales15', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Etales25', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Etales35', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            },{
                categoryID:2,
                retVariantDecision : [{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Health15', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Health25', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Health35', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            }] //length : TCategories(1~2)
        },{
            marketID : 2, //1~2
            categorySurfaceShare : [20,30], //[1]for Elecssories [2]for HealthBeauty
            emptySpaceOptimised : false,
            localAdvertising : {
                PRICE : 22,
                CONVENIENCE : 33,
                ASSORTMENT : 44            
            },
            serviceLevel : 'BASE', //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
            retMarketAssortmentDecision : [{
                categoryID : 1, //1~2
                retVariantDecision : [{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Etales1', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 20,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Etales2', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Etales3', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            },{
                categoryID:2,
                retVariantDecision : [{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Health1', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 20,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Health2', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Health3', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            }] //length : TCategories(1~2)
        }] 
    });
    newDoc.save(function(err){
        if (err) next(new Error(err));
        console.log('retailer insert successfully');
        res.end('insert successfully');
    });
}

exports.updateRetailerDecision = function(io){
    return function(req, res, next){
        var queryCondition = {
            seminar : req.body.seminar,
            period : req.body.period,
            retailerID : req.body.retailerID,
            behaviour : req.body.behaviour,
            brandName : req.body.brandName,
            varName : req.body.varName,
            categoryID : req.body.categoryID,
            marketID : req.body.marketID,
            location : req.body.location,
            additionalIdx : req.body.additionalIdx,
            value : req.body.value
        }
        retDecision.findOne({seminar:queryCondition.seminar,
                            period:queryCondition.period,
                            retailerID:queryCondition.retailerID},function(err,doc){
                            if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404, {error:'Cannot find matched doc...'});
                                } else {
                                    var isUpdated=true;
                                    var decision="retMarketDecision";
                                    switch(queryCondition.behaviour){
                                        case 'updateGeneralDecision':
                                                doc[queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;
                                                decision="";
                                        break;
                                        case 'updateMarketDecision':
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){
                                                    if(queryCondition.location=="categorySurfaceShare"||queryCondition.location=="localAdvertising"){
                                                        doc.retMarketDecision[i][queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;
                                                    }else{
                                                        doc.retMarketDecision[i][queryCondition.location]=queryCondition.value;
                                                    }
                                                    break;
                                                }
                                            };
                                            //doc.retMarketDecision[1]['categorySurfaceShare'][2]=1000;
                                            decision="retMarketDecision";
                                        break;
                                        case 'updatePrivateLabel':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            for(var k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==queryCondition.varName){
                                                                    if(queryCondition.location=="packFormat"){
                                                                        if(queryCondition.value==1){
                                                                            queryCondition.value="ECONOMY";
                                                                        }
                                                                        if(queryCondition.value==2){
                                                                            queryCondition.value="STANDARD";
                                                                        }
                                                                        if(queryCondition.value==3){
                                                                            queryCondition.value="PREMIUM";
                                                                        }
                                                                    }
                                                                    if(queryCondition.location=="composition"){
                                                                        doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k][queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;
                                                                    }
                                                                    else{
                                                                        doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k][queryCondition.location]=queryCondition.value;
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            };
                                            decision="retCatDecision";
                                        break;
                                        case 'addProductNewBrand':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    doc.retCatDecision[i].privateLabelDecision.push(queryCondition.value);
                                                    break;
                                                }
                                            }
                                            decision="retCatDecision";                    
                                        break;
                                        case 'addProductExistedBrand':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.push(queryCondition.value);
                                                        }
                                                    }
                                                }
                                            }
                                            decision="retCatDecision";
                                        break;
                                        case 'deleteProduct':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            //delete doc.retCatDecision[i].privateLabelDecision[j]
                                                            for(k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==queryCondition.varName){
                                                                    delete doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k];
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            var count=0;
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            //delete doc.retCatDecision[i].privateLabelDecision[j]
                                                            for(k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=undefined){
                                                                    count++;
                                                                    //delete doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k];
                                                                }
                                                            }
                                                            if(count==0){
                                                                delete doc.retCatDecision[i].privateLabelDecision[j];
                                                            }   
                                                        }
                                                    }
                                                }
                                            }
                                            decision="retCatDecision";
                                        break;
                                        case 'updateOrder':
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){
                                                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                                                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==queryCondition.categoryID){
                                                            for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                                                if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k]!=undefined&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==queryCondition.brandName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==queryCondition.varName){
                                                                    if(queryCondition.location=="pricePromotions"){
                                                                        doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k][queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;
                                                                    }
                                                                    else{
                                                                        doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k][queryCondition.location]=queryCondition.value;                                                                        
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                            decision="retMarketDecision";
                                        break;
                                        case 'addOrder':
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){
                                                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                                                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==queryCondition.value.categoryID){
                                                            doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.push(queryCondition.value);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                            decision="retMarketDecision";
                                        break;
                                        case 'deleteOrder':
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){           
                                                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                                                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==queryCondition.categoryID){
                                                            console.log(doc.retMarketDecision[i].retMarketAssortmentDecision[j]);
                                                            for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                                                console.log(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k]);
                                                                if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k]!=undefined&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==queryCondition.brandName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==queryCondition.varName){
                                                                    doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.splice(k,1);
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                            decision="retMarketDecision";
                                        break;
                                    }
                                    if(isUpdated){
                                        //console.log(doc);
                                        doc.markModified(decision);
                                        doc.save(function(err, doc, numberAffected){
                                            if(err) next(new Error(err));
                                            console.log('save updated hhq, number affected:'+numberAffected);
                                            io.sockets.emit('retailerBaseChanged', 'this is a baseChanged');
                                            res.send(200, 'mission complete!');
                                        });                                   
                                    }    

                                }
                        }); 
    }
}

exports.getRetailerProductList=function(req,res,next){
    retDecision.findOne({seminar:req.params.seminar,
                        period:req.params.period,
                        retailerID:req.params.retailerID},function(err,doc){
                            if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404, {error:'Cannot find matched doc...'});
                                } else {
                                    var allRetCatDecisions=_.filter(doc.retCatDecision,function(obj){
                                        return (obj.categoryID==req.params.categoryID);
                                    });
                                    var products=new Array();
                                    var count=0;
                                    for(var i=0;i<allRetCatDecisions.length;i++){
                                        for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
                                            if(allRetCatDecisions[i].privateLabelDecision[j]!=undefined){
                                                for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                    if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined){
                                                        products.push({'categoryID':req.params.categoryID,
                                                            'brandName':allRetCatDecisions[i].privateLabelDecision[j].brandName,
                                                            'varName':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName,
                                                            'brandID':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].parentBrandID,
                                                            'varID':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID,
                                                            'parentName':req.params.seminar+'_R_'+req.params.retailerID});
                                                        count++;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(count!=0){
                                        res.header("Content-Type", "application/json; charset=UTF-8");                                
                                        res.statusCode = 200;
                                        res.send(products);    
                                    }
                                }
                        });
}

exports.getAllRetailerDecision = function(req, res, next){
    /*R_1*/
    retDecision.findOne({seminar:req.params.seminar,
                        period:req.params.period,
                        retailerID:req.params.retailerID},function(err,doc){
                            if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404, {error:'Cannot find matched doc...'});
                                } else {
                                    //console.log(doc);
                                    res.header("Content-Type", "application/json; charset=UTF-8");                                
                                    res.statusCode = 200;
                                    res.send(doc);    
                                }
                        }); 
}
