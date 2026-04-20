import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/';

const getImage = (img) => {
  if (!img) return 'https://placehold.co/400x300/1a1a1a/555?text=🍕';
  if (img.startsWith('http')) return img;
  return BASE_URL + img;
};

const Wishlist = () => {
  const { wishlist, remove } = useWishlist();
  const { cart, setCart }    = useCart();

  const handleRemove = async (id, name) => {
    await remove(id);
    toast.error(`${name} removed from wishlist 💔`);
  };

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-wl { font-family: 'Nunito', sans-serif; }

        .ph-wl-header { margin-bottom: 32px; animation: fadeDown 0.4s ease both; }
        .ph-wl-title {
          font-family: 'Bebas Neue', cursive; font-size: 48px;
          letter-spacing: 3px; color: #fff; line-height: 1;
        }
        .ph-wl-title span {
          background: linear-gradient(135deg,#ff3366,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-wl-sub { color: #555; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* EMPTY */
        .ph-wl-empty {
          text-align: center; padding: 80px 20px;
          animation: slideUp 0.5s ease both;
        }
        .ph-wl-empty-emoji { font-size: 80px; display: block; opacity: 0.4; margin-bottom: 20px; }
        .ph-wl-empty-title {
          font-family: 'Bebas Neue', cursive; font-size: 36px;
          letter-spacing: 2px; color: #fff; margin-bottom: 8px;
        }
        .ph-wl-empty-sub { color: #555; font-size: 15px; font-weight: 600; margin-bottom: 28px; }
        .ph-wl-empty-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 50px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          padding: 14px 32px; text-decoration: none;
          box-shadow: 0 8px 24px rgba(255,80,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .ph-wl-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(255,80,0,0.45); color: #fff; }

        /* GRID */
        .ph-wl-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px; animation: slideUp 0.4s ease both;
        }

        /* CARD */
        .ph-wl-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 20px;
          overflow: hidden; transition: border-color 0.25s, transform 0.25s;
        }
        .ph-wl-card:hover { border-color: rgba(255,51,102,0.3); transform: translateY(-4px); }

        .ph-wl-img-wrap { position: relative; overflow: hidden; }
        .ph-wl-img {
          width: 100%; height: 200px; object-fit: cover; display: block;
          transition: transform 0.4s;
        }
        .ph-wl-card:hover .ph-wl-img { transform: scale(1.05); }

        .ph-wl-heart {
          position: absolute; top: 12px; right: 12px;
          background: rgba(255,51,102,0.15); border: 1px solid rgba(255,51,102,0.3);
          border-radius: 50%; width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }

        .ph-wl-body { padding: 16px; }
        .ph-wl-name {
          color: #fff; font-size: 17px; font-weight: 900;
          margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ph-wl-price {
          font-family: 'Bebas Neue', cursive; font-size: 24px;
          letter-spacing: 1px; color: #ff5000; margin-bottom: 14px;
        }
        .ph-wl-price small {
          font-family: 'Nunito', sans-serif; font-size: 13px; color: #555; font-weight: 700;
        }

        .ph-wl-btns { display: flex; gap: 8px; }

        .ph-wl-add-btn {
          flex: 1; background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 11px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
          padding: 11px; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(255,80,0,0.2);
        }
        .ph-wl-add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,80,0,0.35); }

        .ph-wl-rem-btn {
          flex: 1; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 11px; color: #ef4444; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
          padding: 11px; transition: background 0.15s, border-color 0.15s;
        }
        .ph-wl-rem-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.45); }
      `}</style>

      <div className="ph-wl">
        <div className="ph-wl-header">
          <div className="ph-wl-title">My <span>Wishlist</span></div>
          <div className="ph-wl-sub">
            {wishlist.length > 0 ? `${wishlist.length} saved item${wishlist.length !== 1 ? 's' : ''}` : 'Nothing saved yet'}
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="ph-wl-empty">
            <span className="ph-wl-empty-emoji">💔</span>
            <div className="ph-wl-empty-title">Your wishlist is empty</div>
            <div className="ph-wl-empty-sub">Save your favourite pizzas and order them later!</div>
            <a href="/" className="ph-wl-empty-btn">🍕 Browse Menu</a>
          </div>
        ) : (
          <div className="ph-wl-grid">
            {wishlist.map((p, i) => (
              <div key={p.id} className="ph-wl-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="ph-wl-img-wrap">
                  <img src={getImage(p.image)} alt={p.name} className="ph-wl-img" />
                  <div className="ph-wl-heart">❤️</div>
                </div>
                <div className="ph-wl-body">
                  <div className="ph-wl-name">{p.name}</div>
                  <div className="ph-wl-price">{p.price} <small>Tk</small></div>
                  <div className="ph-wl-btns">
                    <button className="ph-wl-add-btn" onClick={() => addToCart(p)}>🛒 Add</button>
                    <button className="ph-wl-rem-btn" onClick={() => handleRemove(p.id, p.name)}>✕ Remove</button>
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

export default Wishlist;