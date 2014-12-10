unit CgiCommonFunction;

interface {-------------------------------------------------------------------------------------------------------------------}

uses
  SysUtils,
  Windows,
  Classes,
  iniFiles,
  HCD_SystemDefinitions;



{$I 'ET1_Common_Constants.INC'}
{$I 'ET1_Runtime_Codes.INC'}
{$I 'ET1_Common_Types.INC'}
{$I 'ET1_Decisional_Types.INC'}
{$I 'ET1_Exogenous_Type.INC'}
{$I 'ET1_Parameters_Type.INC'}
{$I 'ET1_Universe_Declarations.INC'}
{$I 'ET1_Global_Variables.INC'}
{$I 'ET1_Files_Names.INC'}
{$I 'ET1_Results_Types.INC'}
{$I 'ET1_Kernel_Internal_Types.INC'}



const
  dummyNo = 0;
  dummySeminar = 'MAY';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

function getSeminar(sListData : TStrings): string;
function getPeriod(sListData : TStrings): Integer;
function getProducerID(sListData : TStrings): Integer;
function getRetailerID(sListData : TStrings) : Integer;

Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord;
Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;
Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;



function getVariable(name : string):string;
procedure Explode(sQuery: string; var Params:TStrings);  
function ReadResults(PeriodNumber : TPeriodNumber; SeminarCode : ansistring; DataDirectory : Ansistring; var OnePeriodResults : TAllResults ) : Integer;
procedure LoadConfigIni(var DataDirectory : string; seminar : string);

Function ReadExogenousFile( ProgramsLocation : string;
                            Geographies      : TMarketsSet;
                            Products         : TCategoriesSet;
                            Geographies_IDs  : TMarketsBytes;
                            Products_IDs     : TCategoriesBytes;
                            PeriodNumber     : TPeriodNumber ) : LongWord;

Function ReadParametersFile( ProgramsLocation : string;
                             Geographies      : TMarketsSet;
                             Products         : TCategoriesSet;
                             Geographies_IDs  : TMarketsBytes;
                             Products_IDs     : TCategoriesBytes ) : LongWord;

Procedure SetGlobalNames;

var
  X2Ago, XPrev, XNow, XNext, XAfterNext  : TExogenous;
  IOStatus                               : integer;
  Parameters                             : TParameters;

implementation {-------------------------------------------------------------------------------------------------------------------}

Procedure SetGlobalNames;
var
  Geography : TMarketsUniverse;
  Category  : TCategoriesUniverse;

begin
  for Geography := 1 to MarketsUniverse do
  begin
    for Category := 1 to CategoriesUniverse do
    begin
      if (( length( UniverseMarketsNames[Geography] ) > 0 ) and ( length( UniverseCategoriesNames[Category] ) > 0 )) then
      begin
        ExogenousFilesNames[Geography, Category] := UniverseMarketsNames[Geography] + UniverseCategoriesNames[Category] + EXOExtension;
        ParametersFilesNames[Geography, Category] := UniverseMarketsNames[Geography] + UniverseCategoriesNames[Category] + PARExtension;
      end;
    end;
  end;

end; { Set Global Names ====================================================================================================}


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
  //    Writeln('Geographies_IDs[Geog]: ' + IntToStr(Geographies_IDs[Geog]));
  //    Writeln('Products_IDs[Cat]: ' + IntToStr(Products_IDs[Cat]));
  //    Writeln('ExogenousFilesNames[Geographies_IDs[Geog], Products_IDs[Cat]: ' + ExogenousFilesNames[Geographies_IDs[Geog], Products_IDs[Cat]] );
      ExoFileName := ProgramsLocation + ExogenousFilesNames[Geographies_IDs[Geog], Products_IDs[Cat]];
    //  Writeln(ExoFileName);
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


function getSeminar(sListData : TStrings): string; 
begin
  Result := dummySeminar;
  if sListData.IndexOfName('seminar') <> -1 then
    Result  := sListData.Values['seminar'];
end;

function getPeriod(sListData : tStrings): Integer;
begin
  Result := dummyNo;
  if sListData.IndexOfName('period') <> -1 then
     Result := StrToInt(sListData.Values['period']);
end;

function getProducerID(sListData : TStrings): Integer;
begin
  Result := 1;
  if sListData.IndexOfName('producerID') <> -1 then
     Result := StrToInt(sListData.Values['producerID']);
end;

function getRetailerID(sListData : TStrings): Integer;
begin
  Result := 1;
  if sListData.IndexOfName('retailerID') <> -1 then
     Result := StrToInt(sListData.Values['retailerID']);
end;


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

procedure Explode(sQuery: string; var Params: tStrings);
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


Function ReadResults(PeriodNumber : TPeriodNumber; SeminarCode : ansistring; DataDirectory : Ansistring; var OnePeriodResults : TAllResults ) : Integer;
var
  ResultsFile : file of TAllResults;
  FileName    :  String;
  TempResult  : Integer;
begin
  FileName := DataDirectory +  ResultsFileName + SeminarCode;
  if FileExists(FileName) = false then
  begin
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
        TempResult := 0;
      except
        on E: EInOutError do
        begin
          Writeln( 'Error: ' + IntToStr( E.ErrorCode ) + #13 + #10 + FileName + #13 + #10 + E.Message );
          TempResult := E.ErrorCode;
        end;
      end;  { try }
  finally
      CloseFile( ResultsFile);
  end;
  Result := TempResult;
end;

procedure LoadConfigIni(var DataDirectory: string; seminar : string);
var
  ini : Tinifile;
begin
  ini := TIniFile.Create(ExtractFilePath(ParamStr(0)) + 'CgiConfig.ini');
  with ini do
  begin
    DataDirectory := ini.ReadString('Options','DataDirectory','C:\E-project\ecgi\');
    DataDirectory := DataDirectory + seminar + '\';
    ini.Free;
  end;
end;

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


Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord; external 'ET1_Kernel.DLL';

Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;                         external 'ET1_Initialisation.DLL';

Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;                      external 'ET1_PassiveDecisions.DLL';


end.
