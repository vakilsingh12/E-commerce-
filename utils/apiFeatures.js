class ApiFeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"   //case in sensetive bna dega
            }
        }:{}
        this.query=this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy={...this.queryStr}  //remove reference 
        /************************remove some fields from category */
        const removeFields=["keyword","page","limit"]; 
        //category i will send throw postman and we need to remove keyword from this object
        removeFields.forEach(key=>delete queryCopy[key])
        /***********filter for price and rating need to set range of price */
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        this.query=this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultPerPage){
     const currentPage=Number(this.queryStr.page)||1;
     const skip=resultPerPage*(currentPage-1)
     this.query=this.query.limit(resultPerPage).skip(skip)
     return this
    }
}

module.exports=ApiFeatures