unit CgiCommonFunction;

interface {-------------------------------------------------------------------------------------------------------------------}

function getVariable(name : string):string;
procedure Explode(sQuery: string; var Params:TStrings);
function getSeminar(): string;
function getPeriod(): Integer;
function ReadResults(PeriodNumber : TPeriodNumber; SeminarCode : ansistring; DataDirectory : Ansistring; var OnePeriodResults : TAllResults ) : Integer;


implementation {-------------------------------------------------------------------------------------------------------------------}

Function getVariable(name:string):string;
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

  function getSeminar(): string; 
  begin
    Result := dummySeminar;
    if sListData.IndexOfName('seminar') <> -1 then
      Result  := sListData.Values['seminar'];
  end;

  function getPeriod(): Integer;
  begin
    Result := dummyNo;
    if sListData.IndexOfName('period') <> -1 then
       Result := StrToInt(sListData.Values['period']);
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
        Writeln('result file does not exist:' + FileName);
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



end.
