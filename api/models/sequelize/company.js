module.exports = (sequelize, type) => {
    return sequelize.define('company', {
        id              : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug            :{
            type: type.STRING,
            allowNull:false,
            validate: {
                notNull: true,
                notEmpty: true
            },
            isLowercase: true,        // checks for lowercase
            isUppercase: false,       // checks for uppercase
            unique: {
                args: true,
                msg: 'Slug already in use!'
            }
        },
        description     :type.TEXT,
        phone_number    :type.NUMBER,
        address         :type.STRING,
        email           :type.STRING,
        created_at      :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        },
        updated_at       :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        },
        deleted_at       :{
            type : 'TIMESTAMP',
            defaultValue: sequelize.NOW,
            allowNull:true
        },
        created_by       :type.BIGINT,
        updated_by       :type.BIGINT,
        deleted_by       :type.BIGINT,
        name             :type.STRING,
        is_active        :type.BOOLEAN
    },
    {
        timestamps: false,
        freezeTableName: true,
        indexes: [{unique: true, fields: ['slug']}]
    })
}