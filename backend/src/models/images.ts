import mongoose ,{Document , Schema} from 'mongoose'

export interface IImage  extends Document{
    userId : string;
    title : string;
    image : string;
    order : number;
}

const imageSchema : Schema<IImage> = new Schema({
    userId : {
        type : String
    },

    title : {
        type : String
    },
    
    image :{
        type : String
    },
    order :{
        type : Number
    }
})

export const ImageModel = mongoose.model<IImage>("images",imageSchema)