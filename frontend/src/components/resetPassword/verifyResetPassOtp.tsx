import { useState, useEffect } from "react";
import { resendOtp,  verifyResetPasswordOtp } from "../../services/services";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

function VerifyResetOtpPassword() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const res = await verifyResetPasswordOtp(otp, email);

      if (res.data.success) {
        toast.success("Otp verified");
        navigate("/resetPassword", { state: { email } });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    const res = await resendOtp(email);

    if (res.data.success) {
      toast.success("OTP resent to your email");
      setTimer(60);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className=" text-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg font-semibold"
          >
            Verify & Continue
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          {timer > 0 ? (
            <>
              Resend OTP in <span className="font-bold text-black">{timer}s</span>
            </>
          ) : (
            <>
              Didn't receive OTP?{" "}
              <button
                onClick={handleResend}
                className="text-green-400 hover:underline"
              >
                Resend
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default VerifyResetOtpPassword;