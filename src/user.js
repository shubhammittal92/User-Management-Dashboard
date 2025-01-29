import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css'; // Importing your custom styles

const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", city: "" });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetching users and cities from the API
  useEffect(() => {
    fetchUsers();
    fetchCities();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      const usersWithCity = response.data.map(user => ({
        ...user,
        city: user.address.city // Extract city from address
      }));
      setUsers(usersWithCity); // Set users with city info
    } catch (error) {
      setError("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserAction = async (e, action) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Name and Email are required");
      return;
    }

    if (action === 'add') {
      const isEmailDuplicate = users.some(user => user.email === formData.email);
      if (isEmailDuplicate) {
        setError("User with this email already exists");
        return;
      }
    }

    setLoading(true);
    try {
      let updatedUsers;
      if (action === 'add') {
        const newUser = { ...formData, id: users.length + 1 };
        updatedUsers = [...users, newUser];
        await axios.post(API_URL, newUser);
      } else if (action === 'update') {
        const userToUpdate = users.find(user => user.id === Number(formData.id));
        if (!userToUpdate) {
          setError("User not found");
          return;
        }
        updatedUsers = users.map(user => user.id === Number(formData.id) ? { ...formData, id: Number(formData.id) } : user);
      }

      setUsers(updatedUsers);
      setFormData({ id: "", name: "", email: "", city: "" });
      setError(null);
    } catch (error) {
      setError(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.address.city // Ensure city is correctly populated
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <div className="container">
        <h1>User Management</h1>

        <button className="theme-toggle-btn" onClick={handleDarkModeToggle}>
          {isDarkMode ? (
            <i className="fas fa-sun"></i>
          ) : (
            <i className="fas fa-moon"></i>
          )}
          {isDarkMode ? " Switch to Light Mode" : " Switch to Dark Mode"}
        </button>

        <form onSubmit={(e) => handleUserAction(e, formData.id ? 'update' : 'add')}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <button type="submit" className={formData.id ? "update-btn" : "add-btn"}>
            {formData.id ? "Update User" : "Add User"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th> {/* Changed from 'Department' */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.city || "N/A"}</td> {/* Display city or "N/A" if not available */}
                  <td className="actions-btn">
                    <button className="edit-btn" onClick={() => handleEdit(user)}>
                      <i className="fas fa-edit" />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                      <i className="fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="page-number">{currentPage}</span>
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * USERS_PER_PAGE >= users.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
