var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_inventoryVolumesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrviv_Initial          : [variantInfoSchema],
    scrviv_Production       : [variantInfoSchema],
    scrviv_Sales            : [variantInfoSchema],
    scrviv_Discontinued     : [variantInfoSchema],
    scrviv_Closing          : [variantInfoSchema]
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})
var SCR_inventoryVolumes=mongoose.model('SCR_inventoryVolumes',SCR_inventoryVolumesSchema);

exports.addSCR_inventoryVolumes=function(req,res,next){
    var newSCR_inventoryVolumes=SCR_inventoryVolumes({
        period : 0,
        seminar : 'MAY',
        producerID  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
        scrviv_Initial          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrviv_Production       : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrviv_Sales            : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrviv_Discontinued     : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrviv_Closing          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }]
    });
    newSCR_inventoryVolumes.save(function(err) {
        if(!err){
            res.send(200,newSCR_inventoryVolumes);
            console.log("created new GeneralReport:"+newSCR_inventoryVolumes);
        } else {
            res.send(400,"failed.");
        }
    });  
}

exports.getSCR_inventoryVolumes=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    SCR_inventoryVolumes.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })  
}
