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
    console.log('test1');

    var newDeal = fillAllDeal(options.seminar, options.period);
    console.log('test');
    if(newDeal){
      //console.log(newDeal);
      deferred.resolve({msg: newDeal});
    } else { 
      deferred.reject({msg: 'newDeal:' + newDeal});
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

function fillAllDeal(seminar, period){
  var tempDeal,
       producerID, 
       retailerID, 
       categoryID,
       contarcts,
       contractCode;

  tempDeal = new allDeal({seminar:seminar, period:period});
  console.log('start filltempDeal: '  + tempDeal);
   for (var proCount = 0; proCount < 4; proCount++) {
     producerID = proCount + 1;
     tempDeal.producerDeal.push(new producerDeal({producerID : producerID}));
     for (var retCount = 0; retCount < 4; retCount++) {
        retailerID = retCount + 1;
        tempDeal.producerDeal[proCount].retailerDeal.push(new retailerDeal({retailerID: retailerID}));        
        contarcts = require('./contract.js').getContractsQuery({seminar:seminar, period:period, producerID:producerID, retailerID:retailerID}); 
        if(!contarcts){
          console.log({isError:true, msg:'there is not contract between producer ' + producerID + ' and retailer ' + retailerID + ' in period ' + period});
        } else {
          for (var i = 0; i < contracts.length; i++) {
            contractCode = contracts[i].contractCode;
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
        }
     }; 
   };

   console.log('end filltempDeal:');
   console.log(tempDeal);


   return tempDeal;
}

function fillNegotiationItemByContractDetail(categoryDeal, negotiationItem, producerID, retailerID, categoryCount, period, seminar, contractCode){
  var brand,variant,contractDetails;
  categoryDeal.useMarketsDetails = false;
  categoryDeal.useBrandsDetails = true;
  categoryDeal.brandsDetails.push(new brandDetails());
  for (var brandCount = 0; brandCount < 5; brandCount++) {
    categoryDeal.brandsDetails.push(new brandDetails());
    brand = require('./producerDecision').getBrand(categoryCount,brandCount,producerID,seminar,period);
    if(brand.brandName){
      contractDetails = require('./contract').getVerifiedContractDetailsQuery({contractCode : contractCode, userType: 'P', negotiationItem: negotiationItem, relatedBrandName: brand.brandName, relatedBrandID: brand.brandID});
      if(contractDetails) {
        for (var i = 0; i < contractDetails.length; i++) {
          categoryDeal.brandsDetails[brandCount].brandID = brand.brandID;
          if(contractDetails[i].useBrandDetails){ //useBrands
            categoryDeal.brandsDetails[brandCount].useVariantsDetails = false;
            categoryDeal.brandsDetails[brandCount].useMarketsDetails = true;
            categoryDeal.brandsDetails[brandCount].dateOfBirth = brand.dateOfBirth;
            categoryDeal.brandsDetails[brandCount].dateOfDeath = brand.dateOfDeath;
            categoryDeal.brandsDetails[brandCount].marketsDetails[0] = contractDetails[i].brand_urbanValue;
            categoryDeal.brandsDetails[brandCount].marketsDetails[1] = contractDetails[i].brand_ruralValue;
          } else { //useVariantDetails
            categoryDeal.brandsDetails[brandCount].useVariantsDetails = true;
            categoryDeal.brandsDetails[brandCount].useMarketsDetails = false;
            for (var varCount = 0; varCount < 3; varCount++) {
              categoryDeal.brandsDetails[brandCount].variantDetails.push(new variantDetails());
              variant = require('./producerDecision').getVariant(categoryCount, brandCount, varCount, producerID, seminar, period);
              if(variant.varName){
                categoryDeal.brandsDetails[brandCount].variantsDetails.push(new variantDetails({varID : variant.varID}));
                categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].useMarketsDetails = true;
                categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].varID = variant.varID;
                categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfBirth = variant.dateOfBirth;
                categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].dateOfDeath = variant.dateOfDeath;
                switch(varCount){
                  case 0:
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetails[i].variant_A_ruralValue;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetails[i].variant_A_urbanValue;                  
                    break;
                  case 1:
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetails[i].variant_B_ruralValue;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetails[i].variant_B_urbanValue;                  
                    break;
                  case 2:
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[0] = contractDetails[i].variant_C_ruralValue;
                    categoryDeal.brandsDetails[brandCount].variantsDetails[varCount].marketsDetails[1] = contractDetails[i].variant_C_urbanValue;                  
                    break;                
                }
              }
            };
          }
        };

      }
    } 
  };
  return categoryDeal;
}
