var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailerPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    storeInfo : [storeInfoSchema],
})

var storeInfoSchema = mongoose.Schema({
    storeID : Number, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //1-Urban, 2-Rural
    previousPerception                   : [Number], //0-Price, 1-Convenience
    latestPerception                     : [Number], //0-Price, 1-Convenience
    perceptionChange                     : [Number]  //0-Price, 1-Convenience    
})

//New Schema
// var MR_retailerPerceptionEvolutionSchema = mongoose.Schema({
//     period : Number,
//     seminar : String,
//     storeInfo : [storePerceptionInfoSchema],
// })

// var storePerceptionInfoSchema = mongoose.Schema({
//     storeID : Number, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
//     marketID : Number, //1-Urban, 2-Rural
//     previousPerception                   : [Number], //0-Price, 1-Convenience
//     latestPerception                     : [Number], //0-Price, 1-Convenience
//     perceptionChange                     : [Number]  //0-Price, 1-Convenience    
// })

var MR_retailerPerceptionEvolution=mongoose.model('MR_retailerPerceptionEvolution',MR_retailerPerceptionEvolutionSchema);

exports.addMR_retailerPerceptionEvolution=function(req,res,next){
    var newMR_retailerPerceptionEvolution=MR_retailerPerceptionEvolution({
        period : 0,
        seminar : 'MAY',
        storeInfo : [{
            storeID : 1, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [10,15], //0-Price, 1-Convenience
                latestPerception : [15,20], //0-Price, 1-Convenience
                perceptionChange : [20,25]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [7,10], //0-Price, 1-Convenience
                latestPerception : [8,11], //0-Price, 1-Convenience
                perceptionChange : [9,13]  
            }]
        },{
            storeID : 2, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [12,13], //0-Price, 1-Convenience
                latestPerception : [13,14], //0-Price, 1-Convenience
                perceptionChange : [14,15]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [17,18], //0-Price, 1-Convenience
                latestPerception : [18,19], //0-Price, 1-Convenience
                perceptionChange : [19,20]  
            }]
        },{
            storeID : 3, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [12,15], //0-Price, 1-Convenience
                latestPerception : [15,18], //0-Price, 1-Convenience
                perceptionChange : [18,21]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [17,10], //0-Price, 1-Convenience
                latestPerception : [10,3], //0-Price, 1-Convenience
                perceptionChange : [9,2]  
            }]
        },{
            storeID : 4, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [10,12], //0-Price, 1-Convenience
                latestPerception : [12,14], //0-Price, 1-Convenience
                perceptionChange : [14,16]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [8,10], //0-Price, 1-Convenience
                latestPerception : [10,12], //0-Price, 1-Convenience
                perceptionChange : [12,15]  
            }]
        },{
            storeID : 5, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [20,22], //0-Price, 1-Convenience
                latestPerception : [22,24], //0-Price, 1-Convenience
                perceptionChange : [24,26]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [23,35], //0-Price, 1-Convenience
                latestPerception : [25,34], //0-Price, 1-Convenience
                perceptionChange : [30,36]  
            }]
        },{
            storeID : 6, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [26,30], //0-Price, 1-Convenience
                latestPerception : [26,35], //0-Price, 1-Convenience
                perceptionChange : [17,25]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [27,30], //0-Price, 1-Convenience
                latestPerception : [28,31], //0-Price, 1-Convenience
                perceptionChange : [39,32]  
            }]
        },{
            storeID : 7, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
            marketInfo : [{
                marketID : 1, //1-Urban, 2-Rural
                previousPerception : [16,35], //0-Price, 1-Convenience
                latestPerception : [25,40], //0-Price, 1-Convenience
                perceptionChange : [27,55]  
            },{
                marketID : 2, //1-Urban, 2-Rural
                previousPerception : [27,50], //0-Price, 1-Convenience
                latestPerception : [30,61], //0-Price, 1-Convenience
                perceptionChange : [29,34]  
            }]
        }]
    });
    newMR_retailerPerceptionEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_retailerPerceptionEvolution);
            console.log("created new GeneralReport:"+newMR_retailerPerceptionEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailerPerceptionEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_retailerPerceptionEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}