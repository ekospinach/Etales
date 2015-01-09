program retailerDecision;

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
  Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles, CgiCommonFunction;

const
  DecisionFileName = ' Decisions.';
  dummyNo = 1;

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

   DataDirectory : string;
   currentDecision : TRetDecision;
//	 prevDecision : TRetDecision;
   currentPeriod : TPeriodNumber;
   currentRetailer : TBMRetailers;
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
      Result := DataDirectory + partOne + partNum + DecisionFileName + seminar;
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

    function ReadRetdecisionRecord(pPeriodNumber : TPeriodNumber; pRetNumber : TBMRetailers;
    var pDecision: TRetDecision; vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
    var
      vFile    : file of TRetdecision;
      vFileName   : String;
      vTempResult, vPer : integer;
    begin
      vFileName := vDataDirectory + RetailersDecisionsFilesNames[pRetNumber] + vSeminarCode;
      if FileExists(vFileName) = false then
      begin
          Writeln('Error 404');
          WriteLn('decision file does not exist:' + vFileName);
          Result := -1;
          exit;
      end;

      try
          try
//            Writeln(vFileName);
//            Writeln('Period (given) : ' + inttostr(pPeriodNumber));
            AssignFile( vFile, vFileName );
            Reset( vFile );
            if ( pPeriodNumber < HistoryEnd ) then pPeriodNumber := HistoryEnd;
//            Writeln('Period (should be 0 if <0) : ' + inttostr(pPeriodNumber));
            vPer  := pPeriodNumber - HistoryStart;
//            Writeln('Period (calculated record NO) : ' + inttostr(vPer));
//            Writeln('File length : ' + IntToStr(filesize(vFile)));
            Seek( vFile, vPer );
            Read( vFile, pDecision);
            vTempResult := 0;
          except
            on E: EInOutError do
            begin
              Writeln('Error 418');
              Writeln('Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + vFileName + #13 + #10 + E.Message );
              vTempResult := E.ErrorCode;
            end;
          end;
      finally
         CloseFile( vFile );
      end;
      Result := vTempResult;

    end;


   function WriteRetdecisionRecord(pPeriodNumber : TPeriodNumber;
   pRetNumber : TBMRetailers; var pDecision: TRetDecision;
   vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
    var
      vFile    : file of TRetDecision;
      vDecision : TRetDecision;
      vFileName   : String;
      vTempResult : integer;
    begin
      vFileName := vDataDirectory + RetailersDecisionsFilesNames[pRetNumber] + vSeminarCode;
      if FileExists(vFileName) = false then
      begin
          Writeln('Error 404');
          WriteLn('decision file does not exist:' + vFileName);
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
            Seek( vFile, pPeriodNumber - HistoryStart );
            vDecision := pDecision;
            write( vFile, vDecision);
            vTempResult := 0;
          except
            on E: EInOutError do
            begin
              Writeln('Error 418');
              Writeln('Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + vFileName + #13 + #10 + E.Message );
              vTempResult := E.ErrorCode;
            end;
          end;
      finally
         CloseFile( vFile );
      end;
      Result := vTempResult;
    end;

    function collectRetVariants(pVar : TRetVariantDecision): ISuperObject;
    var
      jo, jt  : ISuperObject;
      I : Integer;
    begin
      jo  := SO;
//var retVariantDecisionSchema = mongoose.Schema({
//    brandID : Number,
//    variantID : Number,
//    brandName : String, //need Dariusz to add this in dataStruture
//    varName : String, //need Dariusz to add this in dataStruture
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    order : Number,
//    pricePromotions : {
//        promo_Frequency : Number, //range: 0~52
//        promo_Rate : Number //0~1
//    },
//    retailerPrice : Number,
//    shelfSpace : Number //saved as a %
//})

      jo.I['brandID'] := pVar.drv_BrandID;
      jo.I['variantID'] := pVar.drv_VariantID;
      jo.S['brandName'] := pVar.drv_BrandName;
      jo.S['varName'] := pVar.drv_VariantName;
      jo.I['dateOfBirth'] := pVar.drv_DateofBirth;
      jo.I['dateOfDeath'] := pVar.drv_DateOfDeath;
      jo.D['order'] := pVar.drv_Order;
      // OA may be a problem here
      jt := SO;
      jt.I['promo_Frequency'] := pVar.drv_PricePromotions.promo_Frequency;
      jt.D['promo_Rate']  := pVar.drv_PricePromotions.promo_Rate;
      jo.O['pricePromotions'] := jt;
      jo.D['retailerPrice'] := pVar.drv_RetailPrice;
      jo.D['shelfSpace'] := pVar.drv_ShelfSpace;

      Result  := jo;
    end;

    function collectMarketAssortment(pQuarter : TRetQuarterAssortmentDecision): ISuperObject;
    var
      jo  : ISuperObject;
      I : Integer;
    begin
      jo  := SO;
//var retQuarterAssortmentDecisionSchema = mongoose.Schema({
//    categoryID : Number, //1~2
//    retVariantDecision : [retVariantDecisionSchema] //length : TRetVariants(1~21)
//})
      jo.I['categoryID']  := pQuarter.drq_CategoryID;
      jo.O['retVariantDecision']  := SA([]);
      for I := Low(TRetVariantsDecisions) to High(TRetVariantsDecisions) do
        jo.A['retVariantDecision'].Add(collectRetVariants(pQuarter.drq_Variants[I]));

      Result  := jo;
    end;

    function collectMarket(pMarket : TRetMarketDecision): ISuperObject;
    var
      jo  : ISuperObject;
      I : Integer;
      pers : TStorePerceptions;
    begin
      jo  := SO;
//var retMarketDecisionSchema = mongoose.Schema({
//    marketID : Number, //1~2
//    categorySurfaceShare : [Number], //[1]for Elecssories [2]for HealthBeauty
//    emptySpaceOptimised : Boolean,
//    localAdvertising : {
//        PRICE : Number,
//        CONVENIENCE : Number,
//        ASSORTMENT : Number
//    },
//    serviceLevel : String, //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
//    retMarketAssortmentDecision : [retQuarterAssortmentDecisionSchema] //length : TCategories(1~2)
//})
      jo.I['marketID']  := pMarket.drm_MarketID;
      jo.O['categorySurfaceShare']  := SA([]);
      for I := Low(TCategoriesShares) to High(TCategoriesShares) do
        jo.A['categorySurfaceShare'].D[I-1]  := pMarket.drm_CategorySurfaceShare[I];
      jo.B['emptySpaceOptimised'] := pMarket.drm_EmptySpaceOptimised;
      jo.O['localAdvertising']  := SA([]);
      I := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          jo.A['localAdvertising'].D[I]  := pMarket.drm_LocalAdvertising[pers];
          I := I + 1;
        end;
      jo.S['serviceLevel']  := GetEnumName(TypeInfo(TServiceLevel),Integer(pMarket.drm_ServiceLevel));
      jo.O['retMarketAssortmentDecision'] := SA([]);
      for I := Low(TRetMarketAssortmentDecision) to High(TRetMarketAssortmentDecision) do
        jo.A['retMarketAssortmentDecision'].Add(collectMarketAssortment(pMarket.drm_Assortment[I]));

      Result  := jo;
    end;

    function collectPLVar(pVar : TPrivateLabelVariantDecision): ISuperObject;
    var
      jo  : ISuperObject;
      I : Integer;
    begin
      jo  := SO;
//var privateLabelVarDecision = mongoose.Schema({
//    varName : String,
//    varID : Number,
//    parentBrandID : Number,
//    dateOfDeath : Number,
//    dateOfBirth : Number,
//    packFormat : String,
//    composition : [Number],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
//    discontinue : boolean
//})
      jo.S['varName'] := pVar.drplv_VariantName;
      jo.I['varID'] := pVar.drplv_VarID;
      jo.I['parentBrandID'] := pVar.drplv_ParentBrandID;
      jo.I['dateOfDeath'] := pVar.drplv_DateOfDeath;
      jo.I['dateOfBirth'] := pVar.drplv_DateofBirth;
      jo.S['packFormat']  := GetEnumName(TypeInfo(TVariantPackFormat),Integer(pVar.drplv_PackFormat));
      jo.B['discontinue'] := pVar.drplv_Discontinue;
      jo.O['composition'] := SA([]);
      for I := Low(TVariantComposition) to High(TVariantComposition) do
        jo.A['composition'].I[I - 1] := pvar.drplv_Composition[I];

      Result  := jo;
    end;

    function collectPrivateLabel(pBrand : TPrivateLabelDecision): ISuperObject;
    var
      jo : ISuperObject;
      ivar : Integer;
    begin
      jo := SO;
//var privateLabelDecisionSchema = mongoose.Schema({
//    brandName : String,
//    brandID : Number,
//    /*
//        case 'P': brandID = (10 * userCount) + brandCount
//        case 'R': brandID = (10 * (userCount +4)) + brandCount
//        userCount = 1~4
//        brandCount = 1~5
//    */
//    parentCompanyID : Number,
//    /*
//        Prod_1_ID          = 1;
//        Prod_2_ID          = 2;
//        Prod_3_ID          = 3;
//        Prod_4_ID          = 4;
//        Ret_1_ID           = 5;
//        Ret_2_ID           = 6;
//        TradTrade_ID       = 7;
//        E_Mall_ID          = 8;
//        Admin_ID           = 9;
//    */
//    dateOfBirth : Number, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
//    dateOfDeath : Number, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
//    privateLabelVarDecision : [privateLabelVarDecision] //length: TOneBrandVars(1~3)
//})

      jo.S['brandName'] := pBrand.drpl_BrandName;
      jo.I['brandID'] := pBrand.drpl_BrandID;
      jo.I['parentCompanyID'] := pBrand.drpl_ParentCompanyID;
      jo.I['dateOfBirth'] := pBrand.drpl_DateofBirth;
      jo.I['dateOfDeath'] := pBrand.drpl_DateOfDeath;
      // PL Variants
      jo.O['privateLabelVarDecision'] := SA([]);
      for ivar := Low(TOneBrandVariants) to High(TOneBrandVariants) do
        jo.A['privateLabelVarDecision'].Add( collectPLVar(pBrand.drpl_Variants[ivar]) );

      Result  := jo;
    end;

    function collectCategory(pCategory : TRetCategoryDecision): ISuperObject;
    var
      jo : ISuperObject;
      brn : Integer;
    begin
      jo := SO;
//var retCatDecisionSchema = mongoose.Schema({
//    categoryID : Number, //1~2
//    privateLabelDecision : [privateLabelDecisionSchema] //length: TPrivateLabels(1~4, effective number is 3)
//})
      jo.I['categoryID'] := pCategory.drc_CategoryID;

      // collect private labels decisions
      jo.O['privateLabelDecision'] := SA([]);
      for brn := Low(TPrivateLabels) to High(TPrivateLabels) do
        jo.A['privateLabelDecision'].Add(collectPrivateLabel(pCategory.drc_PrivateLabels[brn]));

      Result := jo;
    end;

    function serveRequest() : ISuperObject;
    var
      jo : ISuperObject;
      cat : Integer;
      pers  : TStorePerceptions;
      marketStudies : integer;
    begin
      jo := SO; //initialise JSON object

//var retDecisionSchema = mongoose.Schema({
//    retailerID : Number, //TAllRetailers (1~4)
//    seminar : String,
//    period : Number,
//    nextBudgetExtension : Number,
//    approvedBudgetExtension : Number,
//    onlineAdvertising : {
//        PRICE : Number,
//        CONVENIENCE : Number,
//        ASSORTMENT : Number
//    },
//    tradtionalAdvertising : {
//        PRICE : Number,
//        CONVENIENCE : Number,
//        ASSORTMENT : Number
//    },
//    retCatDecision : [retCatDecisionSchema], //length: TCategories(1~2)
//    retMarketDecision [retMarketDecisionSchema] //length: TMarkets(1~2)
//})
      jo.S['seminar'] := currentSeminar;
      jo.I['period'] := currentPeriod;
      jo.I['retailerID'] := currentRetailer;
      jo.D['nextBudgetExtension']  := currentDecision.dr_NextBudgetExtension;
      jo.D['approvedBudgetExtension']  := currentDecision.dr_ApprovedBudgetExtension;

      //fill array for MarketResearchOrder
      jo.O['marketResearchOrder'] := SA([]);
      for marketStudies := Low(TMarketStudies) to High(TMarketStudies) do
        jo.A['marketResearchOrder'].B[marketStudies - 1] := currentDecision.dr_MarketResearch[marketStudies];


      jo.O['onlineAdvertising'] := SA([]);
      cat := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          jo.A['onlineAdvertising'].D[cat] := currentDecision.dr_OnlineAdvertising[pers];
          cat := cat + 1;
        end;
      jo.O['tradtionalAdvertising'] := SA([]);
      cat := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          jo.A['tradtionalAdvertising'].D[cat] := currentDecision.dr_TraditionalAdvertising[pers];
          cat := cat + 1;
        end;
      //category
      jo.O['retCatDecision'] := SA([]);
      for cat := Low(TCategories) to High(TCategories) do
        jo.A['retCatDecision'].Add( collectCategory(currentDecision.dr_Categories[cat]) );
      //markets
      jo.O['retMarketDecision'] := SA([]);
      for cat := Low(TMarkets) to High(TMarkets) do
        jo.A['retMarketDecision'].Add( collectMarket(currentDecision.dr_Markets[cat]) );


     Result := jo;

    end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SO;
      oJsonFile := serveRequest;
      s_str := 'out' + '.json';
      writeln( oJsonFile.AsJSon(False,False));
      oJsonFile.SaveTo(s_str, true, false);
    end;

    procedure translateRetVariants(jo: ISuperObject; var pVar : TRetVariantDecision);
    var
      I : Integer;
    begin
      pVar.drv_BrandID := jo.I['brandID'];
      pVar.drv_VariantID := jo.I['variantID'];
      StringToWideChar(jo.S['brandName'], pVar.drv_BrandName, BrandNameLength + 1);
      StringToWideChar(jo.S['varName'], pVar.drv_VariantName, VarNameLength + 1);
      pVar.drv_DateofBirth := jo.I['dateOfBirth'];
      pVar.drv_DateOfDeath := jo.I['dateOfDeath'];
      pVar.drv_Order := jo.D['order'];
      // OA may be a problem here
      pVar.drv_PricePromotions.promo_Frequency := jo.I['pricePromotions.promo_Frequency'];
      pVar.drv_PricePromotions.promo_Rate  := jo.D['pricePromotions.promo_Rate'];
      pVar.drv_RetailPrice := jo.D['retailerPrice'];
      pVar.drv_ShelfSpace := jo.D['shelfSpace'];
    end;

    procedure translateMarketAssortment(jo: ISuperObject; var pQuarter : TRetQuarterAssortmentDecision);
    var
      I : Integer;
    begin
      pQuarter.drq_CategoryID  := jo.I['categoryID'];
      for I := Low(TRetVariantsDecisions) to High(TRetVariantsDecisions) do
        translateRetVariants(jo.A['retVariantDecision'].O[I - 1], pQuarter.drq_Variants[I]);
    end;

    procedure translateMarket(jo: ISuperObject; var pMarket : TRetMarketDecision);
    var
      I : Integer;
      pers : TStorePerceptions;
    begin
      pMarket.drm_MarketID  := jo.I['marketID'];
      for I := Low(TCategoriesShares) to High(TCategoriesShares) do
        pMarket.drm_CategorySurfaceShare[I]  := jo.A['categorySurfaceShare'].D[I-1];
      pMarket.drm_EmptySpaceOptimised := jo.B['emptySpaceOptimised'];
      I := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          pMarket.drm_LocalAdvertising[pers]  := jo.A['localAdvertising'].D[I];
          I := I + 1;
        end;
      pMarket.drm_ServiceLevel := TServiceLevel(GetEnumValue(TypeInfo(TServiceLevel), jo.S['serviceLevel']));
      for I := Low(TRetMarketAssortmentDecision) to High(TRetMarketAssortmentDecision) do
        translateMarketAssortment(jo.A['retMarketAssortmentDecision'].O[I - 1], pMarket.drm_Assortment[I]);
    end;

    procedure translatePLVar(jo: ISuperObject; var pVar : TPrivateLabelVariantDecision);
    var
      I : Integer;
    begin
      StringToWideChar(jo.S['varName'],pVar.drplv_VariantName,BrandNameLength + 1) ;
      pVar.drplv_VarID := jo.I['varID'];
      pVar.drplv_ParentBrandID := jo.I['parentBrandID'];
      pVar.drplv_DateOfDeath := jo.I['dateOfDeath'];
      pVar.drplv_DateofBirth := jo.I['dateOfBirth'];
      pVar.drplv_PackFormat := TVariantPackFormat(GetEnumValue(TypeInfo(TVariantPackFormat),jo.S['packFormat']));
      pVar.drplv_Discontinue := jo.B['discontinue'];
      for I := Low(TVariantComposition) to High(TVariantComposition) do
        pvar.drplv_Composition[I] := jo.A['composition'].I[I - 1];
    end;

    procedure translatePrivateLabel(jo : ISuperObject; var pBrand : TPrivateLabelDecision) ;
    var
      ivar : Integer;
    begin
      StringToWideChar(jo.S['brandName'],pBrand.drpl_BrandName,BrandNameLength + 1);
      pBrand.drpl_BrandID := jo.I['brandID'];
      pBrand.drpl_ParentCompanyID := jo.I['parentCompanyID'];
      pBrand.drpl_DateofBirth := jo.I['dateOfBirth'];
      pBrand.drpl_DateOfDeath := jo.I['dateOfDeath'];
      // PL Variants
      for ivar := Low(TOneBrandVariants) to High(TOneBrandVariants) do
        translatePLVar(jo.A['privateLabelVarDecision'].O[ivar - 1], pBrand.drpl_Variants[ivar]) ;
    end;

    procedure translateCategory(jo : ISuperObject; var pCategory : TRetCategoryDecision);
    var
      brn : Integer;
    begin
      pCategory.drc_CategoryID := jo.I['categoryID'];

      // translate private labels decisions
      for brn := Low(TPrivateLabels) to High(TPrivateLabels) do
        translatePrivateLabel(jo.A['privateLabelDecision'].O[brn - 1],pCategory.drc_PrivateLabels[brn]);
    end;

    procedure translateJson(jo : ISuperObject; var curDec : TRetDecision);
    var
      cat,marketStudies : Integer;
      pers  : TStorePerceptions;
    begin
      curDec.dr_RetailerID := currentRetailer;
      currentDecision.dr_NextBudgetExtension  := jo.D['nextBudgetExtension'];
      currentDecision.dr_ApprovedBudgetExtension  := jo.D['approvedBudgetExtension'];

      for marketStudies := Low(TMarketStudies) to High(TMarketStudies) do
       curDec.dr_MarketResearch[marketStudies] := jo.A['marketResearchOrder'].B[marketStudies-1];

      cat := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          currentDecision.dr_OnlineAdvertising[pers] := jo.A['onlineAdvertising'].D[cat];
          cat := cat + 1;
        end;
      cat := 0;
      for pers := Low(TStorePerceptions) to High(TStorePerceptions) do
        begin
          currentDecision.dr_TraditionalAdvertising[pers] := jo.A['tradtionalAdvertising'].D[cat];
          cat := cat + 1;
        end;
      //category
      for cat := Low(TCategories) to High(TCategories) do
        translateCategory(jo.A['retCatDecision'].O[cat - 1],currentDecision.dr_Categories[cat]);
      //markets
      for cat := Low(TMarkets) to High(TMarkets) do
        translateMarket(jo.A['retMarketDecision'].O[cat - 1], currentDecision.dr_Markets[cat]);
    end;


  procedure LoadConfigIni(vseminar : string);
  var
  ini : Tinifile;
  begin
    ini := TIniFile.Create(ExtractFilePath(ParamStr(0)) + 'CgiConfig.ini');
    with ini do
    begin
      DataDirectory := ini.ReadString('Options','DataDirectory','C:\E-project\ecgi\');
      DataDirectory := DataDirectory + vseminar + '\';
      ini.Free;
    end;
  end;

begin
  SetMultiByteConversionCodePage(CP_UTF8);
  sDati := '';
  sListData := TStringList.Create;
  sListData.Clear;
  try

    WriteLn('Content-type: application/json');
    Writeln;
    sValue := getVariable('REQUEST_METHOD');
    // GET
    //         .../producerDecision?period=x&seminar=xxx&producerID=x
    //I would expect to get JSON single record which is defined in Schema attached,
    //this should be coming from the translation result of related binary file.
    if sValue='GET' then
      begin

        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
        // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;
        currentRetailer := getRetailer;
        {** Read results file **}
        //generate dataDirectory depends on seminar
        LoadConfigIni(currentSeminar);
        vReadRes := ReadRetdecisionRecord(currentPeriod,currentRetailer,
          currentDecision,DataDirectory,currentSeminar); // read Decision file

        // Now let's make some JSON stuff here
        if vReadRes = 0 then
          makeJson;
      end
    else
    // POST
    //.../producerDecision
    //I would put a JSON data for single record in the POST request content,
    //it would be great if you can translate and write it into related binary files
    //and return a status code 200 if everything goes well on server side,
    //return 500 if something goes wrong
    begin
      sValue := trim(getVariable('CONTENT_LENGTH'));
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

        // initialize globals
        // read JSON data from post field
        oJsonFile := getJson;
        // these work only if JSON is correct, that is it keeps them
        currentSeminar := oJsonFile.S['seminar'];
        currentPeriod := oJsonFile.I['period'];
        currentRetailer := oJsonFile.I['retailerID'];

        // now we have process JSON and convert it into binary stucture
        translateJson(oJsonFile,currentDecision);
        oJsonFile.SaveTo('out.json', true, false);
        //geenerate dataDirectory based on seminar
        LoadConfigIni(currentSeminar);
        Writeln('dataDirectory:' + DataDirectory);
        // write tranlated JSON to binary file
        vReadRes := WriteRetdecisionRecord(currentPeriod,currentRetailer,
        currentDecision,DataDirectory,currentSeminar); // update Decision file

        // shake hands
        Writeln('Status : 200 OK');

      end;
    end;
  finally
    sListData.Free;
  end;
end.

