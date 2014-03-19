program GR_marketShare;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction in 'CgiCommonFunction.pas';

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function actorMarketInfoSchema(actorID: Integer; catID : Integer; marketID : Integer; binaryReport : TGR_SharesOfMarket):
  var
    jo : ISuperObject;
    segmentID : Integer;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.O['actorMarketInfo'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['actorMarketInfo'].Add( actorMarketInfoSchema(actorID, catID, marketID, binaryReport) );

    result := jo;  

  end;

  function actorCategoryInfoSchema(actorID : Integer; catID : integer; binaryReport : TGR_PerformanceHighlights): ISuperObject;
  var
    jo : ISuperObject;
    marketID : integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['actorMarketInfo'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['actorMarketInfo'].Add( actorMarketInfoSchema(actorID, catID, marketID, binaryReport) );

    result := jo;
  end;


  function actorInfoSchema(actorID : Integer; binaryReport : TGR_SharesOfMarket): ISuperObject;
  var
    jo: ISuperObject;
    cat: Integer;
  begin
    jo := SO;
    jo.I['actorID'] := actorID;
    jo.O['actorCategoryInfo'] := SA([]);
    for cat := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      jo.A['actorCategoryInfo'].Add( actorCategoryInfoSchema(actorID, cat, binaryReport) );

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.O['actorInfo'] := SA([]);
    for actorID := Low(TActors) to High(TActors) do
      oJsonFile.A['actorInfo'].Add( actorInfoSchema(actorID, currentResult.r_GeneralReport.gr_SharesOfMarket) );

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

