{===================================     E-Tales Simulation Kernel Internal Types    ========================================}

TVariantInternal = 
  record
    v_VariantID                                    : TVariantID;
    v_VariantName                                  : TVariantName;
    v_DateofBirth                                  : TTimeSpan;
    v_DateOfDeath                                  : TTimeSpan;
    v_Discontinued                                 : boolean;
    v_ParentBrandID                                : TBrandID;
    v_ParentBrandIndex                             : TBrands;
    v_ParentCompanyID                              : TBrandOwners;
    v_PackFormat                                   : TVariantPackFormat;
  
    v_ActualProduction                             : single;
    v_AppliedDiscountRate                          : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_Attractiveness                               : array[TMarkets, TSegments, TShoppersKind, TAllStores] of single;
    v_AverageMarketPrice                           : array[TMarkets] of single;
    v_BMDemand                                     : single;
    v_ClosingStockCover                            : array[TMarketsTotal, TAccountsTotal] of single;  { expressed as decimal }
    v_CompositionAtSupplier                        : array[TProducerDivisions] of TVariantComposition;
    v_CompositionAtTrade                           : array[TMarketsTotal, TAllStoresTotal] of TVariantComposition;
    v_ConsignementVolume                           : array[TMarketsTotal, TBMRetailersTotal] of single;  
    v_ContractHonoured                             : array[TMarketsTotal, TBMRetailersTotal] of boolean;
    v_CurrentAcquisitionCost                       : array[TMarkets, TBMRetailers] of single;
    v_CurrentPriceBM                               : single;
    v_CurrentProductionCost                        : single;   { at original producer, including Supplier 4 for PL }
    v_Delisted                                     : array[TMarkets, TBMRetailers] of boolean;
    v_DeliveryChannelPreference                    : single;
    v_Demand                                       : array[TMarkets, TSegmentsTotal, TShoppersKind, TAllStores, TAllStores] of single;
    v_Div_AdvertisingNationalOldMedia              : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_AdvertisingNationalOnLine                : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_AdvertisingTotal                         : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_AfterReturnsInventory                    : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_AfterSalesInventory                      : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_AfterShipmentsInventory                  : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_Amortisation                             : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_AveragePostSalesCost                     : array[TProducerDivisions] of single;  
    v_Div_BeforeShipmentsInventory                 : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_ClosingInventory                         : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_ClosingInventoryValue                    : array[TProducerDivisions] of single;
    v_Div_ClosingStockCover                        : array[TProducerDivisions] of single;
    v_Div_CostOfGoodsSold                          : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_DiscontinuedGoodsCost                    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_DiscontinuedGoodsVolume                  : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_EMallCommission                          : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_ExceptionalCostsProfits                  : array[TProducerDivisions] of single;
    v_Div_GeneralExpenses                          : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossProfit                              : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossProfitChange                        : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossProfitMargin                        : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossProfitShareInCategory               : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossSalesValue                          : array[TMarketsTotal, TProducerDivisions] of single; 
    v_Div_GrossSalesValueChange                    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossSalesValueShareInBrand              : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_GrossSalesValueShareInCategory           : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_Interest                                 : array[TProducerDivisions] of single;
    v_Div_InternalTransfersCost                    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_InventoryHoldingCost                     : array[TMarketsTotal, TProducerDivisions] of single;  
    v_Div_MaterialCosts                            : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_NetProfit                                : array[TProducerDivisions] of single;
    v_Div_NetProfitChange                          : array[TProducerDivisions] of single;
    v_Div_NetProfitMargin                          : array[TProducerDivisions] of single;
    v_Div_NetProfitShareInCategory                 : array[TProducerDivisions] of single;
    v_Div_NetSalesValue                            : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_OperatingProfit                          : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_OperatingProfitChange                    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_OperatingProfitMargin                    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_OperatingProfitShareInCategory           : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_SalesVolume                              : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_ServiceCosts                             : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_StartingInventory                        : array[TRADITIONAL..INTERNET] of TVariantInventoriesDetails;
    v_Div_StartingInventoryValue                   : array[TProducerDivisions] of single;
    v_Div_StartingStockCover                       : array[TProducerDivisions] of single; 
    v_Div_Taxes                                    : array[TProducerDivisions] of single; 
    v_Div_Total_T_And_M_Expenses                   : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_Total_T_And_M_ExpensesAsPercentOfSales   : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_Total_T_And_M_ExpensesShareInCategory    : array[TMarketsTotal, TProducerDivisions] of single;
    v_Div_TotalMaterialCost                        : array[TMarketsTotal, TProducerDivisions] of single; 
    v_Div_TotalTradeSupport                        : array[TMarketsTotal, TProducerDivisions] of single;
    v_EMallSupport                                 : array[TMarketsTotal] of single;
    v_InitialDemand                                : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_InStoreActivitiesCost                        : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_InStoreActivitiesFee                         : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_InStoreActivitiesIntensity                   : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_InStoreCosts                                 : array[TMarketsTotal, TBMRetailers] of single;
    v_InventoryAtTotalTrade                        : array[TMarketsTotal] of single;
    v_LabourCosts                                  : array[TMarketsTotal, TBMRetailers] of single;
    v_MarketPrice                                  : array[TMarketsTotal, TAccountsTotal] of single;
    v_NegotiatedPerformanceBonus                   : array[TMarketsTotal, TBMRetailersTotal] of TBonusDetails;
    v_NegotiationsGranularity                      : array[TBMRetailers] of TNegotiationsTopicsLevel;
    v_NetFinancialBenefit                          : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_NetFinancialCost                             : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_NetMarketPrice                               : array[TMarketsTotal, TAccountsTotal] of single;
    v_NetMarketPriceChange                         : array[TMarketsTotal, TAccountsTotal] of single;
    v_NextPriceBM                                  : single;
    v_OnLineActualVolume                           : single;
    v_OnLinePlannedVolume                          : single;
    v_OnLineDemand                                 : single;
    v_OrderVolume                                  : array[TMarketsTotal, TBMRetailers] of single;
    v_OtherCompensation                            : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_OutOfStockLevel                              : array[TMarkets, TSegmentsTotal, TShoppersKind, TAllStores] of single;
    v_Perception                                   : array[TMarkets] of TVariantPerceptionsData;
    v_PlannedProduction                            : single;
    v_PricePromotionsCost                          : array[TMarketsTotal, TAccountsTotal] of single;
    v_PricePromotionsDetails                       : array[TMarketsTotal, TAccounts] of TPromotionsDetails;
    v_PricePromotionsIntensity                     : array[TMarketsTotal, TAccounts] of single; { standarised = effect of length and effect of depth }
    v_PromotionalSupport                           : array[TMarketsTotal, TBMRetailersTotal] of single;
    v_PurchaseVolume                               : array[TMarketsTotal, TBMRetailers] of single;
    v_QuantityDiscountsValue                       : array[TMarketsTotal, TBMRetailersTotal] of single;  
    v_Ret_AcquisitionCost                          : array[TMarketsTotal, TBMRetailersTotal] of single;  { retailers    : net buying price for brands, or cost for PLs } 
    v_Ret_AfterReturnsInventory                    : array[TMarketsTotal, TBMRetailers] of TVariantInventoriesDetails;
    v_Ret_AfterSalesInventory                      : array[TMarketsTotal, TBMRetailers] of TVariantInventoriesDetails;
    v_Ret_AfterShipmentsInventory                  : array[TMarketsTotal, TBMRetailers] of TVariantInventoriesDetails;
    v_Ret_Amortisation                             : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_AveragePostSalesCost                     : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_ClosingInventory                         : array[TMarketsTotal, TBMRetailers] of TVariantInventoriesDetails;
    v_Ret_ClosingInventoryValue                    : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_CostOfGoodsSold                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_DiscontinuedGoodsCost                    : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_DiscontinuedGoodsVolume                  : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_ExceptionalCostsProfits                  : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GeneralExpenses                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GrossProfit                              : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GrossProfitChange                        : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GrossProfitMargin                        : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GrossProfitShareInCategory               : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_GrossSalesValue                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_HandlingCosts                            : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_Interest                                 : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_InventoryHoldingCost                     : array[TMarketsTotal, TBMRetailers] of single;        { including cost of capital }
    v_Ret_NetProfit                                : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetProfitChange                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetProfitMargin                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetProfitShareInCategory                 : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetSalesRevenue                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetSalesValue                            : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetSalesValueChange                      : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_NetSalesValueShareInCategory             : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_OperatingExpenses                        : array[TMarketsTotal, TBMRetailers] of single;  
    v_Ret_OperatingProfit                          : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_OperatingProfitChange                    : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_OperatingProfitMargin                    : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_OperatingProfitShareInCategory           : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_QuantityDiscountsCurrentBenefits         : array[TMarketsTotal, TBMRetailersTotal] of single;  
    v_Ret_QuantityDiscountsFutureBenefits          : array[TMarketsTotal, TBMRetailersTotal] of single;  
    v_Ret_RentAndEquipmentCosts                    : array[TMarketsTotal, TBMRetailersTotal] of single;  
    v_Ret_SalesValue                               : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_SalesVolume                              : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_StartingInventory                        : array[TMarketsTotal, TBMRetailers] of TVariantInventoriesDetails;
    v_Ret_StartingStockCover                       : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_Taxes                                    : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_TotalAdvertising                         : array[TMarketsTotal, TBMRetailers] of single;
    v_Ret_TotalMaterialCost                        : array[TMarketsTotal, TBMRetailers] of single;
    v_RequiredProduction                           : single;
    v_ShelfSpace                                   : array[TMarketsTotal, TAllStoresTotal] of single;
    v_SocialNetworksScore                          : TWebTrawlerIndices;
    v_StartingStockCover                           : array[TMarketsTotal, TAccountsTotal] of single;  { expressed as decimal }
    v_Sup_AcquisitionCost                          : single;  { across current production and inventory }
    v_Sup_CostOfGoodsSold                          : array[TMarketsTotal, TAccountsTotal] of single;  { Three B&M retailers + On-Line }
    v_Sup_DiscontinuedGoodsCost                    : array[TMarketsTotal, TAccountsTotal] of single; 
    v_Sup_EMallCommission                          : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_GrossProfit                              : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_GrossSalesValue                          : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_GrossSalesValueChange                    : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_GrossSalesValueShareInBrand              : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_InternalTransfersCost                    : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_InventoryHoldingCost                     : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_NetSalesValue                            : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_NetSalesValueChange                      : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_NetSalesValueShareInCategory             : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_SalesVolume                              : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_ServiceCosts                             : array[TMarketsTotal, TAccountsTotal] of single;
    v_Sup_ShareInBrandSalesVolume                  : array[TMarketsTotal, TAccounts] of single;
    v_Sup_TotalMaterialCost                        : array[TMarketsTotal, TAccountsTotal] of single;    
    v_TargetBonus                                  : array[TMarketsTotal, TBMRetailersTotal] of TBonusDetails;
    v_TechnicalPerception                          : array[TMarkets] of TVariantPerceptionsData;
    v_TermsOfPayment                               : array[TMarketsTotal, TBMRetailers] of TDelayOfPayment;
    v_TotalSupportReceived                         : array[TMarketsTotal, TBMRetailers] of single;
    v_TotalTradeSupport                            : array[TMarketsTotal, TAccountsTotal] of single;
    v_TradeProfit                                  : array[TMarketsTotal, TAccountsTotal] of single;
    v_TraditionalTradeSupport                      : array[TMarketsTotal] of single;
    v_ValueMarketSales                             : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_ValueMarketShare                             : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_ValueMarketShareChange                       : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_ValueMarketSharePerChannel                   : array[TMarketsTotal, TSegmentsTotal, TProducerDivisions] of single;
    v_ValueMarketShareRanking                      : array[TMarketsTotal, TSegmentsTotal, TProducerDivisions] of integer;
    v_ValueNetMarketSales                          : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_ValueNetMarketSalesChange                    : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_VisibilityShare                              : array[TMarketsTotal, TAllStoresTotal] of single;
    v_VolumeDiscounts                              : array[TMarketsTotal, TBMRetailersTotal] of TDiscountsDetails;
    v_VolumeMarketSales                            : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_VolumeMarketSalesChange                      : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_VolumeMarketShare                            : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_VolumeMarketShareChange                      : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    v_VolumeMarketSharePerChannel                  : array[TMarketsTotal, TSegmentsTotal, TProducerDivisions] of single;
    v_VolumeMarketShareRanking                     : array[TMarketsTotal, TSegmentsTotal, TProducerDivisions] of integer;
  end;

TVariantsInternal     = array[TCategories, TVariants] of TVariantInternal;
TPastVariantsInternal = array[OldestPast..LatestPast] of TVariantsInternal;

{----------------------------------------------------------------------------------------------------------------------------}

TBrandInternal =
  record
    b_BrandID                                      : TBrandID;
    b_BrandName                                    : TBrandName;
    b_DateofBirth                                  : TTimeSpan;
    b_DateOfDeath                                  : TTimeSpan;
    b_Discontinued                                 : boolean;
    b_ParentCompanyID                              : TBrandOwners;
  
    b_ActualProduction                             : single;
    b_AdvertisingImpact                            : array[TMarketsTotal] of single;
    b_AppliedDiscountRate                          : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_AverageCurrentPriceBM                        : single;
    b_AverageNetMarketPrice                        : array[TMarketsTotal, TAccountsTotal] of single;
    b_AverageOnLinePrice                           : single;
    b_Awareness                                    : array[TMarketsTotal] of single;         { saved as decimal }
    b_ClosingStockCover                            : array[TMarketsTotal, TAccountsTotal] of single;  { expressed as decimal }
    b_ConsignementVolume                           : array[TMarketsTotal, TBMRetailers] of single;
    b_CurrentProductionCost                        : single;   { at original producer, including Supplier 4 for PL }
    b_Delisted                                     : array[TMarkets, TBMRetailers] of boolean;
    b_Div_AdvertisingLocal                         : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_AdvertisingNationalOldMedia              : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_AdvertisingNationalOnLine                : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_AdvertisingTotal                         : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_AfterReturnsInventory                    : array[TProducerDivisions] of single;
    b_Div_AfterReturnsInventoryValue               : array[TProducerDivisions] of single;
    b_Div_AfterShipmentsInventory                  : array[TProducerDivisions] of single;
    b_Div_AfterShipmentsInventoryValue             : array[TProducerDivisions] of single;
    b_Div_Amortisation                             : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_AveragePostSalesCost                     : array[TProducerDivisions] of single;
    b_Div_ClosingInventory                         : array[TProducerDivisions] of single;
    b_Div_ClosingInventoryValue                    : array[TProducerDivisions] of single;
    b_Div_ClosingStockCover                        : array[TProducerDivisions] of single;
    b_Div_CostOfGoodsSold                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_DiscontinuedGoodsCost                    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_DiscontinuedGoodsVolume                  : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_EMallCommission                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_ExceptionalCostsProfits                  : array[TProducerDivisions] of single;
    b_Div_GeneralExpenses                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossProfit                              : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossProfitChange                        : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossProfitMargin                        : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossProfitShareInCategory               : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossSalesValue                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossSalesValueChange                    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_GrossSalesValueShareInCategory           : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_Interest                                 : array[TProducerDivisions] of single;
    b_Div_InventoryHoldingCost                     : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_InternalTransfersCost                    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_MaterialCosts                            : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_NetProfit                                : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_NetProfitChange                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_NetProfitMargin                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_NetProfitShareInCategory                 : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_NetSalesValue                            : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_OperatingProfit                          : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_OperatingProfitChange                    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_OperatingProfitMargin                    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_OperatingProfitShareInCategory           : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_SalesVolume                              : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_ServiceCosts                             : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_StartingInventory                        : array[TProducerDivisions] of single;
    b_Div_StartingInventoryValue                   : array[TProducerDivisions] of single;
    b_Div_StartingStockCover                       : array[TProducerDivisions] of single;
    b_Div_Taxes                                    : array[TProducerDivisions] of single;
    b_Div_Total_T_And_M_Expenses                   : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_Total_T_And_M_ExpensesAsPercentOfSales   : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_Total_T_And_M_ExpensesShareInCategory    : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_TotalMaterialCost                        : array[TMarketsTotal, TProducerDivisions] of single;
    b_Div_TotalTradeSupport                        : array[TMarketsTotal, TProducerDivisions] of single;
    b_EffectiveAdvertisingSpend                    : array[TMarketsTotal] of single;
    b_EMallSupport                                 : array[TMarketsTotal] of single;
    b_InStoreActivitiesCost                        : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_InStoreActivitiesFee                         : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_InStoreActivitiesIntensity                   : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_InStoreCosts                                 : array[TMarketsTotal, TBMRetailers] of single;
    b_IsPrivateLabel                               : boolean;
    b_LabourCosts                                  : array[TMarketsTotal, TBMRetailers] of single;
    b_MarketPrice                                  : array[TMarketsTotal, TAccountsTotal] of single;
    b_NegotiatedPerformanceBonus                   : array[TMarketsTotal, TBMRetailersTotal] of TBonusDetails;
    b_NetFinancialBenefit                          : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_NetFinancialCost                             : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_NextPriceBM                                  : single;
    b_OnLineActualVolume                           : single;
    b_OnLinePlannedVolume                          : single;
    b_OrderVolume                                  : array[TMarketsTotal, TBMRetailers] of single;
    b_OtherCompensation                            : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_OutOfStockLevel                              : array[TMarkets, TSegmentsTotal, TShoppersKind, TAllStores] of single;
    b_Perception                                   : array[TMarkets] of TVariantPerceptionsData;  { as weighted average of variants perceptions }
    b_PlannedProduction                            : single;
    b_PricePromotionsCost                          : array[TMarketsTotal, TAccountsTotal] of single;
    b_PricePromotionsDetails                       : array[TMarkets, TAccounts] of single;
    b_PricePromotionsIntensity                     : array[TMarkets, TAccounts] of single; { standarised = effect of length and effect of depth }
    b_ProductionVolume                             : single;
    b_PromotionalSupport                           : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_PurchaseVolume                               : array[TMarketsTotal, TBMRetailers] of single;
    b_QuantityDiscountsCost                        : array[TMarketsTotal, TBMRetailersTotal] of single;  
    b_QuantityDiscountsValue                       : array[TMarketsTotal, TBMRetailersTotal] of single; 
    b_Ret_AcquisitionCost                          : array[TMarketsTotal, TBMRetailersTotal] of single;  { retailers    : net buying price for brands, or cost for PLs } 
    b_Ret_AfterReturnsInventory                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AfterReturnsInventoryValue               : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AfterSalesInventory                      : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AfterSalesInventoryValue                 : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AfterShipmentsInventory                  : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AfterShipmentsInventoryValue             : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_Amortisation                             : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_AveragePostSalesCost                     : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_ClosingInventory                         : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_ClosingInventoryValue                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_ClosingStockCover                        : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_CostOfGoodsSold                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_DiscontinuedGoodsCost                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_DiscontinuedGoodsVolume                  : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_ExceptionalCostsProfits                  : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GeneralExpenses                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GrossProfit                              : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GrossProfitChange                        : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GrossProfitMargin                        : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GrossProfitShareInCategory               : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_GrossSalesValue                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_HandlingCosts                            : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_Interest                                 : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_InventoryHoldingCost                     : array[TMarketsTotal, TBMRetailers] of single;        { including cost of capital }
    b_Ret_NetProfit                                : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetProfitChange                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetProfitMargin                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetProfitShareInCategory                 : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetSalesRevenue                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetSalesValue                            : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetSalesValueChange                      : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_NetSalesValueShareInCategory             : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_OperatingExpenses                        : array[TMarketsTotal, TBMRetailers] of single;  
    b_Ret_OperatingProfit                          : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_OperatingProfitChange                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_OperatingProfitMargin                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_OperatingProfitShareInCategory           : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_QuantityDiscountsCurrentBenefits         : array[TMarketsTotal, TBMRetailersTotal] of single;  
    b_Ret_QuantityDiscountsFutureBenefits          : array[TMarketsTotal, TBMRetailersTotal] of single;  
    b_Ret_RentAndEquipmentCosts                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_SalesVolume                              : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_StartingInventory                        : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_Ret_StartingInventoryValue                   : array[TMarketsTotal, TBMRetailersTotal] of single;
    b_Ret_StartingStockCover                       : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_Taxes                                    : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_TotalAdvertising                         : array[TMarketsTotal, TBMRetailers] of single;
    b_Ret_TotalMaterialCost                        : array[TMarketsTotal, TBMRetailers] of single;
    b_ShelfSpace                                   : array[TMarketsTotal, TAllStoresTotal] of single;
    b_SocialNetworksScore                          : TWebTrawlerIndices;
    b_StartingStockCover                           : array[TMarketsTotal, TAccountsTotal] of single;  { expressed as decimal }
    b_Sup_AcquisitionCost                          : single;  { across current production and inventory }
    b_Sup_CostOfGoodsSold                          : array[TMarketsTotal, TAccountsTotal] of single;  { Three B&M retailers + On-Line }
    b_Sup_GrossProfit                              : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_GrossSalesValue                          : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_GrossSalesValueChange                    : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_NetSalesValue                            : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_NetSalesValueChange                      : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_NetSalesValueShareInCategory             : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_SalesVolume                              : array[TMarketsTotal, TAccountsTotal] of single;
    b_Sup_ShareInBrandSalesVolume                  : array[TMarketsTotal, TAccounts] of single;
    b_TargetBonus                                  : array[TMarketsTotal, TBMRetailersTotal] of TBonusDetails;
    b_TechnicalPerception                          : array[TMarkets] of TVariantPerceptionsData;
    b_TermsOfPayment                               : array[TMarketsTotal, TBMRetailers] of TDelayOfPayment;
    b_TotalSupportReceived                         : array[TMarketsTotal, TBMRetailers] of single;
    b_TotalTradeSupport                            : array[TMarketsTotal, TAccountsTotal] of single;
    b_TradeProfit                                  : array[TMarketsTotal, TAccountsTotal] of single;
    b_TraditionalTradeSupport                      : array[TMarketsTotal] of single;
    b_ValueMarketShare                             : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_ValueNetMarketSales                          : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_ValueNetMarketSalesChange                    : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_VisibilityShare                              : array[TMarketsTotal, TAllStoresTotal] of single;
    b_VolumeDiscounts                              : array[TMarketsTotal, TBMRetailersTotal] of TDiscountsDetails;
    b_VolumeMarketSales                            : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_VolumeMarketSalesChange                      : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_VolumeMarketShare                            : array[TMarketsTotal, TSegmentsTotal, TShoppersKind, TAllStoresTotal] of single;
    b_WholesalesVolume                             : array[TMarketsTotal, TBMRetailers] of single;
  end;

TBrandsInternal     = array[TCategories, TBrands] of TBrandInternal;    
TPastBrandsInternal = array[OldestPast..LatestPast] of TBrandsInternal;

{----------------------------------------------------------------------------------------------------------------------------}


TProducerInternal =
  record
    p_CompanyID                                : TActors;

    p_AcquiredDesignLevel                      : array[TCategories] of TDesign;
    p_AcquiredProductionFlexibility            : array[TCategories] of single;   { saved as decimal }
    p_AcquiredTechnologyLevel                  : array[TCategories] of TTechnology;
    p_AcquisitionCost                          : array[TCategories] of single;  { across current production and inventory }
    p_ActualProduction                         : array[TCategories] of single;
    p_AdvertisingLocal                         : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_AdvertisingNationalOldMedia              : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_AdvertisingNationalOnLine                : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_AdvertisingTotal                         : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_AfterReturnsInventory                    : array[TCategories, TProducerDivisions] of single;
    p_AfterReturnsInventoryValue               : array[TCategoriesTotal, TProducerDivisions] of single;
    p_AfterShipmentsInventory                  : array[TCategories, TProducerDivisions] of single;
    p_AfterShipmentsInventoryValue             : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Amortisation                             : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_AppliedDiscountRate                      : array[TMarketsTotal, TCategories, TBMRetailersTotal] of single;
    p_AverageCurrentPriceBM                    : array[TCategories] of single;
    p_AverageMarketPrice                       : array[TMarketsTotal, TCategories, TAccountsTotal] of single;
    p_AverageNetMarketPrice                    : array[TMarketsTotal, TCategories, TAccountsTotal] of single;
    p_AverageNetWholesalePrice                 : array[TMarketsTotal, TCategories, TBMRetailersTotal] of single;
    p_AverageNextPriceBM                       : array[TCategories] of single;
    p_AverageOnLinePrice                       : array[TCategories] of single;
    p_AveragePostSalesCost                     : array[TCategories, TProducerDivisions] of single;  
    p_BudgetAvailable                          : single; { operational budget available for current period }
    p_BudgetExtensionImmediate                 : single;
    p_BudgetExtensionNextPeriod                : single;
    p_BudgetExtensionRequestsTillNow           : byte;   { # of budget extension requests till now }
    p_BudgetOverspent                          : single; { operational budget spent in excess of available }
    p_BudgetSpentToDate                        : single; { cumulated operational budget spent }
    p_CapacityUtilisationRate                  : array[TCategories] of single;
    p_CashBeginningOfYear                      : array[TCategoriesTotal] of single;
    p_CashEndOfYear                            : array[TCategoriesTotal] of single;
    p_ChannelShareInGrossSalesValue            : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ChannelShareInGrossProfit                : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ChannelShareInTradeProfit                : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ChannelShareInVolumeSales                : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ChannelShareInTradeSupport               : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ChannelShareInShelfSpace                 : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ClosingInventory                         : array[TCategories, TProducerDivisions] of single;
    p_ClosingInventoryValue                    : array[TCategoriesTotal, TProducerDivisions] of single;
    p_ConsignementVolume                       : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single; 
    p_CostOfGoodsSold                          : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_CumulatedBudgetExtensions                : single;
    p_CumulatedDesignVolume                    : array[TCategories] of TDesignsDetails;
    p_CumulatedTechnologyVolume                : array[TCategories] of TTechnologiesDetails;
    p_CumulativeInvestment                     : single;
    p_CurrentInvestment                        : single;
    p_CurrentProductionCost                    : array[TCategories] of single;   { at original producer, including Supplier 4 for PL }
    p_DebtIssuance                             : array[TCategoriesTotal] of single;
    p_DebtRedemption                           : array[TCategoriesTotal] of single;
    p_DiscontinuedGoodsCost                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_DiscontinuedGoodsVolume                  : array[TMarketsTotal, TCategories, TProducerDivisions] of single;
    p_Div_ChannelSalesValueShare               : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ChannelSalesVolumeShare              : array[TCategories, TProducerDivisions] of single;
    p_Div_CostOfGoodsSold                      : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_EBIT                                 : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;    
    p_Div_EMallCommission                      : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ExceptionalCostsProfits              : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_GrossProfit                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_GrossProfitChange                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_GrossProfitMargin                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_GrossSalesValue                      : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_GrossSalesValueChange                : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InitialInventoryValue                : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_Interest                             : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InternalTransfersCost                : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InventoryHoldingCost                 : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InvestInDesign                       : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InvestInProductionFlexibility        : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InvestInTechnology                   : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_InvestmentInCapacityChange           : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_MarketResearchCost                   : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_MaterialCosts                        : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_NetSalesValue                        : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_NetSalesValueChange                  : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;   
    p_Div_ReturnOnOperationalBudget            : array[TCategoriesTotal, TProducerDivisions] of single;
    p_Div_SalesVolume                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ServiceCosts                         : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ShareInCategory                      : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ShareInGrossSales                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_TotalTradeSupport                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_TradeAndMarketing                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_TradeAndMarketingAsPercentOfSales    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_ValueMarketSharePerChannel           : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_Div_VolumeMarketSharePerChannel          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_DividentsPaid                            : array[TCategoriesTotal] of single;
    p_EMallSupport                             : array[TMarketsTotal, TCategoriesTotal] of single;
    p_FixedAssets                              : array[TCategoriesTotal, TProducerDivisions] of single;
    p_GeneralExpenses                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_GrantedBudgetExtensionsToDate            : single;  
    p_GrossProfit                              : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_GrossProfitChange                        : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_GrossProfitMargin                        : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_GrossSalesValue                          : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_GrossSalesValueChange                    : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_IncrementalValueMarketShare              : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_InitialBudget                            : single;
    p_InitialInventory                         : array[TCategories, TProducerDivisions] of single;
    p_InStoreActivitiesFee                     : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
    p_Intangibles                              : array[TCategoriesTotal] of single;
    p_LandAndEquipment                         : array[TCategoriesTotal] of single;
    p_MarketingEffectiveness                   : array[TCategoriesTotal] of single;
    p_MarketResearchOrders                     : TMarketResearchOrders;
    p_MarketSalesValue                         : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    p_MarketSalesValueChange                   : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    p_MarketSalesValueOnLine                   : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    p_MarketSalesVolume                        : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    p_MarketSalesVolumeChange                  : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    p_MarketSalesVolumeOnLine                  : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    p_MarketShareValue                         : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    p_MarketShareValueChange                   : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    p_MarketShareVolume                        : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    p_MarketShareVolumeChange                  : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    p_MaterialCosts                            : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_NegotiatedPerformanceBonus               : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of TBonusDetails;
    p_NetCashFromFinancingActivities           : array[TCategoriesTotal] of single;
    p_NetCashFromInvestingActivities           : array[TCategoriesTotal] of single;
    p_NetCashFromOperatingActivities           : array[TCategoriesTotal] of single;
    p_NetCashTotal                             : array[TCategoriesTotal] of single;
    p_NetFinancialCost                         : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
    p_NetProfit                                : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_NetProfitChange                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_NetProfitMargin                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_NetSalesValue                            : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_NetSalesValueChange                      : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_OnLineActualVolume                       : array[TCategories] of single;
    p_OnLinePlannedVolume                      : array[TCategories] of single;
    p_OnLineServiceLevel                       : TServiceLevel;
    p_OnLineServiceIncrementalCost             : single;
    p_OperatingProfit                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_OperatingProfitChange                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_OperatingProfitMargin                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_OtherCompensation                        : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
    p_OtherOnLineInvestment                    : array[TMarketsTotal, TCategoriesTotal] of single;
    p_OtherOverhead                            : array[TCategoriesTotal, TProducerDivisions] of single;
    p_PerformanceBonusCost                     : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
    p_PlannedProduction                        : array[TCategories] of single;
    p_PricePromotionsCost                      : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_PricePromotionsDetails                   : array[TMarkets, TAccounts] of single;
    p_PricePromotionsIntensity                 : array[TMarkets, TAccounts] of single; { standarised = effect of length and effect of depth }
    p_ProductionCapacity                       : array[TCategories] of single;
    p_ProductionCapacityChange                 : array[TCategories] of single;
    p_ProductionCost                           : array[TCategoriesTotal, TProducerDivisions] of single;
    p_ProductionVolume                         : array[TCategories] of single;
    p_ProfitBeforeTax                          : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_PromotionalSupport                       : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
    p_QuantityDiscountsValue                   : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single; 
    p_ResidualInvestInDesign                   : array[TCategories] of single;
    p_ResidualInvestInTechnology               : array[TCategories] of single;
    p_SalesForceCost                           : array[TCategoriesTotal, TProducerDivisions] of single;
    p_SalesVolume                              : array[TMarketsTotal, TCategories, TAccountsTotal] of single;
    p_SalesVolumeChange                        : array[TMarketsTotal, TCategories, TAccountsTotal] of single;
    p_ShareInCompanyGrossSalesValue            : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ShareInGrossSales                        : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ShelfSpaceInChannel                      : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_ShoppersShare                            : array[TCategories, TProducerDivisions] of single;
    p_SocialNetworksScore                      : TWebTrawlerIndices;
    p_SoldUnitAverageCost                      : array[TCategories] of single;     { based on sold volume }
    p_StartingInventory                        : array[TCategories, TProducerDivisions] of single;
    p_StartingInventoryValue                   : array[TCategoriesTotal, TProducerDivisions] of single;
    p_StartingStockCover                       : array[TMarketsTotal, TAccountsTotal] of single;  { expressed as decimal }
    p_TargetBonus                              : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of TBonusDetails;
    p_Taxes                                    : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_TermsOfPayment                           : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of TDelayOfPayment;
    p_Total_T_And_M_Expenses                   : array[TMarketsTotal, TCategoriesTotal, TProducerDivisions] of single;
    p_TotalPreviousMarketing                   : single;
    p_TotalPreviousTradeSupport                : single;
    p_TotalTradeSupport                        : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_TradeAndMarketing                        : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_TradeAndMarketingAsPercentageOfSales     : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_TradeProfit                              : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_TradeSpendingEffectiveness               : array[TCategoriesTotal] of single;
    p_TraditionalTradeSupport                  : array[TMarketsTotal, TCategoriesTotal] of single;
    p_VolumeOrdered                            : array[TMarketsTotal, TCategoriesTotal, TAccountsTotal] of single;
    p_WholesalesVolume                         : array[TMarketsTotal, TCategoriesTotal, TBMRetailersTotal] of single;
  end;

TProducersInternal     = array[TAllProducers] of TProducerInternal;
TPastProducersInternal = array[OldestPast..LatestPast] of TProducersInternal;


{----------------------------------------------------------------------------------------------------------------------------}

TRetailerInternal =
  record
    r_CompanyID                                : TActors;

    r_AdjustedGrossProfit                      : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_Amortisation                             : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_AssortmentWidth                          : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_AverageAcquisitionCost                   : array[TMarketsTotal, TCategories, TFactoriesTotal] of single;
    r_BudgetAvailable                          : single; { operational budget available for current period }
    r_BudgetExtensionImmediate                 : single;
    r_BudgetExtensionNextPeriod                : single;
    r_BudgetExtensionRequestsTillNow           : byte;
    r_BudgetIncreaseFromNegotiations           : single; 
    r_BudgetOverspent                          : single; { operational budget spent in excess of available }
    r_BudgetSpentToDate                        : single; { keep total operational budget spent }
    r_CashBeginningOfYear                      : single;
    r_CashEndOfYear                            : single;  
    r_CategorySurfaceShare                     : array[TMarketsTotal, TCategoriesTotal] of single; 
    r_ClosingInventory                         : array[TMarketsTotal, TCategories] of single;
    r_ClosingInventoryValue                    : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_ClosingStockCover                        : array[TMarketsTotal, TCategoriesTotal] of single;
    r_CostOfGoodsSold                          : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_CumulativeInvestment                     : single; 
    r_CurrentInvestment                        : single;
    r_CurrentReceipts                          : single;  
    r_DebtIssuance                             : single;
    r_DebtRedemption                           : single;
    r_DiscontinuedGoodsCost                    : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_DividentsPaid                            : single;
    r_EBIT                                     : array[TMarketsTotal, TCategoriesTotal] of single;    
    r_ExceptionalCostsProfits                  : array[TMarketsTotal, TCategoriesTotal] of single; 
    r_FixedAssets                              : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_GeneralExpenses                          : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_GrantedBudgetExtensionsToDate            : single;
    r_GrossProfit                              : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    
    r_GrossProfitChange                        : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    
    r_GrossProfitMargin                        : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    
    r_GrossProfitPerShelfSpace                 : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    
    r_GrossProfitSupplierShare                 : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    
    r_GrossSalesValue                          : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;   
    r_HandlingCosts                            : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;    { corrected for width of assortment }
    r_HandlingCostsRate                        : array[TMarketsTotal, TCategoriesTotal] of single;
    r_IncrementalValueMarketShare              : array[TMarketsTotal, TCategoriesTotal] of single;
    r_InitialBudget                            : single;
    r_InitialInventory                         : array[TMarketsTotal, TCategories] of single;
    r_InitialInventoryValue                    : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_InitialStockCover                        : array[TMarketsTotal, TCategoriesTotal] of single;
    r_InStoreActivitiesCost                    : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_InStoreActivitiesFee                     : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_InStoreCosts                             : array[TMarketsTotal, TCategoriesTotal] of single;      { Space and Inventory Management }
    r_InStoreCostsAtBaseLevel                  : array[TMarketsTotal, TCategoriesTotal] of single;      { Space and Inventory Management at BASE service level }
    r_Interest                                 : array[TMarketsTotal, TCategoriesTotal] of single;
    r_InventoryHoldingCost                     : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_LabourCosts                              : array[TMarketsTotal, TCategoriesTotal] of single;
    r_LabourCostsAtBaseLevel                   : array[TMarketsTotal, TCategoriesTotal] of single;
    r_LocalAdvertising                         : array[TMarketsTotal, TCategoriesTotal] of TStorePerceptionsData;
    r_MarketResearchCost                       : array[TMarketsTotal, TCategoriesTotal] of single;
    r_MarketResearchOrders                     : TMarketResearchOrders;
    r_MarketShareValue                         : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_MarketShareValueChange                   : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_MarketShareVolume                        : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_MarketShareVolumeChange                  : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_NetCashFromFinancingActivities           : single;
    r_NetCashTotal                             : single;
    r_NetFinancialBenefit                      : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_NetProfit                                : array[TMarketsTotal, TCategoriesTotal] of single;
    r_NetProfitChange                          : array[TMarketsTotal, TCategoriesTotal] of single;
    r_NetProfitMargin                          : array[TMarketsTotal, TCategoriesTotal] of single;
    r_NetSalesRevenue                          : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_NetSalesValue                            : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_NetSalesValueChange                      : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_NetSalesValuePerShelfSpace               : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_NetSalesValueSupplierShare               : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_OnlineAdvertising                        : array[TMarketsTotal, TCategoriesTotal] of TStorePerceptionsData;
    r_OperatingExpenses                        : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_OperatingProfit                          : array[TMarketsTotal, TCategoriesTotal] of single;
    r_OperatingProfitChange                    : array[TMarketsTotal, TCategoriesTotal] of single;
    r_OperatingProfitMargin                    : array[TMarketsTotal, TCategoriesTotal] of single;
    r_OrderVolume                              : array[TMarketsTotal, TCategories] of single;
    r_OtherCompensation                        : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_PerformanceBonusBenefits                 : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_PLMarketSalesValue                       : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketSalesValueChange                 : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketSalesVolume                      : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketSalesVolumeChange                : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketShareValue                       : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketShareValueChange                 : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketShareVolume                      : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_PLMarketShareVolumeChange                : array[TMarketsTotal, TCategories, TSegmentsTotal, TShoppersKind] of single;
    r_PricePromotionsCost                      : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;  
    r_ProfitabilityIndex                       : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_PromotionalSupport                       : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_PurchaseVolume                           : array[TMarketsTotal, TCategories, TFactoriesTotal] of single;
    r_QuantityDiscountsValue                   : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_QuantityDiscountsValueOnPurchasedVolume  : single;
    r_RentAndEquipmentCosts                    : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_ReturnOnOperationalBudget                : array[TMarketsTotal, TCategoriesTotal] of single;
    r_SalesVolume                              : array[TMarketsTotal, TCategories, TFactoriesTotal] of single;
    r_SalesVolumeChange                        : array[TMarketsTotal, TCategories] of single;
    r_SellingSpace                             : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_ServiceLevel                             : array[TMarkets] of TServiceLevel;
    r_ShareInTotalGrossSalesValue              : array[TMarketsTotal, TCategoriesTotal] of single;    
    r_ShareInTotalNetSalesValue                : array[TMarketsTotal, TCategoriesTotal] of single;    
    r_ShelfSpacePerSupplier                    : array[TMarketsTotal, TCategories, TFactoriesTotal] of single;
    r_SocialNetworksScore                      : TWebTrawlerIndices;
    r_SoldUnitAverageCost                      : array[TMarketsTotal, TCategories] of single;
    r_SpaceOptimised                           : array[TMarkets, TCategories] of boolean;
    r_Taxes                                    : array[TMarketsTotal, TCategoriesTotal] of single;    
    r_TermsOfPayment                           : array[TMarketsTotal, TCategories, TFactoriesTotal] of single;  
    r_TerritorySellingSpaceWeight              : array[TMarkets, TCategories] of single;
    r_TotalAdvertising                         : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_TotalMaterialCost                        : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_TotalSupportReceived                     : array[TMarketsTotal, TCategoriesTotal, TFactoriesTotal] of single;
    r_TraditionalAdvertising                   : array[TMarketsTotal, TCategoriesTotal] of TStorePerceptionsData;
    r_TraditionalTradeSupport                  : array[TMarketsTotal, TCategoriesTotal] of single;   
    r_ValueRotationIndex                       : array[TMarketsTotal, TCategoriesTotal] of single;  
    r_VolumeRotationIndex                      : array[TMarketsTotal, TCategories] of single; 
  end;

TRetailersInternal     = array[TBMRetailers] of TRetailerInternal;
TPastRetailersInternal = array[OldestPast..LatestPast] of TRetailersInternal;

{----------------------------------------------------------------------------------------------------------------------------}

TStoreInternal =
  record
    s_StoreNumber                 : TAllStores;
    s_AdvertisingImpact           : array[TMarketsTotal] of TStorePerceptionsData;
    s_AssortmentWidth             : array[TMarketsTotal] of double;
    s_AveragePrice                : array[TMarketsTotal, TCategoriesTotal] of double;
    s_CategoryDepth               : array[TMarketsTotal, TCategoriesTotal] of double;
    s_OOSLevel                    : array[TMarketsTotal] of double;
    s_PromotionsValue             : array[TMarketsTotal] of double;
    s_ServiceImpact               : array[TMarketsTotal] of TStorePerceptionsData;
    s_ShareOfShoppers             : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    s_Shoppers                    : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    s_StoreAttractiveness         : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    s_StorePerception             : array[TMarketsTotal] of TStorePerceptionsData;
    s_StoresRelativePresence      : array[TMarketsTotal] of double;
    s_StoreWeightInCategory       : array[TMarketsTotal, TCategoriesTotal] of double;
    s_MarketShareVolume           : array[TMarketsTotal, TCategoriesTotal] of single;
    s_MarketShareValue            : array[TMarketsTotal, TCategoriesTotal] of single;
  end;

TStoresInternal     = array[TAllStores] of TStoreInternal;
TPastStoresInternal = array[OldestPast..LatestPast] of TStoresInternal;

{----------------------------------------------------------------------------------------------------------------------------}

TConsumerSegment =
  record
    cs_ConsumptionRate : single;
    cs_Consumers       : single;
  end;

TConsumerSegments = array[TSegmentsTotal] of TConsumerSegment;

TKrossSegment =
  record
    ks_Buyers                      : array[TAllStoresTotal] of single;
    ks_CompaniesValueShare         : array[TCompanies] of single;
    ks_CompaniesValueShareChange   : array[TCompanies] of single;
    ks_CompaniesVolumeShare        : array[TCompanies] of single;
    ks_CompaniesVolumeShareChange  : array[TCompanies] of single;
    ks_ConsumersSalesVolume        : single;
    ks_ConsumersVolumeMarketShare  : single;
    ks_SegmentsNetSalesValue       : array[TAllStoresTotal] of single;
    ks_SegmentsVolume              : array[TAllStoresTotal] of single;
    ks_SegmentsVolumeImportance    : array[TAllStoresTotal] of single;
    ks_TotalShoppers               : single;
  end;
  
TKrossSegments = array[TSegmentsTotal, TShoppersKind] of TKrossSegment;

TShelfSpaceShare = array[TActors] of single;

TPortfolioStrength = array[TBrandOwners] of single;

TOwnerSalesPerChannel = array[TBrandOwners, TAccountsTotal] of single;

TQuarterInternal =
  record
    q_AverageAdvertising                  : single;
    q_CategoryPenetration                 : single;
    q_ConsumerSegments                    : TConsumerSegments;
    q_Households                          : THouseholdsTotalData;
    q_KrossSegments                       : TKrossSegments;
    q_NetValueMarketSalesPerChannel       : TOwnerSalesPerChannel;
    q_NetValueMarketSalesPerChannelChange : TOwnerSalesPerChannel;
    q_PortfolioStrength                   : TPortfolioStrength;
    q_ShareInSalesValue                   : single;
    q_ShelfSpaceShare                     : TShelfSpaceShare;
    q_VolumeMarketSalesPerChannel         : TOwnerSalesPerChannel;
    q_VolumeMarketSalesPerChannelChange   : TOwnerSalesPerChannel;
  end;

TQuartersInternal = array[TMarketsTotal, TCategoriesTotal] of TQuarterInternal;

TPastQuartersInternal = array[OldestPast..LatestPast] of TQuartersInternal;

TInternalData = { only read and written by Kernel (K) module, relative file created by (I) module }
  record
    i_PeriodNumber : TPeriodNumber;
    i_Variants     : TVariantsInternal;
    i_Brands       : TBrandsInternal;
    i_Producers    : TProducersInternal;
    i_Retailers    : TRetailersInternal;
    i_Stores       : TStoresInternal;
    i_Quarters     : TQuartersInternal;
  end;

TInternalDataFile = file of TInternalData;
