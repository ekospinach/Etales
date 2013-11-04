program marketReport;

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

    function collectColumns(colType, curPeriod, curCategory :Integer): ISuperObject;
    var
      count : Integer;
    begin
      Result := SA([]);

      //series+periods  >> most of the charts
      if colType = colsItemPeriods then
        begin
          Result.O[''] := SO('{id: "0", labelENG: "Team", type: "string" }');
          // have to build it depending on # of periods we show
          //-3...lastHistoryPeriod
          Result.O[''] := SO('{id: "1", labelENG: "P-3", type: "number" }');
          Result.O[''] := SO('{id: "2", labelENG: "P-2", type: "number" }');
          Result.O[''] := SO('{id: "3", labelENG: "P-1", type: "number" }');
          Result.O[''] := SO('{id: "1", labelENG: "P0", type: "number" }');
          if (curPeriod > 0) and (curPeriod < TimeEnd) then
            begin
              for count := FutureStart to curPeriod do
                Result.O[''] := SO('{id: "1", labelENG: "P' +
                  IntToStr(count) + '", type: "number" }');
            end;
        end;

      //brand+cur+prev
      if colType = colsBrnPrevCur then
        begin
          Result.O[''] := SO('{id: "0", labelENG: "Brand", labelRUS: "Брэнд", labelCHN: "牌", type: "number" }');
          Result.O[''] := SO('{id: "1", labelENG: "Previous period", labelRUS: "Предыдущий период", labelCHN:  "上期", type: "number" }');
          Result.O[''] := SO('{id: "2", labelENG: "Current period", labelRUS: "Текущий период", labelCHN:  "本期", type: "number" }');
        end;

      //brand+segments
      if colType = colsBrnSeg then
        begin
          Result.O[''] := SO('{id: "0", labelENG: "Brand", labelRUS: "Брэнд", labelCHN: "牌", type: "string" }');
          // now we need to distinguish which category we use
          if curCategory = ElecsoriesID then
            begin
              Result.O[''] := SO('{id: "1", labelENG: "Price Sensitive", labelRUS: "Чувствительные к цене", labelCHN:  "股价敏感资料", type: "number" }');
              Result.O[''] := SO('{id: "2", labelENG: "Value for Money", labelRUS: "Соотношение цены и качества", labelCHN:  "抵食", type: "number" }');
              Result.O[''] := SO('{id: "3", labelENG: "Fashion", labelRUS: "Модники", labelCHN:  "时尚", type: "number" }');
              Result.O[''] := SO('{id: "4", labelENG: "Freaks", labelRUS: "Чудаки", labelCHN:  "怪胎", type: "number" }');
              Result.O[''] := SO('{id: "5", labelENG: "Total", labelRUS: "Итого", labelCHN:  "合计", type: "number" }');
            end;
          if curCategory = HealthBeautiesID then
            begin
              Result.O[''] := SO('{id: "1", labelENG: "Price Sensitive", labelRUS: "Чувствительные к цене", labelCHN:  "股价敏感资料", type: "number" }');
              Result.O[''] := SO('{id: "2", labelENG: "Value for Money", labelRUS: "Соотношение цены и качества", labelCHN:  "抵食", type: "number" }');
              Result.O[''] := SO('{id: "3", labelENG: "Health Conscious", labelRUS: "Заботящиеся о здоровьи", labelCHN:  "时尚", type: "number" }');
              Result.O[''] := SO('{id: "4", labelENG: "Impatient", labelRUS: "Нетерпеливые", labelCHN:  "急躁", type: "number" }');
              Result.O[''] := SO('{id: "5", labelENG: "Total", labelRUS: "Итого", labelCHN:  "合计", type: "number" }');
            end;
        end;

      //brand+channel
      if colType = colsBrnChannel then
        begin
          Result.O[''] := SO('{id: "0", labelENG: "Brand", labelRUS: "Брэнд", labelCHN: "牌", type: "string" }');
          Result.O[''] := SO('{id: "0", labelENG: "Retailer 1", labelRUS: "Ритейлер 1", labelCHN:  "零售商1", type: "number" }');
          Result.O[''] := SO('{id: "0", labelENG: "Retailer 2", labelRUS: "Ритейлер 2", labelCHN:  "零售商2", type: "number" }');
          Result.O[''] := SO('{id: "0", labelENG: "Traditional Trade", labelRUS: "Традиционная торговля", labelCHN:  "传统贸易", type: "number" }');
          Result.O[''] := SO('{id: "0", labelENG: "eMall", labelRUS: "и-Молл", labelCHN:  "网上商城", type: "number" }');
        end;

      //facts+cur+prev
      //facts+team
      //facts+cat
      //facts+brands
      //facts+variants
    end;

    function collectRowsPer(docType, curPeriod, curCat, curMkt : Integer; filter : Boolean=True): ISuperObject;
    var
      brn, seg : Integer;
      j_col, j_row : ISuperObject;
    begin
      Result := SA([]);
      for brn := Low(TBrands) to High(TBrands) do
      begin
        j_row := SO;
        j_col := SA([]);
        // first col with brand name
        j_col.O[''] :=
          SO('{"v": ' +
          WideCharToString(currentResult.r_Brands[curCat][brn].b_BrandName) +
          '}');
        // 2 cols with data
        // prev period
        j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            prevResult.r_Brands[curCat][brn].b_Awareness[curMkt] * 100)
            + '"}');
        // current period
        j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Brands[curCat][brn].b_Awareness[curMkt] * 100)
            + '"}');
        j_row['c'] := j_col;
        // filter out meaningless rows
        // currentResult.r_Brands[1][1].b_DateofBirth 10 {$A}
        // currentResult.r_Brands[1][1].b_DateOfDeath -4 {$FFFFFFFC}
        // seems to be meaningless, so we use b_BrandName to filter out empty
        if not filter then Result.O[''] := j_row;
        if filter and (j_row.S['c[0].v'] <> '') then Result.O[''] := j_row;
        //writeln(j_row.S['c[0].v']);
        end;
      end;

    function collectRowsSeg(docType, curPeriod, curCat, curMkt : Integer; filter : Boolean=True): ISuperObject;
    var
      brn, seg : Integer;
      j_col, j_row : ISuperObject;
    begin
      Result := SA([]);
      for brn := Low(TBrands) to High(TBrands) do
      begin
        j_row := SO;
        j_col := SA([]);
        // first col with brand name
        j_col.O[''] :=
          SO('{"v": ' +
          WideCharToString(currentResult.r_Brands[curCat][brn].b_BrandName) +
          '}');
        // n cols with data
        for seg := Low(TSegmentsTotal) to High(TSegmentsTotal) do
        begin
          case docType  of
            msMarketShareVol :  j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Brands[curCat][brn].b_VolumeMarketShare[curMkt][seg] * 100)
            + '"}');
            msMarketShareVal :  j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Brands[curCat][brn].b_ValueMarketShare[curMkt][seg] * 100)
            + '"}');
          end;
        end;
        j_row['c'] := j_col;
        // filter out meaningless rows
        // currentResult.r_Brands[1][1].b_DateofBirth 10 {$A}
        // currentResult.r_Brands[1][1].b_DateOfDeath -4 {$FFFFFFFC}
        // seems to be meaningless, so we use b_BrandName to filter out empty
        if not filter then Result.O[''] := j_row;
        if filter and (j_row.S['c[0].v'] <> '') then Result.O[''] := j_row;
        //writeln(j_row.S['c[0].v']);
        end;
      end;

    function collectRowsChan(docType, curPeriod, curCat, curMkt : Integer; filter: Boolean=True): ISuperObject;
    // we need to collect data by channels (aka retailers) - they are cols/cells here
    var
      brn, chan : Integer;
      j_col, j_row : ISuperObject;
    begin
      Result := SA([]);
      for brn := Low(TBrands) to High(TBrands) do
      begin
        j_row := SO;
        j_col := SA([]);
        // first col with brand name
        // brand may not be sold in the channel, so we have to take it from a
        // safer place, like total market brand results
        j_col.O[''] :=
          SO('{"v": ' +
           WideCharToString(
             //currentResult.r_Retailers[chan].rr_Quarters[curMkt][curCat].rq_BrandsResults[brn].rb_BrandName
             currentResult.r_Brands[curCat][brn].b_BrandName
             ) +
          '}');
        // n cols with data
        for chan := Low(TAllRetailers) to High(TAllRetailers) do
        begin
          case docType  of
            msAvgMarketPrice  :  j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Retailers[chan].rr_Quarters[curMkt][curCat].rq_BrandsResults[brn].rb_AverageNetMarketPrice)
            + '"}');
            msBrandVisibility :  j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Retailers[chan].rr_Quarters[curMkt][curCat].rq_BrandsResults[brn].rb_VisibilityShare)
            + '"}');
            msConsumerOfftake :  j_col.O[''] := SO('{"v": "' +
            FormatFloat('0.00',
            currentResult.r_Retailers[chan].rr_Quarters[curMkt][curCat].rq_BrandsResults[brn].rb_SalesVolume)
            + '"}');
          end;
        end;
        j_row['c'] := j_col;
        // filter out meaningless rows
        // currentResult.r_Brands[1][1].b_DateofBirth 10 {$A}
        // currentResult.r_Brands[1][1].b_DateOfDeath -4 {$FFFFFFFC}
        // seems to be meaningless, so we use b_BrandName to filter out empty
        if not filter then Result.O[''] := j_row;
        if filter and (j_row.S['c[0].v'] <> '') then Result.O[''] := j_row;
        //writeln(j_row.S['c[0].v']);
      end;
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

    function serveRequest(docType : Integer) : ISuperObject;
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
      if sListData.IndexOfName('period') <> -1 then
        currentPeriod := StrToInt(sListData.Values['period']);
      j_o.I['latestHistoryPeriod'] := currentPeriod;

      //document name
      case docType of
        msBrandAwareness    : s_str := 'Brand Awareness';
        msMarketShareVol    : s_str := 'Market Share (Volume)';
        msMarketShareVal    : s_str := 'Market Share (Value)';
        msAvgMarketPrice    : s_str := 'Average Net Market Price';
        msBrandVisibility   : s_str := 'Brand Visibility Share (shelf space + in-store activity)';
        msConsumerOfftake   : s_str := 'Consumer off-take';
      end;
      j_o.S['titleENG'] := s_str;

      //document name Russian
      case docType of
        msBrandAwareness    : s_str := 'Узнаваемость марки';
        msMarketShareVol    : s_str := 'Доля рынка (Объем)';
        msMarketShareVal    : s_str := 'Доля рынка (Стоимость)';
        msAvgMarketPrice    : s_str := 'Средневзвешенная рыночная цена';
        msBrandVisibility   : s_str := 'Видимость марки (полка + акции)';
        msConsumerOfftake   : s_str := 'Рыночные продажи';
      end;
      j_o.S['titleRUS'] := s_str;

      //document name
      case docType of
        msBrandAwareness    : s_str := '品牌意识';
        msMarketShareVol    : s_str := '市场份额（卷）';
        msMarketShareVal    : s_str := '市场份额（价值）';
        msAvgMarketPrice    : s_str := '平均净市场价格';
        msBrandVisibility   : s_str := '品牌知名度股份（货架空间+店内活动）';
        msConsumerOfftake   : s_str := '消费者承购';
      end;
      j_o.S['titleCHN'] := s_str;

      {** Read results file **}
      vReadRes := ReadResultsTwo(currentPeriod,currentResult,prevResult); // read results file
			

      {** Data Collection **}
      j_o.O['reportCollection'] := SA([]);

      //build chart object
      //category
      for cat := Low(TCategories) to High(TCategories) do
        //market
        for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
          begin
            j_ch := SO; // init chart object
            //add category, market header
            j_ch.S['category'] := aCategories[cat];
            j_ch.S['market'] := aMarkets[mkt];

            {** Data **}
            j_ch.O['data'] := SO;
            //cols
            case docType of
              msBrandAwareness    : j_ch['data.cols'] := collectColumns(colsBrnPrevCur,0,cat);
              msMarketShareVol    : j_ch['data.cols'] := collectColumns(colsBrnSeg,0,cat);
              msMarketShareVal    : j_ch['data.cols'] := collectColumns(colsBrnSeg,0,cat);
              msAvgMarketPrice    : j_ch['data.cols'] := collectColumns(colsBrnChannel,0,cat);
              msBrandVisibility   : j_ch['data.cols'] := collectColumns(colsBrnChannel,0,cat);
              msConsumerOfftake   : j_ch['data.cols'] := collectColumns(colsBrnChannel,0,cat);
            end;
            //rows
            case docType of
              msBrandAwareness    : j_ch['data.rows'] := collectRowsPer(msBrandAwareness,currentPeriod,cat,mkt);
              msMarketShareVol    : j_ch['data.rows'] := collectRowsSeg(msMarketShareVol,currentPeriod,cat,mkt);
              msMarketShareVal    : j_ch['data.rows'] := collectRowsSeg(msMarketShareVal,currentPeriod,cat,mkt);
              msAvgMarketPrice    : j_ch['data.rows'] := collectRowsChan(msAvgMarketPrice,currentPeriod,cat,mkt);
              msBrandVisibility   : j_ch['data.rows'] := collectRowsChan(msBrandVisibility,currentPeriod,cat,mkt);
              msConsumerOfftake   : j_ch['data.rows'] := collectRowsChan(msConsumerOfftake,currentPeriod,cat,mkt);
            end;
            //j_ch['data.rows'] := collectRows2(1,currentPeriod,cat,mkt);
            //add chart to Collection
            j_o.A['reportCollection'].Add(j_ch);
          end;

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
      oJsonFile := SA([]);
      oJsonFile[''] := serveRequest(msBrandAwareness);
      oJsonFile[''] := serveRequest(msMarketShareVol);
      oJsonFile[''] := serveRequest(msMarketShareVal);
      oJsonFile[''] := serveRequest(msAvgMarketPrice);
      oJsonFile[''] := serveRequest(msBrandVisibility);
      oJsonFile[''] := serveRequest(msConsumerOfftake);
      s_str := 'out' + '.json';
      oJsonFile.SaveTo(s_str, true, false);
      writeln(oJsonFile.AsJSon(False,False));
    end;

begin
    SetMultiByteConversionCodePage(CP_UTF8);
    sDati := '';
    sListData := TStringList.Create;
    sListData.Clear;

  try

    WriteLn('Content-type: application/json; charset=UTF-8');
    Writeln;


//    WriteLn('Content-type: text/html');
//    WriteLn;
//    WriteLn('<HTML>');
//    WriteLn('<HEAD>');
//    WriteLn('<TITLE>CGI Example!</TITLE>');
//    WriteLn('</HEAD>');
//    WriteLn('<BODY bgcolor="#FFFBDB">');
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


    // Now let's make some JSON stuff here
         makeJson;

//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

