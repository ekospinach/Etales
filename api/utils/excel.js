//var nodeExcel = require('excel-export');
//var node_xlsx = require('node-xlsx');
var fs =require('fs');

exports.exportExcel=function(req,res,next){
  var xlsx = require('node-xlsx');
  var fs = require('fs');
  var name='app/upload/'+req.body.name;
  var obj={worksheets:[{
	name:req.body.name,
  	data:req.body.data
  }]};
  var file = xlsx.build(obj);
  try{
    fs.writeFileSync(name, file, 'binary');
  }catch(err){
    res.send(400)
  }
  res.send(200);
}

// exports.testGet=function(req,res,next){
// 	var conf ={};
//   // uncomment it for style example  
//   // conf.stylesXmlFile = "styles.xml";
//     conf.cols = [{
//         caption:'string',
//         captionStyleIndex: 1,        
//         type:'string',
//         beforeCellWrite:function(row, cellData){
//              return cellData.toUpperCase();
//         }
//         , width:28.7109375
//     },{
//         caption:'date',
//         type:'date',
//         beforeCellWrite:function(){
//             var originDate = new Date(Date.UTC(1899,11,30));
//             return function(row, cellData, eOpt){
//               // uncomment it for style example 
//               // if (eOpt.rowNum%2){
//                 // eOpt.styleIndex = 1;
//               // }  
//               // else{
//                 // eOpt.styleIndex = 2;
//               // }
//               return (cellData - originDate) / (24 * 60 * 60 * 1000);
//             } 
//         }()
//         , width:20.85
//     },{
//         caption:'bool',
//         type:'bool'
//     },{
//         caption:'number',
//         type:'number',
//         width:10.42578125 
//     }];
//     conf.rows = [
//     	['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
//       	["e", new Date(2012, 4, 1), false, 2.7182],
//       	["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.2]   
//     ];
//     var result = nodeExcel.execute(conf);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//     res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//     //res.end(result);
//     res.end(result, 'binary');
// }