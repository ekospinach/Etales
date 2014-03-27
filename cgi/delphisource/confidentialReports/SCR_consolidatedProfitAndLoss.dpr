program SCR_consolidatedProfitAndLoss;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

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

  function variantInfoSchema(brandName : String; variantName : String; parentCategoryID : integer; field : array[TProducerDevisions] of single):
  var 
    jo : ISuperObject;
  begin    
    jo := SO;
    jo.S['variantName'] := variantName;
    jo.S['parentBrandName'] := brandName;
    jo.I['parentCategoryID'] := parentCategoryID;
    jo.O['value'] := SA([]);
    jo.A['value'].D[0] := field[TRADITIONAL];
    jo.A['value'].D[1] := field[INTERNET];
    jo.A['value'].D[2] := field[TOTAL];

    result := jo;
  end;

  function brandInfoSchema(brandName : String; parentCategoryID : integer; field : array[TProducerDevisions] of single):
  var 
    jo : ISuperObject;
  begin    
    jo := SO;
    jo.S['brandName'] := brandName;
    jo.I['parentCategoryID'] := parentCategoryID;
    jo.O['value'] := SA([]);
    jo.A['value'].D[0] := field[TRADITIONAL];
    jo.A['value'].D[1] := field[INTERNET];
    jo.A['value'].D[2] := field[TOTAL];

    result := jo;
  end;

  function categoryInfoSchema(catID : Integer; traditional : single; internet : single; total : single):
  var
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['value'] := SA([]);
    jo.A['value'].D[0] := traditional;
    jo.A['value'].D[1] := internet;
    jo.A['value'].D[2] := total;
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID : Integer;
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

    for catID := Low(TCategoriesTotal) to High(TCategoriesTotal) do
    begin
      oJsonFile.A['scrpl_Sales'].Add( categoryInfoSchema(catID, currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID,TRADITIONAL].scrpl_Sales,
                                      categoryInfoSchema(catID, currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID,INTERNET].scrpl_Sales,
                                      categoryInfoSchema(catID, currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_ConsolidatedProfitAndLoss[catID,TOTAL].scrpl_Sales,) );
      {--
      
      ...Need test with binary file first...

      --}
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

    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandCount := Low(TProBrands) to High(TProBrands) do
        begin
          if currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName <> '' then
          begin
            oJsonFile.A['scrb_Sales'].Add( brandInfoSchema(currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName, catID, currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_Sales) );
            {--
            
            ...Need test with binary file first...

            --}              
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
    oJsonFile.O['scrv_GrossProfit'] := SA([]);
    oJsonFile.O['scrv_GrossProfitChange'] := SA([]);
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

    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandCount := Low(TProBrands) to High(TProBrands) do
        begin
          for variantCount := Low(TOneBrandVariants) to High(TOneBrandVariants) do
          begin
            if (currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName <> '') AND (currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount].scrv_VariantName <> '') then
            begin
              oJsonFile.A['scrb_Sales'].Add( brandInfoSchema(currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_BrandName, 
                                                             currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount].scrv_VariantName,
                                                             catID, 
                                                             currentResult.r_SuppliersConfidentiaReports[currentProducer].scr_Brands[catID, brandCount].scrb_Variants[variantCount].scrv_Sales );
            {--
            
            ...Need test with binary file first...

            --}                            
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

