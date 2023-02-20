const express = require("express");
const router = express.Router();
const { checkAuth, authorization } = require("../middleware/check-auth");
const roleControllers = require("../controllers/roles");

router.get("/", checkAuth, authorization, roleControllers.getRoles);
router.get("/detail",checkAuth, authorization, roleControllers.detailsRoles);
router.post("/create",checkAuth, authorization, roleControllers.createRoles);
router.put("/update", checkAuth, authorization, roleControllers.updateRoles);
router.patch("/delete", checkAuth, authorization, roleControllers.softDeletedRoles);

module.exports = router