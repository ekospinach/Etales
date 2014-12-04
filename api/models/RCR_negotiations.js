var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

// new Schema, 2014-Apr-17th:
var RCR_negotiationsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    vnd_QuantityDiscount  : {
        discount_MinimumVolume : [variantNegotiationsDetails],
        discount_Rate          : [variantNegotiationsDetails],
    },
    vnd_TargetBonus       : {
        bonus_TargetVolume : [variantNegotiationsDetails],
        bonus_Rate         : [variantNegotiationsDetails],
        bonus_Value        : [variantNegotiationsDetails],       
    },
    vnd_PaymentTerms      : [variantNegotiationsDetails],
    vnd_OtherCompensation : [variantNegotiationsDetails],
    vnd_ContractHonoured  : [variantNegotiationsDetails] 
})

var variantNegotiationsDetails = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    producerID       : Number,
    // TAllProducers : 1~4
    // Again, the rows for Supplier_4 brands should only be added if he was ACTIVE player     
    value : Number
})



var RCR_negotiations=mongoose.model('RCR_negotiations',RCR_negotiationsSchema);

exports.addReports = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

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
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404||500 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var singleReport = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleReport) return; 

          RCR_negotiations.update({seminar    : singleReport.seminar, 
                                   period     : singleReport.period,
                                   retailerID : singleReport.retailerID},
                                {
                                vnd_QuantityDiscount  : singleReport.vnd_QuantityDiscount, 
                                vnd_TargetBonus       : singleReport.vnd_TargetBonus,     
                                vnd_PaymentTerms      : singleReport.vnd_PaymentTerms,     
                                vnd_OtherCompensation : singleReport.vnd_OtherCompensation,
                                vnd_ContractHonoured  : singleReport.vnd_ContractHonoured, 
                                },      
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ', retailer:' + options.retailerID+ ') import done. from period ' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   

        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getRCR_negotiations = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'retailerID': req.params.retailerID
    };
    RCR_negotiations.find(data, function(err, docs) {
        if (err) {
            return next(new Error(err));
        }
        if (docs) {
            res.send(200, docs);
        } else {
            res.send(404, 'failed');
        }
    })
}


