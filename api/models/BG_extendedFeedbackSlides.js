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

    //------------- Added May-26-2015

    //Retailer : 4.Shopper Segment Evolution - Two Markets 
    xf_ShoppersSegmentsShares  : [shoppersSegmentsSchema],
    //Retailer : 6.Retailer Sales - Two Categories / Markets
    xf_ChannelShoppersSegmentsRetailSalesValue : [channelShoppersSegmentsRetailSalesValueSchema],


    //Retailer : 11.Profits - Gross Profits
    xf_RetailerGrossProfitPerBrandOwner : [marketRetailerBrandOwnerSchema],
    //Retailer : 11.Profits - Margins (3 line charts)
    xf_StoreGrossProfitMargin  : [marketStoreSchema],
    xf_StoreOperatingProfitMargin : [marketStoreSchema],   
    xf_StoreNetProfitMargin : [marketStoreSchema],

    //------------ Added May-27-2015


})  


var marketStoreSchema = mongoose.Schema({
    marketID : Number,
    categoryID : Number,
    period : Number,
    storeID : Number,
    value : Number
})

// { last third dimension (TBMRetailersTotal/BMRetailerID), highest index(4) is for On-line combined across all Producers }
var marketRetailerBrandOwnerSchema = mongoose.Schema({
    marketID : Number,
    categoryID : Number,
    period : Number,
    BMRetailerID : Number,
    brandOwnerID : Number, // Prod_1_ID..Ret_2_ID; 1,2,3,4,5,6
    value : Number
})

// { It is a bit overloaded with data. For absolute values in the top line you only need: [market, category, period, ALLSHOPPERS, ALlStoresMaxTotal].xfsss_Absolute element } 
// { For left side bar charts use: [market, category, period, BMS/NETIZENS/MIXED, ALlStoresMaxTotal].xfsss_Importance }
// { For right side bar use: [market, category, period, ALLSHOPPERS, store].xfsss_Importance }
var channelShoppersSegmentsRetailSalesValueSchema = mongoose.Schema({
    marketID : Number,
    categoryID : Number,
    period : Number,
    shopperKind : String,
    storeID : Number,
    absolute : Number,
    importance : Number
})

var shoppersSegmentsSchema = mongoose.Schema({
    period           : Number,
    categoryID       : Number,
    marketID         : Number,
    totalMarket      : Number,
    BMS_importance               : Number,
    NETIZENS_importance          : Number,
    MIXED_importance             : Number,
    ALLSHOPPERS_importance       : Number,
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
    marketID                      : Number, //1-urban 2-rural 3-total
    supplierID                    : Number, // 
    categoryID                    : Number, // 3-Total
    accountID                     : Number, // { Two Modern Retailers + Traditional Trade + On-Line }

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

                                xf_ShoppersSegmentsShares : singleReport.xf_ShoppersSegmentsShares,
                                xf_ChannelShoppersSegmentsRetailSalesValue : singleReport.xf_ChannelShoppersSegmentsRetailSalesValue,
                                xf_RetailerGrossProfitPerBrandOwner : singleReport.xf_RetailerGrossProfitPerBrandOwner,
                                xf_StoreGrossProfitMargin : singleReport.xf_StoreGrossProfitMargin,
                                xf_StoreOperatingProfitMargin : singleReport.xf_StoreOperatingProfitMargin,
                                xf_StoreNetProfitMargin : singleReport.xf_StoreNetProfitMargin,
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

