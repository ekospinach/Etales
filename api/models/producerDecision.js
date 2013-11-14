var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore');
    request = require('request');
    q = require('q');

var proVarDecisionSchema = mongoose.Schema({
    varName : String,
    varID : Number, //varID = BrandID * 10 + varCount
    parentBrandID : Number, //brandID
    packFormat : String, //ECONOMY, STANDARD, PREMIUM
    dateOfBirth : Number,
    dateOfDeath : Number,
    composition : [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    production : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    discontinue : Boolean,
    nextPriceBM : Number,
    nextPriceEmall : Number
})

var proBrandDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,   
    /*
        case 'P': brandID = (10 * userCount) + brandCount
        case 'R': brandID = (10 * (userCount +4)) + brandCount
        userCount = 1~4
        brandCount = 1~5
    */
    paranetCompanyID : Number, //TBrandOwners(Prod_1_ID~Ret_2_ID)
    /*
        Prod_1_ID          = 1;
        Prod_2_ID          = 2;
        Prod_3_ID          = 3;
        Prod_4_ID          = 4;
        Ret_1_ID           = 5;
        Ret_2_ID           = 6;
        TradTrade_ID       = 7;
        E_Mall_ID          = 8;
        Admin_ID           = 9;x
    */
    dateOfBirth : Number, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
    dateOfDeath : Number, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
    advertisingOffLine : [Number], //TMarketDetails, 1-Urban, 2-Rural
    advertisingOnLine : Number,
    supportEmall : Number,
    supportTraditionalTrade : [Number], //TMarketDetails, 1-Urban, 2-Rural
    proVarDecision : [proVarDecisionSchema] //Length: TOneBrandVars(1~3)
})

var proCatDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    capacityChange : Number,
    investInDesign : Number,/*E*/
    investInProductionFlexibility : Number,
    investInTechnology : Number,
    proBrandsDecision : [proBrandDecisionSchema] //Length: TProBrands(1~5) 
})

var proDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    producerID : Number, //1~4
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    proCatDecision : [proCatDecisionSchema] //Length: TCategories(1~2)
})

var proDecision = mongoose.model('proDecision', proDecisionSchema);

exports.exportToBinary = function(options){
    var deferred = q.defer();
    var period = options.period;
    proDecision.findOne({seminar : options.seminar,
                           period : options.period,
                           producerID : options.producerID},
                           function(err, doc){
                                if(err) deferred.reject({msg:err, options: options}); 
                                if(!doc) {
                                    deferred.reject({msg: 'Export to binary, cannot find matched doc. ' + 'producerID:' + options.producerID + '/seminar:' + options.seminar + '/period:' + options.period});
                                } else {        
                                    request.post('http://' + options.cgiHost + ':' + options.cgiPort + options.cgiPath, {form: {jsonData: JSON.stringify(doc)}}, function(error, response){
                                        console.log('status:' + response.status);
                                        console.log('body:' + response.body);
                                        if (response.status === (500 || 404)) {
                                            deferred.reject({msg: 'Failed to export binary, get 500 from CGI server(POST action):' + JSON.stringify(options)});
                                        } else {
                                            deferred.resolve({msg: 'Export binary done, producer:' + options.producerID +', period' + options.period});
                                        }
                                    });
                                }
                           });
    return deferred.promise;
}

exports.addProducerDecisions = function(options, socket){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&producerID=' + options.producerID
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
         //          console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var singleDecision = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleDecision) return; 
          proDecision.update({seminar: singleDecision.seminar, 
                              period: singleDecision.period,
                              producerID: singleDecision.producerID},
                              {nextBudgetExtension: singleDecision.nextBudgetExtension,
                               approvedBudgetExtension: singleDecision.approvedBudgetExtension,
                               proCatDecision: singleDecision.proCatDecision},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg:'producerDecision(producer:'+ options.producerID + ', seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom addProducerDecisions:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options}); 
      });
    })(endWith);

    return deferred.promise;
}

exports.updateProducerDecision = function(io){
  return function(req, res, next){
      var queryCondition = {
        seminar : req.body.seminar,
        period : req.body.period,
        producerID : req.body.producerID,
        behaviour : req.body.behaviour, 
        /* 
        - step 1&2
        addProductNewBrand : categoryID
        deleteProduct : categoryID,brandName,varName
        deleteBrand : categoryID,brandName
        updateVariant : categoryID,brandName,varName,location,value[,additionalIdx]
        addProdcutExistedBrand : categoryID,brandName
        
        - step 3
        updateBrand : categoryID,brandName,varName,location,value[,additionalIdx]

        - step 4
        updateCategory : category,location,value
        */
        categoryID : req.body.categoryID,
        brandName : req.body.brandName,
        varName : req.body.varName,
        location : req.body.location,
        additionalIdx  : req.body.additionalIdx,
        value : req.body.value
      }

      //console.log(queryCondition);

      proDecision.findOne({seminar : queryCondition.seminar,
                           period : queryCondition.period,
                           producerID : queryCondition.producerID},
                           function(err, doc){
                                if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404,'Cannot find matched producer decision doc...');
                                } else {
                                    var isUpdated = true;
                                    //console.log('before:');
                                    //console.log(doc.proCatDecision[0].proBrandsDecision[0]);

                                    switch(queryCondition.behaviour){
                                        case 'addProductNewBrand':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    doc.proCatDecision[i].proBrandsDecision.push(queryCondition.value);
                                                }
                                            };
                                            break;
                                        case 'addProductExistedBrand':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                //console.log(doc.proCatDecision[i].categoryID+" bitch "+queryCondition.categoryID);                                      
                                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                                        //console.log(doc.proCatDecision[i].proBrandsDecision[j].brandID+" bitch "+queryCondition.brandID);                                      
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.push(queryCondition.value);
                                                            break;
                                                        }
                                                    }      
                                                    break;                              
                                                }
                                            };
                                            break;
                                        case 'deleteProduct':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                                if(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName == queryCondition.varName){
                                                                    delete doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]; //set undefined 
                                                                }
                                                            };
                                                        }
                                                    };
                                                }
                                            };
                                            var count=0;
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                                if(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName != undefined){
                                                                    count++;
                                                                    //delete doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]; //set undefined 
                                                                }
                                                            }
                                                            if(count==0){
                                                                delete doc.proCatDecision[i].proBrandsDecision[j];
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            break;
                                        case 'deleteBrand':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            delete doc.proCatDecision[i].proBrandsDecision[j]; //set undefined 
                                                        }
                                                    };
                                                }
                                            };
                                            break;
                                        case 'updateVariant':
                                            console.log('update Variant');
                                            for(var i = 0; i < doc.proCatDecision.length; i++){
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    for(var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++){
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            for(var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++){
                                                                if(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName == queryCondition.varName){
                                                                    if(queryCondition.location == "packFormat"){
                                                                        switch(queryCondition.value){
                                                                            case 1: queryCondition.value = "ECONOMY";break;
                                                                            case 2: queryCondition.value = "STANDARD";break;
                                                                            case 3: queryCondition.value = "PREMIUM";break;
                                                                        }
                                                                    }
                                                                    if(queryCondition.location=="composition"){ doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][queryCondition.location][queryCondition.additionalIdx] = queryCondition.value;}
                                                                    else{ 
                                                                        doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][queryCondition.location] = queryCondition.value;
                                                                        
                                                                    }                                                            
                                                                }
                                                            }                                                    
                                                        }
                                                    }
                                                }
                                            }    
                                            break;
                                        case 'updateBrand':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                                        if(doc.proCatDecision[i].proBrandsDecision[j]!=undefined&&doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName){
                                                            console.log(doc.proCatDecision[i].proBrandsDecision[j].brandName);
                                                            if(queryCondition.location == "supportTraditionalTrade" || queryCondition.location == "advertisingOffLine"){
                                                                doc.proCatDecision[i].proBrandsDecision[j][queryCondition.location][queryCondition.additionalIdx] = queryCondition.value;
                                                                //console.log(i + '/' + j + '/' + queryCondition.location + '/' + queryCondition.additionalIdx);

                                                            } else {
                                                                doc.proCatDecision[i].proBrandsDecision[j][queryCondition.location] = queryCondition.value;
                                                            }
                                                        }
                                                    };
                                                }
                                            };
                                            break;
                                        case 'updateCategory':
                                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                                if(doc.proCatDecision[i].categoryID == queryCondition.categoryID){
                                                    doc.proCatDecision[i][queryCondition.location] = queryCondition.value;
                                                }
                                            };
                                            break;
                                        default:
                                            isUpdated = false;
                                            res.send(404, 'cannot find matched query behaviour:' + queryCondition.behaviour);                                    
                                    }

                                    if(isUpdated){
                                        doc.markModified('proCatDecision'); 
                                        doc.save(function(err, doc, numberAffected){
                                            if(err) next(new Error(err));
                                            console.log('save updated, number affected:'+numberAffected);
                                            io.sockets.emit('producerBaseChanged', 'this is a baseChanged');
                                            res.send(200, 'mission complete!');
                                        });                                   

                                    }     
                                }

                            });
  }
}


exports.getAllProducerDecision = function(req, res, next){    
    /*P_1*/
    proDecision.findOne({seminar:req.params.seminar,
                        period:req.params.period,
                        producerID:req.params.producerID},function(err,doc){
                            if(err) {next(new Error(err));}
                            if(!doc) {
                                res.send(404, 'Cannot find matched producer decision doc.');
                            } else {
                                res.header("Content-Type", "application/json; charset=UTF-8");                                
                                res.statusCode = 200;
                                res.send(doc);
                            }
                        }); 
}

exports.getProducerProductList=function(req,res,next){
    proDecision.findOne({seminar:req.params.seminar,
                        period:req.params.period,
                        producerID:req.params.producerID},function(err,doc){
                            if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404, {error:'Cannot find matched doc...'});
                                } else {
                                    var allProCatDecisions=_.filter(doc.proCatDecision,function(obj){
                                        return (obj.categoryID==req.params.categoryID);
                                    });
                                    var products=new Array();
                                    var count=0;
                                    for(var i=0;i<allProCatDecisions.length;i++){
                                        for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
                                            if(allProCatDecisions[i].proBrandsDecision[j]!=undefined){
                                                for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
                                                    if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]!=undefined){
                                                        products.push({'categoryID':req.params.categoryID,
                                                            'brandName':allProCatDecisions[i].proBrandsDecision[j].brandName,
                                                            'varName':allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName,
                                                            'brandID':allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].parentBrandID,
                                                            'varID':allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID,
                                                            'parentName':req.params.seminar+'_P_'+req.params.producerID});
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

exports.getProducerBrandList=function(req,res,next){
    proDecision.findOne({seminar:req.params.seminar,
                        period:req.params.period,
                        producerID:req.params.producerID},function(err,doc){
                            if(err) {next(new Error(err));}
                                if(!doc) {
                                    console.log('cannot find matched doc...');
                                    res.send(404, {error:'Cannot find matched doc...'});
                                } else {
                                    var allProCatDecisions=_.filter(doc.proCatDecision,function(obj){
                                        return (obj.categoryID==req.params.categoryID);
                                    });
                                    var brands=new Array();
                                    var count=0;
                                    for(var i=0;i<doc.proCatDecision.length;i++){
                                        if(doc.proCatDecision[i].proBrandsDecision.length!=0){
                                            for(var j=0;j<doc.proCatDecision[i].proBrandsDecision.length;j++){
                                                if(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length!=0){
                                                    brands.push({'category':doc.proCatDecision[i].categoryID,
                                                            'brandName':doc.proCatDecision[i].proBrandsDecision[j].brandName,
                                                            'brandID':doc.proCatDecision[i].proBrandsDecision[j].brandID});
                                                    count++;
                                                }
                                            }
                                        }
                                    }
                                    if(count!=0){
                                        res.header("Content-Type", "application/json; charset=UTF-8");                                
                                        res.statusCode = 200;
                                        res.send(brands);   
                                    } 
                                }
                            }); 
}

exports.newDoc = function(req, res, next){
    var newDoc1 = new proDecision({
        seminar:'MAY',
        period:0,
        producerID:1,
        nextBudgetExtension:1,
        approvedBudgetExtension:1,
        proCatDecision:[{
            categoryID:1,
            capacityChange:2,
            investInDesign:6.13,
            investInProductionFlexibility:11.57,
            investInTechnology:3.16,
            proBrandsDecision:[{
                brandName:'EGEND1',
                brandID:11,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'STANDARD', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'EHAYA1',
                brandID:12,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'ELAND1',
                brandID:13,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'PREMIUM', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        },{
            categoryID:2,
            capacityChange:2,
            investInDesign:undefined,
            investInProductionFlexibility:21.21,
            investInTechnology:21.21,
            proBrandsDecision:[{
                brandName:'HEELY1',
                brandID:11,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOTOO1',
                brandID:12,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOLAY1',
                brandID:13,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        }]
    });
    var newDoc2=new proDecision({
        seminar:'MAY',
        period:0,
        producerID:2,
        nextBudgetExtension:1,
        approvedBudgetExtension:1,
        proCatDecision:[{
            categoryID:1,
            capacityChange:2,
            investInDesign:6.13,
            investInProductionFlexibility:11.57,
            investInTechnology:3.16,
            proBrandsDecision:[{
                brandName:'EGEND2',
                brandID:11,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'STANDARD', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'EHAYA2',
                brandID:12,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'ELAND2',
                brandID:13,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'PREMIUM', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        },{
            categoryID:2,
            capacityChange:2,
            investInDesign:undefined,
            investInProductionFlexibility:21.21,
            investInTechnology:21.21,
            proBrandsDecision:[{
                brandName:'HEELY2',
                brandID:11,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOTOO2',
                brandID:12,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOLAY2',
                brandID:13,
                paranetCompanyID:2,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        }]
    });
    var newDoc3=new proDecision({
        seminar:'MAY',
        period:0,
        producerID:3,
        nextBudgetExtension:1,
        approvedBudgetExtension:1,
        proCatDecision:[{
            categoryID:1,
            capacityChange:2,
            investInDesign:6.13,
            investInProductionFlexibility:11.57,
            investInTechnology:3.16,
            proBrandsDecision:[{
                brandName:'EGEND3',
                brandID:11,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'STANDARD', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'EHAYA3',
                brandID:12,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'ELAND3',
                brandID:13,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'PREMIUM', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        },{
            categoryID:2,
            capacityChange:2,
            investInDesign:undefined,
            investInProductionFlexibility:21.21,
            investInTechnology:21.21,
            proBrandsDecision:[{
                brandName:'HEELY3',
                brandID:11,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOTOO3',
                brandID:12,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOLAY3',
                brandID:13,
                paranetCompanyID:3,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        }]
    });
    newDoc1.save(function(err){
        if (err) next(new Error(err));
        console.log('producer1 insert successfully');
        //res.end('insert successfully');
    });
    newDoc2.save(function(err){
        if (err) next(new Error(err));
        console.log('producer2 insert successfully');
        //res.end('insert successfully');
    });
    newDoc3.save(function(err){
        if (err) next(new Error(err));
        console.log('producer3 insert successfully');
        res.end('insert successfully');
    });
}