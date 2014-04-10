var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_netMarketPricesSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //1~4:AccountMax
    previousNetMarketPrice : [Number], //0-Urban, 1-Rural
    latestNetMarketPrice   : [Number], //0-Urban, 1-Rural
    netMarketPriceChange   : [Number], //0-Urban, 1-Rural   
})

var MR_netMarketPrices=mongoose.model('MR_netMarketPrices',MR_netMarketPricesSchema);

exports.addMR_netMarketPrices=function(req,res,next){
    var newMR_netMarketPrices=MR_netMarketPrices({
        period : 0,
        seminar : 'MAY',
        variantInfo : [{
            variantName : '_A',
            parentBrandName : 'ELAN1',
            parentCategoryID : 1,
            parentCompanyID : 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'ELAN1',
            parentCategoryID : 1,
            parentCompanyID : 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'ELAN2',
            parentCategoryID : 1,
            parentCompanyID : 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'ELAN2',
            parentCategoryID : 1,
            parentCompanyID : 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'ELAN3',
            parentCategoryID : 1,
            parentCompanyID : 3, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},
            {
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'ELAN3',
            parentCategoryID : 1,
            parentCompanyID : 3, //TActors : 1~(4+3) 
            accountInfo : [{},
            {
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'ELAN5',
            parentCategoryID : 1,
            parentCompanyID : 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'ELAN5',
            parentCategoryID : 1,
            parentCompanyID : 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'ELAN6',
            parentCategoryID : 1,
            parentCompanyID : 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'ELAN6',
            parentCategoryID : 1,
            parentCompanyID : 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'HLAN1',
            parentCategoryID : 2,
            parentCompanyID : 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'HLAN1',
            parentCategoryID : 2,
            parentCompanyID : 1, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'HLAN2',
            parentCategoryID : 2,
            parentCompanyID : 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'HLAN2',
            parentCategoryID : 2,
            parentCompanyID : 2, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'HLAN3',
            parentCategoryID : 2,
            parentCompanyID : 3, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},
            {
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'HLAN3',
            parentCategoryID : 2,
            parentCompanyID : 3, //TActors : 1~(4+3) 
            accountInfo : [{},
            {
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'HLAN5',
            parentCategoryID : 2,
            parentCompanyID : 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'HLAN5',
            parentCategoryID : 2,
            parentCompanyID : 5, //TActors : 1~(4+3) 
            accountInfo : [{
                accountID : 1, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_A',
            parentBrandName : 'HLAN6',
            parentCategoryID : 2,
            parentCompanyID : 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        },{
            variantName : '_B',
            parentBrandName : 'HLAN6',
            parentCategoryID : 2,
            parentCompanyID : 6, //TActors : 1~(4+3) 
            accountInfo : [{},{
                accountID : 2, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{},{
                accountID : 3, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            },{
                accountID : 4, //1~4:AccountMax
                previousNetMarketPrice : [10,20], //0-Urban, 1-Rural
                latestNetMarketPrice   : [20,25], //0-Urban, 1-Rural
                netMarketPriceChange   : [30,35], //0-Urban, 1-Rural     
            }] 
        }]
    });
    newMR_netMarketPrices.save(function(err) {
        if(!err){
            res.send(200,newMR_netMarketPrices);
            console.log("created new GeneralReport:"+newMR_netMarketPrices);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_netMarketPrices=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_netMarketPrices.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}