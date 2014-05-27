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
    f_RetailersShoppersShare          = 126;

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

  procedure makeJson();
  var
    s_str : string;
    catID,marketID,brandID : Integer;
    tempBrand:TMR_BrandAwareness;
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
    oJsonFile.O['f_TradeSpendingEffectiveness']      := SA([]);
    oJsonFile.O['f_MarketingSpendingEffectiveness']  := SA([]);
    oJsonFile.O['f_PortfolioStrength']               := SA([]);
    oJsonFile.O['f_SuppliersBMValueSalesShare']      := SA([]);
    oJsonFile.O['f_SuppliersBMVolumeSalesShare']     := SA([]);
    oJsonFile.O['f_SuppliersBMShareOfShoppers']      := SA([]);
    oJsonFile.O['f_SuppliersOnlineValueSalesShare']  := SA([]);
    oJsonFile.O['f_SuppliersOnlineVolumeSalesShare'] := SA([]);
    oJsonFile.O['f_SuppliersOnlineShareOfShoppers']  := SA([]);
    oJsonFile.O['f_RetailersValueRotationIndex']     := SA([]);
    oJsonFile.O['f_RetailersVolumeRotationIndex']    := SA([]);
    oJsonFile.O['f_RetailersProfitabilityIndex']     := SA([]);
    oJsonFile.O['f_RetailersStocksCover']            := SA([]);
    oJsonFile.O['f_RetailersShoppersShare']          := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['f_DiscountsValue'].add(negotiationItemDetailsSchema(f_DiscountsValue, catID));
      oJsonFile.A['f_PerformanceBonusesValue'].add(negotiationItemDetailsSchema(f_PerformanceBonusesValue, catID));
      oJsonFile.A['f_OtherCompensationsValue'].add(negotiationItemDetailsSchema(f_OtherCompensationsValue, catID));     
    end;

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for period := Low(TTOPDays) to High(TTOPDays) do
      begin
        oJsonFile.A['f_TransactionsPerTOP'].add( transactionsPerTOPSchema() );
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
