var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

// New Schema, 2014-Apr-17:
var RCR_consolidatedProfitAndLossSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)

    //Consolidated Profit & Loss statement, retailers
    rcrpl_Sales                         : [quarterInfoSchema],
    rcrpl_PromotionsCost                : [quarterInfoSchema],
    rcrpl_OtherCompensation             : [quarterInfoSchema],
    rcrpl_NetSales                      : [quarterInfoSchema],
    rcrpl_NetSalesChange                : [quarterInfoSchema],
    rcrpl_CostOfGoodsSold               : [quarterInfoSchema],
    rcrpl_ValueOfQuantityDiscounts      : [quarterInfoSchema],
    rcrpl_ValueOfPerformanceBonus       : [quarterInfoSchema],
    rcrpl_DiscontinuedGoodsCost         : [quarterInfoSchema],
    rcrpl_InventoryHoldingCost          : [quarterInfoSchema],
    rcrpl_GrossProfit                   : [quarterInfoSchema],
    rcrpl_GrossProfitChange             : [quarterInfoSchema],
    rcrpl_GrossProfitMargin             : [quarterInfoSchema],
    rcrpl_GeneralExpenses               : [quarterInfoSchema],
    rcrpl_OperatingProfit               : [quarterInfoSchema],
    rcrpl_OperatingProfitChange         : [quarterInfoSchema],
    rcrpl_OperatingProfitMargin         : [quarterInfoSchema],
    rcrpl_Interest                      : [quarterInfoSchema],
    rcrpl_Taxes                         : [quarterInfoSchema],
    rcrpl_ExceptionalItems              : [quarterInfoSchema],
    rcrpl_NetProfit                     : [quarterInfoSchema],
    rcrpl_NetProfitChange               : [quarterInfoSchema],
    rcrpl_NetProfitMargin               : [quarterInfoSchema],

    //P&L per brand in B&M and onLine
    rcrb_Sales                         : [brandMarketInfoSchema],
    rcrb_PromotionsCost                : [brandMarketInfoSchema],
    rcrb_OtherCompensation             : [brandMarketInfoSchema],
    rcrb_NetSales                      : [brandMarketInfoSchema],
    rcrb_NetSalesChange                : [brandMarketInfoSchema],
    rcrb_NetSalesShareInCategory       : [brandMarketInfoSchema],
    rcrb_CostOfGoodsSold               : [brandMarketInfoSchema],
    rcrb_ValueOfQuantityDiscounts      : [brandMarketInfoSchema],
    rcrb_ValueOfPerformanceBonus       : [brandMarketInfoSchema],
    rcrb_DiscontinuedGoodsCost         : [brandMarketInfoSchema],
    rcrb_InventoryHoldingCost          : [brandMarketInfoSchema],
    rcrb_GrossProfit                   : [brandMarketInfoSchema],
    rcrb_GrossProfitChange             : [brandMarketInfoSchema],
    rcrb_GrossProfitMargin             : [brandMarketInfoSchema],
    rcrb_GrossProfitShareInCategory    : [brandMarketInfoSchema],
    rcrb_GeneralExpenses               : [brandMarketInfoSchema],
    rcrb_OperatingProfit               : [brandMarketInfoSchema],
    rcrb_OperatingProfitChange         : [brandMarketInfoSchema],
    rcrb_OperatingProfitMargin         : [brandMarketInfoSchema],
    rcrb_OperatingProfitShareInCategory: [brandMarketInfoSchema],
    rcrb_Interest                      : [brandMarketInfoSchema],
    rcrb_Taxes                         : [brandMarketInfoSchema],
    rcrb_ExceptionalItems              : [brandMarketInfoSchema],
    rcrb_NetProfit                     : [brandMarketInfoSchema],
    rcrb_NetProfitChange               : [brandMarketInfoSchema],
    rcrb_NetProfitMargin               : [brandMarketInfoSchema],
    rcrb_NetProfitShareInCategory      : [brandMarketInfoSchema],

    ////P&L per variant in B&M and onLine
    rcrv_Sales                         : [variantMarketInfoSchema],
    rcrv_PromotionsCost                : [variantMarketInfoSchema],
    rcrv_OtherCompensation             : [variantMarketInfoSchema],
    rcrv_NetSales                      : [variantMarketInfoSchema],
    rcrv_NetSalesChange                : [variantMarketInfoSchema],
    rcrv_NetSalesShareInCategory       : [variantMarketInfoSchema],
    rcrv_CostOfGoodsSold               : [variantMarketInfoSchema],
    rcrv_ValueOfQuantityDiscounts      : [variantMarketInfoSchema],
    rcrv_ValueOfPerformanceBonus       : [variantMarketInfoSchema],
    rcrv_DiscontinuedGoodsCost         : [variantMarketInfoSchema],
    rcrv_InventoryHoldingCost          : [variantMarketInfoSchema],
    rcrv_GrossProfit                   : [variantMarketInfoSchema],
    rcrv_GrossProfitChange             : [variantMarketInfoSchema],
    rcrv_GrossProfitMargin             : [variantMarketInfoSchema],
    rcrv_GrossProfitShareInCategory    : [variantMarketInfoSchema],
    rcrv_GeneralExpenses               : [variantMarketInfoSchema],
    rcrv_OperatingProfit               : [variantMarketInfoSchema],
    rcrv_OperatingProfitChange         : [variantMarketInfoSchema],
    rcrv_OperatingProfitMargin         : [variantMarketInfoSchema],
    rcrv_OperatingProfitShareInCategory:[variantMarketInfoSchema],
    rcrv_Interest                      : [variantMarketInfoSchema],
    rcrv_Taxes                         : [variantMarketInfoSchema],
    rcrv_ExceptionalItems              : [variantMarketInfoSchema],
    rcrv_NetProfit                     : [variantMarketInfoSchema],
    rcrv_NetProfitChange               : [variantMarketInfoSchema],
    rcrv_NetProfitMargin               : [variantMarketInfoSchema],
    rcrv_NetProfitShareInCategory      : [variantMarketInfoSchema],
})

//Quarter stand for One market - One category
var quarterInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategoriesTotal : 1~3 
    marketID : Number, //TMarketsTotal : 1~3
    value : Number, //0-Urban, 1-Rural, 2-Total
})

var brandMarketInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    marketID                             : Number,  //TMarketsTotal : 1~3  
    value                                : Number
})

var variantMarketInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    marketID                             : Number,  //TMarketsTotal : 1~3      
    value                                : Number, //0-Urban, 1-Rural, 2-Total
})


var RCR_consolidatedProfitAndLoss=mongoose.model('RCR_consolidatedProfitAndLoss',RCR_consolidatedProfitAndLossSchema);

exports.addReports = function(options){
    var deferred = q.defer();
    var startFrom = options.startFrom,
    endWith = options.endWith;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&retailerID=' + options.retailerID
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404||500 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var singleReport = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!singleReport) return; 

          RCR_consolidatedProfitAndLoss.update({seminar    : singleReport.seminar, 
                                            period     : singleReport.period,
                                            retailerID : singleReport.retailerID},
                                {
                                rcrpl_Sales                               : singleReport.rcrpl_Sales,                   
                                rcrpl_PromotionsCost                      : singleReport.rcrpl_PromotionsCost,          
                                rcrpl_OtherCompensation                   : singleReport.rcrpl_OtherCompensation,       
                                rcrpl_NetSales                            : singleReport.rcrpl_NetSales,                
                                rcrpl_NetSalesChange                      : singleReport.rcrpl_NetSalesChange,          
                                rcrpl_CostOfGoodsSold                     : singleReport.rcrpl_CostOfGoodsSold,         
                                rcrpl_ValueOfQuantityDiscounts            : singleReport.rcrpl_ValueOfQuantityDiscounts,
                                rcrpl_ValueOfPerformanceBonus             : singleReport.rcrpl_ValueOfPerformanceBonus, 
                                rcrpl_DiscontinuedGoodsCost               : singleReport.rcrpl_DiscontinuedGoodsCost,   
                                rcrpl_InventoryHoldingCost                : singleReport.rcrpl_InventoryHoldingCost,    
                                rcrpl_GrossProfit                         : singleReport.rcrpl_GrossProfit,             
                                rcrpl_GrossProfitChange                   : singleReport.rcrpl_GrossProfitChange,       
                                rcrpl_GrossProfitMargin                   : singleReport.rcrpl_GrossProfitMargin,       
                                rcrpl_GeneralExpenses                     : singleReport.rcrpl_GeneralExpenses,         
                                rcrpl_OperatingProfit                     : singleReport.rcrpl_OperatingProfit,         
                                rcrpl_OperatingProfitChange               : singleReport.rcrpl_OperatingProfitChange,   
                                rcrpl_OperatingProfitMargin               : singleReport.rcrpl_OperatingProfitMargin,   
                                rcrpl_Interest                            : singleReport.rcrpl_Interest,                
                                rcrpl_Taxes                               : singleReport.rcrpl_Taxes,                   
                                rcrpl_ExceptionalItems                    : singleReport.rcrpl_ExceptionalItems,        
                                rcrpl_NetProfit                           : singleReport.rcrpl_NetProfit,               
                                rcrpl_NetProfitChange                     : singleReport.rcrpl_NetProfitChange,         
                                rcrpl_NetProfitMargin                     : singleReport.rcrpl_NetProfitMargin,         

                                //P&L per brand in B&M and onLine
                                rcrb_Sales                                : singleReport.rcrb_Sales,                              
                                rcrb_PromotionsCost                       : singleReport.rcrb_PromotionsCost,                      
                                rcrb_OtherCompensation                    : singleReport.rcrb_OtherCompensation,                   
                                rcrb_NetSales                             : singleReport.rcrb_NetSales,                            
                                rcrb_NetSalesChange                       : singleReport.rcrb_NetSalesChange,                      
                                rcrb_NetSalesShareInCategory              : singleReport.rcrb_NetSalesShareInCategory,             
                                rcrb_CostOfGoodsSold                      : singleReport.rcrb_CostOfGoodsSold,                     
                                rcrb_ValueOfQuantityDiscounts             : singleReport.rcrb_ValueOfQuantityDiscounts,            
                                rcrb_ValueOfPerformanceBonus              : singleReport.rcrb_ValueOfPerformanceBonus,             
                                rcrb_DiscontinuedGoodsCost                : singleReport.rcrb_DiscontinuedGoodsCost,               
                                rcrb_InventoryHoldingCost                 : singleReport.rcrb_InventoryHoldingCost,                
                                rcrb_GrossProfit                          : singleReport.rcrb_GrossProfit,                         
                                rcrb_GrossProfitChange                    : singleReport.rcrb_GrossProfitChange,                   
                                rcrb_GrossProfitMargin                    : singleReport.rcrb_GrossProfitMargin,                   
                                rcrb_GrossProfitShareInCategory           : singleReport.rcrb_GrossProfitShareInCategory,          
                                rcrb_GeneralExpenses                      : singleReport.rcrb_GeneralExpenses,                     
                                rcrb_OperatingProfit                      : singleReport.rcrb_OperatingProfit,                    
                                rcrb_OperatingProfitChange                : singleReport.rcrb_OperatingProfitChange,               
                                rcrb_OperatingProfitMargin                : singleReport.rcrb_OperatingProfitMargin,               
                                rcrb_OperatingProfitShareInCategory : singleReport.rcrb_OperatingProfitShareInCategory,
                                rcrb_Interest                             : singleReport.rcrb_Interest,                            
                                rcrb_Taxes                                : singleReport.rcrb_Taxes,                               
                                rcrb_ExceptionalItems                     : singleReport.rcrb_ExceptionalItems,                    
                                rcrb_NetProfit                            : singleReport.rcrb_NetProfit,                           
                                rcrb_NetProfitChange                      : singleReport.rcrb_NetProfitChange,                     
                                rcrb_NetProfitMargin                      : singleReport.rcrb_NetProfitMargin,                     
                                rcrb_NetProfitShareInCategory             : singleReport.rcrb_NetProfitShareInCategory,            

                                ////P&L per variant in B&M and onLine
                                rcrv_Sales                                : singleReport.rcrv_Sales,                                
                                rcrv_PromotionsCost                       : singleReport.rcrv_PromotionsCost,                       
                                rcrv_OtherCompensation                    : singleReport.rcrv_OtherCompensation,                    
                                rcrv_NetSales                             : singleReport.rcrv_NetSales,                             
                                rcrv_NetSalesChange                       : singleReport.rcrv_NetSalesChange,                       
                                rcrv_NetSalesShareInCategory              : singleReport.rcrv_NetSalesShareInCategory,              
                                rcrv_CostOfGoodsSold                      : singleReport.rcrv_CostOfGoodsSold,                      
                                rcrv_ValueOfQuantityDiscounts             : singleReport.rcrv_ValueOfQuantityDiscounts,             
                                rcrv_ValueOfPerformanceBonus              : singleReport.rcrv_ValueOfPerformanceBonus,              
                                rcrv_DiscontinuedGoodsCost                : singleReport.rcrv_DiscontinuedGoodsCost,                
                                rcrv_InventoryHoldingCost                 : singleReport.rcrv_InventoryHoldingCost,                 
                                rcrv_GrossProfit                          : singleReport.rcrv_GrossProfit,                          
                                rcrv_GrossProfitChange                    : singleReport.rcrv_GrossProfitChange,                   
                                rcrv_GrossProfitMargin                    : singleReport.rcrv_GrossProfitMargin,                    
                                rcrv_GrossProfitShareInCategory           : singleReport.rcrv_GrossProfitShareInCategory,           
                                rcrv_GeneralExpenses                      : singleReport.rcrv_GeneralExpenses,                      
                                rcrv_OperatingProfit                      : singleReport.rcrv_OperatingProfit,                      
                                rcrv_OperatingProfitChange                : singleReport.rcrv_OperatingProfitChange,                
                                rcrv_OperatingProfitMargin                : singleReport.rcrv_OperatingProfitMargin,                
                                rcrv_OperatingProfitShareInCategory : singleReport. rcrv_OperatingProfitShareInCategory,
                                rcrv_Interest                             : singleReport.rcrv_Interest,                             
                                rcrv_Taxes                                : singleReport.rcrv_Taxes,                                
                                rcrv_ExceptionalItems                     : singleReport.rcrv_ExceptionalItems,                     
                                rcrv_NetProfit                            : singleReport.rcrv_NetProfit,                            
                                rcrv_NetProfitChange                      : singleReport.rcrv_NetProfitChange,                      
                                rcrv_NetProfitMargin                      : singleReport.rcrv_NetProfitMargin,                      
                                rcrv_NetProfitShareInCategory             : singleReport.rcrv_NetProfitShareInCategory,             
                                },
                                {upsert: true},
                                function(err, numberAffected, raw){
                                  if(err) deferred.reject({msg:err, options: options});                                  
                                  currentPeriod--;
                                  if (currentPeriod >= startFrom) {
                                     sendRequest(currentPeriod);
                                  } else {
                                     deferred.resolve({msg: options.schemaName + ' (seminar:' + options.seminar + ', retailer:' + options.retailerID+ ') import done. from period ' + startFrom + ' to ' + endWith, options: options});
                                  }
                                });   

        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom add ' + options.schemaName + ': ' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.addRCR_consolidatedProfitAndLoss=function(req,res,next){
}

exports.getRcrplSales=function(req,res,next){
    var result=0;
    RCR_consolidatedProfitAndLoss.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
           res.send(404,{err:'cannot find the doc'}); 
        }else{
            for(var i=0;i<doc.rcrpl_Sales.length;i++){
                if(doc.rcrpl_Sales[i].categoryID==req.params.categoryID&&doc.rcrpl_Sales[i].marketID==req.params.marketID){
                    result=doc.rcrpl_Sales[i].value;
                    break;
                }
            }
            res.send(200,{'result':result});
            //res.send(200,doc.scrpl_Sales[req.params.categoryID-1][0]);
        }
    })
}

exports.getSalesVolume=function(req,res,next){
    RCR_consolidatedProfitAndLoss.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
            res.send(404,{err:'cannot find the doc'}); 
        }else{
            res.send(200,'2000');
        }
    })
}

exports.getMarketSize=function(req,res,next){
    console.log(req.params.seminar);
    RCR_consolidatedProfitAndLoss.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        retailerID:req.params.retailerID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(!doc){
           res.send(404,{err:'cannot find the doc'}); 
        }else{
            res.send(200,'2000');
        }
    })
}

exports.getRCR_consolidatedProfitAndLoss=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'retailerID':req.params.retailerID
    };
    RCR_consolidatedProfitAndLoss.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

