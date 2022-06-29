class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // console.log(this.query);
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              fName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              lName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              email: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              gender: {
                $regex: this.queryStr.keyword,
                $options: "s",
              },
            },
            {
              designation: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
  paginationLeaves(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query
      .sort({ $natural: -1 })
      .limit(resultPerPage)
      .skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
