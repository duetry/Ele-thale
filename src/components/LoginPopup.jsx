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
//   const [step, setStep] = useState('phone'); 
//   // phone | password | createPassword

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

//     if (field === 'phone') {
//       setErrors((prev) => ({
//         ...prev,
//         phone: validatePhone(phone),
//       }));
//     }

//     if (field === 'password') {
//       setErrors((prev) => ({
//         ...prev,
//         password: validatePassword(password),
//       }));
//     }
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // STEP 1 → PHONE CHECK
//     if (step === 'phone') {
//       const phoneError = validatePhone(phone);

//       setErrors({ phone: phoneError, password: '' });
//       setTouched({ phone: true, password: false });

//       if (phoneError) return;

//       const result = await dispatch(
//         loginUser({
//           phoneNumber: phone,
//         })
//       );

//       if (loginUser.fulfilled.match(result)) {
//         const response = result.payload;

//         if (response?.Password === true) {
//           setStep('password');
//         } else {
//           setStep('createPassword');
//         }

//         setPassword('');
//         setErrors({ phone: '', password: '' });
//         setTouched({ phone: false, password: false });
//       }

//       return;
//     }

//     // STEP 2 → PASSWORD OR CREATE PASSWORD
//     if (step === 'password' || step === 'createPassword') {
//       const passwordError = validatePassword(password);

//       setErrors({ phone: '', password: passwordError });
//       setTouched({ phone: false, password: true });

//       if (passwordError) return;

//       const result = await dispatch(
//         loginUser({
//           phoneNumber: phone,
//           password,
//         })
//       );

//       if (loginUser.fulfilled.match(result)) {
//         const userType = result.payload?.usertype;
//         if (userType === 'admin' || userType === 'SHOP_OWNER') {
//           router.push('/admin');
//         }
//         close();
//         if (onLoginSuccess) onLoginSuccess();
//       }
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
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

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
//             {step === 'phone'
//               ? 'Welcome'
//               : step === 'password'
//               ? 'Welcome back'
//               : 'Create Your Account'}
//           </h2>

//           <p className="text-slate-500 text-sm">
//             {step === 'phone'
//               ? 'Enter your phone number to continue'
//               : step === 'password'
//               ? 'Enter your password to sign in'
//               : 'Set a password to create your account'}
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
//   onChange={(e) => {
//     const onlyNums = e.target.value.replace(/\D/g, "");
//     setPhone(onlyNums);
//   }}                onBlur={() => handleBlur('phone')}
//                 placeholder="9876543210"
//                 maxLength={10}
//                 disabled={step !== 'phone'}
//                 className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100"
//               />
//             </div>

//             {errors.phone && touched.phone && (
//               <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
//             )}
//           </div>

//           {/* Password Section */}
//           {step !== 'phone' && (
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 {step === 'password'
//                   ? 'Password'
//                   : 'Create Password'}
//               </label>

//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onBlur={() => handleBlur('password')}
//                   placeholder={
//                     step === 'password'
//                       ? 'Enter your password'
//                       : 'Create a new password'
//                   }
//                   className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 >
//                   {showPassword ? '🙈' : '👁️'}
//                 </button>
//               </div>

//               {errors.password && touched.password && (
//                 <p className="mt-1 text-sm text-rose-600">
//                   {errors.password}
//                 </p>
//               )}
//             </div>
//           )}

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
//             {loginLoading
//               ? 'Processing...'
//               : step === 'phone'
//               ? 'Continue'
//               : step === 'password'
//               ? 'Sign in'
//               : 'Create Account'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectLoginLoading,
  selectLoginError,
} from '@/app/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function LoginPopup({ close, onLoginSuccess }) {
  const dispatch = useDispatch();
  const router   = useRouter();

  const loginLoading = useSelector(selectLoginLoading);
  const loginError   = useSelector(selectLoginError);

  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [step, setStep]         = useState('phone');

  const [errors,  setErrors]  = useState({ phone: '', otp: '', password: '' });
  const [touched, setTouched] = useState({ phone: false, otp: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const [firebaseLoading, setFirebaseLoading] = useState(false);
  const [firebaseError,   setFirebaseError]   = useState('');

  const confirmationResultRef = useRef(null);
  const firebaseTokenRef      = useRef(null);
  const recaptchaVerifierRef  = useRef(null);
  const otpRefs               = useRef([]);
  const timerRef              = useRef(null);
  const [resendTimer, setResendTimer] = useState(0);



useEffect(() => {
  return () => {
    clearInterval(timerRef.current);

    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  };
}, []);

  /* ─── Timer ─── */
  const startResendTimer = () => {
    setResendTimer(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* ─── Send OTP ─── */
const sendOtp = async () => {
  setFirebaseError('');
  setFirebaseLoading(true);

  try {
    // Clear old reCAPTCHA instance
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }

    // Clear old rendered reCAPTCHA HTML
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }

    // Create fresh reCAPTCHA
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );

    await recaptchaVerifierRef.current.render();

    const result = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      recaptchaVerifierRef.current
    );

    confirmationResultRef.current = result;

    setStep('otp');
    startResendTimer();

  } catch (err) {
    console.error('sendOtp error:', err);
    setFirebaseError(err.message);
  } finally {
    setFirebaseLoading(false);
  }
};

  /* ─── Verify OTP ─── */
  const verifyOtp = async () => {
    if (!confirmationResultRef.current) {
      setFirebaseError('Session expired. Please resend the OTP.');
      return;
    }
    setFirebaseError('');
    setFirebaseLoading(true);
    try {
      const credential = await confirmationResultRef.current.confirm(otp.join(''));
      const idToken    = await credential.user.getIdToken();
      firebaseTokenRef.current = idToken;

      const result = await dispatch(
        loginUser({ phoneNumber: phone, firebaseToken: idToken })
      );

      if (loginUser.fulfilled.match(result)) {
        if (result.payload?.hasPassword) {
          setStep('password');
        } else {
          setStep('createPassword');
        }
        setPassword('');
        setErrors({ phone: '', otp: '', password: '' });
        setTouched({ phone: false, otp: false, password: false });
      }
    } catch (err) {
      console.error('verifyOtp error:', err);
      setFirebaseError(
        err?.code === 'auth/invalid-verification-code'
          ? 'Incorrect OTP. Please try again.'
          : err?.code === 'auth/code-expired'
          ? 'OTP expired. Please resend.'
          : 'OTP verification failed. Please try again.'
      );
    } finally {
      setFirebaseLoading(false);
    }
  };

  /* ─── Validation ─── */
  const validatePhone    = (v) => !v ? 'Phone number is required' : !/^[6-9]\d{9}$/.test(v) ? 'Enter a valid 10-digit Indian mobile number' : '';
  const validateOtp      = (d) => d.join('').length < 6 ? 'Enter the 6-digit OTP' : '';
  const validatePassword = (v) => !v ? 'Password is required' : v.length < 6 ? 'Password must be at least 6 characters' : '';

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    if (field === 'phone')    setErrors((p) => ({ ...p, phone: validatePhone(phone) }));
    if (field === 'otp')      setErrors((p) => ({ ...p, otp: validateOtp(otp) }));
    if (field === 'password') setErrors((p) => ({ ...p, password: validatePassword(password) }));
  };

  /* ─── OTP input helpers ─── */
  const handleOtpChange = (i, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp]; next[i] = value; setOtp(next);
    if (value && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 'phone') {
      const err = validatePhone(phone);
      setErrors({ phone: err, otp: '', password: '' });
      setTouched({ phone: true, otp: false, password: false });
      if (err) return;
      await sendOtp();
      return;
    }

    if (step === 'otp') {
      const err = validateOtp(otp);
      setErrors((p) => ({ ...p, otp: err }));
      setTouched((p) => ({ ...p, otp: true }));
      if (err) return;
      await verifyOtp();
      return;
    }

    if (step === 'password' || step === 'createPassword') {
      const err = validatePassword(password);
      setErrors((p) => ({ ...p, password: err }));
      setTouched((p) => ({ ...p, password: true }));
      if (err) return;

      const result = await dispatch(
        loginUser({ phoneNumber: phone, password, firebaseToken: firebaseTokenRef.current })
      );

      if (loginUser.fulfilled.match(result)) {
        const userType = result.payload?.usertype;
        if (userType === 'admin' || userType === 'SHOP_OWNER') router.push('/admin');
        close();
        if (onLoginSuccess) onLoginSuccess();
      }
    }
  };

  /* ─── Resend OTP ─── */
  const handleResendOtp = async () => {
    if (resendTimer > 0 || firebaseLoading) return;
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    await sendOtp();
  };

  /* ─── Render ─── */
  const isLoading = loginLoading || firebaseLoading;

  const headerText  = { phone: 'Welcome', otp: 'Verify Your Number', password: 'Welcome back', createPassword: 'Create Your Account' }[step];
  const subText     = { phone: 'Enter your phone number to continue', otp: `OTP sent to +91 ${phone}`, password: 'Enter your password to sign in', createPassword: 'Set a password to create your account' }[step];
  const submitLabel = isLoading ? 'Processing...' : step === 'phone' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : step === 'password' ? 'Sign In' : 'Create Account';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-[100svh] px-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-800 mb-2">{headerText}</h2>
          <p className="text-slate-500 text-sm">{subText}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Phone ── */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                onBlur={() => handleBlur('phone')}
                placeholder="9876543210"
                maxLength={10}
                disabled={step !== 'phone'}
                className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100"
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
            )}
          </div>

          {/* ── OTP ── */}
          {step === 'otp' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Enter OTP</label>
              <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onBlur={() => handleBlur('otp')}
                    className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 outline-none"
                  />
                ))}
              </div>
              {errors.otp && touched.otp && (
                <p className="mt-1 text-sm text-rose-600">{errors.otp}</p>
              )}

              {/* Resend timer */}
              <div className="mt-3 text-sm text-slate-500 text-center">
                {resendTimer > 0 ? (
                  <span>Resend OTP in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-slate-700 font-medium underline underline-offset-2 hover:text-slate-900"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Change number */}
              <div className="mt-1 text-sm text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setErrors({ phone: '', otp: '', password: '' });
                    setFirebaseError('');
                    clearInterval(timerRef.current);
                    if (recaptchaVerifierRef.current) {
                      recaptchaVerifierRef.current.clear();
                      recaptchaVerifierRef.current = null;
                    }
                  }}
                  className="text-slate-500 hover:text-slate-700 underline underline-offset-2"
                >
                  Change number
                </button>
              </div>
            </div>
          )}

          {/* ── Password ── */}
          {(step === 'password' || step === 'createPassword') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {step === 'password' ? 'Password' : 'Create Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder={step === 'password' ? 'Enter your password' : 'Create a new password'}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
              )}
            </div>
          )}

          {/* ── Errors ── */}
          {firebaseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
              {firebaseError}
            </div>
          )}
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
              {loginError}
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {submitLabel}
          </button>

        </form>
      </div>

      {/* recaptcha-container: MUST be last in JSX, outside modal, above backdrop z-index */}
      <div id="recaptcha-container" className="relative z-[10000]" />

    </div>
  );
}