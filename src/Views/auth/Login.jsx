import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { request } from '../../services/axios';
import ToastComp from '../../components/toast/ToastComp';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSubmit = async () => {
    if (email && email.includes('@')) {
      setIsLoading(true);
      const body = {
        phoneOrEmail: email
      }
      try {
        const res = await request({
          method: "post",
          url: "auth/sendOtp",
          data: body
        }, false)
        setIsLoading(false);
        setEmailSent(true);
        ToastComp({
          variant: "success",
          message: "OTP sent Successfully"
        })
      }
      catch (err) {
        ToastComp({
          variant:'info',
          message:err.response.data.message
        })
        console.log(err)
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp && otp.length >= 4) {
      setIsVerifying(true);
      const body = {
        phoneOrEmail: email,
        otp: otp
      }
      try {
        const res = await request({
          method: "post",
          url: "auth/verifyOtp",
          data: body
        }, false)
        dispatch({
          type:"LOGIN_SUCCESS",
          payload: res.data
        })
        setIsVerifying(false);
        navigate("/dashboard/sales-overview")
        ToastComp({
          variant: "success",
          message: "OTP verified successfully"
        })
        
      }
      catch (err) {
        console.log(err)
        setIsVerifying(false);
        ToastComp({
          variant: "error",
          message: "Invalid OTP. Please try again."
        })
      }
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center p-4 font-['Montserrat']">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-green-600/10 rounded-full blur-3xl bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-green-600/20 rounded-2xl blur-xl"></div>

        <div className="relative bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-800 p-8 md:p-10">
          {!emailSent ? (
            <>
              {/* Logo/Brand Area */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-yellow-500/60 blur-3xl rounded-2xl opacity-80 animate-pulse"></div>
                  <div className="absolute inset-0 bg-yellow-400/40 blur-2xl rounded-2xl opacity-70"></div>
                  <div className="relative w-full h-full bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl shadow-yellow-600/40 flex items-center justify-center">
                    <img
                      src="/assets/logoccb.png"
                      alt="CCB Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-neutral-400 text-sm">Enter your email to receive a secure OTP</p>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <img src="/assets/logoccb.png" alt="CCB" className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-80" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Enter your email address"
                      className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-lg p-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <span className="text-yellow-500 font-semibold">🔒 Secure Login:</span> We'll send a one-time password (OTP) to your email for verification.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!email || !email.includes('@') || isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg shadow-yellow-600/30 disabled:shadow-none flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 text-center">
                <p className="text-xs text-neutral-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </>
          ) : (
            // OTP Verification State
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg shadow-green-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">Verify OTP</h2>

              <p className="text-neutral-400 mb-2">
                We've sent a verification code to:
              </p>

              <p className="text-yellow-500 font-semibold text-lg mb-6">
                {email}
              </p>

              {/* OTP Input Field */}
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 transition-colors"
                      style={{ color: focusedField === 'otp' ? '#D4AF37' : '' }} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      onFocus={() => setFocusedField('otp')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && handleVerifyOtp()}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3.5 text-white text-center text-lg tracking-widest placeholder-neutral-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={!otp || otp.length < 4 || isVerifying}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg shadow-yellow-600/30 disabled:shadow-none flex items-center justify-center gap-2 group"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Verify OTP
                    </>
                  )}
                </button>
              </div>

              <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-lg p-4 mb-6">
                <p className="text-xs text-neutral-500">
                  💡 Tip: Check your spam folder if you don't see the OTP
                </p>
              </div>

              <button
                onClick={handleTryAgain}
                className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] mb-3"
              >
                Use Different Email
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full text-yellow-600 hover:text-yellow-500 font-medium py-2 transition-colors text-sm disabled:text-neutral-600"
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
