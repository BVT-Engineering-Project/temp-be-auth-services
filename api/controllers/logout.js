const tokenServices = require('../services/token');
const userServices = require("../services/users");

const logout = async (token, req, res, next) => {
  await userServices.updateLastLogout(token.id);
  tokenServices.changeStatus(token.id)
    .then((data) => {
      // console.log(data, "data");
      if (data > 0) {
        res.status(200).json({
          status_code: 200,
          message: "Logout Successfully!",
          request: {
            type: "POST",
            url: "/users/logout",
          },
        });
      } else {
        return res.status(401).json({
          status_code: 401,
          message: "Invalid Token!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
    logout
}