program MR_webTrawlerScores;


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


  function playerInfoSchema(actorID : Integer; player :  TWebTrawlerIndices) : ISuperObject;
  var
    jo : ISuperObject;

  begin
    jo := SO;

    jo.I['actorID'] := actorID;
    jo.D['sentimentIdx'] := player[SENTIMENT];
    jo.D['strengthIdx'] := player[STRENGTH];

    result := jo;

  end;
  function brandInfoSchema(catID : Integer; brand: TMR_WebTrawlerBrandScore) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;

    jo.I['categoryID'] := catID;
    jo.S['brandName'] := brand.mrwtb_BrandName;
    jo.I['parentCompanyID'] := brand.mrwtb_ParentCompanyID;
    jo.D['sentimentIdx'] := brand.mrwtb_WebTrawlerIndices[SENTIMENT];
    jo.D['strengthIdx'] := brand.mrwtb_WebTrawlerIndices[STRENGTH];

    result := jo;


  end;

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,brandID,actorID : Integer;
    tempBrand : TMR_WebTrawlerBrandScore;
    tempPlayer : TWebTrawlerIndices;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['brandInfo'] := SA([]);
    oJsonFile.O['playerInfo'] := SA([]);

    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandID := Low(TBrands) to High(TBrands) do 
        begin
          tempBrand := currentResult.r_MarketResearch.mr_socialNetworksTrawler.mrwt_brands[catID, brandID];
          if(tempBrand.mrwtb_BrandName <> '') then
          begin
            oJsonFile.A['brandInfo'].add( brandInfoSchema(catID, tempBrand) );
          end;
        end;
    end;

    for actorID := Low(TActors) to High(TActors) do
    begin
      tempPlayer := currentResult.r_MarketResearch.mr_socialNetworksTrawler.mrwt_Players[actorID];
      oJsonFile.A['playerInfo'].add( playerInfoSchema(actorID, tempPlayer) );
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

