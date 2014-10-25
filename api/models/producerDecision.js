var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore');
    request = require('request');
    q = require('q');

var proVarDecisionSchema = mongoose.Schema({
    varName : String,
    varID : Number, //varID = BrandID * 10 + varCount
    parentBrandID : Number, //brandID
    packFormat : String, //ECONOMY, STANDARD, PREMIUM
    dateOfBirth : Number,
    dateOfDeath : Number,
    composition : [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    discontinue : Boolean,
    production : Number,
    currentPriceBM : Number,
    //nextPriceBM : Number,

    //Modified by Hao, 2014-Apr-23
    // currentPriceEmall : Number,
    // nextPriceEmall : Number,
    onlinePrice : Number,
    onlinePlannedVolume : Number,
    pricePromotions : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1        
    },
    //update by Hao, 2014-July-14
    // 0.0 means full preference for off-line shipments (B&M retailers) and 1.0 is for full preference for on-line sales
    // Anything between, will make a proportional effect. 
    channelPreference : Number //0~1
})

var proBrandDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,   
    /*
        case 'P': brandID = (10 * userCount) + brandCount
        case 'R': brandID = (10 * (userCount +4)) + brandCount
        userCount = 1~4
        brandCount = 1~5
    */
    parentCompanyID : Number, //TBrandOwners(Prod_1_ID~Ret_2_ID)
    /*
        Prod_1_ID          = 1;
        Prod_2_ID          = 2;
        Prod_3_ID          = 3;
        Prod_4_ID          = 4;
        Ret_1_ID           = 5;
        Ret_2_ID           = 6;
        TradTrade_ID       = 7;
        E_Mall_ID          = 8;
        Admin_ID           = 9;x
    */
    dateOfBirth : Number, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
    dateOfDeath : Number, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
    advertisingOffLine : [Number], //TMarketDetails, 1-Urban, 2-Rural
    advertisingOnLine : Number,
    supportEmall : Number,
    supportTraditionalTrade : [Number], //TMarketDetails, 1-Urban, 2-Rural
    proVarDecision : [proVarDecisionSchema] //Length: TOneBrandVars(1~3)
})

var proCatDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    capacityChange : Number,
    investInDesign : Number,/*E*/
    investInProductionFlexibility : Number,
    investInTechnology : Number,
    proBrandsDecision : [proBrandDecisionSchema] //Length: TProBrands(1~5) 
})

var proDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    producerID : Number, //1~4
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    proCatDecision : [proCatDecisionSchema], //Length: TCategories(1~2)    
    marketResearchOrder : [Boolean]
})

exports.proDecision = proDecision = mongoose.model('proDecision', proDecisionSchema);
var proDecision = mongoose.model('proDecision', proDecisionSchema);
var proVarDecision=mongoose.model('proVarDecision',proVarDecisionSchema);
var proBrandsDecision=mongoose.model('proBrandsDecision',proBrandDecisionSchema)


// exports.getProductsByAdmin =function(seminar,period,producerID){
//     console.log('seminar:'+seminar+'period:'+period+'producerID:'+producerID);
//     var products=new Array();
//     proDecision.findOne({
//         seminar: seminar,
//         period: period,
//         producerID: producerID
//     }, function(err, doc) {
//         //console.log(doc);
//         for(var i=0;i<doc.proCatDecision.length;i++){
//             for(var j=0;j<doc.proCatDecision[i].proBrandsDecision.length;j++){
//                 for(var k=0;k<doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length;k++){
//                     if(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName!=""){
//                         products.push(doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k]);
//                     }
//                 }
//             }
//         }
//     })
// }


exports.getProducerReportOrder = function(seminar,period,producerID){
    var deferred = q.defer();

    proDecision.findOne({
        seminar:seminar,
        period:period,
        producerID:producerID
    },function(err,doc){
        if(err){
            deferred.reject({
                msg: err
            });
        }
        if(!doc){
            deferred.reject({
                msg: 'cannot find matched doc. ' + 'producerID:' +producerID + '/seminar:' + seminar + '/period:' +period
            });
        }
        else{
            deferred.resolve(doc.marketResearchOrder);
        }
    });

    return deferred.promise;
}

exports.exportToBinary = function(options) {
    var deferred = q.defer();
    var period = options.period;

    proDecision.findOne({
            seminar: options.seminar,
            period: options.period,
            producerID: options.producerID
        },
        function(err, doc) {
            if (err) deferred.reject({
                msg: err,
                options: options
            });
            if (!doc) {
                deferred.reject({
                    msg: 'Export to binary, cannot find matched doc. ' + 'producerID:' + options.producerID + '/seminar:' + options.seminar + '/period:' + options.period
                });
            } else {
                //console.log(JSON.stringify(doc));
                request.post('http://' + options.cgiHost + ':' + options.cgiPort + options.cgiPath, {
                    form: {
                        jsonData: JSON.stringify(doc)
                    }
                }, function(error, response) {
                    console.log('status:' + response.status);
                    console.log('body:' + response.body);
                    if (response.status === (500 || 404)) {
                        deferred.reject({
                            msg: 'Failed to export binary, get 500 from CGI server(POST action):' + JSON.stringify(options)
                        });
                    } else {
                        deferred.resolve({
                            msg: 'Export binary done, producer: ' + options.producerID + ', period: ' + options.period
                        });
                    }
                });
            }
        });
    return deferred.promise;
}

exports.addProducerDecisions = function(options) {
    var deferred = q.defer();
    var startFrom = options.startFrom,
        endWith = options.endWith;

    (function sendRequest(currentPeriod) {
        var reqOptions = {
            hostname: options.cgiHost,
            port: options.cgiPort,
            path: options.cgiPath + '?period=' + currentPeriod + '&seminar=' + options.seminar + '&producerID=' + options.producerID
        };

        http.get(reqOptions, function(response) {
            var data = '';
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                data += chunk;
            }).on('end', function() {
                //ask Oleg to fix here, should return 404 when result beyound the existed period.
                //console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
                if (response.statusCode === (404 || 500))
                    deferred.reject({
                        msg: 'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)
                    });
                else {
                    try {
                        var singleDecision = JSON.parse(data);
                    } catch (e) {
                        deferred.reject({
                            msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data,
                            options: options
                        });
                    }
                }
                if (!singleDecision) return;
                // console.log(util.inspect(singleDecision, {depth:null}));
                proDecision.update({
                        seminar: singleDecision.seminar,
                        period: singleDecision.period,
                        producerID: singleDecision.producerID
                    }, {
                        nextBudgetExtension: singleDecision.nextBudgetExtension,
                        approvedBudgetExtension: singleDecision.approvedBudgetExtension,
                        marketResearchOrder : singleDecision.marketResearchOrder,
                        proCatDecision: singleDecision.proCatDecision
                    }, {
                        upsert: true
                    },
                    function(err, numberAffected, raw) {
                        if (err) deferred.reject({
                            msg: err,
                            options: options
                        });
                        currentPeriod--;
                        if (currentPeriod >= startFrom) {
                            sendRequest(currentPeriod);
                        } else {
                            deferred.resolve({
                                msg: 'producerDecision(producer:' + options.producerID + ', seminar:' + options.seminar + ') import done. from period ' + startFrom + ' to ' + endWith,
                                options: options
                            });
                        }
                    });
            });
        }).on('error', function(e) {
            deferred.reject({
                msg: 'errorFrom addProducerDecisions:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),
                options: options
            });
        });
    })(endWith);

    return deferred.promise;
}

exports.getReportPurchaseStatus = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        } else {
            if (!doc) {
                res.send(404, 'Cannot find matched producer decision doc.');
            } else {
                res.send(200, doc.marketResearchOrder);
            }
        }
    });
}

exports.updateProducerDecision = function(io) {
    return function(req, res, next) {
        var queryCondition = {
            seminar: req.body.seminar,
            period: req.body.period,
            producerID: req.body.producerID,
            behaviour: req.body.behaviour,
            /* 
        - step 1&2
        addProductNewBrand : categoryID
        deleteProduct : categoryID,brandName,varName
        deleteBrand : categoryID,brandName
        updateVariant : categoryID,brandName,varName,location,value[,additionalIdx]
        addProdcutExistedBrand : categoryID,brandName
        
        - step 3
        updateBrand : categoryID,brandName,varName,location,value[,additionalIdx]

        - step 4
        updateCategory : category,location,value

        - MarketResearchOrders
        updateMarketResearchOrders : additionalIdx value
        */
            categoryID: req.body.categoryID,
            brandName: req.body.brandName,
            varName: req.body.varName,
            location: req.body.location,
            additionalIdx: req.body.additionalIdx,
            value: req.body.value
        }

        //console.log(queryCondition);

        proDecision.findOne({
                seminar: queryCondition.seminar,
                period: queryCondition.period,
                producerID: queryCondition.producerID
            },
            function(err, doc) {
                if (err) {
                    next(new Error(err));
                }
                if (!doc) {
                    console.log('cannot find matched doc...');
                    res.send(404, 'Cannot find matched producer decision doc...');
                } else {
                    var isUpdated = true;
                    var index = 0;
                    switch (queryCondition.behaviour) {
                        case 'addProductNewBrand':
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID == 0) {
                                            doc.proCatDecision[i].proBrandsDecision.splice(j, 1, queryCondition.value);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            };
                            break;
                        case 'addProductExistedBrand':
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                if (doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k] != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID == 0) {
                                                    doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.splice(k, 1, queryCondition.value);
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            };
                            break;
                        case 'deleteProduct':
                            var nullVarDecision = new proVarDecision();
                            nullVarDecision.packFormat = "";
                            nullVarDecision.dateOfBirth = 0;
                            nullVarDecision.dateOfDeath = 0;
                            nullVarDecision.composition = new Array(0, 0, 0);
                            nullVarDecision.production = 0;
                            nullVarDecision.currentPriceBM = 0;
                            //nullVarDecision.currentPriceEmall=0;
                            nullVarDecision.discontinue = false;
                            nullVarDecision.nextPriceBM = 0;
                            //nullVarDecision.nextPriceEmall=0;
                            nullVarDecision.parentBrandID = 0;
                            nullVarDecision.varName = ""; /*need check*/
                            nullVarDecision.varID = 0; /*need check*/
                            nullVarDecision.onlinePrice = 0;
                            nullVarDecision.onlinePlannedVolume = 0;
                            nullVarDecision.pricePromotions = {
                                promo_Frequency: 0, //range: 0~52
                                promo_Rate: 0 //0~1        
                            };
                            var nullBrandDecision = new proBrandsDecision();
                            nullBrandDecision.brandID = 0;
                            nullBrandDecision.brandName = "",

                            nullBrandDecision.parentCompanyID = 0,
                            nullBrandDecision.dateOfBirth = 0,
                            nullBrandDecision.dateOfDeath = 0,
                            nullBrandDecision.advertisingOffLine = [0, 0],
                            nullBrandDecision.advertisingOnLine = 0,
                            nullBrandDecision.supportEmall = 0,
                            nullBrandDecision.supportTraditionalTrade = new Array(0, 0, 0),
                            nullBrandDecision.proVarDecision = new Array();
                            nullBrandDecision.proVarDecision.push(nullVarDecision, nullVarDecision, nullVarDecision);
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                if (doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k] != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName == queryCondition.varName) {
                                                    index = k;
                                                    doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.splice(k, 1, nullVarDecision);
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                            var count = 0;
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                if (doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k] != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID != 0) {
                                                    count++;
                                                }
                                            }
                                            if (count == 0) {
                                                index = -1;
                                                doc.proCatDecision[i].proBrandsDecision.splice(j, 1, nullBrandDecision);
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        case 'deleteBrand':
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            delete doc.proCatDecision[i].proBrandsDecision[j]; //set undefined 
                                        }
                                    };
                                }
                            };
                            break;
                        case 'updateVariant':
                            console.log('update Variant');
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                                if (doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k] != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID != undefined && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName == queryCondition.varName) {
                                                    if (queryCondition.location == "packFormat") {
                                                        switch (queryCondition.value) {
                                                            case 1:
                                                                queryCondition.value = "ECONOMY";
                                                                break;
                                                            case 2:
                                                                queryCondition.value = "STANDARD";
                                                                break;
                                                            case 3:
                                                                queryCondition.value = "PREMIUM";
                                                                break;
                                                        }
                                                        doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].packFormat = queryCondition.value;
                                                    } else if (queryCondition.location == "composition") {
                                                        doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][queryCondition.location][queryCondition.additionalIdx] = queryCondition.value;
                                                    } else if (queryCondition.location == "pricePromotions") {
                                                        if (queryCondition.additionalIdx == 0) {
                                                            doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Frequency = queryCondition.value;
                                                        } else {
                                                            doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate = queryCondition.value;
                                                        }
                                                    } else {
                                                        doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][queryCondition.location] = queryCondition.value;

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case 'updateBrand':
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                                        if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && doc.proCatDecision[i].proBrandsDecision[j].brandName == queryCondition.brandName) {
                                            console.log(doc.proCatDecision[i].proBrandsDecision[j].brandName);
                                            if (queryCondition.location == "supportTraditionalTrade" || queryCondition.location == "advertisingOffLine") {
                                                doc.proCatDecision[i].proBrandsDecision[j][queryCondition.location][queryCondition.additionalIdx] = queryCondition.value;
                                            } else {
                                                doc.proCatDecision[i].proBrandsDecision[j][queryCondition.location] = queryCondition.value;
                                            }
                                        }
                                    };
                                }
                            };
                            break;
                        case 'updateCategory':
                            for (var i = 0; i < doc.proCatDecision.length; i++) {
                                if (doc.proCatDecision[i].categoryID == queryCondition.categoryID) {
                                    doc.proCatDecision[i][queryCondition.location] = queryCondition.value;
                                }
                            };
                            break;
                        case 'updateMarketResearchOrders':
                            doc.marketResearchOrder[queryCondition.additionalIdx] = queryCondition.value;
                            break;
                        default:
                            isUpdated = false;
                            res.send(404, 'cannot find matched query behaviour:' + queryCondition.behaviour);
                            break;
                    }

                    if (isUpdated) {
                        doc.markModified('proCatDecision');
                        doc.markModified('composition');
                        doc.markModified('proVarDecision');
                        doc.markModified('advertisingOffLine');
                        doc.markModified('supportTraditionalTrade');
                        doc.markModified('marketResearchOrder');
                        doc.markModified('proBrandsDecision');
                        doc.save(function(err, doc, numberAffected) {
                            if (err) next(new Error(err));
                            console.log('save updated, number affected:' + numberAffected);
                            // if (queryCondition.behaviour == "updateMarketResearchOrders") {
                            //     io.sockets.emit('socketIO:supplierMarketResearchOrdersChanged', {
                            //         period: queryCondition.period,
                            //         seminar: queryCondition.seminar,
                            //         producerID: queryCondition.producerID
                            //     });
                            // } else {
                            //     io.sockets.emit('socketIO:producerBaseChanged', {
                            //         period: queryCondition.period,
                            //         producerID: queryCondition.producerID,
                            //         seminar: queryCondition.seminar,
                            //         behaviour:queryCondition.behaviour
                            //     });
                            // }
                            io.sockets.emit('socketIO:producerBaseChanged', {
                                period: queryCondition.period,
                                producerID: queryCondition.producerID,
                                seminar: queryCondition.seminar,
                                page:req.body.page
                            });
                            if (queryCondition.behaviour == "deleteProduct") {
                                res.send(200, {
                                    index: index
                                });
                            } else {
                                res.send(200, 'mission complete!');
                            }
                        });

                    }
                }

            });
    }
}

exports.getAllProducerDecision = function(req, res, next) {
    /*P_1*/
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        } else {
            if (!doc) {
                res.send(404, 'Cannot find matched producer decision doc.');
            } else {
                res.header("Content-Type", "application/json; charset=UTF-8");
                res.statusCode = 200;
                res.send(doc);
            }
        }
    });
}

//retailer get producerDecision about var
exports.retailerGetProducerDecision = function(req, res, next) {
    var result = new Array();
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, 'cannot find the decision');
        } else {
            var categoryID = 0;
            if (req.params.brandName.substring(0, 1) == "E") {
                categoryID = 1;
            } else {
                categoryID = 2;
            }
            for (var i = 0; i < doc.proCatDecision[categoryID - 1].proBrandsDecision.length; i++) {
                if (doc.proCatDecision[categoryID - 1].proBrandsDecision[i].brandID != undefined && doc.proCatDecision[categoryID - 1].proBrandsDecision[i].brandID != 0 && doc.proCatDecision[categoryID - 1].proBrandsDecision[i].brandName == req.params.brandName) {
                    for (var j = 0; j < doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision.length; j++) {
                        if (doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].varID != undefined && doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].varID != 0 && doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].varName == req.params.varName) {
                            result.push({
                                'composition': doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].composition,
                                'currentPriceBM': doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].currentPriceBM,
                                //'currentPriceEmall':doc.proCatDecision[categoryID-1].proBrandsDecision[i].proVarDecision[j].currentPriceEmall,
                                'nextPriceBM': doc.proCatDecision[categoryID - 1].proBrandsDecision[i].proVarDecision[j].nextPriceBM
                            });
                            break;
                        }
                    }
                    break;
                }
            }
            res.header("Content-Type", "application/json; charset=UTF-8");
            res.statusCode = 200;
            res.send(result);
        }
    })
}

exports.getProducerProductList = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            console.log('cannot find matched doc...');
            res.send(404, {
                error: 'Cannot find matched doc...'
            });
        } else {
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == req.params.categoryID);
            });
            var products = new Array();
            var count = 0;
            for (var i = 0; i < allProCatDecisions.length; i++) {
                for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    if (allProCatDecisions[i].proBrandsDecision[j] != undefined && allProCatDecisions[i].proBrandsDecision[j].brandID != undefined && allProCatDecisions[i].proBrandsDecision[j].brandID != 0) {
                        for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                            //edit for contract maybe have a bug
                            if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k] != undefined && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != undefined) {
                                //if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0){
                                products.push({
                                    'categoryID': req.params.categoryID,
                                    'brandName': allProCatDecisions[i].proBrandsDecision[j].brandName,
                                    'varName': allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName,
                                    'brandID': allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].parentBrandID,
                                    'varID': allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID,
                                    'parentName': 'Producer ' + req.params.producerID,
                                    'dateOfBirth': allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].dateOfBirth,
                                    'dateOfDeath': allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].dateOfDeath
                                });
                                count++;
                            }
                        }
                    }
                }
            }
            if (count != 0) {
                res.header("Content-Type", "application/json; charset=UTF-8");
                res.statusCode = 200;
                res.send(products);
            }
        }
    });
}

exports.getProductionResult = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var categoryID = 0;
            if (req.params.brandName.substring(0, 1) == "E") {
                categoryID = 1;
            } else {
                categoryID = 2;
            }
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == categoryID);
            });
            var result = 0;
            for (var i = 0; i < allProCatDecisions.length; i++) {
                for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                        if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName != "") {
                            result += allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].production;
                        }
                    }
                }
            }
            if (req.params.brandName != "brandName" && req.params.varName != "varName") {
                for (var i = 0; i < allProCatDecisions.length; i++) {
                    for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                        if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                            for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName == req.params.varName) {
                                    result -= allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].production;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            res.send(200, {
                result: result
            });
        }
    })
}

exports.getProducerExpend = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var result = 0;
            for (var i = 0; i < doc.proCatDecision.length; i++) {
                for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                    if (doc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && doc.proCatDecision[i].proBrandsDecision[j].brandName != "") {
                        result += (
                            doc.proCatDecision[i].proBrandsDecision[j].advertisingOffLine[0] +
                            doc.proCatDecision[i].proBrandsDecision[j].advertisingOffLine[1] +
                            doc.proCatDecision[i].proBrandsDecision[j].advertisingOnLine +
                            doc.proCatDecision[i].proBrandsDecision[j].supportEmall +
                            doc.proCatDecision[i].proBrandsDecision[j].supportTraditionalTrade[0] +
                            doc.proCatDecision[i].proBrandsDecision[j].supportTraditionalTrade[1]
                        );
                    }
                }
            }
            if (req.params.brandName == "brandName") {
                res.send(200, {
                    result: result
                });
            } else {
                if (req.params.brandName.substring(0, 1) == "E") {
                    categoryID = 1;
                } else {
                    categoryID = 2;
                }
                var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                    return (obj.categoryID == categoryID);
                });
                for (var i = 0; i < allProCatDecisions.length; i++) {
                    for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                        if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                            if (req.params.location == "advertisingOffLine" || req.params.location == "supportTraditionalTrade") {
                                result -= allProCatDecisions[i].proBrandsDecision[j][req.params.location][req.params.additionalIdx];
                            } else {
                                result -= allProCatDecisions[i].proBrandsDecision[j][req.params.location];
                            }
                            break;
                        }
                    }
                }
                res.send(200, {
                    result: result
                });
            }
        }
    })
}


//Marketing Spending includes:
//1 - General Marketing - Advertising
//2 - Market Research 
exports.getMarketingSpending = function(req, res, next) {
    q.all([
        proDecision.findOne({seminar: req.params.seminar, period: req.params.period, producerID: req.params.producerID}).exec(),
        require('./BG_oneQuarterExogenousData.js').oneQuarterExogenousData.findOne({seminar:req.params.seminar, period:req.params.period, categoryID:1,marketID:1}).exec(),        
        exports.getProducerReportOrder(req.params.seminar,req.params.period,req.params.producerID)
    ]).spread(function(decisionDoc, quarterExogenousDoc, producerOrderDecision){
            var result = 0;
            for (var i = 0; i < decisionDoc.proCatDecision.length; i++) {
                for (var j = 0; j < decisionDoc.proCatDecision[i].proBrandsDecision.length; j++) {
                    if (decisionDoc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && decisionDoc.proCatDecision[i].proBrandsDecision[j].brandName != "") {
                        result += (
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].advertisingOffLine[0] +
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].advertisingOffLine[1] +
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].advertisingOnLine
                        );
                    }
                }
            }
            for(var i = 0; i < producerOrderDecision.length; i++){
                if(producerOrderDecision[i]){
                    result += quarterExogenousDoc.MarketStudiesPrices[i]
                }
            }            
            res.send(200, {
                result: result
            });     

    }).fail(function(err){
        next(new Error(err));
    }).done();
}

//Trade Support Spending
//1 - General Marketing - Traditional Trade Support 
//TODO: 2 - All the cost happen in page "Online Store management" AKA Visibility + Promotion Cost
//3 - All the Negotiation Cost
exports.getTradeSupportSpending = function(req, res, next) {
    q.all([
        proDecision.findOne({seminar: req.params.seminar, period: req.params.period, producerID: req.params.producerID}).exec(),
        require('./contract.js').calculateProducerNegotiationCost(req.params.seminar, req.params.producerID, req.params.period,'brandName','varName','ingoreItemNull',0)
    ]).spread(function(decisionDoc, producerNegotiationCost){
            var result = 0;
            for (var i = 0; i < decisionDoc.proCatDecision.length; i++) {
                for (var j = 0; j < decisionDoc.proCatDecision[i].proBrandsDecision.length; j++) {
                    if (decisionDoc.proCatDecision[i].proBrandsDecision[j].brandID != 0 && decisionDoc.proCatDecision[i].proBrandsDecision[j].brandName != "") {
                        result += (
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].supportEmall +
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].supportTraditionalTrade[0] +
                            decisionDoc.proCatDecision[i].proBrandsDecision[j].supportTraditionalTrade[1]
                        );
                    }
                }
            }

            result += producerNegotiationCost.result;
            res.send(200, {
                result: result
            });     

    }).fail(function(err){
        next(new Error(err));
    }).done();

}

exports.getProducerCurrentDecision = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var categoryID = 0,
                result = 0;
            if (req.params.brandName.substring(0, 1) == "E") {
                categoryID = 1;
            } else {
                categoryID = 2;
            }
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == categoryID);
            });
            for (var i = 0; i < allProCatDecisions.length; i++) {
                for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                        for (k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                            if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName == req.params.varName) {
                                result = 1;
                                res.send(200, allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
                                break;
                            } else {
                                result = 0;
                            }
                        }
                        break;
                    }
                }
            }
            if (result == 0) {
                res.send(404, 'cannot find the variant');
            }
        }
    })
}

exports.getProducerVariantBM = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var result = 0,
                count = 0;
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == req.params.categoryID);
            });
            for (var i = 0; i < allProCatDecisions.length; i++) {
                for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                        for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                            if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName == req.params.varName) {
                                result = allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].currentPriceBM;
                                count++;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            if (count != 0) {
                res.send(200, {
                    result: result
                });
            } else {
                res.send(404, {
                    result: 'BM price for this product has not been decided.'
                });
            }
        }
    })
}
exports.getProductInfo = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var categoryID = 0;
            if (req.params.brandName.substring(0, 1) == "E") {
                categoryID = 1;
            } else {
                categoryID = 2;
            }
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == categoryID);
            });
            var count = 0;
            for (i = 0; i < allProCatDecisions.length; i++) {
                for (j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                        count++;
                        res.send(200, allProCatDecisions[i].proBrandsDecision[j].proVarDecision);
                        break;
                    }
                }
            }
            if (count == 0) {
                res.send(404, {
                    err: 'cannot find the brand'
                });
            }
        }
    })
}

exports.checkProducerProduct = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == req.params.categoryID);
            });
            if (req.params.checkType == "brand") {
                var count = 0,
                    result = 0;
                for (var i = 0; i < allProCatDecisions.length; i++) {
                    for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                        if (allProCatDecisions[i].proBrandsDecision[j].brandName != "" && allProCatDecisions[i].proBrandsDecision[j].brandID != 0) {
                            count++;
                            if (allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                                result++;
                            }
                        }
                    }
                }
                if (count >= 5) {
                    res.send(404, {
                        message: 'more than 5'
                    });
                } else if (result != 0) {
                    res.send(404, {
                        message: 'another brand'
                    });
                } else {
                    res.send(200, {
                        message: 'OK'
                    });
                }
            } else {
                var count = 0,
                    result = 0;
                for (var i = 0; i < allProCatDecisions.length; i++) {
                    for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                        if (allProCatDecisions[i].proBrandsDecision[j].brandID != 0 && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                            for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName != "") {
                                    count++;
                                    if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varName == req.params.varName) {
                                        result++;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                if (count >= 3) {
                    res.send(404, {
                        message: 'more than 3'
                    });
                } else if (result != 0) {
                    res.send(404, {
                        message: 'another variant'
                    });
                } else {
                    res.send(200, {
                        message: 'OK'
                    });
                }
            }
        }
    })
}

//brandHistory
exports.getBrandHistory = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var categoryID = 0;
            if (req.params.brandName.substring(0, 1) == "E") {
                categoryID = 1;
            } else {
                categoryID = 2;
            }
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == categoryID);
            });
            var result = new Array();
            for (var i = 0; i < allProCatDecisions.length; i++) {
                for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                    if (allProCatDecisions[i].proBrandsDecision[j] != undefined && allProCatDecisions[i].proBrandsDecision[j].brandName == req.params.brandName) {
                        result = allProCatDecisions[i].proBrandsDecision[j];
                        break;
                    }
                }
            }
            if (!result) {
                res.send(404, 'cannot find the doc');
            } else {
                res.send(200, result);
            }
        }
    })
}

//companyHistory
exports.getCompanyHistory = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }
        if (!doc) {
            res.send(404, {
                err: 'cannot find the doc'
            });
        } else {
            var result = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == req.params.categoryID);
            });
            if (!result) {
                res.send(404, 'cannot find the doc');
            } else {
                res.send(200, result);
            }
        }
    })
}

exports.getProducerBrandList = function(req, res, next) {
    proDecision.findOne({
        seminar: req.params.seminar,
        period: req.params.period,
        producerID: req.params.producerID
    }, function(err, doc) {
        if (err) {
            next(new Error(err));
        }

        if (!doc) {
            console.log('cannot find matched doc...');
            res.send(404, {
                error: 'Cannot find matched doc...'
            });
        } else {
            var allProCatDecisions = _.filter(doc.proCatDecision, function(obj) {
                return (obj.categoryID == req.params.categoryID);
            });
            var brands = new Array();
            //var vars=new Array();
            var count = 0;
            for (var i = 0; i < doc.proCatDecision.length; i++) {
                for (var j = 0; j < doc.proCatDecision[i].proBrandsDecision.length; j++) {
                    if (doc.proCatDecision[i].proBrandsDecision[j] != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != undefined && doc.proCatDecision[i].proBrandsDecision[j].brandID != 0) {
                        var vars = new Array();
                        for (var k = 0; k < doc.proCatDecision[i].proBrandsDecision[j].proVarDecision.length; k++) {
                            if (doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName != "" && doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID != 0) {
                                vars.push({
                                    'varID': doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varID,
                                    'varName': doc.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName,
                                    'parentBrandID': doc.proCatDecision[i].proBrandsDecision[j].brandID,
                                    'parentName': doc.proCatDecision[i].proBrandsDecision[j].brandName
                                });

                            }
                        }
                        brands.push({
                            'category': doc.proCatDecision[i].categoryID,
                            'brandName': doc.proCatDecision[i].proBrandsDecision[j].brandName,
                            'brandID': doc.proCatDecision[i].proBrandsDecision[j].brandID,
                            'varList': vars
                        });
                        count++;

                    }
                }
            }
            if (count != 0) {
                res.header("Content-Type", "application/json; charset=UTF-8");
                res.statusCode = 200;
                res.send(brands);
            }
        }
    });
}

exports.getBrand = function(categoryCount, brandCount, producerID, seminar, period) {
    var deferred = q.defer();
    proDecision.findOne({
        seminar: seminar,
        period: period,
        producerID: producerID
    }, function(err, doc) {
        if (err) deferred.reject({
            msg: err
        });
        if (doc) {
            deferred.resolve({
                doc: doc,
                msg: 'Find Brand with producerID:' + producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount
            });
        } else {
            deferred.reject({
                doc: doc,
                msg: 'No Brand with producerID:' + producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount
            });
        }
    })
    return deferred.promise;
}

exports.getVariant = function(categoryCount, brandCount, varCount, producerID, seminar, period) {
    var deferred = q.defer();
    proDecision.findOne({
        seminar: seminar,
        period: period,
        producerID: producerID
    }, function(err, doc) {
        if (err) deferred.reject({
            msg: err
        });
        if (doc) {
            deferred.resolve({
                doc: doc,
                msg: 'Find Variant with producerID:' + producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount + ', varCount:' + varCount
            });
        } else {
            deferred.reject({
                doc: doc,
                msg: 'No Variant with producerID:' + producerID + ', categoryCount:' + categoryCount + ', brandCount:' + brandCount + ', varCount:' + varCount
            });
        }
    })
    return deferred.promise;
}