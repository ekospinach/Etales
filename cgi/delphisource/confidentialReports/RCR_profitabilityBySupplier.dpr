program RCR_profitabilityBySupplier;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
    rcrps_ShelfSpace                     = 100;
    rcrps_NetSales                       = 101;
    rcrps_NetSalesPerShelfSpace          = 102;
    rcrps_NetSalesShare                  = 103;
    rcrps_GrossContribution              = 104;
    rcrps_GrossContributionPerShelfSpace = 105;
    rcrps_GrossContributionMargin        = 106;
    rcrps_GrossContributionShare         = 107;
    rcrps_PaymentTerms                   = 108;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentRetailer : TBMRetailers;  
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function factoryInfoSchema(fieldIdx : Integer; catID : Integer; marketID : integer; factoryID : integer; factoryInfo : TRCR_ProfitabilityByOneSupplier):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;
    jo.I['factoryID'] := factoryID;

    case (fieldIdx) of
      rcrps_ShelfSpace : begin jo.D['value'] := factoryInfo.rcrps_ShelfSpace; end;
      rcrps_NetSales : begin jo.D['value'] := factoryInfo.rcrps_NetSales; end;
      rcrps_NetSalesPerShelfSpace : begin jo.D['value'] := factoryInfo.rcrps_NetSalesPerShelfSpace; end;
      rcrps_NetSalesShare : begin jo.D['value'] := factoryInfo.rcrps_NetSalesShare; end;
      rcrps_GrossContribution : begin jo.D['value'] := factoryInfo.rcrps_GrossContribution; end;
      rcrps_GrossContributionPerShelfSpace : begin jo.D['value'] := factoryInfo.rcrps_GrossContributionPerShelfSpace; end;
      rcrps_GrossContributionMargin : begin jo.D['value'] := factoryInfo.rcrps_GrossContributionMargin; end;
      rcrps_GrossContributionShare : begin jo.D['value'] := factoryInfo.rcrps_GrossContributionShare; end;
      rcrps_PaymentTerms : begin jo.D['value'] := factoryInfo.rcrps_PaymentTerms; end;
    end;
         
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandID,variantID,marketID,factoryID : Integer;
    tempQuarterInfo : TRCR_QuarterProfitAndLoss;
    tempBrandMarketInfo : TRCR_OneBrand;
    tempVariantMarketInfo : TRCR_OneVariant;
    tempProfitInfo : TRCR_ProfitabilityByOneSupplier;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['retailerID'] := currentRetailer;

    oJsonFile.O['rcrps_ShelfSpace'] := SA([]);
    oJsonFile.O['rcrps_NetSales'] := SA([]);
    oJsonFile.O['rcrps_NetSalesPerShelfSpace'] := SA([]);
    oJsonFile.O['rcrps_NetSalesShare'] := SA([]);
    oJsonFile.O['rcrps_GrossContribution'] := SA([]);
    oJsonFile.O['rcrps_GrossContributionPerShelfSpace'] := SA([]);
    oJsonFile.O['rcrps_GrossContributionMargin'] := SA([]);
    oJsonFile.O['rcrps_GrossContributionShare'] := SA([]);
    oJsonFile.O['rcrps_PaymentTerms'] := SA([]);

    for catID := Low(TCategories) to High(TCategories) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      begin
        for factoryID := Low(TFactories) to High(TFactories) do 
        begin
          tempProfitInfo := currentResult.r_RetailersConfidentialReports[currentRetailer].RCR_profitabilityBySuppliers[marketID, catID, factoryID];
          oJsonFile.A['rcrps_ShelfSpace'].Add( factoryInfoSchema(rcrps_ShelfSpace, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_NetSales'].Add( factoryInfoSchema(rcrps_NetSales, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_NetSalesPerShelfSpace'].Add( factoryInfoSchema(rcrps_NetSalesPerShelfSpace, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_NetSalesShare'].Add( factoryInfoSchema(rcrps_NetSalesShare, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_GrossContribution'].Add( factoryInfoSchema(rcrps_GrossContribution, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_GrossContributionPerShelfSpace'].Add( factoryInfoSchema(rcrps_GrossContributionPerShelfSpace, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_GrossContributionMargin'].Add( factoryInfoSchema(rcrps_GrossContributionMargin, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_GrossContributionShare'].Add( factoryInfoSchema(rcrps_GrossContributionShare, catID, marketID, factoryID, tempProfitInfo) );          
          oJsonFile.A['rcrps_PaymentTerms'].Add( factoryInfoSchema(rcrps_PaymentTerms, catID, marketID, factoryID, tempProfitInfo) );          
        end;
      end;
    end;

    //for debug used
    s_str := 'out' + '.json';
    writeln( oJsonFile.AsJSon(False,False));
    oJsonFile.SaveTo(s_str, true, false);
  end;

begin
    SetMultiByteConversionCodePage(CP_UTF8);
    sListData := TStringList.Create;
    sListData.Clear;

    try
      WriteLn('Content-type: application/json');

      sValue := getVariable('REQUEST_METHOD');
      if sValue='GET' then
      begin
          sValue := getVariable('QUERY_STRING');
          Explode(sValue, sListData);
          LoadConfigIni(DataDirectory, getSeminar(sListData));
          //initialise GET request parameters
          currentSeminar := getSeminar(sListData);
          currentPeriod := getPeriod(sListData);
          currentRetailer := getRetailerID(sListData);
          {** Read results file **}
          vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,currentResult); // read Results file

          // Read result failed
          if vReadRes <> 0 then
          begin
            Writeln('Status: 404 Not Found');
            WriteLn;
          end
          else
          //Read result successfully, generate JSON and writeln
          begin
            WriteLn;
            makeJson;            
          end;
      end;
    finally
      sListData.Free;
    end;
end.

