const roleServices = require("../services/roles");
const getCurrentDate = require("../helper/currentDate");

class RoleControllers {
  // CREATES ROLES
  static async createRoles(access, req, res, next) {
    if (access.page.accessibility.create === "true") {
      const currentDate = getCurrentDate();
      const dataInsertRoles = {
        name: req.body.name,
        slug: req.body.name.toLowerCase().replace(/\s/g, '-'),
        description: req.body.description,
        permissions: req.body.permissions,
        created_at: currentDate.dateAsiaJakarta,
      };
      return await roleServices
        .createRoles(dataInsertRoles)
        .then((data) => {
          res.status(200).json({
            message: "Succefully created new role !",
            role: data,
            request: {
              type: "POST",
              url: "/roles",
            },
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).json({
        message: "Forbidden access!!!"
      })
    }

  }

  // DETAILS ROLES
  static async detailsRoles(access, req, res, next) {
    if (access.page.accessibility.read === "true") {
      const id = req.query.id;
      const empty = [null, undefined, ""];
      return await roleServices
        .detailRoles(id)
        .then((details) => {
          // console.log(details, "get details details roles");
          if (!empty.includes(details)) {
            res.status(200).json({
              role: details,
              request: {
                type: "GET",
                url: `/roles/${id}`,
              },
            });
          } else {
            throw {
              name: " Validation_error",
              status: 404,
              message: `Can't find role with id: ${id}`,
            };
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).json({
        message: "Forbidden access"
      })
    }

  }

  // GET ALL ROLES
  static async getRoles(access, req, res, next) {
    if (access.page.accessibility.read === "true")
      return await roleServices.getRoles(req)
        .then(docs => {
          console.log(docs, "get All Roles");
          if (docs.data.rows.length > 0) {
            const response = {
              total: docs.data.count,
              nextPage: docs.data.nextPage,
              prevPage: docs.data.prevPage,
              roles: docs.data.rows.map(doc => {
                console.log(doc, "row maps roles");
                return {
                  id: doc.id,
                  name: doc.name,
                  permissions: doc.permissions,
                  slug: doc.slug,
                  description: doc.description,
                  created_at: doc.created_at
                }
              }),
              request: {
                type: "GET",
                url: "/roles"
              }
            }
            res.status(200).json(response)
          } else {
            throw {
              name: "Validation_error",
              status: 404,
              message: "No Records Founds",
            }
          }
        })
        .catch(err => {
          next(err)
        })
  }

  // UPDATED ROLES
  static updateRoles(access, req, res, next) {
    if (access.page.accessibility.update === "true") {
      const id = req.query.id;
      const currentDate = getCurrentDate();
      const empty = [null, undefined, ""];
      const dataUpdate = {
        name: req.body.name,
        slug: req.body.name.toLowerCase().replace(/\s/g, '-'),
        description: req.body.description,
        permissions: req.body.permissions,
        updated_at: currentDate.dateAsiaJakarta,
        updated_by: req.userData.id
      };
      roleServices.detailRoles(id)
        .then(ifExist => {
          if (!empty.includes(ifExist)) {
            return roleServices.updateRoles(id, dataUpdate);
          } else {
            throw {
              name: "Validation_error",
              status: 404,
              message: `Can't find role with id: ${id}`
            };
          }
        })
        .then(data => {
          res.status(200).json({
            message: "Successfully updated role data!",
            totalUpdated: data[0],
            request: {
              type: "PUT",
              url: `/roles/${id}`
            }
          })
        })
        .catch(err => {
          next(err)
        })
    } else {
      res.status(403).json({
        message: "Forbidden access!!!"
      })
    }
  }

  // SOFT DELETED ROLES
  static softDeletedRoles(access, req, res, next) {
    if (access.page.accessibility.delete === "true") {
      const id = req.query.id;
      const currentDate = getCurrentDate();
      const empty = [null, undefined, ""]

      // atrribute delete
      const dataDeleted = {
        deleted_at: currentDate.dateAsiaJakarta,
        deleted_by: req.userData.id
      }

      roleServices.detailRoles(id)
        .then(async ifExist => {
          // console.log(ifExist)
          if (!empty.includes(ifExist)) {
            return await roleServices.softDeletedRoles(id, dataDeleted)
          } else {
            throw {
              name: "Validation_error!!!",
              status: 404,
              message: `Cant't find role with id : ${id}`
            }
          }
        })
        .then(data => {
          res.status(200).json({
            message: "Successfully deleted role data!",
            totalDeleted: data[0],
            request: {
              type: "PATCH",
              url: `/roles/${id}`
            }

          })
        })
        .catch(err => {
          next(err)
        })
    } else {
      res.status(403).json({
        message: "Forbidden access!!!"
      })
    }
  }
}

module.exports = RoleControllers