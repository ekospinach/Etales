program negotiationDecision;

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
  dummySeminar = 'MAY';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

var
   i: integer;
   sDati : string;
   sListData: tStrings;
   bUpload: boolean;
   sValue : string;
   iSize : integer;

   currentAllDeals  : TAllDeals;
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

  function ReadNegoRecordByProDecision(pPeriodNumber : TPeriodNumber;
    var pDecision: TAllDeals; vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
  var
    vFile    : file of TAllDeals;
    vFileName   : String;
    vTempResult : integer;
  begin
    vFileName := vDataDirectory + NegotiationsFileName + vSeminarCode;
    if FileExists(vFileName) = false then
    begin
        Writeln('negotiation file does not exist:' + vFileName);
        Result := -1;
        exit;
    end;

    try
        try
          AssignFile( vFile, vFileName );
          Reset( vFile );
          if ( pPeriodNumber < HistoryEnd ) then pPeriodNumber := HistoryEnd;
          Seek( vFile, pPeriodNumber - HistoryStart );
          Read( vFile, pDecision);
          vTempResult := 0;
        except
          on E: EInOutError do
          begin
            Writeln('Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + vFileName + #13 + #10 + E.Message );
            vTempResult := E.ErrorCode;
          end;
        end;
    finally
       CloseFile( vFile );
    end;
    Result := vTempResult;
  end;

  function WriteNegoRecordByProDecision(pPeriodNumber : TPeriodNumber;
    var pDecision: TAllDeals; vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
  var
    vFile    : file of TAllDeals;
    vDecision : TAllDeals;
    vFileName   : String;
    vTempResult : integer;
  begin
    vFileName := vDataDirectory + NegotiationsFileName + vSeminarCode;
    if FileExists(vFileName) = false then
    begin
        Writeln('negotiation file does not exist:' + vFileName);
        Result := -1;
        exit;
    end;

    try
        try
          AssignFile( vFile, vFileName );
          Reset( vFile );
          if ( pPeriodNumber < HistoryEnd ) then pPeriodNumber := HistoryEnd;
          Seek( vFile, pPeriodNumber - HistoryStart );
          Read( vFile, vDecision);
          vDecision := pDecision;
          Seek( vFile, pPeriodNumber - HistoryStart );
          Write( vFile, vDecision);
          vTempResult := 0;
        except
          on E: EInOutError do
          begin
            Writeln('Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + vFileName + #13 + #10 + E.Message );
            vTempResult := E.ErrorCode;
          end;
        end;
    finally
       CloseFile( vFile );
    end;
    Result := vTempResult;
  end;

    function variantsDetailsSchema(var curVariantDetails: TVariantDetails): ISuperObject;
    var
      jo: ISuperObject;
      mkt: Integer;
    begin
      jo  := SO;
//var variantsDetailsSchema = mongoose.Schema({
//    varID : Number,
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    useMarketsDetails : Boolean,
//    marketsDetails : [Number]
//})
      jo.I['varID'] := curVariantDetails.niv_VarID;
      jo.I['dateOfBirth'] := curVariantDetails.niv_DateofBirth;
      jo.I['dateOfDeath'] := curVariantDetails.niv_DateOfDeath;
      jo.B['useMarketsDetails'] := curVariantDetails.niv_UseMarketsDetails;
      jo.O['marketsDetails']  := SA([]);
      for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
        jo.A['marketsDetails'].D[mkt - 1] := curVariantDetails.niv_MarketsDetails[mkt];

      Result  := jo;
    end;

    function brandDetailsSchema(var curBrandDetails: TBrandDetails): ISuperObject;
    var
      jo: ISuperObject;
      mkt,vnt: Integer;
    begin
      jo  := SO;
//var brandDetailsSchema = mongoose.Schema({
//    brandID : Number,
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    marketsDetails : [Number],
//    useVariantsDetails : Boolean,
//    useMarketsDetails : Boolean,
//    variantsDetails : [variantsDetailsSchema] //length: TOneBrandVars
//})
      jo.I['brandID'] := curBrandDetails.nib_BrandID;
      jo.I['dateOfBirth'] := curBrandDetails.nib_DateofBirth;
      jo.I['dateOfDeath'] := curBrandDetails.nib_DateOfDeath;
      jo.B['useVariantsDetails']  := curBrandDetails.nib_UseVariantsDetails;
      jo.B['useMarketsDetails'] := curBrandDetails.nib_UseMarketsDetails;
      jo.O['marketsDetails']  := SA([]);
      for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
        jo.A['marketsDetails'].D[mkt - 1] := curBrandDetails.nib_MarketsDetails[mkt];
      jo.O['variantsDetails'] := SA([]);
      for vnt := Low(TOneBrandVars) to High(TOneBrandVars) do
        jo.A['variantsDetails'].Add( variantsDetailsSchema(curBrandDetails.nib_VariantsDetails[vnt]) );

      Result  := jo;
    end;

    function categoryDetailsSchema(var curCatDetails: TCategoryDetails): ISuperObject;
    var
      jo: ISuperObject;
      mkt, brn: Integer;
    begin
      jo  := SO;
//var categoryDetailsSchema = mongoose.Schema({
//    marketsDetails : [Number], //Length: TMarketTotal
//    useBrandsDetails : Boolean,
//    useMarketsDetails : Boolean,
//    brandsDetails : [brandDetailsSchema], //Length: TProBrands
//})
      jo.B['useBrandsDetails']  := curCatDetails.nic_UseBrandsDetails;
      jo.B['useMarketsDetails'] := curCatDetails.nic_UseMarketsDetails;
      jo.O['marketsDetails']  := SA([]);
      for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
        jo.A['marketsDetails'].D[ mkt - 1 ] := curCatDetails.nic_MarketsDetails[mkt];
      jo.O['brandsDetails'] := SA([]);
      for brn := Low(TProBrands) to High(TProBrands) do
        jo.A['brandsDetails'].Add( brandDetailsSchema(curCatDetails.nic_BrandsDetails[brn]) );

      Result  := jo;
    end;

    function categoryDealSchema(var curCatDeal: TCategoryDeal): ISuperObject;
    var
      jo: ISuperObject;
    begin
      jo  := SO;
//var categoryDealSchema = mongoose.Schema({
//    categoryID : Number,
//    consignementVolume     : categoryDetailsSchema;
//    inStoreActivitiesFee   : categoryDetailsSchema;
//    minimumOrder           : categoryDetailsSchema;
//    otherCompensation      : categoryDetailsSchema;
//    paymentDays            : categoryDetailsSchema;
//    performanceBonusAmount : categoryDetailsSchema;
//    performanceBonusRate   : categoryDetailsSchema;
//    promotionalSupport     : categoryDetailsSchema;
//    salesTargetVolume      : categoryDetailsSchema;
//    volumeDiscountRate     : categoryDetailsSchema;
//})
      jo.I['categoryID']  := curCatDeal.nc_CategoryID;
      jo.O['consignementVolume']  := categoryDetailsSchema(curCatDeal.nc_ConsignementVolume);
      jo.O['inStoreActivitiesFee']  := categoryDetailsSchema(curCatDeal.nc_InStoreActivitiesFee);
      jo.O['minimumOrder']  := categoryDetailsSchema(curCatDeal.nc_MinimumOrder);
      jo.O['otherCompensation'] := categoryDetailsSchema(curCatDeal.nc_OtherCompensation);
      jo.O['paymentDays'] := categoryDetailsSchema(curCatDeal.nc_PaymentDays);
      jo.O['performanceBonusAmount']  := categoryDetailsSchema(curCatDeal.nc_PerformanceBonusAmount);
      jo.O['performanceBonusRate']  := categoryDetailsSchema(curCatDeal.nc_PerformanceBonusRate);
      jo.O['promotionalSupport']  := categoryDetailsSchema(curCatDeal.nc_PromotionalSupport);
      jo.O['salesTargetVolume'] := categoryDetailsSchema(curCatDeal.nc_SalesTargetVolume);
      jo.O['volumeDiscountRate']  := categoryDetailsSchema(curCatDeal.nc_VolumeDiscountRate);

      Result  := jo;
    end;

    function retailerDealSchema(producer, retailer: Integer): ISuperObject;
    var
      jo: ISuperObject;
      cat: Integer;
    begin
      jo  := SO;
//var retailerDealSchema = mongoose.Schema({
//    retailerID : Number,
//    categoryDeal : [categoryDealSchema]
//})
      jo.I['retailerID']  := retailer;
      jo.O['categoryDeal']  :=  SA([]);
      for cat := Low(TCategories) to High(TCategories) do
        jo.A['categoryDeal'].Add( categoryDealSchema(currentAllDeals[producer, retailer].neg_CategoriesDeals[cat]) );

      Result  := jo;
    end;

    function producerDealSchema(producer: Integer): ISuperObject;
    var
      jo: ISuperObject;
      retailer  : TAllRetailers;
    begin
      jo  := SO;
//var producerDealSchema = mongoose.Schema({
//    producerID : Number,
//    retailerDealSchema : [retailerDealSchema]
//})
      jo.I['producerID']  := producer;
      jo.O['retailerDeal']  := SA([]);
      for retailer := Low(TAllRetailers) to High(TAllRetailers) do
        jo.A['retailerDeal'].Add(retailerDealSchema(producer, retailer) );

      Result  := jo;
    end;

    function allDealSchema(var curAllDeals : TAllDeals): ISuperObject;
    var
      jo : ISuperObject;
      producer : TAllProducers;
    begin
      jo := SO;
//var allDealSchema = mongoose.Schema({
//    period : Number,
//    seminar : String,
//    producerDeal : [producerDealSchema] //length: TAllProducers(1~4)
//})
      jo.I['period']  := currentPeriod;
      jo.S['seminar'] := currentSeminar;
      jo.O['producerDeal']  := SA([]);
      for producer := Low(TAllProducers) to High(TAllProducers) do
          jo.A['producerDeal'].Add( producerDealSchema( producer ) );

      result  := jo;
    end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SO;
      oJsonFile := allDealSchema(currentAllDeals);
      s_str := 'out' + '.json';
      writeln( oJsonFile.AsJSon(False,False));
      oJsonFile.SaveTo(s_str, true, false);
    end;

    procedure fromJSONvariantsDetailsSchema(var curVariantDetails: TVariantDetails; jo: ISuperObject);
    var
      mkt: Integer;
    begin
//var variantsDetailsSchema = mongoose.Schema({
//    varID : Number,
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    useMarketsDetails : Boolean,
//    marketsDetails : [Number]
//})
      curVariantDetails.niv_VarID := jo.I['varID'];
      curVariantDetails.niv_DateofBirth := jo.I['dateOfBirth'];
      curVariantDetails.niv_DateOfDeath := jo.I['dateOfDeath'];
      curVariantDetails.niv_UseMarketsDetails := jo.B['useMarketsDetails'];
      for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
        curVariantDetails.niv_MarketsDetails[mkt] := jo.A['marketsDetails'].D[mkt - 1];
    end;

    procedure fromJSONbrandDetailsSchema(var curBrandDetails: TBrandDetails; jo: ISuperObject);
    var
      mkt,vnt: Integer;
    begin
//var brandDetailsSchema = mongoose.Schema({
//    brandID : Number,
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    marketsDetails : [Number],
//    useVariantsDetails : Boolean,
//    useMarketsDetails : Boolean,
//    variantsDetails : [variantsDetailsSchema] //length: TOneBrandVars
//})
      curBrandDetails.nib_BrandID := jo.I['brandID'];
      curBrandDetails.nib_DateofBirth := jo.I['dateOfBirth'];
      curBrandDetails.nib_DateOfDeath := jo.I['dateOfDeath'];
      curBrandDetails.nib_UseVariantsDetails  := jo.B['useVariantsDetails'];
      curBrandDetails.nib_UseMarketsDetails := jo.B['useMarketsDetails'];
      if curBrandDetails.nib_UseMarketsDetails then
        for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
          curBrandDetails.nib_MarketsDetails[mkt] := jo.A['marketsDetails'].D[mkt - 1];
      if curBrandDetails.nib_UseVariantsDetails then
        for vnt := Low(TOneBrandVars) to High(TOneBrandVars) do
          fromJSONvariantsDetailsSchema(curBrandDetails.nib_VariantsDetails[vnt], jo.A['variantsDetails'].O[vnt - 1] );
    end;

    procedure fromJSONcategoryDetailsSchema(var curCatDetails: TCategoryDetails; jo: ISuperObject);
    var
      mkt, brn: Integer;
    begin
//var categoryDetailsSchema = mongoose.Schema({
//    marketsDetails : [Number], //Length: TMarketTotal
//    useBrandsDetails : Boolean,
//    useMarketsDetails : Boolean,
//    brandsDetails : [brandDetailsSchema], //Length: TProBrands
//})
      curCatDetails.nic_UseBrandsDetails  := jo.B['useBrandsDetails'];
      curCatDetails.nic_UseMarketsDetails := jo.B['useMarketsDetails'];
      if curCatDetails.nic_UseMarketsDetails then
         for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
          curCatDetails.nic_MarketsDetails[mkt] := jo.A['marketsDetails'].D[ mkt - 1 ];
      if curCatDetails.nic_UseBrandsDetails then
        for brn := Low(TProBrands) to High(TProBrands) do
          fromJSONbrandDetailsSchema(curCatDetails.nic_BrandsDetails[brn], jo.A['brandsDetails'].O[brn - 1] );
    end;

    procedure fromJSONcategoryDealSchema(var curCatDeal: TCategoryDeal; jo: ISuperObject);
    begin
//var categoryDealSchema = mongoose.Schema({
//    categoryID : Number,
//    consignementVolume     : categoryDetailsSchema;
//    inStoreActivitiesFee   : categoryDetailsSchema;
//    minimumOrder           : categoryDetailsSchema;
//    otherCompensation      : categoryDetailsSchema;
//    paymentDays            : categoryDetailsSchema;
//    performanceBonusAmount : categoryDetailsSchema;
//    performanceBonusRate   : categoryDetailsSchema;
//    promotionalSupport     : categoryDetailsSchema;
//    salesTargetVolume      : categoryDetailsSchema;
//    volumeDiscountRate     : categoryDetailsSchema;
//})
      curCatDeal.nc_CategoryID  := jo.I['categoryID'];
      fromJSONcategoryDetailsSchema(curCatDeal.nc_ConsignementVolume, jo.O['consignementVolume']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_InStoreActivitiesFee, jo.O['inStoreActivitiesFee']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_MinimumOrder, jo.O['minimumOrder']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_OtherCompensation, jo.O['otherCompensation']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_PaymentDays, jo.O['paymentDays']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_PerformanceBonusAmount, jo.O['performanceBonusAmount']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_PerformanceBonusRate, jo.O['performanceBonusRate']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_PromotionalSupport, jo.O['promotionalSupport']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_SalesTargetVolume, jo.O['salesTargetVolume']);
      fromJSONcategoryDetailsSchema(curCatDeal.nc_VolumeDiscountRate, jo.O['volumeDiscountRate']);
    end;



    procedure fromJSONretailerDealSchema(var curDeal: TOnePairDeal; jo: ISuperObject);
    var
      cat: Integer;
    begin
//var retailerDealSchema = mongoose.Schema({
//    retailerID : Number,
//})
      curDeal.neg_RetailerID  := jo.I['retailerID'];
      for cat := Low(TCategories) to High(TCategories) do
        fromJSONcategoryDealSchema(curDeal.neg_CategoriesDeals[cat], jo.A['categoryDeal'].O[cat -1] );
    end;

    procedure fromJSONproducerDealSchema(var curDeal : TOnePairDeal; retailer: Integer; jo: ISuperObject);
    var
      jt: ISuperObject;
    begin
//var producerDealSchema = mongoose.Schema({
//    producerID : Number,
//    retailerDealSchema : [retailerDealSchema]
//})
      jo.SaveTo('aa.txt',True,True);
      curDeal.neg_ProducerID  := jo.I['producerID'];
      jt  := jo.A['retailerDeal'].O[retailer - 1];
      jt.SaveTo('bb.txt', TRUE, TRUE);
      writeln(jt.AsString);
      writeln('piece');
      fromJSONretailerDealSchema(curDeal, jt);
    end;

    procedure fromJSONallDealSchema(var curAllDeals : TAllDeals; jo: ISuperObject);
    var
      producer : TAllProducers;
      retailer  : TAllRetailers;
      jp, jr: ISuperObject;
    begin
//var allDealSchema = mongoose.Schema({
//    period : Number,
//    seminar : String,
//    producerDeal : [producerDealSchema]
//})
      currentPeriod  := jo.I['period'];
      currentSeminar := jo.S['seminar'];
      for producer := Low(TAllProducers) to High(TAllProducers) do
        for retailer := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jp  := jo.A['producerDeal'].O[producer - 1];
            jr  := jp.A['retailerDeal'].O[0];
            fromJSONretailerDealSchema( currentAllDeals[producer, retailer], jr );
          end;

//          fromJSONproducerDealSchema( currentAllDeals[producer, retailer], retailer, jo.A['producerDeal'].O[producer - 1]);
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
//Parameters: period, seminar
//Route example: …/negotiationDecision?period=1&seminar=MAY
//Schema: negotiationDecision.js
//Response:
//status code 200, Data has been written into binary file successfully
//status code 500, with debug information if something goes wrong during writing process

        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
//        WriteLn('<H4>Values passed in mode <i>get http</i> :</H4>'+sDati);
//        for i:= 0 to sListData.Count-1 do
//           WriteLn(DecodeUrl(sListData[i])+'<BR>');

    // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;
//          Writeln('currentPeriod : ' + IntToStr(currentPeriod));
//          Writeln('currentSeminar : ' + currentSeminar);

    {** Read results file **}
        vReadRes := ReadNegoRecordByProDecision(currentPeriod,currentAllDeals,
          DataDirectory,currentSeminar); // read Nego file

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

      // initialize globals
        // read JSON data from post field
          oJsonFile := getJson;
        // these work only if JSON is correct, that is it keeps them
          currentSeminar := oJsonFile.S['seminar'];
          currentPeriod := oJsonFile.I['period'];

//          Writeln(oJsonFile.AsString);
//          Writeln('currentPeriod : ' + IntToStr(currentPeriod));
//          Writeln('currentSeminar : ' + currentSeminar);


      // now we have process JSON and convert it into binary stucture
          fromJSONallDealSchema(currentAllDeals, oJsonFile);

//         writeln( oJsonFile.AsJSon(False,False));
//          oJsonFile.SaveTo('out.json', true, false);

      // write tranlated JSON to binary file
          vReadRes := WriteNegoRecordByProDecision(currentPeriod,
            currentAllDeals,DataDirectory,currentSeminar); // update Decision file

      // shake hands
        if vReadRes = 0 then
          Writeln('Status : 200 OK');

        end;
      end;
    // List of environment variables
//    WriteAllEnvironVariables;


////    // initialize globals
//        currentSeminar := getSeminar;
//        currentPeriod := getPeriod;
//////        currentRetailer := getRetailer;
//////          oJsonFile := SO;
//////          oJsonFile := tsuperobject.ParseString('{"test" : "yes"}', TRUE);
//////          Writeln(oJsonFile.AsString);
//          sFile := 'negotiationExample2.json';
//          Writeln(sFile);
//          oJsonFile := TSuperObject.ParseFile(sFile,TRUE);
//          Writeln(oJsonFile.AsString);
//////
////        vReadRes := ReadNegoRecordByProDecision(currentPeriod,currentAllDeals,
////          DataDirectory,currentSeminar); // read Nego file
////
////    // Now let's make some JSON stuff here
////        if vReadRes = 0 then
////          makeJson;
////
////          currentSeminar := oJsonFile['seminar'].AsString;
////          currentPeriod := oJsonFile['period'].AsInteger;
//////
////          Writeln('currentPeriod : ' + IntToStr(currentPeriod));
////          Writeln('currentSeminar : ' + currentSeminar);
//////
//////      // now we have process JSON and convert it into binary stucture
//          fromJSONallDealSchema(currentAllDeals, oJsonFile);
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

