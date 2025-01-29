import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css'; // Import the normal CSS

const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", city: "" });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light"); // State to handle theme
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const usersWithCity = response.data.map(user => ({
        ...user,
        city: user.address.city // Assuming city is in user.address.city
      }));
      setUsers(usersWithCity);
    } catch (error) {
      if (error.response) {
        setError(`Failed to fetch users: ${error.response.data.message || 'Server Error'}`);
      } else if (error.request) {
        setError("Failed to fetch users: No response from server");
      } else {
        setError(`Failed to fetch users: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page whenever the search query changes
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.city) {
      setError("All fields must be filled");
      return;
    }
  
    if (!formData.email.includes('@')) {
      setError("Email must include '@'");
      return;
    }
  
    if (formData.name.length <= 3) {
      setError("Name must be greater than 3 characters");
      return;
    }
  
    if (formData.city.length <= 3) {
      setError("City must be greater than 3 characters");
      return;
    }
  
    const isEmailDuplicate = users.some(user => user.email === formData.email);
    if (isEmailDuplicate) {
      setError("User with this email already exists");
      return;
    }
  
    setLoading(true);
    try {
      const newUser = { ...formData, id: users.length + 1 };
      await axios.post(API_URL, newUser);
      setUsers([...users, newUser]);
      setFormData({ id: "", name: "", email: "", city: "" });
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(`Failed to add user: ${error.response.data.message || 'Server Error'}`);
      } else if (error.request) {
        setError("Failed to add user: No response from server");
      } else {
        setError(`Failed to add user: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
  
    if (!formData.id) {
      setError("Please select a user to update");
      return;
    }
  
    if (!formData.name || !formData.email || !formData.city) {
      setError("All fields must be filled");
      return;
    }
  
    if (!formData.email.includes('@')) {
      setError("Email must include '@'");
      return;
    }
  
    if (formData.name.length < 3) {
      setError("Name must be greater than 3 characters");
      return;
    }
  
    if (formData.city.length < 3) {
      setError("City must be greater than 3 characters");
      return;
    }
  
    const userToUpdate = users.find(user => user.id === Number(formData.id));
  
    if (!userToUpdate) {
      setError("User not found");
      return;
    }
  
    setLoading(true);
    try {
      const updatedUser = { ...formData, id: Number(formData.id) };
  
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setFormData({ id: "", name: "", email: "", city: "" });
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(`Failed to update user: ${error.response.data.message || 'Server Error'}`);
      } else if (error.request) {
        setError("Failed to update user: No response from server");
      } else {
        setError(`Failed to update user: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user, id: String(user.id) });
    setError(null);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);

      // Check if current page has no entries, if so, go to the previous page
      if (updatedUsers.length <= (currentPage - 1) * USERS_PER_PAGE) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      if (error.response) {
        setError(`Failed to delete user: ${error.response.data.message || 'Server Error'}`);
      } else if (error.request) {
        setError("Failed to delete user: No response from server");
      } else {
        setError(`Failed to delete user: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`container ${theme}-mode`}>
      <h1>User Management Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      <button onClick={toggleTheme} className="theme-toggle-btn">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name or Email"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      
      <form className="form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <div>
          <button onClick={handleAddUser} disabled={loading} className="add-btn">Add User</button>
          <button onClick={handleUpdateUser} disabled={loading || !formData.id} className="update-btn">Update User</button>
        </div>
      </form>

      <div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.city || "N/A"}</td>
                <td className="actions-btn">
                  <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={loading} className="page-btn">
            Previous
          </button>
        )}

        <span className="page-number">{currentPage}</span>

        {filteredUsers.length > currentPage * USERS_PER_PAGE && (
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={loading} className="page-btn">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
