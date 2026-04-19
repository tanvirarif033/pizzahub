import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}`, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch {
      alert('Role update failed ❌');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const admins = users.filter(u => u.role === 'admin').length;
  const members = users.filter(u => u.role === 'user').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-au { font-family: 'Nunito', sans-serif; }

        .ph-au-title {
          font-family: 'Bebas Neue', cursive; font-size: 44px;
          letter-spacing: 3px; color: #fff; line-height: 1;
          animation: fadeDown 0.4s ease both;
        }
        .ph-au-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-au-sub {
          color: #555; font-size: 12px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 24px;
        }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* STAT ROW */
        .ph-au-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 14px; margin-bottom: 24px;
          animation: slideUp 0.4s ease both;
        }
        .ph-au-stat {
          background: #1a1a1a; border: 1px solid #222; border-radius: 16px;
          padding: 18px 16px; text-align: center;
          transition: border-color 0.2s;
        }
        .ph-au-stat:hover { border-color: rgba(255,80,0,0.25); }
        .ph-au-stat-val {
          font-family: 'Bebas Neue', cursive; font-size: 32px; letter-spacing: 1px; line-height: 1;
        }
        .ph-au-stat-lbl { color: #555; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
        .s-total .ph-au-stat-val { background: linear-gradient(135deg,#ff5000,#ff8c00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .s-admin .ph-au-stat-val { color: #a855f7; }
        .s-member .ph-au-stat-val { color: #22c55e; }

        /* TOOLBAR */
        .ph-au-toolbar {
          display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
          animation: fadeDown 0.4s 0.05s ease both;
        }
        .ph-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 320px; }
        .ph-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #555; font-size: 14px; pointer-events: none; }
        .ph-search-inp {
          width: 100%; background: #1a1a1a !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 50px !important; color: #fff !important;
          padding: 11px 16px 11px 40px !important; font-family: 'Nunito', sans-serif;
          font-size: 14px !important; font-weight: 700; transition: border-color 0.2s;
        }
        .ph-search-inp:focus { border-color: #ff5000 !important; outline: none !important; background: #1a1a1a !important; }
        .ph-search-inp::placeholder { color: #3a3a3a !important; }

        .ph-filter-row { display: flex; gap: 8px; }
        .ph-filter-btn {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 50px;
          color: #555; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: 0.5px;
          padding: 8px 18px; transition: all 0.15s; text-transform: uppercase;
        }
        .ph-filter-btn:hover { border-color: #ff5000; color: #ff5000; }
        .ph-filter-btn.active {
          background: linear-gradient(135deg,#ff5000,#ff2200); color: #fff;
          border-color: transparent; box-shadow: 0 4px 14px rgba(255,80,0,0.3);
        }

        /* USER CARD */
        .ph-user-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 18px;
          padding: 18px 20px; margin-bottom: 14px;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          transition: border-color 0.2s, transform 0.2s;
          animation: slideUp 0.35s ease both;
        }
        .ph-user-card:hover { border-color: rgba(255,80,0,0.2); transform: translateX(4px); }

        .ph-user-avatar {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 1px;
          background: linear-gradient(135deg,#ff5000,#ff8c00); color: #fff;
        }

        .ph-user-info { flex: 1; min-width: 0; }
        .ph-user-name { color: #fff; font-size: 16px; font-weight: 900; margin-bottom: 2px; }
        .ph-user-email { color: #555; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ph-user-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }

        .ph-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 50px; padding: 6px 14px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .rb-admin  { color: #a855f7; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); }
        .rb-user   { color: #22c55e; background: rgba(34,197,94,0.12);   border: 1px solid rgba(34,197,94,0.3); }

        .ph-role-select {
          background: #111 !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 10px !important; color: #fff !important;
          font-family: 'Nunito', sans-serif; font-size: 12px !important; font-weight: 800 !important;
          padding: 8px 14px !important; cursor: pointer; outline: none;
          transition: border-color 0.2s; letter-spacing: 0.5px;
        }
        .ph-role-select:focus { border-color: #ff5000 !important; }

        .ph-loading {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; padding: 80px; color: #555; font-weight: 700;
        }
        .ph-spin {
          width: 32px; height: 32px; border: 3px solid #222;
          border-top-color: #ff5000; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }

        .ph-empty {
          text-align: center; padding: 60px 20px;
        }
        .ph-empty-emoji { font-size: 60px; display: block; opacity: 0.4; margin-bottom: 14px; }
        .ph-empty-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 2px; color: #fff; }
        .ph-empty-sub   { color: #555; font-size: 14px; font-weight: 600; margin-top: 6px; }
      `}</style>

      <div className="ph-au">
        <div className="ph-au-title">Manage <span>Users</span></div>
        <div className="ph-au-sub">{users.length} registered accounts</div>

        {/* STATS */}
        <div className="ph-au-stats">
          <div className="ph-au-stat s-total">
            <div className="ph-au-stat-val">{users.length}</div>
            <div className="ph-au-stat-lbl">Total Users</div>
          </div>
          <div className="ph-au-stat s-admin">
            <div className="ph-au-stat-val">{admins}</div>
            <div className="ph-au-stat-lbl">Admins</div>
          </div>
          <div className="ph-au-stat s-member">
            <div className="ph-au-stat-val">{members}</div>
            <div className="ph-au-stat-lbl">Members</div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="ph-au-toolbar">
          <div className="ph-search-wrap">
            <span className="ph-search-icon">🔍</span>
            <input className="ph-search-inp form-control" placeholder="Search users..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ph-filter-row">
            {['all', 'admin', 'user'].map(f => (
              <button key={f} className={`ph-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}>
                {f === 'all' ? '👥 All' : f === 'admin' ? '🛡 Admin' : '👤 Members'}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="ph-loading"><div className="ph-spin"></div> Loading users...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="ph-empty">
            <span className="ph-empty-emoji">👥</span>
            <div className="ph-empty-title">No users found</div>
            <div className="ph-empty-sub">Try a different search or filter</div>
          </div>
        )}

        {!loading && filtered.map((u, i) => (
          <div key={u.id} className="ph-user-card" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="ph-user-avatar">
              {(u.name || '?').charAt(0).toUpperCase()}
            </div>

            <div className="ph-user-info">
              <div className="ph-user-name">{u.name || 'Unknown'}</div>
              <div className="ph-user-email">{u.email}</div>
            </div>

            <div className="ph-user-right">
              <span className={`ph-role-badge ${u.role === 'admin' ? 'rb-admin' : 'rb-user'}`}>
                {u.role === 'admin' ? '🛡 Admin' : '👤 Member'}
              </span>
              <select className="ph-role-select" value={u.role}
                onChange={e => changeRole(u.id, e.target.value)}>
                <option value="user">👤 Member</option>
                <option value="admin">🛡 Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminUsers;