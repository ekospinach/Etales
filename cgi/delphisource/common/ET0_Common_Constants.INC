{===============     E-Tales Simulation Global Constants     =================================================================}
Const

  {--- IDs -------------------------------------------------------------------------------------------------------------------}
  ElecsoriesID       = 1;
  HealthBeautiesID   = 2;

  Tier_Urban_ID      =  1;                { This is for Tier 1/2 }
  Tier_Rural_ID      =  2;                { This is for the rest of country }

  Prod_1_ID          = 1;
  Prod_2_ID          = 2;
  Prod_3_ID          = 3;
  Prod_4_ID          = 4;
  Ret_1_ID           = 5;
  Ret_2_ID           = 6;
  TradTrade_ID       = 7;
  E_Mall_ID          = 8;
  Admin_ID           = 9;

  IDM                = 10;
	
  Precision          = 1.0E-6;
  DoublePrecision    = 1.0E-12;


  {--- Limits ----------------------------------------------------------------------------------------------------------------}

  BrandNameLength    = 6;                 { brand name length }
  VarNameLength      = 6;                 { variant name length }

  CatsMax            = 2;                 { # of categories }
  CatsMaxTotal       = CatsMax + 1;       { for totals }
  MrktsMax           = 2;
  MrktsMaxTotal      = MrktsMax + 1;

  ProsMax            = 3;                 { # of supplier teams }
  ProsMaxTotal       = ProsMax + 1;       { for totals of regular Producers }
  ProsMaxPlus        = ProsMax + 1;       { 3 Producer teams Plus one virtual }
  ProsMaxPlusTotal   = ProsMaxPlus + 1;   { for overall totals}

  ProBrandsMax       = 5;                 { max # of brands per supplier per category, there will be 4 active }
                                          { we leave space for a swap an old for a new one }
  ActiveProBrandsMax = ProBrandsMax - 1;
  ProBrandsMaxTotal  = ProBrandsMax + 1;  { for one producer totals }

  VarsMax            = 3;                 { max # of variants per brand }
  VarsMaxTotal       = VarsMax + 1;       { for one brand totals }

  ModernRetsMax      = 2;                 { max of active retailers representing modern trade }
  ModernRetsMaxTotal = ModernRetsMax + 1; { Total of Modern Trade }
  BMRetsMax          = ModernRetsMax + 1; { all B&M retailers }
  BMRetsMaxTotal     = BMRetsMax + 1;     { Total of B&M }
  AllRetsMax         = BMRetsMax + 1;     { all B&M and E-mall }
  AllRetsMaxTotal    = AllRetsMax + 1;    { Grand total of all retailers }


  PLsMax             = 4;  { max # of Private Labels at one retailer - effective number is 3 }
  ActivePLsMax       = PLsMax - 1;
  PLsMaxTotal        = PLsMax + 1;         { for totals }

  AllProBrandsMax    = ProsMaxPlus * ProBrandsMax;
  AllBrandsMax       = AllProBrandsMax + ModernRetsMax * PLsMax;
                       { no private labels at Ret.3; no private labels at E-mall, but E-mall will carry exclusive items from Pro.4 }

  AllVariantsMax     = AllBrandsMax * VarsMax;
  ProsVariantsMax    = ProBrandsMax * ProsMax * VarsMax;

  RetBrandsMax       = 21;  { it should be different, i.e. maximum number of variants listed by a retailer in one "Quarter" - 3 * 4 active producers brands + 3 active PLs }
  RetVariantsMax     = RetBrandsMax;  

  LastBrand_ID       = ( IDM * TradTrade_ID + PLsMax );
  LastVar_ID         = IDM * LastBrand_ID + VarsMax;

  SpecsMax           = 3;                  { # of product technological specification details }
  VariantDimsMax     = 3;                  { Variant perception dimensions }
  VariantDimsMaxFull = VariantDimsMax + AllRetsMaxTotal;  { ... as above plus specific price perceptions at each retailer, plus average }

  PeriodLastWeek     = 52;                 { last week number in period }
  DaysInPeriod       = 365;

  SegmentsMax        = 4;                  { max # of segments both consumer and shopper }
  SegmentsMaxTotal   = SegmentsMax + 1;    { plus total }

  InventoryAgesMax   = 3;                  { Inventory is tracked 3 years backward, any older inventory will be considered also 3 years old }
  InventoryAgesMaxTotal = InventoryAgesMax + 1;  { Used to calculate total volume /regardless of age/ and average cost }

  MaxTechnologyLevel   = 20;
  MaxDesignLevel       = 20;
  TechnologyDelta      =  2;
  MaxSpecsIndex        = MaxTechnologyLevel + TechnologyDelta;
  MaxIngredientsInput  = MaxSpecsIndex;

  SeminarCodeLength  = 15;

  TimeStart          = -4;
  HistoryStart       =  TimeStart + 1;
  HistoryEnd         =  0;
  FutureStart        =  HistoryEnd + 1;
  FutureEnd          =  9;
  TimeEnd            =  FutureEnd + 1;

  CategoriesUniverse =  9;

  MarketsUniverse    =  9;
	


  PARExtension       = '.PAR';
  EXOExtension       = '.EXO';
	
  DefaultTOP         = 60;

  //Added by hao-----------------
  DB_Location        =  'C:\E-Project\databasefile\ETALE.FDB'; {'Q:\ET\databasefile\ETALE.FDB'; }
  DB_PW              =  'sh871030';
  DB_UN              =  'sysdba';

  CONTRACT_Draft    = 0;
  CONTRACT_Locked   = 1;
  CONTRACT_Draftedbyothers     = 2;
  CONTRACT_DEAL   = 3;
  CONTRACT_Lockedbyothers   = 4;




