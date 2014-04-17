program SCR_keyPerformanceIndicators;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const 
    scrkpi_TradeSpendingEffectiveness  = 100;
    scrkpi_MarketingEffectiveness      = 101;
    scrkpi_ChannelSalesValueShare      = 102;
    scrkpi_ChannelSalesVolumeShare     = 103;
    scrkpi_ShoppersShare               = 104;
    scrkpi_PortfolioStrength  = 105;
var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentProducer : TAllProducers;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;


  function categoryInfoSchema(fieldIdx : Integer; catID : Integer; binaryReprot : TSCR_CategoryKeyPerformanceIndicators):ISuperObject;
  var
    jo : ISuperObject;
    marketID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;

    case (fieldIdx) of
      scrkpi_TradeSpendingEffectiveness : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= 0;
        jo.A['value'].D[1]:= 0;
        jo.A['value'].D[2]:= binaryReprot.scrkpi_TradeSpendingEffectiveness;
      end;
      scrkpi_MarketingEffectiveness : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= 0;
        jo.A['value'].D[1]:=0;
        jo.A['value'].D[2]:= binaryReprot.scrkpi_MarketingEffectiveness;
      end;
      scrkpi_PortfolioStrength  : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= 0;
        jo.A['value'].D[1]:= 0;
        jo.A['value'].D[2]:= binaryReprot.scrkpi_PortfolioStrength;
      end;
      scrkpi_ChannelSalesValueShare   : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= binaryReprot.scrkpi_ChannelSalesValueShare[TRADITIONAL];
        jo.A['value'].D[1]:= binaryReprot.scrkpi_ChannelSalesValueShare[INTERNET];
        jo.A['value'].D[2]:= binaryReprot.scrkpi_ChannelSalesValueShare[TOTAL];
      end;
      scrkpi_ChannelSalesVolumeShare  : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= binaryReprot.scrkpi_ChannelSalesVolumeShare[TRADITIONAL];
        jo.A['value'].D[1]:= binaryReprot.scrkpi_ChannelSalesVolumeShare[INTERNET];
        jo.A['value'].D[2]:= binaryReprot.scrkpi_ChannelSalesVolumeShare[TOTAL];        
      end;
      scrkpi_ShoppersShare            : begin
        jo.O['value'] := SA([]);
        jo.A['value'].D[0]:= binaryReprot.scrkpi_ShoppersShare[TRADITIONAL];
        jo.A['value'].D[1]:= binaryReprot.scrkpi_ShoppersShare[INTERNET];
        jo.A['value'].D[2]:= binaryReprot.scrkpi_ShoppersShare[TOTAL];        
      end;
      else
        writeln('default');
      end;
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandCount,variantCount : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['producerID'] := currentProducer;

    //Consolidated Profit & Loss statement, suppliers
    oJsonFile.O['scrkpi_TradeSpendingEffectiveness'] := SA([]);
    oJsonFile.O['scrkpi_MarketingEffectiveness'] := SA([]);
    oJsonFile.O['scrkpi_PortfolioStrength'] := SA([]);
    oJsonFile.O['scrkpi_ChannelSalesValueShare'] := SA([]);
    oJsonFile.O['scrkpi_ChannelSalesVolumeShare'] := SA([]);
    oJsonFile.O['scrkpi_ShoppersShare'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['scrkpi_TradeSpendingEffectiveness'].Add( categoryInfoSchema(scrkpi_TradeSpendingEffectiveness, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_KeyPerformanceIndicators[catID] ) );
      oJsonFile.A['scrkpi_MarketingEffectiveness'].Add( categoryInfoSchema(scrkpi_MarketingEffectiveness, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].SCR_keyPerformanceIndicators[catID] ) );
      oJsonFile.A['scrkpi_PortfolioStrength'].Add( categoryInfoSchema(scrkpi_PortfolioStrength, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].SCR_keyPerformanceIndicators[catID] ) );
      oJsonFile.A['scrkpi_ChannelSalesValueShare'].Add( categoryInfoSchema(scrkpi_ChannelSalesValueShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].SCR_keyPerformanceIndicators[catID] ) );
      oJsonFile.A['scrkpi_ChannelSalesVolumeShare'].Add( categoryInfoSchema(scrkpi_ChannelSalesVolumeShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].SCR_keyPerformanceIndicators[catID] ) );
      oJsonFile.A['scrkpi_ShoppersShare'].Add( categoryInfoSchema(scrkpi_ShoppersShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].SCR_keyPerformanceIndicators[catID] ) );
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
          //initialise GET request parameters
          currentSeminar := getSeminar(sListData);
          currentPeriod := getPeriod(sListData);
          currentProducer := getProducerID(sListData);
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


