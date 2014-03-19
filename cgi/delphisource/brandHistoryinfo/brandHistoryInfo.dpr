program brandHistoryInfo;

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
  Classes, superobject, HCD_SystemDefinitions, System.TypInfo, inifiles;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Common_Types.INC'}
{$I 'ET0_Results_Types.INC'}
{$I 'ET0_FILES_NAMES.INC'}

const
  DecisionFileName = 'Negotiations.';
  dummyNo = 0;

  dummySeminar = 'MAY';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

var
   DataDirectory : string;
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

  function channelViewSchema(pRetailer, pCategory, pBrand: Integer): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
    //var channelViewSchema = mongoose.Schema({
    //    visibilityShare : [Number] //length: TMarketsTotalDetails(1~3)
    //})
    jo.O['visibilityShare'] := SA([]);
    for I := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['visibilityShare'].D[I - 1] :=
        currentResult.r_Retailers[pRetailer].rr_Quarters[I,pCategory].rq_BrandsResults[pBrand].rb_VisibilityShare;

    result  := jo;
  end;

  function perceptionDataSchema(var curBrandPerception: TVariantPerceptionsData): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SA([]);
    //var perceptionDataSchema = mongoose.Schema){
    //    perceptionData : [Number] //length: TVarPerceptions (1~VariantDimsMaxFull)
    //    //VariantDimsMaxFull = VariantDimsMax(3) + AllRetsMaxTotal(5);  { ... as above plus specific price perceptions at
    //    //1-Ease of Use perception(Performance perception)
    //    //2-Quality perception(Gentleness perception)
    //    //3-Price Perception
    //}
    for I := Low(TVarPerceptions) to High(TVarPerceptions) do
      jo.D['']  := curBrandPerception[I];

    Result  := jo;
  end;

  function supplierViewSchema(var curBrand: TBrandResults): ISuperObject;
  var
    jo, jt: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
    //var supplierViewSchema = mongoose.Schema({
    //    //b...
    //    perception : [perceptionDataSchema] //length: TMarkets(1~2)
    //    awareness : [Number], //length: TMarketsDetails(1~2)
    //    socialNetworksScore : [{
    //        sentiment : Number,
    //        strength : Number
    //    }]    //length: TMarketsTotalDetails(1~3)
    //})
    jo.O['perception']  := SA([]);
    jo.O['awareness'] := SA([]);
    for I := Low(TMarkets) to High(TMarkets) do
      begin
        jo.A['perception'].Add(perceptionDataSchema(curBrand.b_Perception[I]));
        jo.A['awareness'].D[I - 1] := curBrand.b_Awareness[I];
      end;
    jo.O['socialNetworksScore'] := SA([]);
    for I := Low(TMarketsTotal) to High(TMarketsTotal) do
      begin
        jt  := SO;
        jt.D['sentiment'] := curBrand.b_SocialNetworksScore[I][SENTIMENT];
        jt.D['strength']  := curBrand.b_SocialNetworksScore[I][STRENGTH];
        jo.A['socialNetworksScore'].Add(jt);
      end;

     result := jo;
  end;

  function brandHistoryInfoSchema(var curBrand: TBrandResults;
    pCategory: TCategories; pBrand: TBrands): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
    //var brandHistoryInfoSchema = mongoose.Schema({
    //    period : Number,
    //    seminar : String,
    //    brandName : String,
    //    brandID : Number,
    //    dateOfBirth : Number, //-4~10
    //    dateOfDeath : Number, //-4~10
    //    parentCatID : Number,
    //    parentCompanyID : Number, //(1~9)
    //
    //    supplierView : [supplierViewSchema],
    //    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
    //})
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.S['brandName'] := curBrand.b_BrandName;
    jo.I['brandID'] := curBrand.b_BrandID;
    jo.I['dateOfBirth'] := curBrand.b_DateofBirth;
    jo.I['dateOfDeath'] := curBrand.b_DateOfDeath;
    jo.I['parentCatID'] := pCategory;
    jo.I['parentCompanyID'] := curBrand.b_ParentCompanyID;
    jo.O['supplierView']  := SA([]);
    jo.A['supplierView'].Add( supplierViewSchema(curBrand) );
    jo.O['channelView'] := SA([]);
    for I := Low(TAllRetailers) to High(TAllRetailers) do
      jo.A['channelView'].Add( channelViewSchema(I, pCategory, pBrand) );

    result  := jo;
  end;

  function collectAllBrands(): ISuperObject;
  var
    jo: ISuperObject;
    I, cat: Integer;
  begin
    jo  := SA([]);
    for cat := Low(TCategories) to High(TCategories) do
      for I := Low(TBrands) to High(TBrands) do
        jo['']  := brandHistoryInfoSchema(currentResult.r_Brands[cat][I], cat, I);

    Result  := jo;
  end;

  procedure makeJson();
  var
    s_str : string;
  begin
    oJsonFile := SO;
    oJsonFile := collectAllBrands;
    s_str := 'out' + '.json';
    writeln( oJsonFile.AsJSon(False,False));
    oJsonFile.SaveTo(s_str, true, false);
  end;

  procedure LoadConfigIni();
  var
  ini : Tinifile;
  begin
    ini := TIniFile.Create(ExtractFilePath(ParamStr(0)) + 'CgiConfig.ini');
    with ini do
    begin
      DataDirectory := ini.ReadString('Options','DataDirectory','C:\E-project\ecgi\');
      DataDirectory := DataDirectory + getSeminar + '\';
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
          sValue := getVariable('QUERY_STRING');
          Explode(sValue, sListData);
          LoadConfigIni();
          // initialize globals
          currentSeminar := getSeminar;
          currentPeriod := getPeriod;
          {** Read results file **}
          vReadRes := ReadResults(currentPeriod, currentSeminar, DataDirectory,currentResult); // read Results file
          // Now let's make some JSON stuff here
          if vReadRes = 0 then
            makeJson;
        end

    finally
      sListData.Free;
    end;
end.

