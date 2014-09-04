{=======  E-Tales Simulation  Parameters   ===============================================================================}

TOneQuarterParameters =
    record
      z_Market_ID                       : TMarketsUniverse;
      z_Category_ID                     : TCategoriesUniverse;
      z_AxisImportance                  : TAxisImportance;
      z_DesignAlpha                     : single;
      z_DesignExponent                  : single;
      z_DesignIntercept                 : single;
      z_FlexibilityAlpha                : single;
      z_FlexibilityExponent             : single;
      z_FlexibilityIntercept            : single;
      z_HandlingFunction_Alpha          : single;
      z_HandlingFunction_Beta           : single;
      z_HandlingFunction_Gamma          : single;
      z_MinProductionVolume             : single;
      z_OnLineVolumeAdjustment          : single;
      z_ProdCost_DefaultDrop            : single;
      z_ProdCost_HigherDesignImpact     : single;
      z_ProdCost_HigherTechImpact       : single;
      z_ProdCost_MarginOnPrivateLabel   : single;
      z_ProdCost_PackFormat             : TPackFormatDetails;
      z_RetailerOrder_Adjustment        : single;
      z_RetailerOrder_Maximum           : single;
      z_RetailerOrder_Warning           : single;  
      z_RetailerPrice_MaximumMarkup     : single;  
      z_TechnologyAlpha                 : single;
      z_TechnologyExponent              : single;
      z_TechnologyIntercept             : single;
      z_VarPerc_Maximum                 : single;
      z_VarPerc_Minimum                 : single;
      z_VarPerc_PackFormat              : TPackFormatDetails;
      z_VarPerc_Technical               : TSpecsToBasePerceptionDetails;

      z_AwarenessMaxAdvertisingImpact   : single;
      z_AwarenessAdvertising            : single;
      z_AwarenessVisibility             : single;
      z_AwarenessAdvertisingPL          : single;
      z_AwarenessVisibilityPL           : single;
      z_AwarenessPreviousNewBrand       : single;
      z_AwarenessMinPreviousInPast      : single;
      z_AwarenessPreviousMin            : single;
      z_AwarenessPreviousMax            : single;
      z_AwarenessPrevious               : single;
      z_AwarenessMin                    : single;
      z_AwarenessMax                    : single;
      z_AwarenessMinVisibility          : single;

    end;

TParameters = array[TMarkets, TCategories] of TOneQuarterParameters;

TOneQuarterParametersFile = file of TOneQuarterParameters;

