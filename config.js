module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'development':
			return {
				cgi : {
				  port : 8080,
				  host : 'localhost',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',		
				  path_finReport : '/cgi-bin/finReport.exe',		
				  path_volReport : '/cgi-bin/volReport.exe',
   			  	  uploadFileAbsDir : '&filepath=\\\\vmware-host\\Shared%20Folders\\ludwikOnMac\\Code\\Actived\\Etales-result-viewer\\upload\\'
				},
				server : {
				  port : 8000
				}
			}
		case 'production':
			return {
				cgi : {
				  port : 8080,
				  host : 'localhost',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport : '/cgi-bin/finReport.exe',		
				  path_volReport : '/cgi-bin/volReport.exe',
				  uploadFileAbsDir : '&filepath=\\\\vmware-host\\Shared%20Folders\\ludwikOnMac\\Code\\Actived\\Etales-result-viewer\\upload\\'
				},
				server : {
				  port : 80
				}
			}
		case 'monsoul':
			return {
				cgi : {
				  port : 8080,
				  host : '10.20.30.9',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport : '/cgi-bin/finReport.exe',				
				  path_volReport : '/cgi-bin/volReport.exe',
				  uploadFileAbsDir : ''
				},
				server : {
				  port : 8000
				}				
			}
		default:
			return {
				cgi : {
				  port : 8080,
				  host : 'localhost',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport : '/cgi-bin/finReport.exe',		
				  path_volReport : '/cgi-bin/volReport.exe',
				  uploadFileAbsDir : '&filepath=D://EtalesRV//master//upload//'
				},
				server : {
				  port : 8000
				}
			}		
	}
}