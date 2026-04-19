import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
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
          margin-bottom: 32px;
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

        .ph-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
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
          margin-bottom: 18px;
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

        .ph-perks {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .ph-perk-chip {
          background: rgba(255,80,0,0.1);
          border: 1px solid rgba(255,80,0,0.2);
          border-radius: 20px;
          color: #ff8c00;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          letter-spacing: 0.3px;
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
          margin-top: 24px;
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
            <div className="ph-logo-tagline">Join the slice of life</div>
          </div>

          <div className="ph-perks">
            <span className="ph-perk-chip">🎁 Free first delivery</span>
            <span className="ph-perk-chip">⚡ 30-min guarantee</span>
            <span className="ph-perk-chip">🏆 Rewards points</span>
          </div>

          <div className="ph-divider">
            <div className="ph-divider-line"></div>
            <div className="ph-divider-text">Create Account</div>
            <div className="ph-divider-line"></div>
          </div>

          {error && <div className="ph-error">⚠️ {error}</div>}

          <form onSubmit={submit}>
            <label className="ph-label">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="ph-input form-control"
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />

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
              placeholder="Min. 8 characters"
              className="ph-input form-control"
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />

            <button className="ph-btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <><span className="ph-spinner"></span>Creating account...</>
              ) : (
                '🍕 Create My Account'
              )}
            </button>
          </form>

          <div className="ph-footer-text">
            Already have an account? <Link to="/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;