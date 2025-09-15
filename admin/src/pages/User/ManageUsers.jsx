import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../styles/ManageUsers.css';
import { deleteUser, fetchUsers } from '../../redux/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(0);

  const usersPerPage = 10;

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort users
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...(users || [])];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (sortConfig.key === 'lastLogin') {
          const dateA = new Date(a.lastLogin);
          const dateB = new Date(b.lastLogin);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === 'name') {
          const nameA = `${a?.firstName} ${a?.lastName}`.toLowerCase();
          const nameB = `${b?.firstName} ${b?.lastName}`.toLowerCase();
          if (nameA < nameB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((u) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        u?.firstName?.toLowerCase().includes(searchLower) ||
        u?.lastName?.toLowerCase().includes(searchLower) ||
        u?.email?.toLowerCase().includes(searchLower) ||
        u?.role?.toLowerCase().includes(searchLower) ||
        u?.status?.toLowerCase().includes(searchLower) ||
        u?.uid?.toString().includes(searchTerm)
      );
    });
  }, [sortedUsers, searchTerm]);

  // Pagination
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    setSelectAll(false);
  };

  // delete single user
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
      dispatch(fetchUsers()); 
    }
  };

  // bulk delete
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to delete');
      return;
    }
    if (window.confirm(`Delete ${selectedUsers.length} user(s)?`)) {
      selectedUsers.forEach((id) => dispatch(deleteUser(id)));
      setSelectedUsers([]);
      setSelectAll(false);
      dispatch(fetchUsers()); 
    }
  };

  // Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // Toggle single user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.uid));
    }
    setSelectAll(!selectAll);
  };

  // Sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return null;
  };

  // Fetch users from Redux
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  return (
    <div className="manage-users-container">
      <div className="header">
        <h2>Manage Users</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/user/add-user" className="add-user-btn">
            Add New User
          </Link>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} user(s) selected</span>
          <button onClick={handleBulkDelete} className="bulk-delete-btn">
            Delete Selected
          </button>
        </div>
      )}

      {status === 'loading' ? (
        <div className="loader-container">
          <div className="spinner" />
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => {
                      if (selectAll) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(users.map((u) => u.uid));
                      }
                      setSelectAll(!selectAll);
                    }}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user?.uid}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user?.uid)}
                      onChange={() => {
                        setSelectedUsers((prev) =>
                          prev.includes(user?.uid)
                            ? prev.filter((id) => id !== user?.uid)
                            : [...prev, user?.uid]
                        );
                      }}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{user?.firstName} {user?.lastName}</td>
                  <td>{user?.email}</td>
                  <td>{user?.role}</td>
                  <td>{user?.status}</td>
                  <td>{user?.lastLogin}</td>
                  <td>
                    <Link to={`/admin/user/edit-user/${user?.uid}`} className="edit-btn">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(user?.uid)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={'← Previous'}
            nextLabel={'Next →'}
            pageCount={Math.ceil(users.length / usersPerPage)}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            forcePage={currentPage}
            containerClassName={'pagination'}
            activeClassName={'pagination__link--active'}
          />
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

