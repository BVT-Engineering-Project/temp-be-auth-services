module.exports = (sequelize, type) => {
 return sequelize.define("roles", {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    permissions :type.JSONB,
    description :type.STRING,
    name        :{
        type: type.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: {
                msg: "Accessibility name cannot be empty!"
            }
        }
    },
    slug         :{
        type: type.STRING,
        allowNull:false,
        validate: {
            notNull: true,
            notEmpty: true
        },
        isLowercase: true,        // checks for lowercase
        isUppercase: false,        // checks for uppercase
        unique: {
            args: true,
            msg: 'Slug already in use!'
        }
    },
    created_at   :{
        type : 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull:true
    },
    updated_at   :{
        type : 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull:true
    },
    deleted_at   :{
        type : 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull:true
    },
    updated_by   :type.BIGINT,
    created_by   :type.BIGINT,
    deleted_by   :type.BIGINT
 },
 {
    timestamps: false,
    freezeTableName: true,
    indexes: [{unique: true, fields: ['slug']}],
 })
}