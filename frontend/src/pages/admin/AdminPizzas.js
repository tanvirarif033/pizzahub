import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminPizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm]     = useState({ name: '', category: '', price: '', image: null });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const res = await API.get('/pizzas');
      setPizzas(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPizzas(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = e => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const editPizza = (pizza) => {
    setForm({ name: pizza.name, category: pizza.category, price: pizza.price, image: null });
    setPreview(pizza.image || null);
    setEditId(pizza.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setForm({ name: '', category: '', price: '', image: null });
    setPreview(null);
    setEditId(null);
  };

  const deletePizza = async (id) => {
    if (!window.confirm('Delete this pizza?')) return;
    await API.delete(`/pizzas/${id}`);
    fetchPizzas();
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('price', form.price);
    if (form.image) data.append('image', form.image);
    try {
      if (editId) {
        await API.put(`/pizzas/${editId}`, data);
      } else {
        await API.post('/pizzas', data);
      }
      cancelEdit();
      fetchPizzas();
    } catch {
      alert('Error saving pizza ❌');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = pizzas.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-ap { font-family: 'Nunito', sans-serif; }

        .ph-ap-title {
          font-family: 'Bebas Neue', cursive; font-size: 44px;
          letter-spacing: 3px; color: #fff; line-height: 1;
          animation: fadeDown 0.4s ease both;
        }
        .ph-ap-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-ap-sub {
          color: #555; font-size: 12px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 24px;
        }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* FORM CARD */
        .ph-form-card {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 20px;
          padding: 24px; margin-bottom: 28px;
          animation: slideUp 0.4s ease both;
        }
        .ph-form-title {
          font-family: 'Bebas Neue', cursive; font-size: 22px;
          letter-spacing: 2px; color: #fff; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .ph-edit-indicator {
          background: rgba(255,80,0,0.12); border: 1px solid rgba(255,80,0,0.3);
          border-radius: 8px; color: #ff5000; font-family: 'Nunito', sans-serif;
          font-size: 11px; font-weight: 800; padding: 4px 10px; letter-spacing: 0.5px;
        }

        .ph-form-grid {
          display: grid; grid-template-columns: repeat(3, 1fr) auto;
          gap: 14px; align-items: end;
        }
        @media(max-width:768px){ .ph-form-grid{ grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .ph-form-grid{ grid-template-columns: 1fr; } }

        .ph-lbl {
          color: #666; font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 7px; display: block;
        }
        .ph-inp {
          width: 100%; background: #111 !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 11px !important; color: #fff !important;
          padding: 12px 16px !important; font-family: 'Nunito', sans-serif;
          font-size: 14px !important; font-weight: 700; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ph-inp:focus {
          border-color: #ff5000 !important; outline: none !important;
          box-shadow: 0 0 0 3px rgba(255,80,0,0.12) !important;
          background: #111 !important;
        }
        .ph-inp::placeholder { color: #3a3a3a !important; }

        .ph-file-label {
          display: flex; align-items: center; gap: 10px; background: #111;
          border: 1.5px dashed #2a2a2a; border-radius: 11px; padding: 12px 16px;
          cursor: pointer; transition: border-color 0.2s; color: #555;
          font-size: 13px; font-weight: 700;
        }
        .ph-file-label:hover { border-color: #ff5000; color: #ff5000; }
        .ph-file-input { display: none; }

        .ph-form-btns { display: flex; gap: 10px; }

        .ph-btn-submit {
          background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 11px; color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; padding: 12px 24px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 6px 20px rgba(255,80,0,0.3); white-space: nowrap;
        }
        .ph-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(255,80,0,0.4); }
        .ph-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .ph-btn-cancel {
          background: #111; border: 1.5px solid #2a2a2a; border-radius: 11px;
          color: #666; font-family: 'Nunito', sans-serif; font-size: 14px;
          font-weight: 800; padding: 12px 20px; cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .ph-btn-cancel:hover { border-color: #ff5000; color: #ff5000; }

        .ph-preview-box {
          margin-top: 18px; display: flex; align-items: center; gap: 14px;
        }
        .ph-preview-img {
          width: 90px; height: 90px; object-fit: cover;
          border-radius: 14px; border: 2px solid #2a2a2a;
        }
        .ph-preview-lbl { color: #555; font-size: 12px; font-weight: 700; }

        /* SEARCH */
        .ph-search-row { margin-bottom: 20px; animation: fadeDown 0.4s 0.1s ease both; }
        .ph-search-wrap { position: relative; max-width: 340px; }
        .ph-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #555; font-size: 15px; pointer-events: none;
        }
        .ph-search-inp {
          width: 100%; background: #1a1a1a !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 50px !important; color: #fff !important;
          padding: 11px 16px 11px 40px !important; font-family: 'Nunito', sans-serif;
          font-size: 14px !important; font-weight: 700;
          transition: border-color 0.2s;
        }
        .ph-search-inp:focus { border-color: #ff5000 !important; outline: none !important; background: #1a1a1a !important; }
        .ph-search-inp::placeholder { color: #3a3a3a !important; }

        /* PIZZA GRID */
        .ph-pizza-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 18px; animation: slideUp 0.4s 0.1s ease both;
        }
        @media(max-width:900px){ .ph-pizza-grid{ grid-template-columns: repeat(2,1fr); } }
        @media(max-width:540px){ .ph-pizza-grid{ grid-template-columns: 1fr; } }

        .ph-pizza-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 18px;
          overflow: hidden; transition: border-color 0.2s, transform 0.2s;
        }
        .ph-pizza-card:hover { border-color: rgba(255,80,0,0.25); transform: translateY(-3px); }

        .ph-pizza-img {
          width: 100%; height: 180px; object-fit: cover;
          display: block;
        }
        .ph-pizza-img-fb {
          width: 100%; height: 180px; background: #222;
          display: flex; align-items: center; justify-content: center; font-size: 56px;
        }

        .ph-pizza-body { padding: 16px; }
        .ph-pizza-cat {
          color: #ff5000; font-size: 11px; font-weight: 800;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px;
        }
        .ph-pizza-name { color: #fff; font-size: 16px; font-weight: 900; margin-bottom: 8px; }
        .ph-pizza-price {
          font-family: 'Bebas Neue', cursive; font-size: 22px;
          letter-spacing: 1px; color: #ff8c00;
        }

        .ph-pizza-btns { display: flex; gap: 8px; margin-top: 14px; }

        .ph-btn-edit {
          flex: 1; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25);
          border-radius: 10px; color: #3b82f6; font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; padding: 9px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s; letter-spacing: 0.3px;
        }
        .ph-btn-edit:hover { background: rgba(59,130,246,0.2); border-color: rgba(59,130,246,0.5); }

        .ph-btn-del {
          flex: 1; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px; color: #ef4444; font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; padding: 9px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s; letter-spacing: 0.3px;
        }
        .ph-btn-del:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }

        .ph-loading {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; padding: 60px; color: #555; font-weight: 700;
        }
        .ph-spin {
          width: 32px; height: 32px; border: 3px solid #222;
          border-top-color: #ff5000; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }

        .ph-spinner-sm {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
      `}</style>

      <div className="ph-ap">
        <div className="ph-ap-title">Manage <span>Pizzas</span></div>
        <div className="ph-ap-sub">{pizzas.length} pizzas on the menu</div>

        {/* FORM */}
        <div className="ph-form-card">
          <div className="ph-form-title">
            {editId ? '✏️ Edit Pizza' : '➕ Add New Pizza'}
            {editId && <span className="ph-edit-indicator">EDITING</span>}
          </div>

          <form onSubmit={submit}>
            <div className="ph-form-grid">
              <div>
                <label className="ph-lbl">Pizza Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Margherita" className="ph-inp form-control" required />
              </div>
              <div>
                <label className="ph-lbl">Category</label>
                <input name="category" value={form.category} onChange={handleChange}
                  placeholder="e.g. Veg / Non-Veg" className="ph-inp form-control" required />
              </div>
              <div>
                <label className="ph-lbl">Price (Tk)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange}
                  placeholder="e.g. 350" className="ph-inp form-control" required />
              </div>
              <div>
                <label className="ph-lbl">Image</label>
                <label className="ph-file-label">
                  📷 {form.image ? form.image.name : 'Choose image'}
                  <input type="file" className="ph-file-input" onChange={handleImage} accept="image/*" />
                </label>
              </div>
            </div>

            {preview && (
              <div className="ph-preview-box">
                <img src={preview} alt="preview" className="ph-preview-img" />
                <div className="ph-preview-lbl">Image Preview</div>
              </div>
            )}

            <div className="ph-form-btns" style={{ marginTop: 18 }}>
              <button type="submit" className="ph-btn-submit" disabled={submitting}>
                {submitting ? <><span className="ph-spinner-sm"></span>Saving...</> : editId ? '✏️ Update Pizza' : '🍕 Add Pizza'}
              </button>
              {editId && (
                <button type="button" className="ph-btn-cancel" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* SEARCH */}
        <div className="ph-search-row">
          <div className="ph-search-wrap">
            <span className="ph-search-icon">🔍</span>
            <input className="ph-search-inp form-control" placeholder="Search pizzas..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="ph-loading"><div className="ph-spin"></div> Loading pizzas...</div>
        )}

        {/* GRID */}
        {!loading && (
          <div className="ph-pizza-grid">
            {filtered.map((p, i) => (
              <div key={p.id} className="ph-pizza-card" style={{ animationDelay: `${i * 0.05}s` }}>
                {p.image
                  ? <img src={p.image} alt={p.name} className="ph-pizza-img" />
                  : <div className="ph-pizza-img-fb">🍕</div>}

                <div className="ph-pizza-body">
                  <div className="ph-pizza-cat">{p.category}</div>
                  <div className="ph-pizza-name">{p.name}</div>
                  <div className="ph-pizza-price">{p.price} Tk</div>
                  <div className="ph-pizza-btns">
                    <button className="ph-btn-edit" onClick={() => editPizza(p)}>✏️ Edit</button>
                    <button className="ph-btn-del" onClick={() => deletePizza(p.id)}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPizzas;