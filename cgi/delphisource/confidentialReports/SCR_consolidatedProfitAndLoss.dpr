program SCR_consolidatedProfitAndLoss;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
    scrpl_Sales                                = 100;
    scrpl_SalesChange                          = 101;
    scrpl_MaterialCosts                        = 102;
    scrpl_CostOfGoodsSold                      = 103;
    scrpl_DiscontinuedGoodsCost                = 104;
    scrpl_InventoryHoldingCost                 = 105;
    scrpl_GrossProfit                          = 106;
    scrpl_GrossProfitChange                    = 107;
    scrpl_GrossProfitMargin                    = 108;
    scrpl_TradeAndMarketing                    = 109;
    scrpl_TradeAndMarketingAsPercentageOfSales = 110;
    scrpl_GeneralExpenses                      = 111;
    scrpl_Amortisation                         = 112;
    scrpl_OperatingProfit                      = 113;
    scrpl_OperatingProfitChange                = 114;
    scrpl_OperatingProfitMargin                = 115;
    scrpl_Interest                             = 116;
    scrpl_Taxes                                = 117;
    scrpl_ExceptionalItems                     = 118;
    scrpl_NetProfit                            = 119;
    scrpl_NetProfitChange                      = 120;
    scrpl_NetProfitMargin                      = 121;
    {---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- }
    scrpl_AdvertisingOnLine                    = 122;
    scrpl_AdvertisingOffLine                   = 123;
    scrpl_TradeSupport                         = 124;

    scrpl_eMallCommission                      = 125;
    scrpl_ShippingCost                         = 126;


    scrv_Sales                                 = 200;
    scrv_SalesChange                           = 201;
    scrv_SalesShareInCategory                  = 202;
    scrv_MaterialCosts                         = 203;
    scrv_CostOfGoodsSold                       = 204;
    scrv_DiscontinuedGoodsCost                 = 205;
    scrv_InventoryHoldingCost                  = 206;
    scrv_GrossProfit                           = 207;
    scrv_GrossProfitChange                     = 208;
    scrv_GrossProfitMargin                     = 209;
    scrv_GrossProfitShareInCategory            = 210;
    scrv_TradeSupport                          = 211;
    scrv_EMallSupport                          = 212;
    scrv_TradeAndMarketing                     = 213;
    scrv_AdvertisingOnLine                     = 214;
    scrv_AdvertisingOffLine                    = 215;
    scrv_TradeAndMarketingAsPercentageOfSales  = 216;
    scrv_TradeAndMarketingShareInCategory      = 217;
    scrv_GeneralExpenses                       = 218;
    scrv_Amortisation                          = 219;
    scrv_OperatingProfit                       = 220;
    scrv_OperatingProfitChange                 = 221;
    scrv_OperatingProfitMargin                 = 222;
    scrv_OperatingProfitShareInCategory        = 223;
    scrv_Interest                              = 224;
    scrv_Taxes                                 = 225;
    scrv_ExceptionalItems                      = 226;
    scrv_NetProfit                             = 227;
    scrv_NetProfitChange                       = 228;
    scrv_NetProfitMargin                       = 229;
    scrv_NetProfitShareInCategory              = 230;

    scrv_eMallCommission                       = 231;
    scrv_ShippingCost                          = 232; 

    scrb_Sales                                 = 300;
    scrb_SalesChange                           = 301;
    scrb_SalesShareInCategory                  = 302;
    scrb_MaterialCosts                         = 303;
    scrb_CostOfGoodsSold                       = 304;
    scrb_DiscontinuedGoodsCost                 = 305;
    scrb_InventoryHoldingCost                  = 306;
    scrb_GrossProfit                           = 307;
    scrb_GrossProfitChange                     = 308;
    scrb_GrossProfitMargin                     = 309;
    scrb_GrossProfitShareInCategory            = 310;
    scrb_TradeSupport                          = 311;
    scrb_EMallSupport                          = 312;
    scrb_TradeAndMarketing                     = 313;
    scrb_AdvertisingOnLine                     = 314;
    scrb_AdvertisingOffLine                    = 315;
    scrb_TradeAndMarketingAsPercentageOfSales  = 316;
    scrb_TradeAndMarketingShareInCategory      = 317;
    scrb_GeneralExpenses                       = 318;
    scrb_Amortisation                          = 319;
    scrb_OperatingProfit                       = 320;
    scrb_OperatingProfitChange                 = 321;
    scrb_OperatingProfitMargin                 = 322;
    scrb_OperatingProfitShareInCategory        = 323;
    scrb_Interest                              = 324;
    scrb_Taxes                                 = 325;
    scrb_ExceptionalItems                      = 326;
    scrb_NetProfit                             = 327;
    scrb_NetProfitChange                       = 328;
    scrb_NetProfitMargin                       = 329;
    scrb_NetProfitShareInCategory              = 330;

    scrb_eMallCommission                       = 331;
    scrb_ShippingCost                          = 332;  


type
  TDevisionData = array[TProducerDivisions] of Single;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;

  currentPeriod : TPeriodNumber;
  currentProducer : TAllProducers;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function brandInfoSchema(fieldIdx : integer; catID : integer; brand : TSCR_OneBrand): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['brandName'] := brand.scrb_BrandName;
     jo.I['parentCategoryID'] := catID;
     jo.O['value'] := SA([]);

     case (fieldIdx) of
       scrb_Sales:                          begin jo.A['value'].D[0] := brand.scrb_Sales[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_Sales[INTERNET];    jo.A['value'].D[2] := brand.scrb_Sales[CORPORATE]; end;
       scrb_SalesChange:                    begin jo.A['value'].D[0] := brand.scrb_SalesChange[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_SalesChange[INTERNET];    jo.A['value'].D[2] := brand.scrb_SalesChange[CORPORATE]; end;
       scrb_SalesShareInCategory:           begin jo.A['value'].D[0] := brand.scrb_SalesShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_SalesShareInCategory[INTERNET];    jo.A['value'].D[2] := brand.scrb_SalesShareInCategory[CORPORATE]; end;
       scrb_MaterialCosts:                  begin jo.A['value'].D[0] := brand.scrb_MaterialCosts[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_MaterialCosts[INTERNET];    jo.A['value'].D[2] := brand.scrb_MaterialCosts[CORPORATE]; end;
       scrb_CostOfGoodsSold:                begin jo.A['value'].D[0] := brand.scrb_CostOfGoodsSold[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_CostOfGoodsSold[INTERNET];    jo.A['value'].D[2] := brand.scrb_CostOfGoodsSold[CORPORATE]; end;
       scrb_DiscontinuedGoodsCost:          begin jo.A['value'].D[0] := brand.scrb_DiscontinuedGoodsCost[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_DiscontinuedGoodsCost[INTERNET];    jo.A['value'].D[2] := brand.scrb_DiscontinuedGoodsCost[CORPORATE]; end;
       scrb_InventoryHoldingCost:           begin jo.A['value'].D[0] := brand.scrb_InventoryHoldingCost[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_InventoryHoldingCost[INTERNET];    jo.A['value'].D[2] := brand.scrb_InventoryHoldingCost[CORPORATE]; end;
       scrb_GrossProfit:                    begin jo.A['value'].D[0] := brand.scrb_GrossProfit[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_GrossProfit[INTERNET];    jo.A['value'].D[2] := brand.scrb_GrossProfit[CORPORATE]; end;
       scrb_GrossProfitChange:              begin jo.A['value'].D[0] := brand.scrb_GrossProfitChange[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_GrossProfitChange[INTERNET];    jo.A['value'].D[2] := brand.scrb_GrossProfitChange[CORPORATE]; end;
       scrb_GrossProfitMargin:              begin jo.A['value'].D[0] := brand.scrb_GrossProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_GrossProfitMargin[INTERNET];    jo.A['value'].D[2] := brand.scrb_GrossProfitMargin[CORPORATE]; end;
       scrb_GrossProfitShareInCategory:     begin jo.A['value'].D[0] := brand.scrb_GrossProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_GrossProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := brand.scrb_GrossProfitShareInCategory[CORPORATE]; end;
       scrb_TradeSupport:                   begin jo.A['value'].D[0] := brand.scrb_TradeSupport[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_TradeSupport[INTERNET];    jo.A['value'].D[2] := brand.scrb_TradeSupport[CORPORATE]; end;
       scrb_EMallSupport:                   begin jo.A['value'].D[0] := brand.scrb_EMallSupport[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_EMallSupport[INTERNET];    jo.A['value'].D[2] := brand.scrb_EMallSupport[CORPORATE]; end;  
       scrb_TradeAndMarketing:              begin jo.A['value'].D[0] := brand.scrb_TradeAndMarketing[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_TradeAndMarketing[INTERNET];    jo.A['value'].D[2] := brand.scrb_TradeAndMarketing[CORPORATE]; end;
       scrb_AdvertisingOnLine:              begin jo.A['value'].D[0] := brand.scrb_AdvertisingOnLine[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_AdvertisingOnLine[INTERNET];    jo.A['value'].D[2] := brand.scrb_AdvertisingOnLine[CORPORATE]; end;
       scrb_AdvertisingOffLine:             begin jo.A['value'].D[0] := brand.scrb_AdvertisingOffLine[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_AdvertisingOffLine[INTERNET];    jo.A['value'].D[2] := brand.scrb_AdvertisingOffLine[CORPORATE]; end;
       scrb_TradeAndMarketingAsPercentageOfSales: begin jo.A['value'].D[0] := brand.scrb_TradeAndMarketingAsPercentageOfSales[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_TradeAndMarketingAsPercentageOfSales[INTERNET];    jo.A['value'].D[2] := brand.scrb_TradeAndMarketingAsPercentageOfSales[CORPORATE]; end;
       scrb_TradeAndMarketingShareInCategory: begin jo.A['value'].D[0] := brand.scrb_TradeAndMarketingShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_TradeAndMarketingShareInCategory[INTERNET];    jo.A['value'].D[2] := brand.scrb_TradeAndMarketingShareInCategory[CORPORATE]; end;
       scrb_GeneralExpenses:                begin jo.A['value'].D[0] := brand.scrb_GeneralExpenses[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_GeneralExpenses[INTERNET];    jo.A['value'].D[2] := brand.scrb_GeneralExpenses[CORPORATE]; end;
       scrb_Amortisation:                   begin jo.A['value'].D[0] := brand.scrb_Amortisation[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_Amortisation[INTERNET];    jo.A['value'].D[2] := brand.scrb_Amortisation[CORPORATE]; end;
       scrb_OperatingProfit:                begin jo.A['value'].D[0] := brand.scrb_OperatingProfit[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_OperatingProfit[INTERNET];    jo.A['value'].D[2] := brand.scrb_OperatingProfit[CORPORATE]; end;
       scrb_OperatingProfitChange:          begin jo.A['value'].D[0] := brand.scrb_OperatingProfitChange[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_OperatingProfitChange[INTERNET];    jo.A['value'].D[2] := brand.scrb_OperatingProfitChange[CORPORATE]; end;
       scrb_OperatingProfitMargin:          begin jo.A['value'].D[0] := brand.scrb_OperatingProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_OperatingProfitMargin[INTERNET];    jo.A['value'].D[2] := brand.scrb_OperatingProfitMargin[CORPORATE]; end;
       scrb_OperatingProfitShareInCategory: begin jo.A['value'].D[0] := brand.scrb_OperatingProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_OperatingProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := brand.scrb_OperatingProfitShareInCategory[CORPORATE]; end;
       scrb_Interest:                       begin jo.A['value'].D[0] := brand.scrb_Interest[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_Interest[INTERNET];    jo.A['value'].D[2] := brand.scrb_Interest[CORPORATE]; end;
       scrb_Taxes:                          begin jo.A['value'].D[0] := brand.scrb_Taxes[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_Taxes[INTERNET];    jo.A['value'].D[2] := brand.scrb_Taxes[CORPORATE]; end;
       scrb_ExceptionalItems:               begin jo.A['value'].D[0] := brand.scrb_ExceptionalItems[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_ExceptionalItems[INTERNET];    jo.A['value'].D[2] := brand.scrb_ExceptionalItems[CORPORATE]; end;
       scrb_NetProfit:                      begin jo.A['value'].D[0] := brand.scrb_NetProfit[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_NetProfit[INTERNET];    jo.A['value'].D[2] := brand.scrb_NetProfit[CORPORATE]; end;
       scrb_NetProfitChange:                begin jo.A['value'].D[0] := brand.scrb_NetProfitChange[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_NetProfitChange[INTERNET];    jo.A['value'].D[2] := brand.scrb_NetProfitChange[CORPORATE]; end;
       scrb_NetProfitMargin:                begin jo.A['value'].D[0] := brand.scrb_NetProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_NetProfitMargin[INTERNET];    jo.A['value'].D[2] := brand.scrb_NetProfitMargin[CORPORATE]; end;  
       scrb_NetProfitShareInCategory:       begin jo.A['value'].D[0] := brand.scrb_NetProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_NetProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := brand.scrb_NetProfitShareInCategory[CORPORATE]; end;

       scrb_eMallCommission:       begin jo.A['value'].D[0] := brand.scrb_eMallCommission[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_eMallCommission[INTERNET];    jo.A['value'].D[2] := brand.scrb_eMallCommission[CORPORATE]; end;
       scrb_ShippingCost:       begin jo.A['value'].D[0] := brand.scrb_ShippingCost[TRADITIONAL];    jo.A['value'].D[1] := brand.scrb_ShippingCost[INTERNET];    jo.A['value'].D[2] := brand.scrb_ShippingCost[CORPORATE]; end;

     end;
     result := jo;
  end;

  function variantInfoSchema(fieldIdx : integer; catID : integer; variant : TSCR_OneVariant): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['variantName'] := variant.scrv_VariantName;
     jo.S['parentBrandName'] := variant.scrv_ParentBrandName;
     jo.I['parentCategoryID'] := catID;
     jo.O['value'] := SA([]);

     case (fieldIdx) of
       scrv_Sales:                          begin jo.A['value'].D[0] := variant.scrv_Sales[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_Sales[INTERNET];    jo.A['value'].D[2] := variant.scrv_Sales[CORPORATE]; end;
       scrv_SalesChange:                    begin jo.A['value'].D[0] := variant.scrv_SalesChange[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_SalesChange[INTERNET];    jo.A['value'].D[2] := variant.scrv_SalesChange[CORPORATE]; end;
       scrv_SalesShareInCategory:           begin jo.A['value'].D[0] := variant.scrv_SalesShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_SalesShareInCategory[INTERNET];    jo.A['value'].D[2] := variant.scrv_SalesShareInCategory[CORPORATE]; end;
       scrv_MaterialCosts:                  begin jo.A['value'].D[0] := variant.scrv_MaterialCosts[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_MaterialCosts[INTERNET];    jo.A['value'].D[2] := variant.scrv_MaterialCosts[CORPORATE]; end;
       scrv_CostOfGoodsSold:                begin jo.A['value'].D[0] := variant.scrv_CostOfGoodsSold[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_CostOfGoodsSold[INTERNET];    jo.A['value'].D[2] := variant.scrv_CostOfGoodsSold[CORPORATE]; end;
       scrv_DiscontinuedGoodsCost:          begin jo.A['value'].D[0] := variant.scrv_DiscontinuedGoodsCost[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_DiscontinuedGoodsCost[INTERNET];    jo.A['value'].D[2] := variant.scrv_DiscontinuedGoodsCost[CORPORATE]; end;
       scrv_InventoryHoldingCost:           begin jo.A['value'].D[0] := variant.scrv_InventoryHoldingCost[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_InventoryHoldingCost[INTERNET];    jo.A['value'].D[2] := variant.scrv_InventoryHoldingCost[CORPORATE]; end;
       scrv_GrossProfit:                    begin jo.A['value'].D[0] := variant.scrv_GrossProfit[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_GrossProfit[INTERNET];    jo.A['value'].D[2] := variant.scrv_GrossProfit[CORPORATE]; end;
       scrv_GrossProfitChange:              begin jo.A['value'].D[0] := variant.scrv_GrossProfitChange[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_GrossProfitChange[INTERNET];    jo.A['value'].D[2] := variant.scrv_GrossProfitChange[CORPORATE]; end;
       scrv_GrossProfitMargin:              begin jo.A['value'].D[0] := variant.scrv_GrossProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_GrossProfitMargin[INTERNET];    jo.A['value'].D[2] := variant.scrv_GrossProfitMargin[CORPORATE]; end;
       scrv_GrossProfitShareInCategory:     begin jo.A['value'].D[0] := variant.scrv_GrossProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_GrossProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := variant.scrv_GrossProfitShareInCategory[CORPORATE]; end;
       scrv_TradeSupport:                   begin jo.A['value'].D[0] := variant.scrv_TradeSupport[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_TradeSupport[INTERNET];    jo.A['value'].D[2] := variant.scrv_TradeSupport[CORPORATE]; end;
       scrv_EMallSupport:                   begin jo.A['value'].D[0] := variant.scrv_EMallSupport[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_EMallSupport[INTERNET];    jo.A['value'].D[2] := variant.scrv_EMallSupport[CORPORATE]; end;  
       scrv_TradeAndMarketing:              begin jo.A['value'].D[0] := variant.scrv_TradeAndMarketing[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_TradeAndMarketing[INTERNET];    jo.A['value'].D[2] := variant.scrv_TradeAndMarketing[CORPORATE]; end;
       scrv_AdvertisingOnLine:              begin jo.A['value'].D[0] := variant.scrv_AdvertisingOnLine[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_AdvertisingOnLine[INTERNET];    jo.A['value'].D[2] := variant.scrv_AdvertisingOnLine[CORPORATE]; end;
       scrv_AdvertisingOffLine:             begin jo.A['value'].D[0] := variant.scrv_AdvertisingOffLine[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_AdvertisingOffLine[INTERNET];    jo.A['value'].D[2] := variant.scrv_AdvertisingOffLine[CORPORATE]; end;
       scrv_TradeAndMarketingAsPercentageOfSales: begin jo.A['value'].D[0] := variant.scrv_TradeAndMarketingAsPercentageOfSales[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_TradeAndMarketingAsPercentageOfSales[INTERNET];    jo.A['value'].D[2] := variant.scrv_TradeAndMarketingAsPercentageOfSales[CORPORATE]; end;
       scrv_TradeAndMarketingShareInCategory: begin jo.A['value'].D[0] := variant.scrv_TradeAndMarketingShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_TradeAndMarketingShareInCategory[INTERNET];    jo.A['value'].D[2] := variant.scrv_TradeAndMarketingShareInCategory[CORPORATE]; end;
       scrv_GeneralExpenses:                begin jo.A['value'].D[0] := variant.scrv_GeneralExpenses[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_GeneralExpenses[INTERNET];    jo.A['value'].D[2] := variant.scrv_GeneralExpenses[CORPORATE]; end;
       scrv_Amortisation:                   begin jo.A['value'].D[0] := variant.scrv_Amortisation[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_Amortisation[INTERNET];    jo.A['value'].D[2] := variant.scrv_Amortisation[CORPORATE]; end;
       scrv_OperatingProfit:                begin jo.A['value'].D[0] := variant.scrv_OperatingProfit[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_OperatingProfit[INTERNET];    jo.A['value'].D[2] := variant.scrv_OperatingProfit[CORPORATE]; end;
       scrv_OperatingProfitChange:          begin jo.A['value'].D[0] := variant.scrv_OperatingProfitChange[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_OperatingProfitChange[INTERNET];    jo.A['value'].D[2] := variant.scrv_OperatingProfitChange[CORPORATE]; end;
       scrv_OperatingProfitMargin:          begin jo.A['value'].D[0] := variant.scrv_OperatingProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_OperatingProfitMargin[INTERNET];    jo.A['value'].D[2] := variant.scrv_OperatingProfitMargin[CORPORATE]; end;
       scrv_OperatingProfitShareInCategory: begin jo.A['value'].D[0] := variant.scrv_OperatingProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_OperatingProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := variant.scrv_OperatingProfitShareInCategory[CORPORATE]; end;
       scrv_Interest:                       begin jo.A['value'].D[0] := variant.scrv_Interest[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_Interest[INTERNET];    jo.A['value'].D[2] := variant.scrv_Interest[CORPORATE]; end;
       scrv_Taxes:                          begin jo.A['value'].D[0] := variant.scrv_Taxes[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_Taxes[INTERNET];    jo.A['value'].D[2] := variant.scrv_Taxes[CORPORATE]; end;
       scrv_ExceptionalItems:               begin jo.A['value'].D[0] := variant.scrv_ExceptionalItems[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_ExceptionalItems[INTERNET];    jo.A['value'].D[2] := variant.scrv_ExceptionalItems[CORPORATE]; end;
       scrv_NetProfit:                      begin jo.A['value'].D[0] := variant.scrv_NetProfit[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_NetProfit[INTERNET];    jo.A['value'].D[2] := variant.scrv_NetProfit[CORPORATE]; end;
       scrv_NetProfitChange:                begin jo.A['value'].D[0] := variant.scrv_NetProfitChange[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_NetProfitChange[INTERNET];    jo.A['value'].D[2] := variant.scrv_NetProfitChange[CORPORATE]; end;
       scrv_NetProfitMargin:                begin jo.A['value'].D[0] := variant.scrv_NetProfitMargin[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_NetProfitMargin[INTERNET];    jo.A['value'].D[2] := variant.scrv_NetProfitMargin[CORPORATE]; end;  
       scrv_NetProfitShareInCategory:       begin jo.A['value'].D[0] := variant.scrv_NetProfitShareInCategory[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_NetProfitShareInCategory[INTERNET];    jo.A['value'].D[2] := variant.scrv_NetProfitShareInCategory[CORPORATE]; end;

       scrv_eMallCommission:       begin jo.A['value'].D[0] := variant.scrv_eMallCommission[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_eMallCommission[INTERNET];    jo.A['value'].D[2] := variant.scrv_eMallCommission[CORPORATE]; end;
       scrv_ShippingCost:       begin jo.A['value'].D[0] := variant.scrv_ShippingCost[TRADITIONAL];    jo.A['value'].D[1] := variant.scrv_ShippingCost[INTERNET];    jo.A['value'].D[2] := variant.scrv_ShippingCost[CORPORATE]; end;

     end;

     result := jo;
  end;

  function categoryDivisionsInfoSchema(fieldIdx : Integer; catID : Integer; divisions : TSCR_CategoryProfitAndLoss):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['value'] := SA([]);

    case (fieldIdx) of
      scrpl_Sales :  begin                 jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_Sales; jo.A['value'].D[1] := divisions[INTERNET].scrpl_Sales; jo.A['value'].D[2] := divisions[CORPORATE].scrpl_Sales;  end;
      scrpl_SalesChange : begin            jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_SalesChange; jo.A['value'].D[1] := divisions[INTERNET].scrpl_SalesChange; jo.A['value'].D[2] := divisions[CORPORATE].scrpl_SalesChange; end;
      scrpl_MaterialCosts: begin           jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_MaterialCosts;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_MaterialCosts; jo.A['value'].D[2] := divisions[CORPORATE].scrpl_MaterialCosts;    end;
      scrpl_CostOfGoodsSold: begin         jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_CostOfGoodsSold;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_CostOfGoodsSold; jo.A['value'].D[2] := divisions[CORPORATE].scrpl_CostOfGoodsSold;    end;
      scrpl_DiscontinuedGoodsCost:begin    jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_DiscontinuedGoodsCost;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_DiscontinuedGoodsCost;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_DiscontinuedGoodsCost;    end;
      scrpl_InventoryHoldingCost: begin    jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_InventoryHoldingCost;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_InventoryHoldingCost;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_InventoryHoldingCost;    end;

      scrpl_GrossProfit: begin             jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_GrossProfit;            jo.A['value'].D[1] := divisions[INTERNET].scrpl_GrossProfit;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_GrossProfit;   end;
      scrpl_GrossProfitChange : begin      jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_GrossProfitChange;      jo.A['value'].D[1] := divisions[INTERNET].scrpl_GrossProfitChange;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_GrossProfitChange;    end;
      scrpl_GrossProfitMargin : begin      jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_GrossProfitMargin;      jo.A['value'].D[1] := divisions[INTERNET].scrpl_GrossProfitMargin;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_GrossProfitMargin;    end;


      scrpl_TradeAndMarketing : begin      jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_TradeAndMarketing;      jo.A['value'].D[1] := divisions[INTERNET].scrpl_TradeAndMarketing;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_TradeAndMarketing;    end;
      scrpl_TradeAndMarketingAsPercentageOfSales : begin jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_TradeAndMarketingAsPercentageOfSales;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_TradeAndMarketingAsPercentageOfSales;jo.A['value'].D[2] := divisions[CORPORATE].scrpl_TradeAndMarketingAsPercentageOfSales;    end;
      scrpl_GeneralExpenses : begin        jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_GeneralExpenses;        jo.A['value'].D[1] := divisions[INTERNET].scrpl_GeneralExpenses;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_GeneralExpenses;    end;
      scrpl_Amortisation : begin           jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_Amortisation;           jo.A['value'].D[1] := divisions[INTERNET].scrpl_Amortisation;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_Amortisation;    end;
      scrpl_OperatingProfit : begin        jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_OperatingProfit;        jo.A['value'].D[1] := divisions[INTERNET].scrpl_OperatingProfit;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_OperatingProfit;    end;
      scrpl_OperatingProfitChange  : begin jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_OperatingProfitChange;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_OperatingProfitChange;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_OperatingProfitChange;    end;
      scrpl_OperatingProfitMargin  : begin jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_OperatingProfitMargin;  jo.A['value'].D[1] := divisions[INTERNET].scrpl_OperatingProfitMargin;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_OperatingProfitMargin;    end;
      scrpl_Interest : begin               jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_Interest;               jo.A['value'].D[1] := divisions[INTERNET].scrpl_Interest;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_Interest;    end;
      scrpl_Taxes : begin                  jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_Taxes;                  jo.A['value'].D[1] := divisions[INTERNET].scrpl_Taxes;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_Taxes;    end;
      scrpl_ExceptionalItems : begin       jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_ExceptionalItems;       jo.A['value'].D[1] := divisions[INTERNET].scrpl_ExceptionalItems;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_ExceptionalItems;    end;
      scrpl_NetProfit : begin              jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_NetProfit;              jo.A['value'].D[1] := divisions[INTERNET].scrpl_NetProfit;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_NetProfit;    end;
      scrpl_NetProfitChange : begin        jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_NetProfitChange;        jo.A['value'].D[1] := divisions[INTERNET].scrpl_NetProfitChange;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_NetProfitChange;    end;
      scrpl_NetProfitMargin : begin        jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_NetProfitMargin;        jo.A['value'].D[1] := divisions[INTERNET].scrpl_NetProfitMargin;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_NetProfitMargin;    end;
      scrpl_AdvertisingOnLine : begin      jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_AdvertisingOnLine;      jo.A['value'].D[1] := divisions[INTERNET].scrpl_AdvertisingOnLine;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_AdvertisingOnLine;   end;
      scrpl_AdvertisingOffLine : begin     jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_AdvertisingOffLine;     jo.A['value'].D[1] := divisions[INTERNET].scrpl_AdvertisingOffLine;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_AdvertisingOffLine;    end;
      scrpl_TradeSupport : begin           jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_TradeSupport;           jo.A['value'].D[1] := divisions[INTERNET].scrpl_TradeSupport;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_TradeSupport;    end;

      scrpl_eMallCommission : begin        jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_eMallCommission;           jo.A['value'].D[1] := divisions[INTERNET].scrpl_eMallCommission;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_eMallCommission;    end;
      scrpl_ShippingCost : begin           jo.A['value'].D[0] := divisions[TRADITIONAL].scrpl_ShippingCost;           jo.A['value'].D[1] := divisions[INTERNET].scrpl_ShippingCost;   jo.A['value'].D[2] := divisions[CORPORATE].scrpl_ShippingCost;    end;

    end;
         
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandCount,variantCount : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['producerID'] := currentProducer;

    //Consolidated Profit & Loss statement, suppliers
    oJsonFile.O['scrpl_Sales'] := SA([]);
    oJsonFile.O['scrpl_SalesChange'] := SA([]);
    oJsonFile.O['scrpl_MaterialCosts'] := SA([]);
    oJsonFile.O['scrpl_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['scrpl_DiscontinuedGoodsCost'] := SA([]);
    oJsonFile.O['scrpl_InventoryHoldingCost'] := SA([]);
    oJsonFile.O['scrpl_GrossProfit'] := SA([]);
    oJsonFile.O['scrpl_GrossProfitChange'] := SA([]);
    oJsonFile.O['scrpl_GrossProfitMargin'] := SA([]);
    oJsonFile.O['scrpl_TradeAndMarketing'] := SA([]);
    oJsonFile.O['scrpl_TradeAndMarketingAsPercentageOfSales'] := SA([]);
    oJsonFile.O['scrpl_GeneralExpenses'] := SA([]);
    oJsonFile.O['scrpl_Amortisation'] := SA([]);
    oJsonFile.O['scrpl_OperatingProfit'] := SA([]);
    oJsonFile.O['scrpl_OperatingProfitChange'] := SA([]);
    oJsonFile.O['scrpl_OperatingProfitMargin'] := SA([]);
    oJsonFile.O['scrpl_Interest'] := SA([]);
    oJsonFile.O['scrpl_Taxes'] := SA([]);
    oJsonFile.O['scrpl_ExceptionalItems'] := SA([]);
    oJsonFile.O['scrpl_NetProfit'] := SA([]);
    oJsonFile.O['scrpl_NetProfitChange'] := SA([]);
    oJsonFile.O['scrpl_NetProfitMargin'] := SA([]);
    //---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- 
    oJsonFile.O['scrpl_AdvertisingOnLine'] := SA([]);
    oJsonFile.O['scrpl_AdvertisingOffLine'] := SA([]);
    oJsonFile.O['scrpl_TradeSupport'] := SA([]);

    oJsonFile.O['scrpl_eMallCommission'] := SA([]);
    oJsonFile.O['scrpl_ShippingCost'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['scrpl_Sales'].Add(categoryDivisionsInfoSchema(scrpl_Sales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_SalesChange'].Add(categoryDivisionsInfoSchema(scrpl_SalesChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_MaterialCosts'].Add(categoryDivisionsInfoSchema(scrpl_MaterialCosts, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_CostOfGoodsSold'].Add(categoryDivisionsInfoSchema(scrpl_CostOfGoodsSold, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_DiscontinuedGoodsCost'].Add(categoryDivisionsInfoSchema(scrpl_DiscontinuedGoodsCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_InventoryHoldingCost'].Add(categoryDivisionsInfoSchema(scrpl_InventoryHoldingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_GrossProfit'].Add(categoryDivisionsInfoSchema(scrpl_GrossProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_GrossProfitChange'].Add(categoryDivisionsInfoSchema(scrpl_GrossProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_GrossProfitMargin'].Add(categoryDivisionsInfoSchema(scrpl_GrossProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_TradeAndMarketing'].Add(categoryDivisionsInfoSchema(scrpl_TradeAndMarketing, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_TradeAndMarketingAsPercentageOfSales'].Add(categoryDivisionsInfoSchema(scrpl_TradeAndMarketingAsPercentageOfSales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_GeneralExpenses'].Add(categoryDivisionsInfoSchema(scrpl_GeneralExpenses, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_Amortisation'].Add(categoryDivisionsInfoSchema(scrpl_Amortisation, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_OperatingProfit'].Add(categoryDivisionsInfoSchema(scrpl_OperatingProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_OperatingProfitChange'].Add(categoryDivisionsInfoSchema(scrpl_OperatingProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_OperatingProfitMargin'].Add(categoryDivisionsInfoSchema(scrpl_OperatingProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_Interest'].Add(categoryDivisionsInfoSchema(scrpl_Interest, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_Taxes'].Add(categoryDivisionsInfoSchema(scrpl_Taxes, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_ExceptionalItems'].Add(categoryDivisionsInfoSchema(scrpl_ExceptionalItems, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_NetProfit'].Add(categoryDivisionsInfoSchema(scrpl_NetProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_NetProfitChange'].Add(categoryDivisionsInfoSchema(scrpl_NetProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_NetProfitMargin'].Add(categoryDivisionsInfoSchema(scrpl_NetProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_AdvertisingOnLine'].Add(categoryDivisionsInfoSchema(scrpl_AdvertisingOnLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_AdvertisingOffLine'].Add(categoryDivisionsInfoSchema(scrpl_AdvertisingOffLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_TradeSupport'].Add(categoryDivisionsInfoSchema(scrpl_TradeSupport, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));

      oJsonFile.A['scrpl_eMallCommission'].Add(categoryDivisionsInfoSchema(scrpl_eMallCommission, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));
      oJsonFile.A['scrpl_ShippingCost'].Add(categoryDivisionsInfoSchema(scrpl_ShippingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID]));

    end;


    //P&L per brand in B&M and onLine
    oJsonFile.O['scrb_Sales'] := SA([]);                                
    oJsonFile.O['scrb_SalesChange'] := SA([]);                          
    oJsonFile.O['scrb_SalesShareInCategory'] := SA([]); 
    oJsonFile.O['scrb_CostOfGoodsSold'] := SA([]);                      
    oJsonFile.O['scrb_DiscontinuedGoodsCost'] := SA([]);                
    oJsonFile.O['scrb_InventoryHoldingCost'] := SA([]);                 
    oJsonFile.O['scrb_GrossProfit'] := SA([]);
    oJsonFile.O['scrb_GrossProfitChange'] := SA([]);

    oJsonFile.O['scrb_GrossProfitMargin'] := SA([]);
    oJsonFile.O['scrb_GrossProfitShareInCategory'] := SA([]);

    oJsonFile.O['scrb_TradeAndMarketing'] := SA([]);                    
    oJsonFile.O['scrb_AdvertisingOnLine'] := SA([]);                    
    oJsonFile.O['scrb_AdvertisingOffLine'] := SA([]);                   
    oJsonFile.O['scrb_TradeAndMarketingAsPercentageOfSales'] := SA([]); 
    oJsonFile.O['scrb_TradeAndMarketingShareInCategory'] := SA([]);     
    oJsonFile.O['scrb_GeneralExpenses'] := SA([]);                      
    oJsonFile.O['scrb_Amortisation'] := SA([]);                         
    oJsonFile.O['scrb_OperatingProfit'] := SA([]);                      
    oJsonFile.O['scrb_OperatingProfitChange'] := SA([]);                
    oJsonFile.O['scrb_OperatingProfitMargin'] := SA([]);                
    oJsonFile.O['scrb_OperatingProfitShareInCategory'] := SA([]);       
    oJsonFile.O['scrb_Interest'] := SA([]);                             
    oJsonFile.O['scrb_Taxes'] := SA([]);                                
    oJsonFile.O['scrb_ExceptionalItems'] := SA([]);                     
    oJsonFile.O['scrb_NetProfit'] := SA([]);                            
    oJsonFile.O['scrb_NetProfitChange'] := SA([]);                      
    oJsonFile.O['scrb_NetProfitMargin'] := SA([]);                      
    oJsonFile.O['scrb_NetProfitShareInCategory'] := SA([]);     

    oJsonFile.O['scrb_MaterialCosts'] := SA([]);
    oJsonFile.O['scrb_TradeSupport'] := SA([]);

    oJsonFile.O['scrb_eMallCommission'] := SA([]);
    oJsonFile.O['scrb_ShippingCost'] := SA([]);

    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandCount := Low(TProBrands) to High(TProBrands) do
        begin
          //Check if Brand exist
          if currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName <> '' then
          begin
            oJsonFile.A['scrb_Sales'].Add( brandInfoSchema(scrb_Sales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_SalesChange'].Add( brandInfoSchema(scrb_SalesChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_SalesShareInCategory'].Add( brandInfoSchema(scrb_SalesShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_CostOfGoodsSold'].Add( brandInfoSchema(scrb_CostOfGoodsSold, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_DiscontinuedGoodsCost'].Add( brandInfoSchema(scrb_DiscontinuedGoodsCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_InventoryHoldingCost'].Add( brandInfoSchema(scrb_InventoryHoldingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_MaterialCosts'].Add( brandInfoSchema(scrb_MaterialCosts, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_TradeAndMarketing'].Add( brandInfoSchema(scrb_TradeAndMarketing, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_AdvertisingOnLine'].Add( brandInfoSchema(scrb_AdvertisingOnLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_AdvertisingOffLine'].Add( brandInfoSchema(scrb_AdvertisingOffLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_TradeAndMarketingAsPercentageOfSales'].Add( brandInfoSchema(scrb_TradeAndMarketingAsPercentageOfSales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_TradeAndMarketingShareInCategory'].Add( brandInfoSchema(scrb_TradeAndMarketingShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_GeneralExpenses'].Add( brandInfoSchema(scrb_GeneralExpenses, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_Amortisation'].Add( brandInfoSchema(scrb_Amortisation, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_OperatingProfit'].Add( brandInfoSchema(scrb_OperatingProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_OperatingProfitChange'].Add( brandInfoSchema(scrb_OperatingProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_OperatingProfitMargin'].Add( brandInfoSchema(scrb_OperatingProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_OperatingProfitShareInCategory'].Add( brandInfoSchema(scrb_OperatingProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_Interest'].Add( brandInfoSchema(scrb_Interest, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_Taxes'].Add( brandInfoSchema(scrb_Taxes, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_ExceptionalItems'].Add( brandInfoSchema(scrb_ExceptionalItems, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_NetProfit'].Add( brandInfoSchema(scrb_NetProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_NetProfitChange'].Add( brandInfoSchema(scrb_NetProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_NetProfitMargin'].Add( brandInfoSchema(scrb_NetProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_NetProfitShareInCategory'].Add( brandInfoSchema(scrb_NetProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );

            oJsonFile.A['scrb_GrossProfit'].Add( brandInfoSchema(scrb_GrossProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_GrossProfitChange'].Add( brandInfoSchema(scrb_GrossProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_GrossProfitMargin'].Add( brandInfoSchema(scrb_GrossProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_GrossProfitShareInCategory'].Add( brandInfoSchema(scrb_GrossProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_TradeSupport'].Add( brandInfoSchema(scrb_TradeSupport, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );


            oJsonFile.A['scrb_eMallCommission'].Add( brandInfoSchema(scrb_eMallCommission, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );
            oJsonFile.A['scrb_ShippingCost'].Add( brandInfoSchema(scrb_ShippingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount] ) );

          end;
        end;
    end;

    ////P&L per variant in B&M and onLine
    oJsonFile.O['scrv_Sales'] := SA([]);
    oJsonFile.O['scrv_SalesChange'] := SA([]);
    oJsonFile.O['scrv_SalesShareInCategory'] := SA([]);
    oJsonFile.O['scrv_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['scrv_DiscontinuedGoodsCost'] := SA([]);
    oJsonFile.O['scrv_InventoryHoldingCost'] := SA([]);
    oJsonFile.O['scrv_TradeAndMarketing'] := SA([]);
    oJsonFile.O['scrv_AdvertisingOnLine'] := SA([]);
    oJsonFile.O['scrv_AdvertisingOffLine'] := SA([]);
    oJsonFile.O['scrv_TradeAndMarketingAsPercentageOfSales'] := SA([]);
    oJsonFile.O['scrv_TradeAndMarketingShareInCategory'] := SA([]);
    oJsonFile.O['scrv_GeneralExpenses'] := SA([]);
    oJsonFile.O['scrv_Amortisation'] := SA([]);
    oJsonFile.O['scrv_OperatingProfit'] := SA([]);
    oJsonFile.O['scrv_OperatingProfitChange'] := SA([]);
    oJsonFile.O['scrv_OperatingProfitMargin'] := SA([]);
    oJsonFile.O['scrv_OperatingProfitShareInCategory'] := SA([]);
    oJsonFile.O['scrv_Interest'] := SA([]);
    oJsonFile.O['scrv_Taxes'] := SA([]);
    oJsonFile.O['scrv_ExceptionalItems'] := SA([]);
    oJsonFile.O['scrv_NetProfit'] := SA([]);
    oJsonFile.O['scrv_NetProfitChange'] := SA([]);
    oJsonFile.O['scrv_NetProfitMargin'] := SA([]);
    oJsonFile.O['scrv_NetProfitShareInCategory'] := SA([]);

    oJsonFile.O['scrv_GrossProfit'] := SA([]);
    oJsonFile.O['scrv_GrossProfitChange'] := SA([]);
    oJsonFile.O['scrv_GrossProfitMargin'] := SA([]);
    oJsonFile.O['scrv_GrossProfitShareInCategory'] := SA([]);
    oJsonFile.O['scrv_MaterialCosts'] := SA([]);
    oJsonFile.O['scrv_TradeSupport'] := SA([]);

    oJsonFile.O['scrv_eMallCommission'] := SA([]);
    oJsonFile.O['scrv_ShippingCost'] := SA([]);


    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandCount := Low(TProBrands) to High(TProBrands) do
        begin
          for variantCount := Low(TOneBrandVariants) to High(TOneBrandVariants) do
          begin
            if (currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName <> '') AND (currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount].scrv_VariantName <> '') then
            begin
              oJsonFile.A['scrv_Sales'].Add( variantInfoSchema(scrv_Sales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_SalesChange'].Add( variantInfoSchema(scrv_SalesChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_SalesShareInCategory'].Add( variantInfoSchema(scrv_SalesShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_CostOfGoodsSold'].Add( variantInfoSchema(scrv_CostOfGoodsSold, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_DiscontinuedGoodsCost'].Add( variantInfoSchema(scrv_DiscontinuedGoodsCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_InventoryHoldingCost'].Add( variantInfoSchema(scrv_InventoryHoldingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_TradeAndMarketing'].Add( variantInfoSchema(scrv_TradeAndMarketing, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_AdvertisingOnLine'].Add( variantInfoSchema(scrv_AdvertisingOnLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_AdvertisingOffLine'].Add( variantInfoSchema(scrv_AdvertisingOffLine, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_TradeAndMarketingAsPercentageOfSales'].Add( variantInfoSchema(scrv_TradeAndMarketingAsPercentageOfSales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_TradeAndMarketingShareInCategory'].Add( variantInfoSchema(scrv_TradeAndMarketingShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_GeneralExpenses'].Add( variantInfoSchema(scrv_GeneralExpenses, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_Amortisation'].Add( variantInfoSchema(scrv_Amortisation, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_OperatingProfit'].Add( variantInfoSchema(scrv_OperatingProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_OperatingProfitChange'].Add( variantInfoSchema(scrv_OperatingProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_OperatingProfitMargin'].Add( variantInfoSchema(scrv_OperatingProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_OperatingProfitShareInCategory'].Add( variantInfoSchema(scrv_OperatingProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_Interest'].Add( variantInfoSchema(scrv_Interest, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_Taxes'].Add( variantInfoSchema(scrv_Taxes, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_ExceptionalItems'].Add( variantInfoSchema(scrv_ExceptionalItems, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_NetProfit'].Add( variantInfoSchema(scrv_NetProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_NetProfitChange'].Add( variantInfoSchema(scrv_NetProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_NetProfitMargin'].Add( variantInfoSchema(scrv_NetProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_NetProfitShareInCategory'].Add( variantInfoSchema(scrv_NetProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );

              oJsonFile.A['scrv_GrossProfit'].Add( variantInfoSchema(scrv_GrossProfit, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_GrossProfitChange'].Add( variantInfoSchema(scrv_GrossProfitChange, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_GrossProfitMargin'].Add( variantInfoSchema(scrv_GrossProfitMargin, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_GrossProfitShareInCategory'].Add( variantInfoSchema(scrv_GrossProfitShareInCategory, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );

              oJsonFile.A['scrv_MaterialCosts'].Add( variantInfoSchema(scrv_MaterialCosts, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_TradeSupport'].Add( variantInfoSchema(scrv_TradeSupport, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );

              oJsonFile.A['scrv_eMallCommission'].Add( variantInfoSchema(scrv_eMallCommission, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );
              oJsonFile.A['scrv_ShippingCost'].Add( variantInfoSchema(scrv_ShippingCost, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount] ) );

            end;
          end;
        end;      
    end;    

    //for debug used
    s_str := 'out' + '.json';
    writeln( oJsonFile.AsJSon(False,False));
    oJsonFile.SaveTo(s_str, true, false);
  end;

begin
    SetMultiByteConversionCodePage(CP_UTF8);
    sListData := TStringList.Create;
    sListData.Clear;

    try
      WriteLn('Content-type: application/json');

      sValue := getVariable('REQUEST_METHOD');
      if sValue='GET' then
      begin
          sValue := getVariable('QUERY_STRING');
          Explode(sValue, sListData);
          LoadConfigIni(DataDirectory, getSeminar(sListData));
          //initialise GET request parameters
          currentSeminar := getSeminar(sListData);
          currentPeriod := getPeriod(sListData);
          currentProducer := getProducerID(sListData);
          {** Read results file **}
          vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,currentResult); // read Results file

          // Read result failed
          if vReadRes <> 0 then
          begin
            Writeln('Status: 404 Not Found');
            WriteLn;
          end
          else
          //Read result successfully, generate JSON and writeln
          begin
            WriteLn;
            makeJson;            
          end;
      end;
    finally
      sListData.Free;
    end;
end.

