var passport =  require('passport'),
    util = require('util');

module.exports = {
    login: function(req, res, next) {
        passport.authenticate('local', {failureFlash:true}, function(err, user) {
//            console.log('flash:' + req.flash('message'));
            if(err)     { return next(err); }
            if(!user)   { return res.send(400, 'Seminar has not been opened or incorrect password.'); }
            req.logIn(user, function(err) {
//                console.log('user:' + util.inspect(user, {depth:null}));
                if(err) {
                    console.log('err:' +err);
                    return next(err);
                }
                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, user);

            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};