program RCR_inventoryVolumes;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
  rcrviv_Initial          = 100;
  rcrviv_Purchase       = 101;
  rcrviv_Sales            = 102;
  rcrviv_Discontinued     = 103;
  rcrviv_Closing          = 104;

  rcrviv_NetRetailPrice   = 105;

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
                                                                    
  function variantInfoSchema(fieldIdx : integer; catID : integer; marketID : integer; variant : TRCR_VariantInventoryVolume): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['variantName'] := variant.rcrviv_VariantName;
     jo.S['parentBrandName'] := variant.rcrviv_ParentBrandName;
     jo.I['parentCategoryID'] := catID;
     jo.I['parentCompany'] := variant.rcrviv_ParentCompany;
     jo.I['marketID'] := marketID;

     case (fieldIdx) of
       rcrviv_Initial:   begin jo.D['value'] := variant.rcrviv_Initial; end;
       rcrviv_Purchase:   begin jo.D['value'] := variant.rcrviv_Purchase; end;
       rcrviv_Sales:   begin jo.D['value'] := variant.rcrviv_Sales; end;
       rcrviv_Discontinued:   begin jo.D['value'] := variant.rcrviv_Discontinued; end;
       rcrviv_Closing:   begin jo.D['value'] := variant.rcrviv_Closing; end;
       rcrviv_NetRetailPrice: begin jo.D['value'] := variant.rcrviv_NetRetailPrice; end;
     end;
     result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    actorID,catID,brandID,VariantID, marketID : Integer;
    tempVariant : TRCR_variantInventoryVolume;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.I['retailerID'] := currentRetailer;

    oJsonFile.O['rcrviv_Initial'] := SA([]);
    oJsonFile.O['rcrviv_Purchase'] := SA([]);
    oJsonFile.O['rcrviv_Sales'] := SA([]);
    oJsonFile.O['rcrviv_Discontinued'] := SA([]);
    oJsonFile.O['rcrviv_Closing'] := SA([]);
    oJsonFile.O['rcrviv_NetRetailPrice'] := SA([]);

    for catID := Low(TCategories) to High(TCategories) do
    begin
      for marketID := Low(TMarkets) to High(TMarkets) do
      begin
        for variantID := Low(TVariants) to High(TVariants) do 
        begin
          tempVariant := currentResult.r_RetailersConfidentialReports[currentRetailer].RCR_inventoryVolumes[marketID, catID, variantID];
          if (tempVariant.rcrviv_VariantName <> '') AND (tempVariant.rcrviv_ParentBrandName <> '') then
          begin
            oJsonFile.A['rcrviv_Initial'].Add( variantInfoSchema(rcrviv_Initial, catID, marketID, tempVariant) );
            oJsonFile.A['rcrviv_Purchase'].Add( variantInfoSchema(rcrviv_Purchase, catID, marketID, tempVariant) );
            oJsonFile.A['rcrviv_Sales'].Add( variantInfoSchema(rcrviv_Sales, catID, marketID, tempVariant ));
            oJsonFile.A['rcrviv_Discontinued'].Add( variantInfoSchema(rcrviv_Discontinued, catID, marketID, tempVariant ));
            oJsonFile.A['rcrviv_Closing'].Add( variantInfoSchema(rcrviv_Closing, catID, marketID, tempVariant ));
            oJsonFile.A['rcrviv_NetRetailPrice'].Add( variantInfoSchema(rcrviv_NetRetailPrice, catID, marketID, tempVariant ));
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

