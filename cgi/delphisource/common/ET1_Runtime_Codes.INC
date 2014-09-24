{===============   E-Tales  Simulation  Global Run-Time  Error  Codes   ======================================================}

const
  err_                                               = 90000;
  err_ExogenousFileRead_OK                           = 90001;
  err_ExogenousFileReadFailed                        = 90002;
  err_ParametersFileRead_OK                          = 90003;
  err_ParametersFileReadFailed                       = 90004;
  err_CannotFindDataFilesFoder                       = 90005;
  err_SeminarCodeNotSpecified                        = 90006;
  err_NoMarketSelected                               = 90007;
  err_NoCategorySelected                             = 90008;

{-----------------------------------------------------------------------------------------------------------------------------}

  init_                                              = 91000;
  init_Started_OK                                    = 91001;

  init_ErrorOpeningTraceFile                         = 91010;
  init_ErrorWritingToTraceFile                       = 91011;
  init_ErrorClosingTraceFile                         = 91012;
  init_WritingToTraceFile_OK                         = 91013;

  init_R1Dec_OK                                      = 91101;
  init_R2Dec_OK                                      = 91102;
  init_TTDec_OK                                      = 91103;
  init_EMDec_OK                                      = 91104;

  init_CannotCreateR1DecFile                         = 91111;
  init_CannotCreateR2DecFile                         = 91111;
  init_CannotCreateTTDecFile                         = 91111;
  init_CannotCreateEMDecFile                         = 91111;

  init_RetailersDecisions_OK                         = 91199;

  init_P1Dec_OK                                      = 91201;
  init_P2Dec_OK                                      = 91202;
  init_P3Dec_OK                                      = 91203;
  init_PPDec_OK                                      = 91204;

  init_CannotCreateP1DecFile                         = 91211;
  init_CannotCreateP2DecFile                         = 91212;
  init_CannotCreateP3DecFile                         = 91213;
  init_CannotCreatePPDecFile                         = 91214;

  init_ProducersDecisions_OK                         = 91299;



  init_CannotCreateNegotiationsFile                  = 91301;

  init_Negotiations_OK                               = 91399;

  init_VariantsResults_OK                            = 91401;
  init_BrandsResults_OK                              = 91402;
  init_SuppliersResults_OK                           = 91403;
  init_RetailersResults_OK                           = 91404;
  init_QuartersResults_OK                            = 91405;

  init_ResultsFailed                                 = 91491;
  init_Results_OK                                    = 91499;


  init_VariantsInternalData_OK                       = 91501;
  init_BrandsInternalData_OK                         = 91502;
  init_SuppliersInternalData_OK                      = 91503;
  init_RetailersInternalData_OK                      = 91504;
  init_QuartersInternalData_OK                       = 91505;

  init_InternalDataFailed                            = 91591;
  init_InternalData_OK                               = 91592;


  init_InitialisationRun_OK                          = 92000;




{-----------------------------------------------------------------------------------------------------------------------------}

  kernel_                                            = 93000;
  kernel_Started_OK                                  = 93001;
  kernel_NotEnoughMemory                             = 93002;
  kernel_MemoryAllocation_OK                         = 93003;

  kernel_ErrorWhileCleaningDataStructures            = 93008;
  kernel_CleaningDataStructures_OK                   = 93009;

  kernel_ErrorOpeningTraceFile                       = 93010;
  kernel_ErrorWritingToTraceFile                     = 93011;
  kernel_ErrorClosingTraceFile                       = 93012;
  kernel_WritingToTraceFile_OK                       = 93013;

  kernel_CannotReadResultsFile                       = 93100;
  kernel_ReadingResultsFile_OK                       = 93109;

  kernel_CannotReadInternalsFile                     = 93111;
  kernel_ReadingInternalsFile_OK                     = 93119;

  kernel_CannotReadProducersDecisionFiles            = 93120;
  kernel_CannotReadProducer_1_DecisionFiles          = 93121;
  kernel_CannotReadProducer_2_DecisionFiles          = 93122;
  kernel_CannotReadProducer_3_DecisionFiles          = 93123;
  kernel_CannotReadProducer_4_DecisionFiles          = 93124;
  kernel_ReadingProducersDecisionFiles_OK            = 93129;

  kernel_CannotReadRetailersDecisionFiles            = 93130;
  kernel_CannotReadRetailer_1_DecisionFiles          = 93131;
  kernel_CannotReadRetailer_2_DecisionFiles          = 93132;
  kernel_CannotReadRetailer_3_DecisionFiles          = 93133;
  kernel_CannotReadRetailer_4_DecisionFiles          = 93134;
  kernel_ReadingRetailersDecisionFiles_OK            = 93139;

  kernel_CannotReadNegotiationsFile                  = 93140;
  kernel_ReadingNegotiationsFile_OK                  = 93149;
  
  kernel_ErrorWhileProcessingPreviousResults         = 93150;
  kernel_ProcessingPreviousResults_OK                = 93151;
  kernel_ErrorWhileIntegratingProducersDecisions     = 93152;
  kernel_IntegratingProducersDecisions_OK            = 93153;
  kernel_ErrorWhileIntegratingRetailersDecisions     = 93154;
  kernel_IntegratingRetailersDecisions_OK            = 93155;
  kernel_ErrorWhileIntegratingNegotiations           = 93156;
  kernel_IntegratingNegotiations_OK                  = 93157;
  kernel_ProcessingDecisions_OK                      = 93159;
  
  kernel_ErrorInSegmentsAndChannelsUpdate            = 93172;
  kernel_SegmentsAndChannelsUpdate_OK                = 93173;
  kernel_ErrorInRetailersAssetsAndShelfSpaceUpdate   = 93174;
  kernel_RetailersAssetsAndShelfSpaceUpdate_OK       = 93175;
  kernel_MarketsUpdate_OK                            = 93179;

  kernel_ErrorInWholesales                           = 93401;
  kernel_Wholesales_OK                               = 93409;

  kernel_ErrorInWebBrandsScores                      = 93411;
  kernel_WebBrandsScores_OK                          = 93412;
  kernel_ErrorInWebManufacturersScores               = 93413;
  kernel_WebManufacturersScores_OK                   = 93414;
  kernel_ErrorInWebRetailersScores                   = 93415;
  kernel_WebRetailersScores_OK                       = 93416;
  kernel_WebTrawler_OK                               = 93419;

  kernel_ErrorInShelfSpaceImpact                     = 93421;
  kernel_ShelfSpaceImpact_OK                         = 93422;
  kernel_ErrorInBrandAwarenessImpact                 = 93423;
  kernel_BrandAwarenessImpact_OK                     = 93424;
  kernel_ErrorInVariantsTechnicalPosition            = 93425;
  kernel_VariantsTechnicalPosition_OK                = 93426;
  kernel_ErrorInBrandsTechnicalPosition              = 93427;
  kernel_BrandsTechnicalPosition_OK                  = 93428;
  kernel_ErrorInBrandsPerception                     = 93429;
  kernel_BrandsPerception_OK                         = 93430;
  kernel_ErrorInVariantsPerception                   = 93431;
  kernel_VariantsPerception_OK                       = 93432;
  kernel_BrandChoice_OK                              = 93439;

  kernel_ErrorInStoresOrders                         = 93441;
  kernel_StoresOrders_OK                             = 93449;

  kernel_ErrorInStoresWeight                         = 93451;
  kernel_StoresWeight_OK                             = 93452;
  kernel_ErrorInStoresWeightedPrice                  = 93453;
  kernel_StoresWeightedPrice_OK                      = 93454;
  kernel_ErrorInAssortment                           = 93455;
  kernel_Assortment_OK                               = 93456;
  kernel_ErrorInServiceLevel                         = 93457;
  kernel_ServiceLevel_OK                             = 93458;
  kernel_ErrorInStoresAdvertising                    = 93459;
  kernel_StoresAdvertising_OK                        = 93460;
  kernel_ErrorInStoresPerception                     = 93461;
  kernel_StoresPerception_OK                         = 93462;
  kernel_StoreChoice_OK                              = 93469;

  kernel_ErrorInStoreLoyalty                         = 93481;
  kernel_StoreLoyalty_OK                             = 93482;
  kernel_ErrorInShoppersShift                        = 93483;
  kernel_ShoppersShift_OK                            = 93484;
  kernel_ErrorInConsumersShift                       = 93485;
  kernel_ConsumersShift_OK                           = 93486;
  kernel_ShoppersAndConsumers_OK                     = 93489;

  kernel_ErrorInInitialDemand                        = 93541;
  kernel_InitialDemand_OK                            = 93549;

  kernel_ErrorInInitialDemandMarketSales             = 93551;
  kernel_InitialDemandMarketSales_OK                 = 93559;

  kernel_ErrorInSecondaryDemandMarketSales           = 93561;
  kernel_SecondaryDemandMarketSales_OK               = 93569;

  kernel_ErrorInMarketShares                         = 93571;
  kernel_MarketShares_OK                             = 93579;

  kernel_ErrorInMarketSales                          = 93591;
  kernel_MarketSales_OK                              = 93599;

  kernel_ErrorInExPostAgreements                     = 93601;
  kernel_ExPostAgreements_OK                         = 93609;

  kernel_ErrorInProducersGeneralExpenses             = 93611;
  kernel_ProducersGeneralExpenses_OK                 = 93615;
  kernel_ErrorInProducersDetails                     = 93616;
  kernel_ProducersDetails_OK                         = 93619;

  kernel_ErrorInRetailersGeneralExpenses             = 93621;
  kernel_RetailersGeneralExpenses_OK                 = 93625;
  
  kernel_ErrorInRetailersDetails                     = 93626;
  kernel_RetailersDetails_OK                         = 93629;

  kernel_ErrorInVariantsDetails                      = 93631;
  kernel_VariantsDetails_OK                          = 93639;

  kernel_ErrorInResultsCompleting                    = 93701;
  kernel_ResultsCompleting_OK                        = 93709;
                                          

  kernel_ErrorInProductionCapacity                   = 93801;
  kernel_ProductionCapacity_OK                       = 93809;
  kernel_ErrorInTechnology                           = 93811;
  kernel_Technology_OK                               = 93819;
  kernel_ErrorInTechnologyAndCapacity                = 93831;
  kernel_TechnologyAndCapacity_OK                    = 93839;

  kernel_CannotWriteToResultsFile                    = 93900;
  kernel_WritingResultsToFile_OK                     = 93909;

  kernel_CannotWriteInternalsToFile                  = 93910;
  kernel_WritingInternalsToFile_OK                   = 93919;
  
  kernel_CannotWriteNextProducer_1_Decision          = 93920;
  kernel_CannotWriteNextProducer_2_Decision          = 93921;
  kernel_CannotWriteNextProducer_3_Decision          = 93922;
  kernel_CannotWriteNextProducer_4_Decision          = 93923;
  kernel_WritingNextProducersDecisions_OK            = 93924;
  kernel_CannotWriteNextRetailer_1_Decision          = 93925;
  kernel_CannotWriteNextRetailer_2_Decision          = 93926;
  kernel_CannotWriteNext_TT_Decision                 = 93927;
  kernel_CannotWriteNext_EMall_Decision              = 93928;
  kernel_WritingNextRetailersDecisions_OK            = 93929;
  kernel_WritingNextDecisions_OK                     = 93930;
  
  kernel_ErrorInPrivateLabelsProcurement             = 93931;
  kernel_PrivateLabelsProcurement_OK                 = 93939;

  kernel_ErrorInShoppersShare                        = 93941;
  kernel_ShoppersShare_OK                            = 93949;

  kernel_ErrorInBudgetsUpdating                      = 93951;
  kernel_BudgetsUpdating_OK                          = 93959;

  kernel_ErrorInOtherCompletingResults               = 93991;
  kernel_OtherCompletingResults_OK                   = 93999;
  
  kernel_SimulationRun_OK                            = 94000;


{-----------------------------------------------------------------------------------------------------------------------------}

  passive_                                           = 95000;
  passive_Started_OK                                 = 95001;
  passive_NotEnoughMemory                            = 95002;
  passive_MemoryAllocation_OK                        = 95003;


  passive_ErrorOpeningTraceFile                      = 95010;
  passive_ErrorWritingToTraceFile                    = 95011;
  passive_ErrorClosingTraceFile                      = 95012;
  passive_WritingToTraceFile_OK                      = 95013;

  passive_CannotReadResultsFile                      = 95100;
  passive_ReadingResultsFile_OK                      = 95109;

  passive_CannotReadInternalsFile                    = 95111;
  passive_ReadingInternalsFile_OK                    = 95119;

  passive_CannotReadProducersDecisionFiles           = 95120;
  passive_CannotReadProducer_1_DecisionFiles         = 95121;
  passive_CannotReadProducer_2_DecisionFiles         = 95122;
  passive_CannotReadProducer_3_DecisionFiles         = 95123;
  passive_CannotReadProducer_4_DecisionFiles         = 95124;
  passive_ReadingProducersDecisionFiles_OK           = 95129;

  passive_CannotReadRetailersDecisionFiles           = 95130;
  passive_CannotReadRetailer_1_DecisionFiles         = 95131;
  passive_CannotReadRetailer_2_DecisionFiles         = 95132;
  passive_CannotReadRetailer_3_DecisionFiles         = 95133;
  passive_CannotReadRetailer_4_DecisionFiles         = 95134;
  passive_ReadingRetailersDecisionFiles_OK           = 95139;

  passive_CannotReadNegotiationsFile                 = 95140;
  passive_ReadingNegotiationsFile_OK                 = 95149;

  passive_CannotWriteProducersDecisionFiles          = 95150;
  passive_CannotWriteProducer_1_DecisionFiles        = 95151;
  passive_CannotWriteProducer_2_DecisionFiles        = 95152;
  passive_CannotWriteProducer_3_DecisionFiles        = 95153;
  passive_CannotWriteProducer_4_DecisionFiles        = 95154;
  passive_WritingProducersDecisionFiles_OK           = 95159;

  passive_CannotWriteRetailersDecisionFiles          = 95160;
  passive_CannotWriteRetailer_1_DecisionFiles        = 95161;
  passive_CannotWriteRetailer_2_DecisionFiles        = 95162;
  passive_CannotWriteRetailer_3_DecisionFiles        = 95163;
  passive_CannotWriteRetailer_4_DecisionFiles        = 95164;
  passive_WritingRetailersDecisionFiles_OK           = 95169;

  passive_GeneratePassiveProducersDecisionsFailed    = 95171;
  passive_GeneratePassiveProducersDecisions_OK       = 95172;
  passive_GeneratePassiveRetailersDecisionsFailed    = 95173;
  passive_GeneratePassiveRetailersDecisions_OK       = 95174;
  passive_GenerateDealsWithPassivePlayersFailed      = 95175;
  passive_GenerateDealsWithPassivePlayers_OK         = 95176;

  passive_CannotWriteNegotiationsFile                = 95180;
  passive_WritingNegotiationsFile_OK                 = 95189;


  passive_PassivePlayersDecisionsRun_OK              = 96000;




