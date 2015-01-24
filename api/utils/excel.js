exports.exportExcel = function(req, res, next) {
    var result={
        msg:'success',
        path:''
    }
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    var name = 'app/upload/' + req.body.name+'.xlsx';
    result.path=name;
    var obj = {
        worksheets: [{
            data: req.body.data
        }]
    };
    var file = xlsx.build(obj);
    try {
        fs.writeFile(name, file, 'binary',function(err){
            if(err){
                result.msg='fail';   
            }
            res.send(200,result);
        });
    } catch (err) {
        result.msg='fail'; 
        res.send(200,result);
    }
}