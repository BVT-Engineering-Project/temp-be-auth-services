module.exports = (sequelize, type) => {
  return sequelize.define(
    "token",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_users: {
        type: type.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
      },
      token: type.STRING,
      status_is_valid: type.BOOLEAN,
      created_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
