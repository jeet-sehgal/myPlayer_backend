class ApiResponse{
    constructor(data,messages="success",statusCode=200){
        this.data=data
        this.messages=messages
        this.statusCode=statusCode
        this.success=statusCode<400
    }
}

export {ApiResponse}