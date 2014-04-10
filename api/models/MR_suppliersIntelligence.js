var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_suppliersIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    supplierInfo : [supplierInfoSchema],
})

var supplierInfoSchema = mongoose.Schema({
    supplierID : Number,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~3 
    advertisingOnLine             : Number,
    onLineVisibility              : Number,
    onLineOther                   : Number,
    acquiredTechnologyLevel       : Number,
    acquiredDesignLevel           : Number,
    productionCapacityAvailable   : Number,
    capacityUtilisationRate       : Number,
    productionplanningFlexibility : Number,    
    adverwtisingOffLine            : [Number], //0-Urban, 1-Rural, 2-Total
    actualTradeSupport            : [BMretailerInfoSchema], //BMRetsMax = 3
    negotiatedTradeSupport        : [BMretailerInfoSchema]
})

var BMretailerInfoSchema = mongoose.Schema({
    BMretailerID : Number, //1~3, 1-Retailer1, 2-Retailer2, 3-TraditionalTrade
    value : [Number] //0-Urban, 1-Rural, 2-Total
})

var MR_suppliersIntelligence=mongoose.model('MR_suppliersIntelligence',MR_suppliersIntelligenceSchema);


exports.addMR_suppliersIntelligence=function(req,res,next){
    var newMR_suppliersIntelligence=MR_suppliersIntelligence({
        period : 0,
        seminar : 'MAY',
        supplierInfo : [{
            supplierID : 1,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        },{
            supplierID : 2,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        },{
            supplierID : 3,
            categoryInfo : [{
                categoryID : 1, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 2, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            },{
                categoryID : 3, //1~3 
                advertisingOnLine              : 10,
                onLineVisibility             : 15,
                onLineOther                  : 20,
                acquiredTechnologyLevel       : 25,
                acquiredDesignLevel           : 30,
                productionCapacityAvailable   : 35,
                capacityUtilisationRate       : 40,
                productionplanningFlexibility : 45,    
                advertisingOffLine            : [50,55,60], //0-Urban, 1-Rural, 2-Total
                actualTradeSupport            : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }],
                negotiatedTradeSupport        : [{
                    BMretailerID:1,
                    value:[10,15,20]
                },{
                    BMretailerID:2,
                    value:[20,25,30]
                },{
                    BMretailerID:3,
                    value:[30,35,40]
                }]
            }] 
        }]
    });
    newMR_suppliersIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_suppliersIntelligence);
            console.log("created new GeneralReport:"+newMR_suppliersIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_suppliersIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_suppliersIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}


