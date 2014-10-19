program MR_retailerPerceptionEvolution;


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


  function storeinfoSchema(storeID : Integer; marketID : Integer; store :TMR_StorePerception ):ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['storeID'] := storeID;
    jo.I['marketID'] := marketID;

    jo.O['previousPerception'] := SA([]);
    jo.A['previousPerception'].D[0] := store.mrsp_PreviousPerception[PRICE_APPEAL];
    jo.A['previousPerception'].D[1] := store.mrsp_PreviousPerception[CONVENIENCE];

    jo.O['latestPerception'] := SA([]);
    jo.A['latestPerception'].D[0] := store.mrsp_latestPerception[PRICE_APPEAL];
    jo.A['latestPerception'].D[1] := store.mrsp_latestPerception[CONVENIENCE];

    jo.O['perceptionChange'] := SA([]);
    jo.A['perceptionChange'].D[0] := store.mrsp_perceptionChange[PRICE_APPEAL];
    jo.A['perceptionChange'].D[1] := store.mrsp_perceptionChange[CONVENIENCE];

    result := jo;
    
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,storeID : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.O['storeInfo'] := SA([]);
    for marketID := Low(TMarkets) to High(TMarkets) do
    begin
      for storeID :=Low(TAllStores) to High(TAllStores) do begin
           oJsonFile.A['storeInfo'].Add( storeInfoSchema(storeID, marketID, currentResult.r_MarketResearch.mr_RetailerPerception[marketID, storeID]) );                              
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

