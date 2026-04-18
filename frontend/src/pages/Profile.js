import { useEffect, useState } from 'react';
import API from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    API.get('/users/me').then(res => {
      setUser(res.data);
      setName(res.data.name);
    });
  }, []);

  const update = async () => {
    await API.put('/users/me', { name });
    alert('Updated');
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    await API.put('/users/me/photo', formData);
    alert('Photo updated');
  };

  return (
    <div className="col-md-4">
      <h3>Profile</h3>

      {user.profilePic && (
        <img src={user.profilePic} width="100" />
      )}

      <input className="form-control mb-2"
        value={name}
        onChange={e => setName(e.target.value)} />

      <button className="btn btn-dark mb-2" onClick={update}>
        Update Info
      </button>

      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button className="btn btn-warning mt-2" onClick={upload}>
        Upload Photo
      </button>
    </div>
  );
};

export default Profile;