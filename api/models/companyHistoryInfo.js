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

exports.getCompanyHistory=function(req,res,next){
	companyHistory.findOne({
		seminar:req.params.seminar,
		period:req.params.period
	},function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,'cannot find the doc');
        }else{
            res.header("Content-Type", "application/json; charset=UTF-8");                                
            res.statusCode = 200;
           	//res.send(doc);

            if(req.params.userType=="P"){
            	res.send(doc["producerView"][req.params.userID-1]);
            }else{
            	res.send(doc['retailerView'][req.params.userID-1]);
            }
        }
	})
}

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


