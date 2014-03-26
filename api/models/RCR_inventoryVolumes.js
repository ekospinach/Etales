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
    rcrviv_Closing          : [variantInfoSchema],
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
