

export interface IRegisterForm{
    name : string ;
    email : string ;
    phone : string;
    password : string;
}

export interface ILoginForm{
    email : string ;
    password : string;
}


export interface Restaurant {
  id ?: string
  name: string;
  address: string;
  phone: string;
  email: string;
};