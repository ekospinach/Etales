{=======   E-Tales  Simulation  Exogenous  Factors    ===============================================================================}

TOneQuarterExogenous =
    record
      x_PeriodNumber                    : TPeriodNumber;
      x_Market_ID                       : TMarketsUniverse;
      x_Category_ID                     : TCategoriesUniverse;

      x_ActiveAgentVsSmoothenerGap      : single;
      x_ActiveInternetUseRateByNetizens : TSegmentsData;
      x_CategoryPenetrationGrowthRate   : single;
      x_ConsumersSegmentsSplit          : TSegmentsData;
      x_ConsumptionRateChange           : TSegmentsData;
      x_CostOfCapital                   : single;
      x_DelistedGoodsLossRate           : single;
      x_EMallMarkup                     : single;
      x_EMallPriceCorrection            : single;
      x_IHC_Percentage                  : single;
      x_InflationRate                   : single;
      x_IngredientsQualityVsATLGap      : single;
      x_InStoreCostPerSqMeter           : TServiceLevelsData;
      x_InternetPenetration             : TSegmentsData;
      x_MarketStudiesPrices             : TMarketResearchPrices;
      x_MaxBMPriceVsCost                : single;
      x_MaxCapacityIncrease             : single;
      x_MaxCapacityReduction            : single;
      x_MaxOnlinePriceVsCost            : single;
      x_MaxPLPriceVsCost                : single;
      x_MaxRetailPriceVsNetBMPrice      : single;
      x_MaxTargetVolumeVsTotalMarket    : single;
      x_MinBMPriceVsCost                : single;
      x_MinOnlinePriceVsCost            : single;
      x_MinPLPriceVsCost                : single;
      x_MinRetailPriceVsNetBMPrice      : single;
      x_OnLineOnlyBuyingRate            : TSegmentsData;
      x_PopulationGrowthRate            : single;
      x_ProdCost_IngredientPrices       : TAllIngredientsDetails;
      x_ProdCost_LabourCost             : single;
      x_ProdCost_LogisticsCost          : single;
      x_ProductionCapacityCost          : single;
      x_RequiredNominalPricesIndex      : TSegmentsData;    { Used instead of inflation to gauge prices evolution. Ratios above RNPI result in reducing Consumption Rate growth } 
      x_RetailerAverageBudgetPerPeriod  : single;
      x_RetAmortisationRate             : single;  
      x_RetEquipmentRunningRate         : single;
      x_RetRealEstateRentRate           : single;
      x_ShelfOptimisationCostPerSqMeter : single;    
      x_ShelfSpaceMinimum               : single; 
      x_StaffCostPerSqMeter             : TServiceLevelsData;
      x_Supplier4AcquiredLevelsGapForPL : single;
      x_Supplier4MinLevelsIncrease      : byte;
      x_SupplierAverageBudgetPerPeriod  : single;
      x_SupplierLandAndEquipmentCost    : single;
      x_SupplierTechnologyCost          : single;
      x_SupplierDesignCost              : single;
      x_SupplierFlexibilityCost         : single;
      x_SupplierAmortisationRate        : single;
      x_TaxRate                         : single;
      x_TraditionalTradeMarkup          : single;
      x_TraditionalTradePriceCorrection : single;
      x_VariantsMaxAtTraditionalStore   : byte;
    end;

TExogenous = array[TMarkets, TCategories] of TOneQuarterExogenous;

TOneQuarterExogenousFile = file of TOneQuarterExogenous;