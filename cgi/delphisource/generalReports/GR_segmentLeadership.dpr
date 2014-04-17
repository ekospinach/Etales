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
  begin
    jo := SO;
    jo.I['varID'] := variant.leader_ID;
    jo.S['varName'] := variant.leader_Name;
    jo.I['parentBrandID'] := variant.leader_ParentBrandID;
    jo.S['parentBrandName'] := variant.leader_ParentBrandName;
    jo.D['share'] := variant.leader_Share;

    result := jo;
  end;

  function shopperInfoSchema(catID : Integer; marketID : Integer; segmentID : Integer; Shopper : TShoppersKind; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : string;    
    valueLeaders : TSegmentVariantLeaders;
    volumeLeaders : TSegmentVariantLeaders;
    i : Integer;
  begin
    jo := SO;
    case Shopper of
       BMS: ShopperStr := 'BMS'; 
       NETIZENS: ShopperStr := 'NETIZENS';   
       MIXED: ShopperStr := 'MIXED';  
       ALLSHOPPERS: ShopperStr := 'ALLSHOPPERS'; 
       else
        ShopperStr := 'wrong';
    end;

    jo.S['shopperKind'] := ShopperStr;
    jo.O['grsl_ValueLeaders'] := SA([]);
    jo.O['grsl_VolumeLeaders'] := SA([]);

    valueLeaders := binaryReport.grsl_ValueLeaders[marketID, catID, segmentID, Shopper];
    volumeLeaders := binaryReport.grsl_VolumeLeaders[marketID, catID, segmentID, Shopper];
    for i := Low(TLeaders) to High(TLeaders) do begin
      jo.A['grsl_ValueLeaders'].add( variantInfoSchema( valueLeaders[i]) );    
      jo.A['grsl_VolumeLeaders'].add( variantInfoSchema( volumeLeaders[i]) );
    end;

    result := jo;
  end;

  function segmentInfoSchema(catID : Integer; marketID : Integer; segmentID : Integer; binaryReport : TGR_SegmentLeadership):ISuperObject;
  var
    jo : ISuperObject;
    Shopper : TShoppersKind;
  begin
    jo := SO;
    jo.I['segmentID'] := segmentID;
    jo.O['shopperInfo'] := SA([]);
    for shopper := Low(TShoppersKind) to High(TShoppersKind) do
      jo.A['shopperInfo'].Add( shopperInfoSchema(catID, marketID, segmentID, Shopper, binaryReport) );

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

