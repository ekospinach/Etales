{===============     E-Tales Simulation Global Types     =====================================================================}

Type
  TActors             = 1..E_Mall_ID;
  TAllProducers       = 1..ProsMaxPlus;
  TAllProducersTotal  = 1..ProsMaxPlusTotal;
  TAllRetailers       = 1..AllRetsMax;
  TAllRetailersTotal  = 1..AllRetsMaxTotal;
  TBMRetailers        = 1..BMRetsMax;
  TBrandID            = 0..LastBrand_ID;    { we keep 0 for non-active brands }
  TBrandName          = array[0..BrandNameLength] of WideChar;
  TBrandOwners        = Prod_1_ID..Ret_2_ID;
  TBrandsFromPros     = 1..AllProBrandsMax;
  TBrands             = 1..AllBrandsMax;
  TCategories         = 1..CatsMax;
  TCategoriesTotal    = 1..CatsMaxTotal;
  TCompanies          = Prod_1_ID..E_Mall_ID;
  TDelayOfPayment     = 0..DaysInPeriod;
  TDesign             = 1..MaxDesignLevel;
  THistory            = HistoryStart..HistoryEnd;
  TIngredientsInput   = 1..MaxIngredientsInput;
  TInventoryAgesTotal = 0..InventoryAgesMaxTotal;
  TMarkets            = 1..MrktsMax;
  TMarketsTotal       = 1..MrktsMaxTotal;
  TModernRetailers    = 1..ModernRetsMax;
  TOneBrandVars       = 1..VarsMax;
  TOperatingMode      = ( LOCAL, ONLINE );
  TPeriodNumber       = HistoryStart..FutureEnd;
  TTimeSpan           = TimeStart..TimeEnd;
  TPrivateLabels      = 1..PLsMax;
  TProBrands          = 1..ProBrandsMax;
  TProducers          = 1..ProsMax;
  TRetVariants        = 1..RetVariantsMax;
  TSegments           = 1..SegmentsMax;
  TSegmentsTotal      = 1..SegmentsMaxTotal;
  TSeminarCode        = array[0..SeminarCodeLength] of widechar;
  TServiceLevel       = ( SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM );
  TSimulationSpan     = 1..FutureEnd;
  TSpecsIndices       = 1..MaxSpecsIndex;
  TSpecs              = 1..SpecsMax;
  TSpecsExtended      = 1..SpecsMax + 3;  { Composition + Perceived Price + alpha + beta }
  TStorePerceptions   = ( PRICE, CONVENIENCE, ASSORTMENT );
  TTechnology         = 1..MaxTechnologyLevel;  
  TVarComposition     = array[TSpecs] of TSpecsIndices;
  TVarID              = 0..LastVar_ID;      { we keep 0 for non-active variants }
  TVarName            = array[0..VarNameLength] of WideChar;
  TVarPackFormat      = ( ECONOMY, STANDARD, PREMIUM );
  TVarBasePerceptions = 1..VariantDimsMax - 1;
  TVarPerceptions     = 1..VariantDimsMaxFull;
  TVarPriority        = ( NO_PREFERENCE, BM_PREFERENCE, EMALL_PREFERENCE );
  TVariants           = 1..AllVariantsMax;
  TWeeksInPeriod      = 0..PeriodLastWeek;

  TMarketsDetails = array[TMarkets] of single;
  TMarketsTotalDetails = array[TMarketsTotal] of single;
  TRetailersTotalMarketsTotalDetails = array[TAllRetailersTotal, TMarketsTotal] of single;

  TPromotionsDetails  = record
                          promo_Frequency : TWeeksInPeriod;  { saved as # of weks }
                          promo_Rate      : single;   { saved as a % }
                        end;

  TCategoriesShares       = array[TCategories] of single;
  TStorePerceptionsData   = array[TStorePerceptions] of single;
  TVariantPerceptionsData = array[TVarPerceptions] of single;

  TVariantInventoryDetails = record
                               invd_Volume      : single;
                               invd_UnitCost    : single;
                               invd_Composition : TVarComposition;
                             end;

  TVariantInventoriesDetails = array[TInventoryAgesTotal] of TVariantInventoryDetails;
  
  TSegmentsData              = array[TSegments] of single;
  TSegmentsTotalData         = array[TSegmentsTotal] of single;


  TMarketsBytes              = array[TMarkets] of byte;       { identifies current markets, ID taken from TMarketsUniverse }
  TCategoriesBytes           = array[TCategories] of byte;    { identifies current categories, ID taken from TCategoriesUniverse }
  TMarketsSet                = set of TMarkets;               { defines # of current markets }
  TCategoriesSet             = set of TCategories;            { defines # of current categories }

  TMarketsUniverse           = 1..MarketsUniverse;
  TCategoriesUniverse        = 1..CategoriesUniverse;
  
  TTechnologiesDetails      = array[TTechnology] of single;
  TDesignsDetails           = array[TDesign] of single;
  TIngredientsDetails       = array[TIngredientsInput] of single;
  TAllIngredientsDetails    = array[TSpecs] of TIngredientsDetails;
  
  TServiceLevelsData        = array[TServiceLevel] of single;
 
  TSpecsToBasePerceptionDetails = array[TVarBasePerceptions, TSpecsExtended] of single;

  TCumulatedVolumesDetails  = array[TSpecs, TSpecsIndices] of single;
	
  TWebTrawlerDimensions     = ( SENTIMENT, STRENGTH );  
	
  TWebTrawlerIndices        = array[TWebTrawlerDimensions] of single; 

  TPackFormatDetails         = array[TVarPackFormat] of single;
	
	
  

{=========================   Producer Decisions   ===========================================================================}

  TProVarDecision = record
                      dpv_VarName            : TVarName;
                      dpv_VarID              : TVarID;
                      dpv_ParentBrandID      : TBrandID;
                      dpv_PackFormat         : TVarPackFormat;
                      dpv_DateofBirth        : TTimeSpan;
                      dpv_DateOfDeath        : TTimeSpan;
                      dpv_Composition        : TVarComposition;
                      dpv_Production         : single;
                      dpv_CurrentPriceBM     : single;
                      dpv_CurrentPriceEmall  : single;
                      dpv_Discontinue        : boolean;
                      dpv_NextPriceBM        : single;
                      dpv_NextPriceEmall     : single;
                    end;

  TProVarsDecisions = array[TOneBrandVars] of TProVarDecision;

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
                        dpb_Variants                : TProVarsDecisions;
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
                   dp_ApprovedBudgetExtension : single;             { ### new }
                 end;

  TProsDecisions = array[TAllProducers] of TProDecision;

  TProDecisionsFile = file of TProDecision;

  TProPastDecisions = array[HistoryStart..HistoryEnd] of TProDecision;

  TInitialProVariants   = array[TAllProducers, TProBrands, TOneBrandVars] of TProVarDecision;
  TInitialProBrands     = array[TAllProducers, TProBrands] of TProBrandDecision;
  TInitialProCategories = array[TAllProducers] of TProCatDecision;

{=========================    Retailer Decisions    =========================================================================}

  TPrivateLabelVarDecision = record
                                drplv_VariantName        : TVarName;
                                drplv_VarID              : TVarID;
                                drplv_ParentBrandID      : TBrandID;
                                drplv_DateofBirth        : TTimeSpan;
                                drplv_DateOfDeath        : TTimeSpan;
                                drplv_PackFormat         : TVarPackFormat;
                                drplv_Composition        : TVarComposition;
                                drplv_Discontinue        : boolean;
                              end;

  TPrivateLabelsVarsDecisions = array[TOneBrandVars] of TPrivateLabelVarDecision;

  TPrivateLabelDecision = record
                            drpl_BrandName         : TBrandName;
                            drpl_BrandID           : TBrandID;
                            drpl_ParentCompanyID   : TBrandOwners;
                            drpl_DateofBirth       : TTimeSpan;
                            drpl_DateOfDeath       : TTimeSpan;
                            drpl_Variants          : TPrivateLabelsVarsDecisions;
                          end;

  TPrivateLabelsDecisions = array[TPrivateLabels] of TPrivateLabelDecision;

  TRetCategoryDecision = record
                           drc_CategoryID    : TCategories;
                           drc_PrivateLabels : TPrivateLabelsDecisions;
                         end;

  TRetCategoriesDecisions = array[TCategories] of TRetCategoryDecision;

  TRetVariantDecision = record
                          drv_BrandID          : TBrandID;   
                          drv_VariantID        : TVarID;
                          drv_BrandName        : TBrandName;       { ADDED on HAO's request on October 21 }
                          drv_VariantName      : TVarName;         { ADDED on HAO's request on October 21 }
                          drv_DateofBirth      : TTimeSpan;
                          drv_DateOfDeath      : TTimeSpan;
                          drv_Order            : single;
                          drv_PricePromotions  : TPromotionsDetails;
                          drv_RetailPrice      : single;
                          drv_ShelfSpace       : single;   { saved as a % }
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
                   dr_RetailerID               : TAllRetailers;
                   dr_Categories               : TRetCategoriesDecisions;
                   dr_Markets                  : TRetMarketsDecisions;
                   dr_OnlineAdvertising        : TStorePerceptionsData;
                   dr_TraditionalAdvertising   : TStorePerceptionsData;
                   dr_NextBudgetExtension      : single; 
                   dr_ApprovedBudgetExtension  : single;                           { ### }
                 end;

  TRetsDecisions = array[TAllRetailers] of TRetDecision;

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
                          niv_VarID             : TVarID;
                          niv_DateofBirth       : TTimeSpan;
                          niv_DateOfDeath       : TTimeSpan;
                          niv_MarketsDetails    : TMarketsTotalDetails;
                          niv_UseMarketsDetails : boolean;
                        end;

  TVariantsDetails = array[TOneBrandVars] of TVariantDetails;

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
                   neg_RetailerID          : TAllRetailers;
                   neg_ProducerID          : TAllProducers;
                   neg_CategoriesDeals     : TCategoriesDeals;
                 end;

  TAllDeals = array[TAllProducers, TAllRetailers] of TOnePairDeal;

  TNegotiationsFile = file of TAllDeals;

{------------------------- Configuration Record ------------------------------------------------------------------------------}

TConfigurationRecord
    = record
        cr_AdministratorFilesLocation : THCD_PathCharArray;
        cr_ProgramsFilesLocation      : THCD_PathCharArray;
        cr_SimulationSpan             : TSimulationSpan;
        cr_TraceActive                : boolean;
        cr_SeminarCode                : TSeminarCode;
        cr_Market_1_ID                : byte;
        cr_Market_2_ID                : byte;
        cr_Category_1_ID              : byte;
        cr_Category_2_ID              : byte;
        cr_TraditionalTradeActive     : boolean;
        cr_E_MallActive               : boolean;
        cr_VirtualSupplierActive      : boolean;
        cr_IndependentMarkets         : boolean;   
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

{=======   Exogenous  Factors  &  Parameters   ===============================================================================}

TOneQuarterExogenous =
    record
      PeriodNumber                    : TPeriodNumber;
      Market_ID                       : TMarketsUniverse;
      Category_ID                     : TCategoriesUniverse;
      
      ActiveInternetUseRateByNetizens : TSegmentsData;
      CategoryPenetrationGrowthRate   : single;
      ConsumptionRateChange           : TSegmentsData;
      ConsumersSegmentsSplit          : TSegmentsData;
      DelistedGoodsLossRate           : single;
      EMallMarkup                     : single;
      EMallPriceCorrection            : single;
      IHC_Percentage                  : single;
	  InflationRate                   : single;
      InternetPenetration             : TSegmentsData;
      InStoreCostPerSqMeter           : TServiceLevelsData;
      OnLineOnlyBuyingRate            : TSegmentsData;
      PopulationGrowthRate            : single;
      ProdCost_LogisticsCost          : single;
      ProdCost_IngredientPrices       : TAllIngredientsDetails;
      RequiredNominalPricesIndex      : TSegmentsData;    { Used instead of inflation to gauge prices evolution. Ratios above RNPI result in reducing Consumption Rate growth } 
      RetAmortisationRate             : single;  
      RetEquipmentRunningRate         : single;
      RetRealEstateRentRate           : single;
      ShelfSpaceMinimum               : single; 
      ShelfOptimisationCostPerSqMeter : single;    
      StaffCostPerSqMeter             : TServiceLevelsData;
      TaxRate                         : single;
      TraditionalTradeMarkup          : single;
      TraditionalTradePriceCorrection : single;
      VariantsMaxAtTraditionalStore   : byte;
    end;

TExogenous = array[TMarkets, TCategories] of TOneQuarterExogenous;

TOneQuarterExogenousFile = file of TOneQuarterExogenous;

TOneQuarterParameters =
    record
      Market_ID                       : TMarketsUniverse;
      Category_ID                     : TCategoriesUniverse;
      HandlingFunction_Alpha          : single;
      HandlingFunction_Beta           : single;
      HandlingFunction_Gamma          : single;
      MinProductionVolume             : single;
      RetailerOrder_Warning           : single;  
      RetailerOrder_Maximum           : single;  
      RetailerPrice_MaximumMarkup     : single;  
      ProdCost_HigherDesignImpact     : single;
      ProdCost_HigherTechImpact       : single;
      ProdCost_DefaultDrop            : single;
      ProdCost_PackFormat             : TPackFormatDetails;
      ProdCost_MarginOnPrivateLabel   : single;
      VarPerc_Minimum                 : single;
      VarPerc_Maximum                 : single;
      VarPerc_Technical               : TSpecsToBasePerceptionDetails;
      VarPerc_PackFormat              : TPackFormatDetails;
    end;

TParameters = array[TMarkets, TCategories] of TOneQuarterParameters;

TOneQuarterParametersFile = file of TOneQuarterParameters;

