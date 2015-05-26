{===============     E-Tales Simulation Results Types     ====================================================================}
Type

TVariantCharacteristics = record
                            vc_VariantID          : TVariantID;
                            vc_VariantName        : TVariantName;
                            vc_ParentBrandID      : TBrandID;
                            vc_ParentBrandName    : TBrandName;
                            vc_PackFormat         : TVariantPackFormat;
                            vc_Composition        : TVariantComposition;
                            vc_CurrentBMListPrice : single;
			  vc_BMListPriceChange  : single;   { added on 14-April-2015 }    
                          end;



TVariantEMallPricesAndPromotions = record
                                     vemp_VariantID       : TVariantID;
                                     vemp_VariantName     : TVariantName;
                                     vemp_ParentBrandID   : TBrandID;
                                     vemp_ParentBrandName : TBrandName;
                                     vemp_NetOnlinePrice  : single;
                                     vemp_PriceChange     : single; { stored as a positive or negative decimal, to be converted to %. }
                                     vemp_Promotions      : TPromotionsDetails;
                                   end;


TSegmentVariantLeader = record
                          leader_ID              : TVariantID;
                          leader_Name            : TVariantName;
                          leader_ParentBrandID   : TBrandID;
                          leader_ParentBrandName : TBrandName;
                          leader_Share           : single;
                        end;

TSegmentVariantLeaders = array[TLeaders] of TSegmentVariantLeader;


TVariantNegotiationsDetails = record
                                vnd_VariantID         : TVariantID;
                                vnd_VariantName       : TVariantName;
                                vnd_ParentBrandID     : TBrandID;
                                vnd_ParentBrandName   : TBrandName;
                                vnd_ParentCompanyID   : TActors;
                                vnd_QuantityDiscount  : TDiscountsDetails;
                                vnd_TargetBonus       : TBonusDetails;
                                vnd_PaymentTerms      : TDelayOfPayment;
                                vnd_OtherCompensation : single;
                                vnd_ContractHonoured  : boolean;
                              end;

TVariantCrossSegmentDetails = record
                                vsd_VariantID         : TVariantID;
                                vsd_VariantName       : TVariantName;
                                vsd_ParentBrandID     : TBrandID;
                                vsd_ParentBrandName   : TBrandName;
                                vsd_ParentCompanyID   : TActors;
                                vsd_Shown             : boolean;    { flag used to determine if should be displayed. For instance, Private Labels of Retailer 1, should not be displayed in Retailer 2 report }
                                vsd_AbsoluteValue     : array[TSegmentsTotal, TShoppersKind] of single;
                                vsd_ValueChange       : array[TSegmentsTotal, TShoppersKind] of single;
                                vsd_AbsoluteVolume    : array[TSegmentsTotal, TShoppersKind] of single;
                                vsd_VolumeChange      : array[TSegmentsTotal, TShoppersKind] of single;
                              end;

TBrandOwnerCrossSegmentDetails = record
                                   bosd_CompanyID         : TBrandOwners;
                                   bosd_AbsoluteValue     : array[TSegmentsTotal, TShoppersKind] of single;
                                   bosd_ValueChange       : array[TSegmentsTotal, TShoppersKind] of single;
                                   bosd_AbsoluteVolume    : array[TSegmentsTotal, TShoppersKind] of single;
                                   bosd_VolumeChange      : array[TSegmentsTotal, TShoppersKind] of single;
                                 end;

TVariantChannelDetails = record
                           vcd_VariantID         : TVariantID;
                           vcd_VariantName       : TVariantName;
                           vcd_ParentBrandID     : TBrandID;
                           vcd_ParentBrandName   : TBrandName;
                           vcd_ParentCompanyID   : TBrandOwners;
                           vcd_Shown             : boolean;
                           vcd_AbsoluteValue     : array[TAccountsTotal] of single;
                           vcd_ValueChange       : array[TAccountsTotal] of single;
                           vcd_AbsoluteVolume    : array[TAccountsTotal] of single;
                           vcd_VolumeChange      : array[TAccountsTotal] of single;
                         end;

TBrandChannelDetails = record
                         bcd_BrandID         : TBrandID;
                         bcd_BrandName       : TBrandName;
                         bcd_ParentCompanyID : TBrandOwners;
                         bcd_Shown           : boolean;
                         bcd_AbsoluteValue   : array[TAccountsTotal] of single;
                         bcd_ValueChange     : array[TAccountsTotal] of single;
                         bcd_AbsoluteVolume  : array[TAccountsTotal] of single;
                         bcd_VolumeChange    : array[TAccountsTotal] of single;
                         bcd_VariantsDetails : array[TOneBrandVariants] of TVariantChannelDetails;
                       end;


TBrandOwnerChannelDetails = record
                              bocd_CompanyID         : TBrandOwners;
                              bocd_AbsoluteValue     : array[TAccountsTotal] of single;
                              bocd_ValueChange       : array[TAccountsTotal] of single;
                              bocd_AbsoluteVolume    : array[TAccountsTotal] of single;
                              bocd_VolumeChange      : array[TAccountsTotal] of single;
                            end;


TGR_PerformanceHighlights =
  record
    grph_SalesVolume                 : array[TActors, TCategoriesTotal] of single;   {  For Suppliers it refers to on-line sales only }
    grph_NetSalesValue               : array[TActors, TCategoriesTotal] of single;   {                    as above                    }
    grph_WholeSalesVolume            : array[TAllProducers, TCategoriesTotal] of single;    { This covers shipments to retailers only       }
    grph_WholeSalesNetValue          : array[TAllProducers, TCategoriesTotal] of single;    {                    as above                   }
    grph_VolumeMarketShare           : array[TActors, TCategoriesTotal] of single;
    grph_ValueMarketShare            : array[TActors, TCategoriesTotal] of single;
    grph_SalesVolumeChange           : array[TActors, TCategoriesTotal] of single;
    grph_NetSalesValueChange         : array[TActors, TCategoriesTotal] of single;
    grph_VolumeMarketShareChange     : array[TActors, TCategoriesTotal] of single;
    grph_ValueMarketShareChange      : array[TActors, TCategoriesTotal] of single;
    grph_WholeSalesVolumeChange      : array[TAllProducers, TCategoriesTotal] of single;
    grph_WholeSalesNetValueChange    : array[TAllProducers, TCategoriesTotal] of single;
    grph_OperatingProfit             : array[TActiveActors] of single;
    grph_OperatingProfitChange       : array[TActiveActors] of single;
    grph_CumulativeInvestment        : array[TActiveActors] of single;
    grph_ConsumersOffTakeVolume      : array[TAllStores, TMarketsTotal, TCategories] of single;
    grph_ConsumersOffTakeVolumeShare : array[TAllStores, TMarketsTotal, TCategories] of single;
    grph_ConsumersOffTakeValue       : array[TAllStores, TMarketsTotal, TCategoriesTotal] of single;
    grph_ConsumersOffTakeValueShare  : array[TAllStores, TMarketsTotal, TCategoriesTotal] of single;
  end;

TGR_SharesOfMarket =
  record
    grsom_MarketShareValue        : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grsom_MarketShareVolume       : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grsom_MarketShareValueChange  : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grsom_MarketShareVolumeChange : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
  end;

TGR_MarketSales =
  record
    grms_MarketNetSalesValue       : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grms_MarketSalesVolume         : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grms_MarketNetSalesValueChange : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grms_MarketSalesVolumeChange   : array[TActors, TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
  end;

TGR_SegmentLeadership =
  record
    grsl_ValueLeaders  : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TProducerDivisions] of TSegmentVariantLeaders;
    grsl_VolumeLeaders : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TProducerDivisions] of TSegmentVariantLeaders;
  end;

TGR_CrossSegmentSales =
  record
    grcss_CrossSegmentsNetSalesValue : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
    grcss_CrossSegmentsVolume        : array[TMarketsTotal, TCategoriesTotal, TSegmentsTotal, TShoppersKind] of single;
  end;

TGR_ProductPortfolio =
  record
    grpp_VariantsCharacteristics : array[TCategoriesTotal, TBrandOwners, TProBrands, TOneBrandVariants] of TVariantCharacteristics;
  end;

TGR_EMallPrices =
  record
    gremp_PricesAndPromotions : array[TCategoriesTotal, TAllProducers, TProBrands, TOneBrandVariants] of TVariantEMallPricesAndPromotions;
  end;

TGeneralReport =
  record
    gr_PerformanceHighlights : TGR_PerformanceHighlights;
    gr_SharesOfMarket        : TGR_SharesOfMarket;
    gr_MarketSales           : TGR_MarketSales;
    gr_SegmentLeadership     : TGR_SegmentLeadership;
    gr_CrossSegmentSales     : TGR_CrossSegmentSales;
    gr_ProductPortfolio      : TGR_ProductPortfolio;
    gr_EMallPrices           : TGR_EMallPrices;
  end;

{-----------------------------------------------------------------------------------------------------------------------------------------------}

TSCR_DivisionProfitAndLoss =
  record
    scrpl_Sales                                : single;
    scrpl_SalesChange                          : single;
    scrpl_MaterialCosts                        : single;
    scrpl_CostOfGoodsSold                      : single;
    scrpl_DiscontinuedGoodsCost                : single;
    scrpl_InventoryHoldingCost                 : single;
    scrpl_InternalTransfersCost                : single;   
    scrpl_eMallCommission                      : single;
    scrpl_ServiceCost                          : single;   
    scrpl_GrossProfit                          : single;
    scrpl_GrossProfitChange                    : single;
    scrpl_GrossProfitMargin                    : single;
    scrpl_TradeAndMarketing                    : single;
    scrpl_TradeAndMarketingAsPercentageOfSales : single;
    scrpl_GeneralExpenses                      : single;
    scrpl_Amortisation                         : single;
    scrpl_OperatingProfit                      : single;
    scrpl_OperatingProfitChange                : single;
    scrpl_OperatingProfitMargin                : single;
    scrpl_Interest                             : single;
    scrpl_Taxes                                : single;
    scrpl_ExceptionalItems                     : single;
    scrpl_NetProfit                            : single;
    scrpl_NetProfitChange                      : single;
    scrpl_NetProfitMargin                      : single;
    {---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- }
    scrpl_AdvertisingOnLine                    : single;
    scrpl_AdvertisingOffLine                   : single;
    scrpl_TradeSupport                         : single;
  end;

TSCR_CategoryProfitAndLoss = array[TProducerDivisions] of TSCR_DivisionProfitAndLoss;
TSCR_ConsolidatedProfitAndLoss = array[TCategoriesTotal] of TSCR_CategoryProfitAndLoss;



TSCR_OneVariant =
  record
    scrv_VariantID                            : TVariantID;
    scrv_VariantName                          : TVariantName;
    scrv_BrandID                              : TBrandID;
    scrv_ParentBrandName                      : TBrandName;
    scrv_DateOfBirth                          : TTimeSpan;
    scrv_DateOfDeath                          : TTimeSpan;
    scrv_ParentCompanyID                      : TActors;

    scrv_Sales                                : array[TProducerDivisions] of single;
    scrv_SalesChange                          : array[TProducerDivisions] of single;
    scrv_SalesShareInCategory                 : array[TProducerDivisions] of single;
    scrv_MaterialCosts                        : array[TProducerDivisions] of single;
    scrv_CostOfGoodsSold                      : array[TProducerDivisions] of single;
    scrv_DiscontinuedGoodsCost                : array[TProducerDivisions] of single;
    scrv_InventoryHoldingCost                 : array[TProducerDivisions] of single;
    scrv_InternalTransfersCost                : array[TProducerDivisions] of single;   
    scrv_eMallCommission                      : array[TProducerDivisions] of single;
    scrv_ServiceCost                          : array[TProducerDivisions] of single;   
    scrv_GrossProfit                          : array[TProducerDivisions] of single;
    scrv_GrossProfitChange                    : array[TProducerDivisions] of single;
    scrv_GrossProfitMargin                    : array[TProducerDivisions] of single;
    scrv_GrossProfitShareInCategory           : array[TProducerDivisions] of single;
    scrv_TradeSupport                         : array[TProducerDivisions] of single;
    scrv_EMallSupport                         : array[TProducerDivisions] of single;
    scrv_TradeAndMarketing                    : array[TProducerDivisions] of single;
    scrv_AdvertisingOnLine                    : array[TProducerDivisions] of single;
    scrv_AdvertisingOffLine                   : array[TProducerDivisions] of single;
    scrv_TradeAndMarketingAsPercentageOfSales : array[TProducerDivisions] of single;
    scrv_TradeAndMarketingShareInCategory     : array[TProducerDivisions] of single;
    scrv_GeneralExpenses                      : array[TProducerDivisions] of single;
    scrv_Amortisation                         : array[TProducerDivisions] of single;
    scrv_OperatingProfit                      : array[TProducerDivisions] of single;
    scrv_OperatingProfitChange                : array[TProducerDivisions] of single;
    scrv_OperatingProfitMargin                : array[TProducerDivisions] of single;
    scrv_OperatingProfitShareInCategory       : array[TProducerDivisions] of single;
    scrv_Interest                             : array[TProducerDivisions] of single;
    scrv_Taxes                                : array[TProducerDivisions] of single;
    scrv_ExceptionalItems                     : array[TProducerDivisions] of single;
    scrv_NetProfit                            : array[TProducerDivisions] of single;
    scrv_NetProfitChange                      : array[TProducerDivisions] of single;
    scrv_NetProfitMargin                      : array[TProducerDivisions] of single;
    scrv_NetProfitShareInCategory             : array[TProducerDivisions] of single;
    {--- additional for info windows -----------------------------------------------------------------------------------------------------------}
    scrv_UnitAverageCost                      : single;
    scrv_NextPriceBM                          : single;
    scrv_Composition                          : TVariantComposition;
    scrv_ClosingInventory                     : TVariantInventoriesDetails;
    scrv_SalesVolume                          : array[TAccountsTotal, TMarketsTotal] of single;
    {--- for online sales ----------------------------------------}
    scrv_PromotionsDetails                    : TPromotionsDetails;
    scrv_MarketPrice                          : single;
    scrv_NetMarketPrice                       : single;
  end;


TSCR_OneBrand =
  record 
    scrb_BrandID                              : TBrandID;
    scrb_BrandName                            : TBrandName;
    scrb_DateOfBirth                          : TTimeSpan;
    scrb_DateOfDeath                          : TTimeSpan;
    scrb_ParentCompanyID                      : TActors;
    scrb_Sales                                : array[TProducerDivisions] of single;
    scrb_SalesChange                          : array[TProducerDivisions] of single;
    scrb_SalesShareInCategory                 : array[TProducerDivisions] of single;
    scrb_MaterialCosts                        : array[TProducerDivisions] of single;
    scrb_CostOfGoodsSold                      : array[TProducerDivisions] of single;
    scrb_DiscontinuedGoodsCost                : array[TProducerDivisions] of single;
    scrb_InventoryHoldingCost                 : array[TProducerDivisions] of single;
    scrb_InternalTransfersCost                : array[TProducerDivisions] of single;   
    scrb_eMallCommission                      : array[TProducerDivisions] of single;   
    scrb_ServiceCost                          : array[TProducerDivisions] of single;   
    scrb_GrossProfit                          : array[TProducerDivisions] of single;
    scrb_GrossProfitChange                    : array[TProducerDivisions] of single;
    scrb_GrossProfitMargin                    : array[TProducerDivisions] of single;
    scrb_GrossProfitShareInCategory           : array[TProducerDivisions] of single;
    scrb_TradeSupport                         : array[TProducerDivisions] of single;
    scrb_EMallSupport                         : array[TProducerDivisions] of single;
    scrb_TradeAndMarketing                    : array[TProducerDivisions] of single;
    scrb_AdvertisingOnLine                    : array[TProducerDivisions] of single;
    scrb_AdvertisingOffLine                   : array[TProducerDivisions] of single;
    scrb_TradeAndMarketingAsPercentageOfSales : array[TProducerDivisions] of single;
    scrb_TradeAndMarketingShareInCategory     : array[TProducerDivisions] of single;
    scrb_GeneralExpenses                      : array[TProducerDivisions] of single;
    scrb_Amortisation                         : array[TProducerDivisions] of single;
    scrb_OperatingProfit                      : array[TProducerDivisions] of single;
    scrb_OperatingProfitChange                : array[TProducerDivisions] of single;
    scrb_OperatingProfitMargin                : array[TProducerDivisions] of single;
    scrb_OperatingProfitShareInCategory       : array[TProducerDivisions] of single;
    scrb_Interest                             : array[TProducerDivisions] of single;
    scrb_Taxes                                : array[TProducerDivisions] of single;
    scrb_ExceptionalItems                     : array[TProducerDivisions] of single;
    scrb_NetProfit                            : array[TProducerDivisions] of single;
    scrb_NetProfitChange                      : array[TProducerDivisions] of single;
    scrb_NetProfitMargin                      : array[TProducerDivisions] of single;
    scrb_NetProfitShareInCategory             : array[TProducerDivisions] of single;
    scrb_Variants                             : array[TOneBrandVariants] of TSCR_OneVariant;
    {--- additional for info windows -----------------------------------------------------------------------------------------------------------}
    scrb_Awareness                            : array[TMarkets] of single;
    scrb_Perception                           : array[TMarkets, TVariantThreePerceptions] of single;
  end;

TSCR_SupplierBrands = array[TCategories, TProBrands] of TSCR_OneBrand;



TSCR_CategoryChannelProfitability = { for R1, R2, TT use specific market details, for OnLine use [TMarketsTotal] value }
  record
    scrcp_VolumeOrdered     : single;
    scrcp_VolumeSold        : single;
    scrcp_VolumeSoldShare   : single;
    scrcp_SalesValue        : single;
    scrcp_SalesValueShare   : single;
    scrcp_CostOfGoodsSold   : single;
    scrcp_TradeSupport      : single;
    scrcp_TradeSupportShare : single;  
    scrcp_ShelfSpaceShare   : single;  
    scrcp_TradeProfit       : single;
    scrcp_TradeProfitShare  : single;
  end;

TSCR_ChannelsProfitability = array[TCategoriesTotal, TAccounts, TMarketsTotal] of TSCR_CategoryChannelProfitability;  


TSCR_Negotiations = array[TCategories, TBMRetailers, TProBrands, TOneBrandVariants] of TVariantNegotiationsDetails;

TSCR_CrossSegments = array[TCategories, TMarkets, TProBrands, TOneBrandVariants] of TVariantCrossSegmentDetails; 

TSCR_VariantInventoryVolume =
  record
    scrviv_VariantID          : TVariantID;
    scrviv_VariantName        : TVariantName;
    scrviv_ParentBrandID      : TBrandID;
    scrviv_ParentBrandName    : TBrandName;
    scrviv_Initial            : array[TProducerDivisions] of single;
    scrviv_Production         : single;
    scrviv_Available          : array[TProducerDivisions] of single;                
    scrviv_Sales              : array[TProducerDivisions] of single;
    scrviv_Orders             : array[TMarketsTotal, TAccountsTotal] of single;
    scrviv_Shipments          : array[TMarketsTotal, TAccountsTotal] of single;
    scrviv_Discontinued       : single;
    scrviv_Closing            : array[TProducerDivisions] of single;
    scrviv_UnitProductionCost : single;
    scrviv_ChannelPreference  : single;       { added on 10-April-2015 }
  end;

TSCR_InventoryVolumes = array[TCategories, TProBrands, TOneBrandVariants] of TSCR_VariantInventoryVolume;

TSCR_CategoryKeyPerformanceIndicators =
  record
    scrkpi_TradeSpendingEffectiveness : single;
    scrkpi_MarketingEffectiveness     : single;
    scrkpi_PortfolioStrength          : single;
    scrkpi_ChannelSalesValueShare     : array[TProducerDivisions] of single;
    scrkpi_ChannelSalesVolumeShare    : array[TProducerDivisions] of single;
    scrkpi_ShoppersShare              : array[TProducerDivisions] of single;
  end;
    
TSCR_KeyPerformanceIndicators = array[TCategoriesTotal] of TSCR_CategoryKeyPerformanceIndicators;

TSCR_AdditionalInfo =
  record
    scrInfo_InitialBudget                 : single; 
    scrInfo_BudgetExtensions              : single; 
    scrinfo_TotalPreviousMarketing        : single; 
    scrinfo_TotalPreviousTradeSupport     : single; 
    scrInfo_BudgetAvailable               : single;
    scrInfo_BudgetOverspent               : single;
    scrInfo_BudgetSpentToDate             : single;
    scrInfo_ProductionCapacity            : array[TCategories] of single;
    scrInfo_AcquiredTechnologyLevel       : array[TCategories] of TTechnology;
    scrInfo_AcquiredProductionFlexibility : array[TCategories] of single; 
    scrInfo_AcquiredDesignLevel           : array[TCategories] of TDesign;
    scrInfo_CumulatedDesignVolume         : array[TCategories] of TDesignsDetails;
    scrInfo_CumulatedTechnologyVolume     : array[TCategories] of TTechnologiesDetails;
  end;

TSupplierConfidentialReport =
  record
    scr_SupplierID                : TProducersPlus;
    scr_ConsolidatedProfitAndLoss : TSCR_ConsolidatedProfitAndLoss;
    scr_Brands                    : TSCR_SupplierBrands;
    scr_ProfitabilityByChannels   : TSCR_ChannelsProfitability;
    scr_Negotiations              : TSCR_Negotiations;
    scr_SharesByCrossSegment      : TSCR_CrossSegments;
    scr_InventoryVolumes          : TSCR_InventoryVolumes;
    scr_KeyPerformanceIndicators  : TSCR_KeyPerformanceIndicators;
    scr_Info                      : TSCR_AdditionalInfo;
  end;

TSuppliersConfidentialReports = array[TAllProducers] of TSupplierConfidentialReport;



{------------------------------------------------------------------------------------------------------------------------------------------------}

TRCR_QuarterProfitAndLoss = 
  record
    rcrpl_Sales                         : single;
    rcrpl_PromotionsCost                : single;
    rcrpl_OtherCompensation             : single;
    rcrpl_NetSales                      : single;
    rcrpl_NetSalesChange                : single;
    rcrpl_CostOfGoodsSold               : single;
    rcrpl_ValueOfQuantityDiscounts      : single;
    rcrpl_ValueOfPerformanceBonus       : single;
    rcrpl_DiscontinuedGoodsCost         : single;
    rcrpl_InventoryHoldingCost          : single;
    rcrpl_GrossProfit                   : single;
    rcrpl_GrossProfitChange             : single;
    rcrpl_GrossProfitMargin             : single;
    rcrpl_GeneralExpenses               : single;
    rcrpl_OperatingProfit               : single;
    rcrpl_OperatingProfitChange         : single;
    rcrpl_OperatingProfitMargin         : single;
    rcrpl_Interest                      : single;
    rcrpl_Taxes                         : single;
    rcrpl_ExceptionalItems              : single;
    rcrpl_NetProfit                     : single;
    rcrpl_NetProfitChange               : single;
    rcrpl_NetProfitMargin               : single;
    {--- additional for info windows -----------------------------------------------------------------------------------------------------------}
  end;

TRCR_ConsolidatedProfitAndLoss = array[TMarketsTotal, TCategoriesTotal] of TRCR_QuarterProfitAndLoss;


TRCR_OneVariant =
  record
    rcrv_VariantID                      : TVariantID;
    rcrv_VariantName                    : TVariantName;
    rcrv_BrandID                        : TBrandID;
    rcrv_ParentBrandName                : TBrandName;
    rcrv_DateOfBirth                    : TTimeSpan;
    rcrv_DateOfDeath                    : TTimeSpan;
    rcrv_ParentCompanyID                : TActors;
    rcrv_ShowInReport                   : boolean;  { if FALSE then not display in the report, only use additional elements info for the info window } 

    rcrv_Sales                          : single;
    rcrv_PromotionsCost                 : single;
    rcrv_OtherCompensation              : single;
    rcrv_NetSales                       : single;
    rcrv_NetSalesChange                 : single;
    rcrv_NetSalesShareInCategory        : single;
    rcrv_CostOfGoodsSold                : single;
    rcrv_ValueOfQuantityDiscounts       : single;
    rcrv_ValueOfPerformanceBonus        : single;
    rcrv_DiscontinuedGoodsCost          : single;
    rcrv_InventoryHoldingCost           : single;
    rcrv_GrossProfit                    : single;
    rcrv_GrossProfitChange              : single;
    rcrv_GrossProfitMargin              : single;
    rcrv_GrossProfitShareInCategory     : single;
    rcrv_GeneralExpenses                : single;
    rcrv_OperatingProfit                : single;
    rcrv_OperatingProfitChange          : single;
    rcrv_OperatingProfitMargin          : single;
    rcrb_OperatingProfitShareInCategory : single;
    rcrv_Interest                       : single;
    rcrv_Taxes                          : single;
    rcrv_ExceptionalItems               : single;
    rcrv_NetProfit                      : single;
    rcrv_NetProfitChange                : single;
    rcrv_NetProfitMargin                : single;
    rcrv_NetProfitShareInCategory       : single;
    {--- additional for info windows -----------------------------------------------------------------------------------------------------------}
    rcrv_Composition                    : TVariantComposition;
    rcrv_ClosingInventory               : single;
    rcrv_UnitAcquisitionCost            : single;
    rcrv_SalesVolume                    : single;
    rcrv_ShelfSpace                     : single;
    rcrv_MarketPrice                    : single;
    rcrv_NetMarketPrice                 : single;
    rcrv_PromotionsDetails              : TPromotionsDetails;
  end;


TRCR_OneBrand =
  record 
    rcrb_BrandID                        : TBrandID;
    rcrb_BrandName                      : TBrandName;
    rcrb_DateOfBirth                    : TTimeSpan;
    rcrb_DateOfDeath                    : TTimeSpan;
    rcrb_ParentCompanyID                : TActors;
    rcrb_ShowInReport                   : boolean;  { if FALSE then not display in the report, only use additional elements info for the info window } 
    rcrb_Sales                          : single;
    rcrb_PromotionsCost                 : single;
    rcrb_OtherCompensation              : single;
    rcrb_NetSales                       : single;
    rcrb_NetSalesChange                 : single;
    rcrb_NetSalesShareInCategory        : single;
    rcrb_CostOfGoodsSold                : single;
    rcrb_ValueOfQuantityDiscounts       : single;
    rcrb_ValueOfPerformanceBonus        : single;
    rcrb_DiscontinuedGoodsCost          : single;
    rcrb_InventoryHoldingCost           : single;
    rcrb_GrossProfit                    : single;
    rcrb_GrossProfitChange              : single;
    rcrb_GrossProfitMargin              : single;
    rcrb_GrossProfitShareInCategory     : single;
    rcrb_GeneralExpenses                : single;
    rcrb_OperatingProfit                : single;
    rcrb_OperatingProfitChange          : single;
    rcrb_OperatingProfitMargin          : single;
    rcrb_OperatingProfitShareInCategory : single;
    rcrb_Interest                       : single;
    rcrb_Taxes                          : single;
    rcrb_ExceptionalItems               : single;
    rcrb_NetProfit                      : single;
    rcrb_NetProfitChange                : single;
    rcrb_NetProfitMargin                : single;
    rcrb_NetProfitShareInCategory       : single;
    rcrb_Variants                       : array[TOneBrandVariants] of TRCR_OneVariant;
    {--- additional for info windows -----------------------------------------------------------------------------------------------------------}
    rcrb_Awareness                      : single;
    rcrb_Perception                     : array[TVariantThreePerceptions] of single;
    rcrb_VisibilityShare                : single;
  end;

TRCR_RetailerBrands = array[TMarketsTotal, TCategoriesTotal, TBrands] of TRCR_OneBrand;

TRCR_ProfitabilityByOneSupplier = 
  record
    rcrps_ToShow                         : boolean;  
    rcrps_ShelfSpace                     : single;
    rcrps_NetSales                       : single;
    rcrps_NetSalesPerShelfSpace          : single;
    rcrps_NetSalesShare                  : single;
    rcrps_GrossContribution              : single;
    rcrps_GrossContributionPerShelfSpace : single;
    rcrps_GrossContributionMargin        : single;
    rcrps_GrossContributionShare         : single;
    rcrps_PaymentTerms                   : TDelayOfPayment;
  end;

TRCR_ProfitabilityBySuppliers = array[TMarketsTotal, TCategories, TFactories] of TRCR_ProfitabilityByOneSupplier;
                                 {                                TFactories correspond to:                                                    }
                                 {       [1] = Supplier_1,                                                                                     }
                                 {       [2] = Supplier_2,                                                                                     }
                                 {       [3] = Supplier_3,                                                                                     }
                                 {       [4] = Supplier_4, only if he is ACTIVE player and in that case can sell his brands to B&M retailers,  }
                                 {                         otherwise (i.e. Supplier_4 is PASSIVE) this column(s) should not be displayed       }
                                 {                         because Supplier_4 brands are only sold on-line                                     }
                                 {       [5] = Supplier_4, this time as a producer of private labels                                           }


TRCR_Negotiations = array[TCategories, TAllProducers, TProBrands, TOneBrandVariants] of TVariantNegotiationsDetails;
                                 { Again, the rows for Supplier_4 brands should only be added if he was ACTIVE player }   

TRCR_CrossSegments = array[TMarkets, TCategories, TBrands, TOneBrandVariants] of TVariantCrossSegmentDetails;

TRCR_VariantInventoryVolume =
  record
    rcrviv_VariantID          : TVariantID;
    rcrviv_VariantName        : TVariantName;
    rcrviv_ParentBrandID      : TBrandID;
    rcrviv_ParentBrandName    : TBrandName;
    rcrviv_ParentCompany      : TActors;  { use ParentCompany to filter which variants should be displayed.             }
                                          { For Retailer 1 allowed set is [1, 2, 3, 5]                                  }
				      	                              { For Retailer 2 allowed set is [1, 2, 3, 6]                                  }
					                              { For Retailer 3 allowed set is [1, 2, 3] (no private labels at TT            }
					                              { Should Supplier 4 become ACTIVE, then [4] must be added to all allowed sets }
    rcrviv_Initial            : single;
    rcrviv_Purchase           : single;
    rcrviv_Sales              : single;
    rcrviv_Discontinued       : single;
    rcrviv_Closing            : single;
    rcrviv_NetRetailPrice     : single;
    rcrviv_NetAcquisitionCost : single;    { added on 14-April-2015 }
  end;

TRCR_InventoryVolumes = array[TMarkets, TCategories, TVariants] of TRCR_VariantInventoryVolume;

TRCR_QuarterKeyPerformanceIndicators =
  record
    rcrkpi_VolumeRotationIndex        : single;
    rcrkpi_ValueRotationIndex         : single;
    rcrkpi_ProfitabilityIndex         : single;
    rcrkpi_StockCover                 : single;
    rcrkpi_ShoppersShare              : array[TShoppersKind] of single;
  end;
    
TRCR_KeyPerformanceIndicators = array[TMarketsTotal, TCategoriesTotal] of TRCR_QuarterKeyPerformanceIndicators;

TRCR_AdditionalInfo =
  record
    rcrInfo_InitialBudget                  : single; 
    rcrInfo_BudgetExtensions               : single; 
    rcrInfo_BudgetIncreaseFromNegotiations : single; 
    rcrInfo_BudgetAvailable                : single;
    rcrInfo_BudgetOverspent                : single;
    rcrInfo_BudgetSpentToDate              : single;
    rcrInfo_ServiceLevel                   : array[TMarkets] of TServiceLevel;
    rcrInfo_LocalAdvertising               : array[TMarkets] of TStorePerceptionsData;
    rcrInfo_OnlineAdvertising              : TStorePerceptionsData;
    rcrInfo_TraditionalAdvertising         : TStorePerceptionsData;
  end;

TRetailerConfidentialReport =
  record
    rcr_RetailerID                : TBMRetailers;
    rcr_ConsolidatedProfitAndLoss : TRCR_ConsolidatedProfitAndLoss;
    rcr_Brands                    : TRCR_RetailerBrands;
    rcr_ProfitabilityBySuppliers  : TRCR_ProfitabilityBySuppliers;
    rcr_Negotiations              : TRCR_Negotiations;
    rcr_SharesByCrossSegment      : TRCR_CrossSegments;
    rcr_InventoryVolumes          : TRCR_InventoryVolumes;
    rcr_KeyPerformanceIndicators  : TRCR_KeyPerformanceIndicators;
    rcr_Info                      : TRCR_AdditionalInfo;
  end;

TRetailersConfidentialReports = array[TBMRetailers] of TRetailerConfidentialReport;



{-----------------------------------------------------------------------------------------------------------------------------------------------}

TMR_BrandAwareness = 
  record
    mrba_BrandID           : TBrandID;
    mrba_BrandName         : TBrandName;
    mrba_DateOfBirth       : TTimeSpan;
    mrba_DateOfDeath       : TTimeSpan;
    mrba_ParentCompanyID   : TActors;
    mrba_PreviousAwareness : single;
    mrba_LatestAwareness   : single;
  end;

TMR_AwarenessEvolution = array[TMarkets, TCategories, TBrands] of TMR_BrandAwareness;


TMR_VariantPerception = 
  record
    mrvp_VariantID             : TVariantID;
    mrvp_VariantName           : TVariantName;
    mrvp_ParentBrandID         : TBrandID;
    mrvp_ParentBrandName       : TBrandName;
    mrvp_DateOfBirth           : TTimeSpan;
    mrvp_DateOfDeath           : TTimeSpan;
    mrvp_ParentCompanyID       : TActors;
    mrvp_Shown                 : boolean;
    mrvp_PreviousPerception    : array[TVariantThreePerceptions] of single;
    mrvp_LatestPerception      : array[TVariantThreePerceptions] of single;
    mrvp_PerceptionChange      : array[TVariantThreePerceptions] of single;
    mrvp_SegmentAttractiveness : TSegmentsData;  { Added on 14-April-2015 }
  end;

TMR_VariantPerceptionEvolution = array[TMarkets, TCategories, TVariants] of TMR_VariantPerception;


TMR_StorePerception = 
  record
    mrsp_PreviousPerception : TStorePerceptionsData;
    mrsp_LatestPerception   : TStorePerceptionsData;
    mrsp_PerceptionChange   : TStorePerceptionsData;
  end;

TMR_RetailerPerceptionEvolution = array[TMarkets, TAllStores] of TMR_StorePerception; 

TMR_OneQuarterCrossSegmentsDetails = record
                                       mrcs_VariantsDetails    : array[TBrands, TOneBrandVariants] of TVariantCrossSegmentDetails;
                                       mrcs_BrandOwnersDetails : array[TBrandOwners] of TBrandOwnerCrossSegmentDetails;
                                     end;

TMR_CrossSegmentsDetails = array[TMarkets, TCategories] of TMR_OneQuarterCrossSegmentsDetails;

TMR_VariantNetPrices =
  record
    { overloaded with prices at TT & On-Line as TAccounts = Two Modern Retailers + Traditional Trade + On-Line }
    mrnmp_VariantID              : TVariantID;
    mrnmp_VariantName            : TVariantName;
    mrnmp_ParentBrandID          : TBrandID;
    mrnmp_ParentBrandName        : TBrandName;
    mrnmp_DateOfBirth            : TTimeSpan;
    mrnmp_DateOfDeath            : TTimeSpan;
    mrnmp_ParentCompanyID        : TActors;
    mrnmp_PreviousNetMarketPrice : array[TMarkets, TAccounts] of single;
    mrnmp_LatestNetMarketPrice   : array[TMarkets, TAccounts] of single;
    mrnmp_NetMarketPriceChange   : array[TMarkets, TAccounts] of single;
  end;

TMR_NetMarketPrices = array[TCategories, TVariants] of TMR_VariantNetPrices;

TMR_VariantPromotions =
  record
    { overloaded with promotions at TT & On-Line as TAccounts = Two Modern Retailers + Traditional Trade + On-Line }
    mrpp_VariantID       : TVariantID;
    mrpp_VariantName     : TVariantName;
    mrpp_ParentBrandID   : TBrandID;
    mrpp_ParentBrandName : TBrandName;
    mrpp_DateOfBirth     : TTimeSpan;
    mrpp_DateOfDeath     : TTimeSpan;
    mrpp_ParentCompanyID : TActors;
    mrpp_PricePromotions : array[TMarkets, TAccounts] of TPromotionsDetails;
  end;

TMR_PricePromotions = array[TCategories, TVariants] of TMR_VariantPromotions;

TMR_SupplierInvestments = 
  record
    mrsi_AdvertisingOffLine            : array[TMarketsTotal] of single;
    mrsi_AdvertisingOnLine             : single;
    mrsi_ActualTradeSupport            : array[TMarketsTotal, TAccountsTotal] of single;
    mrsi_NegotiatedTradeSupport        : array[TMarketsTotal, TAccountsTotal] of single;
    mrsi_ServiceLevel                  : TServiceLevel;   { actually only the value for CatsMaxTotal matters }
    mrsi_OnLine_Visibility             : single;
    mrsi_OnLine_Other                  : single;
    mrsi_AcquiredTechnologyLevel       : TTechnology;
    mrsi_AcquiredDesignLevel           : TDesign;
    mrsi_ProductionCapacityAvailable   : single;
    mrsi_CapacityUtilisationRate       : single;
    mrsi_ProductionplanningFlexibility : single;
  end;

TMR_SuppliersIntelligence = array[TCategoriesTotal, TProducersPlus] of TMR_SupplierInvestments;

TMR_VariantShelfSpace =
  record
    mrssv_VariantID          : TVariantID;
    mrssv_VariantName        : TVariantName;
    mrssv_ParentBrandID      : TBrandID;
    mrssv_ParentBrandName    : TBrandName;
    mrssv_DateOfBirth        : TTimeSpan;
    mrssv_DateOfDeath        : TTimeSpan;
    mrssv_ParentCompanyID    : TActors;
    mrssv_PreviousShelfSpace : array[TMarkets] of single;
    mrssv_LatestShelfSpace   : array[TMarkets] of single;
    mrssv_ShelfSpaceChange   : array[TMarkets] of single;
  end;

TMR_RetailerInvestments = 
  record
    mrri_OnLineAdvertising    : array[TMarketsTotal] of single;
    mrri_OffLineAdvertising   : array[TMarketsTotal] of single;
    mrri_LocalAdvertising     : array[TMarketsTotal] of single;
    mrri_SellingSpace         : array[TMarketsTotal] of single;  
    mrri_StoreServiceLevel    : array[TMarketsTotal] of TServiceLevel;
    mrri_ShelfSpaceAllocation : array[TCategories, TVariants] of TMR_VariantShelfSpace;
  end;

TMR_RetailersIntelligence = array[TBMRetailers] of TMR_RetailerInvestments;

TMR_OneMarketForecasts =
  record
    { Importance means Size in (%), saved in file as a decimal }
    mrf_Minimum_ConsumerSegmentsImportance : array[TCategories, TSegments] of single;
    mrf_Maximum_ConsumerSegmentsImportance : array[TCategories, TSegments] of single;
    mrf_Minimum_ShopperSegmentsImportance  : array[TCategories, TShoppersKind] of single;
    mrf_Maximum_ShopperSegmentsImportance  : array[TCategories, TShoppersKind] of single;
    mrf_Minimum_TotalVolume                : array[TCategories] of single;
    mrf_Maximum_TotalVolume                : array[TCategories] of single;
    mrf_Minimum_InternetPenetrationRate    : single;
    mrf_Maximum_InternetPenetrationRate    : single;
  end;

TMR_Forecasts = array[TForecastCoverage, TMarkets] of TMR_OneMarketForecasts;

TMR_OneQuarterSalesByChannel = record
                                 mrsbc_BrandDetails       : array[TBrands] of TBrandChannelDetails;
                                 mrsbc_BrandOwnersDetails : array[TBrandOwners] of TBrandOwnerChannelDetails;
                                end;

TMR_SalesByChannel = array[TMarketsTotal, TCategories] of TMR_OneQuarterSalesByChannel;

TMR_WebTrawlerBrandScore = 
  record
    mrwtb_BrandID           : TBrandID;
    mrwtb_BrandName         : TBrandName;
    mrwtb_DateOfBirth       : TTimeSpan;
    mrwtb_DateOfDeath       : TTimeSpan;
    mrwtb_ParentCompanyID   : TActors;
    mrwtb_WebTrawlerIndices : TWebTrawlerIndices;
  end;
  
TMR_WebTrawlerBrandsScores = array[TCategories, TBrands] of TMR_WebTrawlerBrandScore;

TMR_WebTrawlersPlayersScores = array[TActors] of TWebTrawlerIndices;  { R1, R2, TT, S1, S2, S3, S4 }

TMR_WebTrawlerScores = 
  record
    mrwt_Brands  : TMR_WebTrawlerBrandsScores; 
    mrwt_Players : TMR_WebTrawlersPlayersScores;
  end;  

TMarketResearch =
  record
    mr_AwarenessEvolution      : TMR_AwarenessEvolution;
    mr_VariantPerception       : TMR_VariantPerceptionEvolution;
    mr_RetailerPerception      : TMR_RetailerPerceptionEvolution;

    mr_SharesByCrossSegment    : TMR_CrossSegmentsDetails;
    mr_SalesByCrossSegment     : TMR_CrossSegmentsDetails;

    mr_SalesByChannel          : TMR_SalesByChannel;

    mr_NetMarketPrices         : TMR_NetMarketPrices;
    mr_PricePromotions         : TMR_PricePromotions;

    mr_SuppliersIntelligence   : TMR_SuppliersIntelligence;
    mr_RetailersIntelligence   : TMR_RetailersIntelligence;
    
    mr_SocialNetworksTrawler   : TMR_WebTrawlerScores;

    mr_Forecasts               : TMR_Forecasts;
  end;

{-----------------------------------------------------------------------------------------------------------------------------------------------}

TF_CategoryNegotiationsItem =
  record
    fcni_SuppliersCost       : array[TProducers] of single;
    fcni_RetailersBenefits   : array[TBMRetailers] of single;
    fcni_TotalValue          : single;
  end;

TF_NegotiationsItems = array[TCategoriesTotal] of TF_CategoryNegotiationsItem;

TF_TransactionsPerTOP = array[TCategoriesTotal, TTOPIntervalIndex] of single;

TF_MarketsResults = array[TCategoriesTotal, TTimeSpan, TActors]  of single;

TF_SuppliersKPIs = array[TCategoriesTotal, TTimeSpan, TProducers] of single;

TF_SuppliersKPIsExtended = array[TCategoriesTotal, TTimeSpan, TBrandOwners] of single;

TF_RetailersKPIs = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TBMRetailers] of single;

TF_ShoppersShare = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TShoppersKind, TAllStores] of single;

TF_MarketSummary = array[TMarketsTotal, TCategoriesTotal, TTimeSpan] of single;

TF_Scores = record
              ffs_SuppliersAbsoluteValues    : array[TProducers, TEvaluationScores] of single;
              ffs_SuppliersStandarisedValues : array[TProducers, TEvaluationScores] of single;        { not used in the current template }
              ffs_SuppliersFinalScore        : array[TProducers] of single;
              ffs_RetailersAbsoluteValues    : array[TModernRetailers, TEvaluationScores] of single;
              ffs_RetailersStandarisedValues : array[TModernRetailers, TEvaluationScores] of single;  { not used in the current template }
              ffs_RetailersFinalScore        : array[TModernRetailers] of single;
            end;

TFeedback =
  record
    f_DiscountsValue                  : TF_NegotiationsItems;
    f_PerformanceBonusesValue         : TF_NegotiationsItems;
    f_OtherCompensationsValue         : TF_NegotiationsItems;
    f_TransactionsPerTOP              : TF_TransactionsPerTOP;
    f_MarketSalesVolume               : TF_MarketsResults;
    f_MarketSalesValue                : TF_MarketsResults;
    f_VolumeMarketShares              : TF_MarketsResults;
    f_ValueMarketShares               : TF_MarketsResults;
    f_GrossProfit                     : TF_MarketsResults;
    f_GrossProfitMargin               : TF_MarketsResults;
    f_OperatingProfit                 : TF_MarketsResults;
    f_OperatingProfitMargin           : TF_MarketsResults;
    f_NetProfit                       : TF_MarketsResults;
    f_NetProfitMargin                 : TF_MarketsResults;
    f_ShelfSpaceAllocation            : TF_MarketsResults;

    f_PortfolioStrength               : TF_SuppliersKPIsExtended;

    f_TradeSpendingEffectiveness      : TF_SuppliersKPIs;
    f_MarketingSpendingEffectiveness  : TF_SuppliersKPIs;
    f_SuppliersBMValueSalesShare      : TF_SuppliersKPIs;
    f_SuppliersBMVolumeSalesShare     : TF_SuppliersKPIs;
    f_SuppliersBMShareOfShoppers      : TF_SuppliersKPIs;
    f_SuppliersOnlineValueSalesShare  : TF_SuppliersKPIs;
    f_SuppliersOnlineVolumeSalesShare : TF_SuppliersKPIs;
    f_SuppliersOnlineShareOfShoppers  : TF_SuppliersKPIs;

    f_RetailersValueRotationIndex     : TF_RetailersKPIs;
    f_RetailersVolumeRotationIndex    : TF_RetailersKPIs;
    f_RetailersProfitabilityIndex     : TF_RetailersKPIs;
    f_RetailersStocksCover            : TF_RetailersKPIs;

    f_ShoppersShare                   : TF_ShoppersShare;

    f_TotalMarketVolume               : TF_MarketSummary;
    f_TotalMarketValue                : TF_MarketSummary;
    f_AverageTotalMarketNetPrice      : TF_MarketSummary;

    f_FinalScores                     : TF_Scores;  
  end;

{-----------------------------------------------------------------------------------------------------------------------------------------------}

TXF_StoreServiceLevelEvolution = array[TMarkets, TTimeSpan, TAllStores] of TServiceLevel;

TXF_OneShoppersSegmentDetails = 
  record
    xfss_Importance  : array[TShoppersKind] of single;
    xfss_TotalMarket : single;
  end;  
  
TXF_ShoppersSegmentsDetails = array[TMarketsTotal, TCategories, TTimeSpan] of TXF_OneShoppersSegmentDetails; 

TXF_ShoppersSegmentStoreDetails =
  record 
    xfsss_Absolute   : single;
    xfsss_Importance : single;
  end;  

TXF_ChannelShoppersSegmentsRetailSalesValue = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TShoppersKind, TAllStoresTotal] of TXF_ShoppersSegmentStoreDetails;
      { It is a bit overloaded with data. For absolute values in the top line you only need: [market, category, period, ALLSHOPPERS, ALlStoresMaxTotal].xfsss_Absolute element } 
      { For left side bar charts use: [market, category, period, BMS/NETIZENS/MIXED, ALlStoresMaxTotal].xfsss_Importance }
      { For right side bar use: [market, category, period, ALLSHOPPERS, store].xfsss_Importance }

TXF_ProductPortfolio = 
  record                                                             
    xfpp_AttributesSKUCount : array[TSpecs, TSpecsIndices, TBrandOwners, Boolean] of byte; { FALSE for existing SKUs }
    xfpp_PackFormatSKUCount : array[TVariantPackFormat, TBrandOwners, Boolean] of byte;    { TRUE for new SKUs      }
  end;

TXF_ProductPortfolios = array[TCategories] of TXF_ProductPortfolio;

TXF_VariantAvailability = 
  record
    xfva_VariantID            : TVariantID;     
    xfva_VariantName          : TVariantName;   
    xfva_ParentBrandID        : TBrandID;       
    xfva_ParentBrandName      : TBrandName;     
    xfva_DateOfBirth          : TTimeSpan;      
    xfva_DateOfDeath          : TTimeSpan;      
    xfva_ParentCompanyID      : TActors;        
    xfva_ShelfSpace           : single;  { or Visibility } 
    xfva_InventoryVolume      : single;
  end;

TXF_AvailabilityAtBMStores = array[TMarkets, TCategories, TBMRetailers, TVariants] of TXF_VariantAvailability;

TXF_RetailerProfitsPerSupplier =
  record
    xfrpps_ShelfSpace                     : single;  
    xfrpps_SalesValue                     : single;  
    xfrpps_Rotation                       : single;  { Sales per 1% of shelf space } 
    xfrpps_SalesValueShare                : single;  
    xfrpps_GrossContribution              : single;  
    xfrpps_GrossContributionPerShelfSpace : single;   
    xfrpps_GrossContributionShare         : single;
  end;

{ highest index for Private Labels }
TXF_ProfitabilityPerSupplier = array[TMarketsTotal, TCategories, TBMRetailers, TAllProducers] of TXF_RetailerProfitsPerSupplier;

TXF_MarketRetailerDetails = array[TMarketsTotal, TTimeSpan, TBMRetailers] of single;

TXF_MarketStoreDetails = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TAllStores] of single;

{ last third dimension (TBMRetailersTotal), highest index is for On-line combined across all Producers }
TXF_MarketRetailerBrandOwnerDetails = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TBMRetailersTotal, TBrandOwners] of single;

TXF_OneSupplierCapitalInvestments =
  record
    xfci_InvestedInTechnology    : single;
    xfci_InvestedInDesign        : single;
    xfci_InvestedInFlexibility   : single;
    xfci_InvestedInCapacity      : single;
    xfci_AcquiredTechnologyLevel : single;
    xfci_AcquiredDesignLevel     : single;
    xfci_AcquiredFlexibility     : single;
    xfci_AvailableCapacity       : single;
  end; 
  
TXF_SuppliersCapitalInvestments = array[TCategoriesTotal, TTimeSpan, TAllProducers] of TXF_OneSupplierCapitalInvestments;

TXF_ConsumersSegmentsDetails = array[TMarketsTotal, TCategories, TTimeSpan, TSegmentsTotal] of single;

TXF_AvailabilityOnline = array[TCategories, TAllProducers, TProVariants] of TXF_VariantAvailability; 

TXF_ConsumerSegmentBrandOwnerDetails =
  record 
    xfcsbo_Absolute   : single;
    xfcsbo_Importance : single;
  end;  

TXF_BrandOwnerConsumerSegmentsRetailSalesValue = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TSegmentsTotal, TBrandOwnersTotal] of TXF_ConsumerSegmentBrandOwnerDetails;

TXF_BrandOwnersChannelDetails = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TBrandOwners, TAccounts] of single;

TXF_AggregatedChannelsDetails = array[TMarketsTotal, TCategoriesTotal, TTimeSpan, TAggregatedChannels] of single;

TXF_SupplierProfitsPerCustomer =
  record
    xfsppr_SalesValue             : single;
    xfsppr_GrossProfit            : single;  
    xfsppr_TradeSupport           : single;
    xfsppr_TradeProfit            : single;
    xfsppr_VisibilityShare        : single;
    xfsppr_TradeSupportShare      : single;    
    xfsppr_SalesValueShare        : single;
    xfsppr_GrossProfitShare       : single;
    xfsppr_TradeProfitShare       : single;
  end;
  
TXF_ProfitabilityPerCustomer = array[TMarketsTotal, TCategoriesTotal, TAllProducers, TAccounts] of TXF_SupplierProfitsPerCustomer;

TExtendedFeedback =                   
  record
    xf_StoresPerception                           : TMR_RetailerPerceptionEvolution;
    xf_StoresServiceLevel                         : TXF_StoreServiceLevelEvolution;
    xf_RetailPrices                               : TMR_NetMarketPrices;
    xf_ShoppersSegmentsShares                     : TXF_ShoppersSegmentsDetails;
    xf_ShareOfShoppers                            : TF_ShoppersShare;
    xf_ChannelShoppersSegmentsRetailSalesValue    : TXF_ChannelShoppersSegmentsRetailSalesValue; 
    xf_ProductPortfolios                          : TXF_ProductPortfolios;
    xf_AvailabilityAtBMStores                     : TXF_AvailabilityAtBMStores;   
    xf_AvailabilityOnline                         : TXF_AvailabilityOnline;  
    xf_DiscountsValue                             : TF_NegotiationsItems;
    xf_PerformanceBonusesValue                    : TF_NegotiationsItems;
    xf_OtherCompensationsValue                    : TF_NegotiationsItems;
    xf_TransactionsPerTOP                         : TF_TransactionsPerTOP;
    xf_RetailersProfitabilityPerSupplier          : TXF_ProfitabilityPerSupplier;  
    xf_PromotionalActivities                      : TMR_PricePromotions;
    xf_RetailersLocalAdvertising                  : TXF_MarketRetailerDetails;
    xf_RetailerGrossProfitPerBrandOwner           : TXF_MarketRetailerBrandOwnerDetails;
{ 
    deleted on 22-May-2015 
    xf_RetailerOperatingProfitPerBrandOwner       : TXF_MarketRetailerBrandOwnerDetails;
    xf_RetailerNetProfitPerBrandOwner             : TXF_MarketRetailerBrandOwnerDetails;
}
    xf_StoreGrossProfitMargin                     : TXF_MarketStoreDetails;
    xf_StoreOperatingProfitMargin                 : TXF_MarketStoreDetails;
    xf_StoreNetProfitMargin                       : TXF_MarketStoreDetails;
    xf_RetailersValueRotationIndex                : TF_RetailersKPIs;
    xf_RetailersVolumeRotationIndex               : TF_RetailersKPIs;
    xf_RetailersProfitabilityIndex                : TF_RetailersKPIs;
    xf_RetailersStocksCover                       : TF_RetailersKPIs;
    xf_VariantPerception                          : TMR_VariantPerceptionEvolution;
    xf_CapitalInvestments                         : TXF_SuppliersCapitalInvestments;
    xf_ConsumerSegmentsShares                     : TXF_ConsumersSegmentsDetails;
    xf_AwarenessEvolution                         : TMR_AwarenessEvolution;
    xf_SuppliersProfitabilityPerCustomer          : TXF_ProfitabilityPerCustomer;
    xf_BrandOwnerConsumerSegmentsRetailSalesValue : TXF_BrandOwnerConsumerSegmentsRetailSalesValue;
    xf_BrandOwnersChannelSalesValue               : TXF_BrandOwnersChannelDetails;
    xf_BrandOwnersChannelGrossProfit              : TXF_BrandOwnersChannelDetails;
    xf_BrandOwnersChannelTradeProfit              : TXF_BrandOwnersChannelDetails;
    xf_PortfolioStrength                          : TF_SuppliersKPIsExtended;
    xf_SuppliersBMValueSalesShare                 : TF_SuppliersKPIs;
    xf_SuppliersBMVolumeSalesShare                : TF_SuppliersKPIs;
    xf_SuppliersBMShareOfShoppers                 : TF_SuppliersKPIs;
    xf_SuppliersOnlineValueSalesShare             : TF_SuppliersKPIs;
    xf_SuppliersOnlineVolumeSalesShare            : TF_SuppliersKPIs;
    xf_SuppliersOnlineShareOfShoppers             : TF_SuppliersKPIs;
    xf_AggregatedChannelsSalesVolume              : TXF_AggregatedChannelsDetails;
    xf_AggregatedChannelsSalesValue               : TXF_AggregatedChannelsDetails; 
    xf_AggregatedChannelsNetProfit                : TXF_AggregatedChannelsDetails;
    xf_FinalScores                                : TF_Scores;
  end;

{-----------------------------------------------------------------------------------------------------------------------------------------------}

TAllResults =
  record
    r_PeriodNumber                 : TTimeSpan;
    r_GeneralReport                : TGeneralReport;
    r_SuppliersConfidentialReports : TSuppliersConfidentialReports;
    r_RetailersConfidentialReports : TRetailersConfidentialReports;
    r_MarketResearch               : TMarketResearch;
    r_Feedback                     : TFeedback;
    r_ExtendedFeedback             : TExtendedFeedback;
  end;

TAllResultsFile = file of TAllResults;
