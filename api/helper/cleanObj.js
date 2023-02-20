const clean = (obj) => {
    for (var objWhere in obj) { 
        if (obj[objWhere] === '' || obj[objWhere] === undefined) {
            delete obj[objWhere];
        }
    }
};

module.exports = {
    clean,
};