program RCR_consolidatedProfitAndLoss;

uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;


const
    rcrpl_Sales                        = 100;
    rcrpl_PromotionsCost               = 101;
    rcrpl_OtherCompensation            = 102;
    rcrpl_NetSales                     = 103;
    rcrpl_NetSalesChange               = 104;
    rcrpl_CostOfGoodsSold              = 105;
    rcrpl_ValueOfQuantityDiscounts     = 106;
    rcrpl_ValueOfPerformanceBonus      = 107;
    rcrpl_DiscontinuedGoodsCost        = 108;
    rcrpl_InventoryHoldingCost         = 109;
    rcrpl_GrossProfit                  = 110;
    rcrpl_GrossProfitChange            = 111;
    rcrpl_GrossProfitMargin            = 112;
    rcrpl_GeneralExpenses              = 113;
    rcrpl_OperatingProfit              = 114;
    rcrpl_OperatingProfitChange        = 115;
    rcrpl_OperatingProfitMargin        = 116;
    rcrpl_Interest                     = 117;
    rcrpl_Taxes                        = 118;
    rcrpl_ExceptionalItems             = 119;
    rcrpl_NetProfit                    = 120;
    rcrpl_NetProfitChange              = 121;
    rcrpl_NetProfitMargin              = 122;

    //P&L per brand in B&M and onLine
    rcrb_Sales                         = 200;
    rcrb_PromotionsCost                = 201;
    rcrb_OtherCompensation             = 202;
    rcrb_NetSales                      = 203;
    rcrb_NetSalesChange                = 204;
    rcrb_NetSalesShareInCategory       = 205;
    rcrb_CostOfGoodsSold               = 206;
    rcrb_ValueOfQuantityDiscounts      = 207;
    rcrb_ValueOfPerformanceBonus       = 208;
    rcrb_DiscontinuedGoodsCost         = 209;
    rcrb_InventoryHoldingCost          = 210;
    rcrb_GrossProfit                   = 211;
    rcrb_GrossProfitChange             = 212;
    rcrb_GrossProfitMargin             = 213;
    rcrb_GrossProfitShareInCategory    = 214;
    rcrb_GeneralExpenses               = 215;
    rcrb_OperatingProfit               = 216;
    rcrb_OperatingProfitChange         = 217;
    rcrb_OperatingProfitMargin         = 218;
    rcrb_OperatingProfitShareInCategory= 219;
    rcrb_Interest                      = 220;
    rcrb_Taxes                         = 221;
    rcrb_ExceptionalItems              = 222;
    rcrb_NetProfit                     = 223;
    rcrb_NetProfitChange               = 224;
    rcrb_NetProfitMargin               = 225;
    rcrb_NetProfitShareInCategory      = 226;

    ////P&L per variant in B&M and onLine
    rcrv_Sales                         = 300;
    rcrv_PromotionsCost                = 301;
    rcrv_OtherCompensation             = 302;
    rcrv_NetSales                      = 303;
    rcrv_NetSalesChange                = 304;
    rcrv_NetSalesShareInCategory       = 305;
    rcrv_CostOfGoodsSold               = 306;
    rcrv_ValueOfQuantityDiscounts      = 307;
    rcrv_ValueOfPerformanceBonus       = 308;
    rcrv_DiscontinuedGoodsCost         = 309;
    rcrv_InventoryHoldingCost          = 310;
    rcrv_GrossProfit                   = 311;
    rcrv_GrossProfitChange             = 312;
    rcrv_GrossProfitMargin             = 313;
    rcrv_GrossProfitShareInCategory    = 314;
    rcrv_GeneralExpenses               = 315;
    rcrv_OperatingProfit               = 316;
    rcrv_OperatingProfitChange         = 317;
    rcrv_OperatingProfitMargin         = 318;
    rcrv_OperatingProfitShareInCategory = 319;
    rcrv_Interest                      = 320;
    rcrv_Taxes                         = 321;
    rcrv_ExceptionalItems              = 322;
    rcrv_NetProfit                     = 323;
    rcrv_NetProfitChange               = 324;
    rcrv_NetProfitMargin               = 325;
    rcrv_NetProfitShareInCategory      = 326;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;

  currentPeriod : TPeriodNumber;
  currentRetailer : TBMRetailers;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function brandMarketInfoSchema(fieldIdx : integer; catID : integer; marketID : integer; brand : TRCR_OneBrand): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['brandName'] := brand.rcrb_BrandName;
     jo.I['parentCategoryID'] := catID;
     jo.I['parnetCompanyID'] := brand.rcrb_ParentCompanyID;
     jo.I['marketID'] := marketID;

     case (fieldIdx) of
        rcrb_Sales                          : begin jo.D['value'] := brand.rcrb_Sales; end;
        rcrb_PromotionsCost                 : begin jo.D['value'] := brand.rcrb_PromotionsCost; end;
        rcrb_OtherCompensation              : begin jo.D['value'] := brand.rcrb_OtherCompensation; end;
        rcrb_NetSales                       : begin jo.D['value'] := brand.rcrb_NetSales; end;
        rcrb_NetSalesChange                 : begin jo.D['value'] := brand.rcrb_NetSalesChange; end;
        rcrb_NetSalesShareInCategory        : begin jo.D['value'] := brand.rcrb_NetSalesShareInCategory; end;
        rcrb_CostOfGoodsSold                : begin jo.D['value'] := brand.rcrb_CostOfGoodsSold; end;
        rcrb_ValueOfQuantityDiscounts       : begin jo.D['value'] := brand.rcrb_ValueOfQuantityDiscounts; end;
        rcrb_ValueOfPerformanceBonus        : begin jo.D['value'] := brand.rcrb_ValueOfPerformanceBonus; end;
        rcrb_DiscontinuedGoodsCost          : begin jo.D['value'] := brand.rcrb_DiscontinuedGoodsCost; end;
        rcrb_InventoryHoldingCost           : begin jo.D['value'] := brand.rcrb_InventoryHoldingCost; end;
        rcrb_GrossProfit                    : begin jo.D['value'] := brand.rcrb_GrossProfit; end;
        rcrb_GrossProfitChange              : begin jo.D['value'] := brand.rcrb_GrossProfitChange; end;
        rcrb_GrossProfitMargin              : begin jo.D['value'] := brand.rcrb_GrossProfitMargin; end;
        rcrb_GrossProfitShareInCategory     : begin jo.D['value'] := brand.rcrb_GrossProfitShareInCategory; end;
        rcrb_GeneralExpenses                : begin jo.D['value'] := brand.rcrb_GeneralExpenses; end;
        rcrb_OperatingProfit                : begin jo.D['value'] := brand.rcrb_OperatingProfit; end;
        rcrb_OperatingProfitChange          : begin jo.D['value'] := brand.rcrb_OperatingProfitChange; end;
        rcrb_OperatingProfitMargin          : begin jo.D['value'] := brand.rcrb_OperatingProfitMargin; end;
        rcrb_OperatingProfitShareInCategory : begin jo.D['value'] := brand.rcrb_OperatingProfitShareInCategory; end;
        rcrb_Interest                       : begin jo.D['value'] := brand.rcrb_Interest; end;
        rcrb_Taxes                          : begin jo.D['value'] := brand.rcrb_Taxes; end;
        rcrb_ExceptionalItems               : begin jo.D['value'] := brand.rcrb_ExceptionalItems; end;
        rcrb_NetProfit                      : begin jo.D['value'] := brand.rcrb_NetProfit; end;
        rcrb_NetProfitChange                : begin jo.D['value'] := brand.rcrb_NetProfitChange; end;
        rcrb_NetProfitMargin                : begin jo.D['value'] := brand.rcrb_NetProfitMargin; end;
        rcrb_NetProfitShareInCategory       : begin jo.D['value'] := brand.rcrb_NetProfitShareInCategory; end;
     end;

     result := jo;
  end;

  function variantMarketInfoSchema(fieldIdx : integer; catID : integer; marketID : integer; variant : TRCR_OneVariant): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['variantName'] := variant.rcrv_VariantName;
     jo.S['parentBrandName'] := variant.rcrv_ParentBrandName;
     jo.I['parentCategoryID'] := catID;
     jo.I['parnetCompanyID'] := variant.rcrv_ParentCompanyID;
     jo.I['marketID'] := marketID;

     case (fieldIdx) of
        rcrv_Sales                          : begin jo.D['value'] := variant.rcrv_Sales; end;
        rcrv_PromotionsCost                 : begin jo.D['value'] := variant.rcrv_PromotionsCost; end;
        rcrv_OtherCompensation              : begin jo.D['value'] := variant.rcrv_OtherCompensation; end;
        rcrv_NetSales                       : begin jo.D['value'] := variant.rcrv_NetSales; end;
        rcrv_NetSalesChange                 : begin jo.D['value'] := variant.rcrv_NetSalesChange; end;
        rcrv_NetSalesShareInCategory        : begin jo.D['value'] := variant.rcrv_NetSalesShareInCategory; end;
        rcrv_CostOfGoodsSold                : begin jo.D['value'] := variant.rcrv_CostOfGoodsSold; end;
        rcrv_ValueOfQuantityDiscounts       : begin jo.D['value'] := variant.rcrv_ValueOfQuantityDiscounts; end;
        rcrv_ValueOfPerformanceBonus        : begin jo.D['value'] := variant.rcrv_ValueOfPerformanceBonus; end;
        rcrv_DiscontinuedGoodsCost          : begin jo.D['value'] := variant.rcrv_DiscontinuedGoodsCost; end;
        rcrv_InventoryHoldingCost           : begin jo.D['value'] := variant.rcrv_InventoryHoldingCost; end;
        rcrv_GrossProfit                    : begin jo.D['value'] := variant.rcrv_GrossProfit; end;
        rcrv_GrossProfitChange              : begin jo.D['value'] := variant.rcrv_GrossProfitChange; end;
        rcrv_GrossProfitMargin              : begin jo.D['value'] := variant.rcrv_GrossProfitMargin; end;
        rcrv_GrossProfitShareInCategory     : begin jo.D['value'] := variant.rcrv_GrossProfitShareInCategory; end;
        rcrv_GeneralExpenses                : begin jo.D['value'] := variant.rcrv_GeneralExpenses; end;
        rcrv_OperatingProfit                : begin jo.D['value'] := variant.rcrv_OperatingProfit; end;
        rcrv_OperatingProfitChange          : begin jo.D['value'] := variant.rcrv_OperatingProfitChange; end;
        rcrv_OperatingProfitMargin          : begin jo.D['value'] := variant.rcrv_OperatingProfitMargin; end;
        rcrv_OperatingProfitShareInCategory : begin jo.D['value'] := variant.rcrb_OperatingProfitShareInCategory; end;
        rcrv_Interest                       : begin jo.D['value'] := variant.rcrv_Interest; end;
        rcrv_Taxes                          : begin jo.D['value'] := variant.rcrv_Taxes; end;
        rcrv_ExceptionalItems               : begin jo.D['value'] := variant.rcrv_ExceptionalItems; end;
        rcrv_NetProfit                      : begin jo.D['value'] := variant.rcrv_NetProfit; end;
        rcrv_NetProfitChange                : begin jo.D['value'] := variant.rcrv_NetProfitChange; end;
        rcrv_NetProfitMargin                : begin jo.D['value'] := variant.rcrv_NetProfitMargin; end;
        rcrv_NetProfitShareInCategory       : begin jo.D['value'] := variant.rcrv_NetProfitShareInCategory; end;      
     end;

     result := jo;
  end;

  function quarterInfoSchema(fieldIdx : Integer; catID : Integer; marketID : integer; quarterInfo : TRCR_QuarterProfitAndLoss):ISuperObject;
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;

    case (fieldIdx) of
      rcrpl_Sales : begin jo.D['value'] := quarterInfo.rcrpl_Sales; end;
      rcrpl_PromotionsCost             : begin jo.D['value'] := quarterInfo.rcrpl_PromotionsCost; end;
      rcrpl_OtherCompensation          : begin jo.D['value'] := quarterInfo.rcrpl_OtherCompensation; end;
      rcrpl_NetSales                   : begin jo.D['value'] := quarterInfo.rcrpl_NetSales; end;
      rcrpl_NetSalesChange             : begin jo.D['value'] := quarterInfo.rcrpl_NetSalesChange; end;
      rcrpl_CostOfGoodsSold            : begin jo.D['value'] := quarterInfo.rcrpl_CostOfGoodsSold; end;
      rcrpl_ValueOfQuantityDiscounts   : begin jo.D['value'] := quarterInfo.rcrpl_ValueOfQuantityDiscounts; end;
      rcrpl_ValueOfPerformanceBonus    : begin jo.D['value'] := quarterInfo.rcrpl_ValueOfPerformanceBonus; end;
      rcrpl_DiscontinuedGoodsCost      : begin jo.D['value'] := quarterInfo.rcrpl_DiscontinuedGoodsCost; end;
      rcrpl_InventoryHoldingCost       : begin jo.D['value'] := quarterInfo.rcrpl_InventoryHoldingCost; end;
      rcrpl_GrossProfit                : begin jo.D['value'] := quarterInfo.rcrpl_GrossProfit; end;
      rcrpl_GrossProfitChange          : begin jo.D['value'] := quarterInfo.rcrpl_GrossProfitChange; end;
      rcrpl_GrossProfitMargin          : begin jo.D['value'] := quarterInfo.rcrpl_GrossProfitMargin; end;
      rcrpl_GeneralExpenses            : begin jo.D['value'] := quarterInfo.rcrpl_GeneralExpenses; end;
      rcrpl_OperatingProfit            : begin jo.D['value'] := quarterInfo.rcrpl_OperatingProfit; end;
      rcrpl_OperatingProfitChange      : begin jo.D['value'] := quarterInfo.rcrpl_OperatingProfitChange; end;
      rcrpl_OperatingProfitMargin      : begin jo.D['value'] := quarterInfo.rcrpl_OperatingProfitMargin; end;
      rcrpl_Interest                   : begin jo.D['value'] := quarterInfo.rcrpl_Interest; end;
      rcrpl_Taxes                      : begin jo.D['value'] := quarterInfo.rcrpl_Taxes; end;
      rcrpl_ExceptionalItems           : begin jo.D['value'] := quarterInfo.rcrpl_ExceptionalItems; end;
      rcrpl_NetProfit                  : begin jo.D['value'] := quarterInfo.rcrpl_NetProfit; end;
      rcrpl_NetProfitChange            : begin jo.D['value'] := quarterInfo.rcrpl_NetProfitChange; end;
      rcrpl_NetProfitMargin            : begin jo.D['value'] := quarterInfo.rcrpl_NetProfitMargin; end;
    end;
         
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandID,variantID,marketID : Integer;
    tempQuarterInfo : TRCR_QuarterProfitAndLoss;
    tempBrandMarketInfo : TRCR_OneBrand;
    tempVariantMarketInfo : TRCR_OneVariant;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['retailerID'] := currentRetailer;

    //Consolidated Profit & Loss statement, BMretailers (!~3)
    oJsonFile.O['rcrpl_Sales'] := SA([]);
    oJsonFile.O['rcrpl_PromotionsCost'] := SA([]);
    oJsonFile.O['rcrpl_OtherCompensation'] := SA([]);
    oJsonFile.O['rcrpl_NetSales'] := SA([]);
    oJsonFile.O['rcrpl_NetSalesChange'] := SA([]);
    oJsonFile.O['rcrpl_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['rcrpl_ValueOfQuantityDiscounts'] := SA([]);
    oJsonFile.O['rcrpl_ValueOfPerformanceBonus'] := SA([]);
    oJsonFile.O['rcrpl_DiscontinuedGoodsCost'] := SA([]);
    oJsonFile.O['rcrpl_InventoryHoldingCost'] := SA([]);
    oJsonFile.O['rcrpl_GrossProfit'] := SA([]);
    oJsonFile.O['rcrpl_GrossProfitChange'] := SA([]);
    oJsonFile.O['rcrpl_GrossProfitMargin'] := SA([]);
    oJsonFile.O['rcrpl_GeneralExpenses'] := SA([]);
    oJsonFile.O['rcrpl_OperatingProfit'] := SA([]);
    oJsonFile.O['rcrpl_OperatingProfitChange'] := SA([]);
    oJsonFile.O['rcrpl_OperatingProfitMargin'] := SA([]);
    oJsonFile.O['rcrpl_Interest'] := SA([]);
    oJsonFile.O['rcrpl_Taxes'] := SA([]);
    oJsonFile.O['rcrpl_ExceptionalItems'] := SA([]);
    oJsonFile.O['rcrpl_NetProfit'] := SA([]);
    oJsonFile.O['rcrpl_NetProfitChange'] := SA([]);
    oJsonFile.O['rcrpl_NetProfitMargin'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do
      begin
        tempQuarterInfo := currentResult.r_RetailersConfidentialReports[currentRetailer].RCR_consolidatedProfitAndLoss[marketID, catID];
        oJsonFile.A['rcrpl_Sales'].Add(quarterInfoSchema(rcrpl_Sales, catID, marketID, tempQuarterInfo));
        oJsonFile.A['rcrpl_PromotionsCost'].Add(quarterInfoSchema(rcrpl_PromotionsCost, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_OtherCompensation'].Add(quarterInfoSchema(rcrpl_OtherCompensation, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_NetSales'].Add(quarterInfoSchema(rcrpl_NetSales, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_NetSalesChange'].Add(quarterInfoSchema(rcrpl_NetSalesChange, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_CostOfGoodsSold'].Add(quarterInfoSchema(rcrpl_CostOfGoodsSold, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_ValueOfQuantityDiscounts'].Add(quarterInfoSchema(rcrpl_ValueOfQuantityDiscounts, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_ValueOfPerformanceBonus'].Add(quarterInfoSchema(rcrpl_ValueOfPerformanceBonus, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_DiscontinuedGoodsCost'].Add(quarterInfoSchema(rcrpl_DiscontinuedGoodsCost, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_InventoryHoldingCost'].Add(quarterInfoSchema(rcrpl_InventoryHoldingCost, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_GrossProfit'].Add(quarterInfoSchema(rcrpl_GrossProfit, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_GrossProfitChange'].Add(quarterInfoSchema(rcrpl_GrossProfitChange, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_GrossProfitMargin'].Add(quarterInfoSchema(rcrpl_GrossProfitMargin, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_GeneralExpenses'].Add(quarterInfoSchema(rcrpl_GeneralExpenses, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_OperatingProfit'].Add(quarterInfoSchema(rcrpl_OperatingProfit, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_OperatingProfitChange'].Add(quarterInfoSchema(rcrpl_OperatingProfitChange, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_OperatingProfitMargin'].Add(quarterInfoSchema(rcrpl_OperatingProfitMargin, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_Interest'].Add(quarterInfoSchema(rcrpl_Interest, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_Taxes'].Add(quarterInfoSchema(rcrpl_Taxes, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_ExceptionalItems'].Add(quarterInfoSchema(rcrpl_ExceptionalItems, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_NetProfit'].Add(quarterInfoSchema(rcrpl_NetProfit, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_NetProfitChange'].Add(quarterInfoSchema(rcrpl_NetProfitChange, catID, marketID, tempQuarterInfo));  
        oJsonFile.A['rcrpl_NetProfitMargin'].Add(quarterInfoSchema(rcrpl_NetProfitMargin, catID, marketID, tempQuarterInfo));  
      end;
    end;

    //P&L per brand in B&M and onLine
    oJsonFile.O['rcrb_Sales'] := SA([]);
    oJsonFile.O['rcrb_PromotionsCost'] := SA([]);
    oJsonFile.O['rcrb_OtherCompensation'] := SA([]);
    oJsonFile.O['rcrb_NetSales'] := SA([]);
    oJsonFile.O['rcrb_NetSalesChange'] := SA([]);
    oJsonFile.O['rcrb_NetSalesShareInCategory'] := SA([]);
    oJsonFile.O['rcrb_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['rcrb_ValueOfQuantityDiscounts'] := SA([]);
    oJsonFile.O['rcrb_ValueOfPerformanceBonus'] := SA([]);
    oJsonFile.O['rcrb_DiscontinuedGoodsCost'] := SA([]);
    oJsonFile.O['rcrb_InventoryHoldingCost'] := SA([]);
    oJsonFile.O['rcrb_GrossProfit'] := SA([]);
    oJsonFile.O['rcrb_GrossProfitChange'] := SA([]);
    oJsonFile.O['rcrb_GrossProfitMargin'] := SA([]);
    oJsonFile.O['rcrb_GrossProfitShareInCategory'] := SA([]);
    oJsonFile.O['rcrb_GeneralExpenses'] := SA([]);
    oJsonFile.O['rcrb_OperatingProfit'] := SA([]);
    oJsonFile.O['rcrb_OperatingProfitChange'] := SA([]);
    oJsonFile.O['rcrb_OperatingProfitMargin'] := SA([]);
    oJsonFile.O['rcrb_OperatingProfitShareInCategory'] := SA([]);
    oJsonFile.O['rcrb_Interest'] := SA([]);
    oJsonFile.O['rcrb_Taxes'] := SA([]);
    oJsonFile.O['rcrb_ExceptionalItems'] := SA([]);
    oJsonFile.O['rcrb_NetProfit'] := SA([]);
    oJsonFile.O['rcrb_NetProfitChange'] := SA([]);
    oJsonFile.O['rcrb_NetProfitMargin'] := SA([]);
    oJsonFile.O['rcrb_NetProfitShareInCategory'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do 
      begin
        for brandID := Low(TBrands) to High(TBrands) do
        begin
           tempBrandMarketInfo := currentResult.r_RetailersConfidentialReports[currentRetailer].rcr_Brands[marketId, catID, brandID];
           if ( (tempBrandMarketInfo.rcrb_BrandName <> '') and (tempBrandMarketInfo.rcrb_ShowInReport)) then
           begin
            oJsonFile.A['rcrb_Sales'].Add( brandMarketInfoSchema(rcrb_Sales, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_PromotionsCost'].Add( brandMarketInfoSchema(rcrb_PromotionsCost, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_OtherCompensation'].Add( brandMarketInfoSchema(rcrb_OtherCompensation, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetSales'].Add( brandMarketInfoSchema(rcrb_NetSales, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetSalesChange'].Add( brandMarketInfoSchema(rcrb_NetSalesChange, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetProfitChange'].Add( brandMarketInfoSchema(rcrb_NetProfitChange, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetSalesShareInCategory'].Add( brandMarketInfoSchema(rcrb_NetSalesShareInCategory, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_CostOfGoodsSold'].Add( brandMarketInfoSchema(rcrb_CostOfGoodsSold, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_ValueOfQuantityDiscounts'].Add( brandMarketInfoSchema(rcrb_ValueOfQuantityDiscounts, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_ValueOfPerformanceBonus'].Add( brandMarketInfoSchema(rcrb_ValueOfPerformanceBonus, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_DiscontinuedGoodsCost'].Add( brandMarketInfoSchema(rcrb_DiscontinuedGoodsCost, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_InventoryHoldingCost'].Add( brandMarketInfoSchema(rcrb_InventoryHoldingCost, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_GrossProfit'].Add( brandMarketInfoSchema(rcrb_GrossProfit, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_GrossProfitChange'].Add( brandMarketInfoSchema(rcrb_GrossProfitChange, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_GrossProfitMargin'].Add( brandMarketInfoSchema(rcrb_GrossProfitMargin, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_GrossProfitShareInCategory'].Add( brandMarketInfoSchema(rcrb_GrossProfitShareInCategory, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_GeneralExpenses'].Add( brandMarketInfoSchema(rcrb_GeneralExpenses, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_OperatingProfit'].Add( brandMarketInfoSchema(rcrb_OperatingProfit, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_OperatingProfitChange'].Add( brandMarketInfoSchema(rcrb_OperatingProfitChange, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_OperatingProfitMargin'].Add( brandMarketInfoSchema(rcrb_OperatingProfitMargin, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_OperatingProfitShareInCategory'].Add( brandMarketInfoSchema(rcrb_OperatingProfitShareInCategory, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_Interest'].Add( brandMarketInfoSchema(rcrb_Interest, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_Taxes'].Add( brandMarketInfoSchema(rcrb_Taxes, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_ExceptionalItems'].Add( brandMarketInfoSchema(rcrb_ExceptionalItems, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetProfit'].Add( brandMarketInfoSchema(rcrb_NetProfit, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetProfitChange'].Add( brandMarketInfoSchema(rcrb_NetProfitChange, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetProfitMargin'].Add( brandMarketInfoSchema(rcrb_NetProfitMargin, catID, marketID, tempBrandMarketInfo) );
            oJsonFile.A['rcrb_NetProfitShareInCategory'].Add( brandMarketInfoSchema(rcrb_NetProfitShareInCategory, catID, marketID, tempBrandMarketInfo) );
           end;
        end; 
      end;
    end;

    //P&L per brand in B&M and onLine
    oJsonFile.O['rcrv_Sales'] := SA([]);
    oJsonFile.O['rcrv_PromotionsCost'] := SA([]);
    oJsonFile.O['rcrv_OtherCompensation'] := SA([]);
    oJsonFile.O['rcrv_NetSales'] := SA([]);
    oJsonFile.O['rcrv_NetSalesChange'] := SA([]);
    oJsonFile.O['rcrv_NetSalesShareInCategory'] := SA([]);
    oJsonFile.O['rcrv_CostOfGoodsSold'] := SA([]);
    oJsonFile.O['rcrv_ValueOfQuantityDiscounts'] := SA([]);
    oJsonFile.O['rcrv_ValueOfPerformanceBonus'] := SA([]);
    oJsonFile.O['rcrv_DiscontinuedGoodsCost'] := SA([]);
    oJsonFile.O['rcrv_InventoryHoldingCost'] := SA([]);
    oJsonFile.O['rcrv_GrossProfit'] := SA([]);
    oJsonFile.O['rcrv_GrossProfitChange'] := SA([]);
    oJsonFile.O['rcrv_GrossProfitMargin'] := SA([]);
    oJsonFile.O['rcrv_GrossProfitShareInCategory'] := SA([]);
    oJsonFile.O['rcrv_GeneralExpenses'] := SA([]);
    oJsonFile.O['rcrv_OperatingProfit'] := SA([]);
    oJsonFile.O['rcrv_OperatingProfitChange'] := SA([]);
    oJsonFile.O['rcrv_OperatingProfitMargin'] := SA([]);
    oJsonFile.O['rcrv_OperatingProfitShareInCategory'] := SA([]);
    oJsonFile.O['rcrv_Interest'] := SA([]);
    oJsonFile.O['rcrv_Taxes'] := SA([]);
    oJsonFile.O['rcrv_ExceptionalItems'] := SA([]);
    oJsonFile.O['rcrv_NetProfit'] := SA([]);
    oJsonFile.O['rcrv_NetProfitChange'] := SA([]);
    oJsonFile.O['rcrv_NetProfitMargin'] := SA([]);
    oJsonFile.O['rcrv_NetProfitShareInCategory'] := SA([]);

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      for marketID := Low(TMarketsTotal) to High(TMarketsTotal) do 
      begin
        for brandID := Low(TBrands) to High(TBrands) do 
        begin
           tempBrandMarketInfo := currentresult.r_RetailersConfidentialReports[currentRetailer].rcr_Brands[marketId, catID, brandID];
           if ((tempBrandMarketInfo.rcrb_BrandName <> '') and (tempBrandMarketInfo.rcrb_ShowInReport)) then
           begin
             for variantID := Low(TOneBrandVariants) to high(TOneBrandVariants) do
             begin
               tempVariantMarketInfo := tempBrandMarketInfo.rcrb_Variants[variantID];
               if ((tempVariantMarketInfo.rcrv_VariantName <> '') and (tempVariantMarketInfo.rcrv_ShowInReport)) then
               begin
                  oJsonFile.A['rcrv_Sales'].Add( variantMarketInfoSchema(rcrv_Sales, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_PromotionsCost'].Add( variantMarketInfoSchema(rcrv_PromotionsCost, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_OtherCompensation'].Add( variantMarketInfoSchema(rcrv_OtherCompensation, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetSales'].Add( variantMarketInfoSchema(rcrv_NetSales, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetSalesChange'].Add( variantMarketInfoSchema(rcrv_NetSalesChange, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetProfitChange'].Add( variantMarketInfoSchema(rcrv_NetProfitChange, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetSalesShareInCategory'].Add( variantMarketInfoSchema(rcrv_NetSalesShareInCategory, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_CostOfGoodsSold'].Add( variantMarketInfoSchema(rcrv_CostOfGoodsSold, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_ValueOfQuantityDiscounts'].Add( variantMarketInfoSchema(rcrv_ValueOfQuantityDiscounts, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_ValueOfPerformanceBonus'].Add( variantMarketInfoSchema(rcrv_ValueOfPerformanceBonus, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_DiscontinuedGoodsCost'].Add( variantMarketInfoSchema(rcrv_DiscontinuedGoodsCost, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_InventoryHoldingCost'].Add( variantMarketInfoSchema(rcrv_InventoryHoldingCost, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_GrossProfit'].Add( variantMarketInfoSchema(rcrv_GrossProfit, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_GrossProfitChange'].Add( variantMarketInfoSchema(rcrv_GrossProfitChange, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_GrossProfitMargin'].Add( variantMarketInfoSchema(rcrv_GrossProfitMargin, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_GrossProfitShareInCategory'].Add( variantMarketInfoSchema(rcrv_GrossProfitShareInCategory, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_GeneralExpenses'].Add( variantMarketInfoSchema(rcrv_GeneralExpenses, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_OperatingProfit'].Add( variantMarketInfoSchema(rcrv_OperatingProfit, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_OperatingProfitChange'].Add( variantMarketInfoSchema(rcrv_OperatingProfitChange, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_OperatingProfitMargin'].Add( variantMarketInfoSchema(rcrv_OperatingProfitMargin, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_OperatingProfitShareInCategory'].Add( variantMarketInfoSchema(rcrv_OperatingProfitShareInCategory, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_Interest'].Add( variantMarketInfoSchema(rcrv_Interest, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_Taxes'].Add( variantMarketInfoSchema(rcrv_Taxes, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_ExceptionalItems'].Add( variantMarketInfoSchema(rcrv_ExceptionalItems, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetProfit'].Add( variantMarketInfoSchema(rcrv_NetProfit, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetProfitChange'].Add( variantMarketInfoSchema(rcrv_NetProfitChange, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetProfitMargin'].Add( variantMarketInfoSchema(rcrv_NetProfitMargin, catID, marketID, tempVariantMarketInfo) );
                  oJsonFile.A['rcrv_NetProfitShareInCategory'].Add( variantMarketInfoSchema(rcrv_NetProfitShareInCategory, catID, marketID, tempVariantMarketInfo) );                 

               end;               
             end;
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
          currentRetailer := getRetailerID(sListData);
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

