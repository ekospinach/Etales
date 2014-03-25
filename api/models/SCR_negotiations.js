var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_negotiationsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vnd_QuantityDiscount  : {
        discount_MinimumVolume : [variantInfoSchema],
        discount_Rate          : [variantInfoSchema],
    },
    vnd_TargetBonus       : {
        bonus_TargetVolume : [variantInfoSchema],
        bonus_Rate         : [variantInfoSchema],
        bonus_Value        : [variantInfoSchema],        
    },
    vnd_PaymentTerms      : [variantInfoSchema],
    vnd_OtherCompensation : [variantInfoSchema],
    vnd_ContractHonoured  : [variantInfoSchema]  
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    modernRetailerInfo : [modernRetailerInfoSchema]
})

var modernRetailerInfoSchema = mongoose.Schema({
    modernRetailerID : Number, // 1 or 2
    value : Number,
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
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:30
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:20
                }]
            }],
            discount_Rate          : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:30
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:20
                }]
            }],
        },
        vnd_TargetBonus       : {
            bonus_TargetVolume : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:30
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:20
                }]
            }],
            bonus_Rate         : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:30
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:20
                }]
            }],
            bonus_Value        : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:30
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN1',
                parentCategoryID:2,
                modernRetailerInfo:[{
                    modernRetailerID:1,
                    value:10
                },{
                    modernRetailerID:2,
                    value:20
                }]
            }],        
        },
        vnd_PaymentTerms      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:10
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:10
            },{
                modernRetailerID:2,
                value:20
            }]
        }],
        vnd_OtherCompensation : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:10
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:10
            },{
                modernRetailerID:2,
                value:20
            }]
        }],
        vnd_ContractHonoured  : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:1
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            modernRetailerInfo:[{
                modernRetailerID:1,
                value:1
            },{
                modernRetailerID:2,
                value:0
            }]
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


