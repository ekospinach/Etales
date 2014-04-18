var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)
// New schema, 2014-Apr-17th:
var SCR_negotiationsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vnd_QuantityDiscount  : {
        discount_MinimumVolume : [negotiationDetailsSchema],
        discount_Rate          : [negotiationDetailsSchema],
    },
    vnd_TargetBonus       : {
        bonus_TargetVolume : [negotiationDetailsSchema],
        bonus_Rate         : [negotiationDetailsSchema],
        bonus_Value        : [negotiationDetailsSchema],        
    },
    vnd_PaymentTerms      : [negotiationDetailsSchema],
    vnd_OtherCompensation : [negotiationDetailsSchema],
    vnd_ContractHonoured  : [negotiationDetailsSchema]  
})

var negotiationDetailsSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    modernRetailerID : Number, //1-Retailer 1, 2-Retailer 2
    value : Number
})


var SCR_negotiations=mongoose.model('SCR_negotiations',SCR_negotiationsSchema);

exports.addSCR_negotiations=function(req,res,next){
    var newSCR_negotiations=SCR_negotiations({
        period : 0,
        seminar : 'MAY',
        producerID  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
        vnd_QuantityDiscount  : {
            discount_MinimumVolume : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:1,
                value:10
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:1,
                value:10
            }],
            discount_Rate          : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:1,
                value:10
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:1,
                value:10
            }],
        },
        vnd_TargetBonus       : {
            bonus_TargetVolume : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:1,
                value:10
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:1,
                value:10
            }],
            bonus_Rate         : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:1,
                value:10
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:1,
                value:10
            }],
            bonus_Value        : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:1,
                value:10
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerID:2,
                value:20
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerID:1,
                value:10
            }],        
        },
        vnd_PaymentTerms      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:1,
            value:10
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:2,
            value:20
        },{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:2,
            value:20
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:1,
            value:10
        }],
        vnd_OtherCompensation : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:1,
            value:10
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:2,
            value:20
        },{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:2,
            value:20
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:1,
            value:10
        }],
        vnd_ContractHonoured  : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:1,
            value:1
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:2,
            value:0
        },{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerID:2,
            value:0
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerID:1,
            value:1
        }] 
    });
    newSCR_negotiations.save(function(err) {
        if(!err){
            res.send(200,newSCR_negotiations);
            console.log("created new GeneralReport:"+newSCR_negotiations);
        } else {
            res.send(400,"failed.");
        }
    });  
}

exports.getSCR_negotiations=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    SCR_negotiations.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })  
}


