{=======   E-Tales  Simulation  Exogenous  Factors    ===============================================================================}

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
      ProdCost_LabourCost             : single;
      ProdCost_IngredientPrices       : TAllIngredientsDetails;
      RequiredNominalPricesIndex      : TSegmentsData;    { Used instead of inflation to gauge prices evolution. Ratios above RNPI result in reducing Consumption Rate growth } 
      RetailerAverageBudgetPerPeriod  : single;
      RetAmortisationRate             : single;  
      RetEquipmentRunningRate         : single;
      RetRealEstateRentRate           : single;
      ShelfSpaceMinimum               : single; 
      ShelfOptimisationCostPerSqMeter : single;    
      StaffCostPerSqMeter             : TServiceLevelsData;
      SupplierAverageBudgetPerPeriod  : single;
      TaxRate                         : single;
      TraditionalTradeMarkup          : single;
      TraditionalTradePriceCorrection : single;
      VariantsMaxAtTraditionalStore   : byte;

      MinBMPriceVsCost                : single;
      MaxBMPriceVsCost                : single;
      IngredientsQualityVsATLGap      : single;
      ActiveAgentVsSmoothenerGap      : single;
      MaxTargetVolumeVsTotalMarket    : single;
      MinOnlinePriceVsCost            : single;
      MaxOnlinePriceVsCost            : single;
      MaxCapacityReduction            : single;
      MaxCapacityIncrease             : single;
      Supplier4AcquiredLevelsGapForPL : single;
      MinPLPriceVsCost                : single;
      MaxPLPriceVsCost                : single;
      MinRetailPriceVsNetBMPrice      : single;
      MaxRetailPriceVsNetBMPrice      : single;

    end;

TExogenous = array[TMarkets, TCategories] of TOneQuarterExogenous;

TOneQuarterExogenousFile = file of TOneQuarterExogenous;