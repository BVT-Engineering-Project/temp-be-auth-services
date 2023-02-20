const userServices = require("../services/users");
const tokenServices = require("../services/token");
const activitiesServices = require("../services/login_activities");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getCurrentDate = require("../helper/currentDate");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");
const currentDate = getCurrentDate();

/**
 * @openapi
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         email_username:
 *           type: string
 *         password:
 *           type: string
 *         username:
 *           type: string
 *
 *       required: [ email_username, password ]
 *     Token:
 *       type: object
 *     ListUsers:
 *       type: object
 */

class UserControllers {
  /**
   * Hooks up the employees REST-routes to their respective implementations in the provided employees service.
   * @param {express.Express} app The Express app to add the employees routes to.
   * @param {userServices} service The employees service implementing the employees operations.
   */

  // Login

  /**
   * @openapi
   * /users/login:
   *   post:
   *     summary: Login
   *     tags: [ Users ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Users"
   *     responses:
   *       "200":
   *         description: successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  email_username:
   *                   type: string
   *                  password:
   *                   type: string
   */

  static login(req, res, next) {
    userServices
      .checkUser(req)
      .then((user) => {
        // console.log(user[0].status);
        if (user.length < 1) {
          return res.status(404).json({
            status_code: 404,
            message: "Users Not Found",
            data: null,
            request: {
              url: "users/login",
            },
          });
        }

        if (user[0].status === false) {
          return res.status(401).json({
            status_code: 401,
            message: "Anda Belum Verifikasi Email",
            data: null,
            request: {
              status_code: 401,
              message: "Unauthorized",
              url: "users/login",
            },
          });
        }

        bcrypt.compare(
          req.body.password,
          user[0].password,
          async function (err, result) {
            const checkSession = await tokenServices.checkSession(user[0].id);

            if (checkSession.length > 0) {
              return res.status(401).json({
                status_code: 401,
                message: "Your account is still active, please log out first!",
                request: {
                  status_code: 403,
                  message: "Forbidden",
                  url: "users/login",
                },
              });
            }

            if (!result) {
              return res.status(403).json({
                status_code: 403,
                message: "Password Incorect",
                request: {
                  status_code: 403,
                  message: "Forbidden",
                  url: "users/login",
                },
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  id: user[0].id,
                  username: user[0].username,
                  mobile_number: user[0].mobile_number,
                  position: user[0].position,
                  department: user[0].department,
                  email: user[0].email,
                  firstname: user[0].firstname,
                  lastname: user[0].lastname,
                  status: user[0].status,
                  last_login: user[0].last_login,
                  last_logout: user[0].last_logout,
                  created_at: user[0].created_at,
                  updated_at: user[0].updated_at,
                  created_by: user[0].created_by,
                  role: user[0].role,
                  company: user[0].company,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: process.env.JWT_TOKENLIFE,
                }
              );

              const refreshToken = jwt.sign(
                {
                  id: user[0].id,
                  username: user[0].username,
                  mobile_number: user[0].mobile_number,
                  position: user[0].position,
                  department: user[0].department,
                  email: user[0].email,
                  firstname: user[0].firstname,
                  lastname: user[0].lastname,
                  status: user[0].status,
                  last_login: user[0].last_login,
                  last_logout: user[0].last_logout,
                  created_at: user[0].created_at,
                  updated_at: user[0].updated_at,
                  created_by: user[0].created_by,
                  role: user[0].role,
                  company: user[0].company,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: process.env.JWT_TOKENLIFE,
                }
              );

              const insertForToken = {
                id_users: user[0].id,
                token: token,
                status_is_valid: 1,
                created_at: currentDate.dateAsiaJakarta,
              };

              const insertActivities = {
                id_users: user[0].id,
                token: token,
                useragent: req.useragent,
                created_at: currentDate.dateAsiaJakarta,
              };

              await userServices.updateLastLogin(user[0].id);
              await tokenServices.createUpdate(user[0].id, insertForToken);
              await activitiesServices.createActivities(insertActivities);

              const response = {
                status_code: 200,
                message: "Auth Successfully",
                data: {
                  id: user[0].id,
                  email: user[0].email,
                  username: user[0].username,
                  name: user[0].firstname + " " + user[0].lastname,
                  phone_number: user[0].mobile_number,
                  position: user[0].position,
                  rank: "9",
                  nik: "3101010101201003",
                  location: "DKI Jakarta",

                  token: token,
                  refreshToken: refreshToken,

                  profile_picture: user[0].profile_picture,
                },
                request: {
                  // status_code: 200,
                  // message: 'Success',
                  url: "users/login",
                },
              };

              return res.status(200).json(response);
            }

            res.status(401).json({
              status_code: 401,
              message: "Login Failed",
              data: {
                email_username: user[0].username,
                token: token,
                refreshToken: refreshToken,
              },
              request: {
                // status_code: 401,
                // message: "Unauthorized",
                url: "users/login",
              },
            });
          }
        );
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

  // Refresh Token
  static refreshToken(req, res, next) {
    const postData = req.body;
    if (postData.refreshToken) {
      userServices.checkUser(req).then(async (user) => {
        const dataRefresh = {
          id: user[0].id,
          username: user[0].username,
          mobile_number: user[0].mobile_number,
          position: user[0].position,
          department: user[0].department,
          email: user[0].email,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          status: user[0].status,
          last_login: user[0].last_login,
          last_logout: user[0].last_logout,
          created_at: user[0].created_at,
          updated_at: user[0].updated_at,
          created_by: user[0].created_by,
          role: user[0].role,
          company: user[0].company,
        };
        const token = jwt.sign(dataRefresh, process.env.JWT_KEY, {
          expiresIn: process.env.JWT_TOKENLIFE,
        });

        const insertForToken = {
          id_users: user[0].id,
          token: token,
          status_is_valid: 1,
          created_at: currentDate.dateAsiaJakarta,
        };

        const updateActivities = {
          id_users: user[0].id,
          token: token,
          useragent: req.useragent,
          updated_at: currentDate.dateAsiaJakarta,
        };

        const response = {
          token: token,
        };

        return await tokenServices
          .createUpdate(user[0].id, insertForToken)
          .then(() => {
            activitiesServices.updateActivities(
              postData.refreshToken,
              updateActivities
            );
            return res.status(200).json({
              status_code: 200,
              message: "Succes Refresh Token",
              data: {
                token: response,
              },
              request: {
                status_code: 200,
                message: "Success",
                url: "/refresh-token",
              },
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status_code: 500,
              message: err,
              data: null,
              request: {
                status_code: 500,
                message: "Internal Server Error",
                url: "/refresh-token",
              },
            });
          });
      });
    } else {
      return res.status(404).json({
        status_code: 404,
        message: "Token Not Found",
        data: null,
        request: {
          status_code: 404,
          message: "Not Found",
          url: "/check-token",
        },
      });
    }
  }

  // Ceck Token Swagger

  /**
   * @swagger
   * /check-token:
   *  get:
   *    summary: Check token
   *    tags: [Token]
   *    security:
   *      - bearerAuth: []
   *    description: Need Token
   *    content:
   *      - application/json
   *    responses:
   *      200:
   *         content:
   *           application/json:
   *            schema:
   *               type: object
   *      304:
   *         description: Not Modified
   */

  // Ceck Token Swagger End

  // Check Token User
  static checkToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("🚀 ~ file: users.js ~ line 218 ~ UserControllers ~ checkToken ~ token", token)
    tokenServices
      .checkToken(token)
      .then((data) => {
        // console.log("🚀 ~ file: users.js ~ line 220 ~ UserControllers ~ checkToken ~ data", data)
        if (data.length > 0) {
          res.status(200).json({
            status_code: 200,
            message: "Auth Successfully",
            data: {
              id: data[0].id,
              id_users: data[0].id_users,
              token: data[0].token,
              status_is_valid: data[0].status_is_valid,
              created_at: data[0].created_at,
            },
            request: {
              status_code: 200,
              message: "Success",
              url: "/check-token",
            },
          });
        } else {
          return res.status(401).json({
            status_code: 401,
            message: "Check Token Failed",
            data: null,
            request: {
              status_code: 401,
              message: "Unauthorized",
              url: "/check-token",
            },
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  // Create User role 4

  // Create User role 4 end

  // Create user
  static async createUser(access, req, res, next) {
    if (access.page.users.create === "true") {
      try {
        // CREATE KONDISI
        const dataInsert = {
          id_role: 4,
          id_company: req.body.id_company,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          mobile_number: req.body.mobile_number,
          position: req.body.position,
          department: req.body.department,
          profile_picture: req.body.profile_picture
            ? req.body.profile_picture
            : "",
          status: req.body.status,
          created_at: currentDate.dateAsiaJakarta,
          created_by: req.userData.id,
        };
        let checkRegister = await userServices.checkRegister(
          dataInsert.email,
          dataInsert.username
        );
        //console.log(checkRegister, "check register");
        //kondisi cek username dan email already exist register
        if (checkRegister.length > 0) {
          if (
            checkRegister[0].username == dataInsert.username &&
            checkRegister[0].email == dataInsert.email
          ) {
            return res.status(400).json({
              status_code: 400,
              message: `Email : ${checkRegister[0].email} and username : ${checkRegister[0].username} has been register`,
              data: null,
              request: {
                status_code: 400,
                message: "Bad Request",
                url: "users/create",
              },
            });
          } else if (checkRegister[0].email == dataInsert.email) {
            console.log("kondisi kedua");
            return res.status(400).json({
              status_code: 400,
              message: `Email: ${checkRegister.email} has been email register`,
              data: null,
              request: {
                status_code: 400,
                message: "Bad Request",
                url: "users/create",
              },
            });
          } else if (checkRegister[0].username == dataInsert.username) {
            console.log("kondisi ketiga");
            return res.status(400).json({
              status_code: 400,
              message: `Email: ${checkRegister.username} has been username register`,
              data: null,
              request: {
                status_code: 400,
                message: "Bad Request",
                url: "users/create",
              },
            });
          }
        } else {
          // Kondisi does not match password registrasi
          if (req.body.password !== req.body.password_confirmation) {
            throw {
              status_code: 400,
              message: "Password confirmation doesn't match Password",
              data: null,
              request: {
                status_code: 400,
                message: "Bad Request",
                url: "users/create",
              },
            };
          } else {
            bcrypt.hash(dataInsert.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  status: "Internal Server Error",
                  message: err,
                });
              } else {
                // create success
                dataInsert.password = hash;
                userServices
                  .createUser(dataInsert)
                  .then((data) => {
                    res.status(201).json({
                      status_code: 201,
                      message: "User Successfully Created",
                      data: data,
                      request: {
                        status_code: 201,
                        message: "created",
                        url: "users/create",
                      },
                    });
                  })
                  .catch((err) => {
                    next(err);
                  });
              }
            });
          }
        }
        // END CREATE KONDISI
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).json({
        status_code: 403,
        message: "Forbidden access!!!",
        data: null,
        request: {
          status_code: 403,
          message: "Forbidden access!!!",
          url: "users/create",
        },
      });
    }
  }

  // Get All User Swagger

  /**
   * @swagger
   * /users:
   *  get:
   *    summary: Get All User
   *    tags: [ListUsers]
   *    security:
   *      - bearerAuth: []
   *    description: Need Token
   *    content:
   *      - application/json
   *    responses:
   *      200:
   *         content:
   *           application/json:
   *            schema:
   *               type: object
   *      304:
   *         description: Not Modified
   */

  // Get All User Swagger End

  // Get All User
  static getAllUser(access, req, res, next) {
    // console.log(access, "access");
    // token = req.headers.authorization.split(" ")[1];
    if (access.page.users.read === "true") {
      userServices
        .getAllUser(req)
        .then((docs) => {
          if (docs.data.rows.length > 0) {
            const response = {
              total: docs.data.count,
              nextPage: docs.pagination.nextPage,
              prevPage: docs.pagination.prevPage,
              users: docs.data.rows.map((doc) => {
                return {
                  id: doc.id,
                  username: doc.username,
                  email: doc.email,
                  firstname: doc.firstname,
                  lastname: doc.lastname,
                  mobile_number: doc.mobile_number,
                  position: doc.position,
                  department: doc.department,
                  status: doc.status,
                  last_login: doc.last_login,
                  last_logout: doc.last_logout,
                  created_at: doc.created_at,
                  updated_at: doc.updated_at,
                  deleted_at: doc.deleted_at,
                  role: doc.role,
                  company: doc.company,
                };
              }),
              request: {
                type: "GET",
                url: "/users",
              },
            };
            res.status(200).json(response);
          } else {
            throw {
              name: "Validation_error",
              status: 404,
              message: "No records found",
            };
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).json({
        message: "Forbidden access!!!",
      });
    }
  }

  // Detail User
  static getDetailUser(access, req, res, next) {
    if (access.page.users.read === "true") {
      const id = req.query.id;
      userServices
        .detailUser(id)
        .then((docs) => {
          if (docs.length > 0) {
            const response = {
              data: docs.map((doc) => {
                return {
                  id: doc.id,
                  username: doc.username,
                  mobile_number: doc.mobile_number,
                  position: doc.position,
                  location: doc.location ? doc.location : "DKI Jakarta",
                  department: doc.department,
                  email: doc.department,
                  firstname: doc.firstname,
                  lastname: doc.lastname,
                  status: doc.status,
                  profile_picture: doc.profile_picture,
                  last_login: doc.last_login,
                  last_logout: doc.last_logout,
                  created_at: doc.created_at,
                  updated_at: doc.updated_at,
                  deleted_at: doc.deleted_at,
                  updated_password: doc.updated_password,
                  created_by: doc.created_by,
                  updated_by: doc.updated_by,
                  role: doc.role,
                  company: doc.company,
                };
              }),
              request: {
                type: "GET",
                url: "/user",
              },
            };
            res.status(200).json(response);
          } else {
            throw {
              name: "Validation_error",
              status: 404,
              message: "No records found",
            };
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).json({
        message: "Forbidden access!",
      });
    }
  }

  // Update User
  static async updateUser(access, req, res, next) {
    try {
      const id = req.query.id;
      const passwordConfirm = req.body.password_confirmation
        ? req.body.password_confirmation
        : "";
      const currentDate = getCurrentDate();
      const empty = [undefined, null, ""];
      if (access.page.users.update === "true") {
        if (empty.includes(id)) {
          return res.status(400).json({
            message: "Please set id users",
          });
        }
        let detailsUsers = await userServices.detailUser(id);

        if (detailsUsers.length > 0) {
          const dataUpdated = {
            id_role: req.body.id_role
              ? req.body.id_role
              : detailsUsers[0].id_role,
            id_company: req.body.id_company
              ? req.body.id_company
              : detailsUsers[0].id_company,
            email: req.body.email ? req.body.email : detailsUsers[0].email,
            username: req.body.username
              ? req.body.username
              : detailsUsers[0].username,
            password: !empty.includes(req.body.password)
              ? bcrypt.hashSync(req.body.password, 10)
              : detailsUsers[0].password,
            firstname: req.body.firstname
              ? req.body.firstname
              : detailsUsers[0].firstname,
            lastname: req.body.lastname
              ? req.body.lastname
              : detailsUsers[0].lastname,
            mobile_number: req.body.mobile_number
              ? req.body.mobile_number
              : detailsUsers[0].mobile_number,
            status: req.body.status ? req.body.status : detailsUsers[0].status,
            position: req.body.position
              ? req.body.position
              : detailsUsers[0].position,
            department: req.body.department
              ? req.body.department
              : detailsUsers[0].department,
            updated_at: currentDate.dateAsiaJakarta,
            profile_picture: req.body.profile_picture
              ? req.body.profile_picture
              : detailsUsers[0].profile_picture,
            updated_by: req.userData.id,
          };

          if (!empty.includes(req.body.password)) {
            if (req.body.password === passwordConfirm) {
              const updateWithPassword = await userServices.updateUser(
                id,
                dataUpdated
              );
              await tokenServices.changeStatus(id);
              res.status(200).json({
                message: "Successfully Updated User!",
                data: updateWithPassword,
                request: {
                  type: "PUT",
                  url: `/users/updated?id=${id}`,
                },
              });
            } else {
              throw {
                name: "Validation_error",
                status: 400,
                message: "Password confirmation doesn't match Password",
              };
            }
          } else {
            if (!empty.includes(req.body.id_role)) {
              if (+req.body.id_role !== detailsUsers[0].id_role) {
                await tokenServices.changeStatus(id);
              }
            }
            if (!empty.includes(req.body.status)) {
              if (req.body.status !== detailsUsers[0].status) {
                await tokenServices.changeStatus(id);
              }
            }
            const updateNoPassword = await userServices.updateUser(
              id,
              dataUpdated
            );
            res.status(200).json({
              message: "User Updated",
              data: updateNoPassword,
              request: {
                type: "PUT",
                url: `/users/updated?id=${id}`,
              },
            });
          }
        } else {
          throw {
            name: "Validation_error",
            status: 404,
            message: `Can't find User with id: ${id}!`,
          };
        }
      } else {
        res.status(403).json({
          message: "Forbidden access!",
        });
      }
    } catch (err) {
      next(err);
    }
  }
  static async updateUserClient(req, res, next) {
    try {
      const id = req.userData.id;
      const passwordConfirm = req.body.password_confirmation
        ? req.body.password_confirmation
        : "";
      const currentDate = getCurrentDate();
      const empty = [undefined, null, ""];

      let detailUser = await userServices.detailUser(id);
      if (detailUser.length > 0) {
        const dataUpdated = {
          id_role: req.body.id_role ? req.body.id_role : "",
          id_company: req.body.id_company ? req.body.id_company : "",
          email: req.body.email ? req.body.email : "",
          username: req.body.username ? req.body.username : "",
          password: !empty.includes(req.body.password)
            ? bcrypt.hashSync(req.body.password, 10)
            : detailUser[0].password,
          firstname: req.body.firstname ? req.body.firstname : "",
          lastname: req.body.lastname ? req.body.lastname : "",
          mobile_number: req.body.mobile_number ? req.body.mobile_number : "",
          status: req.body.status ? req.body.status : "",
          position: req.body.position ? req.body.position : "",
          department: req.body.department ? req.body.department : "",
          updated_at: currentDate.dateAsiaJakarta,
          updated_by: req.userData.id,
        };
        // console.log(dataUpdated, "====> dataupdated");
        if (!empty.includes(req.body.password)) {
          if (req.body.password === passwordConfirm) {
            const updateWithPassword = await userServices.updateUser(
              id,
              dataUpdated
            );
            await tokenServices.changeStatus(id);
            res.status(200).json({
              message: "Successfully Updated User!",
              data: updateWithPassword,
              request: {
                type: "PUT",
                url: `/users/updated-client?id=${id}`,
              },
            });
          } else {
            throw {
              name: "Validation_error",
              status: 400,
              message: "Password confirmation doesn't match Password",
            };
          }
        } else {
          if (!empty.includes(req.body.id_role)) {
            if (+req.body.id_role !== detailUser[0].id_role) {
              await tokenServices.changeStatus(id);
            }
          }
          if (!empty.includes(req.body.status)) {
            if (req.body.status !== detailUser[0].status) {
              await tokenServices.changeStatus(id);
            }
          }
          const updateNoPassword = await userServices.updateUser(
            id,
            dataUpdated
          );
          res.status(200).json({
            message: "User Updated",
            data: updateNoPassword,
            request: {
              type: "PUT",
              url: `/users/updated-client?id=${id}`,
            },
          });
        }
      } else {
        throw {
          name: "Validation_error",
          status: 404,
          message: `Can't find User with id: ${id}!`,
        };
      }
    } catch (err) {
      next(err);
    }
  }

  // Soft Delete User
  static async deleteUser(acess, req, res, next) {
    if (acess.page.users.delete === "true") {
      try {
        const id = req.query.id;
        let detailUser = await userServices.detailUser(id);
        if (detailUser.length > 0) {
          if (detailUser[0].id == id) {
            throw {
              name: "Validation_error",
              status: 401,
              message: `Can't delete own account!`,
            };
          }

          const deleteData = {
            deleted_at: currentDate.dateAsiaJakarta,
            status: 0,
          };
          const deleteUser = await userServices.softDelete(id, deleteData);
          const response = {
            message: `Successfully Deleted User with id: ${id}`,
            totalDeleted: deleteUser[0],
          };
          res.status(200).json(response);
        } else {
          throw {
            name: "Validation_error",
            status: 404,
            message: `Can't find User with id: ${id}`,
          };
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).json({
        message: "Forbidden access!",
      });
    }
  }

  // CREATE USER CLIENT AND SENDING EMAIL
  static async createUserClient(req, res, next) {
    try {
      //Check email exist or not
      await userServices
        .checkEmail(req.body.email)
        .then(async (result) => {
          if (result.length > 0)
            return res.status(400).json({
              status_code: res.statusCode,
              message: `email ${req.body.email} already exist`,
              data: null,
              request: {
                status_code: res.statusCode,
                message: "Bad Request",
                url: req.url,
              },
            });
          if (req.body.password !== req.body.password_confirmation) {
            return res.status(400).json({
              status_code: res.statusCode,
              message: `Password confirmation doesn't match Password`,
              data: null,
              request: {
                status_code: res.statusCode,
                message: "Bad Request",
                url: req.url,
              },
            });
          }
          const dataRegis = {
            email: req.body.email,
          };
          await bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err)
              return res.status(500).json({
                status_code: res.statusCode,
                message: "Something Wrong",
                data: null,
                request: {
                  status_code: res.statusCode,
                  message: "Internal Server Error",
                  url: req.url,
                },
              });
            dataRegis.password = hash;
            dataRegis.status = false;
            dataRegis.id_role = 5;
            dataRegis.created_at = currentDate.dateAsiaJakarta;
            userServices
              .createUser(dataRegis)
              .then((result) => {
                const secret = `${result.email.split("@")[0]} ${result.status}`;
                // console.log('result',result);
                const mail = result.email;
                const resetToken = jwt.sign(
                  {
                    id: result.id,
                    email: result.email,
                    status: result.status,
                    password: result.password,
                  },
                  secret,
                  {
                    expiresIn: process.env.JWT_TOKENLIFE,
                  }
                );
                // console.log('resetToken', resetToken);
                const encodedToken = Buffer.from(resetToken).toString("base64");
                // console.log('encodedToken', encodedToken);
                const link = `${process.env.API_URL_EMAIL}/register/verification-email?token=${encodedToken}&email=${mail}`;
                const handlebarsOptions = {
                  viewEngine: {
                    defaultLayout: false,
                  },
                  viewPath: path.resolve("./views"),
                };
                const transport = nodemailer.createTransport({
                  host: process.env.EMAIL_SERVICE,
                  port: process.env.EMAIL_PORT,
                  secure: false,
                  auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                  },
                });
                transport.use("compile", handlebars(handlebarsOptions));
                const options = {
                  from: process.env.EMAIL_SENDER,
                  to: mail,
                  subject: "Verify Email",
                  template: "emailVerification",
                  context: { verifyLink: link },
                };
                transport.sendMail(options, (err, info) => {
                  if (err) {
                    return next(err);
                  }
                  transport.verify((error, success) => {
                    if (error) {
                      return res.status(500).json({
                        status_code: res.statusCode,
                        message: "Internal Server Error",
                        data: null,
                        request: {
                          status_code: res.statusCode,
                          message: "Internal Server Error",
                          url: req.url,
                        },
                      });
                    }
                    if (success) {
                      return res.status(201).json({
                        status_code: res.statusCode,
                        message: "Check your email",
                        data: {
                          email: `${result.email}`,
                        },
                        request: {
                          status_code: res.statusCode,
                          message: "Success",
                          url: req.url,
                        },
                      });
                    }
                  });
                });
              })
              .catch((err) => next(err));
          });
        })
        .catch((err) => next(err));
    } catch (err) {
      next(err);
    }
  }

  //check email and update status (enable user login)
  static verifyEmail = async (req, res, next) => {
    try {
      if (typeof req.query.token !== "string")
        return res.status(400).json({
          status_code: res.statusCode,
          message: "Invalid Token",
          data: null,
          request: {
            status_code: res.statusCode,
            message: "Bad Request",
            url: req.url,
          },
        });
      const tokenValue = Buffer.from(req.query.token, "base64").toString(
        "ascii"
      );
      // console.log(tokenValue)
      const decoded = jwt.decode(tokenValue);
      // console.log(decoded)
      const secret = `${decoded.email.split("@")[0]} ${decoded.status}`;
      const verifyToken = (token, secret) => {
        try {
          jwt.verify(tokenValue, secret);
          return true;
        } catch (error) {
          return false;
        }
      };
      const isValidToken = verifyToken(tokenValue, secret);
      if (!isValidToken) {
        return res.status(401).json({
          status_code: 401,
          message: "Invalid Token",
          request: {
            status_code: 401,
            message: "Unauthorized",
            url: req.url,
          },
        });
      }
      req.body.email_username = decoded.email;
      await userServices.checkUser(req).then(async (result) => {
        if (!result) {
          return res.status(404).json({
            status_code: res.statusCode,
            message: "User Not Found",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Not Found",
              data: null,
              url: req.url,
            },
          });
        }
        if (result[0].status === true)
          return res.status(400).json({
            status_code: res.statusCode,
            message: "Email Already Verified",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Bad Request",
              data: null,
              url: req.url,
            },
          });
        await userServices
          .updateUser(result[0].id, { status: true })
          .then((result) => {
            if (!result)
              return res.status(404).json({
                status_code: res.statusCode,
                message: "User Not Found",
                data: null,
                request: {
                  status_code: res.statusCode,
                  message: "Not Found",
                  data: null,
                  url: req.url,
                },
              });
            return res.status(200).json({
              status_code: res.statusCode,
              message: "Email Verified",
              data: null,
              request: {
                status_code: res.statusCode,
                data: null,
                message: "Success",
                url: req.url,
              },
            });
          });
      });
    } catch (err) {
      next(err);
    }
  };

  //Verify Status Email User
  static verifyEmailStatus = async (req, res, next) => {
    userServices
      .checkEmail(req.body.email)
      .then((result) => {
        //  console.log(result)
        // console.log('result status',result[0].email);
        // const secret = `${result.email.split('@')[0]} ${result.status}`;
        //  const Tokens = jwt.sign({
        //     id: result.id,
        //     email: result.email,
        //     status: result.status
        //   },
        //   secret,
        //   {
        //     expiresIn: process.env.JWT_TOKENLIFE
        //   })
        //   const encodedToken = Buffer.from(Tokens).toString('base64');
        //   console.log(encodedToken);
        if (result.length <= 0) {
          return res.status(404).json({
            status_code: res.statusCode,
            message: "Email Not Found",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Not Found",
              url: req.url,
            },
          });
        }
        if (result[0].status !== true) {
          return res.status(400).json({
            status_code: res.statusCode,
            message: "Email Not Verified Yet",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Bad Request",
              url: req.url,
            },
          });
        } else if (result[0].status === true) {
          const secret = `${result[0].email.split("@")[0]} ${result[0].status}`;
          const Tokens = jwt.sign(
            {
              id: result[0].id,
              email: result[0].email,
              status: result[0].status,
            },
            secret,
            {
              expiresIn: process.env.JWT_TOKENLIFE,
            }
          );
          return res.status(200).json({
            status_code: res.statusCode,
            message: "Email Verified",
            data: {
              email: `${result[0].email}`,
              token: Tokens,
            },
            request: {
              status_code: res.statusCode,
              message: "Success",
              url: req.url,
            },
          });
        }
      })
      .catch((err) => next(err));
  };

  //Update Password User
  static updatePassword = async (access, req, res, next) => {
    // if (access.page.users.update === 'true') {
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.status(400).json({
        status_code: res.statusCode,
        message: `Password Confirmation Doesn't Match Password`,
        data: null,
        request: {
          status_code: res.statusCode,
          message: "Bad Request",
          url: req.url,
        },
      });
    }
    req.body.email_username = req.userData.email;
    userServices
      .checkUser(req)
      .then(async (result) => {
        if (!result) {
          return res.status(404).json({
            status_code: res.statusCode,
            message: "User Not Found",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Not Found",
              url: req.url,
            },
          });
        }
        const isCompare = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isCompare) {
          return res.status(403).json({
            status_code: 403,
            message: "Password Incorrect",
            request: {
              status_code: 403,
              message: "Forbidden",
              url: "users/login",
            },
          });
        }
        bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
          if (err) {
            return res.status(500).json({
              status_code: res.statusCode,
              message: "Internal Server Error",
              data: null,
              request: {
                status_code: res.statusCode,
                message: "Internal Server Error",
                url: req.url,
              },
            });
          }
          const dataUpdate = {
            updated_at: currentDate.dateAsiaJakarta,
            updated_by: result[0].id,
            password: hash,
          };
          userServices
            .updatePassword(result[0].id, dataUpdate)
            .then(() => {
              const link = "";
              const subject = "Password Update";
              const template = "emailNotification";
              this.sendingEmail(
                result,
                link,
                subject,
                template,
                req,
                res,
                next
              );
            })
            .catch((err) => next(err));
        });
      })
      .catch((err) => next(err));
  };

  //   static updatePasswordClient = async ( req, res, next) => {
  //     if (req.body.newPassword !== req.body.confirmNewPassword) {
  //       return res.status(400).json({
  //         status_code: res.statusCode,
  //         message: `Password Confirmation Doesn't Match Password`,
  //         data: null,
  //         request: {
  //           status_code: res.statusCode,
  //           message: 'Bad Request',
  //           url: req.url
  //         }
  //       });
  //     }
  //     req.body.email_username = req.userData.email
  //     userServices.checkUser(req).then(async result => {
  //       if (!result) {
  //         return res.status(404).json({
  //           status_code: res.statusCode,
  //           message: 'User Not Found',
  //           data: null,
  //           request: {
  //             status_code: res.statusCode,
  //             message: 'Not Found',
  //             url: req.url
  //           }
  //         });
  //       }
  //       await bcrypt.compare(req.body.password, result[0].password, async function (err, result) {
  //         if (!result) {
  //           return res.status(403).json({
  //             status_code: 400,
  //             message: 'Password Incorect',
  //             request: {
  //               status_code: 400,
  //               message: 'Forbidden',
  //               url: "users/login"
  //             }

  //           })
  //         }
  //       });
  //       bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
  //         // if (err) {
  //         //   return res.status(500).json({
  //         //     status_code: res.statusCode,
  //         //     message: 'Internal Server Error',
  //         //     data: null,
  //         //     request: {
  //         //       status_code: res.statusCode,
  //         //       message: 'Internal Server Error',
  //         //       url: req.url
  //         //     }
  //         //   })
  //         // }
  //         const dataUpdate = {
  //           updated_at: currentDate.dateAsiaJakarta,
  //           updated_by: result[0].id,
  //           password: hash
  //         }
  //         userServices.updatePassword(result[0].id, dataUpdate).then(() => {
  //           return res.status(200).json({
  //             status_code: res.statusCode,
  //             message: 'Success Update Password',
  //             data: null,
  //             request: {
  //               status_code: res.statusCode,
  //               message: 'Ok',
  //               url: req.url
  //             }
  //           })
  //         }).catch(err => next(err));
  //       })
  //     }).catch(err => next(err));

  // }
  static sendingEmail = async (
    data,
    link,
    subject,
    template,
    req,
    res,
    next
  ) => {
    const secret = `${data[0].email.split("@")[0]} ${data[0].status}`;
    const mail = data[0].email;
    const verifToken = jwt.sign(
      {
        id: data[0].id,
        email: data[0].email,
        status: data[0].status,
      },
      secret,
      {
        expiresIn: process.env.JWT_TOKENLIFE,
      }
    );
    const encodedToken = Buffer.from(verifToken).toString("base64");
    const verifLink = `${link}${encodedToken}`;
    const handlebarsOptions = {
      viewEngine: {
        defaultLayout: false,
      },
      viewPath: path.resolve("./views"),
    };
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    transport.use("compile", handlebars(handlebarsOptions));
    const options = {
      from: process.env.EMAIL_SENDER,
      to: mail,
      subject: subject,
      template: template,
      context: { verifyLink: verifLink },
    };
    transport.sendMail(options, (err, info) => {
      if (err) {
        return next(err);
      }
      transport.verify((error, success) => {
        if (error) {
          return res.status(500).json({
            status_code: res.statusCode,
            message: "Internal Server Error",
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Internal Server Error",
              url: req.url,
            },
          });
        }
        if (success) {
          return res.status(200).json({
            status_code: res.statusCode,
            message: "Check your email",
            data: {
              email: `${data[0].email}`,
            },
            request: {
              status_code: res.statusCode,
              message: "Success",
              url: req.url,
            },
          });
        }
      });
    });
  };
  static resendEmail = async (req, res, next) => {
    return userServices
      .checkRegisterClient(req.body.email)
      .then(async (result) => {
        if (result.length > 0 && result[0].status === true) {
          return res.status(400).json({
            status_code: res.statusCode,
            message: `${req.body.email} Already Registered`,
            data: null,
            request: {
              status_code: res.statusCode,
              message: "Bad Request",
              url: req.url,
            },
          });
        } else {
          if (result.length <= 0) {
            return res.status(400).json({
              status_code: res.statusCode,
              message: `${req.body.email} Not Registered Yet`,
              data: null,
              request: {
                status_code: res.statusCode,
                message: "Bad Request",
                url: req.url,
              },
            });
          }
          if (result[0].status === false) {
            const link = `${process.env.API_URL_EMAIL}/register/verification-email?token=`;
            const subject = "Verify Email";
            const template = "emailVerification";
            await this.sendingEmail(
              result,
              link,
              subject,
              template,
              req,
              res,
              next
            );
          }
        }
      })
      .catch((err) => next(err));
  };

  static loginBackgroud(req, res, next) {
    userServices
      .checkUserBg(req.body.email)
      .then((user) => {
        // console.log('user',user[0].status);
        if (user.length < 1) {
          return res.status(404).json({
            status_code: 404,
            message: "Users Not Found",
            data: null,
            request: {
              // status_code: 404,
              // message: 'Not Found',
              url: "users/login",
            },
          });
        }
        if (user[0].status === false) {
          return res.status(401).json({
            status_code: 401,
            message: "Anda Belum Verifikasi Email",
            data: null,
            request: {
              status_code: 401,
              message: "Unauthorized",
              url: "users/login",
            },
          });
        } else if (user[0].status === true) {
          // if(user.length > 1){
          const token = jwt.sign(
            {
              id: user[0].id,
              username: user[0].username,
              mobile_number: user[0].mobile_number,
              position: user[0].position,
              department: user[0].department,
              email: user[0].email,
              firstname: user[0].firstname,
              lastname: user[0].lastname,
              status: user[0].status,
              last_login: user[0].last_login,
              last_logout: user[0].last_logout,
              created_at: user[0].created_at,
              updated_at: user[0].updated_at,
              created_by: user[0].created_by,
              role: user[0].role,
              company: user[0].company,
            },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.JWT_TOKENLIFE,
            }
          );

          const refreshToken = jwt.sign(
            {
              id: user[0].id,
              username: user[0].username,
              mobile_number: user[0].mobile_number,
              position: user[0].position,
              department: user[0].department,
              email: user[0].email,
              firstname: user[0].firstname,
              lastname: user[0].lastname,
              status: user[0].status,
              last_login: user[0].last_login,
              last_logout: user[0].last_logout,
              created_at: user[0].created_at,
              updated_at: user[0].updated_at,
              created_by: user[0].created_by,
              role: user[0].role,
              company: user[0].company,
            },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.JWT_TOKENLIFE,
            }
          );
          // console.log(refreshToken);
          const insertForToken = {
            id_users: user[0].id,
            token: token,
            status_is_valid: 1,
            created_at: currentDate.dateAsiaJakarta,
          };

          const insertActivities = {
            id_users: user[0].id,
            token: token,
            useragent: req.useragent,
            created_at: currentDate.dateAsiaJakarta,
          };
          userServices.updateLastLogin(user[0].id);
          tokenServices.createUpdate(user[0].id, insertForToken);
          activitiesServices.createActivities(insertActivities);
          const response = {
            status_code: 200,
            message: "Auth Successfully",
            data: {
              token: token,
              email_username: user[0].email,
              refreshToken: refreshToken,
            },
            request: {
              // status_code: 200,
              // message: "Success",
              url: "users/login",
            },
          };
          return res.status(200).json(response);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
}

module.exports = UserControllers;
