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
    'Retailer 1', 'Retailer 2', 'Traditional Trade', 'e-Mall',
    'Administrator');

  aVolRetail : array[1..5] of string = (
    '{v: Initial Inventory, f: "", vRUS: Начальный остаток , vCHN: 初始库存 }',
    '{v: Purchases, f: "", vRUS: Закупки , vCHN: 购买品 }',
    '{v: Sales, f: "", vRUS: Продажи , vCHN: 销售 }',
    '{v: Discontinued Goods, f: "", vRUS: Товары, снятые с производства , vCHN: 停产商品 }',
    '{v: Closing Inventory, f: "", vRUS: Остатки на конец периода , vCHN: 期末库存 }');

  aVolProducer : array[1..5] of string = (
    '{v: Initial Inventory, f: "", vRUS: Начальный остаток , vCHN: 初始库存 }',
    '{v: Production, f: "", vRUS: Произведено , vCHN: 生产 }',
    '{v: Sales, f: "", vRUS: Продажи , vCHN: 销售 }',
    '{v: Discontinued Goods, f: "", vRUS: Товары, снятые с производства , vCHN: 停产商品 }',
    '{v: Closing Inventory, f: "", vRUS: Остатки на конец периода , vCHN: 期末库存 }');

  aPriceRetail : array[1..4] of string = (
    '{v: Purchase Price, f: "", vRUS: Цена закупки , vCHN: 购买价格 }',
    '{v: Effective Net Purchase Price, f: "", vRUS: Эффективная чистая цена закупки , vCHN: 有效净购买价格 }',
    '{v: Supplier Current List price, f: "", vRUS: Текущая прейскурантная цена  , vCHN: 供应商的当前定价 }',
    '{v: Supplier Next List Price, f: "", vRUS: Прейскурантная цена в следующем периоде , vCHN: 供应商的下一个价格表 }');

  aPriceProducer : array[1..3] of string = (
    '{v: Production Cost, f: "", vRUS: Цена производства , vCHN: 生产成本 }',
    '{v: Current List price, f: "", vRUS: Текущая прейскурантная цена  , vCHN: 供应商的当前定价 }',
    '{v: Next List Price, f: "", vRUS: Прейскурантная цена в следующем периоде , vCHN: 供应商的下一个价格表 }');

  aIndicesRetail : array[1..4] of string = (
    '{v: Value Rotation Index  Sales value per 1% of shelf space, f: "", vRUS: Индекс оборачиваемости по стоимости Выручка на 1% полочного пространства, vCHN: 价值轮换指标 销售产值每1％的货架空间}',
    '{v: Volume Rotation Index  Sales volume per 1% of shelf space, f: "", vRUS: Индекс оборачиваемости по объему Товарооборот на 1% полочного пространства, vCHN: 卷轮换指标 每1％的货架空间的销售量}',
    '{v: Profitability Index  Gross Profit per 1% of shelf space, f: "", vRUS: Индекс прибыльности Валовая прибыль на 1% полочного пространства, vCHN: 盈利指数 毛利每1％的货架空间}',
    '{v: Stock Cover  Closing Inventory Volume / weekly Sales volume , f: "", vRUS: Покрытие запасами Остатки на конец периода / недельный оборот, vCHN: 股票封面 期末库存量/周销量}');

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

      //1 pc_InitialInventory
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

      //2 pc_ProductionVolume
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

      //5 pc_ClosingInventory
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

      //1 pb_InitialInventory
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

      //2 pb_ProductionVolume
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

      //5 pt_CategoriesResults[].pc_CostOfGoodsSold   [AllRetsMaxTotal, MrktsMaxTotal]
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

      //1 pv_InitialInventory
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

      //2 pv_ProductionVolume
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

      //5 pv_ClosingInventory
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
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 1) then
        Result['data'] := buildVolumeRetailerGlobal(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 2) then
        Result['data'] := buildVolumeRetailerCategory(pwho - Prod_4_ID,pmkt);
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 3)  then
        begin
          Result.S['category'] := aCategories[pcat];
          Result['data'] := buildVolumeRetailerBrand(pwho - Prod_4_ID,pmkt,pcat);
        end;
      if (pwho > Prod_4_ID) and (pwho < TradTrade_ID) and (pdet = 4)  then
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

{** Price reports **}
    function buildPriceRetailerVariant(pwho,pmark,pcat: Integer): ISuperObject;
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

      //1 rv_AcquisitionCost
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
                        pv.rv_AcquisitionCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

      //2 rv_CurrentUnitAcquisitionAverageCost
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
                        pv.rv_CurrentUnitAcquisitionCost ) +
                      '"}');
                    jo.A['c'].Add(jr);
                  end;
              end;
          end;
        result.A['rows'].Add(jo);

//      //3 pv_CurrentPriceBM :: need to take this price from Producer!!!
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPriceRetail[3]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
//              begin
//                pv := pp.rb_VariantsResults[vr];
//                //check variant exists :: could be not the best
//                if pv.rv_VariantID <> 0 then
//                  begin
//                    jr := SO('{f: "", v: "' +
//                      FormatFloat('0.00',
//                        pv.rv_SalesVolume ) +
//                      '"}');
//                    jo.A['c'].Add(jr);
//                  end;
//              end;
//          end;
//        result.A['rows'].Add(jo);
//
//      //4 pv_NextPriceBM  :: need to take this price from Prodcuer
//        jo := SO;
//        jo.O['c'] := SA([]);
//        jf := SO(aPriceRetail[4]);
//        jo.A['c'].Add(jf);
//        for I := Low(abrn) to High(abrn) do
//          begin
//            pp := currentResult.r_Retailers[pwho].rr_Quarters[pmark][pcat].rq_BrandsResults[abrn[I]];
//            for vr := Low(TOneBrandVars) to High(TOneBrandVars) do
//              begin
//                pv := pp.rb_VariantsResults[vr];
//                //check variant exists :: could be not the best
//                if pv.rv_VariantID <> 0 then
//                  begin
//                    jr := SO('{f: "", v: "' +
//                      FormatFloat('0.00',
//                        pv.rv_DiscontinuedGoodsVolume ) +
//                      '"}');
//                    jo.A['c'].Add(jr);
//                  end;
//              end;
//          end;
//        result.A['rows'].Add(jo);
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

    procedure makeJson();
    var
      s_str : string;
    begin
      oJsonFile := SA([]);
      oJsonFile[''] := serveRequestVolume;
      oJsonFile[''] := serveRequestPrice;
      oJsonFile[''] := serveRequestIndices;
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
//    oJsonFile := SO;
//    oJsonFile := buildPNLRetailerVariant(2,1,2);
//    writeln( oJsonFile.AsJSon(True,False));
         makeJson;
//         webSrv(oJsonFile);



//    WriteLn('</BODY></HTML>');
  finally
    sListData.Free;
  end;
end.

