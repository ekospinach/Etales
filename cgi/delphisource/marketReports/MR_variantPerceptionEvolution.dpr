program MR_variantPerceptionEvolution;


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

  function variantInfoSchema(catID : Integer; marketID : Integer; variant: TMR_VariantPerception):ISuperObject;
  var
    jo : ISuperObject;
  begin    
    jo := SO;
    jo.S['variantName'] := variant.mrvp_VariantName;
    jo.S['parentBrandName'] := variant.mrvp_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.mrvp_ParentCompanyID;
    jo.I['marketID'] := marketID;

    jo.O['previousPerception'] := SA([]);
    jo.A['previousPerception'].D[0] := variant.mrvp_PreviousPerception[1];
    jo.A['previousPerception'].D[1] := variant.mrvp_PreviousPerception[2];
    jo.A['previousPerception'].D[2] := variant.mrvp_PreviousPerception[3];

    jo.O['latestPerception'] := SA([]);
    jo.A['latestPerception'].D[0] := variant.mrvp_latestPerception[1];
    jo.A['latestPerception'].D[1] := variant.mrvp_latestPerception[2];
    jo.A['latestPerception'].D[2] := variant.mrvp_latestPerception[3];

    jo.O['perceptionChange'] := SA([]);
    jo.A['perceptionChange'].D[0] := variant.mrvp_perceptionChange[1];
    jo.A['perceptionChange'].D[1] := variant.mrvp_perceptionChange[2];
    jo.A['perceptionChange'].D[2] := variant.mrvp_perceptionChange[3];

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,variantID : Integer;
    tempVariant : TMR_VariantPerception;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;


    oJsonFile.O['variantInfo'] := SA([]);
    for catID := Low(TCategories) to High(TCategories) do
    begin
      for marketID := Low(TMarkets) to High(TMarkets) do
      begin
        for variantID := Low(TVariants) to High(TVariants) do 
        begin
          tempVariant := currentResult.r_MarketResearch.mr_VariantPerception[marketID, catID, variantID];
          if (tempVariant.mrvp_variantName <> '') and (tempVariant.mrvp_ParentBrandName <> '') then 
          begin
             oJsonFile.A['variantInfo'].Add( variantInfoSchema(catID, marketID, tempVariant) );
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

