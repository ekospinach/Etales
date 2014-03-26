program SCR_negotiations;


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

  function actorCategoryInfoSchema(actorID : Integer; catID : integer; binaryReport : TGR_PerformanceHighlights): ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.D['grph_SalesVolume'] := binaryReport.grph_SalesVolume[actorID, catID];
    jo.D['grph_NetSalesValue'] := binaryReport.grph_NetSalesValue[actorID, catID];    

    jo.D['grph_ValueMarketShare'] := binaryReport.grph_ValueMarketShare[actorID, catID];
    jo.D['grph_VolumeMarketShare'] := binaryReport.grph_VolumeMarketShare[actorID, catID];

    jo.D['grph_NetSalesValueChange'] := binaryReport.grph_NetSalesValueChange[actorID, catID];
    jo.D['grph_ValueMarketShareChange'] := binaryReport.grph_ValueMarketShareChange[actorID, catID];
    jo.D['grph_VolumeMarketShareChange'] := binaryReport.grph_VolumeMarketShareChange[actorID, catID];
    jo.D['grph_SalesVolumeChange'] := binaryReport.grph_SalesVolumeChange[actorID, catID];

    result := jo;
  end;


  function actorInfoSchema(actorID : Integer; binaryReport : TGR_PerformanceHighlights): ISuperObject;
  var
    jo: ISuperObject;
    I, cat: Integer;
  begin
    jo := SO;
    jo.I['actorID'] := actorID;
    jo.D['grph_OperatingProfit'] := binaryReport.grph_OperatingProfit[actorID];
    jo.D['grph_OperatingProfitChange'] := binaryReport.grph_OperatingProfitChange[actorID];
    jo.D['grph_CumulativeInvestment'] := binaryReport.grph_CumulativeInvestment[actorID];
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
      oJsonFile.A['actorInfo'].Add( actorInfoSchema(actorID, currentResult.r_GeneralReport.gr_PerformanceHighlights) );

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

