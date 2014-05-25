{================     E-Tales  Simulation  Global  Variables     =============================================================}
const
  EmptyComposition : TVariantComposition = ( 1, 1, 1 );

Var

{=======  Exogenous  &  Parameters   Files  Names  ===========================================================================}

  ExogenousFilesNames  : array[TMarketsUniverse, TCategoriesUniverse] of String;

  ParametersFilesNames : array[TMarketsUniverse, TCategoriesUniverse] of String;

  CurrentCategoryNames : array[1..2] of AnsiString;

