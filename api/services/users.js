const { Op } = require('sequelize');
const { User, Roles, Company } = require('../../sequelize');
const paginator = require('../helper/pagination');
const { clean } = require('../helper/cleanObj');
const getCurrentDate = require('../helper/currentDate');
const currentDate = getCurrentDate();
const bcrypt = require('bcrypt')

// Create User
const createUser = (dataInsert) => {
    // console.log('dataInsert',dataInsert);
    return User.create(dataInsert);
}

// check register
const checkRegister = (email, username) => {
    return User.findAll({
        where: {
            [Op.or]: [
                { email: email },
                { username: username }
            ],
        },
        order: [['created_at', 'DESC']],
        limit: 1,
        include: [
            {
                model: Roles,
                as: 'role',
                where: {
                    deleted_at: null,
                }
            },
            {
                model: Company,
                as: 'company'
            }
        ]
    })
    .then(user => {
        return user;
    });
}

const checkRegisterClient = (email) => {
    return User.findAll({
        where: {
            [Op.or]: [
                { email: email }
            ],
        },
        order: [['created_at', 'DESC']],
        limit: 1,
    })
    .then(user => {
        return user;
    });
}
// Get All Users
const getAllUser = (req) => {
    let filterFullName = [];
    const objWhere = {};
    const pagination = paginator(req.query.page, 10);
    const limit = pagination.limit;
    const offset = pagination.offset;
    const empty = [null, undefined, ''];
    const name = (req.query.name) ? req.query.name : '';
    const email = (req.query.email) ? { [Op.like]: `%${req.query.email}%` } : '';
    const id_role = 4;
    const id_company = (req.query.id_company) ? req.query.id_company : '';
    const status = (req.query.status) ? req.query.status : '';

    filterFullName = [
        { firstname: { [Op.iLike]: `%${name}%` } },
        { lastname: { [Op.iLike]: `%${name}%` } }
    ];
    Object.assign(objWhere, {
        deleted_at: null,
        status: status,
        email: email,
        id_role: id_role,
        id_company: id_company,
        [Op.or]: filterFullName
    });

    if (!empty.includes(req.query.created_at)) {
        const date = req.query.created_at.split('-')[2];
        const month = req.query.created_at.split('-')[1];
        const year = req.query.created_at.split('-')[0];

        Object.assign(objWhere, {
            [Op.and]: [
                User.sequelize.literal(
                    `EXTRACT (DAY FROM "users"."created_at") = ${date}`
                ),
                User.sequelize.literal(
                    `EXTRACT (MONTH FROM "users"."created_at") = ${month}`
                ),
                User.sequelize.literal(
                    `EXTRACT (YEAR FROM "users"."created_at") = ${year}`
                ),
            ]
        });
    }

    clean(objWhere);

    return User.findAndCountAll({
        where: objWhere,
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Roles,
                as: 'role',
                where: {
                    deleted_at: null,
                }
            },
            {
                model: Company,
                as: 'company'
            }
        ]
    })
    .then(docs => {
        return {
            data: docs,
            pagination: pagination
        }
    });
}

// Detail User
const detailUser = (id) => {
    return User.findAll({
        where: {
            id: id,
            deleted_at: null
        },
        attributes: {
            exclude: ['password']
        },
        include: [
            {
                model: Roles,
                as: 'role',
            },
            {
                model: Company,
                as: 'company',
            }
        ],
        limit: 1
    }).then(docs => {
        return docs;
    })
}

// UPDATE USER
const updateUser = (id, dataupdate) => {
    return User.update(
        dataupdate, {
        where: {
            id: id
        }
    }
    );
}

// Soft Delete User
const softDelete = (id, deleteData) => {
    return User.update(deleteData, {
        where: {
            id: id
        }
    });
}

// check user to login
const checkUser = (req) => {
    // console.log(req);
    return User.findAll({
        where: {
            [Op.or]: [
                { email: req.body.email_username },
                { username: req.body.email_username }
            ],
        },
        order: [['created_at', 'DESC']],
        limit: 1,
        include: [
            {
                model: Roles,
                as: 'role',
                where: {
                    deleted_at: null,
                }
            },
            {
                model: Company,
                as: 'company'
            }
        ]
    })
    .then(user => {
        return user;
    });
}

// Update Last Login
const updateLastLogin = (id) => {
    return User.update(
        { last_login: currentDate.dateAsiaJakarta },
        {
            where: { id: id }
        }
    );
}

// Update Last Logout
const updateLastLogout = (id) => {
    return User.update(
        { last_logout: currentDate.dateAsiaJakarta },
        {
            where: { id: id }
        }
    );
}

//Verif Email User
const checkEmail = (email)=>{
    return User.findAll({
        where:{
            email:{
                [Op.iLike]:`%${email}`
            }
        }
    }).then(result=>result).catch(err=>err);
}
const verifEmail = (email)=>{
    return User.findAll({
        where:{
            email:email
        }
    }).then(result=>result).catch(err=>err)
}
const updatePassword = (id_user, data) => {
    return User.update(data, {
        where: {
            id: id_user
        }
    }).then(result => result).catch(err => err);
}

const checkUserBg = (data) => {
    return User.findAll({
        where: {
            [Op.or]: [
                { email: data },
            ],
        },
        order: [['created_at', 'DESC']],
        limit: 1,
        include: [
            {
                model: Roles,
                as: 'role',
                where: {
                    deleted_at: null,
                }
            },
            {
                model: Company,
                as: 'company'
            }
        ]
    })
    .then(user => {
        return user;
    });
}

module.exports = {
    createUser,
    checkRegister,
    getAllUser,
    detailUser,
    updateUser,
    softDelete,
    checkUser,
    updateLastLogin,
    checkRegisterClient,
    updateLastLogout,
    verifEmail,
    checkEmail,
    updatePassword,
    checkUserBg
}
