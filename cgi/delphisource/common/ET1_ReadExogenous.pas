unit ET1_ReadExogenous;

interface

uses
  SysUtils,
  ET1_CommonDeclarations;

Function ReadExogenousFile( ProgramsLocation : string;
                            Geographies      : TMarketsSet;
                            Products         : TCategoriesSet;
                            Geographies_IDs  : TMarketsBytes;
                            Products_IDs     : TCategoriesBytes;
                            PeriodNumber     : TPeriodNumber ) : LongWord;

var
  X2Ago, XPrev, XNow, XNext, XAfterNext  : TExogenous;
  IOStatus                               : integer;

Implementation {==============================================================================================================}


Function ReadExogenousFile( ProgramsLocation : string;
                            Geographies      : TMarketsSet;
                            Products         : TCategoriesSet;
                            Geographies_IDs  : TMarketsBytes;
                            Products_IDs     : TCategoriesBytes;
                            PeriodNumber     : TPeriodNumber ) : LongWord;
var
  ExoFileName    : string;
  ExoFile        : TOneQuarterExogenousFile;
  Cat            : TCategories;
  Geog           : TMarkets;

  PMinus2, PMinus1, PPlus1, PPlus2 : TPeriodNumber;

begin
  Fillchar( X2Ago, SizeOf(TExogenous), 0);
  Fillchar( XPrev, SizeOf(TExogenous), 0);
  Fillchar( XNow, SizeOf(TExogenous), 0);
  Fillchar( XNext, SizeOf(TExogenous), 0);
  Fillchar( XAfterNext, SizeOf(TExogenous), 0);

  if ( PeriodNumber > HistoryStart ) then PMinus1 := PeriodNumber - 1 else PMinus1 := PeriodNumber;
  if ( PMinus1 > HistoryStart ) then PMinus2 := PMinus1 - 1 else PMinus2 := PMinus1;

  if ( PeriodNumber < FutureEnd ) then PPlus1 := PeriodNumber + 1 else PPlus1 := PeriodNumber;
  if ( PPlus1 < FutureEnd ) then PPlus2 := PPlus1 + 1 else PPlus2 := PPlus1;

  for Geog in Geographies do
  begin
    for Cat in Products do
    begin
      ExoFileName := ProgramsLocation + ExogenousFilesNames[Geographies_IDs[Geog], Products_IDs[Cat]];
      try
        AssignFile( ExoFile, ExoFileName );
        Reset( ExoFile );

        Seek( ExoFile, PMinus2 - HistoryStart );
        Read( ExoFile, X2Ago[Geog, Cat]);

        Seek( ExoFile, PMinus1 - HistoryStart );
        Read( ExoFile, XPrev[Geog, Cat]);

        Seek( ExoFile, PeriodNumber - HistoryStart );
        Read( ExoFile, XNow[Geog, Cat] );

        Seek( ExoFile, PPlus1 - HistoryStart );
        Read( ExoFile, XNext[Geog, Cat]);

        Seek( ExoFile, PPlus2 - HistoryStart );
        Read( ExoFile, XAfterNext[Geog, Cat]);

        CloseFile( ExoFile );
        IOStatus := err_ExogenousFileRead_OK;
      except on EInOutError: Exception do IOStatus := err_ExogenousFileReadFailed;
      end;
      if ( IOStatus <> err_ExogenousFileRead_OK ) then Break;
    end;
    if ( IOStatus <> err_ExogenousFileRead_OK ) then Break;
  end;
  Result := IOStatus;

end;

End.
