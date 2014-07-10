program MR_salesByChannel;


uses
  SysUtils,Windows,Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles,
  CgiCommonFunction;

const
      vcd_AbsoluteValue    = 100;
      vcd_ValueChange      = 101;
      vcd_AbsoluteVolume   = 102;
      vcd_VolumeChange     = 103;
      bocd_AbsoluteValue    = 104;
      bocd_ValueChange      = 105;
      bocd_AbsoluteVolume   = 106;
      bocd_VolumeChange     = 107;

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

  function ownerInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; owner : TBrandOwnerChannelDetails):ISuperObject;
  var 
    jo : ISuperObject;
    accountID : integer;
  begin
    jo := SO;
    jo.S['ownerID'] := owner.bocd_CompanyID;
    jo.I['categoryID'] := catID;
    jo.I['marketID'] := marketID;
    
    jo.O['value'] := SA([]);
    for accountID := Low(TAccountsTotal) to High(TAccountsTotal) do 
    begin
      case (fieldIdx) of
        bocd_AbsoluteValue     : begin jo.A['value'].D[accountID-1] := variant.bocd_AbsoluteValue[accountID]; end;
        bocd_ValueChange       : begin jo.A['value'].D[accountID-1] := variant.bocd_ValueChange[accountID]; end;
        bocd_AbsoluteVolume    : begin jo.A['value'].D[accountID-1] := variant.bocd_AbsoluteVolume[accountID]; end;
        bocd_VolumeChange      : begin jo.A['value'].D[accountID-1] := variant.bocd_VolumeChange[accountID]; end;
      end;    
    end;

    result := jo;
  end;

  function variantInfoSchema(fieldIdx : Integer; catID : Integer; marketID : Integer; variant : TVariantChannelDetails):ISuperObject;
  var 
    jo : ISuperObject;
    accountID : integer;
  begin
    jo := SO;
    jo.S['variantName'] := variant.vcd_VariantName;
    jo.S['parentBrandName'] := variant.vcd_ParentBrandName;
    jo.I['parentCategoryID'] := catID;
    jo.I['parentCompanyID'] := variant.vcd_ParentCompanyID;
    jo.I['marketID'] := marketID;
    
    jo.O['value'] := SA([]);
    for accountID := Low(TAccountsTotal) to High(TAccountsTotal) do 
    begin
      case (fieldIdx) of
        vcd_AbsoluteValue     : begin jo.A['value'].D[accountID-1] := variant.vcd_AbsoluteValue[accountID]; end;
        vcd_ValueChange       : begin jo.A['value'].D[accountID-1] := variant.vcd_ValueChange[accountID]; end;
        vcd_AbsoluteVolume    : begin jo.A['value'].D[accountID-1] := variant.vcd_AbsoluteVolume[accountID]; end;
        vcd_VolumeChange      : begin jo.A['value'].D[accountID-1] := variant.vcd_VolumeChange[accountID]; end;
      end;    
    end;

    result := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
    catID,brandCount,variantCount,marketID : Integer;
    tempVariant : TVariantChannelDetails;
    tempOwner : TBrandOwnerChannelDetails;
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
            tempVariant := currentResult.r_MarketResearch.mr_SalesByChannel[ marketID,catID].mrsbc_VariantsDetails[brandCount, variantCount];
            if (tempVariant.vcd_Shown = true)
            AND (tempVariant.vcd_VariantName <> '')
            AND (tempVariant.vcd_ParentBrandName <> '') then
            begin
                oJsonFile.A['absoluteValue'].Add( variantInfoSchema(vcd_absoluteValue, catID, marketID, tempVariant) );
                oJsonFile.A['absoluteVolume'].Add( variantInfoSchema(vcd_absoluteVolume, catID, marketID, tempVariant ));
                oJsonFile.A['valueChange'].Add( variantInfoSchema(vcd_valueChange, catID, marketID, tempVariant ));
                oJsonFile.A['volumeChange'].Add( variantInfoSchema(vcd_volumeChange, catID, marketID, tempVariant ));
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
          tempOwner := currentResult.r_MarketResearch.mr_SalesByChannel[marketID,catID].mrsbc_BrandOwnersDetails[ownerID];
          oJsonFile.A['owner_absoluteValue'].Add( ownerInfoSchema(bocd_absoluteValue, catID, marketID, tempOwner) );
          oJsonFile.A['owner_absoluteVolume'].Add( ownerInfoSchema(bocd_absoluteVolume, catID, marketID, tempOwner ));
          oJsonFile.A['owner_valueChange'].Add( ownerInfoSchema(bocd_valueChange, catID, marketID, tempOwner ));
          oJsonFile.A['owner_volumeChange'].Add( ownerInfoSchema(bocd_volumeChange, catID, marketID, tempOwner ));
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