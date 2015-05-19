var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var BG_extendedFeedbackSlidesSchema = mongoose.Schema({
    period                            : Number,
    seminar                           : String,


    //Supplier : 8.Product Availability at Stores - Two Markets
    //Retailer : 7.Product Availability at Stores - Two Markets
    xf_AvailabilityAtBMStores         : [variantStoreAvailabilitySchema],


    //Supplier : 8.Product Availability at Stores - Online 
    //Retailer : 7.Product Availability at Stores - Online 
    xf_AvailabilityOnline             : [variantOnlineAvailabilitySchema],

    //Supplier : 9.Partner Relations & Outcomes - Two Categories / Markets
    xf_RetailersProfitabilityPerSupplier : [retailersProfitabilityPerSupplierSchema],


    //Retailer : 9.Partner Relations & Outcomes - Two Categories / Markets
    xf_SuppliersProfitabilityPerCustomer : [supplierProfitabilityPerCustomerSchema],

})  

var variantStoreAvailabilitySchema = mongoose.Schema({
    marketID : Number,
    categoryID : Number, 
    BMRetailerID : Number, //1-Retailer1, 2-Retailer2, 3-TraditionalTrade

    variantName : String,
    parentBrandName : String,
    shelfSpace : Number,
    inventoryVolume : Number,
})

var variantOnlineAvailabilitySchema = mongoose.Schema({
    categoryID : Number, 

    variantName : String,
    parentBrandName : String,
    shelfSpace : Number,
    inventoryVolume : Number,    
})

var retailersProfitabilityPerSupplierSchema = mongoose.Schema({
    marketID : Number,
    categoryID : Number,
    BMRetailerID : Number,
    supplierID : Number,

    xfrpps_ShelfSpace                     : Number,   
    xfrpps_SalesValue                     : Number,   
    xfrpps_Rotation                       : Number, //  { Sales per 1% of shelf space } 
    xfrpps_SalesValueShare                : Number,   
    xfrpps_GrossContribution              : Number,   
    xfrpps_GrossContributionPerShelfSpace : Number, //  { added on 15-May-2015 }  
    xfrpps_GrossContributionShare         : Number,     
})

var supplierProfitabilityPerCustomerSchema = mongoose.Schema({
    marketID                      : Number,
    categoryID                    : Number,    

    xfsppr_SalesValue             : Number,
    xfsppr_GrossProfit            : Number,  
    xfsppr_TradeSupport           : Number,
    xfsppr_TradeProfit            : Number,
    xfsppr_VisibilityShare        : Number,
    xfsppr_TradeSupportShare      : Number,    
    xfsppr_SalesValueShare        : Number,
    xfsppr_GrossProfitShare       : Number,
    xfsppr_TradeProfitShare       : Number,    
})


var BG_extendedFeedbackSlides = mongoose.model('BG_extendedFeedbackSlides', BG_extendedFeedbackSlidesSchema);

exports.addInfos = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar 
      };

      console.log('BG_extendedFeedbackSlides shoot:' + reqOptions.cgiPath);
      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);

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
         // console.log(util.inspect(singleReport, {depth:null}));

         BG_extendedFeedbackSlides.update({
                              seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {
                                xf_AvailabilityAtBMStores         : singleReport.xf_AvailabilityAtBMStores,
                                xf_AvailabilityOnline             : singleReport.xf_AvailabilityOnline,
                                xf_RetailersProfitabilityPerSupplier : singleReport.xf_RetailersProfitabilityPerSupplier,
                                xf_SuppliersProfitabilityPerCustomer : singleReport.xf_SuppliersProfitabilityPerCustomer,
                              },
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getFeedBack = function(req, res, next) {
    BG_extendedFeedbackSlides.findOne({
        seminar: req.params.seminar,
        period: req.params.period
    }, function(err, doc) {
        if (err) {
            return next(new Error(err));
        }
        if (doc) {
            res.send(200, doc);
        } else {
            res.send(404, 'fail');
        }
    })
}

