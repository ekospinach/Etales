var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailersIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerInfo : [retailerInfoSchema],
})

var retailerInfoSchema = mongoose.Schema({
    retailerID : Number, //1~3     
    storeServiceLevel : [String], //0-Urban, 1-Rural,//SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
//    storePerceptionInfo : [storePerceptionInfoSchema],
    onlineAdvertising : [Number], //0-Urban, 1-Rural
    offlineAdvertising : [Number], //0-Urban, 1-Rural
    localAdvertising : [Number],
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    shelfSpace                           : [Number], //0-Urban, 1-Rural
    previousShelfSpace                   : [Number],
    shelfSpaceChange                     : [Number]
})


// var storePerceptionInfoSchema = mongoose.Schema({
//     perception : String, //PRICE, CONVENIENCE, TOTAL
//     onlineAdvertising : Number,
//     offlineAdvertising : Number,
//     localAdvertising : [Number], //0-Urban, 1-Rural               
// })
var MR_retailersIntelligence=mongoose.model('MR_retailersIntelligence',MR_retailersIntelligenceSchema);

exports.addMR_retailersIntelligence=function(req,res,next){
    var newMR_retailersIntelligence=MR_retailersIntelligence({
        period : 0,
        seminar : 'MAY',
        retailerInfo : [{
            retailerID : 1, //1~3     
            storeServiceLevel : ['SL_BASE','SL_ENHANCED'], //0-Urban, 1-Rural
            onlineAdvertising : [10,20], //0-Urban, 1-Rural
            offlineAdvertising : [15,20], //0-Urban, 1-Rural
            localAdvertising : [20,25], //0-Urban, 1-Rural
            variantInfo : [{
                variantName: '_A',
                parentBrandName: 'ELAN1',
                parentCategoryID: 1,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_B',
                parentBrandName: 'HLAN1',
                parentCategoryID: 2,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_C',
                parentBrandName: 'ELAN2',
                parentCategoryID: 1,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_D',
                parentBrandName: 'HLAN2',
                parentCategoryID: 2,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_E',
                parentBrandName: 'ELAN3',
                parentCategoryID: 1,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_F',
                parentBrandName: 'HLAN3',
                parentCategoryID: 2,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_G',
                parentBrandName: 'ELAN5',
                parentCategoryID: 1,
                parentCompanyID: 5, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            },{
                variantName: '_H',
                parentBrandName: 'HLAN5',
                parentCategoryID: 2,
                parentCompanyID: 5, //TActors : 1~(4+3) 
                shelfSpace: [20,30]
            }]
        },{
            retailerID : 2, //1~3     
            storeServiceLevel : ['SL_FAIR','SL_PREMIUM'], //0-Urban, 1-Rural
            onlineAdvertising : [15,25], //0-Urban, 1-Rural
            offlineAdvertising : [20,30], //0-Urban, 1-Rural
            localAdvertising : [30,35], //0-Urban, 1-Rural
            variantInfo : [{
                variantName: '_A',
                parentBrandName: 'ELAN1',
                parentCategoryID: 1,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_C',
                parentBrandName: 'HLAN1',
                parentCategoryID: 2,
                parentCompanyID: 1, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_C',
                parentBrandName: 'ELAN2',
                parentCategoryID: 1,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_E',
                parentBrandName: 'HLAN2',
                parentCategoryID: 2,
                parentCompanyID: 2, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_F',
                parentBrandName: 'ELAN3',
                parentCategoryID: 1,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_F',
                parentBrandName: 'HLAN3',
                parentCategoryID: 2,
                parentCompanyID: 3, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_G',
                parentBrandName: 'ELAN6',
                parentCategoryID: 1,
                parentCompanyID: 6, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            },{
                variantName: '_H',
                parentBrandName: 'HLAN6',
                parentCategoryID: 2,
                parentCompanyID: 6, //TActors : 1~(4+3) 
                shelfSpace: [30,30]
            }]
        },{}]
    });
    newMR_retailersIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_retailersIntelligence);
            console.log("created new GeneralReport:"+newMR_retailersIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailersIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_retailersIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}