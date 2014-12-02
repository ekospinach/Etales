var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

//New Schema, 2014-Apr-17th
var RCR_inventoryVolumesSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    rcrviv_Initial          : [variantInventoryVolumeDetailSchema],
    rcrviv_Purchase         : [variantInventoryVolumeDetailSchema],
    rcrviv_Sales            : [variantInventoryVolumeDetailSchema],
    rcrviv_Discontinued     : [variantInventoryVolumeDetailSchema],
    rcrviv_Closing          : [variantInventoryVolumeDetailSchema],

    rcrviv_NetRetailPrice   : [variantInventoryVolumeDetailSchema],

})
// { use parentCompany to filter which variants should be displayed.             }
// { For Retailer 1 allowed set is [1, 2, 3, 5]                                  }
// { For Retailer 2 allowed set is [1, 2, 3, 6]                                  }
// { For Retailer 3 allowed set is [1, 2, 3] (no private labels at TT            }
// { Should Supplier 4 become ACTIVE, then [4] must be added to all allowed sets }    
var variantInventoryVolumeDetailSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    parentCompany  : Number,
    marketID       : Number, //1-Urban, 2-Rural, 3-Total   
    value : Number
})

var RCR_inventoryVolumes=mongoose.model('RCR_inventoryVolumes',RCR_inventoryVolumesSchema);

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

          RCR_inventoryVolumes.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            retailerID : singleReport.retailerID},
                                {
                                rcrviv_Initial      : singleReport.rcrviv_Initial,     
                                rcrviv_Purchase     : singleReport.rcrviv_Purchase,    
                                rcrviv_Sales        : singleReport.rcrviv_Sales,       
                                rcrviv_Discontinued : singleReport.rcrviv_Discontinued,
                                rcrviv_Closing      : singleReport.rcrviv_Closing,     

                                rcrviv_NetRetailPrice : singleReport.rcrviv_NetRetailPrice,
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

exports.getRCR_inventoryVolumes = function(req, res, next) {
    var data = {
        'seminar': req.params.seminar,
        'period': req.params.period,
        'retailerID': req.params.retailerID
    };
    RCR_inventoryVolumes.find(data, function(err, docs) {
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
