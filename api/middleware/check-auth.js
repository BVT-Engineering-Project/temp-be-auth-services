const jwt = require('jsonwebtoken');
const tokenServices = require('../services/token');
const {checkAccess} = require("../helper/checkAccess")

const checkAuth = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      // console.log("🚀 ~ file: check-auth.js ~ line 7 ~ checkAuth ~ token", token)
      const checkToken = await tokenServices.checkToken(token);
      if (checkToken.length > 0) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next(decoded);
      } else {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
};

const authorization = async (decoded, req, res, next)=>{
// console.log("🚀 ~ file: check-auth.js ~ line 26 ~ authorization ~ decoded", decoded)
try{
  const verifyRole = decoded.role.permissions
  // console.log("🚀 ~ file: check-auth.js ~ line 29 ~ authorization ~ verifyRole", verifyRole.superAdmin.superAdmin)
  if(verifyRole.superAdmin && verifyRole.superAdmin.superAdmin === 'true'){
    const access = await checkAccess(verifyRole);
    // console.log("🚀 ~ file: check-auth.js ~ line 33 ~ authorization ~ access", access)
    next(access)
  }else{
    return res.status(403).json({
      message : 'Unauthorized access!!!'
    })
  }
}catch(error){
  // console.log(error)
  return res.status(401).json({
    message: 'Auth failed'
  });

}
}

module.exports = {
  checkAuth,
  authorization
}
