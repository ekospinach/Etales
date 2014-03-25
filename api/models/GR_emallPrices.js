var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)
var emallPricesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    variantInfo : [variantInfoSchema]
})

var variantInfoSchema = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
    parentBrandName : String,
    vemp_NetOnlinePrice  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_PriceChange     : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_Promotions      : {
        promo_Frequency : Number, //saved as # of weeks 
        promo_Rate : Number, //saved as a decimal 
    } //TAllProducer : 1~4 (ProsMaxPlus)
})

var emallPrices=mongoose.model('emallPrices',emallPricesSchema);

exports.addEmallPrices=function(req,res,next){
    var newEMallPrices=new emallPrices({
        period:0,
        seminar:'MAY',
        categoryInfo:[{
            categoryID:1,
            variantInfo:[{
                varName : 'ELAN1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        },{
            categoryID:2,
            variantInfo:[{
                varName : 'HTTP1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'HTTP2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'HTTP3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'HTTP',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        },{
            categoryID:3,
            variantInfo:[{
                varName : 'ELAN1',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN2',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            },{
                varName : 'ELAN3',
                varID : 101,
                parentBrandID : 10,
                parentBrandName : 'ELAN',
                vemp_NetOnlinePrice  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_PriceChange     : 2, //TAllProducer : 1~4 (ProsMaxPlus)
                vemp_Promotions      : {
                    promo_Frequency : 30, //range: 0~52
                    promo_Rate : 1 //0~1
                } //TAllProducer : 1~4 (ProsMaxPlus)               
            }]
        }]
    });
    newEMallPrices.save(function(err) {
        if(!err){
            res.send(200,newEMallPrices);
            console.log("created new newEMallPrices:"+newEMallPrices);
        } else {
            res.send(400,"failed.");
        }
    });
}

exports.getEmallPrices=function(req,res,next){
        var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    emallPrices.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}
