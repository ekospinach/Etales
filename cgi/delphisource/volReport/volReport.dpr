program volReport;

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
    'Retailer 1', 'Retailer 2', 'Retailer 3', 'Retailer 4',
    'Administrator');

  aVolRetail : array[1..5] of string = (
    '{v: Initial Inventory, f: "", vRUS: Начальный остаток , vCHN: 初始库存 }',
    '{v: Purchases, f: "", vRUS: Закупки , vCHN: 购买品 }',
    '{v: Sales, f: "", vRUS: Продажи , vCHN: 销售 }',
    '{v: Discontinued Goods, f: "", vRUS: Снятые с производства товары , vCHN: 停产商品 }',
    '{v: Closing Inventory, f: "", vRUS: Остатки на конец периода , vCHN: 期末库存 }');

  aVolProducer : array[1..5] of string = (
    '{v: Initial Inventory, f: "", vRUS: Начальный остаток , vCHN: 初始库存 }',
    '{v: Production, f: "", vRUS: Произведено , vCHN: 生产 }',
    '{v: Sales, f: "", vRUS: Продажи , vCHN: 销售 }',
    '{v: Discontinued Goods, f: "", vRUS: Снятые с производства товары , vCHN: 停产商品 }',
    '{v: Closing Inventory, f: "", vRUS: Остатки на конец периода , vCHN: 期末库存 }');

  aPriceRetail : array[1..5] of string = (
    '{v: Market Price, f: "", vRUS: Рыночная цена , vCHN: 市场价格 }',
    '{v: Purchase Price, f: "", vRUS: Цена закупки , vCHN: 购买价格 }',
    '{v: Effective Net Purchase Price, f: "", vRUS: Эффективная чистая цена закупки , vCHN: 有效净购买价格 }',
    '{v: Supplier Current List price, f: "", vRUS: Текущая прейскурантная цена  , vCHN: 供应商的当前定价 }',
    '{v: Supplier Next List Price, f: "", vRUS: Прейскурантная цена в следующем периоде , vCHN: 供应商的下一个价格表 }');

  aPriceProducer : array[1..5] of string = (
    '{v: Production Cost, f: "", vRUS: Цена производства , vCHN: 生产成本 }',
    '{v: Current List price BM, f: "", vRUS: Текущая прейскурантная цена  , vCHN: 供应商的当前定价 }',
    '{v: Next List Price BM, f: "", vRUS: Прейскурантная цена в следующем периоде , vCHN: 供应商的下一个价格表 }',
    '{v: Current List Price eMall, f: "", vRUS: Текущая прейскурантная цена в Интернете , vCHN: 供应商的当前定价eMall }',
    '{v: Next List Price eMall, f: "", vRUS: Прейскурантная цена в следующем периоде в Интернете , vCHN: 供应商的下一个价格表eMall }');

  aIndicesRetail : array[1..4] of string = (
//    '{v: Shelf Space, f: "", vRUS: Полочное пространство, vCHN: 货架空间}',
//    '{v: Promotions Intensity, f: "", vRUS:Иинтенсивность промо, vCHN: 促销强度}',
    '{v: Value Rotation Index  Sales value per 1% of shelf space, f: "", vRUS: Индекс оборачиваемости по стоимости Выручка на 1% полочного пространства, vCHN: 价值轮换指标 销售产值每1％的货架空间}',
    '{v: Volume Rotation Index  Sales volume per 1% of shelf space, f: "", vRUS: Индекс оборачиваемости по объему Товарооборот на 1% полочного пространства, vCHN: 卷轮换指标 每1％的货架空间的销售量}',
    '{v: Profitability Index  Gross Profit per 1% of shelf space, f: "", vRUS: Индекс прибыльности Валовая прибыль на 1% полочного пространства, vCHN: 盈利指数 毛利每1％的货架空间}',
    '{v: Stock Cover  Closing Inventory Volume / weekly Sales volume , f: "", vRUS: Покрытие запасами Остатки на конец периода / недельный оборот, vCHN: 股票封面 期末库存量/周销量}');

  aProfitabilityRetail  : array[1..10] of string = (
    '{v: Total shelf space (%), f: "",  vRUS: Полочное пространство (%), vCHN: 总货架空间(%)}',
    '{v: Net sales (RMB 000), f: "",  vRUS: Чистая выручка (RMB 000), vCHN: 净销售额(RMB 000)}',
    '{v: share in total (%), f: "",  vRUS: доля в общем (%), vCHN: 份额在总(%)}',
    '{v: Gross contribution (RMB 000), f: "",  vRUS: Валовая прибыль (RMB 000), vCHN: 总值的贡献(RMB 000)}',
    '{v: Financial revenue (RMB 000), f: "",  vRUS: Финансовый доход (RMB 000), vCHN: 财政收入(RMB 000)}',
    '{v: Adjusted gross contribution (RMB 000), f: "",  vRUS: Скорректированная валовая прибыль (RMB 000), vCHN: 调整后总贡献(RMB 000)}',
    '{v: as % of net sales (%), f: "",  vRUS: как % от чистой выручки (%), vCHN: 占净销售额的(%)}',
    '{v: share in total (%), f: "",  vRUS: доля в общем (%), vCHN: 份额在总(%)}',
    '{v: per 1% of shelf space (RMB 000), f: "",  vRUS: на 1% полочного пространства (RMB 000), vCHN: 每个货架空间1％(RMB 000)}',
    '{v: Terms of payment (days), f: "",  vRUS: Отсрочка платежа (дней), vCHN: 付款方式(天)}');

  aProfitabilityProducer  : array[1..17] of string = (
    '{v: Order volume (mln. Units), f: "",  vRUS: Объем заказа (mln. Units), vCHN: 订货量(mln. Units)}',
    '{v: Sales volume (mln. Units), f: "",  vRUS: Объем продаж (mln. Units), vCHN: 销量(mln. Units)}',
    '{v: Share in sales volume (%), f: "",  vRUS: Доля в объеме продаж (%), vCHN: 分享销售量(%)}',
    '{v: Applied quantity discount rate (%), f: "",  vRUS: Примененная скидка от объема (%), vCHN: 应用数量折扣率(%)}',
    '{v: Sales value (RMB 000), f: "",  vRUS: Объем продаж (RMB 000), vCHN: 销售产值(RMB 000)}',
    '{v: Share in gross sales value (%), f: "",  vRUS: Доля в валовой стоимости продаж (%), vCHN: 分享在总销售价值(%)}',
    '{v: Cost of goods sold (RMB 000), f: "",  vRUS: Себестоимость реализованной продукции (RMB 000), vCHN: 销货成本(RMB 000)}',
    '{v: Quantity discounts costs (RMB 000), f: "",  vRUS: Количественные скидки расходы (RMB 000), vCHN: 数量折扣成本(RMB 000)}',
    '{v: Performance bonus cost (RMB 000), f: "",  vRUS: Бонус Производительность стоимость (RMB 000), vCHN: 绩效奖金费用(RMB 000)}',
    '{v: In store activities fees (RMB 000), f: "",  vRUS: В сборов магазин деятельность (RMB 000), vCHN: 在店内活动费(RMB 000)}',
    '{v: Inventory holding cost compensation (RMB 000), f: "",  vRUS: Компенсации Инвентаризация холдинг стоимость (RMB 000), vCHN: 库存持有成本补偿(RMB 000)}',
    '{v: Promotional support (RMB 000), f: "",  vRUS: Рекламные поддержка (RMB 000), vCHN: 促销支持(RMB 000)}',
    '{v: Financial Cost (delay of payment) (RMB 000), f: "",  vRUS: Финансовая стоимость (отсрочка платежа) (RMB 000), vCHN: 财务费用（支付延迟）(RMB 000)}',
    '{v: Other compensation (RMB 000), f: "",  vRUS: Другие компенсации (RMB 000), vCHN: 其他补偿(RMB 000)}',
    '{v: Total trade support (RMB 000), f: "",  vRUS: Всего поддержка торговли (RMB 000), vCHN: 总贸易支持(RMB 000)}',
    '{v: Gross profit after PUSH (RMB 000), f: "",  vRUS: Валовая прибыль после PUSH (RMB 000), vCHN: 推后毛利(RMB 000)}',
    '{v: Share in gross profit (%), f: "",  vRUS: Доля в валовой прибыли (%), vCHN: 分享毛利(%)}');

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
      if sListData.IndexOfName('seminar') <> -1 then
        Result  := DatDir + 'Results.' + sListData.Values['seminar'];
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

{** Volume reports **}

    function buildVolumeRetailerGlobal(pwho,pmark: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        jr := SO('{id: "2", label: Company total, labelENG: Company total,' +
              'labelRUS: Итого по компании, labelCHN: 公司总, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_InitialInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_InitialInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_PurchaseVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PurchaseVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_SalesVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_DiscontinuedGoodsVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DiscontinuedGoodsVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5 rq_ClosingInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[5]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ClosingInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);
      end;

    function buildVolumeRetailerCategory(pwho,pmark: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id: "2", label: Elecsories, labelENG: Elecsories,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "3", label: "Health&Beauty", labelENG: "Health&Beauty",' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_InitialInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_InitialInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_InitialInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_PurchaseVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_PurchaseVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_PurchaseVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_SalesVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_SalesVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_DiscontinuedGoodsVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_DiscontinuedGoodsVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_DiscontinuedGoodsVolume ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //5 rq_ClosingInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[5]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ClosingInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ClosingInventory ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);
      end;

    function buildVolumeRetailerBrand(pwho,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
          jr := SO('{id: "' +
                IntToStr(I + 1) +
                '", label: "' +
                WideCharToString( pp.rb_BrandName ) +
                '", labelENG: "",' +
                'labelRUS: "", labelCHN: "", ' +
                'type: string, color: 0}');
          Result.A['cols'].Add(jr);
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rb_InitialInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_InitialInventory ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2 rb_PurchaseVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_PurchaseVolume ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3 rb_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_SalesVolume ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //4 rb_DiscontinuedGoodsVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_DiscontinuedGoodsVolume ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //5 rb_ClosingInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[5]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ClosingInventory ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);
      end;

    function buildVolumeRetailerVariant(pwho,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
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
                  jr := SO('{id: "' +
                              IntToStr(I + 1) +
                              '", label: "' +
                              WideCharToString( pp.rb_BrandName ) +
                              WideCharToString( pv.rv_VariantName ) +
                              '", labelENG: "",' +
                              'labelRUS: "", labelCHN: "", ' +
                              'type: string, color: 0}');
                   Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rv_InitialInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[1]);
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
                        pv.rv_InitialInventory[InventoryAgesMaxTotal].invd_Volume ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 rv_PurchaseVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[2]);
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
                        pv.rv_PurchaseVolume ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 rv_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[3]);
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
                        pv.rv_SalesVolume ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 rv_DiscontinuedGoodsVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[4]);
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
                        pv.rv_DiscontinuedGoodsVolume ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //5 rv_ClosingInventory
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolRetail[5]);
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
                        pv.rv_ClosingInventory[InventoryAgesMaxTotal].invd_Volume ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);
      end;

    function buildVolumeProducerCategory(pprod,pmark: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id: "2", label: Elecsories, labelENG: Elecsories,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "3", label: "Health&Beauty", labelENG: "Health&Beauty",' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 pc_InitialInventory
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[1]);
          jo.A['c'].Add(jf);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[ElecsoriesID].pc_InitialInventory) +
            '"}');
          jo.A['c'].Add(jr);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[HealthBeautiesID].pc_InitialInventory) +
            '"}');
          jo.A['c'].Add(jr);
          result.A['rows'].Add(jo);
        end;

      //2 pc_ProductionVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[2]);
          jo.A['c'].Add(jf);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[ElecsoriesID].pc_ProductionVolume) +
            '"}');
          jo.A['c'].Add(jr);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[HealthBeautiesID].pc_ProductionVolume) +
            '"}');
          jo.A['c'].Add(jr);
          result.A['rows'].Add(jo);
        end;

      //3 pc_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolProducer[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[ElecsoriesID].pc_SalesVolume[AllRetsMaxTotal][pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pt_CategoriesResults[HealthBeautiesID].pc_SalesVolume[AllRetsMaxTotal][pmark] ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

       //4 pc_DiscontinuedGoodsVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[4]);
          jo.A['c'].Add(jf);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[ElecsoriesID].pc_DiscontinuedGoodsVolume ) +
            '"}');
          jo.A['c'].Add(jr);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[HealthBeautiesID].pc_DiscontinuedGoodsVolume ) +
            '"}');
          jo.A['c'].Add(jr);
          result.A['rows'].Add(jo);
        end;

      //5 pc_ClosingInventory
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[5]);
          jo.A['c'].Add(jf);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[ElecsoriesID].pc_ClosingInventory) +
            '"}');
          jo.A['c'].Add(jr);
          jr := SO('{f: "", v: "' +
            FormatFloat('0.00',
              pt_CategoriesResults[HealthBeautiesID].pc_ClosingInventory) +
            '"}');
          jo.A['c'].Add(jr);
          result.A['rows'].Add(jo);
        end;
      end;
    end;

    function buildVolumeProducerBrand(pprod,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);

        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
          jr := SO('{id: "' +
                IntToStr(I + 1) +
                '", label: "' +
                WideCharToString( pp.pb_BrandName ) +
                '", labelENG: "",' +
                'labelRUS: "", labelCHN: "", ' +
                'type: string, color: 0}');
          Result.A['cols'].Add(jr);
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 pb_InitialInventory
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[1]);
          jo.A['c'].Add(jf);
          for I := Low(abrn) to High(abrn) do
            begin
              pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
              jr := SO('{f: "", v: "' +
                FormatFloat('0.00',
                  pp.pb_InitialInventory) +
                '"}');
              jo.A['c'].Add(jr);
            end;
          result.A['rows'].Add(jo);
        end;

      //2 pb_ProductionVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[2]);
          jo.A['c'].Add(jf);
          for I := Low(abrn) to High(abrn) do
            begin
              pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
              jr := SO('{f: "", v: "' +
                FormatFloat('0.00',
                  pp.pb_ProductionVolume ) +
                '"}');
              jo.A['c'].Add(jr);
            end;
          result.A['rows'].Add(jo);
        end;

      //3 pb_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolProducer[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pb_SalesVolume[AllRetsMaxTotal][pmark] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

       //4 pb_DiscontinuedGoodsVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[4]);
          jo.A['c'].Add(jf);
          for I := Low(abrn) to High(abrn) do
            begin
              pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
              jr := SO('{f: "", v: "' +
                FormatFloat('0.00',
                  pp.pb_DiscontinuedGoodsVolume ) +
                '"}');
              jo.A['c'].Add(jr);
            end;
          result.A['rows'].Add(jo);
        end;

      //5 pt_CategoriesResults[].pc_CostOfGoodsSold   [AllRetsMaxTotal, MrktsMaxTotal]
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[5]);
          jo.A['c'].Add(jf);
          for I := Low(abrn) to High(abrn) do
            begin
              pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat].pc_BrandsResults[abrn[I]];
              jr := SO('{f: "", v: "' +
                FormatFloat('0.00',
                  pp.pb_ClosingInventory ) +
                '"}');
              jo.A['c'].Add(jr);
            end;
          result.A['rows'].Add(jo);
        end;
    end;

    function buildVolumeProducerVariant(pprod,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
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
                  jr := SO('{id: "' +
                        IntToStr(I + 1) +
                        '", label: "' +
                        WideCharToString( pp.pb_BrandName ) +
                        WideCharToString( pv.pv_VariantName ) +
                        '", labelENG: "",' +
                        'labelRUS: "", labelCHN: "", ' +
                        'type: string, color: 0}');
                  Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 pv_InitialInventory
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[1]);
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
                          pv.pv_InitialInventory[InventoryAgesMaxTotal].invd_Volume ) +
                        '"}');
                      jo.A['c'].Add(jr);
                    end;
                end;
            end;
          result.A['rows'].Add(jo);
        end;

      //2 pv_ProductionVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[2]);
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
                          pv.pv_ProductionVolume) +
                        '"}');
                      jo.A['c'].Add(jr);
                    end;
                end;
            end;
          result.A['rows'].Add(jo);
        end;

      //3 pv_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aVolProducer[3]);
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
                        pv.pv_SalesVolume[AllRetsMaxTotal][pmark] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 pv_DiscontinuedGoodsVolume
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[4]);
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
                          pv.pv_DiscontinuedGoodsVolume ) +
                        '"}');
                      jo.A['c'].Add(jr);
                    end;
                end;
            end;
          result.A['rows'].Add(jo);
        end;

      //5 pv_ClosingInventory
      if pmark = MrktsMaxTotal then
        begin
          jo := SO;
          jo.O['c'] := SA([]);
          jf := SO(aVolProducer[5]);
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
                          pv.pv_ClosingInventory[InventoryAgesMaxTotal].invd_Volume ) +
                        '"}');
                      jo.A['c'].Add(jr);
                    end;
                end;
            end;
          result.A['rows'].Add(jo);
        end;
    end;

    function collectDataProducer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO;
// there is no global view in producer volume report
//      if (pwho < Prod_4_ID) and (pdet = 1) then
//        Result['data'] := buildPNLProducerGlobal(pwho,pmkt);
      if (pwho < Prod_4_ID) and (pdet = 2) then
        Result['data'] := buildVolumeProducerCategory(pwho,pmkt);
      if (pwho < Prod_4_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildVolumeProducerBrand(pwho,pmkt,pcat);
        end;
      if (pwho < Prod_4_ID) and (pdet = 4)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildVolumeProducerVariant(pwho,pmkt,pcat);
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
      if (pwho > Prod_4_ID) and (pwho < Admin_ID) and (pdet = 1) then
        Result['data'] := buildVolumeRetailerGlobal(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < Admin_ID) and (pdet = 2) then
        Result['data'] := buildVolumeRetailerCategory(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < Admin_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildVolumeRetailerBrand(pwho - Prod_4_ID,pmkt,pcat);
        end;
      if (pwho > Prod_4_ID) and (pwho < Admin_ID) and (pdet = 4)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildVolumeRetailerVariant(pwho - Prod_4_ID,pmkt,pcat);
        end;
    end;

    function serveRequestVolume() : ISuperObject;
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
      j_o.S['titleENG'] := 'Volumes Report';
      j_o.S['titleCHN'] := '卷报告';
      j_o.S['titleRUS'] := 'Отчет об объемах';

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
            for det := 2 to 4 do
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
//              for pl := Ret_1_ID to Ret_2_ID do
              for pl := Ret_1_ID to E_Mall_ID do
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

{** Price reports **}
    function buildPriceRetailerVariant(pwho,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp : TRetailerBrandResults;
      pv : TRetailerVariantResults;
      sv: TProducerVariantResults;
      abrn : array of Integer;
      I, brn, vr, prd : Integer;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
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
                  jr := SO('{id: "' +
                              IntToStr(I + 1) +
                              '", label: "' +
                              WideCharToString( pp.rb_BrandName ) +
                              WideCharToString( pv.rv_VariantName ) +
                              '", labelENG: "",' +
                              'labelRUS: "", labelCHN: "", ' +
                              'type: string, color: 0}');
                   Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rv_MarketPrice
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceRetail[1]);
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
                        pv.rv_MarketPrice ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

				//2 rv_AcquisitionCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceRetail[2]);
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
                        pv.rv_AcquisitionCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 rv_CurrentUnitAcquisitionAverageCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceRetail[3]);
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
                        pv.rv_CurrentUnitAcquisitionCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 pv_CurrentPriceBM :: need to take this price from Producer!!!
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceRetail[4]);
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
                    //find variant in Producer results
                    prd := pv.rv_VariantID div 100;
                    brn := (pv.rv_VariantID - 100 * prd) div 10;
                    //should be a fork for 1~4 VS 5-6 (retail)
                    if prd <= 4 then
                      begin
                        sv := currentResult.r_Producers[prd].pt_CategoriesResults[pcat].pc_BrandsResults[brn].pb_VariantsResults[vr];
                        jr := SO('{f: "", v: "' +
                          FormatFloat('0.00',
                            sv.pv_CurrentPriceBM ) +
                          '"}');
                      end;
                    if prd > 4 then
                        jr := SO('{f: "", v: ""}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //5 pv_NextPriceBM  :: need to take this price from Prodcuer
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceRetail[5]);
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
                    //find variant in Producer results
                    prd := pv.rv_VariantID div 100;
                    brn := (pv.rv_VariantID - 100 * prd) div 10;
                    //should be a fork for 1~4 VS 5-6 (retail)
                    if prd <= 4 then
                      begin
                        sv := currentResult.r_Producers[prd].pt_CategoriesResults[pcat].pc_BrandsResults[brn].pb_VariantsResults[vr];
                        jr := SO('{f: "", v: "' +
                          FormatFloat('0.00',
                            sv.pv_NextPriceBM ) +
                          '"}');
                      end;
                    if prd > 4 then
                        jr := SO('{f: "", v: ""}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);
      end;

    function buildPriceProducerVariant(pprod,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
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
                  jr := SO('{id: "' +
                        IntToStr(I + 1) +
                        '", label: "' +
                        WideCharToString( pp.pb_BrandName ) +
                        WideCharToString( pv.pv_VariantName ) +
                        '", labelENG: "",' +
                        'labelRUS: "", labelCHN: "", ' +
                        'type: string, color: 0}');
                  Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 pv_ProductionCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceProducer[1]);
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
                        pv.pv_ProductionCost[AllRetsMaxTotal][MrktsMaxTotal] ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 pv_CurrentPriceBM
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceProducer[2]);
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
                        pv.pv_CurrentPriceBM) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 pv_NextPriceBM
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceProducer[3]);
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
                        pv.pv_NextPriceBM ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 pv_CurrentPriceEmall
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceProducer[4]);
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
                        pv.pv_CurrentPriceEmall) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //5 pv_NextPriceEmall 
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aPriceProducer[5]);
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
                        pv.pv_NextPriceEmall ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);				
				end;

    function collectPriceDataProducer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO;
      Result.S['category'] := aCategories[pcat];
      Result['data'] := buildPriceProducerVariant(pwho,pmkt,pcat);
    end;

    function collectPriceDataRetailer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO();
      Result.S['category'] := aCategories[pcat];
      Result['data'] := buildPriceRetailerVariant(pwho - Prod_4_ID,pmkt,pcat);
    end;

    function serveRequestPrice() : ISuperObject;
    var
      j_pl, j_o : ISuperObject;
      s_str : string;
      cat, pl, det, rrole, mkt : Integer;
    begin
      det := 4; //price report is built by variant only
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
      j_o.S['titleENG'] := 'Prices per unit';
      j_o.S['titleCHN'] := '每单位价格';
      j_o.S['titleRUS'] := 'Цены на единицу';

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
              for pl := Prod_1_ID to Prod_3_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  begin
                    if det < 3 then
                      j_pl.A['dataCollection'].Add( collectPriceDataProducer(pl,mkt,det,0) );
                    if det > 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectPriceDataProducer(pl,mkt,det,cat) );
                  end;
          // collect Retailer reports
          if rrole = 2 then
              for pl := Ret_1_ID to Ret_2_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  begin
                    if det < 3 then
                      j_pl.A['dataCollection'].Add( collectPriceDataRetailer(pl,mkt,det,0) );
                    if det > 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectPriceDataRetailer(pl,mkt,det,cat) );
                  end;
          j_o.A['reportCollection'].Add( j_pl );
        end;

     Result := j_o;
    end;
{** Indices reports **}
    function buildIndicesRetailerGlobal(pwho,pmark: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        jr := SO('{id: "2", label: Company total, labelENG: Company total,' +
              'labelRUS: Итого по компании, labelCHN: 公司总, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_ValueRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ValueRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_VolumeRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_VolumeRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_ProfitabilityIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ProfitabilityIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_ClosingStockCover
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ClosingStockCover ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);
      end;

    function buildIndicesRetailerCategory(pwho,pmark: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id: "2", label: Elecsories, labelENG: Elecsories,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "3", label: "Health&Beauty", labelENG: "Health&Beauty",' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 rq_ValueRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[1]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ValueRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ValueRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //2 rq_VolumeRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[2]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_VolumeRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_VolumeRotationIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //3 rq_ProfitabilityIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[3]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ProfitabilityIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ProfitabilityIndex * 100 ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);

      //4 rq_ClosingStockCover
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[4]);
        jo.A['c'].Add(jf);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            pp.rq_ClosingStockCover ) +
          '"}');
        jo.A['c'].Add(jr);
        jr := SO('{f: "", v: "' +
          FormatFloat('0.00',
            ph.rq_ClosingStockCover ) +
          '"}');
        jo.A['c'].Add(jr);
        result.A['rows'].Add(jo);
      end;

    function buildIndicesRetailerBrand(pwho,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        // brand names
        for I := Low(abrn) to High(abrn) do
        begin
          pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
          jr := SO('{id: "' +
                IntToStr(I + 1) +
                '", label: "' +
                WideCharToString( pp.rb_BrandName ) +
                '", labelENG: "",' +
                'labelRUS: "", labelCHN: "", ' +
                'type: string, color: 0}');
          Result.A['cols'].Add(jr);
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rb_ValueRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[1]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ValueRotationIndex * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2 rb_VolumeRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[2]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_VolumeRotationIndex * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3 rb_ProfitabilityIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[3]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ProfitabilityIndex * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //4 rb_ClosingStockCover
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[4]);
        jo.A['c'].Add(jf);
        for I := Low(abrn) to High(abrn) do
          begin
            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rb_ClosingStockCover ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);
      end;

    function buildIndicesRetailerVariant(pwho,pmark,pcat: Integer): ISuperObject;
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
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
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
                  jr := SO('{id: "' +
                              IntToStr(I + 1) +
                              '", label: "' +
                              WideCharToString( pp.rb_BrandName ) +
                              WideCharToString( pv.rv_VariantName ) +
                              '", labelENG: "",' +
                              'labelRUS: "", labelCHN: "", ' +
                              'type: string, color: 0}');
                   Result.A['cols'].Add(jr);
                end;
            end;
        end;

      // rows
        result.O['rows'] := sa([]);

      //1 rv_ValueRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[1]);
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
                        pv.rv_ValueRotationIndex * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 rv_VolumeRotationIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[2]);
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
                        pv.rv_VolumeRotationIndex * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //3 rv_ProfitabilityIndex
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[3]);
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
                        pv.rv_ProfitabilityIndex * 100 ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //4 rv_ClosingStockCover
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aIndicesRetail[4]);
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
                        pv.rv_ClosingStockCover ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);
      end;

    function collectIndicesDataRetailer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := '';
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO();
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 1) then
        Result['data'] := buildIndicesRetailerGlobal(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 2) then
        Result['data'] := buildIndicesRetailerCategory(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildIndicesRetailerBrand(pwho - Prod_4_ID,pmkt,pcat);
        end;
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 4)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildIndicesRetailerVariant(pwho - Prod_4_ID,pmkt,pcat);
        end;
    end;

    function serveRequestIndices() : ISuperObject;
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
      j_o.S['titleENG'] := 'Performance Indices';
      j_o.S['titleCHN'] := '性能指标';
      j_o.S['titleRUS'] := 'Коэффициенты эффективности';

      {** Data Collection **}
      j_o.O['reportCollection'] := SA([]);

      //build report collection
      //change role and dataCollection once per all Producers/Retailers
      for rrole :=2 to 2 do
        begin
          if rrole = 1 then
            s_str := 'Producer'
          else
            s_str := 'Retailer';
          j_pl := SO('{role: ' + s_str + '}');
          j_pl.O['dataCollection'] := SA([]);
          // collect Producer reports
          if rrole = 1 then
            for det := 2 to 4 do
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
                      j_pl.A['dataCollection'].Add( collectIndicesDataRetailer(pl,mkt,det,0) );
                    if det > 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectIndicesDataRetailer(pl,mkt,det,cat) );
                  end;
          j_o.A['reportCollection'].Add( j_pl );
        end;

     Result := j_o;
    end;

    function buildProfitProducerCategory(pprod,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr: ISuperObject;
      pp : TProducerCategoryResults;
      I: Integer;
    begin
      pp := currentResult.r_Producers[pprod].pt_CategoriesResults[pcat];
      //columns
        Result := SO;
        Result.O['cols'] := SA([]);
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id: "2", label: Retailer 1, labelENG: Retailer 1,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "3", label: Retailer 2, labelENG: Retailer 2,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "4", label: Traditional Trade, labelENG: Traditional Trade,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "5", label: eMall, labelENG: eMall,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
      // rows
        result.O['rows'] := sa([]);

      //1 pv_OrderVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[1]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_OrderVolume[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2  pv_SalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[2]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_SalesVolume[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3 pv_ShareInBrandSalesVolume
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[3]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_ShareInCompanyGrossSalesValue[I, pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

//      //4  pv_AppliedDiscountRate   NO such field in this view
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aProfitabilityProducer[4]);
//        jo.A['c'].Add(jf);
//        for I := Low(TAllRetailers) to High(TAllRetailers) do
//          begin
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.[I, pmark]) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //5  pv_GrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[5]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_GrossSalesValue[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //6  pv_ShareInBrandGrossSalesValue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[6]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_ShareInCompanyGrossSalesValue[I, pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //7 pv_CostOfGoodsSold
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[7]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_CostOfGoodsSold[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //8 pv_VolumeDiscountCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[8]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_VolumeDiscountCost[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //9 pv_PerformanceBonusCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[9]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_PerformanceBonusCost[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

//      //10 pv_InStoreActivitiesFee
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aProfitabilityProducer[10]);
//        jo.A['c'].Add(jf);
//        for I := Low(TAllRetailers) to High(TAllRetailers) do
//          begin
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.pc_InStoreActivitiesFee[I, pmark]) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

//      //11  pv_InventoryHoldingCost
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aProfitabilityProducer[11]);
//        jo.A['c'].Add(jf);
//        for I := Low(TAllRetailers) to High(TAllRetailers) do
//          begin
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.pc_InventoryHoldingCost[I, pmark]) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

//      //12 pv_PromotionalSupport
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aProfitabilityProducer[12]);
//        jo.A['c'].Add(jf);
//        for I := Low(TAllRetailers) to High(TAllRetailers) do
//          begin
//            jr := SO('{f: "", v: "' +
//              FormatFloat('0.00',
//                pp.pc_PromotionalSupport[I, pmark]) +
//              '"}');
//            jo.A['c'].Add(jr);
//          end;
//        result.A['rows'].Add(jo);

      //13 pv_NetFinancialCost
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[13]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_NetFinancialCost[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //14 pv_OtherCompensation
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[14]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_OtherCompensation[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //15 pv_TotalTradeSupport
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[15]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_TotalTradeSupport[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //16 pv_GrossProfitAfterPush
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[16]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_GrossProfitAfterPush[I, pmark]) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //17 pv_ShareInBrandGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityProducer[17]);
        jo.A['c'].Add(jf);
        for I := Low(TAllRetailers) to High(TAllRetailers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.pc_ShareInCompanyGrossProfit[I, pmark] * 100) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);
      end;

    function collectProfitProducer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['category'] := aCategories[pcat];
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO;
// there is no global view in producer profit by channel report
//      if (pwho < Prod_4_ID) and (pdet = 1) then
//        Result['data'] := buildPNLProducerGlobal(pwho,pmkt);
      if (pwho < Prod_4_ID) and (pdet = 2) then
        Result['data'] := buildProfitProducerCategory(pwho,pmkt,pcat);
// OA:: I doubt we need this at least now
//      if (pwho < Prod_4_ID) and (pdet = 3)  then
//        Result['data'] := buildProfitProducerBrand(pwho,pmkt,pcat);
//      if (pwho < Prod_4_ID) and (pdet = 4)  then
//        Result['data'] := buildVolumeProducerVariant(pwho,pmkt,pcat);
    end;

    function serveRequestProfitByChannel(): ISuperObject;
    var
      jo, j_pl: ISuperObject;
      rrole, det, pl, mkt, cat: Integer;
      s_str: string;
    begin
      jo := SO; //initialise JSON object

      {** Header **}
      //seminar ***
      jo.S['Seminar'] := currentSeminar;

      //filename ***
      jo.S['fileName'] := getFileName;

      //period OR latestHistoryPeriod
      jo.I['latestHistoryPeriod'] := currentPeriod;

      // report titleENG is very important, we gotta use it
      // to recognise different report in database.
      jo.S['titleENG'] := 'Profitability by Channel';
      jo.S['titleCHN'] := '盈利能力通过分销渠道';
      jo.S['titleRUS'] := 'Рентабельность по каналам дистрибуции';

      {** Data Collection **}
      jo.O['reportCollection'] := SA([]);

      //build report collection
      //change role and dataCollection once per all Producers/Retailers
      for rrole :=1 to 1 do   //this one works for Producers only
        begin
          if rrole = 1 then
            s_str := 'Producer'
          else
            s_str := 'Retailer';
          j_pl := SO('{role: ' + s_str + '}');
          j_pl.O['dataCollection'] := SA([]);
          // collect Producer reports
          if rrole = 1 then
            for det := 2 to 2 do      //OA we build this report on category level only
              for pl := Prod_1_ID to Prod_3_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  for cat := Low(TCategories) to High(TCategories) do
                    j_pl.A['dataCollection'].Add( collectProfitProducer(pl,mkt,det,cat) );
          jo.A['reportCollection'].Add( j_pl );
        end;

     Result := jo;
     end;

    function buildProfitBySupplier(pwho,pmark,pcat: Integer): ISuperObject;
    var
      jo, jf, jr : ISuperObject;
      pp: TRetailerQuarterResults;
      vmnft: Integer;
    begin
      //initialize
      pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat];
      Result := SO();
      jo := SO;
      //columns
        Result.O['cols'] := SA([]);
        jf := SO('{id: "1", label: Item, labelENG: Item,' +
              'labelRUS: Наименование, labelCHN: 事实, ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jf);
        jr := SO('{id: "2", label: Manufacturer 1, labelENG: Manufacturer 1,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "3", label: Manufacturer 2, labelENG: Manufacturer 2,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "4", label: Manufacturer 3, labelENG: Manufacturer 3,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);
        jr := SO('{id: "5", label: Private label, labelENG: Private label,' +
              'labelRUS: "", labelCHN: "", ' +
							'type: string, color: 0}');
        Result.A['cols'].Add(jr);

      // rows
        result.O['rows'] := sa([]);

      //1     rq_ShelfSpacePerSupplier
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[1]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_ShelfSpacePerSupplier[vmnft] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //2         rq_NetSalesRevenue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[2]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_NetSalesRevenue[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //3         rq_SuppliersShareInNetSalesRevenue
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[3]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_SuppliersShareInNetSalesRevenue[vmnft] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //4         rq_GrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[4]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_GrossProfit[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //5      rq_NetFinancialBenefit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[5]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_NetFinancialBenefit[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //6      rq_AdjustedGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[6]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_AdjustedGrossProfit[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //7     rq_AdjustedGrossProfitMargin
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[7]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_AdjustedGrossProfitMargin[vmnft] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //8      rq_SuppliersShareInAdjustedGrossProfit
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[8]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_SuppliersShareInAdjustedGrossProfit[vmnft] * 100 ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //9      rq_AdjustedGrossProfitPerShelfSpace
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[9]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_AdjustedGrossProfitPerShelfSpace[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);

      //10         rq_TermsOfPayment
        jo := SO;
        jo.O['c'] := SA([]);
        jf := SO(aProfitabilityRetail[10]);
        jo.A['c'].Add(jf);
        for vmnft := Low(TAllProducers) to High(TAllProducers) do
          begin
            jr := SO('{f: "", v: "' +
              FormatFloat('0.00',
                pp.rq_TermsOfPayment[vmnft] ) +
              '"}');
            jo.A['c'].Add(jr);
          end;
        result.A['rows'].Add(jo);
      end;

    function collectProfitDataRetailer(pwho,pmkt,pdet,pcat: Integer): ISuperObject;
    begin
      Result := SO;
      Result.S['market'] := aMarkets[pmkt];
      Result.S['detail'] := aDetails[pdet];
      Result.S['roleID'] := aRoles[pwho];
      Result.O['data'] := SO();
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 2)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildProfitBySupplier(pwho - Prod_4_ID,pmkt,pcat);
        end;
    end;

    function serveRequestProfitBySupplier(): ISuperObject;
    var
      jo, j_pl: ISuperObject;
      rrole, det, pl, mkt, cat: Integer;
      s_str: string;
    begin
      jo := SO; //initialise JSON object

      {** Header **}
      //seminar ***
      jo.S['Seminar'] := currentSeminar;

      //filename ***
      jo.S['fileName'] := getFileName;

      //period OR latestHistoryPeriod
      jo.I['latestHistoryPeriod'] := currentPeriod;

      // report titleENG is very important, we gotta use it
      // to recognise different report in database.
      jo.S['titleENG'] := 'Profitability by Supplier';
      jo.S['titleCHN'] := '盈利能力由供应商';
      jo.S['titleRUS'] := 'Рентабельность по поставщикам';

      {** Data Collection **}
      jo.O['reportCollection'] := SA([]);

      //build report collection
      //change role and dataCollection once per all Producers/Retailers
      for rrole :=2 to 2 do
      { This report works only for Retailers }
        begin
          if rrole = 1 then
            s_str := 'Producer'
          else
            s_str := 'Retailer';
          j_pl := SO('{role: ' + s_str + '}');
          j_pl.O['dataCollection'] := SA([]);
          // collect Producer reports
          if rrole = 1 then
            Writeln('Something wrong it should be a dead end');
          // collect Retailer reports
          if rrole = 2 then
            for det := 2 to 2 do   //only quarter details are available
              for pl := Ret_1_ID to Ret_2_ID do
                for mkt := Low(TMarketsTotal) to High(TMarketsTotal) do
                  begin
                    if det = 2 then
                      for cat := Low(TCategories) to High(TCategories) do
                        j_pl.A['dataCollection'].Add( collectProfitDataRetailer(pl,mkt,det,cat) );
                  end;
          jo.A['reportCollection'].Add( j_pl );
        end;

     Result := jo;
    end;

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SA([]);
      oJsonFile[''] := serveRequestVolume;
      oJsonFile[''] := serveRequestPrice;
      oJsonFile[''] := serveRequestIndices;
      oJsonFile[''] := serveRequestProfitBySupplier;
      oJsonFile[''] := serveRequestProfitByChannel;
      s_str := 'out' + '.json';
      oJsonFile.SaveTo(s_str, true, false);
      kk := oJsonFile.AsString;
      Writeln(kk);
      //writeln( oJsonFile.AsJSon(False,False));
    end;


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
//5.Volume Report
//Action: GET
//Parameter: seminar, period
//Route example : ../volReport.exe?seminar=MAY&period=0
//Response:
//status code 200, JSON record”S" which is defined in related schema, including all the volReport”S" which meets the specified parameters(seminar/period), response content should be a array. CGI should decide which result file to read totally depends on seminar instead of *fileName (which is one of old version parameters).

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

