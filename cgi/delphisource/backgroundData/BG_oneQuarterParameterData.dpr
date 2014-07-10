program BG_oneQuarterParameterData;

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

  function oneQuarterParameterDataSchema(marketID : Integer; catID : Integer): ISuperObject;
  var
    jo: ISuperObject;
    prd, ret, spec, input: Integer;
    marketStudiesID : integer;
    ingredientPirces : ISuperObject;
  begin
    jo  := SO;
    jo.S['seminar'] := currentSeminar;
    jo.S['marketID'] := IntToStr(marketID);
    jo.S['categoryID'] := IntToStr(catID);

    jo.D['ProdCost_HigherDesignImpact']  := Parameters[marketID, catID].ProdCost_HigherDesignImpact;
    jo.D['ProdCost_HigherTechImpact']  := Parameters[marketID, catID].ProdCost_HigherTechImpact;
    jo.D['ProdCost_DefaultDrop']  := Parameters[marketID, catID].ProdCost_DefaultDrop;
    jo.D['ProdCost_MarginOnPrivateLabel']  := Parameters[marketID, catID].ProdCost_MarginOnPrivateLabel;
    jo.D['MinProductionVolume']  := Parameters[marketID, catID].MinProductionVolume;

    jo.D['ProdCost_ECONOMY']  := Parameters[marketID, catID].ProdCost_PackFormat[ECONOMY];
    jo.D['ProdCost_STANDARD']  := Parameters[marketID, catID].ProdCost_PackFormat[STANDARD];
    jo.D['ProdCost_PREMIUM']  := Parameters[marketID, catID].ProdCost_PackFormat[PREMIUM];   

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
           oJsonFile[''] := oneQuarterParameterDataSchema(marketID, catID);
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
        ReturnStatus := ReadParametersFile( GetCurrentDir + '\', MarketsNow, CategoriesNow, Markets_IDs, Categories_IDs );
        if ( ReturnStatus = err_ParametersFileRead_OK ) then
        begin
           makeJson;
        end
        else
        begin
          Writeln('Read ReadParametersFile failed :' + IntToStr(ReturnStatus));
        end;

      end


  finally
    sListData.Free;
  end;
end.

