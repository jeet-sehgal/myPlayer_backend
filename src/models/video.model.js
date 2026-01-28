import mongoose ,{Schema} from "mongoose"
import mongooseAggregatePagination from "mongoose-aggregate-paginate-v2"

const videoSchema=new Schema({
    videoFile:{
        type:String,
        required:[true,"The video is required to upload"]
    },
    thumbnail:{
        type:String,
        required:[true,"the thumbnail is required to upload"]
    },
    title:{
        type:String,
        required:[true,"the title is required"],
        trim:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    desciption:{
        type:String,
        trim:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        required:true
    }
},{timestamp:true})

videoSchema.plugin(mongooseAggregatePagination)

export const Video=mongoose.model("Video",videoSchema)