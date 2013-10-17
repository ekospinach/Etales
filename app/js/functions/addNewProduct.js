define([], function() {
	var addNewProduct=function(tmpScope){
		tmpScope.parameter = 'from add new product module';
		console.log(tmpScope.parameter);
		}

	return {
		addNewProduct : addNewProduct
	};

});