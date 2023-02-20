const {Roles, Token, User} = require("../../sequelize");
const {clean} = require("../helper/cleanObj");
const {Op} = require('sequelize')
const paginator = require("../helper/pagination");


// CREATE ROLES
const createRoles = async (dataInsertRoles) => {
    return await Roles.create(dataInsertRoles);
}

// DETAILS ROLES
const detailRoles = async (id) => {
  return await Roles.findOne({
    where: {
      id: id,
      deleted_at: null,
    },
  })
  .then(details => {
    return details;
  });
};

// GET ALL ROLES
const getRoles = async (req) =>{
  const objWhere = {
    deleted_at : null
  }
  const pagination = paginator(req.query.page, 10);
  const limit   = pagination.limit;
  const offset  = pagination.offset;
  const empty   = [null, undefined, ""];
  if(!empty.includes(req.query.name)){
    Object.assign(objWhere,{
      name:{[Op.iLike]:`%${req.query.name}`}
    })
  }
  if (!empty.includes(req.query.created_at)) {
    const date = req.query.created_at.split('-')[2];
    const month = req.query.created_at.split('-')[1];
    const year = req.query.created_at.split('-')[0];
    Object.assign(objWhere, {
      [Op.and]: [
        Roles.sequelize.literal(
          `EXTRACT(DAY FROM "roles"."created_at") = ${date}`
        ),
        Roles.sequelize.literal(
          `EXTRACT(MONTH FROM "roles"."created_at") = ${month}`
        ),
        Roles.sequelize.literal(
          `EXTRACT(YEAR FROM "roles"."created_at") = ${year}`
        ),
      ]
    })
  }
  clean(objWhere);
  return await Roles.findAndCountAll({
    where:objWhere,
    limit,
    offset
  }).then((Roles)=>{
    return{
      data:Roles,
      pagination:pagination,
    };

  });
};

// UPDATED ROLES
const updateRoles = async (id, dataUpdate) => {
  try {
    let userIds = [];
    const findUserWithRole = await Token.findAll({
      include:[{
        model : User
      }]
    });
   
    for (let i = 0; i < findUserWithRole.length; i++) {
      // console.log(findUserWithRole[i].dataValues.user.id_role,`temukan role looping ke ${i}`)
      // console.log(findUserWithRole[i].id_users, "temukan id users")
      if (findUserWithRole[i].dataValues.user.id_role == id) {
        userIds.push(findUserWithRole[i].id_users)
      }
    }
    const userWithRole = Array.from(new Set(userIds));
    if(userWithRole.length > 0) {
      await Token.update(
        {
          status_is_valid: false
        },
        {
          where: {
            id_users: {
              [Op.in]: userWithRole
            }
          }
        }
      );
    }
    return await Roles.update(
      dataUpdate,
      {
        where: {
          id: id
        }
      }
    );
  } catch (err) {
    throw (err)
  }
};

// DELETED ROLES
const softDeletedRoles = async(id, dataDeleted) => {
  return await Roles.update(dataDeleted, {
    where : {
      id : id
    }
  });
}


module.exports = {
    createRoles,
    detailRoles,
    getRoles,
    updateRoles,
    softDeletedRoles
}