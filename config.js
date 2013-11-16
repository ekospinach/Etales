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
				  path_producerDecision : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision : '/cgi-bin/retailerDecision.exe',
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
				  port : 800,
				  host : '192.168.1.105',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport : '/cgi-bin/finReport.exe',				
				  path_volReport : '/cgi-bin/volReport.exe',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',		
				  path_finReport : '/cgi-bin/finReport.exe',		
				  path_volReport : '/cgiexe-bin/volReport.exe',
				  path_producerDecision : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision : '/cgi-bin/retailerDecision.exe',				  
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