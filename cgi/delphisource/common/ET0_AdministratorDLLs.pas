unit ET0_AdministratorDLLs;

Interface

uses
  SysUtils, Math,
  HCD_SystemDefinitions;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Common_Types.INC'}

Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord;
Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;
Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;  

Implementation

Function RunOnePeriod( ConfigInfo : TConfigurationRecord; PeriodNow : TPeriodNumber ) : LongWord; external 'ET0_Kernel.DLL';
Function InitialiseFiles( ConfigInfo : TConfigurationRecord ) : LongWord;                         external 'ET0_Initialisation.DLL';
Function MakePassivePlayersDecisions( ConfigInfo     : TConfigurationRecord;
                                      PeriodNow      : TPeriodNumber;
                                      IgnoreExisting : boolean ) : LongWord;                      external 'ET0_PassiveDecisions.DLL';

End.
