unit ET1_UnitCost;

interface

uses
  Messages, SysUtils, Classes, Math,
  ET1_ReadExogenous,
  ET1_ReadParameters,
  ET1_CommonDeclarations;

function UnitaryCost( ConfigInfo     : TConfigurationRecord;
                      PeriodNow      : TPeriodNumber;
                      CatNow         : TCategories;
                      IsPrivateLabel : boolean;
                      PackFormat     : TVariantPackFormat;
                      Composition    : TVariantComposition;
                      CumVolumes     : TCumulatedVolumesDetails ) : single;  export;

Implementation {==============================================================================================================}

function UnitaryCost( ConfigInfo     : TConfigurationRecord;
                      PeriodNow      : TPeriodNumber;
                      CatNow         : TCategories;
                      IsPrivateLabel : boolean;
                      PackFormat     : TVariantPackFormat;
                      Composition    : TVariantComposition;
                      CumVolumes     : TCumulatedVolumesDetails ) : single;

{                                                                                              }
{ --- CUMULATED VOLUMES  --- how to prepare them ? ------------------------------------------- }
{                                                                                              }
{ ELECSORRIES: - DESIGN: Previously cumulated plus sum of current volumes                      }
{                        produced with the same level. (across all variants)                   }
{                        Similarly, the volumes with higher level are also taken into account. }
{                                                                                              }
{              - TECHNOLOGY: same as above.                                                    }
{                                                                                              }
{              - QUALITY of INGREDIENTS: only current volume cumulated across all variants     }
{                                        with the same quality index.                          }
{                                                                                              }
{ HEALTHBEAUTIES: - ACTIVE AGENT: only current volume cumulated across all variants with the   }
{                                 same level.                                                  }
{                                                                                              }
{                   TECHNOLOGY: Previously cumulated plus sum of current volumes produced with }
{                               the same level (across all variants). Similarly, the volumes   }
{                               with higher level are also taken into account.                 }
{                                                                                              }
{                   SMOOTHENER: only current volume cumulated across all variants with the     }
{                               same level.                                                    }
{                                                                                              }

var
  TempResult                  : single;
  Temp                        : LongWord;
  aMarket                     : TMarkets;
  aCategory                   : TCategories;
  ProgramsFolder              : string;
  CurrentPeriod               : TPeriodNumber;
  Markets_IDs                 : TMarketsBytes;
  Categories_IDs              : TCategoriesBytes;
  MarketsNow                  : TMarketsSet;
  CategoriesNow               : TCategoriesSet;
  GeogNow                     : TMarketsTotal;
  SpecsIndex                  : TSpecsIndices;
  i                           : TSpecs;
  CorrectedVolumes            : array[TSpecs] of single;
  a, b                        : single;

begin
  SetGlobalNames;
  with ConfigInfo do
  begin
    ProgramsFolder    := cr_ProgramsFilesLocation;
    ProgramsFolder    := IncludeTrailingPathDelimiter( ProgramsFolder );
    Markets_IDs[1]    := cr_Market_1_ID;
    Markets_IDs[2]    := cr_Market_2_ID;
    Categories_IDs[1] := cr_Category_1_ID;
    Categories_IDs[2] := cr_Category_2_ID;
  end;

  MarketsNow := [];
  GeogNow := MrktsMaxTotal;

  { GeogNow must uniquely take a value smaller than MrktsMaxTotal                                   }
  {         as there are no files with parameters and exogenous values for a total across markets.  }
  {         This will hapen if at least one market is selected, otherwise the dummy value set above }
  {         will not be used.                                                                       }
  {         Most of relevant here parameters have the same value in all markets.                    }
  {         If a grand total (or average) across markets is needed it is explicitly calculated.     }


  for aMarket := 1 to MrktsMax do
    if ( Markets_IDs[aMarket] > 0 ) then
    begin
      MarketsNow := MarketsNow + [aMarket];
      if ( GeogNow = MrktsMaxTotal) then GeogNow := aMarket;
    end;


  CategoriesNow := [];
  for aCategory := 1 to CatsMax do
    if ( Categories_IDs[aCategory] > 0 ) then CategoriesNow := CategoriesNow + [aCategory];

  if ( MarketsNow = [] ) then TempResult := NegInfinity else
  begin
    if ( CategoriesNow = [] ) then TempResult := NegInfinity else
    begin
      CurrentPeriod := PeriodNow;

      Temp := ReadParametersFile( ProgramsFolder, MarketsNow, CategoriesNow, Markets_IDs, Categories_IDs );
      if ( Temp <> err_ParametersFileRead_OK ) then TempResult := NegInfinity else
      begin
        Temp := ReadExogenousFile( ProgramsFolder, MarketsNow, CategoriesNow, Markets_IDs, Categories_IDs, CurrentPeriod );
        if ( Temp <> err_ExogenousFileRead_OK ) then TempResult := NegInfinity else
        begin
          for i := 1 to SpecsMax do CorrectedVolumes[i] := CumVolumes[i, Composition[i]];
          try
            case Categories_IDs[CatNow] of
              ElecsoriesID     : begin
                                   for SpecsIndex := Composition[1] + 1 to MaxSpecsIndex do
                                     CorrectedVolumes[1] := CorrectedVolumes[1] + CumVolumes[1, SpecsIndex] * ( SpecsIndex - Composition[1] ) * Parameters[GeogNow, CatNow].z_ProdCost_HigherDesignImpact;
                                   for SpecsIndex := Composition[2] + 1 to MaxSpecsIndex do
                                     CorrectedVolumes[2] := CorrectedVolumes[2] + CumVolumes[2, SpecsIndex] * ( SpecsIndex - Composition[2] ) * Parameters[GeogNow, CatNow].z_ProdCost_HigherTechImpact;
                                 end;
              HealthBeautiesID : begin
                                   for SpecsIndex := Composition[2] + 1 to MaxSpecsIndex do
                                     CorrectedVolumes[2] := CorrectedVolumes[2] + CumVolumes[2, SpecsIndex] * ( SpecsIndex - Composition[2] ) * Parameters[GeogNow, CatNow].z_ProdCost_HigherTechImpact;
                                 end;
              else               begin end;
            end;

            TempResult := XNow[GeogNow, CatNow].x_ProdCost_LogisticsCost;
            TempResult := TempResult + XNow[GeogNow, CatNow].x_ProdCost_LabourCost;
            for i := 1 to SpecsMax do
            begin
              a := XNow[GeogNow, CatNow].x_ProdCost_IngredientPrices[i][Composition[i]] * Composition[i];
              b := 0.0;
              for aMarket in MarketsNow do b := b + Parameters[aMarket, CatNow].z_MinProductionVolume;
              b := Max( CorrectedVolumes[i], b ) / b;
              b := Power( b, Parameters[GeogNow, CatNow].z_ProdCost_DefaultDrop );
              TempResult := TempResult + a * b;
            end;

            TempResult := TempResult * ( 1.0 + Parameters[GeogNow, CatNow].z_ProdCost_PackFormat[PackFormat] );

            if IsPrivateLabel then
              TempResult := TempResult * ( 1.0 + Parameters[GeogNow, CatNow].z_ProdCost_MarginOnPrivateLabel );

          except on E : Exception do TempResult := NegInfinity;
          end;

        end; { Read Exogenous Values OK }
      end; { Read Parameters OK }
    end;
  end;  { Universe Defined }

  Result := TempResult;

end;

{ Unit Cost ==================================================================================================================}

End.


