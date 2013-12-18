var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    q = require('q');

var privateLabelVarDecisionSchema = mongoose.Schema({
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
    privateLabelVarDecision : [privateLabelVarDecisionSchema] //length: TOneBrandVars(1~3)
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
    localAdvertising : [Number], //0-Price, 1-Convenience, 2-assortment
    serviceLevel : String, //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
    retMarketAssortmentDecision : [retQuarterAssortmentDecisionSchema] //length : TCategories(1~2)
})

var retDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    retailerID : Number, //TAllRetailers (1~4)
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    onlineAdvertising : [Number], //0-Price, 1-Convenience, 2-assortment
    tradtionalAdvertising : [Number], //0-Price, 1-Convenience, 2-assortment
    retCatDecision : [retCatDecisionSchema], //length: TCategories(1~2)
    retMarketDecision: [retMarketDecisionSchema] //length: TMarkets(1~2)
})

exports.retDecision = mongoose.model('retailerDecision', retDecisionSchema);
var retDecision = mongoose.model('retailerDecision', retDecisionSchema);
var privateLabelVarDecision = mongoose.model('privateLabelVarDecision',privateLabelVarDecisionSchema);
var privateLabelDecision= mongoose.model('privateLabelDecision',privateLabelDecisionSchema);

exports.exportToBinary = function(options){
    var deferred = q.defer();
    var period = options.period;
    retDecision.findOne({seminar : options.seminar,
                           period : options.period,
                           retailerID : options.retailerID},
                           function(err, doc){
                                if(err) deferred.reject({msg:err, options: options}); 
                                if(!doc) {
                                    deferred.reject({msg: 'Export to binary, cannot find matched doc. ' + 'retailerID:' + options.retailerID + '/seminar:' + options.seminar + '/period:' + options.period});
                                } else {        
                                    request.post('http://' + options.cgiHost + ':' + options.cgiPort + options.cgiPath, {form: {jsonData: JSON.stringify(doc)}}, function(error, response){
                                        console.log('status:' + response.status);
                                        console.log('body:' + response.body);
                                        if (response.status === (500 || 404)) {
                                            deferred.reject({msg: 'Failed to export binary, get 500 from CGI server(POST action):' + JSON.stringify(options)});
                                        } else {
                                            deferred.resolve({msg: 'Export binary done, retailer:' + options.retailerID +', period' + options.period});
                                        }
                                    });
                                }
                           });
    return deferred.promise;
}

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
         // console.log(singleDecision);
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
                                  if(err) deferred.reject({msg:err, options: options});
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

//check
exports.getRetailerShelfSpace=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,{err:'cannot find the doc'});
        }else{
            var result=new Array(),exclude=0;
            for(var i=0;i<doc.retMarketDecision.length;i++){
                result[i]=new Array(0,0);
                for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                    for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandID!=0&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].variantID!=0&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName!=""&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName!=""){
                            result[i][j]+=doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].shelfSpace;
                        }
                    }
                }
            }
            if(req.params.marketID!=-1){
                for(var i=0;i<doc.retMarketDecision.length;i++){
                    if(doc.retMarketDecision[i].marketID==req.params.marketID){
                        for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                            if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==req.params.categoryID){
                                for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                    if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==req.params.varName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==req.params.brandName){
                                        exclude=result[i][j]-doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].shelfSpace;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            res.send(200,{result:result,exclude:exclude});
        }
    });
}

exports.getRetailerCurrentDecision=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,{err:'cannot find the doc'});
        }else{
            var categoryID=0,result=0;
            if(req.params.brandName.substring(0,1)=="E"){
                categoryID=1;
            }else{
                categoryID=2;
            }
            var allRetCatDecisions=_.filter(doc.retCatDecision,function(obj){
                return (obj.categoryID==categoryID);
            });
            for(var i=0;i<allRetCatDecisions.length;i++){
                for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
                    if(allRetCatDecisions[i].privateLabelDecision[j].brandID!=0&&allRetCatDecisions[i].privateLabelDecision[j].brandName==req.params.brandName){
                        for(k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                            if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==req.params.varName){
                                result=1;
                                res.send(200,allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]);
                                break;
                            }else{
                                result=0;
                            }
                        }
                        break;
                    }
                }
            }
            if(result==0){
                res.send(404,'cannot find the variant');
            }
        }
    })
}

exports.checkRetailerProduct=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,{err:'cannot find the doc'});
        }else{
            var allRetCatDecisions=_.filter(doc.retCatDecision,function(obj){
                return (obj.categoryID==req.params.categoryID);
            });
            var count=0,result=0;
            if(req.params.checkType=="brand"){
                for(var i=0;i<allRetCatDecisions.length;i++){
                    for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
                        if(allRetCatDecisions[i].privateLabelDecision[j].brandName!=""&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=0){
                            count++;
                            if(allRetCatDecisions[i].privateLabelDecision[j].brandName==req.params.brandName){
                                result++;
                            }
                        }
                    }
                    //if(allRetCatDecisions[i].privateLabelDecision)
                }
                if(count>=4){
                    res.send(404,{message:'more than 4'});
                }else if(result!=0){
                    res.send(404,{message:'another brand'});
                }else{
                    res.send(200,{message:'OK'});
                }
            }else{
                for(var i=0;i<allRetCatDecisions.length;i++){
                    for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
                        if(allRetCatDecisions[i].privateLabelDecision[j].brandID!=0&&allRetCatDecisions[i].privateLabelDecision[j].brandName==req.params.brandName){
                            for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=""){
                                    count++;
                                    if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==req.params.varName){
                                        result++;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                if(count>=3){
                    res.send(404,{message:'more than 3'});
                }else if(result!=0){
                    res.send(404,{message:'another variant'});
                }else{
                    res.send(200,{message:'OK'});
                }
            }
        }
    })
}

exports.getRetailerExpend=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,{err:'cannot find the doc'});
        }else{
            var result=0;
            result+=(doc.onlineAdvertising[0]+doc.onlineAdvertising[1]+doc.onlineAdvertising[2]+doc.tradtionalAdvertising[0]+doc.tradtionalAdvertising[1]+doc.tradtionalAdvertising[2]);
            result+=(doc.retMarketDecision[0].localAdvertising[0]+doc.retMarketDecision[0].localAdvertising[1]+doc.retMarketDecision[0].localAdvertising[2]+doc.retMarketDecision[1].localAdvertising[0]+doc.retMarketDecision[1].localAdvertising[1]+doc.retMarketDecision[1].localAdvertising[2]);
            if(req.params.marketID!=-1){
                if(req.params.marketID==0){
                    result-=(doc[req.params.location][req.params.additionalIdx]);
                }else{
                    result-=(doc.retMarketDecision[req.params.marketID-1][req.params.location][req.params.additionalIdx]);
                }
            }
            res.send(200,{result:result});
        }
    })
}

exports.checkOrder=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(!doc){
            res.send(404,{err:'cannot find the doc'});
        }else{
            var count=0,result=0;
            for(var i=0;i<doc.retMarketDecision.length;i++){
                if(doc.retMarketDecision[i].marketID==req.params.marketID){
                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==req.params.categoryID){
                            for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.varName!=""&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName!=""){
                                    count++;
                                    if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==req.params.varName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==req.params.brandName){
                                        result++;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            if(count>21){
                res.send(404,{err:'here is already 21 orders '});
            }else if(result!=0){
                res.send(200,{err:'here is already a order about brandName:'+req.params.brandName+' and varName:'+req.params.varName});
            }else{
                res.send(200,{message:'OK'});
            }
        }
    })
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
                                                //console.log(doc[queryCondition.location][queryCondition.additionalIdx]);
                                        break;
                                        case 'updateMarketDecision':
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){
                                                    if(queryCondition.location=="localAdvertising"){
                                                        doc.retMarketDecision[i][queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;
                                                    }else if(queryCondition.location=="categorySurfaceShare"){
                                                        doc.retMarketDecision[i][queryCondition.location][queryCondition.additionalIdx]=queryCondition.value;//.toFixed(4);
                                                        doc.retMarketDecision[i][queryCondition.location][1-queryCondition.additionalIdx]=(1-queryCondition.value);
                                                    }else{
                                                        doc.retMarketDecision[i][queryCondition.location]=queryCondition.value;
                                                    }
                                                    break;
                                                }
                                            };
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
                                        break;
                                        case 'addProductNewBrand':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        //if varName is null ,var is null
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandID==0&&doc.retCatDecision[i].privateLabelDecision[j].brandName==""){
                                                            doc.retCatDecision[i].privateLabelDecision.splice(j,1,queryCondition.value);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }                  
                                        break;
                                        case 'addProductExistedBrand':
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            for(var k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varID==0&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==""){
                                                                    //console.log("find");
                                                                    doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.splice(k,1,queryCondition.value);
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                            //doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.push(queryCondition.value);
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        break;
                                        case 'deleteProduct':
                                            var nullVarDecision=new privateLabelVarDecision();
                                            nullVarDecision.varName="";
                                            nullVarDecision.varID=0;
                                            nullVarDecision.parentBrandID=0;
                                            nullVarDecision.dateOfDeath=0;
                                            nullVarDecision.dateOfBirth=0;
                                            nullVarDecision.packFormat="";
                                            nullVarDecision.composition=[0,0,0];
                                            nullVarDecision.discontinue=false;
                                            var nullBrandDecision=new privateLabelDecision();
                                            nullBrandDecision.brandName="";
                                            nullBrandDecision.brandID=0;
                                            nullBrandDecision.parentCompanyID=0;
                                            nullBrandDecision.dateOfBirth=0;
                                            nullBrandDecision.dateOfDeath=0;
                                            nullBrandDecision.privateLabelVarDecision.push(nullVarDecision,nullVarDecision,nullVarDecision);
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            for(k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==queryCondition.varName){
                                                                    doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.splice(k,1,nullVarDecision);
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                            var count=0;
                                            for(var i=0;i<doc.retCatDecision.length;i++){
                                                if(doc.retCatDecision[i].categoryID==queryCondition.categoryID){
                                                    for(var j=0;j<doc.retCatDecision[i].privateLabelDecision.length;j++){
                                                        if(doc.retCatDecision[i].privateLabelDecision[j]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].brandName==queryCondition.brandName){
                                                            for(k=0;k<doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                                                                if(doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=""&&doc.retCatDecision[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0){
                                                                    count++;
                                                                }
                                                            }
                                                            if(count==0){
                                                                doc.retCatDecision[i].privateLabelDecision.splice(j,1,nullBrandDecision);
                                                                console.log("double delete!!!!!");
                                                                break;
                                                            }   
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
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
                                        break;
                                        case 'addOrder':
                                            var count=0,result=0;
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){
                                                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                                                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==queryCondition.value.categoryID){
                                                            for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                                                if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName!=""&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName!=""){
                                                                    count++;
                                                                    if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==queryCondition.value.varName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==queryCondition.value.brandName){
                                                                        result++;
                                                                    }
                                                                }
                                                            }
                                                            console.log('count:'+count+',result:'+result);
                                                            if(count<=20&&result==0){
                                                                for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                                                    if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==""&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==""){
                                                                        doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.splice(k,1,queryCondition.value);
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        break;
                                        case 'deleteOrder':
                                            var nullOrder={
                                                brandName:"",
                                                brandID:0,
                                                varName:"",
                                                variantID:0,
                                                dateOfDeath:0,
                                                dateOfBirth:0,
                                                order:0,
                                                retailerPrice:0,
                                                shelfSpace:0,
                                                pricePromotions:{
                                                    'promo_Frequency':0,
                                                    'promo_Rate':0
                                                }
                                            };
                                            for(var i=0;i<doc.retMarketDecision.length;i++){
                                                if(doc.retMarketDecision[i].marketID==queryCondition.marketID){           
                                                    for(var j=0;j<doc.retMarketDecision[i].retMarketAssortmentDecision.length;j++){
                                                        if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].categoryID==queryCondition.categoryID){
                                                            console.log(doc.retMarketDecision[i].retMarketAssortmentDecision[j]);
                                                            for(var k=0;k<doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.length;k++){
                                                                console.log(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k]);
                                                                if(doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k]!=undefined&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].brandName==queryCondition.brandName&&doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision[k].varName==queryCondition.varName){
                                                                    doc.retMarketDecision[i].retMarketAssortmentDecision[j].retVariantDecision.splice(k,1,nullOrder);
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        break;
                                    }
                                    if(isUpdated){
                                        doc.markModified('tradtionalAdvertising');
                                        doc.markModified('onlineAdvertising');
                                        doc.markModified('categorySurfaceShare');
                                        doc.markModified('localAdvertising');
                                        doc.markModified('retMarketDecision');
                                        doc.markModified('retCatDecision');
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
                                                            'parentName':'Retailer '+req.params.retailerID,
                                                            'dateOfBirth':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].dateOfBirth,
                                                            'dateOfDeath':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].dateOfDeath,
                                                        });
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

exports.deleteOrderData=function(io){
    return function(req,res,next){
        var queryCondition={
            seminar:req.body.seminar,
            period:req.body.period,
            brandName:req.body.brandName,
            varName:req.body.varName,
            categoryID:req.body.categoryID
        }
        console.log(queryCondition);
        retDecision.find({
            seminar:queryCondition.seminar,
            period:queryCondition.period
        },function(err,docs){
            if(err){
                next(new Error)
            }
            if(docs.length!=0){
                var nullOrder={
                    brandName:"",
                    brandID:0,
                    varName:"",
                    variantID:0,
                    dateOfDeath:0,
                    dateOfBirth:0,
                    order:0,
                    retailerPrice:0,
                    shelfSpace:0,
                    pricePromotions:{
                        'promo_Frequency':0,
                        'promo_Rate':0
                    }
                };
                for(var i=0;i<docs.length;i++){
                    for(var j=0;j<docs[i].retMarketDecision.length;j++){
                        for(k=0;k<docs[i].retMarketDecision[j].retMarketAssortmentDecision.length;k++){
                            if(docs[i].retMarketDecision[j].retMarketAssortmentDecision[k].categoryID==queryCondition.categoryID){
                                for(var l=0;l<docs[i].retMarketDecision[j].retMarketAssortmentDecision[k].retVariantDecision.length;l++){
                                    if(docs[i].retMarketDecision[j].retMarketAssortmentDecision[k].retVariantDecision[l].varName==queryCondition.varName&&docs[i].retMarketDecision[j].retMarketAssortmentDecision[k].retVariantDecision[l].brandName==queryCondition.brandName){
                                        console.log(i+''+j+''+k+''+l);
                                        docs[i].retMarketDecision[j].retMarketAssortmentDecision[k].retVariantDecision.splice(l,1,nullOrder);
                                        //docs[i].save();
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    docs[i].save();
                }
                res.send(200,'mission complete');
            }
            res.send(200,'no order');
        })
    }
}

//retailer get retailer decision

exports.retailerGetRetailerDecision=function(req,res,next){
    retDecision.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            console.log('cannot find the doc');
        }else{
            var categoryID=0;
            var result=new Array();
            if(req.params.brandName.substring(0,1)=="E"){
                categoryID=1;
            }else{
                categoryID=2;
            }
            var allRetCatDecisions=_.filter(doc.retCatDecision,function(obj){
                    return (obj.categoryID==categoryID);
                });
            for(var i=0;i<allRetCatDecisions.length;i++){
                for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
                    if(allRetCatDecisions[i].privateLabelDecision[j]!=undefined){
                        for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
                            if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName==req.params.varName&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0){
                                result.push({'composition':allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].composition
                                });
                                break;
                            }
                        }
                        break;
                    } 
                } 
            }
            res.header("Content-Type", "application/json; charset=UTF-8");                                
            res.statusCode = 200;
            res.send(result);  
        }
    })
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
