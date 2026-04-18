import api from '../../api/api'
import type { ILoginForm, IRegisterForm, Restaurant } from '../interfaces/interface';

export const  registerUser = async(formData : IRegisterForm)=>{
    try {
        const res  = await api.post("/register", formData)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  loginUser = async(formData : ILoginForm)=>{
    try {
        const res  = await api.post("/login", formData)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  logoutUser = async()=>{
    try {
        localStorage.removeItem('userToken')
        // const res  = await api.post("/logout")
        
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  addRestaurant = async(formData : Restaurant)=>{
    try {
        const res  = await api.post("/restaurant",formData)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  fetchRestaurants = async(page = 1, search = "")=>{
    try {
        const res  = await api.get(`/restaurants?page=${page}&limit=5&search=${search}`)
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}


export const editRestaurant = async (data: Restaurant) => {
  return await api.put(`/restaurant/${data.id}`, data);
};


export const deleteRestaurant = async (id: string) => {
  return await api.delete(`/restaurant/${id}`);
};






export const  verifyOtp = async(otp : string , email : string)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const res  = await api.post(`/verifyOtp`,{otp , email})
        return res
    } catch (error) {   
        throw error
    }
}

// verifyResetPasswordOtp

export const  verifyResetPasswordOtp = async(otp : string , email : string)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const res  = await api.post(`/verifyResetPasswordOtp`,{otp , email})
        return res
    } catch (error) {   
        throw error
    }
}


export const  resendOtp = async(email:string)=>{
    try {
        
        const res  = await api.post(`/resendOtp`,{email})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}


export const  forgotPassword = async(email:string)=>{
    try {
        
        const res  = await api.post(`/forgotPassword`,{email})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}

export const  resetPassword = async(email:string , newPassword : string)=>{
    try {
        
        const res  = await api.post(`/resetPassword`,{email , newPassword})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}


export const  verifyResetOtp = async(otp : string , email : string)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const res  = await api.post(`/verifyResetOtp`,{otp , email})
        return res
    } catch (error) {   
        throw error
    }
}