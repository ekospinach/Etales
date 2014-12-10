{=========================   Producer Decisions   ===========================================================================}

  TProVariantDecision = record
                          dpv_VarName             : TVariantName;
                          dpv_VarID               : TVariantID;
                          dpv_ParentBrandID       : TBrandID;
                          dpv_PackFormat          : TVariantPackFormat;
                          dpv_DateofBirth         : TTimeSpan;
                          dpv_DateOfDeath         : TTimeSpan;
                          dpv_Composition         : TVariantComposition;
                          dpv_Discontinue         : boolean;
                          dpv_Production          : single;
                          dpv_PricePromotions     : TPromotionsDetails;
                          dpv_CurrentPriceBM      : single;
                          dpv_OnLinePrice         : single;
                          dpv_NextPriceBM         : single;
                          dpv_OnlinePlannedVolume : single;
                          dpv_ChannelPreference   : single;
                        end;

  TProVariantsDecisions = array[TOneBrandVariants] of TProVariantDecision;

  TProBrandDecision = record
                        dpb_BrandName               : TBrandName;
                        dpb_BrandID                 : TBrandID;
                        dpb_ParentCompanyID         : TBrandOwners;
                        dpb_DateofBirth             : TTimeSpan;
                        dpb_DateOfDeath             : TTimeSpan;
                        dpb_AdvertisingOffLine      : TMarketsDetails;
                        dpb_AdvertisingOnLine       : single;
                        dpb_SupportEmall            : single;
                        dpb_SupportTraditionalTrade : TMarketsDetails;
                        dpb_Variants                : TProVariantsDecisions;
                      end;

  TProBrandsDecisions = array[TProBrands] of TProBrandDecision;

  TProCatDecision = record
                      dpc_CategoryID                    : TCategories;
                      dpc_Brands                        : TProBrandsDecisions;
                      dpc_CapacityChange                : single;
                      dpc_InvestInDesign                : single;
                      dpc_InvestInProductionFlexibility : single;
                      dpc_InvestInTechnology            : single;
                    end;

  TProCatsDecisions = array[TCategories] of TProCatDecision;

  TProDecision = record
                   dp_ProducerID              : TProducers;
                   dp_CatDecisions            : TProCatsDecisions;
                   dp_ServiceLevel            : TServiceLevel;    { modified on Dec-4, 2014 }
                   dp_NextBudgetExtension     : single;
                   dp_ApprovedBudgetExtension : single;
                   dp_MarketResearch          : TMarketResearchOrders;  
                 end;

  TProsDecisions = array[TAllProducers] of TProDecision;

  TProDecisionsFile = file of TProDecision;

  TProPastDecisions = array[1..ProsMaxPlus, HistoryStart..HistoryEnd] of TProDecision;


  TInitialProVariants   = array[TAllProducers, TProBrands, TOneBrandVariants] of TProVariantDecision;
  TInitialProBrands     = array[TAllProducers, TProBrands] of TProBrandDecision;
  TInitialProCategories = array[TAllProducers] of TProCatDecision;

{=========================    Retailer Decisions    =========================================================================}

  TPrivateLabelVariantDecision = record
                                   drplv_VariantName        : TVariantName;
                                   drplv_VarID              : TVariantID;
                                   drplv_ParentBrandID      : TBrandID;
                                   drplv_DateofBirth        : TTimeSpan;
                                   drplv_DateOfDeath        : TTimeSpan;
                                   drplv_PackFormat         : TVariantPackFormat;
                                   drplv_Composition        : TVariantComposition;
                                   drplv_Discontinue        : boolean;
                                 end;

  TPrivateLabelsVariantsDecisions = array[TOneBrandVariants] of TPrivateLabelVariantDecision;

  TPrivateLabelDecision = record
                            drpl_BrandName         : TBrandName;
                            drpl_BrandID           : TBrandID;
                            drpl_ParentCompanyID   : TBrandOwners;
                            drpl_DateofBirth       : TTimeSpan;
                            drpl_DateOfDeath       : TTimeSpan;
                            drpl_Variants          : TPrivateLabelsVariantsDecisions;
                          end;

  TPrivateLabelsDecisions = array[TPrivateLabels] of TPrivateLabelDecision;

  TRetCategoryDecision = record
                           drc_CategoryID    : TCategories;
                           drc_PrivateLabels : TPrivateLabelsDecisions;
                         end;

  TRetCategoriesDecisions = array[TCategories] of TRetCategoryDecision;

  TRetVariantDecision = record
                          drv_BrandID          : TBrandID;   
                          drv_VariantID        : TVariantID;
                          drv_BrandName        : TBrandName;
                          drv_VariantName      : TVariantName;
                          drv_DateofBirth      : TTimeSpan;
                          drv_DateOfDeath      : TTimeSpan;
                          drv_Order            : single;
                          drv_PricePromotions  : TPromotionsDetails;
                          drv_RetailPrice      : single;
                          drv_ShelfSpace       : single;
                        end;

  TRetVariantsDecisions = array[TRetVariants] of TRetVariantDecision;

  TRetQuarterAssortmentDecision = record                             { Quarter stands for One Category - One Market decisions }
                                    drq_CategoryID : TCategories;
                                    drq_Variants   : TRetVariantsDecisions;
                                  end;

  TRetMarketAssortmentDecision = array[TCategories] of TRetQuarterAssortmentDecision;

  TRetMarketDecision = record
                         drm_MarketID             : TMarkets;
                         drm_Assortment           : TRetMarketAssortmentDecision;
                         drm_CategorySurfaceShare : TCategoriesShares;
                         drm_EmptySpaceOptimised  : boolean;
                         drm_LocalAdvertising     : TStorePerceptionsData;
                         drm_ServiceLevel         : TServiceLevel;
                       end;

  TRetMarketsDecisions = array[TMarkets] of TRetMarketDecision;

  TRetDecision = record
                   dr_RetailerID               : TBMRetailers;
                   dr_Categories               : TRetCategoriesDecisions;
                   dr_Markets                  : TRetMarketsDecisions;
                   dr_OnlineAdvertising        : TStorePerceptionsData;
                   dr_TraditionalAdvertising   : TStorePerceptionsData;
                   dr_NextBudgetExtension      : single; 
                   dr_ApprovedBudgetExtension  : single;                           { ### }
                   dr_MarketResearch           : TMarketResearchOrders;  
                 end;

  TRetsDecisions = array[TBMRetailers] of TRetDecision;

  TRetDecisionsFile = file of TRetDecision;

  TRetPastDecisions = array[HistoryStart..HistoryEnd] of TRetDecision;

  TInitialPrivateLabels = array[TModernRetailers, TPrivateLabels] of TPrivateLabelDecision;
  
  TRetGeneralInitial = record
                         drg_OnlineAdvertising      : TStorePerceptionsData;
                         drg_TraditionalAdvertising : TStorePerceptionsData;
                       end;
  
  TRetsGeneralInitial = array[TModernRetailers] of TRetGeneralInitial;  
  
  TRetMarketsInitial = record
                         drl_CategorySurfaceShare : TCategoriesShares;
                         drl_EmptySpaceOptimised  : boolean;
                         drl_LocalAdvertising     : TStorePerceptionsData;
                         drl_ServiceLevel         : TServiceLevel;
                       end;
                       
  TRetsMarketsInitial  = array[TModernRetailers, TMarkets] of TRetMarketsInitial;    

  TRetsAssortmentInitial = array[TModernRetailers] of TRetQuarterAssortmentDecision;  

  TRetsAssortmentsInitial = array[TModernRetailers, TMarkets, TCategories] of TRetQuarterAssortmentDecision;  
  
{===============   Negotiations   ============================================================================================}

  

  TVariantDetails = record
                          niv_VarID             : TVariantID;
                          niv_DateofBirth       : TTimeSpan;
                          niv_DateOfDeath       : TTimeSpan;
                          niv_MarketsDetails    : TMarketsTotalDetails;
                          niv_UseMarketsDetails : boolean;
                        end;

  TVariantsDetails = array[TOneBrandVariants] of TVariantDetails;

  TBrandDetails = record
                        nib_BrandID             : TBrandID;
                        nib_DateofBirth         : TTimeSpan;
                        nib_DateOfDeath         : TTimeSpan;
                        nib_MarketsDetails      : TMarketsTotalDetails;
                        nib_UseMarketsDetails   : boolean;
                        nib_UseVariantsDetails  : boolean;
                        nib_VariantsDetails     : TVariantsDetails;
                      end;

  TBrandsDetails = array[TProBrands] of TBrandDetails;

  TCategoryDetails = record
                           nic_BrandsDetails     : TBrandsDetails;
                           nic_MarketsDetails    : TMarketsTotalDetails;
                           nic_UseBrandsDetails  : boolean;
                           nic_UseMarketsDetails : boolean;
                         end;

  TCategoryDeal = record
                    nc_CategoryID             : TCategories;
                    nc_ConsignementVolume     : TCategoryDetails;
                    nc_InStoreActivitiesFee   : TCategoryDetails;
                    nc_MinimumOrder           : TCategoryDetails;
                    nc_OtherCompensation      : TCategoryDetails;
                    nc_PaymentDays            : TCategoryDetails;
                    nc_PerformanceBonusAmount : TCategoryDetails;
                    nc_PerformanceBonusRate   : TCategoryDetails;
                    nc_PromotionalSupport     : TCategoryDetails;
                    nc_SalesTargetVolume      : TCategoryDetails;
                    nc_VolumeDiscountRate     : TCategoryDetails;
                  end;

  TCategoriesDeals = array[TCategories] of TCategoryDeal;

  TOnePairDeal = record
                   neg_RetailerID          : TBMRetailers;
                   neg_ProducerID          : TAllProducers;
                   neg_CategoriesDeals     : TCategoriesDeals;
                 end;

  TAllDeals = array[TAllProducers, TBMRetailers] of TOnePairDeal;

  TNegotiationsFile = file of TAllDeals;

