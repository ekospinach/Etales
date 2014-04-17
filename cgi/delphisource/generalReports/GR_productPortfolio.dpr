program GR_productPortfolio;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;

  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function variantInfoSchema(variant : TVariantCharacteristics):ISuperObject;
  var 
    jo : ISuperObject;
  begin
    jo := SO;
    jo.I['varID'] := variant.vc_VariantID;
    jo.S['varName'] := variant.vc_VariantName;
    jo.I['parentBrandID'] := variant.vc_ParentBrandID;
    jo.S['parentBrandName'] := variant.vc_ParentBrandName;

    case (variant.vc_PackFormat) of
      ECONOMY:  jo.S['packFormat'] := 'ECONOMY';
      STANDARD: jo.S['packFormat'] := 'STANDARD';
      PREMIUM: jo.S['packFormat'] := 'PREMIUM';
      else
        jo.S['packFormat'] := 'Wrong';
      end;

    jo.O['vc_composition'] := SA([]);
    jo.A['vc_composition'].D[0] := variant.vc_Composition[1];
    jo.A['vc_composition'].D[1] := variant.vc_Composition[2];
    jo.A['vc_composition'].D[2] := variant.vc_Composition[3];

    result := jo;
  end;

  function categoryInfoSchema(catID : Integer; binaryReport : TGR_ProductPortfolio):ISuperObject;
  var
    jo : ISuperObject;
    owner, brand, variant : Integer;
    variantInfo : TVariantCharacteristics;
  begin
    jo := SO;
    jo.I['categoryID'] := catID;
    jo.O['variantInfo'] := SA([]);

    for owner := Low(TBrandOwners) to High(TBrandOwners) do
    begin
      for brand := Low(TProBrands) to High(TProBrands) do
      begin
        for variant := Low(TOneBrandVariants) to High(TOneBrandVariants) do 
        begin
          variantInfo := binaryReport.grpp_VariantsCharacteristics[catID, owner, brand, variant];
          if(variantInfo.vc_VariantName <> '') then
          begin
            jo.A['variantInfo'].add( variantInfoSchema( variantInfo ));
          end;                        
        end;    
      end;  
    end;

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID : Integer;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;
    oJsonFile.O['categoryInfo'] := SA([]);
    for catID := Low(TCategories) to High(TCategories) do
      oJsonFile.A['categoryInfo'].Add( categoryInfoSchema(catID, currentResult.r_GeneralReport.GR_productPortfolio) );

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
          // initialize globals
          currentSeminar := getSeminar(sListData);
          currentPeriod := getPeriod(sListData);
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

