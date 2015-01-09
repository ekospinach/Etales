program GR_segmentLeadership;


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

  function variantInfoSchema(variant : TSegmentVariantLeader):ISuperObject;
  var 
    jo : ISuperObject;
    LeaderName : AnsiString;
  begin
    LeaderName := variant.leader_ParentBrandName;
    LeaderName := LeaderName + variant.leader_Name;
    jo := SO;
    jo.I['varID'] := variant.leader_ID;
    jo.S['varName'] := LeaderName;
    jo.I['parentBrandID'] := variant.leader_ParentBrandID;
    jo.S['parentBrandName'] := variant.leader_ParentBrandName;
    jo.D['share'] := variant.leader_Share;

    result := jo;
  end;


  function divisionInfoSchema(catID : Integer; marketID : Integer; segmentID : Integer; division : TProducerDivisions; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    divisionStr : string;
    valueLeaders : TSegmentVariantLeaders;
    volumeLeaders : TSegmentVariantLeaders;
    i : Integer;
  begin
    jo := SO;
    case division of
       TRADITIONAL: divisionStr := 'TRADITIONAL'; 
       INTERNET: divisionStr := 'INTERNET';   
       CORPORATE: divisionStr := 'CORPORATE';  
       else
        divisionStr := 'wrong';
    end;

    jo.S['divisionKind'] := divisionStr;
    jo.O['grsl_ValueLeaders'] := SA([]);
    jo.O['grsl_VolumeLeaders'] := SA([]);

    valueLeaders := binaryReport.grsl_ValueLeaders[marketID, catID, segmentID, division];
    volumeLeaders := binaryReport.grsl_VolumeLeaders[marketID, catID, segmentID, division];
    for i := Low(TLeaders) to High(TLeaders) do begin
      jo.A['grsl_ValueLeaders'].add( variantInfoSchema( valueLeaders[i]) );    
      jo.A['grsl_VolumeLeaders'].add( variantInfoSchema( volumeLeaders[i]) );
    end;

    result := jo;
  end;


  function segmentInfoSchema(catID : Integer; marketID : Integer; segmentID : Integer; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    division : TProducerDivisions;
  begin
    jo := SO;
    jo.I['segmentID'] := segmentID;
    jo.O['divisionInfo'] := SA([]);
    for division := Low(TProducerDivisions) to High(TProducerDivisions) do
      jo.A['divisionInfo'].Add( divisionInfoSchema(catID, marketID, segmentID, division, binaryReport) );

    result := jo;
  end;

  function marketInfoSchema(catID : Integer; marketID : Integer; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    segmentID : Integer;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.O['segmentInfo'] := SA([]);
    for segmentID := Low(TSegmentsTotal) to High(TSegmentsTotal) do
      jo.A['segmentInfo'].Add( segmentInfoSchema(catID, marketID, segmentID, binaryReport) );

    result := jo;  
  end;

  function categoryInfoSchema(catID : Integer; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    marketID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['marketInfo'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['marketInfo'].add( marketInfoSchema(catID, marketID, binaryReport) );

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.O['categoryInfo'] := SA([]);
    for catID := Low(TCategories) to High(TCategories) do
      oJsonFile.A['categoryInfo'].Add( categoryInfoSchema(catID, currentResult.r_GeneralReport.GR_segmentLeadership) );

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

