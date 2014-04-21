program MR_pricePromotions;

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

  function accountInfoSchema(accountID:Integer; variant:TMR_VariantPromotions):ISuperObject;
  var
    jo: ISuperObject;
  begin
    jo := SO;
    jo.I['accountID'] := accountID;
    jo.O['promoFrequency'] := SA([]);
    jo.A['promoFrequency'].D[0] := variant.mrpp_PricePromotions[1, accountID].promo_Frequency;
    jo.A['promoFrequency'].D[1] := variant.mrpp_PricePromotions[2, accountID].promo_Frequency;

    jo.O['promoRate'] := SA([]);
    jo.A['promoRate'].D[0] := variant.mrpp_PricePromotions[1, accountID].promo_Rate;
    jo.A['promoRate'].D[1] := variant.mrpp_PricePromotions[2, accountID].promo_Rate;

    result := jo;

  end;


  function variantInfoSchema(catID : Integer; variant: TMR_VariantPromotions):ISuperObject;
  var
    jo : ISuperObject;
    accountID : Integer;
  begin    
    jo := SO;
    jo.S['variantName'] := variant.mrpp_VariantName;
    jo.S['parentBrandName'] := variant.mrpp_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.mrpp_ParentCompanyID;

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
    tempVariant : TMR_VariantPromotions;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['variantInfo'] := SA([]);
    for catID := Low(TCategories) to High(TCategories) do
    begin
        for variantID := Low(TVariants) to High(TVariants) do 
        begin
          tempVariant := currentResult.r_MarketResearch.MR_pricePromotions[catID, variantID];
          if (tempVariant.mrpp_variantName <> '') and (tempVariant.mrpp_ParentBrandName <> '') then 
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

