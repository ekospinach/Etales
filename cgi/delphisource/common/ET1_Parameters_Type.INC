{=======  E-Tales Simulation  Parameters   ===============================================================================}

TOneQuarterParameters =
    record
      Market_ID                       : TMarketsUniverse;
      Category_ID                     : TCategoriesUniverse;
      AxisImportance                  : TAxisImportance;
      HandlingFunction_Alpha          : single;
      HandlingFunction_Beta           : single;
      HandlingFunction_Gamma          : single;
      MinProductionVolume             : single;
      OnLineVolumeAdjustment          : single;
      ProdCost_DefaultDrop            : single;
      ProdCost_HigherDesignImpact     : single;
      ProdCost_HigherTechImpact       : single;
      ProdCost_MarginOnPrivateLabel   : single;
      ProdCost_PackFormat             : TPackFormatDetails;
      RetailerOrder_Adjustment        : single;
      RetailerOrder_Maximum           : single;
      RetailerOrder_Warning           : single;  
      RetailerPrice_MaximumMarkup     : single;  
      VarPerc_Maximum                 : single;
      VarPerc_Minimum                 : single;
      VarPerc_PackFormat              : TPackFormatDetails;
      VarPerc_Technical               : TSpecsToBasePerceptionDetails;
    end;

TParameters = array[TMarkets, TCategories] of TOneQuarterParameters;

TOneQuarterParametersFile = file of TOneQuarterParameters;

