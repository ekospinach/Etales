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
    retailerDeal : [retailerDealSchema]//length: TAllRetailers(1~4)
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

    //first step, combine contractDetailsSchema and contractSchema with specificated seminar/period
  

    var newDeal = fillAllDeal(options.seminar, options.period);
    if(newDeal){
      //console.log(newDeal);
      deferred.resolve({msg: 'ok'});
    } else { 
      deferred.reject({msg: 'error'});
    }

    // //second step, try to post data to CGI
    // allDeal.findOne({seminar : options.seminar,
    //                        period : options.period},
    //                        function(err, doc){
    //                             if(err) deferred.reject({msg:err, options: options}); 
    //                             if(!doc) {
    //                                 deferred.reject({msg: 'Export to binary, cannot find matched doc. ' + 'producerID:' + options.producerID + '/seminar:' + options.seminar + '/period:' + options.period});
    //                             } else {        
    //                                 request.post('http://' + options.cgiHost + ':' + options.cgiPort + options.cgiPath, {form: {jsonData: JSON.stringify(doc)}}, function(error, response){
    //                                     console.log('status:' + response.status);
    //                                     console.log('body:' + response.body);
    //                                     if (response.status === (500 || 404)) {
    //                                         deferred.reject({msg: 'Failed to export binary, get 500 from CGI server(POST action):' + JSON.stringify(options)});
    //                                     } else {
    //                                         deferred.resolve({msg: 'Export binary done, producer:' + options.producerID +', period' + options.period});
    //                                     }
    //                                 });
    //                             }
    //                        });
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

function fillAllDeal(seminar, period){
  var tempDeal,
       producerID, 
       retailerID, 
       categoryID,
       contarcts,
       contractCode;

  tempDeal = new allDeal({seminar:seminar, period:period});

  for (var proCount = 0; proCount < 4; proCount++) {
     tempDeal.producerDeal.push(new producerDeal({producerID : proCount+1}));
     for (var retCount = 0; retCount < 4; retCount++) {
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

  console.log('end filltempDeal:');
  console.log(tempDeal.producerDeal[0].retailerDeal[0].categoryDeal[0].minimumOrder.brandsDetails);

  var proCount = 0,retCount= 0;
  function loopContract(producerID, retailerID){
    dosomething().then(function(result){

    }, function(error){
      console.log(error.msg);
    }).fin(function(){
      if(producerID < 3){
        producerID++;      
        loopContract(producerID, retailerID);
      } else if(retailerID < 2){
        retailerID++;
      } else if((producerID == 3) && (retailerID ==2)){
        done();
      }            
    })
  }

  require('./contract.js').getContractsQuery({seminar:seminar, period:period, producerID:producerID, retailerID:retailerID}).then(function(result){
    console.log(result.msg);
    for (var i = 0; i < result.docs.length; i++) {
      contractCode = result.docs[i].contractCode;
      for (var catCount = 0; catCount < 2; catCount++) {
        categoryID = catCount + 1;
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal.push(new categoryDeal({categoryID: categoryID}));
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].categoryID = categoryID;
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].minimumOrder = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].minimumOrder,
                                                                                                    'minimumOrder',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].volumeDiscountRate = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].volumeDiscountRate,
                                                                                                    'volumeDiscountRate',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].salesTargetVolume = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].salesTargetVolume,
                                                                                                    'salesTargetVolume',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusAmount = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusAmount,
                                                                                                    'performanceBonusAmount',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusRate = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].performanceBonusRate,
                                                                                                    'performanceBonusRate',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].paymentDays = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].paymentDays,
                                                                                                    'paymentDays',producerID,retailerID,catCount,period,seminar,contractCode);
        tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].otherCompensation = fillNegotiationItemByContractDetail(tempDeal.producerDeal[proCount].retailerDeal[retCount].categoryDeal[catCount].otherCompensation,
                                                                                                    'otherCompensation',producerID,retailerID,catCount,period,seminar,contractCode);
      }
    }
  }, function(error){
    console.log('Error:' + error.msg);
  });

  return tempDeal;


}

function fillNegotiationItemByContractDetail(categoryDeal, negotiationItem, producerID, retailerID, categoryCount, period, seminar, contractCode){
  var brand,variant,contractDetails;
  categoryDeal.useMarketsDetails = false;
  categoryDeal.useBrandsDetails = true;
  categoryDeal.brandsDetails.push(new brandDetails());
  for (var brandCount = 0; brandCount < 5; brandCount++) {
    categoryDeal.brandsDetails.push(new brandDetails());
    require('./producerDecision').getBrand(categoryCount,brandCount,producerID,seminar,period).then(function(brandDoc){
      console.log(brandDoc.msg);
      if(brandDoc.doc.brandName){
        require('./contract').getVerifiedContractDetailsQuery({contractCode : contractCode, userType: 'P', negotiationItem: negotiationItem, relatedBrandName: brand.brandName, relatedBrandID: brand.brandID}).then(function(contractDetailsDoc){
          console.log(contractDetailsDoc.msg);
          for (var i = 0; i < contractDetailsDoc.docs.length; i++) {
            categoryDeal.brandsDetails[brandCount].brandID = brandDoc.doc.brandID;
            if(contractDetailsDoc.docs[i].useBrandDetails){ //useBrands
              categoryDeal.brandsDetails[brandCount].useVariantsDetails = false;
              categoryDeal.brandsDetails[brandCount].useMarketsDetails = true;
              categoryDeal.brandsDetails[brandCount].dateOfBirth = brandDoc.doc.dateOfBirth;
              categoryDeal.brandsDetails[brandCount].dateOfDeath = brandDoc.doc.dateOfDeath;
              categoryDeal.brandsDetails[brandCount].marketsDetails[0] = contractDetailsDoc.docs[i].brand_urbanValue;
              categoryDeal.brandsDetails[brandCount].marketsDetails[1] = contractDetailsDoc.docs[i].brand_ruralValue;
            } else { //useVariantDetails
              categoryDeal.brandsDetails[brandCount].useVariantsDetails = true;
              categoryDeal.brandsDetails[brandCount].useMarketsDetails = false;
              for (var varCount = 0; varCount < 3; varCount++) {
                categoryDeal.brandsDetails[brandCount].variantDetails.push(new variantDetails());
                require('./producpconterDecision').getVariant(categoryCount, brandCount, varCount, producerID, seminar, period).then(function(variantDoc){
                  console.log(variantDoc);
                  if(variantDoc.doc.varName){
                    categoryDeal.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : variantDoc.doc.varID}));
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].useMarketsDetails = true;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].varID = variantDoc.doc.varID;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfBirth = variantDoc.doc.dateOfBirth;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfDeath = variantDoc.doc.dateOfDeath;
                    switch(varCount){
                      case 0:
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.docs[i].variant_A_ruralValue;
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.docs[i].variant_A_urbanValue;                  
                        break;
                      case 1:
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.docs[i].variant_B_ruralValue;
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.docs[i].variant_B_urbanValue;                  
                        break;
                      case 2:
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetailsDoc.docs[i].variant_C_ruralValue;
                        categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetailsDoc.docs[i].variant_C_urbanValue;                  
                        break;                
                    }
                  }
                }, function(variantErr){
                  console.log(variantErr.msg);
                })                
              };

            }
          };
        }, function(contractDetailsErr){
          console.log(contractDetailsErr.msg);
        });
      } 
    }, function(brandErr){
      console.log(brandErr.msg);
    });

  };
  return categoryDeal;
}
