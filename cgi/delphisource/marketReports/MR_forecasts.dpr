program MR_forecasts;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
    minConsumerSegmentsImportance = 100;
    maxConsumerSegmentsImportance = 101;

    minShopperSegmentsImportance = 102;
    maxShopperSegmentsImportance = 103;

    minTotalVolume = 104;
    maxTotalVolume = 105;

    minInternetPenetrationRate = 106;
    maxInternetPenetrationRate = 107;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  //----------- 2 schema functions for 
  //     mrf_Minimum_InternetPenetrationRate    : single;
  //     mrf_Maximum_InternetPenetrationRate    : single;  
  function internetPeriodSchema(idx : Integer; period :Integer) : ISuperObject;
  var 
    period : Integer;
  begin
    jo := SO;
    jo.I['period'] := period;

    case (idx) of
      minInternetPenetrationRate :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Minimum_InternetPenetrationRate;
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Minimum_InternetPenetrationRate;
        end;
      maxInternetPenetrationRate :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Maximum_InternetPenetrationRate;
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Maximum_InternetPenetrationRate;
        end;
    end;    
    result := jo;
  end;

  //----------- 2 schema functions for 
  //     mrf_Minimum_TotalVolume                : array[TCategories] of single;
  //     mrf_Maximum_TotalVolume                : array[TCategories] of single;
  function totalPeriodSchema(idx : Integer; catID : Integer; period :Integer) : ISuperObject;
  var 
    period : Integer;
  begin
    jo := SO;
    jo.I['period'] := period;

    case (idx) of
      minTotalVolume :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Minimum_TotalVolume[catID];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Minimum_TotalVolume[catID];
        end;
      maxTotalVolume :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Maximum_TotalVolume[catID];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Maximum_TotalVolume[catID];
        end;
    end;    
    result := jo;
  end;

  function totalCategorySchema(idx : Integer; catID :Integer) : ISuperObject;
  var
    period : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['periodInfo'] := SA([]);
    for period := Low(TForecastCoverage) to High(TForecastCoverage) do
    begin
      jo.A['periodInfo'].Add( totalPeriodSchema(idx, catID, period) );
    end;   

    result := jo;
  end;
  //----------- 3 schema functions for 
  //     mrf_Minimum_ShopperSegmentsImportance  : array[TCategories, TShoppersKind] of single;
  //     mrf_Maximum_ShopperSegmentsImportance  : array[TCategories, TShoppersKind] of single;
  function shopperPeriodSchema(idx : Integer; catID : Integer;  Shopper:TShoppersKind; period : Integer) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['period'] := period;
    jo.O['value'] := SA([]);

    case (idx) of
      minShopperSegmentsImportance :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Minimum_ShopperSegmentsImportance[catID, Shopper];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Minimum_ShopperSegmentsImportance[catID, Shopper];
        end;
      maxShopperSegmentsImportance :
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Maximum_ShopperSegmentsImportance[catID, Shopper];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Maximum_ShopperSegmentsImportance[catID, Shopper];
        end;
    end;

    result := jo;
  end;

  function shopperShopperSchema(idx : Integer; catID : Integer; Shopper:TShoppersKind) : ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : string;
    period : Integer;
  begin
    jo := SO;
    case Shopper of
        BMS         : ShopperStr := 'BMS'; 
        NETIZENS    : ShopperStr := 'NETIZENS';   
        MIXED       : ShopperStr := 'MIXED';  
        ALLSHOPPERS : ShopperStr := 'ALLSHOPPERS'; 
    else
        ShopperStr  := 'wrong';
    end;

    jo.S['shoperKind'] := ShopperStr;
    jo.O['periodInfo'] := SA([]);
    for period := Low(TForecastCoverage) to High(TForecastCoverage) do
    begin
      jo.A['periodInfo'].Add( shopperPeriodSchema(idx, catID, Shopper, period) );
    end;   

    result := jo;
  end;

  function shopperCategorySchema(idx : Integer; catID : Integer) : ISuperObject;
  var
    jo : ISuperObject;
    Shopper : TShoppersKind;
  begin
    jo := SO;
    jo.I['categoryID¡'] := catID;
    jo.O['shopperInfo'] := SA([]);

    for Shopper := Low(TShoppersKind) to High(TShoppersKind) do
    begin
      jo.A['shopperInfo'].Add( shopperShopperSchema(idx, catID, Shopper) );
    end;   

    result := jo;
  end;

  //----------- 3 schema functions for 
  //     mrf_Minimum_ConsumerSegmentsImportance : array[TCategories, TSegments] of single;
  //     mrf_Maximum_ConsumerSegmentsImportance : array[TCategories, TSegments] of single;
  function consumerPeriodSchema(idx : Integer; catID : Integer; segmentID : Integer; period : Integer) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['period'] := period;
    jo.O['value'] := SA([]);

    case (idx) of
      minConsumerSegmentsImportance : 
        begin 
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Minimum_ConsumerSegmentsImportance[catID, segmentID];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Minimum_ConsumerSegmentsImportance[catID, segmentID];
        end;
      maxConsumerSegmentsImportance : 
        begin
          jo.A['value'].D[0] := currentResult.r_MarketResearch.MR_forecasts[period, 1].mrf_Maximum_ConsumerSegmentsImportance[catID, segmentID];
          jo.A['value'].D[1] := currentResult.r_MarketResearch.MR_forecasts[period, 2].mrf_Maximum_ConsumerSegmentsImportance[catID, segmentID];
        end;      
    end;

    result := jo;
  end;

  function consumerSegmentSchema(idx : Integer; catID : Integer; segmentID : Integer) : ISuperObject;
  var
    jo : ISuperObject;
    period : Integer;
  begin
    jo := SO;
    jo.I['segmentID'] := segmentID;
    jo.O['periodInfo'] := SA([]);

    for period := Low(TForecastCoverage) to High(TForecastCoverage) do
    begin
      jo.A['periodInfo'].Add( consumerPeriodSchema(idx, catID, segmentID, period) );
    end;    

    result := jo;
  end;

  function consumerCategorySchema(idx : Integer; catID : Integer) : ISuperObject;
  var
    jo : ISuperObject;
    segmentID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['segmentInfo'] := SA([]);
    for segmentID := Low(TSegments) to High(TSegments) do
    begin
      jo.A['segmentInfo'].Add( consumerSegmentSchema( idx, catID, segmentID ) );
    end;  

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,period : Integer;
    tempBrand:TMR_BrandAwareness;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['minConsumerSegmentsImportance'] := SA([]);
    oJsonFile.O['maxConsumerSegmentsImportance'] := SA([]);

    oJsonFile.O['minShopperSegmentsImportance'] := SA([]);
    oJsonFile.O['maxShopperSegmentsImportance'] := SA([]);

    oJsonFile.O['minTotalVolume'] := SA([]);
    oJsonFile.O['maxTotalVolume'] := SA([]);

    oJsonFile.O['minInternetPenetrationRate'] := SA([]);
    oJsonFile.O['maxInternetPenetrationRate'] := SA([]);


    for catID := Low(TCategories) to High(TCategories) do
    begin
      oJsonFile.A['minConsumerSegmentsImportance'].Add( consumerCategorySchema(minConsumerSegmentsImportance, catID) );
      oJsonFile.A['maxConsumerSegmentsImportance'].Add( consumerCategorySchema(maxConsumerSegmentsImportance, catID) );

      oJsonFile.A['minShopperSegmentsImportance'].Add( shopperCategorySchema(minShopperSegmentsImportance, catID) );
      oJsonFile.A['maxShopperSegmentsImportance'].Add( shopperCategorySchema(maxShopperSegmentsImportance, catID) );      

      oJsonFile.A['minTotalVolume'].Add( totalCategorySchema(minTotalVolume, catID) );
      oJsonFile.A['maxTotalVolume'].Add( totalCategorySchema(maxTotalVolume, catID) );
    end;

    for period := Low(TForecastCoverage) to High(TForecastCoverage) do
    begin
      jo.A['minInternetPenetrationRate'].Add( internetPeriodSchema(minInternetPenetrationRate, period) );
      jo.A['maxInternetPenetrationRate'].Add( internetPeriodSchema(maxInternetPenetrationRate, period) );
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

