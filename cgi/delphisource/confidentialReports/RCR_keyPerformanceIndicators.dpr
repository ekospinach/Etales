program RCR_keyPerformanceIndicators;

uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
    rcrkpi_VolumeRotationIndex       = 100;
    rcrkpi_ValueRotationIndex        = 101;
    rcrkpi_ProfitabilityIndex        = 102;
    rcrkpi_StockCover                = 103;
    rcrkpi_ShoppersShare             = 104;

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


  function quarterInfoSchema(fieldIdx : Integer; catID : Integer; marketID : integer; quarterInfo : TRCR_QuarterKeyPerformanceIndicators ):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;

    case (fieldIdx) of
      rcrkpi_VolumeRotationIndex       : begin jo.D['value'] := quarterInfo.rcrkpi_VolumeRotationIndex; end;
      rcrkpi_ValueRotationIndex        : begin jo.D['value'] := quarterInfo.rcrkpi_ValueRotationIndex; end;
      rcrkpi_ProfitabilityIndex        : begin jo.D['value'] := quarterInfo.rcrkpi_ProfitabilityIndex; end;
      rcrkpi_StockCover                : begin jo.D['value'] := quarterInfo.rcrkpi_StockCover; end;
    end;

    result := jo;
  end;

  function quarterShopperInfoSchema(fieldIdx : Integer; catID : Integer; marketID : integer; shopper : TShoppersKind; quarterInfo : TRCR_QuarterKeyPerformanceIndicators ):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;

    case (fieldIdx) of
      rcrkpi_ShoppersShare : begin jo.D['value'] := quarterInfo.rcrkpi_ShoppersShare[shopper] end;
    end;

    result := jo;
  end;
  function shopperInfoSchema(fieldIdx : Integer; shopper : TShoppersKind):ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : String;
    tempQuarterInfo : TRCR_QuarterKeyPerformanceIndicators;
    catID, marketID : Integer;
  begin
    jo := SO;

    case Shopper of
       BMS: ShopperStr := 'BMS'; 
       NETIZENS: ShopperStr := 'NETIZENS';   
       MIXED: ShopperStr := 'MIXED';  
       ALLSHOPPERS: ShopperStr := 'ALLSHOPPERS'; 
       else
        ShopperStr := 'wrong';
    end;

    jo.S['shoperKind'] := shopperStr;
    jo.O['categoryInfo'] := SA([]);
    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      begin
          tempQuarterInfo := currentResult.r_RetailersConfidentialReports[currentRetailer].RCR_keyPerformanceIndicators[marketID, catID];
          jo.A['categoryInfo'].Add( quarterShopperInfoSchema(fieldIdx, catID, marketID, shopper, tempQuarterInfo ) );
      end;
    end;    

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandID,variantID,marketID,factoryID : Integer;
    tempQuarterInfo : TRCR_QuarterKeyPerformanceIndicators;
    Shopper : TShoppersKind;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['retailerID'] := currentRetailer;

    oJsonFile.O['rcrkpi_VolumeRotationIndex'] := SA([]);
    oJsonFile.O['rcrkpi_ValueRotationIndex'] := SA([]);
    oJsonFile.O['rcrkpi_ProfitabilityIndex'] := SA([]);
    oJsonFile.O['rcrkpi_StockCover'] := SA([]);
    oJsonFile.O['rcrkpi_ShoppersShare'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      begin
          tempQuarterInfo := currentResult.r_RetailersConfidentialReports[currentRetailer].RCR_keyPerformanceIndicators[marketID,catID];
          oJsonFile.A['rcrkpi_VolumeRotationIndex'].Add( quarterInfoSchema(rcrkpi_VolumeRotationIndex, catID, marketID, tempQuarterInfo) );
          oJsonFile.A['rcrkpi_ValueRotationIndex'].Add( quarterInfoSchema(rcrkpi_ValueRotationIndex, catID, marketID, tempQuarterInfo) );
          oJsonFile.A['rcrkpi_ProfitabilityIndex'].Add( quarterInfoSchema(rcrkpi_ProfitabilityIndex, catID, marketID, tempQuarterInfo) );
          oJsonFile.A['rcrkpi_StockCover'].Add( quarterInfoSchema(rcrkpi_StockCover, catID, marketID, tempQuarterInfo) );
      end;
    end;
    
    for Shopper := Low(TShoppersKind) to High(TShoppersKind) do 
    begin
      oJsonFile.A['rcrkpi_ShoppersShare'].Add( shopperInfoSchema(rcrkpi_ShoppersShare, shopper) );          
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

