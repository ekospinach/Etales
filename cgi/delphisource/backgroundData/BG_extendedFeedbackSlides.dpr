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


  function suppliersCapitalInvestmentSchema(marketID : integer; categoryID : integer;  accountID : integer; info : TXF_OneSupplierCapitalInvestments) : ISuperObject;
  var
    jo : ISuperObject;    
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['accountID'] := accountID;

    jo.D['xfci_InvestedInTechnology'] := info.xfci_InvestedInTechnology;           
    jo.D['xfci_InvestedInDesign'] := info.xfci_InvestedInDesign;    
    jo.D['xfci_InvestedInFlexibility'] := info.xfci_InvestedInFlexibility;  
    jo.D['xfci_InvestedInCapacity'] := info.xfci_InvestedInCapacity; 
    jo.D['xfci_AcquiredTechnologyLevel'] := info.xfci_AcquiredTechnologyLevel;   
    jo.D['xfci_AcquiredDesignLevel'] := info.xfci_AcquiredDesignLevel; 
    jo.D['xfci_AcquiredFlexibility'] := info.xfci_AcquiredFlexibility;
    jo.D['xfci_AvailableCapacity'] := info.xfci_AvailableCapacity;    

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

  function retailersLocalAdvertisingSchema(marketID : integer;  period:integer; retailerID:integer; data : single ) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['period'] := period;
    jo.I['retailerID'] := retailerID;
    jo.D['value'] := data;
    
    result := jo;
  end;


  function serviceLevelSchema(marketID : integer; period:integer; storeID:integer; serviceLevel : TServiceLevel ) : ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['period'] := period;
    jo.I['storeID'] := storeID;

    case (serviceLevel) of
      SL_BASE     : begin jo.S['serviceLevel']:='SL_BASE'; end;
      SL_FAIR     : begin jo.S['serviceLevel']:='SL_FAIR'; end;
      SL_MEDIUM   : begin jo.S['serviceLevel']:='SL_MEDIUM'; end;
      SL_ENHANCED : begin jo.S['serviceLevel']:='SL_ENHANCED'; end;
      SL_PREMIUM  : begin jo.S['serviceLevel']:='SL_PREMIUM'; end;
    end ;
    result := jo;
  end;

  function productPortfolioSchema(index:integer;level:integer;ownerID:integer;isNewProduct:boolean;count:integer) : ISuperObject;
  var
    jo : ISuperObject;
    spec : Integer;
  begin
    jo := SO;

    jo.I['index']:=index;
    jo.I['level']:=level;
    jo.I['ownerID']:=ownerID;
    jo.B['isNewProduct']:=isNewProduct;
    jo.I['count']:=count;

    result := jo;
  end;

  function productPackFormatSchema(pack:TVariantPackFormat;ownerID:integer;isNewProduct:boolean;count:integer ) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['ownerID'] := ownerID;
    jo.B['isNewProduct'] := isNewProduct;
    jo.I['count'] := count;

    case (pack) of
      ECONOMY     : begin jo.S['packFormat']:='ECONOMY'; end;
      STANDARD     : begin jo.S['packFormat']:='STANDARD'; end;
      PREMIUM   : begin jo.S['packFormat']:='PREMIUM'; end;
    end ;

    result := jo;
  end;


  function productPortfoliosSchema(categoryID: integer;tempProductPortfolio:TXF_ProductPortfolio) : ISuperObject;
  var 
    jo : ISuperObject;
    pack :  TVariantPackFormat ;
    bool : boolean;
    spec,specndice,ownerID : Integer;
  begin
    jo := SO;
    jo.I['categoryID'] := categoryID;
    jo.O['xfpp_Attributes'] := SA([]);
    jo.O['xfpp_PackFormat'] := SA([]);
    for spec := Low(TSpecs) to High(TSpecs) do
    begin
      for specndice := Low(TSpecsIndices) to High(TSpecsIndices) do
      begin
        for ownerID := Low(TBrandOwners) to High(TBrandOwners) do
        begin
          for bool := Low(Boolean) to High(Boolean) do
          begin
            if (tempProductPortfolio.xfpp_AttributesSKUCount[spec,specndice,ownerID,bool] <> 0) then
            begin
              jo.A['xfpp_Attributes'].add(productPortfolioSchema(spec,specndice,ownerID,bool,tempProductPortfolio.xfpp_AttributesSKUCount[spec,specndice,ownerID,bool]));
            end;
          end;
        end;
      end;
    end;

    for pack := Low(TVariantPackFormat) to High(TVariantPackFormat) do
      begin
        for ownerID := Low(TBrandOwners) to High(TBrandOwners) do
        begin
          for bool := Low(Boolean) to High(Boolean) do
          begin

            if (tempProductPortfolio.xfpp_PackFormatSKUCount[pack,ownerID,bool] <> 0) then
            begin
              jo.A['xfpp_PackFormat'].add(productPackFormatSchema(pack,ownerID,bool,tempProductPortfolio.xfpp_PackFormatSKUCount[pack,ownerID,bool]));
            end;
          end;
        end;
      end;
    result := jo;
  end;

  function brandOwnerConsumerSegmentsRetailSalesValueSchema(marketID: integer; categoryID:integer; period:integer; segmentID:integer; ownerID : integer; data : TXF_ConsumerSegmentBrandOwnerDetails):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['period'] := period;
    jo.I['segmentID'] := segmentID;
    jo.I['ownerID'] := ownerID;
    jo.D['xfcsbo_Absolute'] := data.xfcsbo_Absolute;
    jo.D['xfcsbo_Importance'] := data.xfcsbo_Importance;
    
    result := jo;    
  end;

  function consumerSegmentsSharesSchema(marketID: integer; categoryID:integer; period:integer; segmentID:integer; data : single):ISuperObject;

  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['period'] := period;
    jo.I['segmentID'] := segmentID;

    jo.D['value'] := data;
    
    result := jo;    
  end;



  function brandOwnersChannelDetailsSchema(marketID:integer; categoryID:integer; period:integer; ownerID:integer; accountID:integer; data: single) : ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['marketID'] := marketID;
    jo.I['categoryID'] := categoryID;
    jo.I['period'] := period;
    jo.I['ownerID'] := ownerID;
    jo.I['accountID'] := accountID;

    jo.D['value'] := data;
    
    result := jo;    
  end;


  procedure makeJson();
  var
    s_str : string;
    segmentID, accountID, catID,ownerID,marketID,brandID,topDays,period,actorID, producerID, retailerID,storeID, supplierID, evaluationIdx, categoryID,variantID, BMRetailerID,spec: Integer;
    tempBrand:TMR_BrandAwareness;
    Shopper : TShoppersKind;
    serviceLevel : TServiceLevel;


    tempVariantAvailability : TXF_VariantAvailability;
    tempProductPortfolio: TXF_ProductPortfolio;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['xf_AvailabilityAtBMStores']                             := SA([]);
    oJsonFile.O['xf_AvailabilityOnline']                                 := SA([]);
    oJsonFile.O['xf_RetailersProfitabilityPerSupplier']                  := SA([]);
    oJsonFile.O['xf_SuppliersProfitabilityPerCustomer']                  := SA([]);
    oJsonFile.O['xf_CapitalInvestments']                  := SA([]);
    oJsonFile.O['xf_ConsumerSegmentsShares']                  := SA([]);

    

    oJsonFile.O['xf_ShoppersSegmentsShares']                  := SA([]);
    oJsonFile.O['xf_ChannelShoppersSegmentsRetailSalesValue'] := SA([]);
    oJsonFile.O['xf_RetailerGrossProfitPerBrandOwner']        := SA([]);

    oJsonFile.O['xf_StoreGrossProfitMargin']                  := SA([]);
    oJsonFile.O['xf_StoreOperatingProfitMargin']              := SA([]);
    oJsonFile.O['xf_StoreNetProfitMargin']                    := SA([]);

    oJsonFile.O['xf_StoresServiceLevel']                      := SA([]);
    oJsonFile.O['xf_RetailersLocalAdvertising']               := SA([]);



    oJsonFile.O['xf_ProductPortfolios']                      := SA([]);
    
    oJsonFile.O['xf_RetailersLocalAdvertising']                     := SA([]);

    oJsonFile.O['xf_BrandOwnerConsumerSegmentsRetailSalesValue']    := SA([]);
    oJsonFile.O['xf_BrandOwnersChannelSalesValue']                  := SA([]);
    oJsonFile.O['xf_BrandOwnersChannelGrossProfit']                  := SA([]);
    oJsonFile.O['xf_BrandOwnersChannelTradeProfit']                  := SA([]);

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
            oJsonFile.A['xf_CapitalInvestments'].add( suppliersCapitalInvestmentSchema(marketID, categoryID, accountID, currentResult.r_ExtendedFeedback.xf_CapitalInvestments[marketID, categoryID, accountID])  );
        end;
      end;
    end;


    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID :=  Low(TCategories) to High(TCategories) do 
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          for segmentID := Low(TSegmentsTotal) to High(TSegmentsTotal) do
          begin
            oJsonFile.A['xf_ConsumerSegmentsShares'].add( consumerSegmentsSharesSchema(marketID, categoryID, period, segmentID, currentResult.r_ExtendedFeedback.xf_ConsumerSegmentsShares[marketID, categoryID, period, segmentID])  );
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

    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for retailerID := Low(TBMRetailers) to High(TBMRetailers) do
        begin
          oJsonFile.A['xf_RetailersLocalAdvertising'].add(retailersLocalAdvertisingSchema(marketID, period, retailerID, currentResult.r_ExtendedFeedback.xf_RetailersLocalAdvertising[marketID, period, retailerID]));
        end;
      end;
    end;

    for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['xf_ProductPortfolios'].add(productPortfoliosSchema(categoryID, currentResult.r_ExtendedFeedback.xf_ProductPortfolios[categoryID]));
    end;


    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for period := Low(TTimeSpan) to High(TTimeSpan) do
      begin
        for storeID := Low(TAllStores) to High(TAllStores) do
        begin
          oJsonFile.A['xf_StoresServiceLevel'].add(serviceLevelSchema(marketID, period, storeID, currentResult.r_ExtendedFeedback.xf_StoresServiceLevel[marketID, period, storeID]));
        end;
      end;
    end;





    for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
      for categoryID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      begin
        for period := Low(TTimeSpan) to High(TTimeSpan) do
        begin
          for segmentID := Low(TSegmentsTotal) to High(TSegmentsTotal) do
          begin
            for ownerID := Low(TBrandOwnersTotal) to High(TBrandOwnersTotal) do
            begin
              oJsonFile.A['xf_BrandOwnerConsumerSegmentsRetailSalesValue'].add(  
                brandOwnerConsumerSegmentsRetailSalesValueSchema(marketID, categoryID, period, segmentID, ownerID, currentResult.r_ExtendedFeedback.xf_BrandOwnerConsumerSegmentsRetailSalesValue[marketID, categoryID, period, segmentID, ownerID]));
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
          for ownerID := Low(TBrandOwners) to High(TBrandOwners) do            
          begin
            for accountID := Low(TAccounts) to High(TAccounts) do
            begin
              oJsonFile.A['xf_BrandOwnersChannelSalesValue'].add(brandOwnersChannelDetailsSchema(marketID, categoryID, period, ownerID, accountID, currentResult.r_ExtendedFeedback.xf_BrandOwnersChannelSalesValue[marketID, categoryID, period, ownerID, accountID]));
              oJsonFile.A['xf_BrandOwnersChannelGrossProfit'].add(brandOwnersChannelDetailsSchema(marketID, categoryID, period, ownerID, accountID, currentResult.r_ExtendedFeedback.xf_BrandOwnersChannelGrossProfit[marketID, categoryID, period, ownerID, accountID]));
              oJsonFile.A['xf_BrandOwnersChannelTradeProfit'].add(brandOwnersChannelDetailsSchema(marketID, categoryID, period, ownerID, accountID, currentResult.r_ExtendedFeedback.xf_BrandOwnersChannelTradeProfit[marketID, categoryID, period, ownerID, accountID]));
            end;
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
