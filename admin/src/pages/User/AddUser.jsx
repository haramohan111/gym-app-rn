import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddUser.css';
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/features/user/userSlice"; // adjust path
import { toast } from 'react-toastify';


const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    permissions: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redux state
  const { status, error } = useSelector((state) => state.users);

  // // Available permissions
  // const availablePermissions = [
  //   { id: 'create', label: 'Create Content' },
  //   { id: 'edit', label: 'Edit Content' },
  //   { id: 'delete', label: 'Delete Content' },
  //   { id: 'publish', label: 'Publish Content' },
  //   { id: 'manage_users', label: 'Manage Users' }
  // ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handlePermissionToggle = (permissionId) => {
  //   setFormData(prev => {
  //     if (prev.permissions.includes(permissionId)) {
  //       return {
  //         ...prev,
  //         permissions: prev.permissions.filter(id => id !== permissionId)
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         permissions: [...prev.permissions, permissionId]
  //       };
  //     }
  //   });
  // };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };

      const resultAction = await dispatch(addUser(userData));

      if (addUser.fulfilled.match(resultAction)) {
       toast.success('Add user successfully');
          setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
        permissions: []
      });

    
      setErrors({});
      } else {
        setErrors({ submit: resultAction.payload || "Failed to create user" });
      }

    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <div className="card">
        <h2>Add New Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                {/* <option value="editor">Editor</option> */}
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter password (min 8 characters)"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Permissions */}
          {/* <div className="form-row">
            <label>Permissions</label>
            <div className="permissions">
              {availablePermissions.map((perm) => (
                <label key={perm.id}>
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => handlePermissionToggle(perm.id)}
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div> */}

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          {/* {error && <div className="error-message submit-error">{error}</div>} */}
          
          <div className="form-row">
            <button 
              type="submit" 
              disabled={isSubmitting || status === "loading"}
              className="submit-btn"
            >
              {isSubmitting || status === "loading" ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
