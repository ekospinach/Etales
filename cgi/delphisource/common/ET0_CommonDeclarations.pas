unit ET0_CommonDeclarations;

interface {-------------------------------------------------------------------------------------------------------------------}

uses
  SysUtils, Math,
  HCD_SystemDefinitions;

{$I 'ET0_Common_Constants.INC'}
{$I 'ET0_Runtime_Codes.INC'}
{$I 'ET0_Common_Types.INC'}
{$I 'ET0_Universe_Declarations.INC'}
{$I 'ET0_Global_Variables.INC'}
{$I 'ET0_Files_Names.INC'}
{$I 'ET0_Results_Types.INC'}
{$I 'ET0_Kernel_Internal_Types.INC'}

{$I 'ET0_DBTable_Structure.INC'}

  Procedure SetGlobalNames;
  Function BIndx( anOwner : TActors; aBrand : TProBrands ) : TBrands;
  Function VIndx( anOwner : TActors; aBrand : TProBrands; anItem : TOneBrandVars ) : TVariants;
  Function VQuickIndx( aBrand : TBrands; anItem : TOneBrandVars ) : TVariants;
  Function SupplierID( aBID : TBrandID ) : TAllProducers;
  Function MakeStocksOlder( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;
  Function UpdateStocksSummary( StockOnEntry : TVariantInventoriesDetails ) : TVariantInventoriesDetails;

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

  Function VIndx( anOwner : TActors; aBrand : TProBrands; anItem : TOneBrandVars ) : TVariants;
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

  Function VQuickIndx( aBrand : TBrands; anItem : TOneBrandVars ) : TVariants;
  begin
    Result := ( aBrand - 1 ) * VarsMax + anItem;

  end; { VQuickIndx ==========================================================================================================}

  Function SupplierID( aBID : TBrandID ) : TAllProducers;
  var
    Temp : byte;

  begin
    Temp := aBid div IDM;
    if ( Temp > ProsMax ) then Temp := ProsMaxPlus;
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


end.
