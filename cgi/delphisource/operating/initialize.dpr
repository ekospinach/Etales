program initialize;
{$APPTYPE CONSOLE}

{$R *.res}


//Developed by Andrea Russo - Italy
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
  Classes,HCD_SystemDefinitions,CgiCommonFunction,iniFiles;


var
   i: integer;
   sDati : string;
   sListData: tStrings;
   sResponseData : tStrings;
   sLogList : TStrings;
   bUpload: boolean;
   sValue : string;
   iSize : integer;
   DataDirectory : string;

   currentConf : TConfigurationRecord;
   vTempStr : string;

   aString : String;

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

   function initializeFileandResult(conf :TConfigurationRecord) : string;
   var
      ReturnCode   : LongWord;
      PeriodNumber : TPeriodNumber;
   begin
      ReturnCode := InitialiseFiles( conf );
      sResponseData.Add( 'Initialisation Exit Code:  ' + IntToStr( ReturnCode ));

      if ( ReturnCode = init_InitialisationRun_OK ) then
      begin
        PeriodNumber := HistoryStart;
        ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE );    //periodNumber = -3

        if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
        begin
          ReturnCode := RunOnePeriod( conf, PeriodNumber );
          if ( ReturnCode = kernel_SimulationRun_OK ) then
          begin
            ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE );    //periodNumber = -3
            if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
            begin
              ReturnCode := RunOnePeriod( conf, PeriodNumber );
              if ( ReturnCode = kernel_SimulationRun_OK ) then
              begin
                ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE );  //periodNumber = -3
                if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
                begin
                  ReturnCode := RunOnePeriod( conf, PeriodNumber );


                  if ( ReturnCode = kernel_SimulationRun_OK ) then
                  begin
                    Inc( PeriodNumber );
                    ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE );    //periodNumber = -2
                    if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
                    begin
                      ReturnCode := RunOnePeriod( conf, PeriodNumber );
                      if ( ReturnCode = kernel_SimulationRun_OK ) then
                      begin
                        Inc( PeriodNumber );
                        ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE );   //periodNumber = -1
                        if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
                        begin
                          ReturnCode := RunOnePeriod( conf, PeriodNumber );
                          if ( ReturnCode = kernel_SimulationRun_OK ) then
                          begin
                            Inc( PeriodNumber );
                            ReturnCode := MakePassivePlayersDecisions( conf, PeriodNumber, TRUE ); //periodNumber = 0
                            if ( ReturnCode = passive_PassivePlayersDecisionsRun_OK ) then
                            begin
                              ReturnCode := RunOnePeriod( conf, PeriodNumber );
                            end;
                          end;
                        end;
                      end;
                    end;
                  end;



                end;




              end;
            end;
          end;
        end;

        //sResponseData.Add('Simulation Period ' + IntToStr( PeriodNumber ) + '  Exit Code:  ' + IntToStr( ReturnCode ));
      end;
      sResponseData.Add('Simulation Period ' + IntToStr( PeriodNumber ) + '  Exit Code:  ' + IntToStr( ReturnCode ));

      if (ReturnCode = kernel_SimulationRun_OK) then
      begin
        Result := 'Status: 200 OK';
      end
      else
      begin
        Result := 'Status: 404 Not Found';
      end;      
   end;

   function getDataDirectoryForSeminar(seminar : string) : string;
   begin
     if ForceDirectories(DataDirectory + seminar + '\') then
     begin
         Result := DataDirectory + seminar + '\';
     end
     else
     begin
         Result := DataDirectory;
     end;
   end;

   procedure Log(content: String);
   begin
      sLoglist.Add(FormatDateTime('[yyyy-MM-dd hh:mm:ss] ',Now) + content);
   end;

   procedure getCurrentConf();
   var
    vTempStr : string;
    vSeminar : string;
    I : Integer;
   begin
    with currentConf do
    begin
      //Log('getCurrentConf2...' + sListData.Values['seminar']);
      vSeminar  := 'NEW';
      cr_SimulationSpan  := 6;
      cr_TraceActive  := StrToBool(sListData.Values['isTraceActive']);
      if sListData.IndexOfName('isTraditionalTradeActive') <> -1 then cr_TraditionalTradeActive  := StrToBool(sListData.Values['isTraditionalTradeActive']);
      if sListData.IndexOfName('isEMallActive') <> -1 then cr_E_MallActive  := StrToBool(sListData.Values['isEMallActive']);
      if sListData.IndexOfName('isVirtualSupplierActive') <> -1 then cr_VirtualSupplierActive  := StrToBool(sListData.Values['isVirtualSupplierActive']);
      if sListData.IndexOfName('isIndependentMarkets') <> -1 then cr_IndependentMarkets  := StrToBool(sListData.Values['isIndependentMarkets']);
      if sListData.IndexOfName('isForceNextDecisionsOverwrite') <> -1 then cr_ForceNextDecisionsOverwrite  := StrToBool(sListData.Values['isForceNextDecisionsOverwrite']);

      if sListData.IndexOfName('market1ID') <> -1 then cr_Market_1_ID  := StrToInt(sListData.Values['market1ID']);
      if sListData.IndexOfName('market2ID') <> -1 then cr_Market_2_ID  := StrToInt(sListData.Values['market2ID']);
      if sListData.IndexOfName('category1ID') <> -1 then cr_Category_1_ID  := StrToInt(sListData.Values['category1ID']);
      if sListData.IndexOfName('category2ID') <> -1 then cr_Category_2_ID  := StrToInt(sListData.Values['category2ID']);
//        // WinningCriteriaWeights : ?

      vTempStr                       := getDataDirectoryForSeminar(vSeminar);
      Log('data folder: ' + vTempStr);
      StrLCopy(cr_AdministratorFilesLocation, pchar(vTempStr), high(cr_AdministratorFilesLocation));
      vTempStr                        := ParamStr(0);
      vTempStr                        := ExtractFilePath( vTempStr );
      StrPLCopy( cr_ProgramsFilesLocation, IncludeTrailingPathDelimiter( vTempStr ), PathLengthMax - 1 );
      for I := 0 to Length(vSeminar)-1 do
      begin
        cr_SeminarCode[i] := vSeminar[i+1];
      end;
      Log('assign currentConf complete.');
    end;
   end;

  procedure LoadConfigIni();
  var
  ini : Tinifile;
  begin
    ini := TIniFile.Create(ExtractFilePath(ParamStr(0)) + 'CgiConfig.ini');
    with ini do
    begin
      DataDirectory := ini.ReadString('Options','DataDirectory','C:\E-project\ecgi\');
      ini.Free;
    end;
  end;



begin
    sDati := '';
    sListData := TStringList.Create;
    sResponseData := TStringList.Create;
    sLogList := TStringList.Create;
    sResponseData.Clear;
    sListData.Clear;
    sLogList.Clear;
    LoadConfigIni();

  //uncomment lines below if it is necessary to save all the log history
  //    if FileExists(GetCurrentDir + '/Log.txt') then
  //    sLoglist.LoadFromFile(GetCurrentDir + '/Log.txt');

  try
    WriteLn('Content-type: text/html');
    Log('Analysis request method...');

    //for debug
//    with currentConf do
//    begin
//      //Log('getCurrentConf2...' + sListData.Values['seminar']);
//      cr_TraceActive                 := TRUE;
//      cr_AdministratorFilesLocation  := 'C:\\EtalesData\\NEW';
//      aString                        := ParamStr(0);
//      aString                        := ExtractFilePath( aString );
//      StrPLCopy( cr_ProgramsFilesLocation, IncludeTrailingPathDelimiter( aString ), PathLengthMax - 1 );
//      aString := 'MAY';
//      StrPLCopy( cr_SeminarCode, aString, SeminarCodeLength - 1 );
//      cr_Market_1_ID                 := 1;
//      cr_Market_2_ID                 := 2;
//      cr_Category_1_ID               := 1;
//      cr_Category_2_ID               := 2;
//      cr_TraditionalTradeActive      := FALSE;
//      cr_E_MallActive                := FALSE;
//      cr_VirtualSupplierActive       := FALSE;
//      cr_ForceNextDecisionsOverwrite := TRUE;
//      Log('assign currentConf complete.');
//    end;
//    Writeln(initializeFileandResult(currentConf));


    sValue := getVariable('REQUEST_METHOD');
    if sValue='GET' then
    begin
      // GET
      sValue := getVariable('QUERY_STRING');
      Explode(sValue, sListData);

      for i:= 0 to sListData.Count-1 do
      Log('ListData[' + IntToStr(i) + ']: ' + sListData[i]);

      getCurrentConf();

      Writeln(initializeFileandResult(currentConf));
    end;
    Writeln;
    for i:= 0 to sResponseData.Count-1 do
      WriteLn(sResponseData[i]);
  finally
    sLogList.saveToFile(GetCurrentDir + '/Log.txt');
    sListData.Free;
    sResponseData.Free;
    sLogList.Free;

  end;
end.

