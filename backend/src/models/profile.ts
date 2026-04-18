import mongoose ,{Document , Schema} from 'mongoose'



export interface IUser  extends Document{
    name : string;
    phone : number;
    email : string;
    password : string

}

const userSchema : Schema<IUser> = new Schema({

    name : {
        type : String
    },
    
    email :{
        type : String
    },
    phone : {
        type : Number
    },
    password :{
        type : String
    }
})


export const UserModel = mongoose.model<IUser>("user",userSchema)