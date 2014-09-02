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

{$I 'ET1_Common_Constants.INC'}
{$I 'ET1_Common_Types.INC'}
{$I 'ET1_Results_Types.INC'}
{$I 'ET1_FILES_NAMES.INC'}

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

    function collectVariant(pVar : TProVariantDecision): ISuperObject;
    var
      jo,jt  : ISuperObject;
      I : Integer;
    begin
      jo  := SO;

      jo.S['varName'] := pVar.dpv_VarName;
      jo.I['varID'] := pVar.dpv_VarID;
      jo.I['parentBrandID'] := pVar.dpv_ParentBrandID;
      jo.S['packFormat']  := GetEnumName(TypeInfo(TVariantPackFormat),Integer(pVar.dpv_PackFormat));
      jo.I['dateOfBirth'] := pVar.dpv_DateofBirth;
      jo.I['dateOfDeath'] := pVar.dpv_DateOfDeath;
      jo.D['production']  := pVar.dpv_Production;
      jo.B['discontinue'] := pVar.dpv_Discontinue;
      jo.D['currentPriceBM']  := pVar.dpv_CurrentPriceBM;
      jo.D['nextPriceBM'] := pVar.dpv_NextPriceBM;
      jo.O['composition'] := SA([]);
      for I := Low(TVariantComposition) to High(TVariantComposition) do
        jo.A['composition'].I[ I - 1 ] := pVar.dpv_Composition[I];

      //Modified by Hao, 2014-Apr-30
      //      jo.D['currentPriceEmall'] := pVar.dpv_CurrentPriceEmall;
      //      jo.D['nextPriceEmall']  := pVar.dpv_NextPriceEmall;
      jo.D['onlinePrice'] := pVar.dpv_OnLinePrice;
      jo.D['onlinePlannedVolume'] := pVar.dpv_OnlinePlannedVolume;

      //modified by Hao, 2014-July-14    
      jo.D['channelPreference'] := pVar.dpv_ChannelPreference;            
      
      jt := SO;
      jt.I['promo_Frequency'] := pVar.dpv_PricePromotions.promo_Frequency;
      jt.D['promo_Rate']  := pVar.dpv_PricePromotions.promo_Rate;
      jo.O['pricePromotions'] := jt;

      Result  := jo;
    end;

    function collectBrand(pBrand : TProBrandDecision): ISuperObject;
    var
      jo  : ISuperObject;
      ivar : Integer;
    begin
      jo := SO;

      jo.S['brandName'] := pBrand.dpb_BrandName;
      jo.I['brandID'] := pBrand.dpb_BrandID;
      jo.I['parentCompanyID']  := pBrand.dpb_ParentCompanyID;
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
      for ivar := Low(TProVariantsDecisions) to High(TProVariantsDecisions) do
        jo.A['proVarDecision'].Add(collectVariant(pBrand.dpb_Variants[ivar]));

      Result  := jo;
    end;

    function collectCategory(pCategory : TProCatDecision): ISuperObject;
    var
      jo : ISuperObject;
      brn : Integer;
    begin
      jo := SO;
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
      cat,marketStudies : Integer;
    begin
      jo := SO; //initialise JSON object
      jo.S['seminar'] := currentSeminar;
      jo.I['period'] := currentPeriod;
      jo.I['producerID'] := currentProducer;
      jo.D['nextBudgetExtension']  := currentDecision.dp_NextBudgetExtension;
      jo.D['approvedBudgetExtension']  := currentDecision.dp_ApprovedBudgetExtension;

      {** Data Collection **}
      jo.O['proCatDecision'] := SA([]);

      //fill array for MarketResearchOrder
      jo.O['MarketResearchOrder'] := SA([]);
      for marketStudies := Low(TMarketStudies) to High(TMarketStudies) do
        jo.A['MarketResearchOrder'].B[marketStudies - 1] = currentDecision.dp_MarketResearch[marketStudies];

      //build categories decisions
      //category
      for cat := Low(TCategories) to High(TCategories) do
          jo.A['proCatDecision'].Add( collectCategory(currentDecision.dp_CatDecisions[cat]) );
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

    procedure translateVariant(jo : ISuperObject; var pVar : TProVariantDecision);
    begin
      StringToWideChar(jo.S['varName'],pVar.dpv_VarName,VarNameLength + 1);
      //pVar.dpv_VarName := jo.S['varName'];
      pVar.dpv_VarID := jo.I['varID'];
      pVar.dpv_ParentBrandID := jo.I['parentBrandID'];
      pVar.dpv_PackFormat  := TVariantPackFormat(GetEnumValue(TypeInfo(TVariantPackFormat),jo.S['packFormat']));
      pVar.dpv_DateofBirth := jo.I['dateOfBirth'];
      pVar.dpv_DateOfDeath := jo.I['dateOfDeath'];
      pVar.dpv_Production  := jo.D['production'];
      pVar.dpv_CurrentPriceBM  := jo.D['currentPriceBM'];
      pVar.dpv_Discontinue := jo.B['discontinue'];
      pVar.dpv_NextPriceBM := jo.D['nextPriceBM'];
      for I := Low(TVariantComposition) to High(TVariantComposition) do
        pVar.dpv_Composition[I] := jo.A['composition'].I[ I - 1 ];

      //Modified by Hao, 2014-Apr-30
      // pVar.dpv_NextPriceEmall  := jo.D['nextPriceEmall'];
      // pVar.dpv_CurrentPriceEmall := jo.D['currentPriceEmall'];
      pVar.dpv_OnLinePrice := jo.D['onlinePrice'];
      pVar.dpv_OnlinePlannedVolume := jo.D['onlinePlannedVolume'];
      pVar.dpv_ChannelPreference := jo.D['channelPreference'];

      pVar.dpv_PricePromotions.promo_Frequency := jo.I['pricePromotions.promo_Frequency'];
      pVar.dpv_PricePromotions.promo_Rate  := jo.D['pricePromotions.promo_Rate'];      

    end;

    procedure translateBrand(jo : ISuperObject; var pBrand : TProBrandDecision);
    var
      ivar : TOneBrandVariants;
    begin
      StringToWideChar(jo.S['brandName'],pBrand.dpb_BrandName,BrandNameLength + 1);
      //pBrand.dpb_BrandName := jo.S['brandName'];
      pBrand.dpb_BrandID := jo.I['brandID'];
      pBrand.dpb_ParentCompanyID  := jo.I['parentCompanyID'];
      pBrand.dpb_DateofBirth := jo.I['dateOfBirth'];
      pBrand.dpb_DateOfDeath := jo.I['dateOfDeath'];
      pBrand.dpb_AdvertisingOnLine := jo.D['advertisingOnLine'];
      pBrand.dpb_SupportEmall := jo.D['supportEmall'];
      pBrand.dpb_AdvertisingOffLine[Tier_Urban_ID] := jo.A['advertisingOffLine'].D[0];
      pBrand.dpb_AdvertisingOffLine[Tier_Rural_ID] := jo.A['advertisingOffLine'].D[1];
      pBrand.dpb_SupportTraditionalTrade[Tier_Urban_ID]  := jo.A['supportTraditionalTrade'].D[0];
      pBrand.dpb_SupportTraditionalTrade[Tier_Rural_ID]  := jo.A['supportTraditionalTrade'].D[1];
      for ivar := Low(TProVariantsDecisions) to High(TProVariantsDecisions) do
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
      curDec.dp_MarketResearch

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

