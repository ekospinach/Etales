(function(exports){

    var config = {

        /* List all the roles you wish to use in the app
        * You have a max of 31 before the bit shift pushes the accompanying integer out of
        * the memory footprint for an integer
        */
        roles :[
            'guest',
            'producer',
            'retailer',
            'facilitator',
            'admin'],

        /*
        Build out all the access levels you want referencing the roles listed above
        You can use the "*" symbol to represent access to all roles
         */
        accessLevels : {
            'public'           : "*",
            'producerViewOnly' : ['producer'],
            'retailerViewOnly' : ['retailer'],
            'producerView'     : ['producer','facilitator'],
            'retailerView'     : ['retailer','facilitator'],
            'facilitatorView'  : ['facilitator'],
            'adminView'        : ['admin'],
            'playerView'       : ['producer','facilitator','retailer'],
            'PandRView'        : ['producer','retailer']
        }

    }

    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

    /*
        Method to build a distinct bit mask for each role
        It starts off with "1" and shifts the bit to the left for each element in the
        roles array parameter
     */

    function buildRoles(roles){

        var bitMask = "01";
        var userRoles = {};
        for(var role in roles){
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = intCode;
            bitMask = (intCode << 1 ).toString(2)
        }

        return userRoles;
    }

    /*
    This method builds access level bit masks based on the accessLevelDeclaration parameter which must
    contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles){

        var accessLevels = {};
        for(var level in accessLevelDeclarations){

            if(typeof accessLevelDeclarations[level] == 'string'){
                if(accessLevelDeclarations[level] == '*'){

                    var resultBitMask = '';

                    for( var role in userRoles){
                        resultBitMask += "1"
                    }
                    accessLevels[level] = parseInt(resultBitMask, 2);
                    console.log('public:'+accessLevels[level]);
                }
                else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")

            }
            else {

                var resultBitCode = 0;

                for(var role in accessLevelDeclarations[level]){

                    if(userRoles.hasOwnProperty(accessLevelDeclarations[level][role])){
                        
                        resultBitCode = resultBitCode | userRoles[accessLevelDeclarations[level][role]]
                    }
                    else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
                }
                accessLevels[level] = resultBitCode;
                //producer 10
                //retailer 100
                //facilitator 1000

                // public 11111
                // PandRView 110
                // adminView 10000
                // facilitatorView 1000
                // playerView 1110
                // producerView 1010
                // producerViewOnly 10
                // public 11111
                // retailerView 1100
                // retailerViewOnly 100
            }
        }

        return accessLevels;
    }

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);