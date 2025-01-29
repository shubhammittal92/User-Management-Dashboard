import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import SortButtons from "./SortButtons";
import ThemeToggle from "./ThemeToggle";
// import "./styles/styles.css";


const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", city: "" });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const usersWithCity = response.data.map(user => ({
        ...user,
        city: user.address.city
      }));
      setUsers(usersWithCity);
    } catch (error) {
      setError("Failed to fetch users: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page whenever the search query changes
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
        setError(`Failed to update user: ${error.response?.data?.message || 'Server Error'}`);
      } else if (error.request) {
        setError("Failed to update user: No response from server");
      } else {
        setError(`Failed to update user: ${error.response?.data?.message || 'Server Error'}`);
      }
    } finally {
      setLoading(false);
    }
  };


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = React.useMemo(() => {
    if (sortConfig.key) {
      return [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredUsers;
  }, [filteredUsers, sortConfig]);

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

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
      setError("Failed to add user: " + (error.response?.data?.message || error.message));
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
      setError("Failed to delete user: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (users.length === 0) return null;

  return (
    <div className={`container ${theme}-mode`}>
      <h1>User Management Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
      <UserForm formData={formData} setFormData={setFormData} handleAddUser={handleAddUser} handleUpdateUser={handleUpdateUser} loading={loading} />
      <SortButtons handleSort={handleSort} />
      <UserTable currentUsers={currentUsers} handleEdit={handleEdit} handleDelete={handleDelete} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} filteredUsers={filteredUsers} USERS_PER_PAGE={USERS_PER_PAGE} loading={loading} />
    </div>
  );
};

export default Users;
