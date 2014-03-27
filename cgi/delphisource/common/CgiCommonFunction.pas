unit CgiCommonFunction;

interface {-------------------------------------------------------------------------------------------------------------------}

uses
  SysUtils,
  Windows,
  Classes,
  iniFiles,
  HCD_SystemDefinitions;

{$I 'ET1_Common_Constants.INC'}
{$I 'ET1_Common_Types.INC'}
{$I 'ET1_Results_Types.INC'}
{$I 'ET1_FILES_NAMES.INC'}

const
  dummyNo = 0;
  dummySeminar = 'MAY';
  aCategories : array[TCategories] of string = ('Elecsories', 'HealthBeauties');
  aMarkets : array[TMarketsTotal] of string = ('Urban', 'Rural', 'Total');

function getSeminar(sListData : TStrings): string;
function getPeriod(sListData : TStrings): Integer;
function getProducerID(sListData : TStrings): Integer;
function getRetailerID(sListData : TStrings) : Integer;


function getVariable(name : string):string;
procedure Explode(sQuery: string; var Params:TStrings);  
function ReadResults(PeriodNumber : TPeriodNumber; SeminarCode : ansistring; DataDirectory : Ansistring; var OnePeriodResults : TAllResults ) : Integer;
procedure LoadConfigIni(var DataDirectory : string; seminar : string);
  
implementation {-------------------------------------------------------------------------------------------------------------------}

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


end.
