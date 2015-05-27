program BG_extendedFeedbackSlides;

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


  function variantOnlineAvailabilitySchema(categoryID : integer; variant :  TXF_VariantAvailability) : ISuperObject;
  var
    jo : ISuperObject;    
  begin
    jo := SO;
    jo.I['categoryID'] := categoryID;

    jo.S['variantName'] := variant.xfva_VariantName;
    jo.S['parentBrandName'] := variant.xfva_ParentBrandName;
    jo.D['shelfSpace'] := variant.xfva_ShelfSpace;
    jo.D['inventoryVolume'] := variant.xfva_InventoryVolume;

    result := jo;
  end;

  function variantStoreAvailabilitySchema(marketID : integer; categoryID : integer; retailerID : integer; variant : TXF_VariantAvailability) : ISuperObject;
  var
    jo : ISuperObject;    
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['BMRetailerID'] := retailerID;

    jo.S['variantName'] := variant.xfva_VariantName;
    jo.S['parentBrandName'] := variant.xfva_ParentBrandName;
    jo.D['shelfSpace'] := variant.xfva_ShelfSpace;
    jo.D['inventoryVolume'] := variant.xfva_InventoryVolume;

    result := jo;
  end;


  function retailersProfitabilityPerSupplierSchema(marketID : integer; categoryID : integer; retailerID : integer; supplierID : integer; info : TXF_RetailerProfitsPerSupplier ) : ISuperObject;
  var
    jo : ISuperObject;    
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['BMRetailerID'] := retailerID;
    jo.I['supplierID'] := supplierID;

    jo.D['xfrpps_ShelfSpace'] := info.xfrpps_ShelfSpace;                    
    jo.D['xfrpps_SalesValue'] := info.xfrpps_SalesValue;                    
    jo.D['xfrpps_Rotation'] := info.xfrpps_Rotation;                      
    jo.D['xfrpps_SalesValueShare'] := info. xfrpps_SalesValueShare;               
    jo.D['xfrpps_GrossContribution'] := info.xfrpps_GrossContribution;             
    jo.D['xfrpps_GrossContributionPerShelfSpace'] := info.xfrpps_GrossContributionPerShelfSpace;
    jo.D['xfrpps_GrossContributionShare'] := info.xfrpps_GrossContributionShare;        

    result := jo;
  end;

  function suppliersProfitabilityPerCustomerSchema(marketID : integer; categoryID : integer; producerID : integer; accountID : integer; info : TXF_SupplierProfitsPerCustomer) : ISuperObject;
  var
    jo : ISuperObject;    
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['supplierID'] := producerID;
    jo.I['accountID'] := accountID;

    jo.D['xfsppr_SalesValue'] := info.xfsppr_SalesValue;      
    jo.D['xfsppr_GrossProfit'] := info.xfsppr_GrossProfit;       
    jo.D['xfsppr_TradeSupport'] := info.xfsppr_TradeSupport;    
    jo.D['xfsppr_TradeProfit'] := info.xfsppr_TradeProfit;  
    jo.D['xfsppr_VisibilityShare'] := info.xfsppr_VisibilityShare; 
    jo.D['xfsppr_TradeSupportShare'] := info.xfsppr_TradeSupportShare;   
    jo.D['xfsppr_SalesValueShare'] := info.xfsppr_SalesValueShare; 
    jo.D['xfsppr_GrossProfitShare'] := info.xfsppr_GrossProfitShare;
    jo.D['xfsppr_TradeProfitShare'] := info.xfsppr_TradeProfitShare;    

    result := jo;
  end;

  function shoppersSegmentsSchema(marketID : integer; categoryID:integer; period:integer; data:TXF_OneShoppersSegmentDetails ) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;

    jo.I['period'] := period;
    jo.I['categoryID'] := categoryID;
    jo.I['marketID'] := marketID;
    jo.D['totalMarket'] := data.xfss_TotalMarket;
    jo.D['BMS_importance'] := data.xfss_Importance[BMS];
    jo.D['NETIZENS_importance'] := data.xfss_Importance[NETIZENS];
    jo.D['MIXED_importance'] := data.xfss_Importance[MIXED];
    jo.D['ALLSHOPPERS_importance'] := data.xfss_Importance[ALLSHOPPERS];

    result := jo;

  end;

  function channelShoppersSegmentsRetailSalesValueSchema(marketID : integer; categoryID:integer; period:integer; shopper : TShoppersKind; storeID : integer; data:TXF_ShoppersSegmentStoreDetails ) : ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : String;
  begin
    jo := SO;

    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
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
     jo.I['storeID'] := storeID;
     jo.D['absolute'] := data.xfsss_Absolute;
     jo.D['importance'] := data.xfsss_Importance;

     result := jo;
  end;

  function marketRetailerBrandOwnerSchema(marketID : integer; categoryID : integer; period:integer; BMRetailerID:integer; ownerID :integer) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;

    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['period'] := period;
    jo.I['BMRetailerID'] := BMRetailerID;
    jo.I['brandOwnerID'] := ownerID;
    jo.D['value'] := currentResult.r_ExtendedFeedback.xf_RetailerGrossProfitPerBrandOwner[marketID, categoryID, period, BMRetailerID, ownerID];

    result := jo;
  end;

  function marketStoreSchema(marketID : integer; categoryID: integer; period:integer; storeID:integer; data : single ) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['period'] := period;
    jo.I['storeID'] := storeID;
    jo.D['value'] := data;
    
    result := jo;
  end;


  procedure makeJson();
  var
    s_str : string;
    accountID, catID,ownerID,marketID,brandID,topDays,period,actorID, producerID, retailerID,storeID, supplierID, evaluationIdx, categoryID,variantID, BMRetailerID: Integer;
    tempBrand:TMR_BrandAwareness;
    Shopper : TShoppersKind;

    tempVariantAvailability : TXF_VariantAvailability;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['xf_AvailabilityAtBMStores']                             := SA([]);
    oJsonFile.O['xf_AvailabilityOnline']                                 := SA([]);
    oJsonFile.O['xf_RetailersProfitabilityPerSupplier']                  := SA([]);
    oJsonFile.O['xf_SuppliersProfitabilityPerCustomer']                  := SA([]);

    oJsonFile.O['xf_ShoppersSegmentsShares']                  := SA([]);
    oJsonFile.O['xf_ChannelShoppersSegmentsRetailSalesValue'] := SA([]);
    oJsonFile.O['xf_RetailerGrossProfitPerBrandOwner']        := SA([]);

    oJsonFile.O['xf_StoreGrossProfitMargin']                  := SA([]);
    oJsonFile.O['xf_StoreOperatingProfitMargin']              := SA([]);
    oJsonFile.O['xf_StoreNetProfitMargin']                    := SA([]);


    for marketID := Low(TMarkets) to High(TCategories) do
    begin
      for categoryID := Low(TCategories) to High(TCategories) do
      begin
        for retailerID := Low(TBMRetailers) to High(TBMRetailers) do
        begin
          for variantID := Low(TVariants) to High(TVariants) do
          begin
              tempVariantAvailability := currentResult.r_ExtendedFeedback.xf_AvailabilityAtBMStores[marketID, categoryID, retailerID, variantID];
              if (tempVariantAvailability.xfva_VariantName <> '') then
              begin
                oJsonFile.A['xf_AvailabilityAtBMStores'].add( variantStoreAvailabilitySchema(marketID, categoryID, retailerID, tempVariantAvailability ) );
              end;
          end;
        end;
      end;
    end;

    for categoryID := Low(TCategories) to High(TCategories) do
    begin
      for producerID := Low(TAllProducers) to High(TAllProducers) do
      begin
        for variantID := Low(TProVariants) to High(TProVariants) do
        begin
          tempVariantAvailability := currentResult.r_ExtendedFeedback.xf_AvailabilityOnline[categoryID, producerID, variantID];
          if(tempVariantAvailability.xfva_VariantName <> '')then
          begin
            oJsonFile.A['xf_AvailabilityOnline'].add( variantOnlineAvailabilitySchema(categoryID, tempVariantAvailability) );
          end;
        end;
      end;
    end;

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategories) to High(TCategories) do
      begin
        for BMRetailerID := Low(TBMRetailers) to High(TBMRetailers) do
        begin
          for producerID := Low(TAllProducers) to High(TAllProducers) do
          begin
            oJsonFile.A['xf_RetailersProfitabilityPerSupplier'].add( retailersProfitabilityPerSupplierSchema(marketID, categoryID, BMRetailerID, producerID, currentResult.r_ExtendedFeedback.xf_RetailersProfitabilityPerSupplier[marketID, categoryID, BMRetailerID, producerID])  );
          end;
        end;
      end;
    end;

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      begin
        for accountID := Low(TAccounts) to High(TAccounts) do
        begin
          for producerID := Low(TAllProducers) to High(TAllProducers) do
          begin
            oJsonFile.A['xf_SuppliersProfitabilityPerCustomer'].add( suppliersProfitabilityPerCustomerSchema(marketID, categoryID, producerID, accountID, currentResult.r_ExtendedFeedback.xf_SuppliersProfitabilityPerCustomer[marketID, categoryID, producerID, accountID])  );
          end;
        end;
      end;
    end;
    
    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategories) to High(TCategories) do 
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          oJsonFile.A['xf_ShoppersSegmentsShares'].add( shoppersSegmentsSchema(marketID, categoryID, period,currentResult.r_ExtendedFeedback.xf_ShoppersSegmentsShares[marketID, categoryID, period] ) );
        end;
      end;
    end;

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          for Shopper := Low(TShoppersKind) to High(TShoppersKind) do
          begin
            for storeID := Low(TALLStoresTotal) to High(TALLStoresTotal) do
            begin
              oJsonFile.A['xf_ChannelShoppersSegmentsRetailSalesValue'].add( 
                channelShoppersSegmentsRetailSalesValueSchema(marketID, categoryID, period, Shopper, storeID, currentResult.r_ExtendedFeedback.xf_ChannelShoppersSegmentsRetailSalesValue[marketID, categoryID, period, Shopper, storeID]) );
            end;
          end;
        end;
      end;
    end;

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          for BMRetailerID := Low(TBMRetailersTotal) to High(TBMRetailersTotal) do
          begin
            for ownerID := Low(TBrandOwners) to High(TBrandOwners) do
            begin
              oJsonFile.A['xf_RetailerGrossProfitPerBrandOwner'].add(
                 marketRetailerBrandOwnerSchema(marketID, categoryID, period, BMRetailerID, ownerID) );
            end;
          end;
        end;
      end;
    end;

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          for storeID := Low(TAllStores) to High(TAllStores) do
          begin
            oJsonFile.A['xf_StoreGrossProfitMargin'].add(marketStoreSchema(marketID, categoryID, period, storeID, currentResult.r_ExtendedFeedback.xf_StoreGrossProfitMargin[marketID, categoryID, period, storeID]));
            oJsonFile.A['xf_StoreOperatingProfitMargin'].add(marketStoreSchema(marketID, categoryID, period, storeID, currentResult.r_ExtendedFeedback.xf_StoreOperatingProfitMargin[marketID, categoryID, period, storeID]));
            oJsonFile.A['xf_StoreNetProfitMargin'].add(marketStoreSchema(marketID, categoryID, period, storeID, currentResult.r_ExtendedFeedback.xf_StoreNetProfitMargin[marketID, categoryID, period, storeID]));
          end;
        end;
      end;
    end;



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
