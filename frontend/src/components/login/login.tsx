import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/services";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const res = await loginUser(formData);
      console.log(res);
      
      if(res?.data.success){
      toast.success(res?.data.message);
      localStorage.setItem('userToken',res.data.token)
      
      navigate("/home");
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
    <h2>Login</h2>


    <input
      type="email"
      name="email"
      placeholder="Enter Email"
      value={formData.email}
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

    <p onClick={() => navigate("/forgotPassword")}>
      <span>forgot password</span>
    </p>

    <button type="submit" disabled={loading}>
      {loading ? "loggin in..." : "Login"}
    </button>

    <p>
      Dont have an account?{" "}
      <span onClick={() => navigate("/register")}>  
        Register
      </span>
    </p>
  </form>
  
</div>
  );
};



export default Login;