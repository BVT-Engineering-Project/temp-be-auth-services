const Sequelize = require("sequelize");
const UserModel = require("./api/models/sequelize/user");
const RolesModel = require("./api/models/sequelize/roles");
const CompanyModel = require("./api/models/sequelize/company");
const TokenModel = require("./api/models/sequelize/token");
const LoginActivitiesModel = require("./api/models/sequelize/login_activities");


// connection databases
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PWD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT,
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
)

const User = UserModel (sequelize, Sequelize)
const Roles = RolesModel (sequelize, Sequelize)
const Company = CompanyModel (sequelize, Sequelize)
const Token = TokenModel (sequelize, Sequelize)
const LoginActivities = LoginActivitiesModel (sequelize, Sequelize)


// Associations Sequelize
User.belongsTo(Roles, {foreignKey: "id_role"});
User.belongsTo(Company, {foreignKey : "id_company"});
Token.belongsTo(User, {foreignKey : "id_users"});
LoginActivities.belongsTo(User, { foreignKey: "id_users"})

module.exports = {
    User,
    Roles,
    Company,
    Token,
    LoginActivities
};