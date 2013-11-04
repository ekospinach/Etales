program perceptionMap;

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
  Classes, superobject, HCD_SystemDefinitions;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Common_Types.INC'}
{$I 'ET0_Results_Types.INC'}

const
  ResultsFileName = 'Results.';
  PerNo = 1;
  DatDir = 'C:\E-project\ecgi\';
  //had to remove this to test @ Linux
  //DatDir = '';
  dummySeminar = 'MAY';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

  msBrandAwareness    = 1;
  msMarketShareVol    = 2;
  msMarketShareVal    = 3;
  msAvgMarketPrice    = 4;
  msBrandVisibility   = 5;
  msConsumerOfftake   = 6;

  colsItemPeriods     = 1;
  colsBrnPrevCur      = 2;
  colsBrnSeg          = 3;
  colsBrnChannel      = 4;

var
   i: integer;
   sDati : string;
   sListData: tStrings;
   bUpload: boolean;
   sValue : string;
   iSize : integer;

   currentResult : TAllResults;
	 prevResult : TAllResults;
   currentPeriod : Integer;
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

    function getFileName(): AnsiString;
    begin
      Result := DatDir + 'Results' +'.' + dummySeminar;
      if sListData.IndexOfName('filepath') <> -1 then
        Result := DecodeUrl(sListData.Values['filepath']);
    end;

   Function ReadResultsTwo(PeriodNumber : TPeriodNumber; var OnePeriodResults, PrevPeriodResults : TAllResults ) : Integer;
    var
      ResultsFile : file of TAllResults;
      FileName    :  String;
      TempResult  : Integer;

    begin
      FileName := getFileName;

      if FileExists(FileName) = false then
      begin
          WriteLn('result file does not exist: ' + FileName);
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
            Seek( ResultsFile, PeriodNumber - HistoryStart - 1);
            Read( ResultsFile, PrevPeriodResults );						
            TempResult := 0;
          except
            on E: EInOutError do
            begin
              WriteLn( 'Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + FileName + #13 + #10 + E.Message );
              TempResult := E.ErrorCode;
            end;
          end;  { try }

      finally
          CloseFile( ResultsFile);
      end;

      Result := TempResult;

    end;

    function getSeminar(const filePath : string): string;
    var
      i_tmp : Integer;
    begin
      i_tmp := LastDelimiter('.',filePath) + 1;
      Result := Copy(filePath, i_tmp, 10);
    end;

    function getPeriod(): Integer;
    begin
      Result := PerNo;
      if sListData.IndexOfName('period') <> -1 then
         Result := StrToInt(sListData.Values['period']);
    end;

    function qFormat(data: Single): string;
    begin
      Result := '';
      Result := '(' ;
      if data > 0 then Result := Result + '+' + FormatFloat('0.00',data) + ')' + 'UP';
      if data < 0 then Result := Result + FormatFloat('0.00',data) + ')' + 'DOWN';
      if data = 0 then Result := Result + FormatFloat('0.00',data) + ')' + 'SAME';
    end;

    function buildOneBrand(cat,mkt,brn: Integer): ISuperObject;
    var
      j_o, j_t: ISuperObject;
      t_brn, t_pre : TBrandResults;
      si_tmp : Single;
      s_tmp : string;
    begin
      // init
      Result := nil;
      j_o := SO;
      t_brn := currentResult.r_Brands[cat][brn];
      t_pre := prevResult.r_Brands[cat][brn];
      with t_brn do
      begin
        s_tmp := WideCharToString( b_BrandName );
        // *** OA check if brand exists, using name for now
        if s_tmp = '' then  Exit ;
        j_o.S['brandName'] := s_tmp;
        j_o.I['color'] := 0;
        // perception 1
        case cat of
          ElecsoriesID     : s_tmp := '{labelENG: "Ease of use", ' +
            'labelRUS: "Простота применения",' +
            'labelCHN: "易用性", ';
          HealthBeautiesID : s_tmp := '{labelENG: "Performance", ' +
            'labelRUS: "Эффективность",' +
            'labelCHN: "性能", ';
        end;
        s_tmp := s_tmp + 'Value: "' + FormatFloat('0.00', b_Perception[mkt][1]);
        si_tmp := b_Perception[mkt][1] - t_pre.b_Perception[mkt][1];
        s_tmp := s_tmp + qFormat(si_tmp)  ;
        s_tmp := s_tmp +  '" }';
        j_t := SO(s_tmp);
        j_o.O['easeOfUsePerception'] := j_t;

        // perception 2
        case cat of
          ElecsoriesID     : s_tmp := '{labelENG: "Quality", ' +
            'labelRUS: "Качество",' +
            'labelCHN: "质量", ';
          HealthBeautiesID : s_tmp := '{labelENG: "Gentleness", ' +
            'labelRUS: "Мягкость",' +
            'labelCHN: "温柔", ';
        end;
        s_tmp := s_tmp + 'Value: "' + FormatFloat('0.00', b_Perception[mkt][2]);
        si_tmp := b_Perception[mkt][2] - t_pre.b_Perception[mkt][2];
        s_tmp := s_tmp + qFormat(si_tmp);
        s_tmp := s_tmp + '" }';
        j_t := SO(s_tmp);
        j_o.O['qualityPerception'] := j_t;

        // perception 3
        case cat of
          ElecsoriesID     : s_tmp := '{labelENG: "Price", ' +
            'labelRUS: "Цена",' +
            'labelCHN: "价格", ';
          HealthBeautiesID : s_tmp := '{labelENG: "Price", ' +
            'labelRUS: "Цена",' +
            'labelCHN: "价格", ';
        end;
        s_tmp := s_tmp + 'Value: "' + FormatFloat('0.00', b_Perception[mkt][3]);
        si_tmp := b_Perception[mkt][3] - t_pre.b_Perception[mkt][3];
        s_tmp := s_tmp + qFormat(si_tmp);
        s_tmp := s_tmp + '" }';
        j_t := SO(s_tmp);
        j_o.O['pricePerception'] := j_t;

        // market share
        s_tmp := '{labelENG: "Market Share", ' +
            'labelRUS: "Доля рынка",' +
            'labelCHN: "市场份额", ' +
            'Value: "' +
            FormatFloat('0.00', b_ValueMarketShare[mkt][SegmentsMaxTotal] * 100);
        si_tmp := b_ValueMarketShare[mkt][SegmentsMaxTotal] - t_pre.b_ValueMarketShare[mkt][SegmentsMaxTotal];
        s_tmp := s_tmp + qFormat(si_tmp);
        s_tmp := s_tmp + '" }';
        j_t := SO(s_tmp);
        j_o.O['marketShare'] := j_t;

        // brand awareness
        s_tmp := '{labelENG: "Brand Awareness", ' +
            'labelRUS: "Узнаваемость марки",' +
            'labelCHN: "品牌意识", ' +
            'Value: "' +
            FormatFloat('0.00', b_Awareness[mkt] * 100);
        si_tmp := b_Awareness[mkt] - t_pre.b_Awareness[mkt];
        s_tmp := s_tmp + qFormat(si_tmp);
        s_tmp := s_tmp + '" }';
        j_t := SO(s_tmp);
        j_o.O['brandAwareness'] := j_t;

        // visibility Share
        s_tmp := '{labelENG: "Visibility Share", ' +
            'labelRUS: "Доля видимости",' +
            'labelCHN: "能见度股份", ' +
            'Value: "' +
            FormatFloat('0.00', b_VisibilityShare[mkt] * 100);
        si_tmp := b_VisibilityShare[mkt] - t_pre.b_VisibilityShare[mkt];
        s_tmp := s_tmp + qFormat(si_tmp);
        s_tmp := s_tmp + '" }';
        j_t := SO(s_tmp);
        j_o.O['visibilityShare'] := j_t;

      end;
      Result := j_o;
    end;

    function buildOnePage(cat,mkt: Integer): ISuperObject;
    var
      j_o, j_t: ISuperObject;
      brn: Integer;
    begin
      j_o := SO;
      j_o.S['titleENG'] := 'Perceptions Map';
      j_o.S['titleCHN'] := '认知地图';
      j_o.S['titleRUS'] := 'Карта предпочтений';
      j_o.S['category'] := aCategories[cat];
      j_o.S['market'] := aMarkets[mkt];
      j_o.O['brandCollection'] := SA([]);
      for brn := Low(TBrands) to High(TBrands) do
        begin
          j_t := buildOneBrand(cat,mkt,brn);
          if j_t <> nil then j_o.A['brandCollection'].Add(j_t);
        end;
      Result := j_o;
    end;

    function serveRequest() : ISuperObject;
    var
      j_ch, j_o : ISuperObject;
      s_str : string;
      cat, mkt : Integer;
    begin
      j_o := SO; //initialise JSON object

      {** Header **}
      //seminar ***
      //if sListData.IndexOfName('seminar') <> -1 then
      //  currentSeminar := sListData.Values['seminar'];
      j_o.S['Seminar'] := currentSeminar;

      //filename ***
      j_o.S['fileName'] := getFileName;

      //period OR latestHistoryPeriod
      j_o.I['latestHistoryPeriod'] := currentPeriod;

      {** Data Collection **}
      j_o.O['pageCollection'] := SA([]);

      //build chart object
      //category
      for cat := Low(TCategories) to High(TCategories) do
        //market
        for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
          j_o.A['pageCollection'].Add( buildOnePage(cat,mkt) );

     Result := j_o;

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

//    {$ifdef WINDOWS}
//    procedure WriteLnUTF8(s:string);
//    var
//      bw:dword;
//    begin
//      s := s + #13#10;
//      WriteConsole(GetStdHandle(STD_OUTPUT_HANDLE),@s[1],length(s),bw,nil);
//    end;
//{$else}
//    procedure WriteLnUTF8(s:string);
//    begin
//      writeln(s);
//    end;
//{$endif}

begin
    SetMultiByteConversionCodePage(CP_UTF8);
    sDati := '';
    sListData := TStringList.Create;
    sListData.Clear;
//    SetConsoleOutputCP(CP_UTF8);

  try

    WriteLn('Content-type: application/json');
//    WriteLn('Content-type: application/json; charset=UTF-8');
    Writeln;
//    WritelnUTF8('认知地图');
//    Writeln(AnsiToUtf8('认知地图'));

//    Writeln(UTF8String('Карта предпочтений'));

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
        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
//        WriteLn('<H4>Values passed in mode <i>get http</i> :</H4>'+sDati);
//        for i:= 0 to sListData.Count-1 do
//           WriteLn(DecodeUrl(sListData[i])+'<BR>');
      end
    else
      // POST
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

    // initialize globals
    currentSeminar := getSeminar(getFileName);
    currentPeriod := getPeriod;

    {** Read results file **}
      vReadRes := ReadResultsTwo(currentPeriod,currentResult,prevResult); // read results file


    // Now let's make some JSON stuff here
         makeJson;

//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

