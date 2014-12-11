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

  function variantInfoSchema(catID: Integer; variant : TMR_VariantShelfSpace):ISuperObject;
  var
    jo : ISuperObject;
    marketID : Integer;
  begin
    jo := SO;
    jo.S['variantName'] := variant.mrssv_VariantName;
    jo.S['parentBrandName'] := variant.mrssv_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.mrssv_parentCompanyID;

    jo.O['shelfSpace'] := SA([]);
    jo.O['previousShelfSpace'] := SA([]);
    jo.O['shelfSpaceChange'] := SA([]);

    for marketID := Low(TMarkets) to High(TMarkets) do 
    begin
      jo.A['shelfSpace'].D[marketID-1] := variant.mrssv_LatestShelfSpace[marketID];
      jo.A['previousShelfSpace'].D[marketID-1] := variant.mrssv_PreviousShelfSpace[marketID];
      jo.A['shelfSpaceChange'].D[marketID-1] := variant.mrssv_ShelfSpaceChange[marketID];
    end;
    
    result:= jo;
  end;

  function retailerInfoSchema(retailerID : Integer; retailerInfo : TMR_RetailerInvestments):ISuperObject;
  var
    jo : ISuperObject;
    marketID,catID,variantID : Integer;
    tempVariant : TMR_VariantShelfSpace;
  begin
    jo := SO;
    jo.I['retailerID'] := retailerID;
    jo.O['storeServiceLevel'] := SA([]);
    jo.O['onlineAdvertising'] := SA([]);
    jo.O['offlineAdvertising'] := SA([]);
    jo.O['localAdvertising'] := SA([]);
    jo.O['sellingSpace'] := SA([]);


    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      case (retailerInfo.mrri_StoreServiceLevel[marketID]) of
        SL_BASE: begin jo.A['storeServiceLevel'].S[marketID-1]:='SL_BASE'; end;
        SL_FAIR:begin jo.A['storeServiceLevel'].S[marketID-1]:='SL_FAIR'; end;
        SL_MEDIUM:begin jo.A['storeServiceLevel'].S[marketID-1]:='SL_MEDIUM'; end;
        SL_ENHANCED:begin jo.A['storeServiceLevel'].S[marketID-1]:='SL_ENHANCED'; end;
        SL_PREMIUM:begin jo.A['storeServiceLevel'].S[marketID-1]:='SL_PREMIUM'; end;
      end;
      jo.A['onlineAdvertising'].D[marketID-1] := retailerInfo.mrri_onlineAdvertising[marketID];
      jo.A['offlineAdvertising'].D[marketID-1] := retailerInfo.mrri_offlineAdvertising[marketID];
      jo.A['localAdvertising'].D[marketID-1] := retailerInfo.mrri_localAdvertising[marketID];
      jo.A['sellingSpace'].D[marketID - 1] := retailerInfo.mrri_SellingSpace[marketID];
    end;


    jo.O['variantInfo'] := SA([]);
    for catID := low(TCategories) to High(TCategories) do
    begin
      for variantID := Low(TVariants) to High(TVariants) do
      begin
        tempVariant := retailerInfo.mrri_ShelfSpaceAllocation[catID, variantID];
        if (tempVariant.mrssv_VariantName <>'') AND (tempVariant.mrssv_ParentBrandName <> '') then
        begin
          jo.A['variantInfo'].Add( variantInfoSchema(catID, tempVariant) );
        end;
      end;
    end;

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
    for retailerID := Low(TBMRetailers) to High(TBMRetailers) do
    begin
      oJsonFile.A['retailerInfo'].Add( retailerInfoSchema(retailerID, currentResult.r_MarketResearch.mr_RetailersIntelligence[retailerID]) );
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

