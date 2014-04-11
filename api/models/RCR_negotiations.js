var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var RCR_negotiationsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)

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
    producerInfo : [producerInfoSchema]
})

var producerInfoSchema = mongoose.Schema({
    producerID : Number, 
    // TAllProducers : 1~4
    // Again, the rows for Supplier_4 brands should only be added if he was ACTIVE player 
    value : Number,
})

var RCR_negotiations=mongoose.model('RCR_negotiations',RCR_negotiationsSchema);

exports.addRCR_negotiations=function(req,res,next){
    var newRCR_negotiations=RCR_negotiations({
        period : 0,
        seminar : 'MAY',
        retailerID  : 1,
        vnd_QuantityDiscount  : {
            discount_MinimumVolume : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:1,
                    value:10
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN2',
                parentCategoryID:2,
                producerInfo:[{
                    producerID:2,
                    value:20
                }]
            },{
                variantName:'_C',
                parentBrandName:'ETALE3',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:3,
                    value:30
                }]
            }],
            discount_Rate          : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:1,
                    value:10
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN2',
                parentCategoryID:2,
                producerInfo:[{
                    producerID:2,
                    value:20
                }]
            },{
                variantName:'_C',
                parentBrandName:'ETALE3',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:3,
                    value:30
                }]
            }],
        },
        vnd_TargetBonus       : {
            bonus_TargetVolume : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:1,
                    value:10
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN2',
                parentCategoryID:2,
                producerInfo:[{
                    producerID:2,
                    value:20
                }]
            },{
                variantName:'_C',
                parentBrandName:'ETALE3',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:3,
                    value:30
                }]
            }],
            bonus_Rate         : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:1,
                    value:10
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN2',
                parentCategoryID:2,
                producerInfo:[{
                    producerID:2,
                    value:20
                }]
            },{
                variantName:'_C',
                parentBrandName:'ETALE3',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:3,
                    value:30
                }]
            }],
            bonus_Value        : [{
                variantName:'_A',
                parentBrandName:'ELAN1',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:1,
                    value:10
                }]
            },{
                variantName:'_B',
                parentBrandName:'HLAN2',
                parentCategoryID:2,
                producerInfo:[{
                    producerID:2,
                    value:20
                }]
            },{
                variantName:'_C',
                parentBrandName:'ETALE3',
                parentCategoryID:1,
                producerInfo:[{
                    producerID:3,
                    value:30
                }]
            }]  
        },
        vnd_PaymentTerms      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            producerInfo:[{
                producerID:1,
                value:10
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN2',
            parentCategoryID:2,
            producerInfo:[{
                producerID:2,
                value:20
            }]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            producerInfo:[{
                producerID:3,
                value:30
            }]
        }],
        vnd_OtherCompensation : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            producerInfo:[{
                producerID:1,
                value:10
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN2',
            parentCategoryID:2,
            producerInfo:[{
                producerID:2,
                value:20
            }]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            producerInfo:[{
                producerID:3,
                value:30
            }]
        }],
        vnd_ContractHonoured  : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            producerInfo:[{
                producerID:1,
                value:1
            }]
        },{
            variantName:'_B',
            parentBrandName:'HLAN2',
            parentCategoryID:2,
            producerInfo:[{
                producerID:2,
                value:20
            }]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            producerInfo:[{
                producerID:3,
                value:30
            }]
        }] 
    });
    newRCR_negotiations.save(function(err) {
        if(!err){
            res.send(200,newRCR_negotiations);
            console.log("created new GeneralReport:"+newRCR_negotiations);
        } else {
            res.send(400,"failed.");
        }
    }); 
}

exports.getRCR_negotiations=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'retailerID':req.params.retailerID
    };
    RCR_negotiations.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}


