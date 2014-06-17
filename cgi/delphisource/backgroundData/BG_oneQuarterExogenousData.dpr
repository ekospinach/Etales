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
      oJsonFile[''] := oneQuarterExogenousDataSchema(1, 1);
//      for marketID := Low(TMarkets) to High(TMarkets) do
//      begin
//        for catID := Low(TCategories) to High(TCategories) do
//        begin
//           oJsonFile[''] := oneQuarterExogenousDataSchema(marketID, catID);
//        end;
//      end;

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
        ReturnStatus := ReadExogenousFile( 'C:\EtalesData\EJT1\', MarketsNow, CategoriesNow, Markets_IDs, Categories_IDs, currentPeriod );
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

