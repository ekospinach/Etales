var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var companyHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	producerView : [producerViewSchema], //1~4
	retailerView : [retailerViewSchema]  //1~4
})

var producerViewSchema = mongoose.Schema({
	producerID : Number, //(1~4)
	//pt...
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number,
	//pc...
	productionCapacity : [Number], //TCategories(1~2)
	acquiredTechnologyLevel : [Number], //TCategories(1~2)
	acquiredProductionFlexibility : [Number], //TCategories(1~2)
	acquiredDesignLevel : [Number] //TCategories(1~2)
})

var retailerViewSchema = mongoose.Schema({
	retailerID : Number, //(1~4)
	//rr....
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number
})

var companyHistory=mongoose.model('companyHistory',companyHistoryInfoSchema);

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
              var singleInfo = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleInfo) return; 
//          console.log(util.inspect(singleInfo, {depth:null}));         
          companyHistory.update({seminar: singleInfo.seminar, 
                              period: singleInfo.period},
                              {producerView : singleInfo.producerView,
                               retailerView : singleInfo.retailerView},
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                    
                                    currentPeriod--;
                                    if (currentPeriod >= startFrom) {
                                       sendRequest(currentPeriod);
                                    } else {
                                       deferred.resolve({msg:'companyHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                    }
                                });   

         
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom companyHistoryInfo import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}


exports.newDoc=function(req,res,next){
	var newDoc=new companyHistory({
		period:0,
		seminar:"MAY",
		companyID:1,
		producerView:[{
			producerID:1,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		},{
			producerID:2,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		},{
			producerID:3,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		}],
		retailerView:[{
			retailerID : 1,
			budgetAvailable : 11,
			budgetOverspent : 12,
			budgetSpentToDate : 13
		},{
			retailerID : 2,
			budgetAvailable : 11,
			budgetOverspent : 12,
			budgetSpentToDate : 13
		}]
	});
	newDoc.save(function(err){
		if(err){
			next(new Error(err));
		}
		console.log("companyHistory insert success");
		res.send(200,'insert companyHistory success');
	})
}

// 	retailerCategoryView : [retailerCategoryViewSchema] //TCategories(1~2)
// })

// var retailerCategoryViewSchema = mongoose.Schema({
// 	retailerCategoryMarketView = [retailerCategoryMarketViewSchema] //TMarketsTotal(1~3)
// })

// var retailerCategoryMarketViewSchema = mongoose.Schema({
// 	//rq...
// 	rq_socialNetworsScore : Number;
// })

