import { useState } from "react";
import "./forgotPassword.css";
import { forgotPassword } from "../../services/services";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword(email);

      if (res.data.success) {
        toast.success("otp send to your mail");
        navigate('/verifyresetPasswordOtp',{state:{email}})
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
        const err = error as AxiosError<{message : string}>
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit} className="forgot-form">
        <h2>Forgot Password</h2>

        <input
          type="text"
          name="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;