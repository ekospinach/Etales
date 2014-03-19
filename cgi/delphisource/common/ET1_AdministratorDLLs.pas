unit ET1_AdministratorDLLs;

Interface

uses
  ET1_CommonDeclarations;

Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord;

Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;

Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;  

Implementation

Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord; external 'ET1_Kernel.DLL';

Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;                         external 'ET1_Initialisation.DLL';

Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;                      external 'ET1_PassiveDecisions.DLL';

End.
