import React from "react";

const UserForm = ({ formData, setFormData, handleAddUser, handleUpdateUser, loading }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="form">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
      <div>
        <button onClick={handleAddUser} disabled={loading} className="add-btn">Add User</button>
        <button onClick={handleUpdateUser} disabled={loading || !formData.id} className="update-btn">Update User</button>
      </div>
    </form>
  );
};

export default UserForm;