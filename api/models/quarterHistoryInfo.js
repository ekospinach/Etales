var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var quarterHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	categoryView : [categoryViewSchema] //TCategoriesTotal(1~3)
})

var categoryViewSchema = mongoose.Schema({
	categoryMarketView : [categoryMarketViewSchema] //TMarketsTotal(1~3)
})

var categoryMarketViewSchema = mongoose.Schema({
	//q...
	segmentsVolumes : [Number] //1~5, 5 for total
})

var quarterHistory=mongoose.model('quarterHistory',quarterHistoryInfoSchema);


exports.getQuarterHistory=function(req,res,next){
	quarterHistory.findOne({
		seminar:req.params.seminar,
		period:req.params.period
	},function(err,doc){
		if(err){
			return next(new Error(err));
		}
		if(!doc){
			res.send(404,'cannot find the doc');
		}else{
            res.header("Content-Type", "application/json; charset=UTF-8");                                
            res.statusCode = 200;
            res.send(doc);			
		}
	})
}

exports.addInfos = function(options) {
  var deferred = q.defer();
  var startFrom = options.startFrom,
    endWith = options.endWith;

  (function sendRequest(currentPeriod) {
    var reqOptions = {
      hostname: options.cgiHost,
      port: options.cgiPort,
      path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar
    };

    http.get(reqOptions, function(response) {
      var data = '';
      response.setEncoding('utf8');
      response.on('data', function(chunk) {
        data += chunk;
      }).on('end', function() {
        //ask Oleg to fix here, should return 404 when result beyound the existed period.
        console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
        if (response.statusCode === (404 || 500))
          deferred.reject({
            msg: 'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)
          });
        else {
          try {
            var singleInfo = JSON.parse(data);
          } catch (e) {
            deferred.reject({
              msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data,
              options: options
            });
          }
        }
        if (!singleInfo) return;
        //          console.log(util.inspect(singleInfo, {depth:null}));         
        quarterHistory.update({
            seminar: singleInfo.seminar,
            period: singleInfo.period
          }, {
            categoryView: singleInfo.categoryView
          }, {
            upsert: true
          },
          function(err, numberAffected, raw) {
            if (err) deferred.reject({
              msg: err,
              options: options
            });
            currentPeriod--;
            if (currentPeriod >= startFrom) {
              sendRequest(currentPeriod);
            } else {
              deferred.resolve({
                msg: 'quarterHistoryInfo(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith,
                options: options
              });
            }
          });


      });
    }).on('error', function(e) {
      deferred.reject({
        msg: 'errorFrom quarterHistoryInfo import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),
        options: options
      });
    });
  })(endWith);

  return deferred.promise;
}