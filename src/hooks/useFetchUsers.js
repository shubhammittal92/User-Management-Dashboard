// src/hooks/useFetchUsers.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchUsers = (API_URL) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        const usersWithCity = response.data.map((user) => ({
          ...user,
          city: user.address.city, // Assuming city is in user.address.city
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

    getUsers();
  }, [API_URL]);

  return { users, loading, error, setUsers };
};
