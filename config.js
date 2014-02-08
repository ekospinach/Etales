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
				  path_negotiationDecision : '/cgi-bin/negotiationDecision.exe',
				  path_brandHistoryInfo : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo : '/cgi-bin/quarterHistoryInfo.exe',

				  path_initialize : '/cgi-bin/initialize.exe',
				  path_passive : '/cgi-bin/passive.exe',
				  path_kernel : '/cgi-bin/kernel.exe',

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
				  path_producerDecision : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision : '/cgi-bin/retailerDecision.exe',
				  path_negotiationDecision : '/cgi-bin/negotiationDecision.exe',
				  path_brandHistoryInfo : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo : '/cgi-bin/quarterHistoryInfo.exe',

				  path_initialize : '/cgi-bin/initialize.exe',
				  path_passive : '/cgi-bin/passive.exe',
				  path_kernel : '/cgi-bin/kernel.exe',

				},
				server : {
				  port : 80
				}
			}
		case 'monsoul':
			return {
				cgi : {
				  port : 800,
				  host : '192.168.1.100',
				  path_marketReport : '/cgi-bin/marketReport.exe',
				  path_lineChart : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport : '/cgi-bin/finReport.exe',				
				  path_volReport : '/cgi-bin/volReport.exe',	
				  path_producerDecision : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision : '/cgi-bin/retailerDecision.exe',				  
				  path_negotiationDecision : '/cgi-bin/negotiationDecision.exe',				  
				  path_brandHistoryInfo : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo : '/cgi-bin/quarterHistoryInfo.exe',
				  uploadFileAbsDir : '',

				  path_initialize : '/cgi-bin/initialize.exe',
				  path_passive : '/cgi-bin/passive.exe',
				  path_kernel : '/cgi-bin/kernel.exe',				  
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