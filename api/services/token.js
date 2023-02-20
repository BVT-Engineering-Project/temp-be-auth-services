const { Op } = require("sequelize");
const { Token } = require("../../sequelize");
const getCurrentDate = require("../helper/currentDate");

const createUpdate = (id, dataInsert) => {
  return Token.findAll({
    where: {
      [Op.and]: [{ status_is_valid: true }, { id_users: id }],
    },
  })
    .then((isExist) => {
      if (isExist.length > 0) {
        Token.update(
          { status_is_valid: false },
          {
            where: {
              [Op.and]: [{ status_is_valid: true }, { id_users: id }],
            },
          }
        );
        return "success invalidate";
      } else {
        return Token.create(dataInsert);
      }
    })
    .then((nextStep) => {
      if (nextStep === "success invalidate") {
        return Token.create(dataInsert);
      }
    });
};

const changeStatus = async (id) => {
  let tokenUser;
  const findToken = await Token.findAll({
    where: {
      [Op.and]: [{ status_is_valid: true }, { id_users: id }],
    },
  });
  // console.log(findToken, "findToken");
  if (findToken.length > 0) {
    tokenUser = findToken[0].token;
    // console.log("🚀 ~ file: token.js ~ line 50 ~ changeStatus ~ tokenUser", tokenUser)
    return await Token.update(
      {
        status_is_valid: false,
      },
      {
        where: {
          token: tokenUser,
        },
      }
    );
  }
};

const checkToken = (token) => {
  return Token.findAll({
    where: {
      [Op.and]: [{ status_is_valid: true }, { token: token }],
    },
  }).then((result) => {
    return result;
  });
};
const checkSession = (payload) => {
  return Token.findAll({
    where: {
      [Op.and]: [{ status_is_valid: true }, { id_users: payload }],
    },
  }).then((result) => {
    return result;
  });
};

module.exports = {
  createUpdate,
  changeStatus,
  checkToken,
  checkSession,
};
