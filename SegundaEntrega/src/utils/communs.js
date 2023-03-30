class CommonsUtil {
  static buidResponse(data) {
    let sortQueryParam = ''
    if (data.sort) {
      sortQueryParam = `&sort=${data.sort}`
    }
    return {
      status:'success',
      payload: data.docs,
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: !data.hasPrevPage ? null : `${process.env.BASE_URL}/api?limit=${data.limit}&page=${data.prevPage}${sortQueryParam}`,
      nextLink: !data.hasNextPage ? null : `${process.env.BASE_URL}/api?limit=${data.limit}&page=${data.nextPage}${sortQueryParam}`,
      sort: data.sort,
      sortLink: `${process.env.BASE_URL}/api?page=${data.page}&limit=${data.limit}&sort=${data.sort === 'asc' ? 'desc' : 'asc'}`
    }
  }
  static getFilter(query = {}) {
    const { category } = query
    const filter = {}
    if (category) {
      filter.category = category
    }
    return filter
  }
}

export default CommonsUtil