const paginator = (reqPage, pageSize) =>{
    const page      = !reqPage || reqPage <= 0 ? 0 : reqPage - 1;
    const nextPage  = page+2;
    const prevPage  = nextPage-1;
    const offset    = page * pageSize;
    const limit     = pageSize;
    return {
        page        :page,
        nextPage    :nextPage,
        prevPage    :prevPage,
        offset      :offset,
        limit       :limit
    }
}
module.exports = paginator;