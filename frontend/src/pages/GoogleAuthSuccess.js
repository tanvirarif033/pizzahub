import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Signing you in with Google...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userRaw = params.get('user');

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setStatus('Login successful! Redirecting...');

        // Small delay so user sees success message
        setTimeout(() => {
          if (user.role === 'admin') {
            // Hard redirect — forces full app re-render so auth context reloads
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        }, 800);

      } catch (e) {
        setStatus('Something went wrong. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      }
    } else {
      setStatus('No credentials found. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    }
  }, [navigate]);

  const isSuccess = status.startsWith('Login');
  const isError = status.startsWith('No') || status.startsWith('Something');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pizzaSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .gas-root {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          padding: 24px;
        }

        .gas-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 24px;
          padding: 52px 48px;
          text-align: center;
          max-width: 380px;
          width: 100%;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: fadeIn 0.4s ease both;
        }

        .gas-pizza {
          font-size: 56px;
          display: block;
          margin-bottom: 20px;
          animation: pizzaSpin 4s linear infinite;
        }

        .gas-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .gas-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(255,80,0,0.2);
          border-top-color: #ff5000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .gas-check {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #ff5000, #ff2200);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
          animation: checkPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          box-shadow: 0 8px 24px rgba(255,80,0,0.4);
        }

        .gas-title {
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .gas-sub {
          color: #555;
          font-size: 14px;
          font-weight: 600;
        }

        .gas-error-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }
      `}</style>

      <div className="gas-root">
        <div className="gas-card">
          {isError ? (
            <>
              <span className="gas-error-icon">⚠️</span>
              <div className="gas-title" style={{ color: '#ff6b6b' }}>Login Failed</div>
              <div className="gas-sub">{status}</div>
            </>
          ) : isSuccess ? (
            <>
              <div className="gas-check">✓</div>
              <div className="gas-title">Welcome to PizzaHub!</div>
              <div className="gas-sub">Taking you home...</div>
            </>
          ) : (
            <>
              <span className="gas-pizza">🍕</span>
              <div className="gas-spinner-wrap">
                <div className="gas-spinner" />
              </div>
              <div className="gas-title">Almost there...</div>
              <div className="gas-sub">{status}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GoogleAuthSuccess;