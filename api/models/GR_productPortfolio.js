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
var productPortfolioSchema = mongoose.Schema({
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
    packFormat : String,
    vc_composition : [Number] // TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
})

var productPortfolio=mongoose.model('gr_productPortfolio',productPortfolioSchema);

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

         productPortfolio.update({seminar: singleReport.seminar, 
                              period: singleReport.period},
                              {categoryInfo: singleReport.actorInfo},
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


exports.addProductPortfolio=function(req,res,next){
    var newProductPortfolio=new productPortfolio({
        period : 0,
        seminar : 'MAY',
        categoryInfo : [{
            categoryID:1,
            variantInfo : [{
               varName:'ELAN1',
               varID:101,
               parentBrandID:10,
               parentBrandName:'ELAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'EWAN2',
               varID:201,
               parentBrandID:20,
               parentBrandName:'EWAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'ETAN3',
               varID:301,
               parentBrandID:30,
               parentBrandName:'ETAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            },{
               varName:'ESAN4',
               varID:401,
               parentBrandID:40,
               parentBrandName:'ESAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'EXAN5',
               varID:501,
               parentBrandID:50,
               parentBrandName:'EXAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'ELAN6',
               varID:601,
               parentBrandID:60,
               parentBrandName:'ELAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            }]
        },{
            categoryID:2,
            variantInfo : [{
               varName:'HLAN1',
               varID:102,
               parentBrandID:10,
               parentBrandName:'HLAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'HWAN2',
               varID:202,
               parentBrandID:20,
               parentBrandName:'HWAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'HTAN3',
               varID:302,
               parentBrandID:30,
               parentBrandName:'HTAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            },{
               varName:'HSAN4',
               varID:402,
               parentBrandID:40,
               parentBrandName:'HSAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'HXAN5',
               varID:502,
               parentBrandID:50,
               parentBrandName:'HXAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'HLAN6',
               varID:602,
               parentBrandID:60,
               parentBrandName:'HLAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            }]
        },{
            categoryID:3,
            variantInfo : [{
               varName:'ELAN1',
               varID:101,
               parentBrandID:10,
               parentBrandName:'ELAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'EWAN1',
               varID:201,
               parentBrandID:20,
               parentBrandName:'EWAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'ETAN1',
               varID:301,
               parentBrandID:30,
               parentBrandName:'ETAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            },{
               varName:'ESAN1',
               varID:401,
               parentBrandID:40,
               parentBrandName:'ESAN',
               packFormat:'ECONOMY',
               vc_composition:[1,2,3]
            },{
               varName:'EXAN1',
               varID:501,
               parentBrandID:50,
               parentBrandName:'EXAN',
               packFormat:'STANDARD',
               vc_composition:[1,2,3]
            },{
               varName:'ELAN1',
               varID:601,
               parentBrandID:60,
               parentBrandName:'ELAN',
               packFormat:'PREMIUM',
               vc_composition:[1,2,3]
            }]
        }]        
    });
    newProductPortfolio.save(function(err) {
        if(!err){
            res.send(200,newProductPortfolio);
            console.log("created new GeneralReport:"+newProductPortfolio);
        } else {
            res.send(400,"failed.");
        }
    });   
}

exports.getProductPortfolio=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    productPortfolio.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    });
}

