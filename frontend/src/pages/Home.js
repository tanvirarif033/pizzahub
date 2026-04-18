import { useEffect, useState } from 'react';
import API from '../services/api';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  const [loading, setLoading] = useState(true);

  // 🍕 Fetch pizzas
  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/pizzas');

      setPizzas(res.data);
      setFiltered(res.data);

      // 🔥 simple recommendation (top 3 expensive pizzas)
      const top = [...res.data]
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

      setRecommended(top);

      setLoading(false);
    };
    fetch();
  }, []);

  // 🔍 FILTER + SORT
  useEffect(() => {
    let data = [...pizzas];

    if (search) {
      data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'low') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      data.sort((a, b) => b.price - a.price);
    }

    setFiltered(data);
  }, [search, sort, pizzas]);

  // 🛒 Add to cart
  const addToCart = (pizza) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.push({ ...pizza, quantity: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Added to cart 🛒');
  };

  return (
    <div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="🔍 Search pizza..."
            className="form-control shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control shadow-sm"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading && <h4>Loading pizzas... 🍕</h4>}

      {/* 🍕 ALL PIZZAS */}
      <div className="row">
        {filtered.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card shadow-lg mb-4 border-0 rounded-4">

              <img
                src={p.image || 'https://via.placeholder.com/300'}
                className="card-img-top"
                style={{ height: '220px', objectFit: 'cover' }}
              />

              <div className="card-body text-center">
                <h5 className="fw-bold">{p.name}</h5>
                <p className="text-muted">{p.category}</p>
                <h6 className="text-success">{p.price} Tk</h6>

                <button
                  className="btn btn-dark w-100 mt-2"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart 🛒
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ⭐ RECOMMENDED SECTION */}
      <div className="mt-5">
        <h3 className="fw-bold mb-4 text-center">
          ⭐ Recommended For You
        </h3>

        <div className="row">
          {recommended.map(p => (
            <div className="col-md-4" key={p.id}>
              <div className="card border-0 shadow-lg rounded-4">

                <img
                  src={p.image || 'https://via.placeholder.com/300'}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />

                <div className="card-body text-center">
                  <h5>{p.name}</h5>
                  <p className="text-muted">{p.category}</p>
                  <h6 className="text-success">{p.price} Tk</h6>

                  <button
                    className="btn btn-warning w-100"
                    onClick={() => addToCart(p)}
                  >
                    Order Now 🚀
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;