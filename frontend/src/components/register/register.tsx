import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './register.css'
import { registerUser } from "../../services/services";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name : "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(formData);
      console.log(res);
      
      if(res?.data.success){
      toast.success(res?.data.message);
      
      navigate("/verifyOtp", { state: { email: formData.email } });
      }else{
        toast.error(res?.data.message)
      }
    } catch (error) {
        console.log(error)
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

<div className="register-container">
  <form onSubmit={handleSubmit} className="register-form">
    <h2>Create Account</h2>

   <input
      type="text"
      name="name"
      placeholder="Enter Name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Enter Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

     <input
      type="tel"
      name="phone"
      placeholder="Enter Number"
      value={formData.phone}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      name="password"
      placeholder="Enter Password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <button type="submit" disabled={loading}>
      {loading ? "Registering..." : "Register"}
    </button>

    <p>
      Already have an account?{" "}
      <span onClick={() => navigate("/login")}>
        Login
      </span>
    </p>
  </form>
  
</div>
  );
};



export default Register;