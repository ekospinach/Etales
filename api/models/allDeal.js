var mongoose  = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore');
	uniqueValidator = require('mongoose-unique-validator');

var allDealSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    producerDeal : [producerDealSchema] //length: TAllProducers(1~4)
})

var producerDealSchema = mongoose.Schema({
    producerID : Number,
    retailerDeal : [retailerDealSchema]//length: TBMRetailer(1~3)
})

var retailerDealSchema = mongoose.Schema({
    retailerID : Number,
    categoryDeal : [categoryDealSchema] //length: TCategories(1~3)
})

var categoryDealSchema = mongoose.Schema({
    categoryID : Number,
    consignementVolume     : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    inStoreActivitiesFee   : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    minimumOrder           : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    otherCompensation      : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    paymentDays            : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    performanceBonusAmount : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    performanceBonusRate   : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    promotionalSupport     : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    salesTargetVolume      : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)

    },
    volumeDiscountRate     : {
        marketsDetails : [Number], //Length: TMarketTotal(1~3)
        useBrandsDetails : Boolean,
        useMarketsDetails : Boolean,
        brandsDetails : [brandDetailsSchema], //Length: TProBrands(1~5)
    }
})

var brandDetailsSchema = mongoose.Schema({
    brandID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    marketsDetails : [Number],//Length: TMarketTotal(1~3)
    useVariantsDetails : Boolean,
    useMarketsDetails : Boolean,
    variantsDetails : [variantsDetailsSchema] //length: TOneBrandVars(1~3)
})

var variantsDetailsSchema = mongoose.Schema({
    varID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    useMarketsDetails : Boolean,
    marketsDetails : [Number]//Length: TMarketTotal(1~3)
})

var allDeal = mongoose.model('allDeal', allDealSchema);
var producerDeal = mongoose.model('producerDeal', producerDealSchema);
var retailerDeal = mongoose.model('retailerDeal', retailerDealSchema);
var categoryDeal = mongoose.model('categoryDeal', categoryDealSchema);
var brandDetails = mongoose.model('brandDetails', brandDetailsSchema);
var variantDetails = mongoose.model('variantDetails', variantsDetailsSchema);

exports.exportToBinary = function(options){
    var deferred = q.defer();
    var period = options.period;

    // console.log('start remove alldeal...');
    // removeAllDeal(options.seminar, options.period).then(function(result){      

    //   console.log('here is outside...');
    //   return ;

    fillAllDeal(options.seminar, options.period).then(function(result){
      allDeal.findOne({seminar: options.seminar, period : options.period},function(err, doc){
        if(err) deferred.reject({msg:err});
        if(!doc){
          deferred.reject({msg: 'Export to binary, cannot find matched negotiation doc. seminar:' + options.seminar + '/period:' + options.period});          
        }else{
          //console.log('start send post to cgi:' + options.cgiPath);
          //console.log('export deal:' + JSON.stringify(doc));
          //console.log(JSON.stringify(doc));
          request.post('http://' + options.cgiHost + ':' + options.cgiPort + options.cgiPath, {form: {jsonData: JSON.stringify(doc)}}, function(error, response){
              console.log('statusCode:' + response.statusCode);
              console.log('body:' + response.body);
              if (response.statusCode === (500 || 404)) {
                  deferred.reject({msg: 'Failed to export binary, get 500 from CGI server(POST action)'});
              } else {
                  deferred.resolve({msg: 'Export negotiation binary done, period ' + options.period});
              }
          });                
        }       
      })
    }, function(error){
      console.log('error: ' + util.inspect(error));
      deferred.reject({msg: error.msg});
    });

    return deferred.promise;
}

exports.addDecisions = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
         console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
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
         // console.log(util.inspect(singleDecision, {depth:null}));
          allDeal.update({seminar: singleDecision.seminar, 
                              period: singleDecision.period},
                              {producerDeal: singleDecision.producerDeal},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg:'NegotiationDecision(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom addNegotiationDecisions:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;    
}
/**
 * Process an array of data synchronously.
 *
 * @param data An array of data.
 * @param processData A function that processes an item of data.
 *                    Signature: function(item, i, callback), where {@code item} is the i'th item,
 *                               {@code i} is the loop index value and {@code calback} is the
 *                               parameterless function to call on completion of processing an item.
 */
function doSynchronousLoop(data, processData, done) {
  if (data.length > 0) {
    var loop = function(data, i, processData, done) {
      processData(data[i], i, function() {
        if (++i < data.length) {
          loop(data, i, processData, done);
        } else {
          done();
        }
      });
    };
    loop(data, 0, processData, done);
  } else {
    done();
  }
}

function removeAllDeal(seminar, period){
  deferred = q.defer();

  console.log('inside...');
  allDeal.remove({
      seminar : seminar,
      period : period
  }, function(err, numberAffected){

    if(err){  deferred.reject({msg: 'remove existed alldeal failed'}); }

    console.log('resolve...');
    deferred.resolve({msg: 'removed existed allDeal, numberAffected ' + numberAffected});
  });

  return q.promise;
}

function fillAllDeal(seminar, period){
  var tempDeal,
       producerID, 
       retailerID, 
       categoryID,
       contarcts,
       contractCode,
       deferred = q.defer();

  tempDeal = new allDeal({seminar:seminar, period:period});

  //push empty subschema into array
  console.log('Push empty subschema into array...');
  for (var proCount = 0; proCount < 4; proCount++) { //TAllProducers :1~4
     tempDeal.producerDeal.push(new producerDeal({producerID : proCount+1}));
     for (var retCount = 0; retCount < 3; retCount++) { // TBMRetailers : 1~3
        tempDeal.producerDeal[proCount].retailerDeal.push(new retailerDeal({retailerID: retCount+1}));        
        for (var catCount = 0; catCount < 2; catCount++) {
          tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal.push(new categoryDeal({categoryID: catCount+1}));
          for (var brandCount = 0; brandCount < 5; brandCount++){
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].minimumOrder.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].volumeDiscountRate.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].salesTargetVolume.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusAmount.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusRate.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].paymentDays.brandsDetails.push(new brandDetails({brandID : 0}));
            tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].otherCompensation.brandsDetails.push(new brandDetails({brandID : 0}));
            for (var varCount = 0; varCount < 3; varCount++) {
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].minimumOrder.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].volumeDiscountRate.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].salesTargetVolume.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusAmount.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusRate.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].paymentDays.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
              tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].otherCompensation.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : 0}));
            }
          }         
        }
     }; 
  };

  var proCount = 0,retCount= 0;
//  var pair = [{producerID:1,retailerID:1}]
  var pair = [{producerID:1,retailerID:1}, {producerID:2,retailerID:1},{producerID:3,retailerID:1},
              {producerID:1,retailerID:2},{producerID:2,retailerID:2},{producerID:3,retailerID:2}]
  var idx = 0;

  console.log('Start contract loop...');
  (function loopContract(pair){
    require('./contract.js').contract.findOne({seminar:seminar, period:period, producerID:pair[idx].producerID, retailerID:pair[idx].retailerID},function(err, doc){
      if(doc){
          console.log('Find contracts between producer ' + pair[idx].producerID + ' and retailer ' + pair[idx].retailerID + ' in period ' + period + ', is:');
          var catCount = 0;

          //a promise chain to 
          fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].minimumOrder,'nc_MinimumOrder',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].minimumOrder = result.categoryDeal;

                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].minimumOrder,'nc_MinimumOrder',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].minimumOrder = result.categoryDeal;

                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].volumeDiscountRate,'nc_VolumeDiscountRate',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].volumeDiscountRate = result.categoryDeal;

                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].volumeDiscountRate,'nc_VolumeDiscountRate',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].volumeDiscountRate = result.categoryDeal;

                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].salesTargetVolume,'nc_SalesTargetVolume',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].salesTargetVolume = result.categoryDeal;
                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].salesTargetVolume,'nc_SalesTargetVolume',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].salesTargetVolume = result.categoryDeal;
                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusAmount,'nc_PerformanceBonusAmount',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusAmount = result.categoryDeal;
                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusAmount,'nc_PerformanceBonusAmount',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusAmount = result.categoryDeal;
                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusRate,'nc_PerformanceBonusRate',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusRate = result.categoryDeal;
                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusRate,'nc_PerformanceBonusRate',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].performanceBonusRate = result.categoryDeal;
                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].paymentDays,'nc_PaymentDays',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].paymentDays = result.categoryDeal;
                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].paymentDays,'nc_PaymentDays',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].paymentDays = result.categoryDeal;
                      catCount = 0;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].otherCompensation,'nc_OtherCompensation',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].categoryID = catCount + 1;
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].otherCompensation = result.categoryDeal;
                      catCount = 1;
                      return fillNegotiationItemByContractDetail(tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].otherCompensation,'nc_OtherCompensation',pair[idx].producerID,pair[idx].retailerID,catCount,period,seminar,doc.contractCode);
                    }).then(function(result){
                      tempDeal.producerDeal[pair[idx].producerID-1].retailerDeal[pair[idx].retailerID-1].categoryDeal[catCount].otherCompensation = result.categoryDeal;
                      if(idx < pair.length-1){
                        idx++;
                        loopContract(pair);                    
                      } else {
                        console.log('loop contract done');
                        tempDeal.save(function(err){
                          if(!err){deferred.resolve({msg:'save doc complete.',result:tempDeal})}
                          else (console.log('save error:' + err));
                        });
                      }
                    }, function(err){
                      console.log('Error:' + err);
                    }, function(log){
                      console.log('Log:' + err);
                    })
      }else{
        console.log('No contracts between producer ' + pair[idx].producerID + ' and retailer ' + pair[idx].retailerID + ' in period ' + period);        
        if(idx < pair.length-1){
          idx++;
          loopContract(pair);                    
        } else {
          console.log('loop contract done');
          allDeal.findOne({seminar:seminar, period:period},function(err,doc){
            if(err){ next(new Error(err));}
            if(!doc){
              tempDeal.save(function(err){
                if(!err){deferred.resolve({msg:'save doc complete.',result:tempDeal})}
                else (console.log('save error:' + err));
              });                            
            }else{
              doc.remove(function(err, doc){
                if(err){ res.send(400, 'remove seminar failure.'); }
                else {
                  tempDeal.save(function(err){
                    if(!err){deferred.resolve({msg:'save doc complete.',result:tempDeal})}
                    else (console.log('save error:' + err));
                  });                            
                }                
              });
            }

          });
        }        
      }

    });
  })(pair);

  return deferred.promise;
}

function fillNegotiationItemByContractDetail(categoryDeal, negotiationItem, producerID, retailerID, categoryCount, period, seminar, contractCode){
  var brand,variant,
      deferred = q.defer();

  categoryDeal.useMarketsDetails = false;
  categoryDeal.useBrandsDetails = false;

  console.log(' + Loop brands for negotiation items : '+ negotiationItem);
  (function loopBrand(brandCount, categoryCount, producerID, seminar, period){

    // console.log('producerDecision findOne inside: seminar ' + seminar + '/period ' + period + '/producerID ' + producerID + '/brandCount '  + brandCount);       
    require('./producerDecision.js').proDecision.findOne({seminar:seminar, period:period, producerID:producerID}, function(err, brandDoc){

          categoryDeal.useBrandDetails = true;

       // console.log(brandDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount]);
        if(brandDoc && (brandDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount].brandName != '')){
          brand = brandDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount];

          console.log('   + Find Brand : ' + brand.brandName );          
          categoryDeal.brandsDetails[brandCount].brandID = brand.brandID;
          categoryDeal.brandsDetails[brandCount].useVariantsDetails = true;
          categoryDeal.brandsDetails[brandCount].useMarketsDetails = false;
          categoryDeal.brandsDetails[brandCount].dateOfBirth = brand.dateOfBirth;
          categoryDeal.brandsDetails[brandCount].dateOfDeath = brand.dateOfDeath;                                                      
          (function loopVariant(brandCount, varCount, producerID, seminar, period){
              require('./producerDecision').proDecision.findOne({seminar:seminar, period:period, producerID:producerID}, function(err, variantDoc){
                  variant = variantDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount].proVarDecision[varCount];
                  if(variantDoc && (variant.varName != '')){
                    console.log('     - FOUND Variant : ' + brand.brandName + variant.varName + ', check if there is any contract details...');
                    //console.log('Find Variant with producerID:'+ producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount + ', varCount:' + varCount + ', varName:' + varName);                                                                
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].useMarketsDetails = false;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].varID = variant.varID;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfBirth = variant.dateOfBirth;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfDeath = variant.dateOfDeath;

                    require('./contract').contractVariantDetails.findOne({
                                      contractCode       : contractCode,
                                      parentBrandName    : brand.brandName,
                                      variantName        : variant.varName,
                                      isProducerApproved : true,
                                      isRetailerApproved : true}, function(err, contractVariantDetailsDoc){ 

                        if(contractVariantDetailsDoc){
                          console.log('          - FOUND related verified contractDetails, do the items copy : ' + brand.brandName + variant.varName);
                          switch(negotiationItem){
                            case 'nc_MinimumOrder'           : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_MinimumOrder;  break; 
                            case 'nc_SalesTargetVolume'      : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_SalesTargetVolume;  break;
                            case 'nc_PaymentDays'            : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_PaymentDays;  break;
                            case 'nc_OtherCompensation'      : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_OtherCompensation;  console.log('Write other:' + contractVariantDetailsDoc.nc_OtherCompensation); break;
                            case 'nc_VolumeDiscountRate'     : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_VolumeDiscountRate;  break;
                            case 'nc_PerformanceBonusAmount' : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_PerformanceBonusAmount;  break;
                            case 'nc_PerformanceBonusRate'   : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = contractVariantDetailsDoc.nc_PerformanceBonusRate;  break;
                          }
                        } else {                          
                          console.log('          - NO related verified contractDetails(' + contractCode + ', ' + brand.brandName + variant.varName + '), copy from last period input ...'); 

                          //If they cannot reach any agreement, use 0 for all the contract details.
                          switch(negotiationItem){
                            case 'nc_MinimumOrder'           : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0; break; 
                            case 'nc_SalesTargetVolume'      : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0;  break;
                            case 'nc_PaymentDays'            : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0; break;
                            case 'nc_OtherCompensation'      : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0;  break;
                            case 'nc_VolumeDiscountRate'     : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0;  break;
                            case 'nc_PerformanceBonusAmount' : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0;  break;
                            case 'nc_PerformanceBonusRate'   : categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[2] = 0;  break;
                          }
                                
                        }

                        //Get into next variant or next brand or END loop
                        if(varCount<2){
                          varCount++;
                          console.log('          - SWITCH Variant...')      
                          loopVariant(brandCount, varCount, producerID, seminar, period);
                        }else{                         
                          console.log('     - Brand ' + brand.brandName + ' loop done');
                          if(brandCount<4){
                            brandCount++;
                            console.log('     - SWITCH Brand...')        
                            loopBrand(brandCount, categoryCount, producerID, seminar, period);
                          } else {      
                            deferred.resolve({categoryDeal:categoryDeal, msg:'  - CategoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
                          }                                                                        
                        }    
                    });

                  } else {
                      //Get into next variant or next brand or END loop
                      if(varCount<2){
                        varCount++;
                        console.log('          - Change Variant...');      
                        loopVariant(brandCount, varCount, producerID, seminar, period);
                      }else{                         
                        console.log('     - Brand ' + brand.brandName + ' loop done');
                        if(brandCount<4){
                          brandCount++;
                          console.log('     - SWITCH Brand...')        
                          loopBrand(brandCount, categoryCount, producerID, seminar, period);
                        } else {      
                          deferred.resolve({categoryDeal:categoryDeal, msg:'  - categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
                        }                                                                        
                      }                                                                  
                  }
              })
          })(brandCount, 0, producerID, seminar, period);

        } else {
          if(brandCount<4){
            brandCount++;
            console.log('     - SWITCH Brand...')        
            loopBrand(brandCount, categoryCount, producerID, seminar, period);
          } else {      
            deferred.resolve({categoryDeal:categoryDeal, msg:'  - categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
          }                                
        }
    });
  })(0,categoryCount,producerID,seminar,period);

  return deferred.promise;
}

// comment old version for contractDetailsSchema, 2014-May-6, by Hao
// function fillNegotiationItemByContractDetail(categoryDeal, negotiationItem, producerID, retailerID, categoryCount, period, seminar, contractCode){
//   var brand,variant,
//       deferred = q.defer();

//   categoryDeal.useMarketsDetails = false;
//   categoryDeal.useBrandsDetails = true;

//   (function loopBrand(brandCount, categoryCount, producerID, seminar, period){
//     require('./producerDecision.js').proDecision.findOne({seminar:seminar, period:period, producerID:producerID}, function(err, brandDoc){
//         console.log('producerDecision findOne inside: seminar ' + seminar + '/period ' + period + '/producerID ' + producerID + '/brandCount '  + brandCount);       
//         if(brandDoc && (brandDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount].brandName != '')){
//           brand = brandDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount];
//           console.log('>>> Find Brand : ' + brand.brandName );          
//           require('./contract').contractDetails.findOne({contractCode: contractCode,
//                                                 userType: 'P',
//                                                 negotiationItem: negotiationItem,
//                                                 relatedBrandName : brand.brandName,
//                                                 relatedBrandID: brand.brandID, //need Monsoul to check BrandID is set properly in contractDetailsSchema
//                                                 isVerified: true}, function(err, contractDetailsDoc){
//                                                   if(contractDetailsDoc){
//                                                     console.log('There is related verified contractDetails :' + brand.brandName );
//                                                     categoryDeal.brandsDetails[brandCount].brandID = brand.brandID;
//                                                     if(contractDetailsDoc.useBrandDetails){
//                                                       console.log('Use Brand Details, copy value...');

//                                                       categoryDeal.brandsDetails[brandCount].useVariantsDetails = false;
//                                                       categoryDeal.brandsDetails[brandCount].useMarketsDetails = true;
//                                                       categoryDeal.brandsDetails[brandCount].dateOfBirth = brand.dateOfBirth;
//                                                       categoryDeal.brandsDetails[brandCount].dateOfDeath = brand.dateOfDeath;
//                                                       categoryDeal.brandsDetails[brandCount].marketsDetails[0] = contractDetailsDoc.brand_urbanValue;
//                                                       categoryDeal.brandsDetails[brandCount].marketsDetails[1] = contractDetailsDoc.brand_ruralValue;
//                                                       console.log('test');
//                                                       if(brandCount<4){
//                                                         brandCount++; 
//                                                         console.log('-------------------- change Brand ++ >>>>')        
//                                                         loopBrand(brandCount, categoryCount, producerID, seminar, period);
//                                                       } else {      
//                                                           console.log('brand ' + brand.brandName + ' loop done');
//                                                           deferred.resolve({categoryDeal:categoryDeal, msg:'categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
//                                                       }                                                        
//                                                     }else{
//                                                       categoryDeal.brandsDetails[brandCount].useVariantsDetails = true;
//                                                       categoryDeal.brandsDetails[brandCount].useMarketsDetails = false;
//                                                       categoryDeal.brandsDetails[brandCount].dateOfBirth = brand.dateOfBirth;
//                                                       categoryDeal.brandsDetails[brandCount].dateOfDeath = brand.dateOfDeath;                                                      
//                                                       console.log('User Varinat Details, enter varinat loop...');

//                                                       (function loopVariant(brandCount, varCount, producerID, seminar, period){
//                                                           require('./producerDecision').proDecision.findOne({seminar:seminar, period:period, producerID:producerID}, function(err, variantDoc){
//                                                               if(err) { console.log('Error:' + err)};                                                         
//                                                             //  console.log(variantDoc);
//                                                               variant = variantDoc.proCatDecision[categoryCount].proBrandsDecision[brandCount].proVarDecision[varCount];
//                                                               if(variant.varName != ''){
//                                                                 console.log('Find variant : ' + variant.varName + ', copy value...');

//                                                                 //console.log('Find Variant with producerID:'+ producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount + ', varCount:' + varCount + ', varName:' + varName);                                                                
//                                                                 categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].useMarketsDetails = true;
//                                                                 categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].varID = variant.varID;
//                                                                 categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfBirth = variant.dateOfBirth;
//                                                                 categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfDeath = variant.dateOfDeath;
//                                                                 switch(varCount){
//                                                                   case 0:
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.variant_A_urbanValue;                  
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.variant_A_ruralValue;
//                                                                     break;
//                                                                   case 1:
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.variant_B_urbanValue;                  
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.variant_B_ruralValue;
//                                                                     break;
//                                                                   case 2:
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.variant_C_urbanValue;                  
//                                                                     categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.variant_C_ruralValue;
//                                                                     break;   
//                                                                 }

//                                                               } else {
//                                                                   console.log('No Variant with producerID:'+ producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount + ', varCount:' + varCount);
//                                                               }

//                                                               if(varCount<2){
//                                                                 varCount++;
//                                                                 console.log('---------------------------------- change Variant ++ >>>>')      
              
//                                                                 loopVariant(brandCount, varCount, producerID, seminar, period);
//                                                               }else{
//                                                                 console.log('variant ' + variant.varName + ' loop done');
//                                                                 if(brandCount<4){
//                                                                   brandCount++;
//                                                                   console.log('-------------------- change Brand ++ >>>>')        
//                                                                   loopBrand(brandCount, categoryCount, producerID, seminar, period);
//                                                                 } else {      
//                                                                     console.log('brand ' + brand.brandName + ' loop done');
//                                                                     deferred.resolve({categoryDeal:categoryDeal, msg:'categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
//                                                                 }                                                                        
//                                                               }                                                                  
//                                                           })
//                                                       })(brandCount, 0, producerID, seminar,period)
//                                                     }
//                                                   }else{
//                                                     console.log('NO contract details with contractCode: ' + contractCode + '/relatedBrandName: ' + brand.brandName + '/negotiationItem:' + negotiationItem);
//                                                     if(brandCount<4){
//                                                       brandCount++;
//                                                       console.log('-------------------- change Brand ++ >>>>')        
//                                                       loopBrand(brandCount, categoryCount, producerID, seminar, period);
//                                                     } else {      
//                                                         console.log('brands loop done');
//                                                         deferred.resolve({categoryDeal:categoryDeal, msg:'categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
//                                                     }                                                    
//                                                   }
//                                                 })
//         } else {
//           console.log('No Brand with producerID:'+ producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount);
//           if(brandCount<4){
//             brandCount++;
//             console.log('-------------------- change Brand ++ >>>>')        
//             loopBrand(brandCount, categoryCount, producerID, seminar, period);
//           } else {      
//               console.log('brands loop done');
//               deferred.resolve({categoryDeal:categoryDeal, msg:'categoryDeal(catCount:' + categoryCount + '/negotiationItem:' + negotiationItem + ') generate done.'});
//           }             
//         }
//     });
//   })(0,categoryCount,producerID,seminar,period);

//   return deferred.promise;
// }
