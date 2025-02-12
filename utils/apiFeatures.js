class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filter() {
        const queryObj = { ...this.queryString } //destrcuturing
        const excludedFields = ['page', 'sort', 'limit', 'fields']

        excludedFields.forEach(el => delete queryObj[el]) //it will delete the excluded fields from the query object 


        //advance filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))

        return this

    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy) //req.query.sort means the value
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)  //projecting - way of selecting limited fields
        }
        else {
            this.query = this.query.select('-__v')  //- sign will excludes the selected fields
        }
        return this
    }
    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures