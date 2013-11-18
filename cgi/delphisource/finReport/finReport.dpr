program finReport;

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
  Classes, superobject, superxmlparser, HCD_SystemDefinitions, IdHTTP;

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
  aDetails : array[1..4] of string = ('Global','Category','Brand','Variant');
  aRoles : array[Prod_1_ID..Admin_ID] of string = (
    'Producer 1', 'Producer 2', 'Producer 3', 'Producer 4',
    'Retailer 1', 'Retailer 2', 'Traditional Trade', 'e-Mall',
    'Administrator');

  aPNLProducer : array[1..37] of string = (
    '{v: Sales value($mln), f: "", vRUS: Выручка (млн. $), vCHN: 销售产值 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Share In Category Total Sales Value (%), f: "", vRUS: Доля в общих продажах (%), vCHN: 股份类别销售总额 (%)}',
    '{v: "Total material costs($mln)", f: "", vRUS: Общие материальные затраты (млн. $), vCHN: 总的材料成本 （百万元）}',
    '{v: Cost of Goods Sold ($mln), f: "", vRUS: Себестоимость проданных товаров (млн. $), vCHN: 销货成本 （百万元）}',
    '{v: Discontinued Goods Cost($mln), f: "", vRUS: Стоимость снятных с производства товаров (млн. $), vCHN: 停产商品成本 （百万元）}',
    '{v: Inventory Holding Cost($mln), f: "", vRUS: Стоимость хранения товарных запасов (млн. $), vCHN: 库存持有成本 （百万元）}',
    '{v: Gross Profit($mln), f: "", vRUS: Валовая прибыль (млн. $), vCHN: 毛利 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Gross Profit margin (%), f: "", vRUS: Валовая маржа (%), vCHN: 毛利率 (%)}',
    '{v: Share in Category Gross Profit/Losses (%), f: "", vRUS: Доля в  валовой прибыли/убытке (%), vCHN: 股份类别毛利/亏损 (%)}',
    '{v: Advertising Total ($mln), f: "", vRUS: Общие затраты на рекламу (млн. $), vCHN: 广告总 （百万元）}',
    '{v: National Off-line ($mln), f: "", vRUS: Национальная без Интернет (млн. $), vCHN: 国家当前离线 （百万元）}',
    '{v: National On-line ($mln), f: "", vRUS: Национальная Интернет (млн. $), vCHN: 国家在线 （百万元）}',
    '{v: Local Tier 1 ($mln), f: "", vRUS: Местная рынок 1 (млн. $), vCHN: 城市本地广告市场 （百万元）}',
    '{v: Local Tier 2 ($mln), f: "", vRUS: Местная рынок 2 (млн. $), vCHN: 农村的本地广告市场 （百万元）}',
    '{v: Total Trade Support ($mln), f: "", vRUS: Общие затраты на торговлю (млн. $), vCHN: 支持贸易总额 （百万元）}',
    '{v: Price Promotions ($mln), f: "", vRUS: Ценовые промо (млн. $), vCHN: 降价促销 （百万元）}',
    '{v: Volume Discounts ($mln), f: "", vRUS: Скидки от объема (млн. $), vCHN: 数量折扣 （百万元）}',
    '{v: Performance Bonus ($mln), f: "", vRUS: Целевой бонус (млн. $), vCHN: 绩效奖金 （百万元）}',
    '{v: Other Support ($mln), f: "", vRUS: Другие компенсации (млн. $), vCHN: 其他支持 （百万元）}',
    '{v: Total Trade and Marketing Expenses($mln), f: "", vRUS: Общие затраты на продвижение и маркеинг (млн. $), vCHN: 贸易和市场营销费用总额 （百万元）}',
    '{v: Trade and Marketing Expenses as a (%) of Sales, f: "", vRUS: Как % от продаж (%), vCHN: 贸易和市场营销（％）销售费用 (%)}',
    '{v: Share of Trade and Marketing Expenses in Category Total (%), f: "", vRUS: Доля в общих затратах на продвижение и маркетинг (%), vCHN: 贸易和市场营销开支，应占类别总数 (%)}',
    '{v: General Expenses($mln), f: "", vRUS: Общие расходы (млн. $), vCHN: 一般开支 （百万元）}',
    '{v: Amortisation ($mln), f: "", vRUS: Амортизация (млн. $), vCHN: 折旧 （百万元）}',
    '{v: Operating Profit ($mln), f: "", vRUS: Доходы от основной деятельности (млн. $), vCHN: 营业利润 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Operating Profit margin (%), f: "", vRUS: Операционная маржа (%), vCHN: 经营利润率 (%)}',
    '{v: "Share in Category Operating Profit/Losses (%)", f: "", vRUS: Доля в операционной прибыли/убытке (%), vCHN: 股份类别经营溢利/亏损 (%)}',
    '{v: Interests($mln), f: "", vRUS: Доход с капитала (млн. $), vCHN: 权益 （百万元）}',
    '{v: Taxes($mln), f: "", vRUS: Налоги (млн. $), vCHN: 税 （百万元）}',
    '{v: "Exceptional Costs/Profits($mln)", f: "", vRUS: Непредвиденные затраты/доходы (млн. $), vCHN: 特殊成本/利润 （百万元）}',
    '{v: Net Profit($mln), f: "", vRUS: Чистая прибыль (млн. $), vCHN: 纯利 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Net Profit margin (%), f: "", vRUS: Маржа чистой прибыли (%), vCHN: 净利率 (%)}',
    '{v: "Share In Category Net Profit/Losses (%)", f: "", vRUS: Доля в чистой прибыли/убытках (%), vCHN: 份额类别净利润/亏损 (%)}'
  );

  aPNLRetailer : array[1..35] of string = (
    '{v: Sales value ($mln), f: "", vRUS: Выручка (млн. $), vCHN: 销售产值 （百万元）}',
    '{v: "- Cost of Price Promotions ($mln)", f: "", vRUS: Стоимость ценовых промо (млн. $), vCHN: 成本价促销 （百万元）}',
    '{v: Promotional Support from Supplier ($mln), f: "", vRUS: Промо поддержка от производителя (млн. $), vCHN: 从供应商的促销支持 （百万元）}',
    '{v: Other Compensation ($mln), f: "", vRUS: Другие компенсации (млн. $), vCHN: 其他补偿 （百万元）}',
    '{v: Net Sales Value ($mln), f: "", vRUS: Чистая выручка (млн. $), vCHN: 销售净值 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Share In Category Total Sales Value (%), f: "", vRUS: Доля в общих продажах (%), vCHN: 股份类别销售总额 (%)}',
    '{v: "-Total material costs($mln)", f: "", vRUS: Общие материальные затраты (млн. $), vCHN: 总的材料成本 （百万元）}',
    '{v: "-Cost of Goods Sold ($mln)", f: "", vRUS: Себестоимость проданных товаров (млн. $), vCHN: 销货成本 （百万元）}',
    '{v: Value of Quantity Discounts ($mln), f: "", vRUS: Стоимость скидок от объема (млн. $), vCHN: 数量折扣价值 （百万元）}',
    '{v: Value of Performance Bonus ($mln), f: "", vRUS: Стоимость целевого бонуса (млн. $), vCHN: 绩效奖金的价值 （百万元）}',
    '{v: "-Discontinued Goods Cost($mln)", f: "", vRUS: Стоимость товаров, снятных с производства (млн. $), vCHN: 停产商品成本 （百万元）}',
    '{v: "-Inventory Holding Cost($mln)", f: "", vRUS: Стоимость хранения товарных запасов (млн. $), vCHN: 库存持有成本 （百万元）}',
    '{v: Gross Profit($mln), f: "", vRUS: Валовая прибыль (млн. $), vCHN: 毛利 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Gross Profit margin (%), f: "", vRUS: Валовая маржа (%), vCHN: 毛利率 (%)}',
    '{v: Share in Category Gross Profit/Losses (%), f: "", vRUS: Доля в  валовой прибыли/убытке (%), vCHN: 股份类别毛利/亏损 (%)}',
    '{v: "- Advertising Total ($mln)", f: "", vRUS: Общие затраты на рекламу (млн. $), vCHN: 广告总 （百万元）}',
    '{v: "-National Off-line ($mln)", f: "", vRUS: Национальная, исключая Интернет (млн. $), vCHN: 国家当前离线 （百万元）}',
    '{v: "-National On-line ($mln)", f: "", vRUS: Национальная Интернет (млн. $), vCHN: 国家在线 （百万元）}',
    '{v: "-Local Tier T ($mln)", f: "", vRUS: Местная (млн. $), vCHN: 当地 （百万元）}',
    '{v: "-Stores Operating Costs ($mln)", f: "", vRUS: Операционные затраты на магазины (млн. $), vCHN: 商店经营成本 （百万元）}',
    '{v: "-General Expenses($mln)", f: "", vRUS: Общие расходы (млн. $), vCHN: 一般开支 （百万元）}',
    '{v: "-Amortisation ($mln)", f: "", vRUS: Амортизация (млн. $), vCHN: 折旧 （百万元）}',
    '{v: Operating Profit ($mln), f: "", vRUS: Доходы от основной деятельности (млн. $), vCHN: 营业利润 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Operating Profit margin (%), f: "", vRUS: Операционная маржа (%), vCHN: 经营利润率 (%)}',
    '{v: Share in Category Operating Profit/Losses (%), f: "", vRUS: Доля в операционной прибыли/убытке (%), vCHN: 股份类别经营溢利/亏损 (%)}',
    '{v: Interests($mln), f: "", vRUS: Доход с капитала (млн. $), vCHN: 权益 （百万元）}',
    '{v: "-Taxes($mln)", f: "", vRUS: Налоги (млн. $), vCHN: 税 （百万元）}',
    '{v: Exceptional Costs/Profits($mln), f: "", vRUS: Непредвиденные затраты/доходы (млн. $), vCHN: 特殊成本/利润 （百万元）}',
    '{v: Net Profit($mln), f: "", vRUS: Чистая прибыль (млн. $), vCHN: 纯利 （百万元）}',
    '{v: "(%) change versus previous period", f: "", vRUS: По сравнению с предыдущим периодом (%), vCHN: 与以前期间（％）变动 (%)}',
    '{v: Net Profit margin (%), f: "", vRUS: Маржа чистой прибыли (%), vCHN: 净利率 (%)}',
    '{v: Share In Category Net Profit/Losses (%), f: "", vRUS: Доля в чистой прибыли/убытках (%), vCHN: 份额类别净利润/亏损 (%)}'
  );

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

   kk : UTF8String;


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

   Function ReadResultsTwo
   (PeriodNumber : TPeriodNumber; var OnePeriodResults, PrevPeriodResults : TAllResults ) : Integer;
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
	  if sListData.IndexOfName('filepath') <> -1 then
		  Result := getSeminar(getFileName);
    if sListData.IndexOfName('seminar') <> -1 then
      Result  := sListData.Values['seminar'];
    end;

    function getPeriod(): Integer;
    begin
      Result := PerNo;
      if sListData.IndexOfName('period') <> -1 then
         Result := StrToInt(sListData.Values['period']);
    end;

    function buildPNLRetailerGlobal(pwho,pmark: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp : TRetailerQuarterResults;
    begin
      //initialize
      pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][CatsMaxTotal];
      Result := SO();
      jo := SO;
      //columns
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        jr := SO('{id : "2", label : Company total, labelENG : Company total,' +
              'labelRUS : Итого по компании, labelCHN : 公司总, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_GrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossSalesValue ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_PricePromotionsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PricePromotionsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_PromotionalSupport
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PromotionalSupport ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_OtherCompensation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OtherCompensation ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5 rq_NetSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[5]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetSalesValue[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //6 rq_DeltaGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[6]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //7 rq_ShareInBrandGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[7]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //8 rq_TotalMaterialCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[8]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalMaterialCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //9 rq_CostOfGoodsSold
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[9]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_CostOfGoodsSold ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //10 rq_TotalQuantityDiscountsValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[10]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalQuantityDiscountsValue ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //11 rq_PerformanceBonusBenefits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[11]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PerformanceBonusBenefits ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //12 rq_DiscontinuedGoodsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[12]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DiscontinuedGoodsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //13 rq_InventoryHoldingCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[13]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_InventoryHoldingCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //14 rq_GrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[14]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossProfit[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //15 rq_DeltaGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[15]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //16 rq_GrossProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[16]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //17 rq_ShareInBrandGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[17]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //18 rq_TotalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[18]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalAdvertising ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //19 rq_TraditionalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[19]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TraditionalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //20 rq_OnlineAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[20]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OnlineAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //21 rq_LocalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[21]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_LocalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //22 rq_TotalOperatingExpenses
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[22]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalOperatingExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //23 rq_GeneralExpensesTotal
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[23]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalGeneralExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //24 rq_Amortisation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[24]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Amortisation ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //25 rq_OperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[25]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OperatingProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //26 rq_DeltaOperatingProft
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[26]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaOperatingProft * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //27 rq_OperatingProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[27]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OperatingProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //28 rq_ShareInBrandOperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[28]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalOperatingProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //29 rq_Interest
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[29]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Interest ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //30 rq_Taxes
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[30]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Taxes ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //31 rq_ExceptionalCostsProfits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[31]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ExceptionalCostsProfits ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //32 rq_NetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[32]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //33 rq_DeltaNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[33]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //34 rq_NetProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[34]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //35 rq_ShareInBrandNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[35]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      end;

    function buildPNLRetailerCategory(pwho,pmark: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp, ph : TRetailerQuarterResults;
    begin
      //initialize
      pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][ElecsoriesID];
      ph := currentResult.r_Retailers[pwho].rr_Quarters[pmark][HealthBeautiesID];
      Result := SO();
      jo := SO;
      //columns
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id : "2", label : Elecsories, labelENG : Elecsories,' +
              'labelRUS : "", labelCHN : "", ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id : "3", label : "Health&Beauty", labelENG : "Health&Beauty",' +
              'labelRUS : "", labelCHN : "", ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_GrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossSalesValue ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_GrossSalesValue ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_PricePromotionsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PricePromotionsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_PricePromotionsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_PromotionalSupport
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PromotionalSupport ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_PromotionalSupport ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_OtherCompensation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OtherCompensation ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_OtherCompensation ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5 rq_NetSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[5]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetSalesValue[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_NetSalesValue[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //6 rq_DeltaGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[6]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DeltaGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //7 rq_ShareInBrandGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[7]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ShareInTotalGrossSalesValue * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //8 rq_TotalMaterialCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[8]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalMaterialCost ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TotalMaterialCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //9 rq_CostOfGoodsSold
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[9]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_CostOfGoodsSold ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_CostOfGoodsSold ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //10 rq_TotalQuantityDiscountsValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[10]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalQuantityDiscountsValue ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TotalQuantityDiscountsValue ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //11 rq_PerformanceBonusBenefits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[11]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PerformanceBonusBenefits ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_PerformanceBonusBenefits ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //12 rq_DiscontinuedGoodsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[12]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DiscontinuedGoodsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DiscontinuedGoodsCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //13 rq_InventoryHoldingCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[13]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_InventoryHoldingCost ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_InventoryHoldingCost ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //14 rq_GrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[14]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossProfit[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_GrossProfit[ProsMaxPlusTotal] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //15 rq_DeltaGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[15]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DeltaGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //16 rq_GrossProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[16]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_GrossProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_GrossProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //17 rq_ShareInBrandGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[17]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ShareInTotalGrossProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //18 rq_TotalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[18]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalAdvertising ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TotalAdvertising ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //19 rq_TraditionalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[19]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TraditionalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TraditionalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //20 rq_OnlineAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[20]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OnlineAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_OnlineAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //21 rq_LocalAdvertising
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[21]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_LocalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_LocalAdvertisingTotalBudget ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //22 rq_TotalOperatingExpenses
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[22]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalOperatingExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TotalOperatingExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //23 rq_GeneralExpensesTotal
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[23]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_TotalGeneralExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_TotalGeneralExpenses ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //24 rq_Amortisation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[24]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Amortisation ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_Amortisation ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //25 rq_OperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[25]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OperatingProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_OperatingProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //26 rq_DeltaOperatingProft
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[26]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaOperatingProft * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DeltaOperatingProft * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //27 rq_OperatingProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[27]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_OperatingProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_OperatingProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //28 rq_ShareInBrandOperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[28]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalOperatingProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ShareInTotalOperatingProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //29 rq_Interest
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[29]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Interest ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_Interest ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //30 rq_Taxes
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[30]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_Taxes ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_Taxes ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //31 rq_ExceptionalCostsProfits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[31]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ExceptionalCostsProfits ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ExceptionalCostsProfits ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //32 rq_NetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[32]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_NetProfit ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //33 rq_DeltaNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[33]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DeltaNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DeltaNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //34 rq_NetProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[34]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_NetProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_NetProfitMargin * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //35 rq_ShareInBrandNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[35]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ShareInTotalNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ShareInTotalNetProfit * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      end;

    function buildPNLRetailerBrand(pwho,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp : TRetailerBrandResults;
//      pv : TRetailerBrandResults;
      abrn : array of Integer;
      I, brn : Integer;
    begin
      //initialize
      Result := SO();
      jo := SO;

      //initialize brand array
      for brn := Low(TBrands) to High(TBrands) do
      begin
        pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[brn];
        //check if brand has name :: here should be a wiser check
        if WideCharToString(pp.rb_BrandName) <> '' then
          begin
            I := Length(abrn);
            I := I + 1;
            SetLength(abrn, I);
            abrn[I - 1] := brn;
          end;
      end;

      //columns
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);
        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
          jr := SO('{id : "' +
                IntToStr(I + 1) +
                '", label : "' +
                WideCharToString( pp.rb_BrandName ) +
                '", labelENG : "",' +
                'labelRUS : "", labelCHN : "", ' +
                'type : string, color : 0}');
          Result.A['cols'].Add(jr);
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rq_GrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_GrossSalesValue ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2 rq_PricePromotionsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_PricePromotionsCost ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3 rq_PromotionalSupport
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_PromotionalSupport ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //4 rq_OtherCompensation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_OtherCompensation ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //5 rq_NetSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[5]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_NetSalesRevenue ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //6 rq_DeltaGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[6]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DeltaGrossSalesValue * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //7 rq_ShareInBrandGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[7]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ShareInQuarterGrossSalesValue * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //8 rq_TotalMaterialCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[8]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_TotalMaterialCost ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //9 rq_CostOfGoodsSold
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[9]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_CostOfGoodsSold ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //10 rq_TotalQuantityDiscountsValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[10]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_TotalQuantityDiscountsValue ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //11 rq_PerformanceBonusBenefits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[11]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_PerformanceBonusBenefits ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //12 rq_DiscontinuedGoodsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[12]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DiscontinuedGoodsCost ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //13 rq_InventoryHoldingCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[13]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_InventoryHoldingCost ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //14 rq_GrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[14]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_GrossProfit ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //15 rq_DeltaGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[15]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DeltaGrossProfit * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //16 rq_GrossProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[16]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_GrossProfitMargin * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //17 rq_ShareInBrandGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[17]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ShareInQuarterGrossProfit * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

//      //18 rq_TotalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[18]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_TotalAdvertising ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);
//
//      //19 rq_TraditionalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[19]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_TraditionalAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);
//
//      //20 rq_OnlineAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[20]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_OnlineAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);
//
//      //21 rq_LocalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[21]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_LocalAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);

//      //22 rq_TotalOperatingExpenses
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[22]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_TotalOperatingExpenses ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //23 rq_GeneralExpensesTotal
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[23]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_TotalGeneralExpenses ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

//      //24 rq_Amortisation
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[24]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_Amortisation ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //25 rq_OperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[25]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_OperatingProfit ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //26 rq_DeltaOperatingProft
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[26]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DeltaOperatingProft * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //27 rq_OperatingProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[27]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_OperatingProfitMargin * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //28 rq_ShareInBrandOperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[28]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ShareInQuarterOperatingProfit * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //29 rq_Interest
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[29]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_Interest ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //30 rq_Taxes
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[30]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_Taxes ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //31 rq_ExceptionalCostsProfits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[31]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ExceptionalCostsProfits ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //32 rq_NetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[32]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_NetProfit ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //33 rq_DeltaNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[33]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DeltaNetProfit * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //34 rq_NetProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[34]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_NetProfitMargin * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //35 rq_ShareInBrandNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[35]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ShareInQuarterNetProfit * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      end;

    function buildPNLRetailerVariant(pwho,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp : TRetailerBrandResults;
      pv : TRetailerVariantResults;
      abrn : array of Integer;
      I, brn, vr : Integer;
    begin
      //initialize
      Result := SO();
      jo := SO;

      //initialize brand array
      for brn := Low(TBrands) to High(TBrands) do
      begin
        pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[brn];
        //check if brand has name :: here should be a wiser check
        if WideCharToString(pp.rb_BrandName) <> '' then
          begin
            I := Length(abrn);
            I := I + 1;
            SetLength(abrn, I);
            abrn[I - 1] := brn;
          end;
      end;

      //columns
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);

        // variant names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
          for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
            begin
              pv := pp.rb_VariantsResults[vr];
              //check variant exists :: could be not the best
              if pv.rv_VariantID <> 0 then
                begin
                  jr := SO('{id : "' +
                              IntToStr(I + 1) +
                              '", label : "' +
                              WideCharToString( pp.rb_BrandName ) +
                              WideCharToString( pv.rv_VariantName ) +
                              '", labelENG : "",' +
                              'labelRUS : "", labelCHN : "", ' +
                              'type : string, color : 0}');
                   Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rq_GrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_GrossSalesValue ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 rq_PricePromotionsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_PricePromotionsCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 rq_PromotionalSupport
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_PromotionalSupport ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 rq_OtherCompensation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_OtherCompensation ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //5 rq_NetSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[5]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_NetSalesRevenue ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //6 rq_DeltaGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[6]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_DeltaGrossSalesValue * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //7 rq_ShareInBrandGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[7]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_ShareInBrandGrossSalesValue * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //8 rq_TotalMaterialCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[8]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_TotalMaterialCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //9 rq_CostOfGoodsSold
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[9]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_CostOfGoodsSold ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //10 rq_TotalQuantityDiscountsValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[10]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_TotalQuantityDiscountsValue ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //11 rq_PerformanceBonusBenefits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[11]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_PerformanceBonusBenefits ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //12 rq_DiscontinuedGoodsCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[12]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_DiscontinuedGoodsCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //13 rq_InventoryHoldingCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[13]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_InventoryHoldingCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //14 rq_GrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[14]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_GrossProfit ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //15 rq_DeltaGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[15]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_DeltaGrossProfit * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //16 rq_GrossProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[16]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_GrossProfitMargin * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //17 rq_ShareInBrandGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[17]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_ShareInBrandGrossSalesValue * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

//      //18 rq_TotalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[18]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_TotalAdvertising ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);
//
//      //19 rq_TraditionalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[19]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_TraditionalAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);
//
//      //20 rq_OnlineAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[20]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_OnlineAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);
//
//      //21 rq_LocalAdvertising
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[21]);
//        jo.A['c'].Add(jf);
//        jr := SO('{f: "", v: "' +
//          FormatFloat('0.00',
//            pp.rq_LocalAdvertisingTotalBudget ) +
//          '"}');
//        jo.A['c'].Add(jr);
//        result.A['rows'].Add(jo);

//      //22 rq_TotalOperatingExpenses
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[22]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_TotalOperatingExpenses ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //23 rq_GeneralExpensesTotal
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[23]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_TotalGeneralExpenses ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

//      //24 rq_Amortisation
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPNLRetailer[24]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.rb_Amortisation ) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //25 rq_OperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[25]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_OperatingProfit ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //26 rq_DeltaOperatingProft
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[26]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_DeltaOperatingProft * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //27 rq_OperatingProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[27]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_OperatingProfitMargin * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //28 rq_ShareInBrandOperatingProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[28]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_ShareInBrandOperatingProfit * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //29 rq_Interest
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[29]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_Interest ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //30 rq_Taxes
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[30]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_Taxes ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //31 rq_ExceptionalCostsProfits
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[31]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_ExceptionalCostsProfits ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //32 rq_NetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[32]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_NetProfit ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //33 rq_DeltaNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[33]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_DeltaNetProfit * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //34 rq_NetProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[34]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_NetProfitMargin * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //35 rq_ShareInBrandNetProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLRetailer[35]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.rb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.rv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.rv_ShareInBrandNetProfit * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      end;

    function buildPNLProducerGlobal(pprod,pmark: Integer): ISuperObject;
    var
      jo, jf, jr: ISuperObject;
      pp : TProducerTotalResults;
    begin
      pp := currentResult.r_Producers[pprod];
      with pp do
      begin
      //columns
        Result := SO;
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        jr := SO('{id : "2", label : Company total, labelENG : Company total,' +
              'labelRUS : Итого по компании, labelCHN : 公司总, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1	pt_GrossSalesValue 	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[1]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_GrossSalesValue[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2	pt_DeltaGrossSalesValue	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[2]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_DeltaGrossSalesValue[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

       //4	pt_TotalMaterialCost	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[4]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_TotalMaterialCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5	pt_CostOfGoodsSold	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[5]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CostOfGoodsSold[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //6	pt_DiscontinuedGoodsCost	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[6]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_DiscontinuedGoodsCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //7	pt_InventoryHoldingCost	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[7]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_InventoryHoldingCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //8	pt_GrossProfit	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[8]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_GrossProfit[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //9	pt_DeltaGrossProfit	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[9]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_DeltaGrossProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //10	pt_GrossProfitMargin	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[10]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_GrossProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //11		[MrktsMaxTotal]
      //12	pt_AdvertisingTotal	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[12]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_AdvertisingTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //13	pt_AdvertisingNationalOldMedia	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[13]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_AdvertisingNationalOldMedia[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //14	pt_AdvertisingNationalOnLine	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_AdvertisingNationalOnLine[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //15	pt_AdvertisingLocal	[Tier_Urban_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[15]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_AdvertisingLocal[Tier_Urban_ID]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //16	pt_AdvertisingLocal	[Tier_Rural_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[16]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_AdvertisingLocal[Tier_Rural_ID]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //17	pt_TotalTradeSupport	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[17]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_TotalTradeSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //18	pt_PromotionalSupport	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[18]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_PromotionalSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //19	pt_VolumeDiscountCost	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[19]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_VolumeDiscountCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //20	pt_PerformanceBonusCost	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[20]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_PerformanceBonusCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //21	pt_OtherCompensation	[AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[21]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_OtherCompensation[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //22	pt_TotalTradeAndMarketingExpenses	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[22]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_TotalTradeAndMarketingExpenses[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //23	pt_TradeAndMarketingExpensesSalesRatio	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[23]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_TradeAndMarketingExpensesSalesRatio[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //24		[MrktsMaxTotal]
      //25	pt_GeneralExpensesTotal	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[25]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_GeneralExpensesTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //26	pt_Amortisation	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[26]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_Amortisation[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //27	pt_OperatingProfit	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[27]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_OperatingProfit[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //28	pt_DeltaOperatingProft	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[28]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_DeltaOperatingProft[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //29	pt_OperatingProfitMargin	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[29]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_OperatingProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //30		[MrktsMaxTotal]
      //31	pt_Interest	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[31]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_Interest[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //32	pt_Taxes	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[32]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_Taxes[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //33	pt_ExceptionalCostsProfits	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[33]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_ExceptionalCostsProfits[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //34	pt_NetProfit	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[34]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_NetProfit[pmark]) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //35	pt_DeltaNetProfit	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_DeltaNetProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //36	pt_NetProfitMargin	[MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_NetProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jf);
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //37		[MrktsMaxTotal]

        end;
      end;

    function buildPNLProducerCategory(pprod,pmark: Integer): ISuperObject;
    var
      jo, jf, jr: ISuperObject;
      pp : TProducerTotalResults;
    begin
      pp := currentResult.r_Producers[pprod];
      with pp do
      begin
      //columns
        Result := SO;
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id : "2", label : Elecsories, labelENG : Elecsories,' +
              'labelRUS : "", labelCHN : "", ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id : "3", label : "Health&Beauty", labelENG : "Health&Beauty",' +
              'labelRUS : "", labelCHN : "", ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      // 1 pt_CategoriesResults[].pc_GrossSalesValue   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_GrossSalesValue[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_GrossSalesValue[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 pt_CategoriesResults[]. pc_DeltaGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_DeltaGrossSalesValue[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_DeltaGrossSalesValue[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 pt_CategoriesResults[].pc_ShareInCompanyGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ShareInCompanyGrossSalesValue[AllRetsMaxTotal][pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ShareInCompanyGrossSalesValue[AllRetsMaxTotal][pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

       //4 pt_CategoriesResults[].pc_TotalMaterialCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_TotalMaterialCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_TotalMaterialCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5 pt_CategoriesResults[].pc_CostOfGoodsSold   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[5]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_CostOfGoodsSold[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_CostOfGoodsSold[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //6 pt_CategoriesResults[].pc_DiscontinuedGoodsCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[6]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_DiscontinuedGoodsCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_DiscontinuedGoodsCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //7 pt_CategoriesResults[].pc_InventoryHoldingCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[7]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_InventoryHoldingCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_InventoryHoldingCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //8 pt_CategoriesResults[].pc_GrossProfit   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[8]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_GrossProfit[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_GrossProfit[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //9 pt_CategoriesResults[].pc_DeltaGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[9]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_DeltaGrossProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_DeltaGrossProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //10 pt_CategoriesResults[].pc_GrossProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[10]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_GrossProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_GrossProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //11 pt_CategoriesResults[].pc_ShareInCompanyGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[11]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ShareInCompanyGrossProfit[AllRetsMaxTotal][pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ShareInCompanyGrossProfit[AllRetsMaxTotal][pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //12	pt_AdvertisingTotal	[MrktsMaxTotal]
      //12 pt_CategoriesResults[].pc_AdvertisingTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[12]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_AdvertisingTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_AdvertisingTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //13 pt_CategoriesResults[].pc_AdvertisingNationalOldMedia   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[13]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_AdvertisingNationalOldMedia[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_AdvertisingNationalOldMedia[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //14 pt_CategoriesResults[].pc_AdvertisingNationalOnLine   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_AdvertisingNationalOnLine[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_AdvertisingNationalOnLine[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //15 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Urban_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[15]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_AdvertisingLocal[Tier_Urban_ID]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_AdvertisingLocal[Tier_Urban_ID]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //16 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Rural_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[16]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_AdvertisingLocal[Tier_Rural_ID]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_AdvertisingLocal[Tier_Rural_ID]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //17 pt_CategoriesResults[].pc_TotalTradeSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[17]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_TotalTradeSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_TotalTradeSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //18 pt_CategoriesResults[].pc_PromotionalSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[18]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_PromotionalSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_PromotionalSupport[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //19 pt_CategoriesResults[].pc_VolumeDiscountCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[19]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_VolumeDiscountCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_VolumeDiscountCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //20 pt_CategoriesResults[].pc_PerformanceBonusCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[20]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_PerformanceBonusCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_PerformanceBonusCost[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //21 pt_CategoriesResults[].pc_OtherCompensation   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[21]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_OtherCompensation[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_OtherCompensation[AllRetsMaxTotal][pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //22 pt_CategoriesResults[].pc_TotalTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[22]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_TotalTradeAndMarketingExpenses[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_TotalTradeAndMarketingExpenses[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //23 pt_CategoriesResults[].pc_TradeAndMarketingExpensesSalesRatio   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[23]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_TradeAndMarketingExpensesSalesRatio[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_TradeAndMarketingExpensesSalesRatio[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //24 pt_CategoriesResults[].pc_ShareInCompanyTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[24]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ShareInCompanyTradeAndMarketingExpenses[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ShareInCompanyTradeAndMarketingExpenses[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //25 pt_CategoriesResults[].pc_GeneralExpensesTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[25]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_GeneralExpensesTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_GeneralExpensesTotal[pmark]) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //26 pt_CategoriesResults[].pc_Amortisation   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[26]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_Amortisation[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_Amortisation[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //27 pt_CategoriesResults[].pc_OperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[27]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_OperatingProfit[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_OperatingProfit[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //28 pt_CategoriesResults[].pc_DeltaOperatingProft   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[28]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_DeltaOperatingProft[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_DeltaOperatingProft[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //29 pt_CategoriesResults[].pc_OperatingProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[29]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_OperatingProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_OperatingProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //30 pt_CategoriesResults[].pc_ShareInCompanyOperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[30]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ShareInCompanyOperatingProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ShareInCompanyOperatingProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //31 pt_CategoriesResults[].pc_Interest   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[31]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_Interest[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_Interest[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //32 pt_CategoriesResults[].pc_Taxes   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[32]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_Taxes[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_Taxes[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //33 pt_CategoriesResults[].pc_ExceptionalCostsProfits   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[33]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ExceptionalCostsProfits[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ExceptionalCostsProfits[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //34 pt_CategoriesResults[].pc_NetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[34]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_NetProfit[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_NetProfit[pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //35 pt_CategoriesResults[].pc_DeltaNetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[35]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_DeltaNetProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_DeltaNetProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //36 pt_CategoriesResults[].pc_NetProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[36]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_NetProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_NetProfitMargin[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //37 pt_CategoriesResults[].pc_ShareInCompanyNetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[37]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_ShareInCompanyNetProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_ShareInCompanyNetProfit[pmark] * 100) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

        end;
      end;

    function buildPNLProducerBrand(pprod,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr: ISuperObject;
      pp : TProducerBrandResults;
      abrn : array of Integer;
      I, brn : Integer;
    begin
      //initialize brands array
        for brn := Low(TProBrands) to High(TProBrands) do
        begin
          pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[brn];
          //check if brand has name :: here should be a wiser check
            if WideCharToString( pp.pb_BrandName ) <> '' then
              begin
                I := Length(abrn);
                I := I + 1;
                SetLength(abrn, I);
                abrn[I - 1] := brn;
              end;
        end;

     //columns
        Result := SO;
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);

        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
          jr := SO('{id : "' +
                IntToStr(I + 1) +
                '", label : "' +
                WideCharToString( pp.pb_BrandName ) +
                '", labelENG : "",' +
                'labelRUS : "", labelCHN : "", ' +
                'type : string, color : 0}');
          Result.A['cols'].Add(jr);
        end;

      // rows
        result.O['rows'] := sa([]);

      // 1 pt_CategoriesResults[].pc_GrossSalesValue   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_GrossSalesValue[AllRetsMaxTotal][pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2 pt_CategoriesResults[]. pc_DeltaGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_DeltaGrossSalesValue[pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3 pt_CategoriesResults[].pc_ShareInCompanyGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ShareInCategoryGrossSalesValue[AllRetsMaxTotal][pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

       //4 pt_CategoriesResults[].pc_TotalMaterialCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_TotalMaterialCost[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //5 pt_CategoriesResults[].pc_CostOfGoodsSold   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[5]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_CostOfGoodsSold[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //6 pt_CategoriesResults[].pc_DiscontinuedGoodsCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[6]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_DiscontinuedGoodsCost[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //7 pt_CategoriesResults[].pc_InventoryHoldingCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[7]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_InventoryHoldingCost[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //8 pt_CategoriesResults[].pc_GrossProfit   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[8]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_GrossProfit[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //9 pt_CategoriesResults[].pc_DeltaGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[9]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_DeltaGrossProfit[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //10 pt_CategoriesResults[].pc_GrossProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[10]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_GrossProfitMargin[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //11 pt_CategoriesResults[].pc_ShareInCompanyGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[11]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ShareInCategoryGrossProfit[AllRetsMaxTotal][pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //12 pt_CategoriesResults[].pc_AdvertisingTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[12]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_AdvertisingTotal[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //13 pt_CategoriesResults[].pc_AdvertisingNationalOldMedia   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[13]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_AdvertisingNationalOldMedia[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //14 pt_CategoriesResults[].pc_AdvertisingNationalOnLine   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_AdvertisingNationalOnLine ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //15 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Urban_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[15]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_AdvertisingLocal[Tier_Urban_ID] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //16 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Rural_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[16]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_AdvertisingLocal[Tier_Rural_ID] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //17 pt_CategoriesResults[].pc_TotalTradeSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[17]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_TotalTradeSupport[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //18 pt_CategoriesResults[].pc_PromotionalSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[18]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_PromotionalSupport[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //19 pt_CategoriesResults[].pc_VolumeDiscountCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[19]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_VolumeDiscountCost[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //20 pt_CategoriesResults[].pc_PerformanceBonusCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[20]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_PerformanceBonusCost[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //21 pt_CategoriesResults[].pc_OtherCompensation   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[21]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_OtherCompensation[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //22 pt_CategoriesResults[].pc_TotalTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[22]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_TotalTradeAndMarketingExpenses[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //23 pt_CategoriesResults[].pc_TradeAndMarketingExpensesSalesRatio   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[23]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_TradeAndMarketingExpensesSalesRatio[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //24 pt_CategoriesResults[].pc_ShareInCompanyTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[24]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ShareInCategoryTradeAndMarketingExpenses[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //25 pt_CategoriesResults[].pc_GeneralExpensesTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[25]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_GeneralExpensesTotal[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //26 pt_CategoriesResults[].pc_Amortisation   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[26]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_Amortisation[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //27 pt_CategoriesResults[].pc_OperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[27]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_OperatingProfit[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //28 pt_CategoriesResults[].pc_DeltaOperatingProft   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[28]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_DeltaOperatingProft[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //29 pt_CategoriesResults[].pc_OperatingProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[29]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_OperatingProfitMargin[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //30 pt_CategoriesResults[].pc_ShareInCompanyOperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[30]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ShareInCategoryOperatingProfit[pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //31 pt_CategoriesResults[].pc_Interest   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[31]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_Interest[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //32 pt_CategoriesResults[].pc_Taxes   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[32]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_Taxes[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //33 pt_CategoriesResults[].pc_ExceptionalCostsProfits   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[33]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ExceptionalCostsProfits[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //34 pt_CategoriesResults[].pc_NetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[34]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_NetProfit[pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //35 pt_CategoriesResults[].pc_DeltaNetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[35]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_DeltaNetProfit[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //36 pt_CategoriesResults[].pc_NetProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[36]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_NetProfitMargin[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //37 pt_CategoriesResults[].pc_ShareInCompanyNetProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[37]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_ShareInCategoryNetProfit[pmark] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);
      end;

    function buildPNLProducerVariant(pprod,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr: ISuperObject;
      pp : TProducerBrandResults;
      pv : TProducerVariantResults;
      abrn : array of Integer;
      I, brn, vr : Integer;
    begin
      //initialize variants array
        for brn := Low(TProBrands) to High(TProBrands) do
        begin
          pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[brn];
          //check if brand has name :: here should be a wiser check
            if WideCharToString( pp.pb_BrandName ) <> '' then
              begin
                I := Length(abrn);
                I := I + 1;
                SetLength(abrn, I);
                abrn[I - 1] := brn;
              end;
        end;

     //columns
        Result := SO;
        Result.O['cols'] := SA([]);
        jf := SO('{id : "1", label : Item, labelENG : Item,' +
              'labelRUS : Наименование, labelCHN : 事实, ' +
							'type : string, color : 0}');
        Result.A['cols'].Add(jf);

        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
          for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
            begin
              pv := pp.pb_VariantsResults[vr];
              //check variant exists :: could be not the best
              if pv.pv_VariantID <> 0 then
                begin
                  jr := SO('{id : "' +
                        IntToStr(I + 1) +
                        '", label : "' +
                        WideCharToString( pp.pb_BrandName ) +
                        WideCharToString( pv.pv_VariantName ) +
                        '", labelENG : "",' +
                        'labelRUS : "", labelCHN : "", ' +
                        'type : string, color : 0}');
                  Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      // 1 pt_CategoriesResults[].pc_GrossSalesValue   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_GrossSalesValue[AllRetsMaxTotal][pmark]) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 pt_CategoriesResults[]. pc_DeltaGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_DeltaGrossSalesValue[pmark] * 100) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 pt_CategoriesResults[].pc_ShareInCompanyGrossSalesValue   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_ShareInBrandGrossSalesValue[AllRetsMaxTotal][pmark] * 100) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

       //4 pt_CategoriesResults[].pc_TotalMaterialCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_TotalMaterialCost[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //5 pt_CategoriesResults[].pc_CostOfGoodsSold   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[5]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_CostOfGoodsSold[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //6 pt_CategoriesResults[].pc_DiscontinuedGoodsCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[6]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_DiscontinuedGoodsCost[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //7 pt_CategoriesResults[].pc_InventoryHoldingCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[7]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_InventoryHoldingCost[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //8 pt_CategoriesResults[].pc_GrossProfit   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[8]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_GrossProfit[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //9 pt_CategoriesResults[].pc_DeltaGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[9]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_DeltaGrossProfit[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //10 pt_CategoriesResults[].pc_GrossProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[10]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_GrossProfitMargin[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //11 pt_CategoriesResults[].pc_ShareInCompanyGrossProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[11]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_ShareInBrandGrossProfit[AllRetsMaxTotal][pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //12 pt_CategoriesResults[].pc_AdvertisingTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[12]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_AdvertisingTotal[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //13 pt_CategoriesResults[].pc_AdvertisingNationalOldMedia   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[13]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_AdvertisingNationalOldMedia[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //14 pt_CategoriesResults[].pc_AdvertisingNationalOnLine   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[14]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_AdvertisingNationalOnLine[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //15 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Urban_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[15]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_AdvertisingLocal[Tier_Urban_ID] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //16 pt_CategoriesResults[].pc_AdvertisingLocal   [Tier_Rural_ID]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[16]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_AdvertisingLocal[Tier_Rural_ID] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //17 pt_CategoriesResults[].pc_TotalTradeSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[17]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_TotalTradeSupport[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //18 pt_CategoriesResults[].pc_PromotionalSupport   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[18]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_PromotionalSupport[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //19 pt_CategoriesResults[].pc_VolumeDiscountCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[19]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_VolumeDiscountCost[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //20 pt_CategoriesResults[].pc_PerformanceBonusCost   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[20]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_PerformanceBonusCost[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //21 pt_CategoriesResults[].pc_OtherCompensation   [AllRetsMaxTotal, MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[21]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_OtherCompensation[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //22 pt_CategoriesResults[].pc_TotalTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[22]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_TotalTradeAndMarketingExpenses[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //23 pt_CategoriesResults[].pc_TradeAndMarketingExpensesSalesRatio   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[23]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_TradeAndMarketingExpensesSalesRatio[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //24 pt_CategoriesResults[].pc_ShareInCompanyTradeAndMarketingExpenses   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[24]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_ShareInBrandTradeAndMarketingExpenses[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //25 pt_CategoriesResults[].pc_GeneralExpensesTotal   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[25]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_GeneralExpensesTotal[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //26 pt_CategoriesResults[].pc_Amortisation   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[26]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_Amortisation[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //27 pt_CategoriesResults[].pc_OperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[27]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_OperatingProfit[pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //28 pt_CategoriesResults[].pc_DeltaOperatingProft   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[28]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_DeltaOperatingProft[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //29 pt_CategoriesResults[].pc_OperatingProfitMargin   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[29]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_OperatingProfitMargin[pmark] * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //30 pt_CategoriesResults[].pc_ShareInCompanyOperatingProfit   [MrktsMaxTotal]
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPNLProducer[30]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
              begin
                pv := pp.pb_VariantsResults[vr];
                //check variant exists :: could be not the best
                if pv.pv_VariantID <> 0 then
                  begin
                    jr := SO('{f: "", v: "' +
                      FormatFloat('0.00',
                        pv.pv_ShareInBrandOperatingProfit[pmark] * 100) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);
      end;

    function collectDataProducer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO;
      if (pwho < Prod_4_ID) and (pdet = 1) then
        Result['data'] := buildPNLProducerGlobal(pwho,pmkt);
      if (pwho < Prod_4_ID) and (pdet = 2) then
        Result['data'] := buildPNLProducerCategory(pwho,pmkt);
      if (pwho < Prod_4_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildPNLProducerBrand(pwho,pmkt,pcat);
        end;
      if (pwho < Prod_4_ID) and (pdet = 4)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildPNLProducerVariant(pwho,pmkt,pcat);
        end;
    end;

    function collectDataRetailer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO();
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 1) then
        Result['data'] := buildPNLRetailerGlobal(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 2) then
        Result['data'] := buildPNLRetailerCategory(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildPNLRetailerBrand(pwho - Prod_4_ID,pmkt,pcat);
        end;
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 4)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildPNLRetailerVariant(pwho - Prod_4_ID,pmkt,pcat);
        end;
    end;

    function serveRequest() : ISuperObject;
    var
      j_pl, j_o : ISuperObject;
      s_str : string;
      cat, pl, det, rrole, mkt : Integer;
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

      // report titleENG is very important, we gotta use it
      // to recognise different report in database.
      j_o.S['titleENG'] := 'Profit and Loss Statement';
      j_o.S['titleCHN'] := '损益表';
      j_o.S['titleRUS'] := 'Отчет о прибыли и убытках';

      {** Data Collection **}
      j_o.O['reportCollection'] := SA([]);

      //build report collection
      //change role and dataCollection once per all Producers/Retailers
      for rrole :=1 to 2 do
        begin
          if rrole = 1 then
            s_str := 'Producer'
          else
            s_str := 'Retailer';
          j_pl := SO('{role: ' + s_str + '}');
          j_pl.O['dataCollection'] := SA([]);
          // collect Producer reports
          if rrole = 1 then
            for det := 1 to 4 do
              for pl := Prod_1_ID to Prod_3_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  begin
                    if det < 3 then
                      j_pl.A['dataCollection'].Add( collectDataProducer(pl,mkt,det,0) );
                    if det > 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectDataProducer(pl,mkt,det,cat) );
                  end;
          // collect Retailer reports
          if rrole = 2 then
            for det := 1 to 4 do
              for pl := Ret_1_ID to Ret_2_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  begin
                    if det < 3 then
                      j_pl.A['dataCollection'].Add( collectDataRetailer(pl,mkt,det,0) );
                    if det > 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectDataRetailer(pl,mkt,det,cat) );
                  end;
          j_o.A['reportCollection'].Add( j_pl );
        end;

     Result := j_o;
    end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SO;
      oJsonFile := serveRequest;
      s_str := 'out' + '.json';
      oJsonFile.SaveTo(s_str, true, false);
      kk := oJsonFile.AsString;
      Writeln(kk);
      //writeln( oJsonFile.AsJSon(False,False));
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

  try

//    WriteLn('Content-type: application/json');
    WriteLn('Content-type: application/json; charset=UTF-8');
//    WriteLn('Content-type: text/html; charset=UTF-8');
    Writeln;
//    oJsonFile := SO;
//    oJsonFile := buildPNLProducerBrand(1,1,1);
//    writeln( oJsonFile.AsJSon(True,False));

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
//4.Financial Report
//Action: GET
//Parameter: seminar, period
//Route example : ../finReport.exe?seminar=MAY&period=0
//Response:
//status code 200, JSON record which is defined in related schema which meets the specified parameters(seminar/period).CGI should decide which result file to read totally depends on seminar instead of *fileName (which is one of old version parameters).

        sValue := getVariable('QUERY_STRING');
        Explode(sValue, sListData);
        // initialize globals
        currentSeminar := getSeminar;
        currentPeriod := getPeriod;

        {** Read results file **}
          vReadRes := ReadResultsTwo(currentPeriod,currentResult,prevResult); // read results file


        // Now let's make some JSON stuff here
    //    oJsonFile := SO;
    //    oJsonFile := buildPNLRetailerVariant(2,1,2);
    //    writeln( oJsonFile.AsJSon(True,False));
             makeJson;
    //         webSrv(oJsonFile);

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

//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

