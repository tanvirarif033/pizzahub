import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap');

        .ph-auth-root {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          padding: 24px 16px;
          position: relative;
          overflow: hidden;
        }

        .ph-auth-root::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,80,0,0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ph-auth-root::after {
          content: '';
          position: fixed;
          bottom: -200px;
          left: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(200,0,0,0.1) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ph-auth-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 24px;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
          animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ph-logo-block {
          text-align: center;
          margin-bottom: 36px;
        }

        .ph-logo-icon {
          font-size: 52px;
          line-height: 1;
          margin-bottom: 10px;
          display: block;
          animation: pizzaSpin 8s linear infinite;
        }

        @keyframes pizzaSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ph-logo-name {
          font-family: 'Bebas Neue', cursive;
          font-size: 40px;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #ff5000, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 4px;
        }

        .ph-logo-tagline {
          color: #555;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ── Google Button ── */
        .ph-btn-google {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 12px;
          color: #1f1f1f;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 13px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          margin-bottom: 0;
        }

        .ph-btn-google:hover {
          background: #f5f5f5;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }

        .ph-btn-google:active {
          transform: translateY(0);
        }

        .ph-google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ── Divider ── */
        .ph-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
        }

        .ph-divider-line {
          flex: 1;
          height: 1px;
          background: #2a2a2a;
        }

        .ph-divider-text {
          color: #444;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ph-label {
          color: #888;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .ph-input {
          width: 100%;
          background: #111 !important;
          border: 1.5px solid #2a2a2a !important;
          border-radius: 12px !important;
          color: #fff !important;
          padding: 14px 18px !important;
          font-family: 'Nunito', sans-serif;
          font-size: 15px !important;
          font-weight: 600;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 20px;
        }

        .ph-input:focus {
          border-color: #ff5000 !important;
          box-shadow: 0 0 0 3px rgba(255,80,0,0.15) !important;
          outline: none !important;
          background: #111 !important;
        }

        .ph-input::placeholder {
          color: #444 !important;
        }

        .ph-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #ff5000, #ff2200);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 15px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 8px 24px rgba(255,80,0,0.3);
          margin-top: 4px;
        }

        .ph-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,80,0,0.45);
        }

        .ph-btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .ph-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ph-error {
          background: rgba(255, 50, 50, 0.1);
          border: 1px solid rgba(255, 50, 50, 0.25);
          border-radius: 10px;
          color: #ff6b6b;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 16px;
          margin-bottom: 20px;
          text-align: center;
        }

        .ph-footer-text {
          text-align: center;
          color: #555;
          font-size: 14px;
          font-weight: 600;
          margin-top: 28px;
        }

        .ph-footer-text a {
          color: #ff5000;
          text-decoration: none;
          font-weight: 700;
          transition: color 0.2s;
        }

        .ph-footer-text a:hover {
          color: #ff8c00;
        }

        .ph-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="ph-auth-root">
        <div className="ph-auth-card">
          <div className="ph-logo-block">
            <span className="ph-logo-icon">🍕</span>
            <div className="ph-logo-name">PizzaHub</div>
            <div className="ph-logo-tagline">Hot. Fresh. Delivered.</div>
          </div>

          {/* ── Google Sign-In Button ── */}
          <button className="ph-btn-google" onClick={handleGoogleLogin} type="button">
            <svg className="ph-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="ph-divider">
            <div className="ph-divider-line"></div>
            <div className="ph-divider-text">or sign in with email</div>
            <div className="ph-divider-line"></div>
          </div>

          {error && <div className="ph-error">⚠️ {error}</div>}

          <form onSubmit={submit}>
            <label className="ph-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="ph-input form-control"
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            <label className="ph-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="ph-input form-control"
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />

            <button className="ph-btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <><span className="ph-spinner"></span>Signing in...</>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="ph-footer-text">
            New to PizzaHub? <Link to="/register">Create account →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;