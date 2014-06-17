{===============     E-Tales Simulation Global Constants     =================================================================}
{                                                                                                                             }
{ To make distinction between the actual "Brick & Mortar" retailers and On-line operations of producers the following         }
{ conventions apply to variables naming:                                                                                      }
{                                                                                                                             }
{  RETAILERS:      The actual three B&M retailers                                                                             }
{  STORES:         The above three + on-line operations of producers                                                          } 
{                                                                                                                             }
{  Furthermore, the following names are used to differentiate:                                                                }
{                                                                                                                             }
{  HOUSEHOLDS: Total population of actively considering purchases of existing product categories. In each market this number  }
{              is corrected for category penetration and yields ...                                                           }
{  CONSUMERS:  ... they are divided in four consumers segments ...                                                            }
{  SHOPPERS:   ... distinguished by their channel selection habits.                                                           }
{                                                                                                                             }
{  Unlike the above three, measured in terms of households numbers,                                                           }
{                                                                                                                             }
{  BUYERS:     ... are measured in terms of volume purchased, i.e. it's the number of consumers / shoppers times their        }
{              consumption rate.                                                                                              }   
{                                                                                                                             }

Const

  {--- IDs -------------------------------------------------------------------------------------------------------------------}

  ElecsoriesID        = 1;
  HealthBeautiesID    = 2;

  Tier_Urban_ID       =  1;                { This is for Tier 1 & 2 i.e. the biggest cities }
  Tier_Rural_ID       =  2;                { This is for the rest of country }

  Prod_1_ID           = 1;
  Prod_2_ID           = 2;
  Prod_3_ID           = 3;
  Prod_4_ID           = 4;
  Ret_1_ID            = 5;
  Ret_2_ID            = 6;
  TraditionalTrade_ID = 7;
  E_MallS             = 8;                 { Amalgam of all four on-line stores run by producers }
  Admin_ID            = 9;

  PL_PROD             = Prod_4_ID + 1;

  IDM                = 10;

  {--- Limits ----------------------------------------------------------------------------------------------------------------}

  TimeStart          = -4;
  HistoryStart       =  TimeStart + 1;
  HistoryEnd         =  0;
  FutureStart        =  HistoryEnd + 1;
  FutureEnd          =  9;
  TimeEnd            =  FutureEnd + 1;

  VarsMax                  = 3;                 { max # of variants per brand }
  VarsMaxTotal             = VarsMax + 1;       { for one brand totals }

  PLsMax                   = 4;                 { max # of Private Labels at one retailer - effective number is 3, leaving room for one discontinued }
  PLsMaxTotal              = PLsMax + 1;        { for totals }
  ActivePLsMax             = PLsMax - 1;

  ProBrandsMax             = 5;                 { max # of brands per supplier per category, there will be 4 active }
  ProBrandsMaxTotal        = ProBrandsMax + 1;  { for one producer totals }
  ActiveProBrandsMax       = ProBrandsMax - 1;  { we leave space for a swap an old for a new one }

  ProsMax                  = 3;                 { # of supplier teams }
  ProsMaxPlus              = ProsMax + 1;       { 3 Producer teams Plus one virtual }
  ProsMaxPlusTotal         = ProsMaxPlus + 1;   { for overall totals}
  ProsMaxTotal             = ProsMax + 1;       { for totals of regular Producers }
  ProsVariantsMax          = ProBrandsMax * ProsMax * VarsMax;

  FactoriesMax             = ProsMaxPlus + 1;   { four suppliers of brands + PL Supplier }
  FactoriesMaxTotal        = FactoriesMax + 1;  { ... + total }

  ModernRetsMax            = 2;                       { max of active retailers representing modern trade }
  ModernRetsMaxTotal       = ModernRetsMax + 1;       { Total of Modern Trade }
  BMRetsMax                = ModernRetsMax + 1;       { all B&M retailers }
  BMRetsMaxTotal           = BMRetsMax + 1;           { Total of B&M }
  AllStoresMax             = BMRetsMax + ProsMaxPlus; { all B&M and four E-malls }
  AllStoresMaxTotal        = AllStoresMax + 1;        { Grand total of all stores }

  AccountsMax              = BMRetsMax + 1;           { Two Modern Retailers + Traditional Trade + On-Line }
  AccountsMaxTotal         = AccountsMax + 1;         { ... Total across all above }

  ActiveActorsMax          = ProsMax + ModernRetsMax;

  ActorsMax                = ProsMaxPlus + BMRetsMax;
  ActorsMaxTotal           = ActorsMax + 1;

  AllProBrandsMax          = ProsMaxPlus * ProBrandsMax;
  AllBrandsMax             = AllProBrandsMax + ModernRetsMax * PLsMax;  { no private labels at Ret.3; no private labels at E-mall, but E-mall will carry exclusive items from Pro.4 }
  AllVariantsMax           = AllBrandsMax * VarsMax;

  BrandNameLength          = 6; { brand name length }
  
  CategoriesUniverse       = 9;            { Maximum # of categories to select from, no more than two can be selected }
  CatsMax                  = 2;            { maximum # of selected categories }
  CatsMaxTotal             = CatsMax + 1;  { for totals }
  DaysInPeriod             = 183;

  HouseholdsGroupsMax      = 4;                        { over-declared for the time being; only total used in the initial version }
  HouseholdsGroupsMaxTotal = HouseholdsGroupsMax + 1;
  
  InventoryAgesMax         = 3;                     { Inventory is tracked 3 periods backward, any older inventory will be considered also 3 years old }
  InventoryAgesMaxTotal    = InventoryAgesMax + 1;  { Used to calculate total volume /regardless of age/ and average cost }

  LastBrand_ID             = ( IDM * TraditionalTrade_ID + PLsMax );
  LastVar_ID               = IDM * LastBrand_ID + VarsMax;

  LeadersMax               = 2;

  MarketsUniverse          =  9;                                     
  MaxDesignLevel           = 20;

  TechnologyDelta          =  2;
  MaxTechnologyLevel       = 20;
  MaxSpecsIndex            = MaxTechnologyLevel + TechnologyDelta;
  MaxIngredientsInput      = MaxSpecsIndex;

  MrktsMax                 =  2;
  MrktsMaxTotal            = MrktsMax + 1;
  PeriodLastWeek           = 26;  { last week number in period }
  RetVariantsMax           = 21;  

  SegmentsMax              =  4;                 { max # of consumer segments }
  SegmentsMaxTotal         = SegmentsMax + 1;    { plus total }

  SeminarCodeLength        = 15;
  
  SpecsMax                 =  3;                 { # of product technological specification details }
  
  StoresDimsMax            =  2;

  VariantDimsMax           =  3;                  { Variant perception dimensions }
  VariantDimsMaxFull       = VariantDimsMax + AllStoresMaxTotal;  { ... as above plus specific price perceptions at each retailer, plus average }

  VarNameLength            = 6;                 { variant name length }

  NearFuture               =  2;
  NearHistory              = -NearFuture;
  
  PARExtension             = '.PAR';
  EXOExtension             = '.EXO';

  DefaultTOP               = 60;

  MarketStudiesMax         = 20;

  ForecastError            = 0.05;

  Precision          = 1.0E-6;
  DoublePrecision    = 1.0E-12;




  //Added by hao-----------------
  DB_Location              =  'C:\E-Project\databasefile\ETALE.FDB'; {'Q:\ET\databasefile\ETALE.FDB'; }
  DB_PW                    =  'sh871030';
  DB_UN                    =  'sysdba';

  CONTRACT_Draft           = 0;
  CONTRACT_Locked          = 1;
  CONTRACT_Draftedbyothers = 2;
  CONTRACT_DEAL            = 3;
  CONTRACT_Lockedbyothers  = 4;
