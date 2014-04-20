program MR_retailerIntelligence;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function brandInfoSchema(catID : Integer; marketID : Integer; brand: TMR_BrandAwareness):ISuperObject;
  var
    jo : ISuperObject;
  begin    
    jo := SO;
    jo.S['brandName'] := brand.mrba_BrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := brand.mrba_ParentCompanyID;
    jo.I['marketID'] := marketID;
    jo.D['previousAwareness'] := brand.mrba_PreviousAwareness;
    jo.D['latestAwareness'] := brand.mrba_LatestAwareness;

    result := jo;
  end;


  function retailerInfoSchema(retailerID : Integer; retailerInfo : TMR_RetailerInvestments):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['retailerID'] := retailerID;
    jo.O['storeServiceLevel'] := SA([]);
    jo.O['onlineAdvertising'] := SA([]);
    jo.O['offlineAdvertising'] := SA([]);


    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do 
    begin
      case (retailerInfo.mrri_StoreServiceLevel[marketID]) of
        SL_BASE: begin jo.A['storeServiceLevel'].S[marketID-1]:='BASE'; end;
        SL_FAIR:begin jo.A['storeServiceLevel'].S[marketID-1]:='FAIR'; end;
        SL_MEDIUM:begin jo.A['storeServiceLevel'].S[marketID-1]:='MEDIUM'; end;
        SL_ENHANCED:begin jo.A['storeServiceLevel'].S[marketID-1]:='ENHANCED'; end;
        SL_PREMIUM:begin jo.A['storeServiceLevel'].S[marketID-1]:='PREMIUM'; end;
      end;
    jo.A['onlineAdvertising'].D[marketID-1] := retailerInfo.mrri_onlineAdvertising[marketID];
    jo.A['offlineAdvertising'].D[marketID-1] := retailerInfo.mrri_offlineAdvertising[marketID];
    jo.A['localAdvertising'].D[marketID-1] := retailerInfo.mrri_localAdvertising[marketID];


        
    end;

    storeServiceLevel : [String], //0-Urban, 1-Rural,//SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
    onlineAdvertising : [Number], //0-Urban, 1-Rural
    offlineAdvertising : [Number], //0-Urban, 1-Rural
    localAdvertising : [Number],


    result := jo;
  end;
  procedure makeJson();
  var
    s_str : string;
    catID,marketID,brandID, retailerID: Integer;
    tempBrand:TMR_BrandAwareness;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['retailerInfo'] := SA([]);
    for retailerID := Low(TBMRetailer) to High(TBMRetailer) do 
    begin
      oJsonFile.A['retailerInfo'].Add( retailerInfoSchema(retailerID, currentResult.r_MarketResearch.mr_RetailersIntelligence[retailerID]) );
    end;


    for catID := Low(TCategories) to High(TCategories) do
    begin
      for marketID := Low(TMarkets) to High(TMarkets) do
      begin
        for brandID := Low(TBrands) to High(TBrands) do 
        begin
          tempBrand := currentResult.r_MarketResearch.mr_AwarenessEvolution[marketID, catID, brandID];
          if (tempBrand.mrba_BrandName<> '') then 
          begin
             oJsonFile.A['brandInfo'].Add( brandInfoSchema(catID, marketID, tempBrand) );                      
          end;          
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
          // initialize globals
          currentSeminar := getSeminar(sListData);
          currentPeriod := getPeriod(sListData);
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

