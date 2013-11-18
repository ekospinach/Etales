var mongoose  = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore');
	uniqueValidator = require('mongoose-unique-validator');

var allDealSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    producerDeal : [producerDealSchema]
})

var producerDealSchema = mongoose.Schema({
    producerID : Number,
    retailerDealSchema : [retailerDealSchema]
})

var retailerDealSchema = mongoose.Schema({
    retailerID : Number,
    categoryDeal : [categoryDealSchema]
})

var categoryDealSchema = mongoose.Schema({
    categoryID : Number,
    consignementVolume     : categoryDetailsSchema,
    inStoreActivitiesFee   : categoryDetailsSchema,
    minimumOrder           : categoryDetailsSchema,
    otherCompensation      : categoryDetailsSchema,
    paymentDays            : categoryDetailsSchema,
    performanceBonusAmount : categoryDetailsSchema,
    performanceBonusRate   : categoryDetailsSchema,
    promotionalSupport     : categoryDetailsSchema,
    salesTargetVolume      : categoryDetailsSchema,
    volumeDiscountRate     : categoryDetailsSchema,
})

var categoryDetailsSchema = mongoose.Schema({
    marketsDetails : [Number], //Length: TMarketTotal
    useBrandsDetails : Boolean,
    useMarketsDetails : Boolean,
    brandsDetails : [brandDetailsSchema], //Length: TProBrands
})

var brandDetailsSchema = mongoose.Schema({
    brandID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    marketsDetails : [Number],
    useVariantsDetails : Boolean,
    useMarketsDetails : Boolean,
    variantsDetails : [variantsDetailsSchema] //length: TOneBrandVars
})

var variantsDetailsSchema = mongoose.Schema({
    varID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    useMarketsDetails : Boolean,
    marketsDetails : [Number]
})

var allDeal = mongoose.model('allDeal', allDealSchema);

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

exports.addDecisionss = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

    console.log('inside options:' + util.inspect(options, {depth : null}));


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
