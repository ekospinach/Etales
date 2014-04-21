var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)
var emallPricesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    variantInfo : [variantInfoSchema]
})

var variantInfoSchema = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
    parentBrandName : String,
    vemp_NetOnlinePrice  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_PriceChange     : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_Promotions      : {
        promo_Frequency : Number, //saved as # of weeks 
        promo_Rate : Number, //saved as a decimal 
    } //TAllProducer : 1~4 (ProsMaxPlus)
})

var emallPrices=mongoose.model('gr_emallPrices',emallPricesSchema);

exports.addReports = function(options){
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
          //console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
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

          emallPrices.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {categoryInfo: singleReport.categoryInfo},
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

exports.addEmallPrices=function(req,res,next){
    var newEMallPrices=new emallPrices({
        period:0,
        seminar:'MAY',
        categoryInfo:[{
            categoryID:1,
            variantInfo:[{
                varName : 'ELAN1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        },{
            categoryID:2,
            variantInfo:[{
                varName : 'HTTP1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'HTTP2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'HTTP3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        },{
            categoryID:3,
            variantInfo:[{
                varName : 'ELAN1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        }]
    });
    newEMallPrices.save(function(err) {
        if(!err){
            res.send(200,newEMallPrices);
            console.log("created new newEMallPrices:"+newEMallPrices);
        } else {
            res.send(400,"failed.");
        }
    });
}

exports.getEmallPrices=function(req,res,next){
        var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    emallPrices.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}
