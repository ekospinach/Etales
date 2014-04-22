program SCR_channelsProfitability;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const 
    scrcp_VolumeOrdered    = 101;
    scrcp_VolumeSold       = 102;
    scrcp_VolumeSoldShare  = 103;
    scrcp_SalesValue       = 104;
    scrcp_SalesValueShare  = 105;
    scrcp_CostOfGoodsSold  = 106;
    scrcp_TradeSupport     = 107;
    scrcp_TradeProfit      = 108;
    scrcp_TradeProfitShare = 109;

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

  function accountInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; accountID:Integer; binaryReprot : TSCR_ChannelsProfitability):ISuperObject;
  var
    jo : ISuperObject;        
  begin
    jo := SO;
    jo.I['accountID'] := accountID;
    case (fieldIdx) of
      scrcp_VolumeOrdered    : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_VolumeOrdered; end;
      scrcp_VolumeSold       : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_VolumeSold; end;
      scrcp_VolumeSoldShare  : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_VolumeSoldShare; end;
      scrcp_SalesValue       : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_SalesValue; end;
      scrcp_SalesValueShare  : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_SalesValueShare; end;
      scrcp_CostOfGoodsSold  : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_CostOfGoodsSold; end;
      scrcp_TradeSupport     : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_TradeSupport; end;
      scrcp_TradeProfit      : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_TradeProfit; end;
      scrcp_TradeProfitShare : begin jo.D['value'] := binaryReprot[catID, accountID, marketID].scrcp_TradeProfitShare; end;
    end;
    
    result := jo;    
  end;

  function marketInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; binaryReprot : TSCR_ChannelsProfitability):ISuperObject;
  var 
    jo : ISuperObject;
    accountID : Integer;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.O['accountInfo'] := SA([]);
    for accountID := Low(TAccounts) to high(TAccounts) do 
    begin
      jo.A['accountInfo'].Add( accountInfoSchema( fieldIdx, catID, marketID, accountID, binaryReprot) );      
    end;    

    result := jo;
  end;

  function categoryInfoSchema(fieldIdx : Integer; catID : Integer; binaryReprot : TSCR_ChannelsProfitability):ISuperObject;
  var
    jo : ISuperObject;
    marketID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['marketInfo'] := SA([]);
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      jo.A['marketInfo'].Add( marketInfoSchema(fieldIdx, catID, marketID, binaryReprot) );      
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
    oJsonFile.O['scrcp_VolumeOrdered'] := SA([]);
    oJsonFile.O['scrcp_VolumeSold'] := SA([]);
    oJsonFile.O['scrcp_VolumeSoldShare'] := SA([]);
    oJsonFile.O['scrcp_SalesValue'] := SA([]);
    oJsonFile.O['scrcp_SalesValueShare'] := SA([]);
    oJsonFile.O['scrcp_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['scrcp_TradeSupport'] := SA([]);
    oJsonFile.O['scrcp_TradeProfit'] := SA([]);
    oJsonFile.O['scrcp_TradeProfitShare'] := SA([]);


    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['scrcp_VolumeOrdered'].Add( categoryInfoSchema(scrcp_VolumeOrdered, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_VolumeSold'].Add( categoryInfoSchema(scrcp_VolumeSold, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_VolumeSoldShare'].Add( categoryInfoSchema(scrcp_VolumeSoldShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_SalesValue'].Add( categoryInfoSchema(scrcp_SalesValue, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_SalesValueShare'].Add( categoryInfoSchema(scrcp_SalesValueShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_CostOfGoodsSold'].Add( categoryInfoSchema(scrcp_CostOfGoodsSold, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_TradeSupport'].Add( categoryInfoSchema(scrcp_TradeSupport, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_TradeProfit'].Add( categoryInfoSchema(scrcp_TradeProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
      oJsonFile.A['scrcp_TradeProfitShare'].Add( categoryInfoSchema(scrcp_TradeProfitShare, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ProfitabilityByChannels ));
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


