module.exports = (sequelize, type) => {
    return sequelize.define('login_activities', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_users             :{
            type: type.BIGINT,
            references: {
                model: 'users',
                key: 'id'
            }
        },  
        useragent: type.JSONB,
        token:type.STRING,
        created_at          :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        },
        updated_at          :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        },
        deleted_at          :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
    })
}