exports.logErrors = function(err, req, res, next){
	console.error(err.stack);
	next(err);
}

exports.customHandler = function(err, req, res, next){
	next(err);
}
