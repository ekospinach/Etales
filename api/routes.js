// var _ =           require('underscore')
//     , path =      require('path')
//     , passport =  require('passport')
//     , Seminar =      require('./models/User.js')
//     , userRoles = require('../app/js/routingConfig').userRoles
//     , accessLevels = require('../app/js/routingConfig').accessLevels;

// var routes = [
//     // Local Auth
//     {
//         path: '/login',
//         httpMethod: 'POST',
//         middleware: [require('./models/seminar').login],
//         accessLevel: accessLevels.public
//     },
//     {
//         path: '/logout',
//         httpMethod: 'POST',
//         middleware: [require('./models/seminar').logout],
//         accessLevel: accessLevels.public
//     },
//     // All other get requests should be handled by AngularJS's client-side routing system
//     {
//         path: '/*',
//         httpMethod: 'GET',
//         middleware: [function(req, res) {          
//             var role = userRoles.guest, username = '';
//             if(req.user) {
//                 role = req.user.role;
//                 username = req.user.username;
//             }
//             res.cookie('user', JSON.stringify({
//                 'username': username,
//                 'role': role
//             }));
//          //   res.render('index.');
//         }],
//         accessLevel: accessLevels.public
//     }
//     // User resource
//     {
//         path: '/initialiseSeminar',
//         httpMethod: 'POST',
//         middleware: [UserCtrl.index],
//         accessLevel: accessLevels.admin
//     },
// ];

// module.exports = function(app) {
//     _.each(routes, function(route) {
//         var args = _.flatten([route.path, route.middleware]);
//         switch(route.httpMethod.toUpperCase()) {
//             case 'GET':
//                 app.get.apply(app, args);
//                 break;
//             case 'POST':
//                 app.post.apply(app, args);
//                 break;
//             case 'PUT':
//                 app.put.apply(app, args);
//                 break;
//             case 'DELETE':
//                 app.delete.apply(app, args);
//                 break;
//             default:
//                 throw new Error('Invalid HTTP method specified for route ' + route.path);
//                 break;
//         }
//     });
// }

// function ensureAuthenticated(req, res, next) {
//     if(req.isAuthenticated()) return next();
//     else                      return res.send(401);
// }

// function ensureAuthorized(req, res, next) {
//     if(!req.user) return res.send(401);

//     var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
//     if(!(accessLevel & req.user.role)) return res.send(403);

//     return next();
// }