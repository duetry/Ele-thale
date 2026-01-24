// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   loginUser,
//   selectLoginLoading,
//   selectLoginError,
// } from '@/app/features/auth/authSlice';

// export default function LoginPopup({ close }) {
//   const dispatch = useDispatch();

//   const loginLoading = useSelector(selectLoginLoading);
//   const loginError = useSelector(selectLoginError);

//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({ phone: '', password: '' });
//   const [touched, setTouched] = useState({ phone: false, password: false });
//   const [showPassword, setShowPassword] = useState(false);

//   /* ================= VALIDATION ================= */

//   const validatePhone = (value) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!value) return 'Phone number is required';
//     if (!phoneRegex.test(value))
//       return 'Please enter a valid 10-digit Indian mobile number';
//     return '';
//   };

//   const validatePassword = (value) => {
//     if (!value) return 'Password is required';
//     if (value.length < 6)
//       return 'Password must be at least 6 characters';
//     return '';
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     setErrors((prev) => ({
//       ...prev,
//       [field]:
//         field === 'phone'
//           ? validatePhone(phone)
//           : validatePassword(password),
//     }));
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const phoneError = validatePhone(phone);
//     const passwordError = validatePassword(password);

//     setErrors({ phone: phoneError, password: passwordError });
//     setTouched({ phone: true, password: true });

//     if (phoneError || passwordError) return;

//     const result = await dispatch(
//       loginUser({
//         phoneNumber: phone,
//         password,
//       })
//     );

//     if (loginUser.fulfilled.match(result)) {
//       close();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-[100svh] px-4">
      
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={close}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        
//         {/* Close */}
//         <button
//           onClick={close}
//           className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-semibold text-slate-800 mb-2">
//             Welcome 
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Sign in to continue to your account
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 onBlur={() => handleBlur('phone')}
//                 placeholder="9876543210"
//                 maxLength={10}
//                 className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//             </div>
//             {errors.phone && touched.phone && (
//               <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={() => handleBlur('password')}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//             {errors.password && touched.password && (
//               <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
//             )}
//           </div>

//           {/* API Error */}
//           {loginError && (
//             <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
//               {loginError}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loginLoading}
//             className={`w-full py-3 rounded-lg font-medium text-white transition ${
//               loginLoading
//                 ? 'bg-slate-400 cursor-not-allowed'
//                 : 'bg-slate-800 hover:bg-slate-700'
//             }`}
//           >
//             {loginLoading ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   loginUser,
//   selectLoginLoading,
//   selectLoginError,
// } from '@/app/features/auth/authSlice';
// import { useRouter } from 'next/navigation'; 
// export default function LoginPopup({ close }) {
//   const dispatch = useDispatch();

//   const loginLoading = useSelector(selectLoginLoading);
//   const loginError = useSelector(selectLoginError);

//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({ phone: '', password: '' });
//   const [touched, setTouched] = useState({ phone: false, password: false });
//   const [showPassword, setShowPassword] = useState(false);

//   /* ================= VALIDATION ================= */
//   const router = useRouter();
//   const validatePhone = (value) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!value) return 'Phone number is required';
//     if (!phoneRegex.test(value))
//       return 'Please enter a valid 10-digit Indian mobile number';
//     return '';
//   };

//   const validatePassword = (value) => {
//     if (!value) return 'Password is required';
//     if (value.length < 6)
//       return 'Password must be at least 6 characters';
//     return '';
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     setErrors((prev) => ({
//       ...prev,
//       [field]:
//         field === 'phone'
//           ? validatePhone(phone)
//           : validatePassword(password),
//     }));
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const phoneError = validatePhone(phone);
//     const passwordError = validatePassword(password);

//     setErrors({ phone: phoneError, password: passwordError });
//     setTouched({ phone: true, password: true });

//     if (phoneError || passwordError) return;

//     const result = await dispatch(
//       loginUser({
//         phoneNumber: phone,
//         password,
//       })
//     );

//     if (loginUser.fulfilled.match(result)) {
//        router.push('/specialOffer');
//       close();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-[100svh] px-4">
      
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={close}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        
//         {/* Close */}
//         <button
//           onClick={close}
//           className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-semibold text-slate-800 mb-2">
//             Welcome back
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Sign in to continue to your account
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 onBlur={() => handleBlur('phone')}
//                 placeholder="9876543210"
//                 maxLength={10}
//                 className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//             </div>
//             {errors.phone && touched.phone && (
//               <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={() => handleBlur('password')}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//             {errors.password && touched.password && (
//               <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
//             )}
//           </div>

//           {/* API Error */}
//           {loginError && (
//             <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
//               {loginError}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loginLoading}
//             className={`w-full py-3 rounded-lg font-medium text-white transition ${
//               loginLoading
//                 ? 'bg-slate-400 cursor-not-allowed'
//                 : 'bg-slate-800 hover:bg-slate-700'
//             }`}
//           >
//             {loginLoading ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   loginUser,
//   selectLoginLoading,
//   selectLoginError,
// } from '@/app/features/auth/authSlice';
// import { useRouter } from 'next/navigation';

// export default function LoginPopup({ close, onLoginSuccess }) {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const loginLoading = useSelector(selectLoginLoading);
//   const loginError = useSelector(selectLoginError);

//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({ phone: '', password: '' });
//   const [touched, setTouched] = useState({ phone: false, password: false });
//   const [showPassword, setShowPassword] = useState(false);

//   /* ================= VALIDATION ================= */
//   const validatePhone = (value) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!value) return 'Phone number is required';
//     if (!phoneRegex.test(value))
//       return 'Please enter a valid 10-digit Indian mobile number';
//     return '';
//   };

//   // const validatePassword = (value) => {
//   //   if (!value) return 'Password is required';
//   //   if (value.length < 6)
//   //     return 'Password must be at least 6 characters';
//   //   return '';
//   // };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     setErrors((prev) => ({
//       ...prev,
//       [field]:
//         field === 'phone'
//           ? validatePhone(phone)
//           : "",
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const phoneError = validatePhone(phone);
//     // const passwordError = validatePassword(password);

//     setErrors({ phone: phoneError, password: passwordError });
//     setTouched({ phone: true, password: true });

//     if (phoneError || passwordError) return;

//     const result = await dispatch(
//       sentOtp({
//         phoneNumber: phone,
//         // password,
//       })
//     );

//     if (loginUser.fulfilled.match(result)) {
//       // ✅ ONLY LOGIC CHANGE — NO REDIRECT
//       onLoginSuccess?.();
//       close();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-[100svh] px-4">
      
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={close}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        
//         {/* Close */}
//         <button
//           onClick={close}
//           className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-semibold text-slate-800 mb-2">
//             Welcome back
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Sign in to continue to your account
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 onBlur={() => handleBlur('phone')}
//                 placeholder="9876543210"
//                 maxLength={10}
//                 className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//             </div>
//             {errors.phone && touched.phone && (
//               <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={() => handleBlur('password')}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//             {errors.password && touched.password && (
//               <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
//             )}
//           </div>

//           {/* API Error */}
//           {loginError && (
//             <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
//               {loginError}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loginLoading}
//             className={`w-full py-3 rounded-lg font-medium text-white transition ${
//               loginLoading
//                 ? 'bg-slate-400 cursor-not-allowed'
//                 : 'bg-slate-800 hover:bg-slate-700'
//             }`}
//           >
//             {loginLoading ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sentOtp,
  verifyOtp,
} from '@/app/features/auth/authSlice';

export default function LoginPopup({ close, onLoginSuccess }) {
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  /* ================= VALIDATION ================= */
  const validatePhone = (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value))
      return 'Enter valid 10-digit Indian mobile number';
    return '';
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    const phoneError = validatePhone(phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    const result = await dispatch(
      sentOtp({
        phoneNumber: `91${phone}`, // ✅ API FORMAT
      })
    );

    if (sentOtp.fulfilled.match(result)) {
      setOtpSent(true);
    } else {
      setError(result.payload || 'Failed to send OTP');
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Enter valid 6-digit OTP');
      return;
    }

    const result = await dispatch(
      verifyOtp({
        phoneNumber: `91${phone}`,
        otp,
      })
    );

    if (verifyOtp.fulfilled.match(result)) {
      onLoginSuccess?.();
      close();
    } else {
      setError(result.payload || 'Invalid OTP');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-400"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Login with OTP
        </h2>

        {/* PHONE INPUT */}
        <div className="mb-4">
          <label className="text-sm font-medium">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-14 pr-4 py-3 border rounded-lg"
              placeholder="9876543210"
              disabled={otpSent}
            />
          </div>
        </div>

        {/* SEND OTP */}
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-slate-800 text-white py-3 rounded-lg"
          >
            Send OTP
          </button>
        )}

        {/* OTP INPUT */}
        {otpSent && (
          <>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mt-4 px-4 py-3 border rounded-lg"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
            >
              Verify & Login
            </button>
          </>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3">{error}</p>
        )}
      </div>
    </div>
  );
}
