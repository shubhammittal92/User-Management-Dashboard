import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css'; // Import the normal CSS

const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", department: "" });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Name and Email are required");
      return;
    }

    // Check if user with the same email already exists
    const isEmailDuplicate = users.some(user => user.email === formData.email);
    if (isEmailDuplicate) {
      setError("User with this email already exists");
      return;
    }

    setLoading(true);
    try {
      const newUser = { ...formData };
      // Simulate a successful API response (JSONPlaceholder won't actually persist data)
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data]); // Add the new user to the local state
      setFormData({ id: "", name: "", email: "", department: "" });
      setError(null);
    } catch (error) {
      setError("Failed to add user");
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

    if (!formData.name || !formData.email) {
      setError("Name and Email are required for update");
      return;
    }

    setLoading(true);
    try {
      // Update the user data using PUT request to the API
      const updatedUser = { ...formData };
      await axios.put(`${API_URL}/${formData.id}`, updatedUser);
      
      // Update the user in the local state
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setFormData({ id: "", name: "", email: "", department: "" });
      setError(null);
    } catch (error) {
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user });
    setError(null); // Clear any previous error
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}
      
      <form className="form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
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
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.department || "N/A"}</td>
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
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || loading} className="page-btn">Previous</button>
        <span className="page-number">{currentPage}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastUser >= users.length || loading} className="page-btn">Next</button>
      </div>
    </div>
  );
};

export default UserManagement;
