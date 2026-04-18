const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h2>User Dashboard 👤</h2>
      <p>Welcome {user.name}</p>
    </div>
  );
};

export default UserDashboard;