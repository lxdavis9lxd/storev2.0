const {getRows} = require('../database/query');

exports.authLogin = async (username,password) => {
    if(username=="root" && password == "bdpA!2o22"){
return [{user:username}];
}
}

