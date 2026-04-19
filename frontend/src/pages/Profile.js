import { useEffect, useState } from 'react';
import API from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📥 load user
  useEffect(() => {
    API.get('/users/me').then(res => {
      setUser(res.data);
      setName(res.data.name);
    });
  }, []);

  // ✏️ update name
  const update = async () => {
    try {
      await API.put('/users/me', { name });

      setUser(prev => ({
        ...prev,
        name
      }));

      alert('Profile updated ✅');
    } catch (err) {
      alert('Update failed ❌');
    }
  };

  // 📸 select image + preview
  const handleFile = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 🚀 upload photo
const upload = async () => {
  try {
    if (!file) return alert('Select image first');

    const formData = new FormData();
    formData.append('image', file);

    const res = await API.put('/users/me/photo', formData);

    // 🔥 instant UI update
    setUser(prev => ({
      ...prev,
      profilePic: res.data.imageUrl
    }));

    alert('Photo updated ✅');

  } catch (err) {
    console.error(err);
    alert('Upload failed ❌');
  }
};
  return (
    <div className="container mt-5">

      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow-lg border-0 rounded-4 p-4 text-center">

            {/* 🔥 PROFILE IMAGE */}
            <div className="mb-3">
              <img
                src={
                  preview ||
                  user.profilePic ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
                alt="profile"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #eee'
                }}
              />
            </div>

            <h4 className="fw-bold">{user.name}</h4>
            <p className="text-muted">{user.email}</p>

            {/* ✏️ NAME EDIT */}
            <input
              className="form-control mb-3"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <button
              className="btn btn-dark w-100 mb-3"
              onClick={update}
            >
              Update Profile ✏️
            </button>

            {/* 📸 IMAGE UPLOAD */}
            <input
              type="file"
              className="form-control mb-2"
              onChange={handleFile}
            />

            <button
              className="btn btn-warning w-100"
              onClick={upload}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Photo 📸'}
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;