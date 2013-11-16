var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var brandHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandName : String,
    brandID : Number,
    dateOfBirth : Number, //-4~10
    dateOfDeath : Number, //-4~10
    parentCatID : Number,    
    parentCompanyID : Number, //(1~9)
    
    supplierView : [supplierViewSchema], 
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
})

var supplierViewSchema = mongoose.Schema({
    //b...
    awareness : [Number], //length: TMarketsDetails(1~2)
    socialNetworksScore : [{
        sentiment : Number,
        strength : Number
    }]    //length: TMarketsTotalDetails(1~3)
})

var channelViewSchema = mongoose.Schema({
    visibilityShare : [Number] //length: TMarketsTotalDetails(1~3)
})

var brandHistory = mongoose.model('brandHistory',brandHistoryInfoSchema);

exports.newDoc=function(req,res,next){
    var newDoc=new brandHistory({
        period : 0,
        seminar : "MAY",
        brandName : "EGEND1",
        brandID : 11,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[10,20],
            socialNetworksScore:[{
                sentiment:1,
                strength:1
            }]
        }],
        channelView:[{
            visibilityShare:[2,3,4]
        }]
    },{
        period : 0,
        seminar : "MAY",
        brandName : "EHAYA1",
        brandID : 12,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[20,30],
            socialNetworksScore:[{
                sentiment:2,
                strength:3
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]
    },{
        period : 0,
        seminar : "MAY",
        brandName : "ELAND1",
        brandID : 13,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 1,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[30,40],
            socialNetworksScore:[{
                sentiment:4,
                strength:5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]       
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HEELY1",
        brandID : 11,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[35,45],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]        
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HOTOO1",
        brandID : 12,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[25,35],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]         
    },{
        period : 0,
        seminar : "MAY",
        brandName : "HOLAY1",
        brandID : 13,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentCatID : 2,    
        parentCompanyID : 1, 
        supplierView:[{
            awareness:[55,25],
            socialNetworksScore:[{
                sentiment:4.5,
                strength:5.5
            }]
        }],
        channelView:[{
            visibilityShare:[4,5,6]
        }]        
    });
    newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('brandHistory1 insert');
        res.send(200,'insert success');
    })
}
