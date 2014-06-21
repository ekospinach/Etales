program MR_suppliersIntelligence;

uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
    actualTradeSupport            = 100;
    negotiatedTradeSupport        = 101;


var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function retailerInfoSchema(fieldIdx:Integer; retailerID:Integer; supplierInfo : TMR_SupplierInvestments):ISuperObject;
  var
    jo:ISuperObject;
    marketID :Integer;
  begin
    jo := SO;
    jo.I['BMretailerID'] := retailerID;
    jo.O['value'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      case (fieldIdx) of
          actualTradeSupport: jo.A['value'].D[marketID-1] := supplierInfo.mrsi_ActualTradeSupport[marketID, retailerID];
          negotiatedTradeSupport: jo.A['value'].D[marketID-1] := supplierInfo.mrsi_negotiatedTradeSupport[marketID, retailerID];
      end;  
    end;

    result := jo;
  end;

  function supplierInfoSchema(catID : Integer; supplierInfo : TMR_SupplierInvestments):ISuperObject;
  var
    jo : ISuperObject;
    marketId : integer;
    retailerID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.D['advertisingOnLine'] := supplierInfo.mrsi_advertisingOnLine;
    jo.D['onLineVisibility'] := supplierInfo.mrsi_OnLine_Visibility;
    jo.D['onLineOther'] := supplierInfo.mrsi_onLine_Other;
    jo.D['acquiredTechnologyLevel'] := supplierInfo.mrsi_AcquiredTechnologyLevel;
    jo.D['acquiredDesignLevel'] := supplierInfo.mrsi_AcquiredDesignLevel;
    jo.D['productionCapacityAvailable'] := supplierInfo.mrsi_ProductionCapacityAvailable;
    jo.D['capacityUtilisationRate'] := supplierInfo.mrsi_capacityUtilisationRate;
    jo.D['productionplanningFlexibility'] := supplierInfo.mrsi_ProductionplanningFlexibility;

    jo.O['advertisingOffLine'] := SA([]);
    jo.O['actualTradeSupport'] := SA([]);
    jo.O['negotiatedTradeSupport'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      jo.A['advertisingOffLine'].D[marketID-1] := supplierInfo.mrsi_AdvertisingOffLine[marketID];
    end;

    for retailerID := Low(TAccountsTotal) to High(TAccountsTotal) do
    begin
      jo.A['actualTradeSupport'].Add( retailerInfoSchema(actualTradeSupport, retailerID, supplierInfo) );
      jo.A['negotiatedTradeSupport'].Add( retailerInfoSchema(negotiatedTradeSupport, retailerID, supplierInfo) );      
    end;

    result := jo;
  end;

  function suppliersInfoSchema(supplierID : Integer; suppliersInfo : TMR_SuppliersIntelligence ): ISuperObject;
  var
    jo : ISuperObject;
    catID : integer;
  begin
    jo := SO;
    jo.I['supplierID'] := supplierID;
    jo.O['categoryInfo'] := SA([]);
    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      jo.A['categoryInfo'].Add( supplierInfoSchema(catID, suppliersInfo[catID, supplierID]) );
    end;
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,brandID, supplierID: Integer;
    tempBrand:TMR_BrandAwareness;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['supplierInfo'] := SA([]);
    for supplierID := Low(TProducersPlus) to High(TProducersPlus) do
    begin
        oJsonFile.A['supplierInfo'].Add( suppliersInfoSchema(supplierID, currentResult.r_MarketResearch.mr_SuppliersIntelligence) );
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

