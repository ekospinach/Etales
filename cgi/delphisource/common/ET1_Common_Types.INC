{===============     E-Tales Simulation Global Types     =====================================================================}

Type
  TActors                  = 1..ActorsMax;
  TActorsTotal             = 1..ActorsMaxTotal;
  TAllProducers            = 1..ProsMaxPlus;
  TAllProducersTotal       = 1..ProsMaxPlusTotal;
  TAllStores               = 1..AllStoresMax;
  TAllStoresTotal          = 1..AllStoresMaxTotal;
  TBMRetailers             = 1..BMRetsMax;
  TBMRetailersTotal        = 1..BMRetsMaxTotal;
  TBrandID                 = 0..LastBrand_ID;    { we keep 0 for non-active brands }
  TBrandName               = array[0..BrandNameLength] of WideChar;
  TBrandOwners             = Prod_1_ID..Ret_2_ID;
  TFactories               = 1..FactoriesMax; { four suppliers of brands + PL Supplier }
  TFactoriesTotal          = 1..FactoriesMaxTotal;
  TForecastCoverage        = NearHistory..NearFuture;
  TBrands                  = 1..AllBrandsMax;
  TBrandsFromPros          = 1..AllProBrandsMax;
  TCategories              = 1..CatsMax;
  TCategoriesSet           = set of TCategories;            { defines # of current categories }
  TCategoriesTotal         = 1..CatsMaxTotal;
  TCategoriesUniverse      = 1..CategoriesUniverse;
  TAccounts                = 1..AccountsMax;
  TAccountsTotal           = 1..AccountsMaxTotal;
  TCompanies               = Prod_1_ID..TraditionalTrade_ID;
  TDelayOfPayment          = 0..DaysInPeriod;
  TDesign                  = 1..MaxDesignLevel;
  THistory                 = HistoryStart..HistoryEnd;
  THouseholds              = 1..HouseholdsGroupsMax;
  THouseholdsTotal         = 1..HouseholdsGroupsMaxTotal;
  TIngredientsInput        = 1..MaxIngredientsInput;
  TInventoryAgesTotal      = 0..InventoryAgesMaxTotal;
  TLeaders                 = 1..LeadersMax;
  TMarkets                 = 1..MrktsMax;
  TMarketsSet              = set of TMarkets;               { defines # of current markets }
  TMarketsTotal            = 1..MrktsMaxTotal;
  TMarketsUniverse         = 1..MarketsUniverse;
  TModernRetailers         = 1..ModernRetsMax;
  TModernRetailersTotal    = 1..ModernRetsMaxTotal;
  TOneBrandVariants        = 1..VarsMax;
  TOperatingMode           = ( LOCAL, ONLINE );
  TPeriodNumber            = HistoryStart..FutureEnd;
  TPrivateLabels           = 1..PLsMax;
  TProBrands               = 1..ProBrandsMax;
  TProducers               = 1..ProsMax;
  TProducersPlus           = 1..ProsMaxPlus;
  TActiveActors            = 1..ActiveActorsMax;
  TProducerDivisions       = ( TRADITIONAL, INTERNET, CORPORATE );
  TRetVariants             = 1..RetVariantsMax;
  TSegments                = 1..SegmentsMax;
  TSegmentsTotal           = 1..SegmentsMaxTotal;
  TSeminarCode             = array[0..SeminarCodeLength] of widechar;
  TServiceLevel            = ( SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM );
  TShoppersKind            = ( BMS, NETIZENS, MIXED, ALLSHOPPERS );
  TSimulationSpan          = 1..FutureEnd;
  TSpecs                   = 1..SpecsMax;
  TSpecsExtended           = 1..SpecsMax + 3;  { Composition + Perceived Price + alpha + beta }
  TSpecsIndices            = 1..MaxSpecsIndex;
  TStoreDimensions         = 1..StoresDimsMax;
  TStorePerceptions        = ( PRICE, CONVENIENCE );
  TTechnology              = 1..MaxTechnologyLevel;  
  TTimeSpan                = TimeStart..TimeEnd;
  TTOPIntervalIndex        = 0..IntervalsMax;  { this is used as multiplications of 15 days to cover - almost - the entire half a year }
  TVariantBasePerceptions  = 1..VariantDimsMax - 1;
  TVariantThreePerceptions = 1..VariantDimsMax;
  TVariants                = 1..AllVariantsMax;
  TVariantID               = 0..LastVar_ID;      { we keep 0 for non-active variants }
  TVariantName             = array[0..VarNameLength] of WideChar;
  TVariantPackFormat       = ( ECONOMY, STANDARD, PREMIUM );
  TVariantPerceptions      = 1..VariantDimsMaxFull;
  TVariantPriority         = ( NO_PREFERENCE, BM_PREFERENCE, EMALL_PREFERENCE );
  TWebTrawlerDimensions    = ( SENTIMENT, STRENGTH );  
  TWeeksInPeriod           = 0..PeriodLastWeek;
  TTOPDays                 = 1..DaysInPeriod;
  TMarketStudies           = 1..MarketStudiesMax;

  TIngredientsDetails                = array[TIngredientsInput] of single;
  TProducersIngredientsDetails       = array[TAllProducers] of TIngredientsDetails;
  TAllIngredientsDetails             = array[TSpecs] of TIngredientsDetails;
  TCategoriesBytes                   = array[TCategories] of byte;    { identifies current categories, ID taken from TCategoriesUniverse }
  TAxisImportance                    = array[TSegments, TVariantThreePerceptions] of single;
  TSegmentsData                      = array[TSegments] of single;
  TSegmentsTotalData                 = array[TSegmentsTotal] of single;
  TCategoriesSegmentsTotalData       = array[TCategories] of TSegmentsTotalData;
  TCategoriesShares                  = array[TCategories] of single;
  TCumulatedVolumesDetails           = array[TSpecs, TSpecsIndices] of single;
  TDivisionDetails                   = array[TProducerDivisions] of single;
  TDesignsDetails                    = array[TDesign] of single;
  THouseholdsData                    = array[THouseholds] of single;
  THouseholdsTotalData               = array[THouseholdsTotal] of single;
  TMarketsBytes                      = array[TMarkets] of byte;       { identifies current markets, ID taken from TMarketsUniverse }
  TMarketsDetails                    = array[TMarkets] of single;
  TMarketsTotalDetails               = array[TMarketsTotal] of single;
  TPackFormatDetails                 = array[TVariantPackFormat] of single;

  TPromotionsDetails                 = record
                                         promo_Frequency : TWeeksInPeriod;  { saved as # of weeks }
                                         promo_Rate      : single;          { saved as a decimal  }
                                       end;

  TBonusDetails                      = record
                                         bonus_TargetVolume : single;
                                         bonus_Rate         : single;
                                         bonus_Value        : single;
                                       end; 

  TDiscountsDetails                  = record
                                         discount_MinimumVolume : single;
                                         discount_Rate          : single;
                                       end;

  TServiceLevelsData                 = array[TServiceLevel] of single;
  TShoppersData                      = array[TShoppersKind] of single;
  TSegmentsShoppersData              = array[TSegmentsTotal] of TShoppersData;
  TSpecsToBasePerceptionDetails      = array[TVariantBasePerceptions, TSpecsExtended] of single;
  TStorePerceptionsData              = array[TStorePerceptions] of single;
  TStoreAxisImportance               = array[TMarkets, TCategories, TSegments, TStorePerceptions] of single;
  TTechnologiesDetails               = array[TTechnology] of single;
  TVariantComposition                = array[TSpecs] of TSpecsIndices;

  TVariantInventoryDetails           = record
                                         invd_Volume      : single;
                                         invd_UnitCost    : single;
                                         invd_Composition : TVariantComposition;
                                       end;

  TVariantInventoriesDetails         = array[TInventoryAgesTotal] of TVariantInventoryDetails;

  TVariantPerceptionsData            = array[TVariantPerceptions] of single;
  TWebTrawlerIndices                 = array[TWebTrawlerDimensions] of single; 

  TMarketResearchOrders              = array[TMarketStudies] of boolean;
  TMarketResearchPrices              = array[TMarketStudies] of single;


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
                   dp_NextBudgetExtension     : single;
                   dp_ApprovedBudgetExtension : single;
{                   dp_MarketResearch          : TMarketResearchOrders;  }
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
{                   dr_MarketResearch           : TMarketResearchOrders;  }
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

{------------------------- Configuration Record ------------------------------------------------------------------------------}

TConfigurationRecord
    = record
        cr_AdministratorFilesLocation   : THCD_PathCharArray;
        cr_ProgramsFilesLocation        : THCD_PathCharArray;
        cr_SimulationSpan               : TSimulationSpan;
        cr_TraceActive                  : boolean;
        cr_SeminarCode                  : TSeminarCode;
        cr_Market_1_ID                  : byte;
        cr_Market_2_ID                  : byte;
        cr_Category_1_ID                : byte;
        cr_Category_2_ID                : byte;
        cr_TraditionalTradeActive       : boolean;
        cr_E_MallActive                 : boolean;
        cr_VirtualSupplierActive        : boolean;
        cr_IndependentMarkets           : boolean; 
        cr_ForceNextDecisionsOverwrite  : boolean;
{
        cr_OperatingMode              : TOperatingMode;
        cr_Language                   : THCD_Language;
        cr_SeminarID                  : TSeminarID;
        cr_BackupFilesLocation        : THCD_PathCharArray;
        cr_RestoreFilesLocation       : THCD_PathCharArray;
        cr_TeamsFilesLocations        : array[TCIndx] of THCD_PathCharArray;
        cr_TargetMarket               : TTargetMarket;
        cr_LicenseNumber              : integer;
        cr_UserName                   : TUserName;
        cr_TeamsNames                 : array[TCIndx] of TCompanyNameString;
        cr_ActiveTeams                : TTeamsBooleans;
        cr_LicensePassword            : Integer;
        cr_ExpiryDate                 : TDateTime;
}
      end;