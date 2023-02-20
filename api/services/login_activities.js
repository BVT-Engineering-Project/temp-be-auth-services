const { Op } = require('sequelize');
const { LoginActivities } = require('../../sequelize');

const createActivities = (dataInsert) => {
    return LoginActivities.create(dataInsert);
}

const updateActivities = (token, dataUpdate) => {
    return LoginActivities.findAll({
        where: {
            [Op.and]: [
                { token: token },
                { id_users: dataUpdate.id_users }
            ]
        }
    }).then(isExist => {
        if (isExist.length > 0) {
            LoginActivities.update(dataUpdate, {
                where: {
                    [Op.and]: [
                        { token: token },
                        { id_users: dataUpdate.id_users }
                    ]
                }
            });
            return 'success update token';
        }
    });
}

module.exports = {
    createActivities,
    updateActivities
}