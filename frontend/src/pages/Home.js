import { useEffect, useState } from 'react';
import API from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
const BASE_URL = 'http://localhost:5000/';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [recommended, setRecommended] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [trending, setTrending] = useState([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const { add, remove, isInWishlist } = useWishlist();

  const getImage = (img) => {
    if (!img) return 'https://via.placeholder.com/300';
    if (img.startsWith('http')) return img;
    return BASE_URL + img;
  };

  // ❤️ WISHLIST TOGGLE
  const toggleWishlist = async (pizza) => {
    try {
      if (isInWishlist(pizza.id)) {
        await remove(pizza.id);
        toast.error('Removed from wishlist ❌');
      } else {
        await add(pizza);
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  // 📦 FETCH
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get('/pizzas');

      setPizzas(res.data);
      setFiltered(res.data);

      setRecommended(res.data.slice(0, 5));
      setMostOrdered(res.data.slice(2, 7));
      setTrending(res.data.slice(4, 9));
    };

    fetchData();
  }, []);

  // 🔍 FILTER LOGIC
  useEffect(() => {
    let data = [...pizzas];

    // search
    if (search) {
      data = data.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // category filter
    if (category === 'veg') {
      data = data.filter(p =>
        p.category?.toLowerCase().includes('veg')
      );
    }

    if (category === 'nonveg') {
      data = data.filter(p =>
        !p.category?.toLowerCase().includes('veg')
      );
    }

    // sort
    if (sort === 'low') data.sort((a, b) => a.price - b.price);
    if (sort === 'high') data.sort((a, b) => b.price - a.price);

    setFiltered(data);
  }, [search, sort, category, pizzas]);

  // 🛒 CART
const { cart, setCart } = useCart();

const addToCart = (pizza) => {
  // 🔥 check already exists
  const existing = cart.find(item => item.id === pizza.id);

  let updated;

  if (existing) {
    // 👉 quantity increase
    updated = cart.map(item =>
      item.id === pizza.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    toast.info('Quantity updated 🛒');
  } else {
    // 👉 new add
    updated = [...cart, { ...pizza, quantity: 1 }];

    toast.success('Added to cart 🛒');
  }

  // 🔥 update context (real-time navbar update)
  setCart(updated);
};

  // 🍕 CARD
  const PizzaCard = (p) => (
    <div className="col-md-4" key={p.id}>
      <div className="card wishlist-card shadow-lg mb-4 border-0 rounded-4 position-relative">

        {/* ❤️ */}
        <span
          onClick={() => toggleWishlist(p)}
          className="wishlist-icon"
        >
          {isInWishlist(p.id) ? '❤️' : '🤍'}
        </span>

        <img
          src={getImage(p.image)}
          className="card-img-top"
          style={{ height: '220px', objectFit: 'cover' }}
        />

        <div className="card-body text-center">
          <h5>{p.name}</h5>
          <p className="text-muted">{p.category}</p>
          <h6 className="text-success">{p.price} Tk</h6>

          <button
            className="btn btn-dark w-100"
            onClick={() => addToCart(p)}
          >
            Add to Cart 🛒
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div>

      {/* 🔥 HERO SECTION */}
      <div
        className="p-5 mb-5 text-white text-center rounded-4"
        style={{
          background: 'linear-gradient(45deg, #ff6b6b, #ff9f1c)'
        }}
      >
        <h1 className="fw-bold">🍕 PizzaHub</h1>
        <p>Hot & Fresh Pizza Delivered to Your Door 🚀</p>
        <button className="btn btn-light mt-3">
          Order Now
        </button>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="row mb-4">

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search pizza..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="veg">Veg 🥦</option>
            <option value="nonveg">Non-Veg 🍗</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>

      </div>

      {/* 🍕 ALL */}
      <h3>🍕 All Pizzas</h3>
      <div className="row">{filtered.map(PizzaCard)}</div>

      {/* ⭐ */}
      <h3 className="mt-5">⭐ Recommended</h3>
      <div className="row">{recommended.map(PizzaCard)}</div>

      {/* 🔥 */}
      <h3 className="mt-5">🔥 Most Ordered</h3>
      <div className="row">{mostOrdered.map(PizzaCard)}</div>

      {/* 📈 */}
      <h3 className="mt-5">📈 Trending</h3>
      <div className="row">{trending.map(PizzaCard)}</div>

    </div>
  );
};

export default Home;