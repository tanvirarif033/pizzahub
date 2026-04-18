import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminPizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    image: null
  });

  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🍕 Fetch pizzas
  const fetchPizzas = async () => {
    const res = await API.get('/pizzas');
    setPizzas(res.data);
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // 📝 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 Image upload + preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✏️ Edit pizza
  const editPizza = (pizza) => {
    setForm({
      name: pizza.name,
      category: pizza.category,
      price: pizza.price,
      image: null
    });

    setPreview(pizza.image || null);
    setEditId(pizza.id);
  };

  // ❌ Delete pizza
  const deletePizza = async (id) => {
    if (!window.confirm('Delete this pizza?')) return;

    await API.delete(`/pizzas/${id}`);
    fetchPizzas();
  };

  // 🚀 Create / Update
  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('price', form.price);

    if (form.image) {
      data.append('image', form.image);
    }

    try {
      if (editId) {
        await API.put(`/pizzas/${editId}`, data);
        alert('Pizza updated ✅');
      } else {
        await API.post('/pizzas', data);
        alert('Pizza created ✅');
      }

      setForm({ name: '', category: '', price: '', image: null });
      setPreview(null);
      setEditId(null);

      fetchPizzas();

    } catch (err) {
      alert('Error ❌');
    }
  };

  return (
    <div>
      <h3 className="mb-3">🍕 Manage Pizzas</h3>

      {/* FORM */}
      <form onSubmit={submit} className="card p-3 mb-4 shadow">

        <div className="row">
          <div className="col">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="form-control"
              required
            />
          </div>

          <div className="col">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="form-control"
              required
            />
          </div>

          <div className="col">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="form-control"
              required
            />
          </div>

          <div className="col">
            <input
              type="file"
              className="form-control"
              onChange={handleImage}
            />
          </div>

          <div className="col">
            <button className="btn btn-dark w-100">
              {editId ? 'Update ✏️' : 'Create ➕'}
            </button>
          </div>
        </div>

        {/* 🖼 Preview */}
        {preview && (
          <div className="mt-3 text-center">
            <img
              src={preview}
              alt="preview"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
          </div>
        )}
      </form>

      {/* LIST */}
      <div className="row">
        {pizzas.map(p => (
          <div key={p.id} className="col-md-4 mb-3">

            <div className="card shadow-sm border-0">

              <img
                src={p.image || 'https://via.placeholder.com/300'}
                alt=""
                style={{ height: '200px', objectFit: 'cover' }}
              />

              <div className="p-3">
                <h5>{p.name}</h5>
                <p className="text-muted">{p.category}</p>
                <h6>{p.price} Tk</h6>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-warning w-50"
                    onClick={() => editPizza(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger w-50"
                    onClick={() => deletePizza(p.id)}
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPizzas;