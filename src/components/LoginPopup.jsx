'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectLoginLoading,
  selectLoginError,
} from '@/app/features/auth/authSlice';

export default function LoginPopup({ close }) {
  const dispatch = useDispatch();

  const loginLoading = useSelector(selectLoginLoading);
  const loginError = useSelector(selectLoginError);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [touched, setTouched] = useState({ phone: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  /* ================= VALIDATION ================= */

  const validatePhone = (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value))
      return 'Please enter a valid 10-digit Indian mobile number';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6)
      return 'Password must be at least 6 characters';
    return '';
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === 'phone'
          ? validatePhone(phone)
          : validatePassword(password),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);

    setErrors({ phone: phoneError, password: passwordError });
    setTouched({ phone: true, password: true });

    if (phoneError || passwordError) return;

    const result = await dispatch(
      loginUser({
        phoneNumber: phone,
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-[100svh] px-4">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        
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
          <h2 className="text-3xl font-semibold text-slate-800 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-500 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="9876543210"
                maxLength={10}
                className="w-full pl-16 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none"
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

          {/* API Error */}
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
              {loginError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              loginLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {loginLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
