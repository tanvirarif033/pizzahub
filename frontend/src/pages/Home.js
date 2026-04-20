import { useEffect, useState } from 'react';
import API from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/';

const getImage = (img) => {
  if (!img) return 'https://placehold.co/400x300/1a1a1a/555?text=🍕';
  if (img.startsWith('http')) return img;
  return BASE_URL + img;
};

const Home = () => {
  const [pizzas, setPizzas]         = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [trending, setTrending]     = useState([]);
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('');
  const [category, setCategory]     = useState('');
  const [loading, setLoading]       = useState(true);

  const { add, remove, isInWishlist } = useWishlist();
  const { cart, setCart }             = useCart();

  const toggleWishlist = async (pizza) => {
    try {
      if (isInWishlist(pizza.id)) {
        await remove(pizza.id);
        toast.error('Removed from wishlist 💔');
      } else {
        await add(pizza);
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/pizzas');
        setPizzas(res.data);
        setFiltered(res.data);
        setRecommended(res.data.slice(0, 5));
        setMostOrdered(res.data.slice(2, 7));
        setTrending(res.data.slice(4, 9));
      } catch {
        toast.error('Failed to load pizzas ❌');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...pizzas];
    if (search) data = data.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (category === 'Veg')     data = data.filter(p =>  p.category?.toLowerCase().includes('veg'));
    if (category === 'Non-Veg') data = data.filter(p => !p.category?.toLowerCase().includes('veg'));
    if (sort === 'low')  data.sort((a, b) => a.price - b.price);
    if (sort === 'high') data.sort((a, b) => b.price - a.price);
    setFiltered(data);
  }, [search, sort, category, pizzas]);

  const addToCart = (pizza) => {
    const existing = cart.find(i => i.id === pizza.id);
    let updated;
    if (existing) {
      updated = cart.map(i => i.id === pizza.id ? { ...i, quantity: i.quantity + 1 } : i);
      toast.info(`${pizza.name} quantity updated 🛒`);
    } else {
      updated = [...cart, { ...pizza, quantity: 1 }];
      toast.success(`${pizza.name} added to cart 🛒`);
    }
    setCart(updated);
  };

  const PizzaCard = (p) => (
    <div className="ph-pizza-col" key={p.id}>
      <div className="ph-pizza-card">
        <div className="ph-card-img-wrap">
          <img src={getImage(p.image)} className="ph-card-img" alt={p.name} />
          <button className={`ph-wish-btn ${isInWishlist(p.id) ? 'active' : ''}`}
            onClick={() => toggleWishlist(p)}>
            {isInWishlist(p.id) ? '❤️' : '🤍'}
          </button>
          <div className="ph-card-cat-tag">{p.category || 'Pizza'}</div>
        </div>

        <div className="ph-card-body">
          <div className="ph-card-name">{p.name}</div>
          <div className="ph-card-price">{p.price} <span>Tk</span></div>
          <button className="ph-add-btn" onClick={() => addToCart(p)}>
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, data }) => (
    <div className="ph-section">
      <div className="ph-section-title">{title}</div>
      {data.length === 0
        ? <div className="ph-no-results">No pizzas found 😢</div>
        : <div className="ph-pizza-grid">{data.map(PizzaCard)}</div>
      }
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        /* ── HERO ── */
        .ph-hero {
          position: relative; border-radius: 24px; overflow: hidden;
          margin-bottom: 40px; padding: 64px 40px; text-align: center;
          background: linear-gradient(135deg, #1a0a00 0%, #3d1200 50%, #1a0a00 100%);
          border: 1px solid #2a1000;
          animation: fadeDown 0.5s ease both;
        }
        .ph-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,80,0,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .ph-hero-emoji {
          font-size: 72px; display: block; line-height: 1; margin-bottom: 16px;
          animation: pizzaSpin 10s linear infinite;
        }
        @keyframes pizzaSpin { to { transform: rotate(360deg); } }
        .ph-hero-title {
          font-family: 'Bebas Neue', cursive; font-size: clamp(48px,8vw,90px);
          letter-spacing: 4px; color: #fff; line-height: 1; margin-bottom: 12px;
          position: relative; z-index: 1;
        }
        .ph-hero-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-hero-sub {
          color: #888; font-size: 16px; font-weight: 700;
          letter-spacing: 0.5px; margin-bottom: 28px; position: relative; z-index: 1;
        }
        .ph-hero-chips {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 28px; position: relative; z-index: 1;
        }
        .ph-hero-chip {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px; color: #aaa; font-size: 13px; font-weight: 700; padding: 8px 18px;
        }
        .ph-hero-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 50px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 900;
          padding: 14px 36px; text-decoration: none;
          box-shadow: 0 10px 30px rgba(255,80,0,0.4);
          transition: transform 0.15s, box-shadow 0.15s; position: relative; z-index: 1;
        }
        .ph-hero-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(255,80,0,0.55); color: #fff; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* ── FILTER BAR ── */
        .ph-filter-bar {
          display: grid; grid-template-columns: 1fr auto auto;
          gap: 12px; margin-bottom: 36px; align-items: center;
          animation: slideUp 0.4s 0.1s ease both;
        }
        @media(max-width:640px){ .ph-filter-bar{ grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .ph-filter-bar{ grid-template-columns: 1fr; } }

        .ph-filter-search-wrap { position: relative; }
        .ph-filter-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #555; font-size: 15px; pointer-events: none; }

        .ph-filter-inp, .ph-filter-sel {
          width: 100%; background: #1a1a1a !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 12px !important; color: #fff !important;
          font-family: 'Nunito', sans-serif; font-size: 14px !important; font-weight: 700;
          transition: border-color 0.2s; outline: none;
        }
        .ph-filter-inp { padding: 13px 16px 13px 42px !important; }
        .ph-filter-sel { padding: 13px 16px !important; cursor: pointer; }
        .ph-filter-inp:focus, .ph-filter-sel:focus { border-color: #ff5000 !important; }
        .ph-filter-inp::placeholder { color: #3a3a3a !important; }

        /* ── SECTIONS ── */
        .ph-section { margin-bottom: 52px; animation: slideUp 0.4s ease both; }
        .ph-section-title {
          font-family: 'Bebas Neue', cursive; font-size: 32px; letter-spacing: 2px;
          color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
        }
        .ph-section-title::after {
          content:''; flex:1; height:1px; background: linear-gradient(90deg,#2a2a2a,transparent);
        }

        .ph-no-results { color: #555; font-size: 15px; font-weight: 700; padding: 32px 0; text-align: center; }

        /* ── PIZZA GRID ── */
        .ph-pizza-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;
        }
        .ph-pizza-col { }

        /* ── PIZZA CARD ── */
        .ph-pizza-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 20px;
          overflow: hidden; transition: border-color 0.25s, transform 0.25s;
          height: 100%;
        }
        .ph-pizza-card:hover { border-color: rgba(255,80,0,0.3); transform: translateY(-4px); }

        .ph-card-img-wrap { position: relative; overflow: hidden; }
        .ph-card-img {
          width: 100%; height: 200px; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .ph-pizza-card:hover .ph-card-img { transform: scale(1.05); }

        .ph-wish-btn {
          position: absolute; top: 12px; right: 12px;
          background: rgba(15,15,15,0.8); backdrop-filter: blur(8px);
          border: 1px solid #2a2a2a; border-radius: 50%;
          width: 38px; height: 38px; font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s, border-color 0.15s;
        }
        .ph-wish-btn:hover { transform: scale(1.15); border-color: #ff3366; }
        .ph-wish-btn.active { border-color: #ff3366; background: rgba(255,51,102,0.15); }

        .ph-card-cat-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(255,80,0,0.9); border-radius: 6px;
          color: #fff; font-size: 10px; font-weight: 800;
          letter-spacing: 1px; padding: 4px 10px; text-transform: uppercase;
        }

        .ph-card-body { padding: 16px; }
        .ph-card-name {
          color: #fff; font-size: 16px; font-weight: 900;
          margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ph-card-price {
          font-family: 'Bebas Neue', cursive; font-size: 24px;
          letter-spacing: 1px; color: #ff5000; margin-bottom: 14px;
        }
        .ph-card-price span { font-family: 'Nunito', sans-serif; font-size: 14px; color: #666; font-weight: 700; }

        .ph-add-btn {
          width: 100%; background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 12px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
          padding: 12px; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(255,80,0,0.25); letter-spacing: 0.3px;
        }
        .ph-add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,80,0,0.4); }
        .ph-add-btn:active { transform: translateY(0); }

        /* LOADING */
        .ph-loading {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; padding: 80px; color: #555; font-weight: 700; font-size: 15px;
        }
        .ph-spin {
          width: 40px; height: 40px; border: 3px solid #222;
          border-top-color: #ff5000; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }
      `}</style>

      {/* HERO */}
      <div className="ph-hero">
        <span className="ph-hero-emoji">🍕</span>
        <div className="ph-hero-title">Pizza<span>Hub</span></div>
        <div className="ph-hero-sub">Hot & Fresh Pizza Delivered to Your Door 🚀</div>
        <div className="ph-hero-chips">
          <span className="ph-hero-chip">⚡ 30-min delivery</span>
          <span className="ph-hero-chip">🔥 Fresh from the oven</span>
          <span className="ph-hero-chip">🏆 Top rated</span>
          <span className="ph-hero-chip">💳 Easy payment</span>
        </div>
        <a href="#all-pizzas" className="ph-hero-btn">🍕 Order Now</a>
      </div>

      {/* FILTER */}
      <div className="ph-filter-bar">
        <div className="ph-filter-search-wrap">
          <span className="ph-filter-search-icon">🔍</span>
          <input className="ph-filter-inp form-control"
            placeholder="Search pizzas..." onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="ph-filter-sel form-control" onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Veg">🥦 Veg</option>
          <option value="Non-Veg">🍗 Non-Veg</option>
        </select>
        <select className="ph-filter-sel form-control" onChange={e => setSort(e.target.value)}>
          <option value="">Sort By Price</option>
          <option value="low">↑ Low to High</option>
          <option value="high">↓ High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="ph-loading"><div className="ph-spin"></div> Loading delicious pizzas...</div>
      ) : (
        <>
          <div id="all-pizzas">
            <Section title="🍕 All Pizzas"      data={filtered} />
          </div>
          <Section title="⭐ Recommended"        data={recommended} />
          <Section title="🔥 Most Ordered"       data={mostOrdered} />
          <Section title="📈 Trending Now"       data={trending} />
        </>
      )}
    </>
  );
};

export default Home;