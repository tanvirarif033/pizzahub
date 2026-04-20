// pages/Profile.js

import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

// ─────────────────────────────────────────────────────────────────
// HELPER: keep localStorage 'user' in sync with the latest data
// so profilePic survives page refresh / navigation
// ─────────────────────────────────────────────────────────────────
const syncUserToStorage = (updatedUser) => {
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const merged = { ...stored, ...updatedUser };
  localStorage.setItem('user', JSON.stringify(merged));
};

const Profile = () => {
  const [user, setUser]         = useState({});
  const [name, setName]         = useState('');
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ── LOAD PROFILE ──────────────────────────────────────────────
  useEffect(() => {
    // ✅ FIX A: Seed from localStorage first so the avatar
    //    appears instantly even before the API responds
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    if (stored.name) { setUser(stored); setName(stored.name); }

    // Then fetch fresh data from the server
    API.get('/users/me')
      .then(res => {
        setUser(res.data);
        setName(res.data.name || '');
        // ✅ FIX B: Keep localStorage up-to-date with the DB version
        syncUserToStorage(res.data);
      })
      .catch(() => toast.error('Failed to load profile ❌'));
  }, []);

  // ── UPDATE NAME ───────────────────────────────────────────────
  const update = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setUpdating(true);
    try {
      const res = await API.put('/users/me', { name });

      // ✅ FIX C: Backend now returns the full updated user object.
      //    Sync it to state AND localStorage so refresh keeps the name.
      const updated = res.data.user;
      setUser(updated);
      setName(updated.name);
      syncUserToStorage(updated);

      toast.success('Profile updated ✅');
    } catch {
      toast.error('Update failed ❌');
    } finally {
      setUpdating(false);
    }
  };

  // ── SELECT IMAGE ──────────────────────────────────────────────
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ── UPLOAD PHOTO ──────────────────────────────────────────────
  const upload = async () => {
    if (!file) { toast.error('Please select an image first'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.put('/users/me/photo', formData);

      // ✅ FIX D: Backend returns res.data.user (the full updated row).
      //    Save profilePic into state AND localStorage — this is the
      //    key fix that makes the picture survive refresh/navigation.
      const updated = res.data.user;
      setUser(updated);
      syncUserToStorage(updated);   // ← persists profilePic to localStorage

      setPreview(null);             // clear preview — real URL is now shown
      setFile(null);

      toast.success('Photo updated ✅');
    } catch {
      toast.error('Upload failed ❌');
    } finally {
      setUploading(false);
    }
  };

  const initials = (name || user.name || 'U').charAt(0).toUpperCase();
  const avatarSrc = preview || user.profilePic || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-profile { font-family: 'Nunito', sans-serif; }

        .ph-profile-header { margin-bottom: 32px; animation: fadeDown 0.4s ease both; }
        .ph-profile-title {
          font-family: 'Bebas Neue', cursive; font-size: 48px;
          letter-spacing: 3px; color: #fff; line-height: 1;
        }
        .ph-profile-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-profile-sub { color: #555; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .ph-profile-layout {
          display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start;
        }
        @media(max-width:768px){ .ph-profile-layout{ grid-template-columns: 1fr; } }

        /* AVATAR CARD */
        .ph-avatar-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 24px;
          padding: 32px 24px; text-align: center;
          animation: slideUp 0.4s ease both;
        }
        .ph-avatar-wrap {
          position: relative; display: inline-block; margin-bottom: 16px;
        }
        .ph-avatar {
          width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
          border: 3px solid #ff5000; box-shadow: 0 0 0 4px rgba(255,80,0,0.15);
          display: block;
        }
        .ph-avatar-initials {
          width: 120px; height: 120px; border-radius: 50%;
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', cursive; font-size: 52px; color: #fff; letter-spacing: 2px;
          box-shadow: 0 0 0 4px rgba(255,80,0,0.15);
        }
        .ph-avatar-edit-label {
          position: absolute; bottom: 4px; right: 4px;
          background: #ff5000; border: 2px solid #0f0f0f;
          border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer; transition: background 0.15s;
        }
        .ph-avatar-edit-label:hover { background: #ff2200; }
        .ph-avatar-file-input { display: none; }

        .ph-avatar-name  { color: #fff; font-size: 20px; font-weight: 900; margin-bottom: 4px; }
        .ph-avatar-email { color: #555; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
        .ph-avatar-role {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,80,0,0.1); border: 1px solid rgba(255,80,0,0.25);
          border-radius: 50px; color: #ff8c00; font-size: 12px; font-weight: 800;
          letter-spacing: 0.5px; padding: 6px 16px; text-transform: uppercase; margin-bottom: 20px;
        }

        .ph-preview-new {
          margin-top: 12px; padding: 10px; background: rgba(255,80,0,0.05);
          border: 1px dashed rgba(255,80,0,0.3); border-radius: 12px; text-align: left;
        }
        .ph-preview-new-lbl { color: #ff8c00; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .ph-preview-new-img { width: 64px; height: 64px; object-fit: cover; border-radius: 10px; }
        .ph-preview-new-name { color: #888; font-size: 12px; font-weight: 700; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ph-upload-btn {
          width: 100%; background: rgba(255,80,0,0.1); border: 1.5px solid rgba(255,80,0,0.25);
          border-radius: 12px; color: #ff8c00; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
          padding: 12px; transition: background 0.15s, border-color 0.15s; margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ph-upload-btn:hover:not(:disabled) { background: rgba(255,80,0,0.18); border-color: rgba(255,80,0,0.45); }
        .ph-upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* INFO CARD */
        .ph-info-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 24px;
          padding: 28px; animation: slideUp 0.45s ease both;
        }
        .ph-info-section-title {
          font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 2px;
          color: #fff; margin-bottom: 20px; padding-bottom: 14px;
          border-bottom: 1px solid #222;
        }
        .ph-lbl {
          color: #666; font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 7px; display: block;
        }
        .ph-inp {
          width: 100%; background: #111 !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 12px !important; color: #fff !important;
          font-family: 'Nunito', sans-serif; font-size: 15px !important; font-weight: 700;
          padding: 13px 16px !important; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 20px;
        }
        .ph-inp:focus { border-color: #ff5000 !important; box-shadow: 0 0 0 3px rgba(255,80,0,0.12) !important; background: #111 !important; }
        .ph-inp::placeholder { color: #3a3a3a !important; }
        .ph-inp:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }

        .ph-save-btn {
          width: 100%; background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 12px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          padding: 14px; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 6px 20px rgba(255,80,0,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ph-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(255,80,0,0.4); }
        .ph-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ph-info-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .ph-info-pill {
          background: rgba(255,255,255,0.03); border: 1px solid #222;
          border-radius: 12px; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px; flex: 1; min-width: 140px;
        }
        .ph-pill-icon { font-size: 20px; flex-shrink: 0; }
        .ph-pill-lbl  { color: #555; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .ph-pill-val  { color: #ccc; font-size: 14px; font-weight: 800; }

        .ph-spinner-sm {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }
      `}</style>

      <div className="ph-profile">
        <div className="ph-profile-header">
          <div className="ph-profile-title">My <span>Profile</span></div>
          <div className="ph-profile-sub">Manage your account details</div>
        </div>

        <div className="ph-profile-layout">

          {/* ── AVATAR CARD ── */}
          <div className="ph-avatar-card">
            <div className="ph-avatar-wrap">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="ph-avatar" />
              ) : (
                <div className="ph-avatar-initials">{initials}</div>
              )}
              <label className="ph-avatar-edit-label" title="Change photo">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="ph-avatar-file-input"
                  onChange={handleFile}
                />
              </label>
            </div>

            <div className="ph-avatar-name">{user.name  || 'Your Name'}</div>
            <div className="ph-avatar-email">{user.email || 'your@email.com'}</div>
            <div className="ph-avatar-role">
              {user.role === 'admin' ? '🛡 Admin' : '🍕 Member'}
            </div>

            {preview && file && (
              <div className="ph-preview-new">
                <div className="ph-preview-new-lbl">New Photo Preview</div>
                <img src={preview} alt="preview" className="ph-preview-new-img" />
                <div className="ph-preview-new-name">{file.name}</div>
              </div>
            )}

            <button
              className="ph-upload-btn"
              onClick={upload}
              disabled={uploading || !file}
            >
              {uploading
                ? <><span className="ph-spinner-sm"></span> Uploading...</>
                : '📸 Upload New Photo'}
            </button>
          </div>

          {/* ── INFO CARD ── */}
          <div className="ph-info-card">
            <div className="ph-info-section-title">Account Information</div>

            <label className="ph-lbl">Full Name</label>
            <input
              className="ph-inp form-control"
              value={name}
              placeholder="Your full name"
              onChange={e => setName(e.target.value)}
            />

            <label className="ph-lbl">Email Address</label>
            <input
              className="ph-inp form-control"
              value={user.email || ''}
              disabled
            />

            <label className="ph-lbl">Account Role</label>
            <input
              className="ph-inp form-control"
              value={user.role === 'admin' ? '🛡 Admin' : '🍕 Member'}
              disabled
            />

            <button
              className="ph-save-btn"
              onClick={update}
              disabled={updating}
            >
              {updating
                ? <><span className="ph-spinner-sm"></span> Saving...</>
                : '✅ Save Changes'}
            </button>

            <div className="ph-info-pills">
              <div className="ph-info-pill">
                <span className="ph-pill-icon">📧</span>
                <div>
                  <div className="ph-pill-lbl">Email</div>
                  <div className="ph-pill-val" style={{ fontSize: 12, wordBreak: 'break-all' }}>
                    {user.email || '—'}
                  </div>
                </div>
              </div>
              <div className="ph-info-pill">
                <span className="ph-pill-icon">🔑</span>
                <div>
                  <div className="ph-pill-lbl">Role</div>
                  <div className="ph-pill-val">{user.role || 'user'}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;