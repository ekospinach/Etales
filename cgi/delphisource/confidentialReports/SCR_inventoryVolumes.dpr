program SCR_inventoryVolumes;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
  scrviv_Initial          = 100;
  scrviv_Production       = 101;
  scrviv_Sales            = 102;
  scrviv_Discontinued     = 103;
  scrviv_Closing          = 104;

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

  // Input data structure:
  // TSCR_VariantInventoryVolume =
  //   record
  //     scrviv_VariantID        : TVariantID;
  //     scrviv_VariantName      : TVariantName;
  //     scrviv_ParentBrandID    : TBrandID;
  //     scrviv_ParentBrandName  : TBrandName;
  //     scrviv_Initial          : array[TProducerDivisions] of single;
  //     scrviv_Production       : single;
  //     scrviv_Sales            : array[TProducerDivisions] of single;
  //     scrviv_Discontinued     : single;
  //     scrviv_Closing          : array[TProducerDivisions] of single;
  //   end;
  function variantInfoSchema(fieldIdx : integer; catID : integer; variant : TSCR_VariantInventoryVolume): ISuperObject;
  var
     jo : ISuperObject;
  begin
     jo := SO;
     jo.S['variantName'] := variant.scrviv_VariantName;
     jo.S['parentBrandName'] := variant.scrviv_ParentBrandName;
     jo.I['parentCategoryID'] := catID;
     jo.O['value'] := SA([]);     
     case (fieldIdx) of
       scrviv_Initial:   begin jo.A['value'].D[0] := variant.scrviv_Initial[TRADITIONAL];    jo.A['value'].D[1] := variant.scrviv_Initial[INTERNET];    jo.A['value'].D[2] := variant.scrviv_Initial[CORPORATE]; end;
       scrviv_Production:   begin jo.A['value'].D[0] := 0;    jo.A['value'].D[1] := 0;    jo.A['value'].D[2] := variant.scrviv_Production; end;
       scrviv_Sales:   begin jo.A['value'].D[0] := variant.scrviv_Sales[TRADITIONAL];    jo.A['value'].D[1] := variant.scrviv_Sales[INTERNET];    jo.A['value'].D[2] := variant.scrviv_Sales[CORPORATE]; end;
       scrviv_Discontinued:   begin jo.A['value'].D[0] := 0;    jo.A['value'].D[1] := 0;    jo.A['value'].D[2] := variant.scrviv_Discontinued; end;
       scrviv_Closing:   begin jo.A['value'].D[0] := variant.scrviv_Closing[TRADITIONAL];    jo.A['value'].D[1] := variant.scrviv_Closing[INTERNET];    jo.A['value'].D[2] := variant.scrviv_Closing[CORPORATE]; end;
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

    oJsonFile.O['scrviv_Initial'] := SA([]);
    oJsonFile.O['scrviv_Production'] := SA([]);
    oJsonFile.O['scrviv_Sales'] := SA([]);
    oJsonFile.O['scrviv_Discontinued'] := SA([]);
    oJsonFile.O['scrviv_Closing'] := SA([]);

    for catID := Low(TCategories) to High(TCategories) do
    begin
        for brandCount := Low(TProBrands) to High(TProBrands) do
        begin
          for variantCount := Low(TOneBrandVariants) to High(TOneBrandVariants) do
          begin
            if (currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount].scrviv_VariantName <> '') AND (currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount].scrviv_ParentBrandName <> '') then
            begin
              oJsonFile.A['scrviv_Initial'].Add( variantInfoSchema(scrviv_Initial, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount] ) );
              oJsonFile.A['scrviv_Production'].Add( variantInfoSchema(scrviv_Production, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount] ) );
              oJsonFile.A['scrviv_Sales'].Add( variantInfoSchema(scrviv_Sales, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount] ) );
              oJsonFile.A['scrviv_Discontinued'].Add( variantInfoSchema(scrviv_Discontinued, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount] ) );
              oJsonFile.A['scrviv_Closing'].Add( variantInfoSchema(scrviv_Closing, catID, currentResult.r_SuppliersConfidentialReports[currentProducer].scr_InventoryVolumes[catID, brandCount, variantCount] ) );
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

