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

  function oneQuarterExogenousDataSchema(marketID : Integer; catID : Integer): ISuperObject;
  var
    jo: ISuperObject;
    prd, ret, spec, input: Integer;
    marketStudiesID : integer;
    ingredientPirces : ISuperObject;
  begin
    jo  := SO;
    jo.I['period']  := currentPeriod;
    jo.S['seminar'] := currentSeminar;
    jo.S['marketID'] := IntToStr(marketID);
    jo.S['categoryID'] := IntToStr(catID);

    jo.D['MinBMPriceVsCost']                := XNOW[marketID, catID].x_MinBMPriceVsCost;
    jo.D['MaxBMPriceVsCost']                := XNOW[marketID, catID].x_MaxBMPriceVsCost;
    jo.D['IngredientsQualityVsATLGap']      := XNOW[marketID, catID].x_IngredientsQualityVsATLGap;
    jo.D['ActiveAgentVsSmoothenerGap']      := XNOW[marketID, catID].x_ActiveAgentVsSmoothenerGap;
    jo.D['MaxTargetVolumeVsTotalMarket']    := XNOW[marketID, catID].x_MaxTargetVolumeVsTotalMarket;
    jo.D['MinOnlinePriceVsCost']            := XNOW[marketID, catID].x_MinOnlinePriceVsCost;
    jo.D['MaxOnlinePriceVsCost']            := XNOW[marketID, catID].x_MaxOnlinePriceVsCost;
    jo.D['MaxCapacityReduction']            := XNOW[marketID, catID].x_MaxCapacityReduction;
    jo.D['MaxCapacityIncrease']             := XNOW[marketID, catID].x_MaxCapacityIncrease;
    jo.D['Supplier4AcquiredLevelsGapForPL'] := XNOW[marketID, catID].x_Supplier4AcquiredLevelsGapForPL;
    jo.D['MinPLPriceVsCost']                := XNOW[marketID, catID].x_MinPLPriceVsCost;
    jo.D['MaxPLPriceVsCost']                := XNOW[marketID, catID].x_MaxPLPriceVsCost;
    jo.D['MinRetailPriceVsNetBMPrice']      := XNOW[marketID, catID].x_MinRetailPriceVsNetBMPrice;
    jo.D['MaxRetailPriceVsNetBMPrice']      := XNOW[marketID, catID].x_MaxRetailPriceVsNetBMPrice;    
    jo.O['MarketStudiesPrices']             := SA([]);

    for marketStudiesID := Low(TMarketStudies) to High(TMarketStudies) do
    begin
        jo.A['MarketStudiesPrices'].D[marketStudiesID-1] := XNOW[marketID, catID].x_MarketStudiesPrices[marketStudiesID];
    end;

    jo.D['ProdCost_LogisticsCost']          := XNOW[marketID, catID].x_ProdCost_LogisticsCost;
    jo.D['ProdCost_LabourCost']             := XNOW[marketID, catID].x_ProdCost_LabourCost;
    jo.O['ProdCost_IngredientPrices']       := SA([]);

    for spec := Low(TSpecs) to High(TSpecs) do
    begin
        ingredientPirces := SA([]);
        for input := Low(TIngredientsInput) to High(TIngredientsInput) do
        begin
            ingredientPirces.D[inttostr(input - 1)] := XNOW[marketID, catID].x_ProdCost_IngredientPrices[spec, input];
        end;
        jo.A['ProdCost_IngredientPrices'].Add(ingredientPirces);
    end;

    result  := jo;
  end;

    procedure makeJson();
    var
      s_str : string;
      marketID: Integer;
      catID: Integer;
    begin
      oJsonFile := SA([]);
//      oJsonFile[''] := oneQuarterExogenousDataSchema(1, 1);
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
        LoadConfigIni(DataDirectory, getSeminar(sListData));
    // initialize globals
        currentSeminar := getSeminar(sListData);
        currentPeriod := getPeriod(sListData);

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

                                           ///GetCurrentDir + '\'
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

