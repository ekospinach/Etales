program BG_feedbackSlides;

//Original :: DelphiCGI Developed by Andrea Russo - Italy
//email: andrusso@yahoo.com

{$IFNDEF LINUX}
  {$IFDEF FPC}
    {$IFDEF UNIX}
      {$DEFINE LINUX}
    {$ENDIF}
  {$ENDIF}
{$ENDIF}

{$IFDEF FPC}
 {$mode objfpc}{$H+}
{$ELSE}
 {$APPTYPE CONSOLE}
{$ENDIF}

uses
  SysUtils,

  {$IFDEF LINUX}
    {$IFDEF FPC}
      dos,
    {$ELSE}
      Libc,
    {$ENDIF}
  {$ELSE}
    Windows,
  {$ENDIF}
  Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles, CgiCommonFunction;

const
    f_DiscountsValue                  = 100;
    f_PerformanceBonusesValue         = 101;
    f_OtherCompensationsValue         = 102;
    f_TransactionsPerTOP              = 103;
    f_MarketSalesVolume               = 104;
    f_MarketSalesValue                = 105;
    f_VolumeMarketShares              = 106;
    f_ValueMarketShares               = 107;
    f_OperatingProfit                 = 108;
    f_OperatingProfitMargin           = 109;
    f_NetProfit                       = 110;
    f_NetProfitMargin                 = 111;
    f_ShelfSpaceAllocation            = 112;
    f_TradeSpendingEffectiveness      = 113;
    f_MarketingSpendingEffectiveness  = 114;
    f_PortfolioStrength               = 115;
    f_SuppliersBMValueSalesShare      = 116;
    f_SuppliersBMVolumeSalesShare     = 117;
    f_SuppliersBMShareOfShoppers      = 118;
    f_SuppliersOnlineValueSalesShare  = 119;
    f_SuppliersOnlineVolumeSalesShare = 120;
    f_SuppliersOnlineShareOfShoppers  = 121;

    f_RetailersValueRotationIndex     = 122;
    f_RetailersVolumeRotationIndex    = 123;
    f_RetailersProfitabilityIndex     = 124;
    f_RetailersStocksCover            = 125;
    f_RetailersBMShoppersShare          = 126;
    f_RetailersAllShoppersShare          = 127;
    
    f_GrossProfit                     = 128; 
    f_GrossProfitMargin               = 129;

    f_ShoppersShare                   = 131; 
var
  //decision: TDecision;
  jo : ISuperObject;
  ctx: TSuperRttiContext;
  sValue: string;
  team: Integer;
  DataDirectory: string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  sListData: tStrings;
  oJsonFile : ISuperObject;


  function retailerInfoSchema(idx : Integer; catID : Integer; retailerID : Integer) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['retailerID'] := retailerID;
    case (idx) of
      f_DiscountsValue          : begin jo.D['value'] := currentResult.r_Feedback.f_DiscountsValue[catID].fcni_RetailersBenefits[retailerID] end;
      f_PerformanceBonusesValue : begin jo.D['value'] := currentResult.r_Feedback.f_PerformanceBonusesValue[catID].fcni_RetailersBenefits[retailerID]; end;
      f_OtherCompensationsValue : begin jo.D['value'] := currentResult.r_Feedback.f_OtherCompensationsValue[catID].fcni_RetailersBenefits[retailerID]; end;        
    end;
    result := jo;
  end;

  function supplierInfoSchema(idx : Integer; catID : Integer; producerID : Integer) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['supplierID'] := producerID;
    case (idx) of
      f_DiscountsValue          : begin jo.D['value'] := currentResult.r_Feedback.f_DiscountsValue[catID].fcni_SuppliersCost[producerID] end;
      f_PerformanceBonusesValue : begin jo.D['value'] := currentResult.r_Feedback.f_PerformanceBonusesValue[catID].fcni_SuppliersCost[producerID]; end;
      f_OtherCompensationsValue : begin jo.D['value'] := currentResult.r_Feedback.f_OtherCompensationsValue[catID].fcni_SuppliersCost[producerID]; end;        
    end;
    result := jo;
  end;

  function negotiationItemDetailsSchema(idx : integer; catID : Integer) : ISuperObject;
  var
    jo : ISuperObject;
    producerID,retailerID : Integer;
  begin    
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['fcni_SuppliersCost'] := SA([]);
    jo.O['fcni_RetailersBenefits'] := SA([]);

    for producerID := Low(TProducers) to High(TProducers) do
    begin
      jo.A['fcni_SuppliersCost'].Add( supplierInfoSchema(idx, catID, producerID));
    end;

    for retailerID := Low(TBMRetailers) to High(TBMRetailers) do
    begin
      jo.A['fcni_RetailersBenefits'].Add( retailerInfoSchema(idx, catID, retailerID));
    end;

    result := jo;
  end;

  function transactionsPerTOPSchema(catID : Integer; topDays : Integer) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['topDays'] := topDays;
    jo.D['value'] := currentResult.r_Feedback.f_TransactionsPerTOP[catID, topDays];
    result := jo;
  end;



  function marketResultSchema(idx : integer; catID : integer; period:integer; actorID : integer) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['period'] := period;
    jo.I['actorID'] := actorID;

    case (idx) of
      f_MarketSalesVolume     : begin jo.D['value'] := currentResult.r_Feedback.f_MarketSalesVolume[catID, period, actorID]; end; 
      f_MarketSalesValue      : begin jo.D['value'] := currentResult.r_Feedback.f_MarketSalesValue[catID, period, actorID]; end;
      f_VolumeMarketShares    : begin jo.D['value'] := currentResult.r_Feedback.f_VolumeMarketShares[catID, period, actorID]; end;
      f_ValueMarketShares     : begin jo.D['value'] := currentResult.r_Feedback.f_ValueMarketShares[catID, period, actorID]; end;
      f_OperatingProfit       : begin jo.D['value'] := currentResult.r_Feedback.f_OperatingProfit[catID, period, actorID]; end;
      f_OperatingProfitMargin : begin jo.D['value'] := currentResult.r_Feedback.f_OperatingProfitMargin[catID, period, actorID]; end;
      f_NetProfit             : begin jo.D['value'] := currentResult.r_Feedback.f_NetProfit[catID, period, actorID]; end;
      f_NetProfitMargin       : begin jo.D['value'] := currentResult.r_Feedback.f_NetProfitMargin[catID, period, actorID]; end;
      f_ShelfSpaceAllocation  : begin jo.D['value'] := currentResult.r_Feedback.f_ShelfSpaceAllocation[catID, period, actorID]; end;

      f_GrossProfit  : begin jo.D['value'] := currentResult.r_Feedback.f_GrossProfit[catID, period, actorID]; end;
      f_GrossProfitMargin  : begin jo.D['value'] := currentResult.r_Feedback.f_GrossProfitMargin[catID, period, actorID]; end;

    end;

    result := jo;
  end;

  function supplierKPIinfoSchema(idx : integer; catID : integer; period : integer; producerID : integer) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['supplierID'] := producerID;
    jo.I['categoryID'] := catID;
    jo.I['period'] := period;

    case (idx) of
      f_TradeSpendingEffectiveness      : begin jo.D['value'] := currentResult.r_Feedback.f_TradeSpendingEffectiveness[catID, period, producerID]; end; 
      f_MarketingSpendingEffectiveness  : begin jo.D['value'] := currentResult.r_Feedback.f_MarketingSpendingEffectiveness[catID, period, producerID]; end;
      //f_PortfolioStrength               : begin jo.D['value'] := currentResult.r_Feedback.f_PortfolioStrength[catID, period, producerID]; end;
      f_SuppliersBMValueSalesShare      : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersBMValueSalesShare[catID, period, producerID]; end;
      f_SuppliersBMVolumeSalesShare     : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersBMVolumeSalesShare[catID, period, producerID]; end;
      f_SuppliersBMShareOfShoppers      : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersBMShareOfShoppers[catID, period, producerID]; end;
      f_SuppliersOnlineValueSalesShare  : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersOnlineValueSalesShare[catID, period, producerID]; end;
      f_SuppliersOnlineVolumeSalesShare : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersOnlineVolumeSalesShare[catID, period, producerID]; end;
      f_SuppliersOnlineShareOfShoppers  : begin jo.D['value'] := currentResult.r_Feedback.f_SuppliersOnlineShareOfShoppers[catID, period, producerID]; end;
    end;  

    result := jo;
  end;  

  function supplierKPIExtendedinfoSchema(idx : integer; catID : integer; period : integer; ownerID : integer) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['ownerID'] := ownerID;
    jo.I['categoryID'] := catID;
    jo.I['period'] := period;

    case (idx) of
      f_PortfolioStrength      : begin jo.D['value'] := currentResult.r_Feedback.f_PortfolioStrength[catID, period, ownerID]; end; 
    end;  

    result := jo;
  end;   

  function retailerKPIinfoSchema(idx : integer; catID : integer; period : Integer; retailerID : integer; marketID : integer) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['retailerID'] := retailerID;
    jo.I['categoryID'] := catID;
    jo.I['period'] := period;
    jo.I['marketID'] := marketID;

    case (idx) of
      f_RetailersValueRotationIndex     : begin jo.D['value'] := currentResult.r_Feedback.f_RetailersValueRotationIndex[marketID, catID, period, retailerID]; end;
      f_RetailersVolumeRotationIndex    : begin jo.D['value'] := currentResult.r_Feedback.f_RetailersVolumeRotationIndex[marketID, catID, period, retailerID]; end;
      f_RetailersProfitabilityIndex     : begin jo.D['value'] := currentResult.r_Feedback.f_RetailersProfitabilityIndex[marketID, catID, period, retailerID]; end;
      f_RetailersStocksCover            : begin jo.D['value'] := currentResult.r_Feedback.f_RetailersStocksCover[marketID, catID, period, retailerID]; end;
    end;

    result := jo;
    // currentResult.r_Feedback.f_RetailersValueRotationIndex[marketID, catID]
  end;

  function shopperShareinfoSchema(idx : integer; marketID : integer; period : integer; actorID : integer; shopper : TShoppersKind) : ISuperObject;
  var 
    jo : ISuperObject;
    ShopperStr : String;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['actorID'] := actorID;
    jo.I['period'] := period;
    case Shopper of
         BMS         : ShopperStr := 'BMS';
         NETIZENS    : ShopperStr := 'NETIZENS';
         MIXED       : ShopperStr := 'MIXED';
         ALLSHOPPERS : ShopperStr := 'ALLSHOPPERS';
     else
     ShopperStr  := 'wrong';
     end;

    jo.S['shopperKind'] := ShopperStr;

    case (idx) of
      f_ShoppersShare      : begin jo.D['value'] := currentResult.r_Feedback.f_ShoppersShare[marketID, period, shopper, actorID]; end;
    end;  

    result := jo;
  end; 


  procedure makeJson();
  var
    s_str : string;
    catID,marketID,brandID,topDays,period,actorID, producerID, retailerID: Integer;
    tempBrand:TMR_BrandAwareness;
    Shopper : TShoppersKind;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['f_DiscountsValue']                  := SA([]);
    oJsonFile.O['f_PerformanceBonusesValue']         := SA([]);
    oJsonFile.O['f_OtherCompensationsValue']         := SA([]);
    oJsonFile.O['f_TransactionsPerTOP']              := SA([]);

    oJsonFile.O['f_MarketSalesVolume']               := SA([]);
    oJsonFile.O['f_MarketSalesValue']                := SA([]);
    oJsonFile.O['f_VolumeMarketShares']              := SA([]);
    oJsonFile.O['f_ValueMarketShares']               := SA([]);
    oJsonFile.O['f_OperatingProfit']                 := SA([]);
    oJsonFile.O['f_OperatingProfitMargin']           := SA([]);
    oJsonFile.O['f_NetProfit']                       := SA([]);
    oJsonFile.O['f_NetProfitMargin']                 := SA([]);
    oJsonFile.O['f_ShelfSpaceAllocation']            := SA([]);
    oJsonFile.O['f_GrossProfit']       := SA([]);
    oJsonFile.O['f_GrossProfitMargin'] := SA([]);


    oJsonFile.O['f_TradeSpendingEffectiveness']      := SA([]);
    oJsonFile.O['f_MarketingSpendingEffectiveness']  := SA([]);
    oJsonFile.O['f_SuppliersBMValueSalesShare']      := SA([]);
    oJsonFile.O['f_SuppliersBMVolumeSalesShare']     := SA([]);
    oJsonFile.O['f_SuppliersBMShareOfShoppers']      := SA([]);
    oJsonFile.O['f_SuppliersOnlineValueSalesShare']  := SA([]);
    oJsonFile.O['f_SuppliersOnlineVolumeSalesShare'] := SA([]);
    oJsonFile.O['f_SuppliersOnlineShareOfShoppers']  := SA([]);

    oJsonFile.O['f_PortfolioStrength']               := SA([]);

    oJsonFile.O['f_RetailersValueRotationIndex']     := SA([]);
    oJsonFile.O['f_RetailersVolumeRotationIndex']    := SA([]);
    oJsonFile.O['f_RetailersProfitabilityIndex']     := SA([]);
    oJsonFile.O['f_RetailersStocksCover']            := SA([]);
    // oJsonFile.O['f_RetailersBMShoppersShare']          := SA([]);
    // oJsonFile.O['f_RetailersAllShoppersShare']          := SA([]);
     oJsonFile.O['f_ShoppersShare']          := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['f_DiscountsValue'].add(negotiationItemDetailsSchema(f_DiscountsValue, catID));
      oJsonFile.A['f_PerformanceBonusesValue'].add(negotiationItemDetailsSchema(f_PerformanceBonusesValue, catID));
      oJsonFile.A['f_OtherCompensationsValue'].add(negotiationItemDetailsSchema(f_OtherCompensationsValue, catID));     
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for topDays:= Low(TTOPDays) to High(TTOPDays) do
      begin
        oJsonFile.A['f_TransactionsPerTOP'].add( transactionsPerTOPSchema(catID, topDays));
      end;
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for actorID := Low(TActors) to High(TActors) do
        begin
          oJsonFile.A['f_MarketSalesVolume'].add( marketResultSchema(f_MarketSalesVolume, catID, period, actorID) );    
          oJsonFile.A['f_MarketSalesValue'].add( marketResultSchema(f_MarketSalesValue, catID, period, actorID) );         
          oJsonFile.A['f_VolumeMarketShares'].add( marketResultSchema(f_VolumeMarketShares, catID, period, actorID) );       
          oJsonFile.A['f_ValueMarketShares'].add( marketResultSchema(f_ValueMarketShares, catID, period, actorID) );        
          oJsonFile.A['f_OperatingProfit'].add( marketResultSchema(f_OperatingProfit, catID, period, actorID) );          
          oJsonFile.A['f_OperatingProfitMargin'].add( marketResultSchema(f_OperatingProfitMargin, catID, period, actorID) );    
          oJsonFile.A['f_NetProfit'].add( marketResultSchema(f_NetProfit, catID, period, actorID) );                
          oJsonFile.A['f_NetProfitMargin'].add( marketResultSchema(f_NetProfitMargin, catID, period, actorID) );          
          oJsonFile.A['f_ShelfSpaceAllocation'].add( marketResultSchema(f_ShelfSpaceAllocation, catID, period, actorID) );     

          oJsonFile.A['f_GrossProfit'].add( marketResultSchema(f_GrossProfit, catID, period, actorID) );     
          oJsonFile.A['f_GrossProfitMargin'].add( marketResultSchema(f_GrossProfitMargin, catID, period, actorID) );     

        end;
      end;
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for producerID := Low(TProducers) to High(TProducers) do
        begin
          oJsonFile.A['f_TradeSpendingEffectiveness'].add( supplierKPIinfoSchema(f_TradeSpendingEffectiveness, catID, period, producerID) );
          oJsonFile.A['f_MarketingSpendingEffectiveness'].add( supplierKPIinfoSchema(f_MarketingSpendingEffectiveness, catID, period, producerID) ); 
          //oJsonFile.A['f_PortfolioStrength'].add( supplierKPIinfoSchema(f_PortfolioStrength, catID, period, producerID) );              
          oJsonFile.A['f_SuppliersBMValueSalesShare'].add( supplierKPIinfoSchema(f_SuppliersBMValueSalesShare, catID, period, producerID) );     
          oJsonFile.A['f_SuppliersBMVolumeSalesShare'].add( supplierKPIinfoSchema(f_SuppliersBMVolumeSalesShare, catID, period, producerID) );    
          oJsonFile.A['f_SuppliersBMShareOfShoppers'].add( supplierKPIinfoSchema(f_SuppliersBMShareOfShoppers, catID, period, producerID) );     
          oJsonFile.A['f_SuppliersOnlineValueSalesShare'].add( supplierKPIinfoSchema(f_SuppliersOnlineValueSalesShare, catID, period, producerID) ); 
          oJsonFile.A['f_SuppliersOnlineVolumeSalesShare'].add( supplierKPIinfoSchema(f_SuppliersOnlineVolumeSalesShare, catID, period, producerID) );
          oJsonFile.A['f_SuppliersOnlineShareOfShoppers'].add( supplierKPIinfoSchema(f_SuppliersOnlineShareOfShoppers, catID, period, producerID) ); 
        end;
      end;
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for producerID := Low(TBrandOwners) to High(TBrandOwners) do
        begin
          oJsonFile.A['f_PortfolioStrength'].add( supplierKPIExtendedinfoSchema(f_PortfolioStrength, catID, period, producerID) );              
        end;
      end;
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for retailerID := Low(TModernRetailers) to High(TModernRetailers) do
        begin
          for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
          begin
            oJsonFile.A['f_RetailersValueRotationIndex'].add( retailerKPIinfoSchema(f_RetailersValueRotationIndex, catID, period, retailerID, marketID) );
            oJsonFile.A['f_RetailersVolumeRotationIndex'].add( retailerKPIinfoSchema(f_RetailersVolumeRotationIndex, catID, period, retailerID, marketID) );
            oJsonFile.A['f_RetailersProfitabilityIndex'].add( retailerKPIinfoSchema(f_RetailersProfitabilityIndex, catID, period, retailerID, marketID) );
            oJsonFile.A['f_RetailersStocksCover'].add( retailerKPIinfoSchema(f_RetailersStocksCover, catID, period, retailerID, marketID) );
            // oJsonFile.A['f_RetailersBMShoppersShare'].add( retailerKPIinfoSchema(f_RetailersBMShoppersShare, catID, period, retailerID, marketID) );
            // oJsonFile.A['f_RetailersAllShoppersShare'].add( retailerKPIinfoSchema(f_RetailersAllShoppersShare, catID, period, retailerID, marketID) );

          end;
        end;
      end;
    end;

    for actorID := Low(TActors) to High(TActors) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
          for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
          begin
            for Shopper := Low(TShoppersKind) to High(TShoppersKind) do
            oJsonFile.A['f_ShoppersShare'].add( ShopperShareinfoSchema(f_ShoppersShare, marketID, period, actorID, Shopper) );
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
   // sDati := '';
    sListData := TStringList.Create;
    sListData.Clear;

  try
    WriteLn('Content-type: application/json');

    //ctx := TSuperRttiContext.Create;

    sValue := getVariable('REQUEST_METHOD');
    if sValue='GET' then
    begin
        // GET
        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
        LoadConfigIni(DataDirectory, getSeminar(sListData));
        // initialize globals
        currentSeminar := getSeminar(sListData);
        currentPeriod := getPeriod(sListData);
        {** Read results file **}
        vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,
          currentResult); // read Results file

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


        // Writeln(IntToStr(vReadRes));

        // jo := ctx.AsJson<TFeedback>(currentResult.r_Feedback);
        //        Writeln(jo.AsJSon(False, True));

    end
  finally
    sListData.Free;
    Writeln;  
  end;


end.
