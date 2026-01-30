class Response{
    constructor(data,statusCode=200,messages="success"){
        this.data=data
        this.messages=messages
        this.statusCode=statusCode
        this.success=statusCode<400
    }
}

export {Response}