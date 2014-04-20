program MR_netMarketPrices;


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


  function accountInfoSchema(accountID:Integer; variant:TMR_VariantNetPrices):ISuperObject;
  var
    jo: ISuperObject;
  begin
    jo := SO;
    jo.I['accountID'] := accountID;
    jo.O['previousNetMarketPrice'] := SA([]);
    jo.A['previousNetMarketPrice'].D[0] := variant.mrnmp_PreviousNetMarketPrice[1, accountID];
    jo.A['previousNetMarketPrice'].D[1] := variant.mrnmp_PreviousNetMarketPrice[2, accountID];

    jo.O['latestNetMarketPrice'] := SA([]);
    jo.A['latestNetMarketPrice'].D[0] := variant.mrnmp_latestNetMarketPrice[1, accountID];
    jo.A['latestNetMarketPrice'].D[1] := variant.mrnmp_latestNetMarketPrice[2, accountID];

    jo.O['netMarketPriceChange'] := SA([]);
    jo.A['netMarketPriceChange'].D[0] := variant.mrnmp_NetMarketPriceChange[1, accountID];
    jo.A['netMarketPriceChange'].D[1] := variant.mrnmp_NetMarketPriceChange[2, accountID];
    result := jo;

  end;

  function variantInfoSchema(catID : Integer; variant: TMR_VariantNetPrices):ISuperObject;
  var
    jo : ISuperObject;
    accountID : Integer;
  begin    
    jo := SO;
    jo.S['variantName'] := variant.mrnmp_VariantName;
    jo.S['parentBrandName'] := variant.mrnmp_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.mrnmp_ParentCompanyID;

    jo.O['accountInfo'] := SA([]);
    for accountID := Low(TAccounts) to high(TAccounts) do
    begin
      jo.A['accountInfo'].Add( accountInfoSchema(accountID, variant) );      
    end;

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,variantID : Integer;
    tempVariant : TMR_VariantNetPrices;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['variantInfo'] := SA([]);
    for catID := Low(TCategories) to High(TCategories) do
    begin
        for variantID := Low(TVariants) to High(TVariants) do 
        begin
          tempVariant := currentResult.r_MarketResearch.MR_netMarketPrices[catID, variantID];
          if (tempVariant.mrnmp_variantName <> '') and (tempVariant.mrnmp_ParentBrandName <> '') then 
          begin
             oJsonFile.A['variantInfo'].Add( variantInfoSchema(catID, tempVariant) );
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

