program MR_awarenessEvolution;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
      vsd_AbsoluteValue    = 100;
      vsd_ValueChange      = 101;
      vsd_AbsoluteVolume   = 102;
      vsd_VolumeChange     = 103;
      bosd_AbsoluteValue    = 104;
      bosd_ValueChange      = 105;
      bosd_AbsoluteVolume   = 106;
      bosd_VolumeChange     = 107;         

var
  DataDirectory : string;
  sListData: tStrings;
  sValue : string;
  currentResult : TAllResults;
  currentPeriod : TPeriodNumber;
  currentProducer : TAllProducers;
  currentRetailer : TBMRetailers;
  currentSeminar : string;
  vReadRes : Integer;
  oJsonFile : ISuperObject;

  function ShopperInfoSchema(fieldIdx: Integer; shopper : TShoppersKind; segmentID : integer; variant : TVariantCrossSegmentDetails):ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : string;
  //  segmentID : integer;
  begin
    jo := SO;
    case Shopper of
        BMS         : ShopperStr := 'BMS'; 
        NETIZENS    : ShopperStr := 'NETIZENS';   
        MIXED       : ShopperStr := 'MIXED';  
        ALLSHOPPERS : ShopperStr := 'ALLSHOPPERS'; 
    else
        ShopperStr  := 'wrong';
    end;

    jo.S['shopperKind'] := ShopperStr;
    case (fieldIdx) of
      vsd_AbsoluteValue     : begin jo.D['value'] := variant.vsd_AbsoluteValue[segmentID, shopper]; end;
      vsd_ValueChange       : begin jo.D['value'] := variant.vsd_ValueChange[segmentID, shopper]; end;
      vsd_AbsoluteVolume    : begin jo.D['value'] := variant.vsd_AbsoluteVolume[segmentID, shopper]; end;
      vsd_VolumeChange      : begin jo.D['value'] := variant.vsd_VolumeChange[segmentID, shopper]; end;
    end;

    result := jo;
  end;

  function segmentInfoSchema(fieldIdx: Integer; segmentID : Integer; variant : TVariantCrossSegmentDetails):ISuperObject;
  var
    jo : ISuperObject;
    Shopper : TShoppersKind;
  begin
    jo := SO;
    jo.I['segmentID'] := segmentID;
    jo.O['shopperInfo'] := SA([]);
    for Shopper := Low(TShoppersKind) to High(TShoppersKind) do
      jo.A['shopperInfo'].Add( ShopperInfoSchema(fieldIdx, Shopper, segmentID, variant) );

    result := jo;
  end;

  function variantInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; variant : TVariantCrossSegmentDetails):ISuperObject;
  var 
    jo : ISuperObject;
    segmentID : integer;
  begin
    jo := SO;
    jo.S['variantName'] := variant.vsd_VariantName;
    jo.S['parentBrandName'] := variant.vsd_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.vsd_ParentCompanyID;
    jo.I['marketID'] := marketID;
    
    jo.O['segmentInfo'] := SA([]);
    for segmentID := Low(TSegmentsTotal) to High(TSegmentsTotal) do 
    begin
      jo.A['segmentInfo'].Add( segmentInfoSchema(fieldIdx, segmentID, variant) );
    end;

    result := jo;
  end;

function ownerShopperInfoSchema(fieldIdx: Integer; shopper : TShoppersKind; segmentID : integer; owner : TBrandOwnerCrossSegmentDetails):ISuperObject;
  var
    jo : ISuperObject;
    ShopperStr : string;
   // segmentID : integer;
  begin
    jo := SO;
    case Shopper of
        BMS         : ShopperStr := 'BMS'; 
        NETIZENS    : ShopperStr := 'NETIZENS';   
        MIXED       : ShopperStr := 'MIXED';  
        ALLSHOPPERS : ShopperStr := 'ALLSHOPPERS'; 
    else
        ShopperStr  := 'wrong';
    end;

    jo.S['shopperKind'] := ShopperStr;
    case (fieldIdx) of
      bosd_AbsoluteValue     : begin jo.D['value'] := owner.bosd_AbsoluteValue[segmentID, shopper]; end;
      bosd_ValueChange       : begin jo.D['value'] := owner.bosd_ValueChange[segmentID, shopper]; end;
      bosd_AbsoluteVolume    : begin jo.D['value'] := owner.bosd_AbsoluteVolume[segmentID, shopper]; end;
      bosd_VolumeChange      : begin jo.D['value'] := owner.bosd_VolumeChange[segmentID, shopper]; end;
    end;

    result := jo;
  end;

  function ownerSegmentInfoSchema(fieldIdx: Integer; segmentID : Integer; owner : TBrandOwnerCrossSegmentDetails):ISuperObject;
  var
    jo : ISuperObject;
    Shopper : TShoppersKind;
  begin
    jo := SO;
    jo.I['segmentID'] := segmentID;
    jo.O['shopperInfo'] := SA([]);
    for Shopper := Low(TShoppersKind) to High(TShoppersKind) do
      jo.A['shopperInfo'].Add( ownerShopperInfoSchema(fieldIdx, Shopper, segmentID, owner) );

    result := jo;
  end;

  function ownerInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; owner : TBrandOwnerCrossSegmentDetails):ISuperObject;
  var  
    jo : ISuperObject;
    segmentID : integer;
  begin
    jo := SO;
    jo.I['ownerID'] := owner.bosd_VariantID;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;
    
    jo.O['segmentInfo'] := SA([]);
    for segmentID := Low(TSegmentsTotal) to High(TSegmentsTotal) do
    begin
      jo.A['segmentInfo'].Add( ownerSegmentInfoSchema(fieldIdx, segmentID, owner) );
    end;
    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,brandCount,variantCount,marketID,ownerID : Integer;
    tempVariant : TVariantCrossSegmentDetails;
    tempOwner : TBrandOwnerCrossSegmentDetails;
  begin
    oJsonFile := SO;
    oJsonFile.S['seminar'] := currentSeminar;
    oJsonFile.I['period'] := currentPeriod;

    oJsonFile.O['absoluteValue'] := SA([]);
    oJsonFile.O['valueChange'] := SA([]);
    oJsonFile.O['absoluteVolume'] := SA([]);
    oJsonFile.O['volumeChange'] := SA([]);

    oJsonFile.O['owner_absoluteValue'] := SA([]);
    oJsonFile.O['owner_valueChange'] := SA([]);
    oJsonFile.O['owner_absoluteVolume'] := SA([]);
    oJsonFile.O['owner_volumeChange'] := SA([]);           

    for catID :=  Low(TCategories) to High(TCategories) do 
    begin
      for brandCount := Low(TBrands) to High(TBrands) do 
      begin
        for variantCount := Low(TOneBrandVariants) to High(TOneBrandVariants) do
        begin
          for marketID := Low(TMarkets) to High(TMarkets) do
          begin
            tempVariant := currentResult.r_MarketResearch.mr_SalesByCrossSegment[marketID,catID].mrcs_VariantsDetails[brandCount, variantCount];
            if (tempVariant.vsd_Shown = true)
            AND (tempVariant.vsd_VariantName <> '')
            AND (tempVariant.vsd_ParentBrandName <> '') then
            begin
                oJsonFile.A['absoluteValue'].Add( variantInfoSchema(vsd_absoluteValue, catID, marketID, tempVariant) );
                oJsonFile.A['absoluteVolume'].Add( variantInfoSchema(vsd_absoluteVolume, catID, marketID, tempVariant ));
                oJsonFile.A['valueChange'].Add( variantInfoSchema(vsd_valueChange, catID, marketID, tempVariant ));
                oJsonFile.A['volumeChange'].Add( variantInfoSchema(vsd_volumeChange, catID, marketID, tempVariant ));
            end;            
          end;
        end;      
      end;          
    end;

    for catID :=  Low(TCategories) to High(TCategories) do 
    begin
      for marketID := Low(TMarkets) to High(TMarkets) do
      begin
        for ownerID := Low(TBrandOwners) to High(TBrandOwners) do
        begin
          tempOwner := currentResult.r_MarketResearch.mr_SalesByCrossSegment[marketID,catID].mrcs_BrandOwnersDetails[ownerID];
          oJsonFile.A['owner_absoluteValue'].Add( ownerInfoSchema(bosd_absoluteValue, catID, marketID, tempOwner) );
          oJsonFile.A['owner_absoluteVolume'].Add( ownerInfoSchema(bosd_absoluteVolume, catID, marketID, tempOwner ));
          oJsonFile.A['owner_valueChange'].Add( ownerInfoSchema(bosd_valueChange, catID, marketID, tempOwner ));
          oJsonFile.A['owner_volumeChange'].Add( ownerInfoSchema(bosd_volumeChange, catID, marketID, tempOwner ));
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
end.2