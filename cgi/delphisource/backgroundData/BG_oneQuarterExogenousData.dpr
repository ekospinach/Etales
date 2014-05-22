program BG_oneQuarterExogenousData;

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
  Classes, superobject, System.TypInfo, inifiles, CgiCommonFunction;


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

   aMarket      : TMarkets;
   aCategory    : TCategories;
   ReturnStatus : LongWord;
   MarketsNow                  : TMarketsSet;
   CategoriesNow               : TCategoriesSet;
   Markets_IDs                 : TMarketsBytes;
   Categories_IDs              : TCategoriesBytes;

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


  function producerViewSchema(pProducer: Integer): ISuperObject;
  var
    jo: ISuperObject;
    vProd: TSupplierConfidentialReport;
    I: Integer;
  begin
    jo  := SO;

    vProd := currentResult.r_SuppliersConfidentialReports[pProducer];
    jo.I['producerID']  := pProducer;
    jo.D['budgetAvailable'] := vProd.scr_Info.scrInfo_BudgetAvailable;
    jo.D['budgetOverspent'] := vProd.scr_Info.scrInfo_BudgetOverspent;
    jo.D['budgetSpentToDate'] := vProd.scr_Info.scrInfo_BudgetSpentToDate;

    jo.O['productionCapacity']  := SA([]);
    for I := Low(TCategories) to High(TCategories) do
      jo.A['productionCapacity'].D[I - 1]  := vProd.scr_Info.scrInfo_ProductionCapacity[I];

    jo.O['acquiredTechnologyLevel']  := SA([]);
    for I := Low(TCategories) to High(TCategories) do
      jo.A['acquiredTechnologyLevel'].D[I - 1]  := vProd.scr_Info.scrInfo_AcquiredTechnologyLevel[I];

    jo.O['acquiredProductionFlexibility']  := SA([]);
    for I := Low(TCategories) to High(TCategories) do
      jo.A['acquiredProductionFlexibility'].D[I - 1]  := vProd.scr_Info.scrInfo_AcquiredProductionFlexibility[I];

    jo.O['acquiredDesignLevel']  := SA([]);
    for I := Low(TCategories) to High(TCategories) do
      jo.A['acquiredDesignLevel'].D[I - 1]  := vProd.scr_Info.scrInfo_AcquiredDesignLevel[I];

    result  := jo;
  end;

  function retailerViewSchema(vRetailer: Integer): ISuperOBject;
  var
    jo: ISuperObject;
    vRet: TRetailerConfidentialReport;
  begin
    jo  := SO;
//var retailerViewSchema = mongoose.Schema({
//	retailerID : Number, (1~4)
//	//rr....
//	budgetAvailable : Number,
//	budgetOverspent : Number,
//	budgetSpentToDate : Number
//})
    vRet  := currentResult.r_RetailersConfidentialReports[vRetailer];
    jo.I['retailerID']  := vRetailer;
    jo.D['budgetAvailable'] := vRet.rcr_Info.rcrInfo_BudgetAvailable;
    jo.D['budgetOverspent'] := vRet.rcr_Info.rcrInfo_BudgetOverspent;
    jo.D['budgetSpentToDate'] := vRet.rcr_Info.rcrInfo_BudgetSpentToDate;

    Result  := jo;    
  end;

  function oneQuarterExogenousDataSchema(marketID : Integer; catID : Integer): ISuperObject;
  var
    jo: ISuperObject;
    prd, ret: Integer;
  begin
    jo  := SO;
//var oneQuarterExogenousDataSchema = mongoose.Schema({
//    seminar    : String,
//    period     : Number,
//    marketID   : Number,
//    categoryID : Number,
//    MinBMPriceVsCost                : Number,
//    MaxBMPriceVsCost                : Number,
//    IngredientsQualityVsATLGap      : Number,
//    ActiveAgentVsSmoothenerGap      : Number,
//    MaxTargetVolumeVsTotalMarket    : Number,
//    MinOnlinePriceVsCost            : Number,
//    MaxOnlinePriceVsCost            : Number,
//    MaxCapacityReduction            : Number,
//    MaxCapacityIncrease             : Number,
//    Supplier4AcquiredLevelsGapForPL : Number,
//    MinPLPriceVsCost                : Number,
//    MaxPLPriceVsCost                : Number,
//    MinRetailPriceVsNetBMPrice      : Number,
//    MaxRetailPriceVsNetBMPrice      : Number,
//})
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.S['marketID'] := IntToStr(marketID);
    jo.S['categoryID'] := IntToStr(catID);

    jo.D['MinBMPriceVsCost']                := XNOW[marketID, catID].MinBMPriceVsCost;
    jo.D['MaxBMPriceVsCost']                := XNOW[marketID, catID].MaxBMPriceVsCost;
    jo.D['IngredientsQualityVsATLGap']      := XNOW[marketID, catID].IngredientsQualityVsATLGap;
    jo.D['ActiveAgentVsSmoothenerGap']      := XNOW[marketID, catID].ActiveAgentVsSmoothenerGap;
    jo.D['MaxTargetVolumeVsTotalMarket']    := XNOW[marketID, catID].MaxTargetVolumeVsTotalMarket;
    jo.D['MinOnlinePriceVsCost']            := XNOW[marketID, catID].MinOnlinePriceVsCost;
    jo.D['MaxOnlinePriceVsCost']            := XNOW[marketID, catID].MaxOnlinePriceVsCost;
    jo.D['MaxCapacityReduction']            := XNOW[marketID, catID].MaxCapacityReduction;
    jo.D['MaxCapacityIncrease']             := XNOW[marketID, catID].MaxCapacityIncrease;
    jo.D['Supplier4AcquiredLevelsGapForPL'] := XNOW[marketID, catID].Supplier4AcquiredLevelsGapForPL;
    jo.D['MinPLPriceVsCost']                := XNOW[marketID, catID].MinPLPriceVsCost;
    jo.D['MaxPLPriceVsCost']                := XNOW[marketID, catID].MaxPLPriceVsCost;
    jo.D['MinRetailPriceVsNetBMPrice']      := XNOW[marketID, catID].MinRetailPriceVsNetBMPrice;
    jo.D['MaxRetailPriceVsNetBMPrice']      := XNOW[marketID, catID].MaxRetailPriceVsNetBMPrice;

    result  := jo;
  end;

    procedure makeJson();
    var
      s_str : string;
      marketID: Integer;
      catID: Integer;
    begin
      oJsonFile := SA([]);
      for marketID := Low(TMarkets) to High(TMarkets) do
      begin
        for catID := Low(TCategories) to High(TCategories) do
        begin
           oJsonFile[''] := oneQuarterExogenousDataSchema(marketID, catID);
        end;
      end;

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
        // GET
        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
        LoadConfigIni();
    // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;

        Markets_IDs[1]    := 1;
        Markets_IDs[2]    := 2;
        Categories_IDs[1] := 1;
        Categories_IDs[2] := 2;

        MarketsNow := [];
        for aMarket := 1 to MrktsMax do
          if ( Markets_IDs[aMarket] > 0 ) then MarketsNow := MarketsNow + [aMarket];

        CategoriesNow := [];
        for aCategory := 1 to CatsMax do
          if ( Categories_IDs[aCategory] > 0 ) then CategoriesNow := CategoriesNow + [aCategory];

        //WriteLn(GetCurrentDir);
        SetGlobalNames;
        ReturnStatus := ReadExogenousFile( GetCurrentDir + '\', MarketsNow, CategoriesNow, Markets_IDs, Categories_IDs, currentPeriod );
        if ( ReturnStatus = err_ExogenousFileRead_OK ) then
        begin
           makeJson;
        end
        else
        begin
          Writeln('Read Exogenous failed :' + IntToStr(ReturnStatus));
        end;

      end


  finally
    sListData.Free;
  end;
end.

