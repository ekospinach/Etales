program variantHistoryInfo;

//Original :: DelphiCGI Developed by Andrea Russo - Italy
//email: andrusso@yahoo.com

{$IFNDEF LINUX}
  {$IFDEF FPC}
    {$IFDEF UNIX}
      {$DEFINE LINUX}
    {$ENDIF}
  {$ENDIF}
{$ENDIF}

{$IFDEF FPC}
 {$mode objfpc}{$H+}
{$ELSE}
 {$APPTYPE CONSOLE}
{$ENDIF}

uses
  SysUtils,

  {$IFDEF LINUX}
    {$IFDEF FPC}
      dos,
    {$ELSE}
      Libc,
    {$ENDIF}
  {$ELSE}
    Windows,
  {$ENDIF}
  Classes, superobject, HCD_SystemDefinitions, System.TypInfo;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Common_Types.INC'}
{$I 'ET0_Results_Types.INC'}
{$I 'ET0_FILES_NAMES.INC'}

const
  DecisionFileName = 'Negotiations.';
  dummyNo = 1;
  DataDirectory = 'C:\E-project\ecgi\';
  dummySeminar = 'ROUND1';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

var
   i: integer;
   sDati : string;
   sListData: tStrings;
   bUpload: boolean;
   sValue : string;
   iSize : integer;

   currentResult : TAllResults;
   currentPeriod : TPeriodNumber;
   currentSeminar : string;
   vReadRes : Integer;

   oJsonFile : ISuperObject;
   sFile  : string;

   function getVariable(name:string):string;
   {$IFNDEF LINUX}
     var
       Buffer : array [0..2047] of char;
   {$ENDIF}
   begin
    {$IFDEF LINUX}
      result := getenv(PChar(Name)); // or Unix/Linux with SysUtils.GetEnvironmentVariable(Name)
    {$ELSE}
      Buffer := '';
      GetEnvironmentVariable(PChar(Name), Buffer, SizeOf(Buffer));
      Result := Buffer;
    {$ENDIF}
   end;

   procedure WriteAllEnvironVariables;
   var
   {$IFDEF LINUX}
     Env : PPChar;
   {$ELSE}
     p: pchar;
   {$ENDIF}
   begin
    WriteLn('<BR><H4>Environment variables</H4>');
    WriteLn('<TABLE bgcolor="#FFCC99"  border="1" cellspacing="1" cellpadding="1">');

    {$IFDEF LINUX}
      Env := System.envp;
      while Assigned(Env^) do
      begin
        WriteLn('<TR><TD>'+Env^+'</TD></TR>');
        Inc(Env);
      end;
    {$ELSE}
      p := GetEnvironmentStrings;
      while strlen(p)<>0 do begin
        WriteLn('<TR><TD>'+p+'</TD></TR>');
        p:=strend(p);
        inc(p);
      end;
    {$ENDIF}

    Writeln('</TABLE>');
   end;

   Procedure Explode(sQuery: string; var Params: tStrings);
   var
    nPos : Integer;
    s : string;
   begin
      if Length(sQuery)>0 then
      begin
         nPos:=1;
         s:= sQuery;

         while nPos>0 do
         begin
           nPos := Pos('&',s);

           if nPos>0 then
             begin
               Params.Add(Copy(s,1,nPos-1));
               s := Copy(s,nPos+1,Length(s)-nPos)
             end
           else
             Params.Add(s);
         end;
      end;
   end;

   function DecodeUrl(url: string): string;
    var
      x: integer;
      ch: string;
      sVal: string;
      Buff: string;
    begin
      //Init
      Buff := '';
      x := 1;
      while x <= Length(url) do
      begin
        //Get single char
        ch := url[x];

        if ch = '+' then
        begin
          //Append space
          Buff := Buff + ' ';
        end
        else if ch <> '%' then
        begin
          //Append other chars
          Buff := Buff + ch;
        end
        else
        begin
          //Get value
          sVal := Copy(url, x + 1, 2);
          //Convert sval to int then to char
          Buff := Buff + char(StrToInt('$' + sVal));
          //Inc counter by 2
          Inc(x, 2);
        end;
        //Inc counter
        Inc(x);
      end;
      //Return result
      Result := Buff;
    end;

    function getSeminar(const filePath : string): string; overload;
    var
      i_tmp : Integer;
    begin
      i_tmp := LastDelimiter('.',filePath) + 1;
      Result := Copy(filePath, i_tmp, 10);
    end;

    function getSeminar(): string; overload;
    begin
      Result := dummySeminar;
      if sListData.IndexOfName('seminar') <> -1 then
        Result  := sListData.Values['seminar'];
    end;

    function getPeriod(): Integer;
    begin
      Result := dummyNo;
      if sListData.IndexOfName('period') <> -1 then
         Result := StrToInt(sListData.Values['period']);
    end;

    function getRetailer(): Integer;
    begin
      Result  := dummyNo;
      if sListData.IndexOfName('retailerID') <> -1 then
        Result := StrToInt(sListData.Values['retailerID']);
      if sListData.IndexOfName('retailerid') <> -1 then
        Result  := StrToInt(sListData.Values['retailerid']);
    end;

    function getFileName(): AnsiString;
    var
      partOne, partNum, seminar : string;
    begin
      if sListData.IndexOfName('filepath') <> -1 then
        begin
          Result := DecodeUrl(sListData.Values['filepath']);
          Exit;
        end;
      partOne := 'Retailer ';
      partNum := IntToStr(getRetailer);
      seminar := getSeminar;
      Result := DataDirectory + partOne + partNum + DecisionFileName + dummySeminar;
    end;

   function getJson(): ISuperObject;
   var
      vStr  : string;
      jo  : ISuperObject;
   begin
      vStr := '';
      jo := SO;

      if sListData.IndexOfName('jsonData') <> -1 then
          vStr := DecodeUrl(sListData.Values['jsonData'])
      else
        Writeln('Error 400' + #13 + #10 + 'No JSON data provided');

      jo  := SO(vStr);

      Result  := jo;
   end;

    Function ReadResults(PeriodNumber : TPeriodNumber; SeminarCode : ansistring; DataDirectory : Ansistring; var OnePeriodResults : TAllResults ) : Integer;
    var
      ResultsFile : file of TAllResults;
      FileName    :  String;
      TempResult  : Integer;

    begin
      FileName := DataDirectory +  ResultsFileName + SeminarCode;

      if FileExists(FileName) = false then
      begin
          Writeln('result file does not exist:' + FileName);
          Result := -1;
          exit;
      end;

      try
          try
            AssignFile( ResultsFile, FileName);
            Reset( ResultsFile);
            //if ( PeriodNumber < HistoryEnd ) then PeriodNumber := HistoryEnd;
            //ShowMessage('start position:' + IntToStr(PeriodNumber - HistoryStart));
            Seek( ResultsFile, PeriodNumber - HistoryStart );
            Read( ResultsFile, OnePeriodResults );
            TempResult := 0;
          except
            on E: EInOutError do
            begin
              Writeln( 'Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + FileName + #13 + #10 + E.Message );
              TempResult := E.ErrorCode;
            end;
          end;  { try }

      finally
          CloseFile( ResultsFile);
      end;

      Result := TempResult;

    end;

  function channelMarketViewSchema(var curVar: TRetailerVariantResults): ISuperObject;
  var
    jo, jt: ISuperObject;
    I,J: Integer;
  begin
    jo  := SO;
//Writeln('channelMarketViewSchema');
//rv...
//var channelMarketViewSchema = mongoose.Schema({
//    closingInventory : [{
//        volume : String,
//        unitCost : String,
//        composition : [Number]
//    }], //length : TInventoryAgesTotal(0~4)
//    currentUnitAcquisitionCost : Number, //length: TMarkets(1~2)
//    salesVolume : Number,  //length: TMarkets(1~2)
//    shelfSpace : Number,
//    marketPrice : Number,
//    netMarketPrice : Number,
//    promotionsDetails : {
//        promo_Frequency : Number, //range: 0~52
//        promo_Rate : Number //0~1
//    }
//})
    jo.O['closingInventory']  := SA([]);
    for I := Low(TInventoryAgesTotal) to High(TInventoryAgesTotal) do
      begin
        jt  := SO;
        jt.D['volume']  := curVar.rv_ClosingInventory[I].invd_Volume;
        jt.D['unitCost']  := curVar.rv_ClosingInventory[I].invd_UnitCost;
        jt.O['composition'] := SA([]);
        for J := Low(TSpecs) to High(TSpecs) do
          jt.A['composition'].I[J - 1]  := curVar.rv_ClosingInventory[I].invd_Composition[J];
        jo.A['closingInventory'].Add(jt);
      end;
    jo.D['currentUnitAcquisitionCost'] := curVar.rv_CurrentUnitAcquisitionCost;
    Writeln('inside salesVolume:'+ FloatToStr(curVar.rv_SalesVolume));
    jo.D['salesVolume'] := curVar.rv_SalesVolume;
    writeln(jo);
    jo.D['shelfSpace'] := curVar.rv_ShelfSpace;
    jo.D['marketPrice'] := curVar.rv_MarketPrice;
    jo.D['netMarketPrice']  := curVar.rv_NetMarketPrice;
    jo.I['promotionsDetails.promo_Frequency'] := curVar.rv_PromotionsDetails.promo_Frequency;
    jo.D['promotionsDetails.promo_Rate']  := curVar.rv_PromotionsDetails.promo_Rate;

    result  := jo;
  end;

  function channelViewSchema(pChannel: TAllRetailersTotal;
    pCategory: TCategoriesTotal; pBrand: TBrands;
    pVariant: TOneBrandVars): ISuperObject;
  var
    jo: ISuperObject;
  begin
    jo  := SO;
    Writeln('channelViewSchema ch ' + IntToStr(pChannel) + IntToStr(pCategory) + IntToStr(pBrand) + IntToStr(pVariant));
//var channelViewSchema = mongoose.Schema({
//    channelMarketView : [channelMarketViewSchema] //length: TMarketsTotal(1~3)
//})
    jo.O['channelMarketView'] := SA([]);
    for I := Low(TMarketsTotal) to High(TMarketsTotal) do
    begin
          Writeln('brandName: ' +  currentResult.r_Retailers[pChannel].rr_Quarters[I,pCategory].rq_BrandsResults[pBrand].rb_BrandName + ', Market:' + IntToStr(I));
           Writeln('Retailer: ' + IntToStr(pChannel));
          Writeln('VarName: ' +  currentResult.r_Retailers[pChannel].rr_Quarters[I,pCategory].rq_BrandsResults[pBrand].rb_VariantsResults[pVariant].rv_VariantName);
          Writeln('SalesVolume' + FloatToStr(currentResult.r_Retailers[pChannel].rr_Quarters[I,pCategory].rq_BrandsResults[pBrand].rb_VariantsResults[pVariant].rv_SalesVolume));
      jo.A['channelMarketView'].Add(
        channelMarketViewSchema
        (currentResult.r_Retailers[pChannel].rr_Quarters[I,pCategory].rq_BrandsResults[pBrand].rb_VariantsResults[pVariant])
         );
    end;
    result  := jo;
  end;

  function supplierChannelViewSchema(var curVar: TProducerVariantResults;
    pRet: TAllRetailersTotal): ISuperObject;
  var
    jo: ISuperObject;
  begin
//Writeln('supplierChannelViewSchema');
    jo  := SO;
//var supplierChannelViewSchema = mongoose.Schema({
//    salesVolume : [Number], // TMarketTotal(1~3)
//})
    jo.O['salesVolume'] := SA([]);
    for I := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['salesVolume'].D[I - 1]  := curVar.pv_SalesVolume[pRet, I];

    Result  := jo;
  end;

  function supplierViewSchema(var curVar: TProducerVariantResults): ISuperObject;
  var
    jo, jt: ISuperObject;
    I, J  : Integer;
  begin
    jo  := SO;
//pv...
//var supplierViewSchema = mongoose.Schema({
//    currentUnitAverageCost : Number,
//    currentPriceBM : Number,
//    currentPriceEmall : Number,
//    nextPriceBM : Number,
//    nextPriceEmall : Number,
//    composition : [Number],  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
//    productionVolume : Number,
//    initialInventory : [{
//        volume : String,
//        unitCost : String,
//        composition : [Number]
//    }], //length : TInventoryAgesTotal(0~4)
//    supplierChannelView : [supplierChannelViewSchema] //length : TAllRetailersTotal(1~5)
//})
//writeln('supplierViewSchema');
    jo.D['currentUnitAverageCost']  := curVar.pv_CurrentUnitAverageCost;
    jo.D['currentPriceBM']  := curVar.pv_CurrentPriceBM;
    jo.D['currentPriceEmall'] := curVar.pv_CurrentPriceEmall;
    jo.D['nextPriceBM'] := curVar.pv_NextPriceBM;
    jo.D['nextPriceEmall']  := curVar.pv_NextPriceEmall;
    jo.O['composition'] := SA([]);
    for I := Low(TSpecs) to High(TSpecs) do
      jo.A['composition'].I[I - 1] := curVar.pv_Composition[I];
    jo.D['productionVolume']  := curVar.pv_ProductionVolume;
    jo.O['initialInventory']  := SA([]);
    for I := Low(TInventoryAgesTotal) to High(TInventoryAgesTotal) do
      begin
        jt  := SO;
        jt.D['volume']  := curVar.pv_InitialInventory[I].invd_Volume;
        jt.D['unitCost']  := curVar.pv_InitialInventory[I].invd_UnitCost;
        jt.O['composition'] := SA([]);
        for J := Low(TSpecs) to High(TSpecs) do
          jt.A['composition'].I[J - 1]  := curVar.pv_InitialInventory[I].invd_Composition[J];
        jo.A['initialInventory'].Add(jt);
      end;
    jo.O['supplierChannelView'] := SA([]);
    for I := Low(TAllRetailersTotal) to High(TAllRetailersTotal) do
      jo.A['supplierChannelView'].Add( supplierChannelViewSchema(curVar, I) );

    Result  := jo;

  end;

  function variantHistoryInfoSchema(var curVar: TProducerVariantResults;
    pCategoryID: TCategories; pParentCompanyID: TCompanies;
    pBrand: TBrands; pBrandName: string;
    pVariant: TOneBrandVars): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
//var variantHistoryInfoSchema = mongoose.Schema({
//    period : Number,
//    seminar : String,
//    varName : String,
//    varID : Number,
//    dateOfBirth : Number, //-4~10
//    dateOfDeath : Number, //-4~10
//    parentBrandID : Number,
//    parentBrandName : String,
//    parentCatID : Number,
//    parentCompanyID : Number, //(1~9)
//    supplierView : [supplierViewSchema],
//    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
//})
//Writeln('variantHistoryInfoSchema');
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.S['varName'] := curVar.pv_VariantName;
    jo.I['varID'] := curVar.pv_VariantID;
    jo.I['dateOfBirth'] := curVar.pv_DateofBirth;
    jo.I['dateOfDeath'] := curVar.pv_DateOfDeath;
    jo.I['parentBrandID'] := curVar.pv_ParentBrandID;
    jo.S['parentBrandName'] := pBrandName;
    jo.I['parentCatID'] := pCategoryID;
    jo.I['parentCompanyID'] := pParentCompanyID;
    jo.O['supplierView']  := SA([]);
    jo.A['supplierView'].Add( supplierViewSchema(curVar) );
    jo.O['channelView'] := SA([]);
    for I := Low(TAllRetailersTotal) to High(TAllRetailersTotal) do
      jo.A['channelView'].Add( channelViewSchema(I,pCategoryID,pBrand,pVariant) );

    result  := jo;
  end;

  function collectAllVariants(): ISuperObject;
  var
    jo: ISuperObject;
    prd, cat, brn, vnt: Integer;
  begin
    jo  := SA([]);

    for prd := Low(TAllProducers) to High(TAllProducers) do
      for cat := Low(TCategories) to High(TCategories) do
        for brn := Low(TProBrands) to High(TProBrands) do
          for vnt := Low(TOneBrandVars) to High(TOneBrandVars) do
            jo[''] :=
             variantHistoryInfoSchema(
              currentResult.r_Producers[prd].pt_CategoriesResults[cat].pc_BrandsResults[brn].pb_VariantsResults[vnt],
              cat,prd,brn,
              currentResult.r_Producers[prd].pt_CategoriesResults[cat].pc_BrandsResults[brn].pb_BrandName,
              vnt);

    Result  := jo;
  end;

  function varHistInfoSchema(var curVar: TVariantResults; pCategoryID: TCategories): ISuperObject;
  var
    jo: ISuperObject;
    vBrn: TProBrands;
    vVnt: TOneBrandVars;
    I: Integer;
  begin
    jo  := SO;
    vBrn := curVar.v_ParentBrandID - curVar.v_ParentCompanyID * 10;
    vVnt := curVar.v_VariantID - curVar.v_ParentBrandID * 10;
//var variantHistoryInfoSchema = mongoose.Schema({
//    period : Number,
//    seminar : String,
//    varName : String,
//    varID : Number,
//    dateOfBirth : Number, //-4~10
//    dateOfDeath : Number, //-4~10
//    parentBrandID : Number,
//    parentBrandName : String,
//    parentCatID : Number,
//    parentCompanyID : Number, //(1~9)
//    supplierView : [supplierViewSchema],
//    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
//})
//Writeln('variantHistoryInfoSchema curVar.v_VariantID ' + IntToStr(curVar.v_VariantID) +
//  ' vVnt ' + IntToStr(vVnt) + ' curVar.v_ParentBrandID ' + IntToStr(curVar.v_ParentBrandID) +
//  ' vBrn ' + IntToStr(vBrn) +
//  ' curVar.v_ParentCompanyID ' + inttostr(curVar.v_ParentCompanyID));
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.S['varName'] := curVar.v_VariantName;
    jo.I['varID'] := curVar.v_VariantID;
    jo.I['dateOfBirth'] := curVar.v_DateofBirth;
    jo.I['dateOfDeath'] := curVar.v_DateOfDeath;
    jo.I['parentBrandID'] := curVar.v_ParentBrandID;
    jo.S['parentBrandName'] := currentResult.r_Brands[pCategoryID][curVar.v_ParentBrandIndex].b_BrandName;
    jo.I['parentCatID'] := pCategoryID;
    jo.I['parentCompanyID'] := curVar.v_ParentCompanyID;
    jo.O['supplierView']  := SA([]);
    if curVar.v_VariantID <> 0 then     // variant active
      if curVar.v_ParentCompanyID <= High(TAllProducers) then // only for producers 1~4
      begin
//        writeln(curVar.v_VariantID);
          jo.A['supplierView'].Add( supplierViewSchema(currentResult.r_Producers[curVar.v_ParentCompanyID].pt_CategoriesResults[pCategoryID].pc_BrandsResults[vBrn].pb_VariantsResults[vVnt]) );
      end;
    jo.O['channelView'] := SA([]);
    if curVar.v_VariantID <> 0 then
      for I := Low(TAllRetailers) to High(TAllRetailers) do
//          writeln( inttostr(I) + inttostr(Low(TAllRetailers)) + inttostr(High(TAllRetailers)));
          jo.A['channelView'].Add( channelViewSchema(I,pCategoryID,curVar.v_ParentBrandID,vVnt) );

    result  := jo;

  end;

  function collectVariantsNoProducer(): ISuperObject;
  var
    jo: ISuperObject;
    cat, vnt: Integer;
  begin
    jo  := SA([]);

    for cat := Low(TCategories) to High(TCategories) do
      for vnt := Low(TVariants) to High(TVariants) do
        if currentResult.r_Variants[cat][vnt].v_VariantID <> 0 then
          jo['']  :=
          varHistInfoSchema( currentResult.r_Variants[cat][vnt], cat);

    Result  := jo;
  end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SO;
//      oJsonFile := collectAllVariants;
      oJsonFile := collectVariantsNoProducer;
      s_str := 'out' + '.json';
      writeln( oJsonFile.AsJSon(False,False));
      oJsonFile.SaveTo(s_str, true, false);
    end;


begin
    SetMultiByteConversionCodePage(CP_UTF8);
    sDati := '';
    sListData := TStringList.Create;
    sListData.Clear;

  try

    WriteLn('Content-type: application/json');
    Writeln;

//    WriteLn('Content-type: text/html; charset=UTF-8');
//    WriteLn;
//   WriteLn('<HTML>');
//    WriteLn('<HEAD>');
//    WriteLn('<TITLE>CGI Example!</TITLE>');
//    WriteLn('</HEAD>');
//   WriteLn('<BODY bgcolor="#FFFBDB">');
//    WriteLn('<H2>CGI developed with');
//
//    {$IFDEF FPC}
//       WriteLn('Freepascal');
//    {$ELSE}
//      {$IFDEF LINUX}
//        WriteLn('Kylix');
//      {$ELSE}
//        WriteLn('Delphi');
//      {$ENDIF}
//    {$ENDIF}
//
//    WriteLn('</H2>');

    sValue := getVariable('REQUEST_METHOD');
    if sValue='GET' then
      begin
        // GET
//Action: GET
//Parameters: period, seminar
//Route example: …/variantHistoryInfo?period=1&seminar=MAY
//Schema: variantHistoryInfo.js
//Response:
//status code 200, JSON record”S" which is defined in related schema, including all the variants which meets the specified parameters(seminar/period)
//status code 404, Binary data cannot not be found with specified parameters(period/seminar)

        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
//        WriteLn('<H4>Values passed in mode <i>get http</i> :</H4>'+sDati);
//        for i:= 0 to sListData.Count-1 do
//           WriteLn(DecodeUrl(sListData[i])+'<BR>');

    // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;

    {** Read results file **}
        vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,
          currentResult); // read Results file

    // Now let's make some JSON stuff here
        if vReadRes = 0 then
          makeJson;
      end
    else
      // POST
//Parameters: null
//Post request content: single JSON record defined in schema
//Route example: …/negotiationDecision
//Schema: negotiationDecision.js
//Response:
//status code 200, Data has been written into binary file successfully
//status code 500, with debug information if something goes wrong during writing process

      begin
        sValue := trim(getVariable('CONTENT_LENGTH'));

//        WriteLn('<H4>Values passed in mode <i>post http</i> :</H4>');
//        WriteLn('Data Length: '+sValue+'<BR><BR>');
//        Writeln;
        if (sValue<>'') then
        begin
          iSize := strtoint(sValue);
          SetLength(sDati,iSize);

          bUpload := false;
          sValue := getVariable('HTTP_CONTENT_TYPE');
          if (Trim(sValue)<>'') and (Trim(sValue) <> 'application/x-www-form-urlencoded') then
              bUpload := true; // There is an attached file
              // We my use this mechanism if we want to, i.e. reading JSON

          for i:=1 to iSize do
            Read(sDati[i]);

          if bUpload then
            sListData.Add(sDati)
          else
            Explode(sDati, sListData);

//          for i:= 0 to sListData.Count-1 do
//            WriteLn(sListData[i]+'<BR>');  // This is where request contents sit
            // You may start request parameters here

        end;
      end;
    // List of environment variables
//    WriteAllEnvironVariables;


////    // initialize globals
//        currentSeminar := getSeminar;
//        currentPeriod := getPeriod;
//
//        vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,
//          currentResult); // read Results file
//
//    // Now let's make some JSON stuff here
//        if vReadRes = 0 then
//          makeJson;
////
////          currentSeminar := oJsonFile['seminar'].AsString;
////          currentPeriod := oJsonFile['period'].AsInteger;
//////
////          Writeln('currentPeriod : ' + IntToStr(currentPeriod));
////          Writeln('currentSeminar : ' + currentSeminar);
//////
//////      // now we have process JSON and convert it into binary stucture
////          fromJSONallDealSchema(currentAllDeals, oJsonFile);
//////
//////    {** Read results file **}
////          vReadRes := WriteNegoRecordByProDecision(currentPeriod,
////            currentAllDeals,DataDirectory,currentSeminar); // update Decision file
////
//    writeln(#10'press enter ...');
//    readln;
//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

