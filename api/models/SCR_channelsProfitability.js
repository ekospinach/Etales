var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_channelsProfitabilitySchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrcp_VolumeOrdered    : [categoryInfoSchema],
    scrcp_VolumeSold       : [categoryInfoSchema],
    scrcp_VolumeSoldShare  : [categoryInfoSchema],
    scrcp_SalesValue       : [categoryInfoSchema],
    scrcp_SalesValueShare  : [categoryInfoSchema],
    scrcp_CostOfGoodsSold  : [categoryInfoSchema],
    scrcp_TradeSupport     : [categoryInfoSchema],
    scrcp_TradeProfit      : [categoryInfoSchema],
    scrcp_TradeProfitShare : [categoryInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,  //TCategoriesTotal : 1~3 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketsTotal : 1~3
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //TAccounts : 1~ 4, Two Modern Retailers + Traditional Trade + On-Line 
    value : Number,
})

var SCR_channelsProfitability=mongoose.model('SCR_channelsProfitability',SCR_channelsProfitabilitySchema);

exports.addSCR_channelsProfitability=function(req,res,next){
    var newSCR_channelsProfitability=SCR_channelsProfitability({
        period : 0,
        seminar : 'MAY',
        producerID  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
        scrcp_VolumeOrdered    : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_VolumeSold       : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_VolumeSoldShare  : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_SalesValue       : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_SalesValueShare  : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_CostOfGoodsSold  : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_TradeSupport     : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_TradeProfit      : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }],
        scrcp_TradeProfitShare : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:2,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            },{
                marketID:3,
                accountInfo:[{
                    accountID:1,
                    value:10
                },{
                    accountID:2,
                    value:20
                },{
                    accountID:3,
                    value:30
                },{
                    accountID:4,
                    value:40
                }]
            }]
        }]
    });
    newSCR_channelsProfitability.save(function(err) {
        if(!err){
            res.send(200,newSCR_channelsProfitability);
            console.log("created new GeneralReport:"+newSCR_channelsProfitability);
        } else {
            res.send(400,"failed.");
        }
    });  
}

exports.getSCR_channelsProfitability=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    SCR_channelsProfitability.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })  
}

