const checkValue = (val) => {
    var result = false
    for (var i in val){
        if(val[i] === 'true'){
            result = true;
            break;
        }
    }
    return result
}

const checkAccess = (verifyRole) => {
    // console.log('verifyRole check access',verifyRole)
    const permissions = verifyRole.superAdmin;
    // console.log("🚀 ~ file: checkAccess.js ~ line 15 ~ checkAccess ~ permissions", permissions)
    const permissionMenu = {
        company: checkValue(permissions.company),
        users: checkValue(permissions.users),
        dashboard: checkValue(permissions.dashboard),
        accessibility: checkValue(permissions.accessibility),
        // allDataGroup: checkValue(permissions.allDataGroup)
    };
    return {
        page: permissions,
        menu: permissionMenu
    };
};

module.exports = {checkAccess}