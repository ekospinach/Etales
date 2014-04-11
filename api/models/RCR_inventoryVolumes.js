var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var RCR_inventoryVolumesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    rcrviv_Initial          : [variantInfoSchema],
    rcrviv_Purchase         : [variantInfoSchema],
    rcrviv_Sales            : [variantInfoSchema],
    rcrviv_Discontinued     : [variantInfoSchema],
    rcrviv_Closing          : [variantInfoSchema]
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    parentCompany  : Number,
    // { use ParentCompany to filter which variants should be displayed.             }
    // { For Retailer 1 allowed set is [1, 2, 3, 5]                                  }
    // { For Retailer 2 allowed set is [1, 2, 3, 6]                                  }
    // { For Retailer 3 allowed set is [1, 2, 3] (no private labels at TT            }
    // { Should Supplier 4 become ACTIVE, then [4] must be added to all allowed sets }
    
    value : [Number], //0-Urban, 1-Rural, 2-Total

})
var RCR_inventoryVolumes=mongoose.model('RCR_inventoryVolumes',RCR_inventoryVolumesSchema);

exports.addRCR_inventoryVolumes=function(req,res,next){
    var newRCR_inventoryVolumes=RCR_inventoryVolumes({
        period : 0,
        seminar : 'MAY',
        retailerID  : 1, //TBMRetailers : 1~3 (BMRetsMax)
        rcrviv_Initial          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'ETAE2',
            parentCategoryID:1,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'ETTO5',
            parentCategoryID:1,
            ParentCompany:5,
            value:[15,25,35]
        },{
            variantName:'_A',
            parentBrandName:'HLEN1',
            parentCategoryID:2,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HEAT2',
            parentCategoryID:2,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'HTTP3',
            parentCategoryID:2,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'HTTO5',
            parentCategoryID:2,
            ParentCompany:5,
            value:[15,25,35]
        }],
        rcrviv_Purchase         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'ETAE2',
            parentCategoryID:1,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'ETTO5',
            parentCategoryID:1,
            ParentCompany:5,
            value:[15,25,35]
        },{
            variantName:'_A',
            parentBrandName:'HLEN1',
            parentCategoryID:2,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HEAT2',
            parentCategoryID:2,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'HTTP3',
            parentCategoryID:2,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'HTTO5',
            parentCategoryID:2,
            ParentCompany:5,
            value:[15,25,35]
        }],
        rcrviv_Sales            : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'ETAE2',
            parentCategoryID:1,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'ETTO5',
            parentCategoryID:1,
            ParentCompany:5,
            value:[15,25,35]
        },{
            variantName:'_A',
            parentBrandName:'HLEN1',
            parentCategoryID:2,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HEAT2',
            parentCategoryID:2,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'HTTP3',
            parentCategoryID:2,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'HTTO5',
            parentCategoryID:2,
            ParentCompany:5,
            value:[15,25,35]
        }],
        rcrviv_Discontinued     : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'ETAE2',
            parentCategoryID:1,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'ETTO5',
            parentCategoryID:1,
            ParentCompany:5,
            value:[15,25,35]
        },{
            variantName:'_A',
            parentBrandName:'HLEN1',
            parentCategoryID:2,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HEAT2',
            parentCategoryID:2,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'HTTP3',
            parentCategoryID:2,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'HTTO5',
            parentCategoryID:2,
            ParentCompany:5,
            value:[15,25,35]
        }],
        rcrviv_Closing          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'ETAE2',
            parentCategoryID:1,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'ETALE3',
            parentCategoryID:1,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'ETTO5',
            parentCategoryID:1,
            ParentCompany:5,
            value:[15,25,35]
        },{
            variantName:'_A',
            parentBrandName:'HLEN1',
            parentCategoryID:2,
            parentCompany:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HEAT2',
            parentCategoryID:2,
            parentCompany:2,
            value:[40,50,60]
        },{
            variantName:'_C',
            parentBrandName:'HTTP3',
            parentCategoryID:2,
            ParentCompany:3,
            value:[55,65,75]
        },{
            variantName:'_D',
            parentBrandName:'HTTO5',
            parentCategoryID:2,
            ParentCompany:5,
            value:[15,25,35]
        }]
    });
    newRCR_inventoryVolumes.save(function(err) {
        if(!err){
            res.send(200,newRCR_inventoryVolumes);
            console.log("created new GeneralReport:"+newRCR_inventoryVolumes);
        } else {
            res.send(400,"failed.");
        }
    }); 
}

exports.getRCR_inventoryVolumes=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'retailerID':req.params.retailerID
    };
    RCR_inventoryVolumes.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
