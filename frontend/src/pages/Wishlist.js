import { useWishlist } from '../context/WishlistContext';

const BASE_URL = 'http://localhost:5000/';

const Wishlist = () => {
  const { wishlist, remove } = useWishlist();

  const getImage = (img) => {
    if (!img) return 'https://via.placeholder.com/300';
    if (img.startsWith('http')) return img;
    return BASE_URL + img;
  };

  return (
    <div>
      <h2 className="mb-4">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No wishlist items</p>
      ) : (
        <div className="row">
          {wishlist.map(p => (
            <div className="col-md-4" key={p.id}>
              <div className="card wishlist-card shadow-lg mb-4 border-0 rounded-4">

                <img
                  src={getImage(p.image)}
                  className="card-img-top"
                  style={{ height: '220px', objectFit: 'cover' }}
                />

                <div className="card-body text-center">
                  <h5>{p.name}</h5>
                  <h6>{p.price} Tk</h6>

                  <button
                    className="btn btn-danger w-100 mt-2"
                    onClick={() => remove(p.id)}
                  >
                    Remove ❌
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;