unit ET1_CommonDeclarations;

interface {-------------------------------------------------------------------------------------------------------------------}

uses
  SysUtils, Math,
  HCD_SystemDefinitions;

{$I 'ET1_Common_Constants.INC'}
{$I 'ET1_Runtime_Codes.INC'}
{$I 'ET1_Common_Types.INC'}
{$I 'ET1_Exogenous_Type.INC'}
{$I 'ET1_Parameters_Type.INC'}
{$I 'ET1_Universe_Declarations.INC'}
{$I 'ET1_Global_Variables.INC'}
{$I 'ET1_Files_Names.INC'}
{$I 'ET1_Results_Types.INC'}
{$I 'ET1_Kernel_Internal_Types.INC'}

  Procedure SetGlobalNames;
  Function BIndx( anOwner : TActors; aBrand : TProBrands ) : TBrands;
  Function VIndx( anOwner : TActors; aBrand : TProBrands; anItem : TOneBrandVariants ) : TVariants;
  Function VQuickIndx( aBrand : TBrands; anItem : TOneBrandVariants ) : TVariants;
  Function SupplierID( aBID : TBrandID ) : TFactoriesTotal;
  Function MakeStocksOlder( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;
  Function UpdateStocksSummary( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;
  Function MoveStocks( var SourceStock      : TVariantInventoriesDetails;
                       var DestinationStock : TVariantInventoriesDetails;
                           UseTransferPrice : boolean;
                           Price            : single;
                           MovedVolume      : single ) : single;
  Function ReduceStocks( StockOnEntry : TVariantInventoriesDetails; VolumeToSubstract : single ) : TVariantInventoriesDetails;
  Function Acc2Div( anAccount : TAccountsTotal ) : TProducerDivisions;


implementation {--------------------------------------------------------------------------------------------------------------}

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

  Function BIndx( anOwner : TActors; aBrand : TProBrands ) : TBrands;
  begin
    if ( anOwner <= ProsMaxPlus ) then
    begin
      Result := ( anOwner - 1 ) * ProBrandsMax + aBrand;
    end
    else
    begin
      Result := ProsMaxPlus * ProBrandsMax + ( anOwner - ProsMaxPlus - 1 ) * PLsMax + aBrand;
    end;

  end; { BIndx ===============================================================================================================}

  Function VIndx( anOwner : TActors; aBrand : TProBrands; anItem : TOneBrandVariants ) : TVariants;
  begin
    if ( anOwner <= ProsMaxPlus ) then
    begin
      Result := (( anOwner - 1 ) * ProBrandsMax + ( aBrand - 1 )) * VarsMax + anItem;
    end
    else
    begin
      Result := ( ProsMaxPlus * ProBrandsMax + ( anOwner - ProsMaxPlus - 1 ) * PLsMax + ( aBrand - 1 )) * VarsMax + anItem;
    end;

  end; { VIndx ===============================================================================================================}

  Function VQuickIndx( aBrand : TBrands; anItem : TOneBrandVariants ) : TVariants;
  begin
    Result := ( aBrand - 1 ) * VarsMax + anItem;

  end; { VQuickIndx ==========================================================================================================}

  Function SupplierID( aBID : TBrandID ) : TFactoriesTotal;
  var
    Temp : byte;

  begin
    Temp := aBid div IDM;
    if ( Temp > ProsMaxPlus ) then Temp := FactoriesMax;
    Result := Temp;

  end; { SupplierID =========================================================================================================}

  Function MakeStocksOlder( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;
  var
    TempResult : TVariantInventoriesDetails;
    Age        : TInventoryAgesTotal;
    a, b, c    : single;
    i          : TSpecs;

  begin
    TempResult := StockOnEntry;

    a := TempResult[InventoryAgesMax].invd_Volume;
    if ( a > 0.0 ) then
    begin
      { the oldest stock still exists, it will be averaged out with the younger one }
      { and the outcome put temporary in field corresponding to younger one         }
      b := TempResult[InventoryAgesMax-1].invd_Volume;
      for i := 1 to SpecsMax do
      begin
        c := a * TempResult[InventoryAgesMax].invd_Composition[i] + b * TempResult[InventoryAgesMax-1].invd_Composition[i];
        c := SimpleRoundTo( c / ( a + b ), 0 );
        TempResult[InventoryAgesMax-1].invd_Composition[i] := Trunc( c );
      end;
      c := a * TempResult[InventoryAgesMax].invd_UnitCost + b * TempResult[InventoryAgesMax-1].invd_UnitCost;
      TempResult[InventoryAgesMax-1].invd_UnitCost := c / ( a + b );
      TempResult[InventoryAgesMax-1].invd_Volume := a + b;
      with TempResult[InventoryAgesMax] do
      begin
        invd_Volume := 0.0;
        invd_UnitCost := 0.0;
        invd_Composition := EmptyComposition;
      end;
    end;
    for Age := InventoryAgesMax downto 1 do TempResult[Age] := TempResult[Age-1];
    with TempResult[0] do
    begin
      invd_Volume := 0.0;
      invd_UnitCost := 0.0;
      invd_Composition := EmptyComposition;
    end;

    Result := TempResult;

  end; { MakeStocksOlder =====================================================================================================}

  Function UpdateStocksSummary( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;
  var
    TempResult : TVariantInventoriesDetails;
    Age        : TInventoryAgesTotal;
    a, b       : single;
    i          : TSpecs;
    Temp       : array[TSpecs] of single;

  begin
    TempResult := StockOnEntry;
    FillChar( TempResult[InventoryAgesMaxTotal], SizeOf( TVariantInventoryDetails ), 0 );
    FillChar( Temp, SizeOf( Temp ), 0 );


    a := 0.0;
    for Age := 0 to InventoryAgesMax do
    begin
      with TempResult[Age] do
      begin
        b := invd_Volume;
        a := a + b;
        TempResult[InventoryAgesMaxTotal].invd_UnitCost := TempResult[InventoryAgesMaxTotal].invd_UnitCost + b * invd_UnitCost;
        for i := 1 to SpecsMax do Temp[i] := Temp[i] + b * invd_Composition[i];
      end;
    end;

    if IsZero( a, PRECISION ) then
    begin
      with TempResult[InventoryAgesMaxTotal] do
      begin
        invd_Volume := 0.0;
        invd_UnitCost := 0.0;
        invd_Composition := EmptyComposition;
      end;
    end
    else
    begin
      with TempResult[InventoryAgesMaxTotal] do
      begin
        invd_Volume := a;
        invd_UnitCost := invd_UnitCost / a;
        for i := 1 to SpecsMax do invd_Composition[i] := Trunc( SimpleRoundTo( Temp[i] / a, 0 ));
      end;
    end;

    Result := TempResult;

  end; { UpdateStocksSummary =================================================================================================}

  Function MoveStocks( var SourceStock      : TVariantInventoriesDetails;
                       var DestinationStock : TVariantInventoriesDetails;
                           UseTransferPrice : boolean;
                           Price            : single;
                           MovedVolume      : single ) : single;
  var
    sAge, dAge                                 : SmallInt;
    sVolume, sCost, dVolume, dCost, LeftToMove,
    a, b, c, p, v                              : single;
    sFormula, dFormula                         : TVariantComposition;
    i                                          : TSpecs;
    Temp                                       : array[TSpecs] of single;

  begin

    LeftToMove := MovedVolume;
    sAge := InventoryAgesMax;

    while ( not IsZero( LeftToMove, Precision )) and ( sAge >= 0 ) do
    begin
      sVolume := SourceStock[sAge].invd_Volume;
      sFormula := SourceStock[sAge].invd_Composition;
      sCost := SourceStock[sAge].invd_UnitCost;
      if IsZero( sVolume, SimplePrecision ) then Dec( sAge ) else
      begin
        dAge := InventoryAgesMax;
        while ( not IsZero( sVolume, SimplePrecision)) and ( dAge >= 0 ) do
        begin
          dFormula := DestinationStock[dAge].invd_Composition;
          if not CompareMem( @sFormula, @dFormula, SizeOf( TVariantComposition )) and
             not CompareMem( @dFormula, @EmptyComposition, SizeOf( TVariantComposition )) then Dec( dAge ) else
          begin
            dVolume := DestinationStock[dAge].invd_Volume;
            dCost := DestinationStock[dAge].invd_UnitCost;
            v := Min( LeftToMove, sVolume );
            if UseTransferPrice then p := Price else p := sCost;
            a := v * p + dVolume * dCost;
            b := v + dVolume;
            if not IsZero( b ) then c := a / b else c := 0.0;

            with DestinationStock[dAge] do
            begin
              invd_Volume := dVolume + v;
              invd_UnitCost := c;
            end;

            with SourceStock[sAge] do
            begin
              sVolume := max( 0.0, sVolume - v );
              invd_Volume := sVolume;
              if IsZero( invd_Volume, Precision ) then
              begin
                invd_UnitCost := 0.0;
                invd_Composition := EmptyComposition;
              end;
            end;

            LeftToMove := max( 0.0, LeftToMove - v );

            if IsZero( LeftToMove, simplePrecision ) then dAge := -1; { force exit from that loop }

          end;
        end; { while dAge >= 0 }
      end; { Source volume of sAge is > 0.0 }
    end; { if there is anything to move }

    if not IsZero( LeftToMove, Precision ) then
    begin
      { there is still some stock left to move but there was mismatch in the formulas,        }
      { i.e. some source formulas could not be found as destination                           }
      { the oldest stocks batch at destination will become an average of all unmoved formulas }

      dAge := 0;
      for i := 1 to SpecsMax do Temp[i] := DestinationStock[dAge].invd_Composition[i];

      for sAge := 0 to InventoryAgesMax do
      begin
        with SourceStock[sAge] do
        begin
          sVolume := invd_Volume;
          sFormula := invd_Composition;
          sCost := invd_UnitCost;
        end;

        if not IsZero( sVolume, Precision ) then
        begin
          v := Min( LeftToMove, sVolume );

          with DestinationStock[dAge] do
          begin
            dVolume := invd_Volume;
            dCost := invd_UnitCost;
          end;

          if UseTransferPrice then p := Price else p := sCost;
          a := v * p + dVolume * dCost;
          b := v + dVolume;

          if IsZero( b ) then c := 0.0 else
          begin
            c := a / b;
            for i := 1 to SpecsMax do Temp[i] := ( dVolume * Temp[i] + v * sFormula[i] ) / b;
          end;

          with DestinationStock[dAge] do
          begin
            invd_Volume := b;
            invd_UnitCost := c;
          end;

          with SourceStock[sAge] do
          begin
            invd_Volume := max( 0.0, sVolume - v );
            if IsZero( invd_Volume, Precision ) then
            begin
              invd_UnitCost := 0.0;
              invd_Composition := EmptyComposition;
            end;
          end;

          LeftToMove := max( 0.0, LeftToMove - v );
        end;
      end; { sAge }

      for i := 1 to SpecsMax do DestinationStock[dAge].invd_Composition[i] := Trunc( Temp[i] );

    end;

    Result := LeftToMove;

  end; { MoveStocks =========================================================================================================}

  Function ReduceStocks( StockOnEntry : TVariantInventoriesDetails; VolumeToSubstract : single ) : TVariantInventoriesDetails;
  var
    TempResult      : TVariantInventoriesDetails;
    Age             : ShortInt;
    a, Reduction    : single;

  begin
    TempResult := StockOnEntry;
    Reduction  := VolumeToSubstract;
    FillChar( TempResult[InventoryAgesMaxTotal], SizeOf( TVariantInventoryDetails ), 0 );

    Age := InventoryAgesMax;
    while (( Reduction > 0.0 ) and ( Age >= 0 )) do
    begin
      with TempResult[Age] do
      begin
        if IsZero( invd_Volume, Precision ) then Dec( Age ) else
        begin
          a := min( Reduction, invd_Volume );
          Reduction := max( 0.0, Reduction - a );
          invd_Volume := max( 0.0, invd_Volume - a );
          if IsZero( invd_Volume, Precision ) then
          begin
            invd_UnitCost := 0.0;
            invd_Composition := EmptyComposition;
          end;
        end;
      end;
    end;

    TempResult := UpdateStocksSummary( TempResult );

    Result := TempResult;

  end; { ReduceStocks =======================================================================================================}

  Function Acc2Div( anAccount : TAccountsTotal ) : TProducerDivisions;
  begin
    case anAccount of
      1..BMRetsMax : Result := TRADITIONAL;
      AccountsMax  : Result := INTERNET;
              else   Result := CORPORATE;
    end; { case }

  end; { Account2Division ===================================================================================================}

end.
