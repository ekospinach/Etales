var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var MR_awarenessEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandInfo : [brandInfoSchema],
})

var brandInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, 
    previousAwareness                    : [Number], //0-Urban, 1-Rural
    latestAwareness              : [Number] //0-Urban, 1-Rural
})

var MR_awarenessEvolution=mongoose.model('MR_awarenessEvolution',MR_awarenessEvolutionSchema);

exports.addMR_awarenessEvolution=function(req,res,next){
    var newMR_awarenessEvolution=MR_awarenessEvolution({
        period : 0,
        seminar : 'MAY',
        brandInfo : [{
            brandName: 'ELAN1',
            parentCategoryID: 1,
            parentCompanyID: 1, 
            previousAwareness: [10,20], //0-Urban, 1-Rural
            latestAwareness: [15,25]
        },{
            brandName: 'HLAN1',
            parentCategoryID: 2,
            parentCompanyID: 1, 
            previousAwareness: [10,20], //0-Urban, 1-Rural
            latestAwareness: [15,25]
        },{
            brandName: 'EMOD2',
            parentCategoryID: 1,
            parentCompanyID: 2, 
            previousAwareness: [15,25], //0-Urban, 1-Rural
            latestAwareness: [20,30]
        },{
            brandName: 'HMOD2',
            parentCategoryID: 2,
            parentCompanyID: 2, 
            previousAwareness: [15,25], //0-Urban, 1-Rural
            latestAwareness: [20,30]
        },{
            brandName: 'ETAE3',
            parentCategoryID: 1,
            parentCompanyID: 3, 
            previousAwareness: [10,20], //0-Urban, 1-Rural
            latestAwareness: [15,25]
        },{
            brandName: 'HWAN3',
            parentCategoryID: 2,
            parentCompanyID: 3, 
            previousAwareness: [10,20], //0-Urban, 1-Rural
            latestAwareness: [15,25]
        },{
            brandName: 'ELAN5',
            parentCategoryID: 1,
            parentCompanyID: 5, 
            previousAwareness: [20,30], //0-Urban, 1-Rural
            latestAwareness: [35,45]
        },{
            brandName: 'HSAN5',
            parentCategoryID: 2,
            parentCompanyID: 5, 
            previousAwareness: [15,25], //0-Urban, 1-Rural
            latestAwareness: [20,25]
        },{
            brandName: 'ELAN6',
            parentCategoryID: 1,
            parentCompanyID: 6, 
            previousAwareness: [17,27], //0-Urban, 1-Rural
            latestAwareness: [35,45]
        },{
            brandName: 'HGAN6',
            parentCategoryID: 2,
            parentCompanyID: 6, 
            previousAwareness: [20,30], //0-Urban, 1-Rural
            latestAwareness: [25,35]
        }]
    });
    newMR_awarenessEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_awarenessEvolution);
            console.log("created new GeneralReport:"+newMR_awarenessEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_awarenessEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_awarenessEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
