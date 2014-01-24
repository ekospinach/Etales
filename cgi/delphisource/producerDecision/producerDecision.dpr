program producerDecision;

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
  Classes, superobject, HCD_SystemDefinitions, System.TypInfo, iniFiles;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Common_Types.INC'}
{$I 'ET0_Results_Types.INC'}
{$I 'ET0_FILES_NAMES.INC'}

const
  DecisionFileName = ' Decisions.';
  dummyNo = 1;

  //had to remove this to test @ Linux
  //DatDir = '';
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

   currentDecision : TProDecision;
//	 prevDecision : TProDecision;
   currentPeriod : TPeriodNumber;
   currentProducer : TAllProducers;
   currentSeminar : string;
   vReadRes : Integer;

   oJsonFile : ISuperObject;

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

    function getProducer(): Integer;
    begin
      Result  := dummyNo;
      if sListData.IndexOfName('producerID') <> -1 then
        Result := StrToInt(sListData.Values['producerID']);
      if sListData.IndexOfName('producerid') <> -1 then
        Result  := StrToInt(sListData.Values['producerid']);
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
      partOne := 'Producer ';
      partNum := IntToStr(getProducer);
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

   function ReadProdecisionRecord(pPeriodNumber : TPeriodNumber;
   pProNumber : TAllProducers; var pDecision: TProdecision;
   vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
    var
      vFile    : file of TProdecision;
      vFileName   : String;
      vTempResult : integer;
    begin
      vFileName := vDataDirectory + ProducersDecisionsFilesNames[pProNumber] + vSeminarCode;
      if FileExists(vFileName) = false then
      begin
          Writeln('read ProducerDecision error, dataDirectory:' + DataDirectory);
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

   function WriteProdecisionRecord(pPeriodNumber : TPeriodNumber;
   pProNumber : TAllProducers; var pDecision: TProdecision;
   vDataDirectory : AnsiString; vSeminarCode : AnsiString) : Integer;
    var
      vFile    : file of TProdecision;
      vDecision : TProDecision;
      vFileName   : String;
      vTempResult : integer;
    begin
      vFileName := vDataDirectory + ProducersDecisionsFilesNames[pProNumber] + vSeminarCode;
      if FileExists(vFileName) = false then
      begin
          Writeln('write ProducerDecision error, dataDirectory:' + DataDirectory);
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

    function collectVariant(pVar : TProVarDecision): ISuperObject;
    var
      jo  : ISuperObject;
      I : Integer;
    begin
      jo  := SO;

//var proVarDecisionSchema = mongoose.Schema({
//    varName : String,
//    varID : Number, //varID = BrandID * 10 + varCount
//    parentBrandID : Number, //brandID
//    packFormat : String, //ECONOMY, STANDARD, PREMIUM
//    dateOfBirth : Number,
//    dateOfDeath : Number,
//    composition : [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
//    production : Number,
//    currentPriceBM : Number,
//    currentPriceEmall : Number,
//    discontinue : Boolean,
//    nextPriceBM : Number,
//    nextPriceEmall : Number
//})
      jo.S['varName'] := pVar.dpv_VarName;
      jo.I['varID'] := pVar.dpv_VarID;
      jo.I['parentBrandID'] := pVar.dpv_ParentBrandID;
      jo.S['packFormat']  := GetEnumName(TypeInfo(TVarPackFormat),Integer(pVar.dpv_PackFormat));
      jo.I['dateOfBirth'] := pVar.dpv_DateofBirth;
      jo.I['dateOfDeath'] := pVar.dpv_DateOfDeath;
      jo.D['production']  := pVar.dpv_Production;
      jo.D['currentPriceBM']  := pVar.dpv_CurrentPriceBM;
      jo.D['currentPriceEmall'] := pVar.dpv_CurrentPriceEmall;
      jo.B['discontinue'] := pVar.dpv_Discontinue;
      jo.D['nextPriceBM'] := pVar.dpv_NextPriceBM;
      jo.D['nextPriceEmall']  := pVar.dpv_NextPriceEmall;
      jo.O['composition'] := SA([]);
      for I := Low(TVarComposition) to High(TVarComposition) do
        jo.A['composition'].I[ I - 1 ] := pVar.dpv_Composition[I];

      Result  := jo;
    end;

    function collectBrand(pBrand : TProBrandDecision): ISuperObject;
    var
      jo  : ISuperObject;
      ivar : Integer;
    begin
      jo := SO;

//var proBrandDecisionSchema = mongoose.Schema({
//    brandName : String,
//    brandID : Number,
//    /*
//        case 'P': brandID = (10 * userCount) + brandCount
//        case 'R': brandID = (10 * (userCount +4)) + brandCount
//        userCount = 1~4
//        brandCount = 1~5
//    */
//    paranetCompanyID : Number, //TBrandOwners(Prod_1_ID~Ret_2_ID)
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
//    advertisingOffLine : [Number], //TMarketDetails, 1-Urban, 2-Rural
//    advertisingOnLine : Number,
//    supportEmall : Number,
//    supportTraditionalTrade : [Number], //TMarketDetails, 1-Urban, 2-Rural
//    proVarDecision : [proVarDecisionSchema] //Length: TOneBrandVars(1~3)
//})
      jo.S['brandName'] := pBrand.dpb_BrandName;
      jo.I['brandID'] := pBrand.dpb_BrandID;
      jo.I['paranetCompanyID']  := pBrand.dpb_ParentCompanyID;
      jo.I['dateOfBirth'] := pBrand.dpb_DateofBirth;
      jo.I['dateOfDeath'] := pBrand.dpb_DateOfDeath;
      jo.D['advertisingOnLine'] := pBrand.dpb_AdvertisingOnLine;
      jo.D['supportEmall'] := pBrand.dpb_SupportEmall;
      jo.O['advertisingOffLine']  := SA([]);
      jo.A['advertisingOffLine'].D[0] := pBrand.dpb_AdvertisingOffLine[Tier_Urban_ID];
      jo.A['advertisingOffLine'].D[1] := pBrand.dpb_AdvertisingOffLine[Tier_Rural_ID];
      jo.O['supportTraditionalTrade'] := SA([]);
      jo.A['supportTraditionalTrade'].D[0]  := pBrand.dpb_SupportTraditionalTrade[Tier_Urban_ID];
      jo.A['supportTraditionalTrade'].D[1]  := pBrand.dpb_SupportTraditionalTrade[Tier_Rural_ID] ;
      jo.O['proVarDecision']  := SA([]);
      for ivar := Low(TProVarsDecisions) to High(TProVarsDecisions) do
        jo.A['proVarDecision'].Add(collectVariant(pBrand.dpb_Variants[ivar]));

      Result  := jo;
    end;

    function collectCategory(pCategory : TProCatDecision): ISuperObject;
    var
      jo : ISuperObject;
      brn : Integer;
    begin
      jo := SO;
//var proCatDecisionSchema = mongoose.Schema({
//    categoryID : Number, //1~2
//    capacityChange : Number,
//    investInDesign : Number,/*E*/
//    investInProductionFlexibility : Number,
//    investInTechnology : Number,
//    proBrandsDecision : [proBrandDecisionSchema] //Length: TProBrands(1~5)
//})
      jo.I['categoryID'] := pCategory.dpc_CategoryID;
      jo.D['capacityChange'] := pCategory.dpc_CapacityChange;
      jo.D['investInDesign']  := pCategory.dpc_InvestInDesign;
      jo.D['investInProductionFlexibility'] := pCategory.dpc_InvestInProductionFlexibility;
      jo.D['investInTechnology']  := pCategory.dpc_InvestInTechnology;

      // collect brand decisions
      jo.O['proBrandsDecision'] := SA([]);
      for brn := Low(TProBrands) to High(TProBrands) do
        jo.A['proBrandsDecision'].Add(collectBrand(pCategory.dpc_Brands[brn]));

      Result := jo;
    end;

    function serveRequest() : ISuperObject;
    var
      jo : ISuperObject;
      cat : Integer;
    begin
      jo := SO; //initialise JSON object

//var proDecisionSchema = mongoose.Schema({
//    seminar : String,
//    period : Number,
//    producerID : Number, //1~4
//    nextBudgetExtension : Number,
//    approvedBudgetExtension : Number,
//    proCatDecision : [proCatDecisionSchema] //Length: TCategories(1~2)
//})
      jo.S['seminar'] := currentSeminar;
      jo.I['period'] := currentPeriod;
      jo.I['producerID'] := currentProducer;
      jo.D['nextBudgetExtension']  := currentDecision.dp_NextBudgetExtension;
      jo.D['approvedBudgetExtension']  := currentDecision.dp_ApprovedBudgetExtension;

      {** Data Collection **}
      jo.O['proCatDecision'] := SA([]);

      //build categories decisions
      //category
      for cat := Low(TCategories) to High(TCategories) do
          jo.A['proCatDecision'].Add( collectCategory(currentDecision.dp_CatDecisions[cat]) );

     Result := jo;

          //*** you need to add this to global JSON
      //s_str := j_o['fileName'].AsString;
      //j_o.SaveTo(s_str, true, false);
      //writeln('json_out :: ', j_o.AsJSon);
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

    procedure translateVariant(jo : ISuperObject; var pVar : TProVarDecision);
    begin
      StringToWideChar(jo.S['varName'],pVar.dpv_VarName,VarNameLength + 1);
      //pVar.dpv_VarName := jo.S['varName'];
      pVar.dpv_VarID := jo.I['varID'];
      pVar.dpv_ParentBrandID := jo.I['parentBrandID'];
      pVar.dpv_PackFormat  := TVarPackFormat(GetEnumValue(TypeInfo(TVarPackFormat),jo.S['packFormat']));
      pVar.dpv_DateofBirth := jo.I['dateOfBirth'];
      pVar.dpv_DateOfDeath := jo.I['dateOfDeath'];
      pVar.dpv_Production  := jo.D['production'];
      pVar.dpv_CurrentPriceBM  := jo.D['currentPriceBM'];
      pVar.dpv_CurrentPriceEmall := jo.D['currentPriceEmall'];
      pVar.dpv_Discontinue := jo.B['discontinue'];
      pVar.dpv_NextPriceBM := jo.D['nextPriceBM'];
      pVar.dpv_NextPriceEmall  := jo.D['nextPriceEmall'];
      for I := Low(TVarComposition) to High(TVarComposition) do
        pVar.dpv_Composition[I] := jo.A['composition'].I[ I - 1 ];

    end;

    procedure translateBrand(jo : ISuperObject; var pBrand : TProBrandDecision);
    var
      ivar : TOneBrandVars;
    begin
      StringToWideChar(jo.S['brandName'],pBrand.dpb_BrandName,BrandNameLength + 1);
      //pBrand.dpb_BrandName := jo.S['brandName'];
      pBrand.dpb_BrandID := jo.I['brandID'];
      pBrand.dpb_ParentCompanyID  := jo.I['paranetCompanyID'];
      pBrand.dpb_DateofBirth := jo.I['dateOfBirth'];
      pBrand.dpb_DateOfDeath := jo.I['dateOfDeath'];
      pBrand.dpb_AdvertisingOnLine := jo.D['advertisingOnLine'];
      pBrand.dpb_SupportEmall := jo.D['supportEmall'];
      pBrand.dpb_AdvertisingOffLine[Tier_Urban_ID] := jo.A['advertisingOffLine'].D[0];
      pBrand.dpb_AdvertisingOffLine[Tier_Rural_ID] := jo.A['advertisingOffLine'].D[1];
      pBrand.dpb_SupportTraditionalTrade[Tier_Urban_ID]  := jo.A['supportTraditionalTrade'].D[0];
      pBrand.dpb_SupportTraditionalTrade[Tier_Rural_ID]  := jo.A['supportTraditionalTrade'].D[1];
      for ivar := Low(TProVarsDecisions) to High(TProVarsDecisions) do
        translateVariant(jo.A['proVarDecision'].O[ivar - 1], pBrand.dpb_Variants[ivar]);

    end;

    procedure translateCategory(jo : ISuperObject; var pCategory : TProCatDecision);
    var
      brn : TProBrands;
    begin
      pCategory.dpc_CategoryID := jo.I['categoryID'];
      pCategory.dpc_CapacityChange := jo.D['capacityChange'];
      pCategory.dpc_InvestInDesign  := jo.D['investInDesign'];
      pCategory.dpc_InvestInProductionFlexibility := jo.D['investInProductionFlexibility'];
      pCategory.dpc_InvestInTechnology  := jo.D['investInTechnology'];

      // translate brand decisions
      for brn := Low(TProBrands) to High(TProBrands) do
        translateBrand(jo.A['proBrandsDecision'].O[brn - 1], pCategory.dpc_Brands[brn]);

    end;

    procedure translateJson(jo : ISuperObject; var curDec : TProDecision);
    var
      cat : TCategories;
    begin
      curDec.dp_ProducerID := currentProducer;
      curDec.dp_NextBudgetExtension  := jo.D['nextBudgetExtension'];
      curDec.dp_ApprovedBudgetExtension  := jo.D['approvedBudgetExtension'];

      //translate categories decisions
      //category
      for cat := Low(TCategories) to High(TCategories) do
          translateCategory(jo.A['proCatDecision'].O[cat - 1], curDec.dp_CatDecisions[cat]);

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
    if sValue='GET' then
      begin
        // GET
        // .../producerDecision?period=x&seminar=xxx&producerID=x
        //I would expect to get JSON single record which is defined in Schema attached,
        //this should be coming from the translation result of related binary file.
        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
        // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;
        currentProducer := getProducer;
        //generate dataDirectory depends on seminar
        LoadConfigIni(currentSeminar);
        {** Read results file **}
        vReadRes := ReadProdecisionRecord(currentPeriod,currentProducer,
          currentDecision,DataDirectory,currentSeminar); // read Decision file

       // Now let's make some JSON stuff here
        if vReadRes = 0 then
          makeJson;
      end
    else
    // POST
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
            bUpload := true;
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
        currentProducer := oJsonFile.I['producerID'];

        // now we have process JSON and convert it into binary stucture
        translateJson(oJsonFile,currentDecision);

        Writeln('currentProducer : ' + IntToStr(currentProducer));
        Writeln('currentPeriod : ' + IntToStr(currentPeriod));
        Writeln('currentSeminar : ' + currentSeminar);
        oJsonFile.SaveTo('out.json', true, false);

        //geenerate dataDirectory based on seminar
        LoadConfigIni(currentSeminar);
        Writeln('dataDirectory:' + DataDirectory);
        // write tranlated JSON to binary file
        vReadRes := WriteProdecisionRecord(currentPeriod,currentProducer,
          currentDecision,DataDirectory,currentSeminar); // update Decision file

        // shake hands
        Writeln('Status : 200 OK');

      end;
    end;
  finally
    sListData.Free;
  end;
end.

