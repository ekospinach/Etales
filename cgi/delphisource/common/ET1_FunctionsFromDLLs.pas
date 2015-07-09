unit ET1_FunctionsFromDLLs;

interface {-------------------------------------------------------------------------------------------------------------------}

uses
  SysUtils, Math,
  HCD_SystemDefinitions,
  ET1_CommonDeclarations;

function UnitaryCost( ConfigInfo     : TConfigurationRecord;
                      PeriodNow      : TPeriodNumber;
                      CatNow         : TCategories;
                      IsPrivateLabel : boolean;
                      PackFormat     : TVariantPackFormat;
                      Composition    : TVariantComposition;
                      CumVolumes     : TCumulatedVolumesDetails ) : single;


implementation {-------------------------------------------------------------------------------------------------------------}

function UnitaryCost( ConfigInfo     : TConfigurationRecord;
                      PeriodNow      : TPeriodNumber;
                      CatNow         : TCategories;
                      IsPrivateLabel : boolean;
                      PackFormat     : TVariantPackFormat;
                      Composition    : TVariantComposition;
                      CumVolumes     : TCumulatedVolumesDetails ) : single;  external 'ET1_CommonFunctions.DLL';

end.
