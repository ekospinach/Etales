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
  TNegotiationsGranularity = ( NONE, VARIANT_MARKET, VARIANT_TOTAL, BRAND_MARKET, BRAND_TOTAL, CATEGORY_MARKET, CATEGORY_TOTAL );
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
  TStorePerceptions        = ( PRICE_APPEAL, CONVENIENCE );
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
  TTOPDays                 = 0..DaysInPeriod;
  TMarketStudies           = 1..MarketStudiesMax;

  TNegotiationsTopicsLevel           = array[nt_Consignement..nt_QuantityDiscounts] of TNegotiationsGranularity;
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
  TStoreAxisImportance               = array[TMarkets, TCategories, TSegments, BMS..MIXED, TStorePerceptions] of single;
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

  TEvaluationScores = 1..ScoresMax;   { 1 = Incremental Market }
                                      { 2 = ROOB }
                                      { 3 = Portfolio Strength ( Suppliers ) / Relative Profitability ( Retailers }
                                      { 4 = Trade Strength ( Suppliers ) / Shoppers base ( Retailers ) }                    



{------------------------- Configuration Record ----------------------------------------------------------------------------------------------------}

TFinalScoresWeights = array[TEvaluationScores] of single;  

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
        cr_Sup_FinalScoreWeigths        : TFinalScoresWeights;
        cr_Ret_FinalScoreWeigths        : TFinalScoresWeights;

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