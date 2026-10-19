import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode, email, password) {
  const errors = {};
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (mode === 'signup') {
    if (password.length < 10) errors.password = 'Use at least 10 characters.';
    else if (password.length > 128) errors.password = 'Use at most 128 characters.';
  } else if (!password) {
    errors.password = 'Enter your password.';
  }
  return errors;
}

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { status, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (status === 'authenticated' && !done) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const errors = validate(mode, email, password);
    setFieldErrors(errors);
    setFormError('');
    if (errors.email) return emailRef.current.focus();
    if (errors.password) return passwordRef.current.focus();

    setSubmitting(true);
    try {
      await (isSignup ? signUp : signIn)(email.trim(), password);
      setDone(true);
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
    }
  }

  const inputClass = (hasError) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 ${
      hasError ? 'border-red-500' : 'border-slate-300'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <main className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">myStorage</h1>
        <h2 className="mt-1 text-sm text-slate-600">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h2>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4" aria-busy={submitting}>
          {formError && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              autoComplete="email"
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={inputClass(fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              ref={passwordRef}
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby={`${isSignup ? 'password-hint ' : ''}${fieldErrors.password ? 'password-error' : ''}`.trim() || undefined}
              className={inputClass(fieldErrors.password)}
            />
            {isSignup && (
              <p id="password-hint" className="mt-1 text-xs text-slate-500">At least 10 characters.</p>
            )}
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? isSignup ? 'Creating account…' : 'Signing in…'
              : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {isSignup ? (
            <>Already have an account? <Link to="/login" className="font-medium text-slate-900 underline">Sign in</Link></>
          ) : (
            <>No account yet? <Link to="/signup" className="font-medium text-slate-900 underline">Sign up</Link></>
          )}
        </p>
      </main>
    </div>
  );
}
