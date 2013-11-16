program quarterHistoryInfo;

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
  dummyNo = 0;
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

  function categoryMarketViewSchema(pMarket, pCategory: Integer): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
//var categoryMarketViewSchema = mongoose.Schema({
//	//q...
//	segmentsVolumes : [Number]; //1~5, 5 for total
//})
    jo.O['segmentsVolumes'] := SA([]);
    for I := Low(TSegmentsTotal) to High(TSegmentsTotal) do
      jo.A['segmentsVolumes'].D[I - 1]  :=
        currentResult.r_Quarters[pMarket, pCategory].q_SegmentsVolumes[I];

    result  := jo;
  end;

  function categoryViewSchema(pCategory: Integer): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
//var categoryViewSchema = mongoose.Schema({
//	categoryMarketView = [categoryMarketViewSchema] //TMarketsTotal(1~3)
//})
    jo.O['categoryMarketView']  := SA([]);
    for I := Low(TMarketsTotal) to High(TMarketsTotal) do
      jo.A['categoryMarketView'].Add( categoryMarketViewSchema(I, pCategory) );

    result  := jo;
  end;

  function quarterHistoryInfoSchema(): ISuperObject;
  var
    jo: ISuperObject;
    I: Integer;
  begin
    jo  := SO;
//var quarterHistoryInfoSchema = mongoose.Schema({
//	period : Number,
//	seminar : String,
//	categoryView : [categoryViewSchema] //TCategoriesTotal(1~3)
//})
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.O['categoryView']  := SA([]);
    for I := Low(TCategoriesTotal) to High(TCategoriesTotal) do
      jo.A['categoryView'].Add( categoryViewSchema(I) );

    result  := jo;
  end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SO;
      oJsonFile := quarterHistoryInfoSchema;
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
//2.Brand History Information CGI
//Action : GET
//Parameters: period, seminar
//Route example: …/brandHistoryInfo?period=1&seminar=MAY
//Schema: brandHistoryInfo.js
//Response:
//status code 200, JSON record”S" which is defined in related schema, including all the brands which meets the specified parameters(seminar/period)
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

//          currentSeminar := oJsonFile['seminar'].AsString;
//          currentPeriod := oJsonFile['period'].AsInteger;
////
//          Writeln('currentPeriod : ' + IntToStr(currentPeriod));
//          Writeln('currentSeminar : ' + currentSeminar);
////
////      // now we have process JSON and convert it into binary stucture
//          fromJSONallDealSchema(currentAllDeals, oJsonFile);
////
////    {** Read results file **}
//          vReadRes := WriteNegoRecordByProDecision(currentPeriod,
//            currentAllDeals,DataDirectory,currentSeminar); // update Decision file
//
//    writeln(#10'press enter ...');
//    readln;
//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

