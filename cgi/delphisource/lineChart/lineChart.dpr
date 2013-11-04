program lineChart;

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
  aCategories : array[TCategoriesTotal] of string = ('Elecsories', 'HealthBeauties', 'Total');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');
  aRetailers : array[TAllRetailers] of string =
    ('Retailer 1', 'Retailer 2', 'Traditional Trade', 'e-Mall');
  aProducers : array[TAllProducers] of string =
    ('Producer 1', 'Producer 2', 'Producer 3', 'Producer 4');
  aRoles : array[1..3] of string =
    ('Retailer', 'Producer', 'Admin');

  roleRetailer        = 1;
  roleProducer        = 2;
  roleAdmin           = 3;

  grpProfitAbs        = 10;
  grpProfitRel        = 20;
  grpExpense          = 30;
  grpWholesale        = 40;
  grpRetail           = 50;
  grpCash             = 60;
  grpOnline           = 70;
  grpEfficiency       = 80;

  scrNetSalesVal      = 11;
  scrGP               = 12;
  scrOP               = 13;
  scrNP               = 14;
  scrGPM              = 21;
  scrOPM              = 22;
  scrNPM              = 23;
  scrMaterialCost     = 31;
  scrAdvertising      = 32;
  scrTrade            = 33;
  scrGeneralExpense   = 34;
  scrWSalesValue      = 41;
  scrWMShValue        = 42;
  scrWSalesVolume     = 43;
  scrWMShVolume       = 44;
  scrRSalesValue      = 51;
  scrRMShValue        = 52;
  scrRSalesVolume     = 53;
  scrRMShVolume       = 54;

  aRegistredScreens : array[1..19] of Integer =
    (11, 12, 13, 14, 21, 22, 23, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54);

var
   i: integer;
   sDati : string;
   sListData: tStrings;
   bUpload: boolean;
   sValue : string;
   iSize : integer;

   currentResult : TAllResults;
//	 prevResult : TAllResults;
   allResults : array[0..10] of TAllResults;
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

   Function ReadResultsTwo(PeriodNumber : TPeriodNumber ) : Integer;
    var
      ResultsFile : file of TAllResults;
      FileName    :  String;
      TempResult, j  : Integer;

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
//            Seek( ResultsFile, PeriodNumber - HistoryStart );
//            Read( ResultsFile, OnePeriodResults );
//            Seek( ResultsFile, PeriodNumber - HistoryStart - 1);
//            Read( ResultsFile, PrevPeriodResults );
            for j := Low(allResults) to PeriodNumber - HistoryStart do
              begin
                Seek( ResultsFile, j );
                Read( ResultsFile, currentResult );
                allResults[j] := currentResult;
              end;

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

    function collectColumns_o(curPeriod :Integer): ISuperObject;
    var
      count : Integer;
    begin
      Result := SA([]);

      //series+periods  >> most of the charts
      Result.O[''] := SO('{id : "0", labelENG: "Team", type: "string", color : 0}');
      // have to build it depending on # of periods we show
      //-3...lastHistoryPeriod
      Result.O[''] := SO('{id : "1", labelENG: "P-3", type: "number", color : 0}');
      Result.O[''] := SO('{id : "2", labelENG: "P-2", type: "number", color : 0}');
      Result.O[''] := SO('{id : "3", labelENG: "P-1", type: "number", color : 0}');
      Result.O[''] := SO('{id : "4", labelENG: "P0", type: "number", color : 0}');
      if (curPeriod > 0) and (curPeriod < TimeEnd) then
        begin
          for count := FutureStart to curPeriod do
            Result.O[''] := SO('{id : "1", labelENG: "P' +
              IntToStr(count) + '", type: "number", color : 0}');
        end;
    end;

    function collectColumns(role: Integer): ISuperObject;
    var
      I: Integer;
    begin
      Result := nil;
      Result := SA([]);
      Result.O[''] := SO('{id : "0", labelENG: "Team", type: "string", color : 0}');
      if role = roleRetailer then
        begin
          for I := Low(aRetailers) to High(aRetailers) do
            Result.O[''] := SO('{id: "' + IntToStr(I) +
              '", labelENG: "' + aRetailers[I] +
              '", type: "number", color: 0}');
        end;
      if role = roleProducer then
        begin
          for I := Low(aProducers) to High(aProducers) do
            Result.O[''] := SO('{id: "' + IntToStr(I) +
              '", labelENG: "' + aProducers[I] +
              '", type: "number", color: 0}');
        end;
    end;

    function getOneFieldRet(what,prd,cat,mkt,who: Integer): string;
    var
      tmp : Single;
    begin
    case what of
      scrNetSalesVal       : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_NetSalesRevenue[ProsMaxPlusTotal] ;
      scrGP                : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_GrossProfit[ProsMaxPlusTotal] ;
      scrOP                : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_OperatingProfit ;
      scrNP                : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_NetProfit ;
      scrGPM               : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_GrossProfitMargin * 100 ;
      scrOPM               : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_OperatingProfitMargin * 100 ;
      scrNPM               : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_NetProfitMargin * 100 ;
      scrMaterialCost      : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_TotalMaterialCost ;
      scrAdvertising       : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_TotalAdvertising ;
      scrTrade             : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_TotalSupportReceived ;
      scrGeneralExpense    : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_TotalGeneralExpenses ;
      scrWSalesValue       : tmp :=  0 ;
      scrWMShValue         : tmp :=  0 ;
      scrWSalesVolume      : tmp :=  0 ;
      scrWMShVolume        : tmp :=  0 ;
      scrRSalesValue       : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_NetSalesRevenue[ProsMaxPlusTotal] ;
      scrRMShValue         : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_RetailersValueMarketShare * 100 ;
      scrRSalesVolume      : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_SalesVolume ;
      scrRMShVolume        : tmp :=  allResults[prd].r_Retailers[who].rr_Quarters[mkt][cat].rq_RetailersVolumeMarketShare * 100 ;
    end;
      Result := FormatFloat('0', tmp);
    end;

    function getOneFieldProd(what,prd,cat,mkt,who: Integer): string;
    var
      tmp : Single;
    begin
    case what of
      scrNetSalesVal      : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_NetSalesValue[AllRetsMaxTotal][mkt] ;
      scrGP               : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_GrossProfit[AllRetsMaxTotal][mkt] ;
      scrOP               : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_OperatingProfit[mkt] ;
      scrNP               : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_NetProfit[mkt] ;
      scrGPM              : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_GrossProfitMargin[mkt] ;
      scrOPM              : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_OperatingProfitMargin[mkt] ;
      scrNPM              : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_NetProfitMargin[mkt] ;
      scrMaterialCost     : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_TotalMaterialCost[AllRetsMaxTotal][mkt] ;
      scrAdvertising      : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_AdvertisingTotal[mkt] ;
      scrTrade            : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_TotalTradeSupport[AllRetsMaxTotal][mkt] ;
      scrGeneralExpense   : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_GeneralExpensesTotal[mkt] ;
      scrWSalesValue      : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_NetSalesValue[AllRetsMaxTotal][mkt] ;
      scrWMShValue        : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_WholesaleValueMarketShare[mkt] ;
      scrWSalesVolume     : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_SalesVolume[AllRetsMaxTotal][mkt] ;
      scrWMShVolume       : tmp := allResults[prd].r_Producers[who].pt_CategoriesResults[cat].pc_WholesaleVolumeMarketShare[mkt] ;
      scrRSalesValue      : tmp := 0 ;
      scrRMShValue        : tmp := 0 ;
      scrRSalesVolume     : tmp := 0 ;
      scrRMShVolume       : tmp := 0 ;
    end;
      Result := FormatFloat('0', tmp);
    end;

    function collectRowsRetailers(docType, curPeriod, curCat, curMkt : Integer; filter : Boolean=True): ISuperObject;
    var
      ret, seg, prd : Integer;
      j_col, j_row : ISuperObject;
    begin
      Result := SA([]);
      //for ret := Low(TAllRetailers) to High(TAllRetailers) do
      for prd := 0 to curPeriod - HistoryStart do
      begin
        j_row := SO;
        j_col := SA([]);
        // first col with period
        j_col.O[''] :=
          SO('{"v": "P' +
          IntToStr(HistoryStart + prd) +
          '"}');
        // n cols with data
        for ret := Low(TAllRetailers) to High(TAllRetailers) do
          begin
          j_col.O[''] := SO('{"v": "' +
               getOneFieldRet(docType,prd,curCat,curMkt,ret)
              + '"}');
          end;
        j_row['c'] := j_col;
        Result.O[''] := j_row;
        //writeln(j_row.S['c[0].v']);
        end;
      end;

    function collectRowsProducers(docType, curPeriod, curCat, curMkt : Integer; filter : Boolean=True): ISuperObject;
    var
      pl, seg, prd : Integer;
      j_col, j_row : ISuperObject;
    begin
      Result := SA([]);
      for prd := 0 to curPeriod - HistoryStart do
      //for pl := Low(TAllProducers) to High(TAllProducers) do
      begin
        j_row := SO;
        j_col := SA([]);
        // first col with period
        j_col.O[''] :=
          SO('{"v": "P' +
          IntToStr(HistoryStart + prd) +
          '"}');
        // n cols with data
        //for prd := 0 to curPeriod - HistoryStart do
        for pl := Low(TAllProducers) to High(TAllProducers) do
          begin
          j_col.O[''] := SO('{"v": "' +
               getOneFieldProd(docType,prd,curCat,curMkt,pl)
              + '"}');
          end;
        j_row['c'] := j_col;
        Result.O[''] := j_row;
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


    function buildOneChart(scrType,curPeriod,curMkt,curCat,curRole: integer) : ISuperObject;
    var
      j_o : ISuperObject;
    begin
      j_o := SO;
      j_o.S['market'] := aMarkets[curMkt];
      j_o.S['category'] := aCategories[curCat];
      j_o.S['seriesRole'] := aRoles[curRole];
      j_o.O['data'] := SO;
      //cols
      j_o['data.cols'] := collectColumns(curRole);
      //rows
      if curRole = roleRetailer then
        j_o['data.rows'] := collectRowsRetailers(scrType,curPeriod,curCat,curMkt);
      // *** change producer here
      if curRole = roleProducer then
        j_o['data.rows'] := collectRowsProducers(scrType,curPeriod,curCat,curMkt);
      Result := j_o;
    end;

    function buildOneScreen(scrType,curPeriod: integer) : ISuperObject;
    var
      j_o : ISuperObject;
      s_str : string;
      mkt, cat, role : Integer;
    begin
      j_o := SO;
      s_str := 'This chart needs to get a name...';
      // screen name
      case scrType of
        scrNetSalesVal       : s_str := 'Net Sales Value' ;
        scrGP                : s_str := 'Gross Profit' ;
        scrOP                : s_str := 'Operating Profit' ;
        scrNP                : s_str := 'Net Profit' ;
        scrGPM               : s_str := 'Gross Profit Margin' ;
        scrOPM               : s_str := 'Operating Profit Margin' ;
        scrNPM               : s_str := 'Net Profit Margin' ;
        scrMaterialCost      : s_str := 'Total Material Cost' ;
        scrAdvertising       : s_str := 'Total Advertising' ;
        scrTrade             : s_str := 'Total Trade (Producer) Support' ;
        scrGeneralExpense    : s_str := 'Total General Expenses' ;
        scrWSalesValue       : s_str := 'Wholesale Sales Value' ;
        scrWMShValue         : s_str := 'Wholesale Market Share (Value)' ;
        scrWSalesVolume      : s_str := 'Wholesale Sales Volume' ;
        scrWMShVolume        : s_str := 'Wholesale Market Share (Volume)' ;
        scrRSalesValue       : s_str := 'Retail Market Sales (Value)' ;
        scrRMShValue         : s_str := 'Retail Market Share (Value)' ;
        scrRSalesVolume      : s_str := 'Retail Market Sales (Volume)' ;
        scrRMShVolume        : s_str := 'Retail Market Share (Volume)' ;
      end;
      j_o.S['titleENG'] := s_str;

      // screen name RUS
      case scrType of
        scrNetSalesVal       : s_str := 'Чистый объем продаж' ;
        scrGP                : s_str := 'Валовая прибыль' ;
        scrOP                : s_str := 'Операционная прибыль' ;
        scrNP                : s_str := 'Чистая прибыль' ;
        scrGPM               : s_str := 'Маржа валовой прибыли' ;
        scrOPM               : s_str := 'Маржа операционной прибыли' ;
        scrNPM               : s_str := 'Маржа чистой прибыли' ;
        scrMaterialCost      : s_str := 'Материальные затраты' ;
        scrAdvertising       : s_str := 'Реклама' ;
        scrTrade             : s_str := 'Затраты на торговлю (поддержка производителя)' ;
        scrGeneralExpense    : s_str := 'Общие затраты' ;
        scrWSalesValue       : s_str := 'Оптовые продажи (стоимость)' ;
        scrWMShValue         : s_str := 'Доля рынка по опту (стоимость)' ;
        scrWSalesVolume      : s_str := 'Оптовые продажи (объем)' ;
        scrWMShVolume        : s_str := 'Доля рынка по опту (объем)' ;
        scrRSalesValue       : s_str := 'Розничные продажи (стоимость)' ;
        scrRMShValue         : s_str := 'Доля рынка розница (стоимость)' ;
        scrRSalesVolume      : s_str := 'Розничные продажи (объем)' ;
        scrRMShVolume        : s_str := 'Доля рынка (объем)' ;
      end;
      j_o.S['titleRUS'] := s_str;

       // screen name SCN
      case scrType of
        scrNetSalesVal       : s_str := '销售净值' ;
        scrGP                : s_str := '毛利' ;
        scrOP                : s_str := '营业利润' ;
        scrNP                : s_str := '纯利' ;
        scrGPM               : s_str := '毛利率' ;
        scrOPM               : s_str := '经营利润率' ;
        scrNPM               : s_str := '净利率' ;
        scrMaterialCost      : s_str := '总材料成本' ;
        scrAdvertising       : s_str := '总广告' ;
        scrTrade             : s_str := '总贸易（监制）' ;
        scrGeneralExpense    : s_str := '一般开支总额' ;
        scrWSalesValue       : s_str := '批发销售前值' ;
        scrWMShValue         : s_str := '批发的市场份额（价值）' ;
        scrWSalesVolume      : s_str := '批发销售量' ;
        scrWMShVolume        : s_str := '批发市场分享（上册）' ;
        scrRSalesValue       : s_str := '零售市场销售部（价值）' ;
        scrRMShValue         : s_str := '零售市场份额（价值）' ;
        scrRSalesVolume      : s_str := '零售市场销售部（卷）' ;
        scrRMShVolume        : s_str := '零售市场份额（上册）' ;
      end;
      j_o.S['titleCHN'] := s_str;

      j_o.O['chartCollection'] := SA([]);

      // cycle markets
      for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
        // cycle categories
        for cat := Low(TCategoriesTotal) to High(TCategoriesTotal) do
          // cycle roles
          for role := roleRetailer to roleProducer do
            // add chart to collection
            j_o.A['chartCollection'].Add( buildOneChart(scrType,curPeriod,mkt,cat,role) );

      Result := j_o;
    end;

    function isScreenRegistered(scr: Integer): Boolean;
    var
      I: Integer;
    begin
      Result := False;
      for I := Low(aRegistredScreens) to High(aRegistredScreens) do
        if aRegistredScreens[I] = scr then Result := True;
    end;

    function buildOneGroup(grpType,curPeriod: Integer): ISuperObject;
    var
      j_o : ISuperObject;
      scr : Integer;
      s_str : string;
    begin
      j_o := SO;
      //group name
      case grpType of
        grpProfitAbs        : s_str := 'Profitability Absolute RMB';
        grpProfitRel        : s_str := 'Profitability as % of Sales';
        grpExpense          : s_str := 'Expenses';
        grpWholesale        : s_str := 'Wholesales Market Results';
        grpRetail           : s_str := 'Retail Market Results';
        grpCash             : s_str := 'Cashflow';
        grpOnline           : s_str := 'Online Activity';
        grpEfficiency       : s_str := 'Efficiency Indices';
      end;
      j_o.S['groupTitleENG'] := s_str;

      //group name RUS
      case grpType of
        grpProfitAbs        : s_str := 'Прибыльность в абсолютных значениях';
        grpProfitRel        : s_str := 'Прибальность как % от продаж';
        grpExpense          : s_str := 'Затраты';
        grpWholesale        : s_str := 'Оптовый рынок';
        grpRetail           : s_str := 'Розничный рынок';
        grpCash             : s_str := 'Движение денежных средств';
        grpOnline           : s_str := 'Продвижение онлайн';
        grpEfficiency       : s_str := 'Индексы эффективности';
      end;
      j_o.S['groupTitleRUS'] := s_str;

      //group name CHN
      case grpType of
        grpProfitAbs        : s_str := '盈利绝对人民币的';
        grpProfitRel        : s_str := '占销售的盈利能力';
        grpExpense          : s_str := '支出';
        grpWholesale        : s_str := '批发市场结果';
        grpRetail           : s_str := '零售市场业绩';
        grpCash             : s_str := '现金流量';
        grpOnline           : s_str := '在线活动';
        grpEfficiency       : s_str := '效率指数';
      end;
      j_o.S['groupTitleCHN'] := s_str;

      // build group screens
      j_o.O['chartSetCollection'] := SA([]);
      for scr := grpType + 1 to grpType + 9 do
        begin
          if isScreenRegistered(scr) then
            j_o.A['chartSetCollection'].Add( buildOneScreen(scr,curPeriod) );
        end;
      Result := j_o;
    end;

    procedure makeJson(curPeriod: integer);
    var
      s_str : string;
    begin
      oJsonFile := SO;
      oJsonFile.S['seminar'] := currentSeminar;
      oJsonFile.S['fileName'] := getFileName;
      oJsonFile.I['latestHistoryPeriod'] := currentPeriod;
      oJsonFile.O['chartGroup'] := SA([]);
      // add selected groups
      oJsonFile.A['chartGroup'].Add( buildOneGroup(grpProfitAbs,curPeriod) );
      oJsonFile.A['chartGroup'].Add( buildOneGroup(grpProfitRel,curPeriod) );
      oJsonFile.A['chartGroup'].Add( buildOneGroup(grpExpense,curPeriod) );
      oJsonFile.A['chartGroup'].Add( buildOneGroup(grpWholesale,curPeriod) );
      oJsonFile.A['chartGroup'].Add( buildOneGroup(grpRetail,curPeriod) );

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

    {** Read results file **}
        vReadRes := ReadResultsTwo(currentPeriod); // read results file


    // Now let's make some JSON stuff here
         makeJson(currentPeriod);

//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

