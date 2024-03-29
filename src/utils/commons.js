class CommonsUtil {
  static buildResponse(data) {
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
      prevLink: !data.hasPrevPage ? null : `/products?limit=${data.limit}&page=${data.prevPage}${sortQueryParam}`,
      nextLink: !data.hasNextPage ? null : `/products?limit=${data.limit}&page=${data.nextPage}${sortQueryParam}`,
      sort: data.sort,
      sortLink: `/api/products?page=${data.page}&limit=${data.limit}&sort=${data.sort === 'asc' ? 'desc' : 'asc'}`
    }
  }
  static getFilter(query = {}) {
    const { category, status } = query
    const filter = {}
    if (category) {
      filter.category = category
    }
    if (status) {
      filter.status = status
    }
    return filter
  }
}

export default CommonsUtil