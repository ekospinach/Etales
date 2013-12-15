{===============     E-Tales Simulation Results Types     ====================================================================}
Type

TProducerVariantResults =
  record
    pv_VariantName                              : TVarName;   { dpv_VarName }
    pv_VariantID                                : TVarID;     { dpv_VarID }
    pv_ParentBrandID                            : TBrandID;   { dpv_ParentBrandID }
    pv_ParentBrandIndex                         : TBrands;
    pv_ParentCompanyID                          : TBrandOwners; { dpb_ParentCompanyID }
    pv_DateofBirth                              : TTimeSpan;
    pv_DateOfDeath                              : TTimeSpan;
    pv_PackFormat                               : TVarPackFormat;
    pv_Composition                              : TVarComposition;

    pv_AdvertisingLocal                         : TMarketsTotalDetails;
    pv_AdvertisingNationalOldMedia              : TMarketsTotalDetails;
    pv_AdvertisingNationalOnLine                : TMarketsTotalDetails;
    pv_AdvertisingTotal                         : TMarketsTotalDetails;
    pv_AppliedDiscountRate                      : TRetailersTotalMarketsTotalDetails;
    pv_ClosingInventory                         : TVariantInventoriesDetails;
    pv_CostOfGoodsSold                          : TRetailersTotalMarketsTotalDetails;
    pv_CurrentPriceBM                           : single;
    pv_CurrentPriceEmall                        : single;
    pv_CurrentUnitAverageCost                   : single;     { based on current production volume }
    pv_DeltaGrossProfit                         : TMarketsTotalDetails;
    pv_DeltaGrossSalesValue                     : TMarketsTotalDetails;
    pv_DeltaOperatingProft                      : TMarketsTotalDetails;
    pv_DeltaSalesVolume                         : TMarketsTotalDetails;
    pv_Discontinued                             : boolean;
    pv_DiscontinuedGoodsCost                    : TRetailersTotalMarketsTotalDetails;
    pv_DiscontinuedGoodsVolume                  : single;
    pv_EMallSupport                             : TMarketsTotalDetails;
    pv_Amortisation                             : TMarketsTotalDetails;
    pv_GeneralExpensesTotal                     : TMarketsTotalDetails;
    pv_GrossProfit                              : TRetailersTotalMarketsTotalDetails;
    pv_GrossProfitAfterPush                     : TRetailersTotalMarketsTotalDetails;
    pv_GrossProfitMargin                        : TMarketsTotalDetails;
    pv_GrossSalesValue                          : TRetailersTotalMarketsTotalDetails;
    pv_InitialInventory                         : TVariantInventoriesDetails;  { should be copied from pv_ClosingInventoryVolume of previous period results }
    pv_InStoreActivitiesFee                     : TRetailersTotalMarketsTotalDetails;
    pv_InventoryHoldingCost                     : TRetailersTotalMarketsTotalDetails;  { include cost of capital }
    pv_NetFinancialCost                         : TRetailersTotalMarketsTotalDetails;
    pv_NetSalesValue                            : TRetailersTotalMarketsTotalDetails;  { after discounts }
    pv_NextPriceBM                              : single;
    pv_NextPriceEmall                           : single;
    pv_OperatingProfit                          : TMarketsTotalDetails;
    pv_OperatingProfitMargin                    : TMarketsTotalDetails;
    pv_OrderVolume                              : TRetailersTotalMarketsTotalDetails; { drv_Order }
    pv_OtherCompensation                        : TRetailersTotalMarketsTotalDetails;
    pv_PerformanceBonusCost                     : TRetailersTotalMarketsTotalDetails;
    pv_ProductionCost                           : TRetailersTotalMarketsTotalDetails;  { including labour }
    pv_ProductionVolume                         : single;
    pv_PromotionalSupport                       : TRetailersTotalMarketsTotalDetails;
    pv_SalesVolume                              : TRetailersTotalMarketsTotalDetails; { may differ from Order }
    pv_ShareInBrandGrossProfit                  : TRetailersTotalMarketsTotalDetails; { !!! }
    pv_ShareInBrandGrossSalesValue              : TRetailersTotalMarketsTotalDetails; { !!! }
    pv_ShareInBrandOperatingProfit              : TMarketsTotalDetails;
    pv_ShareInBrandSalesVolume                  : TRetailersTotalMarketsTotalDetails; { !!! }
    pv_ShareInBrandTradeAndMarketingExpenses    : TMarketsTotalDetails;
    pv_SoldUnitAverageCost                      : single;     { based on sold volume }
    pv_TotalGeneralExpensesSalesRatio           : TMarketsTotalDetails;
    pv_TotalMaterialCost                        : TRetailersTotalMarketsTotalDetails;
    pv_TotalTradeAndMarketingExpenses           : TMarketsTotalDetails;
    pv_TotalTradeSupport                        : TRetailersTotalMarketsTotalDetails;
    pv_TradeAndMarketingExpensesSalesRatio      : TMarketsTotalDetails;
    pv_TraditionalTradeSupport                  : TMarketsTotalDetails;
    pv_VolumeDiscountCost                       : TRetailersTotalMarketsTotalDetails;
  end;

TProducerBrandResults =
  record
    pb_BrandName                                : TBrandName;
    pb_BrandID                                  : TVarID;     { dpv_VarID }
    pb_ParentCompanyID                          : TBrandOwners;      { dpb_ParentCompanyID }
    pb_DateofBirth                              : TTimeSpan;
    pb_DateOfDeath                              : TTimeSpan;
    pb_IsPrivateLabel                           : boolean;

    pb_AdvertisingLocal                         : TMarketsTotalDetails;
    pb_AdvertisingNationalOldMedia              : TMarketsTotalDetails;
    pb_AdvertisingNationalOnLine                : single;
    pb_AdvertisingTotal                         : TMarketsTotalDetails;
    pb_Amortisation                             : TMarketsTotalDetails;
    pb_AverageCurrentPriceBM                    : single;
    pb_AverageCurrentPriceEmall                 : single;
    pb_ClosingInventory                         : single;
    pb_ClosingInventoryValue                    : single;
    pb_CostOfGoodsSold                          : TRetailersTotalMarketsTotalDetails;
    pb_CurrentUnitAverageCost                   : single;     { based on current production volume }
    pb_DeltaGrossProfit                         : TMarketsTotalDetails;
    pb_DeltaGrossSalesValue                     : TMarketsTotalDetails;
    pb_DeltaNetProfit                           : TMarketsTotalDetails;
    pb_DeltaOperatingProft                      : TMarketsTotalDetails;
    pb_DeltaSalesVolume                         : TMarketsTotalDetails;
    pb_Discontinued                             : boolean;
    pb_DiscontinuedGoodsCost                    : TRetailersTotalMarketsTotalDetails;
    pb_DiscontinuedGoodsVolume                  : single;
    pb_EMallSupport                             : single;
    pb_ExceptionalCostsProfits                  : TMarketsTotalDetails;
    pb_GeneralExpensesTotal                     : TMarketsTotalDetails;
    pb_GrossProfit                              : TRetailersTotalMarketsTotalDetails;
    pb_GrossProfitAfterPush                     : TRetailersTotalMarketsTotalDetails;
    pb_GrossProfitMargin                        : TMarketsTotalDetails;
    pb_GrossSalesValue                          : TRetailersTotalMarketsTotalDetails;
    pb_InitialInventory                         : single;  { should be copied from pb_ClosingInventoryVolume of previous period results }
    pb_InitialInventoryValue                    : single;
    pb_InStoreActivitiesFee                     : TRetailersTotalMarketsTotalDetails;
    pb_Interest                                 : TMarketsTotalDetails;
    pb_InventoryHoldingCost                     : TRetailersTotalMarketsTotalDetails;
    pb_NetFinancialCost                         : TRetailersTotalMarketsTotalDetails;
    pb_NetProfit                                : TMarketsTotalDetails;
    pb_NetProfitMargin                          : TMarketsTotalDetails;
    pb_NetSalesValue                            : TRetailersTotalMarketsTotalDetails;   { after discounts }
    pb_OperatingProfit                          : TMarketsTotalDetails;
    pb_OperatingProfitMargin                    : TMarketsTotalDetails;
    pb_OrderVolume                              : TRetailersTotalMarketsTotalDetails; { drv_Order }
    pb_OtherCompensation                        : TRetailersTotalMarketsTotalDetails;
    pb_PerformanceBonusCost                     : TRetailersTotalMarketsTotalDetails;
    pb_ProductionCost                           : TRetailersTotalMarketsTotalDetails;
    pb_ProductionVolume                         : single;                      { dpv_Production }
    pb_PromotionalSupport                       : TRetailersTotalMarketsTotalDetails;
    pb_SalesVolume                              : TRetailersTotalMarketsTotalDetails; { may differ from Order }
    pb_ShareInCategorySalesVolume               : TRetailersTotalMarketsTotalDetails;  { !!! }
    pb_ShareInCategoryGrossProfit               : TRetailersTotalMarketsTotalDetails;  { !!! }
    pb_ShareInCategoryGrossSalesValue           : TRetailersTotalMarketsTotalDetails;  { !!! }
    pb_ShareInCategoryNetProfit                 : TMarketsTotalDetails;
    pb_ShareInCategoryOperatingProfit           : TMarketsTotalDetails;
    pb_ShareInCategoryTradeAndMarketingExpenses : TMarketsTotalDetails;
    pb_SoldUnitAverageCost                      : single;     { based on sold volume }
    pb_Taxes                                    : TMarketsTotalDetails;
    pb_TotalGeneralExpensesSalesRatio           : TMarketsTotalDetails;
    pb_TotalMaterialCost                        : TRetailersTotalMarketsTotalDetails;
    pb_TotalTradeAndMarketingExpenses           : TMarketsTotalDetails;
    pb_TotalTradeSupport                        : TRetailersTotalMarketsTotalDetails;
    pb_TradeAndMarketingExpensesSalesRatio      : TMarketsTotalDetails;
    pb_TraditionalTradeSupport                  : TMarketsTotalDetails;
    pb_VariantsResults                          : array[TOneBrandVars] of TProducerVariantResults;
    pb_VolumeDiscountCost                       : TRetailersTotalMarketsTotalDetails;
  end;

TProducerCategoryResults =
  record
    pc_AcquiredDesignLevel                      : TDesign;
    pc_AcquiredProductionFlexibility            : single;   { saved as decimal }
    pc_AcquiredTechnologyLevel                  : TTechnology;
    pc_AdvertisingLocal                         : TMarketsTotalDetails;
    pc_AdvertisingNationalOldMedia              : TMarketsTotalDetails;
    pc_AdvertisingNationalOnLine                : TMarketsTotalDetails;
    pc_AdvertisingTotal                         : TMarketsTotalDetails;
    pc_Amortisation                             : TMarketsTotalDetails;
    pc_AverageCurrentPriceBM                    : single;
    pc_AverageCurrentPriceEmall                 : single;
    pc_AverageNetConsumerPrice                  : TMarketsTotalDetails;
    pc_AverageNetWholesalePrice                 : TMarketsTotalDetails;
    pc_BrandsResults                            : array[TProBrands] of TProducerBrandResults;
    pc_CapacityUtilisationRate                  : single;
    pc_CashBeginningOfYear                      : single;
    pc_CashEndOfYear                            : single;
    pc_CategoryID                               : TCategories;
    pc_ClosingInventory                         : single;
    pc_ClosingInventoryValue                    : single;
    pc_ConsumersSalesVolume                     : array[TMarketsTotal] of TSegmentsTotalData;
    pc_ConsumersVolumeMarketShare               : array[TMarketsTotal] of TSegmentsTotalData;
    pc_CostOfGoodsSold                          : TRetailersTotalMarketsTotalDetails;
    pc_CPTO                                     : array[TMarketsTotal] of TSegmentsTotalData;
    pc_CPTOShare                                : array[TMarketsTotal] of TSegmentsTotalData;
    pc_CumulatedDesignVolume                    : TDesignsDetails;
    pc_CumulatedTechnologyVolume                : TTechnologiesDetails;
    pc_CurrentUnitAverageCost                   : single;     { based on current production volume }
    pc_DebtIssuance                             : single;
    pc_DebtRedemption                           : single;
    pc_DeltaGrossProfit                         : TMarketsTotalDetails;
    pc_DeltaGrossSalesValue                     : TMarketsTotalDetails;
    pc_DeltaNetProfit                           : TMarketsTotalDetails;
    pc_DeltaOperatingProft                      : TMarketsTotalDetails;
    pc_DiscontinuedGoodsCost                    : TRetailersTotalMarketsTotalDetails;
    pc_DiscontinuedGoodsVolume                  : single;
    pc_DividentsPaid                            : single;
    pc_EMallSupport                             : TMarketsTotalDetails;
    pc_ExceptionalCostsProfits                  : TMarketsTotalDetails;
    pc_FixedAssets                              : single;
    pc_GeneralExpensesTotal                     : TMarketsTotalDetails;
    pc_GrossProfit                              : TRetailersTotalMarketsTotalDetails;
    pc_GrossProfitAfterPush                     : TRetailersTotalMarketsTotalDetails;
    pc_GrossProfitMargin                        : TMarketsTotalDetails;
    pc_GrossSalesValue                          : TRetailersTotalMarketsTotalDetails;
    pc_InitialInventory                         : single;
    pc_InitialInventoryValue                    : single;
    pc_InStoreActivitiesFee                     : TRetailersTotalMarketsTotalDetails;
    pc_Interest                                 : TMarketsTotalDetails;
    pc_InventoryHoldingCost                     : TRetailersTotalMarketsTotalDetails;
    pc_InvestInDesign                           : single;
    pc_InvestInProductionFlexibility            : single;
    pc_InvestInTechnology                       : single;
    pc_InvestmentInCapacityChange               : single;
    pc_LabourCost                               : TMarketsTotalDetails;
    pc_MarketResearchCost                       : TMarketsTotalDetails;  { the payable part }
    pc_NetCashFromFinancingActivities           : single;
    pc_NetCashFromInvestingActivities           : single;
    pc_NetCashFromOperatingActivities           : single;
    pc_NetCashTotal                             : single;
    pc_NetFinancialCost                         : TRetailersTotalMarketsTotalDetails;
    pc_NetProfit                                : TMarketsTotalDetails;
    pc_NetProfitMargin                          : TMarketsTotalDetails;
    pc_NetSalesValue                            : TRetailersTotalMarketsTotalDetails;   { after discounts }
    pc_OperatingProfit                          : TMarketsTotalDetails;
    pc_OperatingProfitMargin                    : TMarketsTotalDetails;
    pc_OrderVolume                              : TRetailersTotalMarketsTotalDetails; { drv_Order }
    pc_OtherCompensation                        : TRetailersTotalMarketsTotalDetails;
    pc_OtherOverhead                            : TMarketsTotalDetails;
    pc_ParentCompanyID                          : TBrandOwners;      { dpb_ParentCompanyID }
    pc_PerformanceBonusCost                     : TRetailersTotalMarketsTotalDetails;
    pc_ProductionCapacity                       : single;
    pc_ProductionCost                           : TRetailersTotalMarketsTotalDetails;
    pc_ProductionVolume                         : single;                      { dpv_Production }
    pc_PromotionalSupport                       : TRetailersTotalMarketsTotalDetails;
    pc_SalesForceCost                           : TMarketsTotalDetails;
    pc_SalesVolume                              : TRetailersTotalMarketsTotalDetails; { may differ from Order }
    pc_ShareInCompanyGrossProfit                : TRetailersTotalMarketsTotalDetails; { !!! }
    pc_ShareInCompanyGrossSalesValue            : TRetailersTotalMarketsTotalDetails; { !!! }
    pc_ShareInCompanyNetProfit                  : TMarketsTotalDetails;
    pc_ShareInCompanyOperatingProfit            : TMarketsTotalDetails;
    pc_ShareInCompanyTradeAndMarketingExpenses  : TMarketsTotalDetails;
    pc_SocialNetworksScore                      : TWebTrawlerIndices;     { ### }
    pc_SoldUnitAverageCost                      : single;     { based on sold volume }
    pc_Taxes                                    : TMarketsTotalDetails;
    pc_TotalGeneralExpensesSalesRatio           : TMarketsTotalDetails;
    pc_TotalMaterialCost                        : TRetailersTotalMarketsTotalDetails;
    pc_TotalTradeAndMarketingExpenses           : TMarketsTotalDetails;
    pc_TotalTradeSupport                        : TRetailersTotalMarketsTotalDetails;
    pc_TradeAndMarketingExpensesSalesRatio      : TMarketsTotalDetails;
    pc_TraditionalTradeSupport                  : TMarketsTotalDetails;
    pc_VolumeDiscountCost                       : TRetailersTotalMarketsTotalDetails;
    pc_WholesaleValueMarketShare                : TMarketsTotalDetails;
    pc_WholesaleVolumeMarketShare               : TMarketsTotalDetails;
  end;

TProducerTotalResults =
  record
    pt_CompanyID                                : TBrandOwners;

    pt_FixedAssets                              : single;
    pt_AdvertisingLocal                         : TMarketsTotalDetails;
    pt_AdvertisingNationalOldMedia              : TMarketsTotalDetails;
    pt_AdvertisingNationalOnLine                : TMarketsTotalDetails;
    pt_AdvertisingTotal                         : TMarketsTotalDetails;
    pt_Amortisation                             : TMarketsTotalDetails;
    pt_BudgetAvailable                          : single; { operational budget available for current period }
    pt_BudgetOverspent                          : single; { operational budget spent in excess of available }
    pt_BudgetExtensionRequestsTillNow           : byte;
    pt_BudgetSpentToDate                        : single; { keep total operational budget spent }
    pt_CashBeginningOfYear                      : single;
    pt_CashEndOfYear                            : single;
    pt_CategoriesResults                        : array[TCategories] of TProducerCategoryResults;
    pt_ClosingInventoryValue                    : single;
    pt_CostOfGoodsSold                          : TRetailersTotalMarketsTotalDetails;
    pt_CPTO                                     : array[TMarketsTotal] of TSegmentsTotalData;
    pt_CPTOShare                                : array[TMarketsTotal] of TSegmentsTotalData;
    pt_DebtIssuance                             : single;
    pt_DebtRedemption                           : single;
    pt_DeltaGrossProfit                         : TMarketsTotalDetails;
    pt_DeltaGrossSalesValue                     : TMarketsTotalDetails;
    pt_DeltaNetProfit                           : TMarketsTotalDetails;
    pt_DeltaOperatingProft                      : TMarketsTotalDetails;
    pt_DiscontinuedGoodsCost                    : TRetailersTotalMarketsTotalDetails;
    pt_DividentsPaid                            : single;
    pt_EMallSupport                             : TMarketsTotalDetails;
    pt_ExceptionalCostsProfits                  : TMarketsTotalDetails;
    pt_GeneralExpensesTotal                     : TMarketsTotalDetails;
    pt_GrantedBudgetExtensionsToDate            : single;  
    pt_GrossProfit                              : TRetailersTotalMarketsTotalDetails;
    pt_GrossProfitAfterPush                     : TRetailersTotalMarketsTotalDetails;
    pt_GrossProfitMargin                        : TMarketsTotalDetails;
    pt_GrossSalesValue                          : TRetailersTotalMarketsTotalDetails;
    pt_InitialBudget                            : single;
    pt_InitialInventoryValue                    : single;
    pt_InStoreActivitiesFee                     : TRetailersTotalMarketsTotalDetails;
    pt_Interest                                 : TMarketsTotalDetails;
    pt_InventoryHoldingCost                     : TRetailersTotalMarketsTotalDetails;
    pt_InvestInDesign                           : single;
    pt_InvestInProductionFlexibility            : single;
    pt_InvestInTechnology                       : single;
    pt_InvestmentInCapacityChange               : single;
    pt_LabourCost                               : TMarketsTotalDetails;
    pt_MarketResearchCost                       : TMarketsTotalDetails;
    pt_NetCashFromFinancingActivities           : single;
    pt_NetCashFromInvestingActivities           : single;
    pt_NetCashFromOperatingActivities           : single;
    pt_NetCashTotal                             : single;
    pt_NetFinancialCost                         : TRetailersTotalMarketsTotalDetails;
    pt_NetProfit                                : TMarketsTotalDetails;
    pt_NetProfitMargin                          : TMarketsTotalDetails;
    pt_NetSalesValue                            : TRetailersTotalMarketsTotalDetails;   { after discounts }
    pt_OperatingProfit                          : TMarketsTotalDetails;
    pt_OperatingProfitMargin                    : TMarketsTotalDetails;
    pt_OtherCompensation                        : TRetailersTotalMarketsTotalDetails;
    pt_OtherOverhead                            : TMarketsTotalDetails;
    pt_PerformanceBonusCost                     : TRetailersTotalMarketsTotalDetails;
    pt_ProductionCost                           : TRetailersTotalMarketsTotalDetails;
    pt_PromotionalSupport                       : TRetailersTotalMarketsTotalDetails;
    pt_SalesForceCost                           : TMarketsTotalDetails;
    pt_SocialNetworksScore                      : TWebTrawlerIndices;  
    pt_Taxes                                    : TMarketsTotalDetails;
    pt_TotalGeneralExpensesSalesRatio           : TMarketsTotalDetails;
    pt_TotalMaterialCost                        : TRetailersTotalMarketsTotalDetails;
    pt_TotalTradeAndMarketingExpenses           : TMarketsTotalDetails;
    pt_TotalTradeSupport                        : TRetailersTotalMarketsTotalDetails;
    pt_TradeAndMarketingExpensesSalesRatio      : TMarketsTotalDetails;
    pt_TraditionalTradeSupport                  : TMarketsTotalDetails;
    pt_VolumeDiscountCost                       : TRetailersTotalMarketsTotalDetails;
    pt_WholesaleValueMarketShare                : TMarketsTotalDetails;
  end;

  TProducerResultsFile = file of TProducerTotalResults;
  TProducersResults    = array[TAllProducers] of TProducerTotalResults;

{-----------------------------------------------------------------------------------------------------------------------------}

TRetailerVariantResults =
  record
    rv_VariantName                              : TVarName;   { dpv_VarName }
    rv_VariantID                                : TVarID;     { dpv_VarID }
    rv_ParentBrandID                            : TBrandID;   { dpv_ParentBrandID }
    rv_ParentBrandIndex                         : TBrands;
    rv_ParentCompanyID                          : TBrandOwners; { dpb_ParentCompanyID }
    rv_DateofBirth                              : TTimeSpan;
    rv_DateOfDeath                              : TTimeSpan;
    rv_PackFormat                               : TVarPackFormat;
    rv_Composition                              : TVarComposition;  { practically redundant, but kept to store previous Private Label variants' composition }

    rv_AcquisitionCost                          : single;
    rv_AppliedDiscountRate                      : single;
    rv_ClosingInventory                         : TVariantInventoriesDetails;
    rv_ClosingInventoryValue                    : single;  
    rv_ClosingStockCover                        : single;
    rv_CostOfGoodsSold                          : single;
    rv_CurrentUnitAcquisitionCost               : single;
    rv_DeltaGrossProfit                         : single;
    rv_DeltaGrossSalesValue                     : single;
    rv_DeltaNetProfit                           : single;
    rv_DeltaOperatingProft                      : single;
    rv_DiscontinuedGoodsCost                    : single;
    rv_DiscontinuedGoodsVolume                  : single;
    rv_EMallSupport                             : single;
    rv_ExceptionalCostsProfits                  : single;
    rv_GrossProfit                              : single;
    rv_GrossProfitMargin                        : single;
    rv_GrossSalesValue                          : single;
    rv_HandlingCosts                            : single;
    rv_InitialInventory                         : TVariantInventoriesDetails;
    rv_InitialStockCover                        : single;
    rv_InStoreActivitiesCost                    : single;
    rv_InStoreActivitiesFee                     : single;
    rv_Interest                                 : single;  
    rv_InventoryHoldingCost                     : single;
    rv_MarketingExpensesSalesRatio              : single;  
    rv_MarketPrice                              : single;
    rv_NetFinancialBenefit                      : single;
    rv_NetMarketPrice                           : single;
    rv_NetProfit                                : single;
    rv_NetProfitMargin                          : single;
    rv_NetSalesRevenue                          : single;
    rv_NetSalesValue                            : single;
    rv_NextUnitAcquisitionCost                  : single;
    rv_OperatingProfit                          : single;
    rv_OperatingProfitMargin                    : single;
    rv_OrderVolume                              : single;
    rv_OtherCompensation                        : single;
    rv_PerformanceBonusBenefits                 : single;
    rv_PricePromotionsCost                      : single;
    rv_ProfitabilityIndex                       : single;
    rv_PromotionalSupport                       : single;
    rv_PromotionsDetails                        : TPromotionsDetails;
    rv_PromotionsIntensity                      : single;   { standarised = effect of length and effect of depth }
    rv_PurchaseVolume                           : single;
    rv_SalesVolume                              : single;
    rv_ShareInBrandGrossProfit                  : single;
    rv_ShareInBrandGrossSalesValue              : single;
    rv_ShareInBrandMarketingExpenses            : single;  
    rv_ShareInBrandNetProfit                    : single;
    rv_ShareInBrandNetSalesRevenue              : single;
    rv_ShareInBrandOperatingProfit              : single;
    rv_ShelfSpace                               : single;
    rv_SoldUnitAverageCost                      : single;
    rv_SoldVolumeDiscountBenefits               : single;
    rv_Taxes                                    : single;  
    rv_TermsOfPayment                           : TDelayOfPayment;
    rv_TotalGeneralExpenses                     : single; 
    rv_TotalGeneralExpensesSalesRatio           : single;
    rv_TotalMaterialCost                        : single;
    rv_TotalQuantityDiscountsValue              : single;
    rv_TotalSupportReceived                     : single;
    rv_TraditionalTradeSupport                  : single;
    rv_ValueRotationIndex                       : single;
    rv_VisibilityShare                          : single;   { due to shelf space and In-store activities }
    rv_VolumeRotationIndex                      : single;
  end;

TRetailerBrandResults =
  record
    rb_BrandName                                : TBrandName;
    rb_BrandID                                  : TBrandID;
    rb_ParentCompanyID                          : TBrandOwners;
    rb_DateofBirth                              : TTimeSpan;
    rb_DateOfDeath                              : TTimeSpan;

    rb_AcquisitionCost                          : single;
    rb_AverageMarketPrice                       : single;
    rb_AverageNetMarketPrice                    : single;
    rb_ClosingInventory                         : single;
    rb_ClosingInventoryValue                    : single;
    rb_ClosingStockCover                        : single;
    rb_CostOfGoodsSold                          : single;
    rb_CurrentUnitAcquisitionAverageCost        : single;
    rb_DeltaGrossProfit                         : single;
    rb_DeltaGrossSalesValue                     : single;
    rb_DeltaNetProfit                           : single;
    rb_DeltaOperatingProft                      : single;
    rb_DiscontinuedGoodsCost                    : single;
    rb_DiscontinuedGoodsVolume                  : single;
    rb_EMallSupport                             : single;
    rb_ExceptionalCostsProfits                  : single;
    rb_GrossProfit                              : single;
    rb_GrossProfitMargin                        : single;
    rb_GrossSalesValue                          : single;
    rb_InitialInventory                         : single;
    rb_InitialInventoryValue                    : single;
    rb_InitialStockCover                        : single;
    rb_InStoreActivitiesCost                    : single;
    rb_InStoreActivitiesFee                     : single;
    rb_Interest                                 : single;  
    rb_InventoryHoldingCost                     : single;
    rb_MarketingExpensesSalesRatio              : single; 
    rb_NetFinancialBenefit                      : single;
    rb_NetProfit                                : single;
    rb_NetProfitMargin                          : single;
    rb_NetSalesRevenue                          : single;
    rb_NetSalesValue                            : single;
    rb_NextUnitAcquisitionAverageCost           : single;
    rb_OperatingProfit                          : single;
    rb_OperatingProfitMargin                    : single;
    rb_OrderVolume                              : single;
    rb_OtherCompensation                        : single;
    rb_PerformanceBonusBenefits                 : single;
    rb_PricePromotionsCost                      : single;
    rb_ProfitabilityIndex                       : single;
    rb_PromotionalSupport                       : single;
    rb_PromotionsIntensity                      : single;   { standarised effect of length and effect of depth }
    rb_PurchaseVolume                           : single;
    rb_SalesVolume                              : single;
    rb_ShareInQuarterGrossProfit                : single;  
    rb_ShareInQuarterGrossSalesValue            : single;  
    rb_ShareInQuarterMarketingExpenses          : single;  
    rb_ShareInQuarterNetProfit                  : single;  
    rb_ShareInQuarterNetSalesRevenue            : single;  
    rb_ShareInQuarterOperatingProfit            : single;  
    rb_ShelfSpace                               : single;
    rb_SocialNetworksScore                      : TWebTrawlerIndices;
    rb_SoldUnitAverageCost                      : single;
    rb_SoldVolumeDiscountBenefits               : single;
    rb_Taxes                                    : single; 
    rb_TermsOfPayment                           : TDelayOfPayment;  
    rb_TotalGeneralExpenses                     : single; 
    rb_TotalGeneralExpensesSalesRatio           : single;
    rb_TotalMaterialCost                        : single;
    rb_TotalQuantityDiscountsValue              : single;
    rb_TotalSupportReceived                     : single;
    rb_TraditionalTradeSupport                  : single;
    rb_ValueRotationIndex                       : single;
    rb_VariantsResults                          : array[TOneBrandVars] of TRetailerVariantResults;
    rb_VisibilityShare                          : single;   { due to shelf space and In-store activities }
    rb_VolumeRotationIndex                      : single;
  end;

TRetailerQuarterResults =
  record
    rq_AcquiredSpaceOptimisationLevel           : single;
    rq_AcquisitionCost                          : single;
    rq_AdjustedGrossProfit                      : array[TAllProducersTotal] of single;  
    rq_AdjustedGrossProfitMargin                : array[TAllProducersTotal] of single;  
    rq_AdjustedGrossProfitPerShelfSpace         : array[TAllProducersTotal] of single;  
    rq_Amortisation                             : single;
    rq_AssortmentWidth                          : integer; 
    rq_AverageMarketPrice                       : single;
    rq_AverageNetMarketPrice                    : single;
    rq_BrandsResults                            : array[TBrands] of TRetailerBrandResults;
    rq_CashBeginningOfYear                      : single;
    rq_CashEndOfYear                            : single;  
    rq_CategorySurfaceShare                     : single;
    rq_ClosingInventory                         : single;
    rq_ClosingInventoryValue                    : single;
    rq_ClosingStockCover                        : single;
    rq_CostOfGoodsSold                          : single;
    rq_CPTO                                     : TSegmentsTotalData;   {### new }
    rq_CPTOShare                                : TSegmentsTotalData;
    rq_CurrentUnitAcquisitionAverageCost        : single;
    rq_DebtIssuance                             : single;
    rq_DebtRedemption                           : single;
    rq_DeltaGrossProfit                         : single;
    rq_DeltaGrossSalesValue                     : single;
    rq_DeltaNetProfit                           : single;
    rq_DeltaOperatingProft                      : single;
    rq_DiscontinuedGoodsCost                    : single;
    rq_DiscontinuedGoodsVolume                  : single;
    rq_DividentsPaid                            : single;
    rq_EMallSupport                             : single;
    rq_ExceptionalCostsProfits                  : single;
    rq_FixedAssets                              : single;   
    rq_GrossProfit                              : array[TAllProducersTotal] of single;  
    rq_GrossProfitMargin                        : single;
    rq_GrossSalesValue                          : single;
    rq_HandlingCosts                            : single;    { corrected for width of assortment }
    rq_InitialInventory                         : single;
    rq_InitialInventoryValue                    : single;
    rq_InitialStockCover                        : single;
    rq_InStoreActivitiesCost                    : single;
    rq_InStoreActivitiesFee                     : single;
    rq_InStoreCosts                             : single;    { Space and Inventory Management }
    rq_Interest                                 : single;
    rq_InventoryHoldingCost                     : single;
    rq_LabourCosts                              : single;
    rq_LocalAdvertising                         : TStorePerceptionsData;
    rq_LocalAdvertisingTotalBudget              : single;  
    rq_MarketingExpensesSalesRatio              : single; 
    rq_NetCashFromFinancingActivities           : single;
    rq_NetCashFromInvestingActivities           : single;
    rq_NetCashFromOperatingActivities           : single;
    rq_NetCashTotal                             : single;
    rq_NetFinancialBenefit                      : array[TAllProducersTotal] of single;  
    rq_NetProfit                                : single;
    rq_NetProfitMargin                          : single;
    rq_NetSalesRevenue                          : array[TAllProducersTotal] of single;  
    rq_NetSalesValue                            : array[TAllProducersTotal] of single;  { ###  modified }
    rq_NextUnitAcquisitionAverageCost           : single;
    rq_OnlineAdvertising                        : TStorePerceptionsData;
    rq_OnlineAdvertisingTotalBudget             : single;  
    rq_OperatingProfit                          : single;
    rq_OperatingProfitMargin                    : single;
    rq_OrderVolume                              : single;
    rq_OtherCompensation                        : single;
    rq_PerformanceBonusBenefits                 : single;
    rq_PrivateLabelsSalesVolume                 : TSegmentsTotalData;   {### new }
    rq_PrivateLabelsVolumeMarketShare           : TSegmentsTotalData;   {### new }
    rq_PricePromotionsCost                      : single;
    rq_ProfitabilityIndex                       : single;
    rq_PromotionalSupport                       : single;
    rq_PurchaseVolume                           : single;
    rq_RentAndEquipmentCosts                    : single;
    rq_RetailersValueMarketShare                : single;
    rq_RetailersVolumeMarketShare               : single;
    rq_SalesVolume                              : single;
    rq_SellingSpace                             : single; 
    rq_ShareInTotalGrossProfit                  : single;  
    rq_ShareInTotalGrossSalesValue              : single;  
    rq_ShareInTotalMarketingExpenses            : single;  
    rq_ShareInTotalNetProfit                    : single;  
    rq_ShareInTotalNetSalesValue                : single;    
    rq_ShareInTotalOperatingProfit              : single;  
    rq_ShelfSpacePerSupplier                    : array[TAllProducers] of single;  
    rq_SocialNetworksScore                      : TWebTrawlerIndices;  
    rq_SoldUnitAverageCost                      : single;
    rq_SoldVolumeDiscountBenefits               : single;
    rq_SpaceOptimised                           : boolean;
    rq_SuppliersShareInNetSalesRevenue          : array[TAllProducers] of single;  
    rq_SuppliersShareInAdjustedGrossProfit      : array[TAllProducers] of single;  
    rq_Taxes                                    : single;
    rq_TermsOfPayment                           : array[TAllProducersTotal] of TDelayOfPayment; 
    rq_TotalAdvertising                         : single;
    rq_TotalGeneralExpenses                     : single;  
    rq_TotalGeneralExpensesSalesRatio           : single;
    rq_TotalMaterialCost                        : single;
    rq_TotalOperatingExpenses                   : single;
    rq_TotalQuantityDiscountsValue              : single;
    rq_TotalSupportReceived                     : single;
    rq_TraditionalAdvertising                   : TStorePerceptionsData;
    rq_TraditionalAdvertisingTotalBudget        : single;  
    rq_TraditionalTradeSupport                  : single;
    rq_ValueRotationIndex                       : single;
    rq_VolumeRotationIndex                      : single;
    
    rq_Buyers                                   : TCategoriesSegmentsTotalData;     { +++ ADDED 13/12/2013 }
    
    
  end;

TRetailerMarketResults =
  record
    rm_ServiceLevel     : TServiceLevel;
    rm_StorePerceptions : TStorePerceptionsData;       { +++ ADDED 13/12/2013 }
  end;    
  
TRetailerTotalResults = 
  record
    rr_CompanyID                      : TActors;
    rr_BudgetAvailable                : single; { operational budget available for current period }
    rr_BudgetOverspent                : single; { operational budget spent in excess of available }
    rr_BudgetExtensionRequestsTillNow : byte;
    rr_BudgetSpentToDate              : single; { keep total operational budget spent }
    rr_GrantedBudgetExtensionsToDate  : single;
    rr_InitialBudget                  : single;
    rr_Markets                        : array[TMarkets] of TRetailerMarketResults;
    rr_Quarters                       : array[TMarketsTotal, TCategoriesTotal] of TRetailerQuarterResults;
  end;
     
TRetailerResultsFile  = file of TRetailerTotalResults;
TRetailersResults     = array[TAllRetailers] of TRetailerTotalResults;

TVariantResults =
  record
    v_VariantName                              : TVarName;
    v_VariantID                                : TVarID;
    v_ParentBrandID                            : TBrandID;
    v_ParentBrandIndex                         : TBrands;
    v_ParentCompanyID                          : TBrandOwners;
    v_DateofBirth                              : TTimeSpan;
    v_DateOfDeath                              : TTimeSpan;
    v_AverageNetMarketPrice                    : TMarketsTotalDetails;    { total across all retailers }
    v_Composition                              : TVarComposition;
    v_Discontinued                             : boolean;
    v_EndingInventoryValue                     : TMarketsTotalDetails;
    v_EndingInventoryVolume                    : TMarketsTotalDetails;
    v_EndingStockCover                         : TMarketsTotalDetails;    { total across all retailers }
    v_InitialInventoryValue                    : TMarketsTotalDetails;
    v_InitialInventoryVolume                   : TMarketsTotalDetails;
    v_InitialStockCover                        : TMarketsTotalDetails;    { total across all retailers }
    v_PackFormat                               : TVarPackFormat;
    v_Perception                               : array[TMarkets] of TVariantPerceptionsData;
    v_PromotionsIntensity                      : TMarketsTotalDetails;    { total across all retailers }
    v_ShelfSpace                               : TMarketsTotalDetails;    { total across all retailers }
    v_ValueMarketShare                         : array[TMarketsTotal] of TSegmentsTotalData;
    v_ValueSales                               : array[TMarketsTotal] of TSegmentsTotalData;
    v_VisibilityShare                          : TMarketsTotalDetails;    { total across all retailers }
    v_VolumeMarketShare                        : array[TMarketsTotal] of TSegmentsTotalData;
    v_VolumeSales                              : array[TMarketsTotal] of TSegmentsTotalData;
  end;

TCategoryVariantsResults = array[TVariants] of TVariantResults;
TVariantsResults         = array[TCategories] of TCategoryVariantsResults;

TBrandResults =
  record
    b_BrandName                                : TBrandName;
    b_BrandID                                  : TBrandID;
    b_ParentCompanyID                          : TBrandOwners;
    b_DateofBirth                              : TTimeSpan;
    b_DateOfDeath                              : TTimeSpan;
    b_AverageNetMarketPrice                    : TMarketsTotalDetails;    { total across all retailers }
    b_Awareness                                : TMarketsDetails;         { saved as decimal }
    b_Discontinued                             : boolean;
    b_EndingInventoryValue                     : TMarketsTotalDetails;
    b_EndingInventoryVolume                    : TMarketsTotalDetails;
    b_EndingStockCover                         : TMarketsTotalDetails;   { total across all retailers }
    b_InitialInventoryValue                    : TMarketsTotalDetails;
    b_InitialInventoryVolume                   : TMarketsTotalDetails;
    b_InitialStockCover                        : TMarketsTotalDetails;   { total across all retailers }
    b_Perception                               : array[TMarkets] of TVariantPerceptionsData;  { as weighted average of variants perceptions }
    b_PromotionsIntensity                      : TMarketsTotalDetails;   { total across all retailers }
    b_ShelfSpace                               : TMarketsTotalDetails;   { total across all retailers }
    b_SocialNetworksScore                      : array[TMarketsTotal] of TWebTrawlerIndices;   {### modified}
    b_ValueMarketShare                         : array[TMarketsTotal] of TSegmentsTotalData;
    b_ValueSales                               : array[TMarketsTotal] of TSegmentsTotalData;
    b_VisibilityShare                          : TMarketsTotalDetails;   { total across all retailers, saved as a decimal }
    b_VolumeMarketShare                        : array[TMarketsTotal] of TSegmentsTotalData;
    b_VolumeSales                              : array[TMarketsTotal] of TSegmentsTotalData;
  end;

TCategoryBrandsResults = array[TBrands] of TBrandResults;
TBrandsResults         = array[TCategories] of TCategoryBrandsResults;

TQuarterResults =
  record
    q_AverageNetMarketPrice                    : TSegmentsTotalData;
    q_SegmentsNetValues                        : TSegmentsTotalData;
    q_SegmentsVolumes                          : TSegmentsTotalData;
    q_ShareInSalesValue                        : single;
  end;

TQuartersResults = array[TMarketsTotal, TCategoriesTotal] of TQuarterResults;

TAllResults =
  record
    r_PeriodNumber : TPeriodNumber;
    r_Brands       : TBrandsResults;
    r_Quarters     : TQuartersResults;
    r_Retailers    : TRetailersResults;
    r_Producers    : TProducersResults;
    r_Variants     : TVariantsResults;
  end;

TAllResultsFile = file of TAllResults;

