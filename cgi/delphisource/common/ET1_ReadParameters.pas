unit ET1_ReadParameters;

interface

uses
  SysUtils,
  ET1_CommonDeclarations;

Function ReadParametersFile( ProgramsLocation : string;
                             Geographies      : TMarketsSet;
                             Products         : TCategoriesSet;
                             Geographies_IDs  : TMarketsBytes;
                             Products_IDs     : TCategoriesBytes ) : LongWord;

var
  Parameters  : TParameters;
  IOStatus    : integer;

Implementation {==============================================================================================================}


Function ReadParametersFile( ProgramsLocation : string;
                             Geographies      : TMarketsSet;
                             Products         : TCategoriesSet;
                             Geographies_IDs  : TMarketsBytes;
                             Products_IDs     : TCategoriesBytes ) : LongWord;
var
  ParamsFileName    : string;
  ParamsFile        : TOneQuarterParametersFile;
  Cat               : TCategories;
  Geog              : TMarkets;

begin
  Fillchar( Parameters, SizeOf(TParameters), 0);

  for Geog in Geographies do
  begin
    for Cat in Products do
    begin
      ParamsFileName := ProgramsLocation + ParametersFilesNames[Geographies_IDs[Geog], Products_IDs[Cat]];
      try
        AssignFile( ParamsFile, ParamsFileName );
        Reset( ParamsFile );
        Seek( ParamsFile, 0 );
        Read( ParamsFile, Parameters[Geog, Cat] );
        CloseFile( ParamsFile );
        IOStatus := err_ParametersFileRead_OK;
      except on EInOutError: Exception do IOStatus := err_ParametersFileReadFailed;
      end;
      if ( IOStatus <> err_ParametersFileRead_OK ) then Break;
    end;
    if ( IOStatus <> err_ParametersFileRead_OK ) then Break;
  end;
  Result := IOStatus;

end;

End.
