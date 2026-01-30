class ApiError extends Error{
    constructor(stack,errors=[],message="something went wrong",statusCode=500){
        super(message)
        this.statusCode=statusCode
        this.success=false
        this.errors=errors
        this.data=null
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
        
    }
}

export {ApiError}