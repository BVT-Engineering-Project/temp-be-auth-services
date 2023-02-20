module.exports = (sequelize, type) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_role: {
        type: type.BIGINT,
        allowNull: false,
        references: {
          models: "roles",
          key: "id",
        },
        validate: {
          notNull: true,
          notEmpty: {
            msg: "Please select accessibility!",
          },
        },
      },
      id_company: {
        type: type.BIGINT,
        references: {
          models: "company",
          key: "id",
        },
      },
      username: {
        type: type.STRING,
        allowNull: true,
      },
      email: {
        type: type.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid email format!",
          },
          notNull: true,
          notEmpty: {
            msg: "email cannot be empty!",
          },
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      password: {
        type: type.STRING,
        is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          len: {
            args: 7,
            msg: "Password must be atleast 7 characters in length",
          },
        },
      },
      firstname: {
        type: type.STRING,
      },
      lastname: {
        type: type.STRING,
      },
      mobile_number: {
        type: type.NUMERIC,
      },
      profile_picture: {
        type: type.STRING,
      },
      position: {
        type: type.STRING,
      },
      department: {
        type: type.STRING,
      },
      status: {
        type: type.BOOLEAN,
        allowNull: false,
      },
      last_login: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      last_logout: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      updated_password: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      deleted_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.NOW,
        allowNull: true,
      },
      created_by: type.BIGINT,
      updated_by: type.BIGINT,
      deleted_by: type.BIGINT,
    },
    {
      timestamps: false,
      freezeTableName: true,
      indexes: [{ unique: true, fields: ["email"] }],
    }
  );
};
