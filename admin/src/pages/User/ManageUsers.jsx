import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../styles/ManageUsers.css';
import { useEffect } from 'react';
import { fetchUsers } from '../../redux/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const {users,status} = useSelector(state=>state.users)


  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({key: 'id',direction: 'ascending'});
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
console.log(users);
  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort users based on sortConfig
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        // Special handling for lastLogin which is a date string
        if (sortConfig.key === 'lastLogin') {
          const dateA = new Date(a.lastLogin);
          const dateB = new Date(b.lastLogin);
          return sortConfig.direction === 'ascending' 
            ? dateA - dateB 
            : dateB - dateA;
        }
        
        // Special handling for name which combines first and last
        if (sortConfig.key === 'name') {
          const nameA = `${a?.firstName} ${a?.lastName}`.toLowerCase();
          const nameB = `${b?.firstName} ${b?.lastName}`.toLowerCase();
          if (nameA < nameB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (nameA > nameB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }

        // Default sorting for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(users => {
      const searchLower = searchTerm.toLowerCase();
      return (
        users?.firstName?.toLowerCase().includes(searchLower) ||
        users?.lastName?.toLowerCase().includes(searchLower) ||
        users?.email?.toLowerCase().includes(searchLower) ||
        users?.role?.toLowerCase().includes(searchLower) ||
        users?.status?.toLowerCase().includes(searchLower) ||
        users?.uid?.toString().includes(searchTerm)
      );
    });
  }, [sortedUsers, searchTerm]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;

  // Calculate current users to display
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    setSelectAll(false); // Reset select all when changing pages
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    console.log(`User ${userId} would be deleted`);
    alert(`User ${userId} would be deleted in a real application`);
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to delete');
      return;
    }
    console.log(`Users ${selectedUsers.join(', ')} would be deleted`);
    alert(`Users ${selectedUsers.join(', ')} would be deleted in a real application`);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // Toggle selection for a single user
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Toggle select all users on current page
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.uid));
    }
    setSelectAll(!selectAll);
  };

  // Get sort direction indicator for a column
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return null;
  };

  useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       setLoading(true); // Start loader
//       const response = await fetch('http://localhost:5000/api/v1/users', {
//   method: 'GET',
//   credentials: 'include' // This sends cookies along with the request
// }); // Your API route
//       const data = await response.json();
      
//       // Optional: format or fallback
//       const formattedUsers = data.map(user => ({
//         id: user.uid,
//         firstName: user.displayName?.split(' ')[0] || 'N/A',
//         lastName: user.displayName?.split(' ')[1] || '',
//         email: user.email,
//         role: user.role,
//         status: user.disabled ? 'Inactive' : 'Active',
//         lastLogin: user.lastLogin 
//           ? new Date(user.lastLogin).toLocaleDateString()
//           : 'Never'
//       }));

//       setUsers(formattedUsers);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//     }finally{
//       setLoading(false); // Stop loader
//     }
//   };

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
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/add-user" className="add-user-btn">
            Add New User
          </Link>
        </div>
      </div>

      {users?.length > 0 && (
        <div className="bulk-actions">
          <span>{users?.length} user(s) selected</span>
          <button 
            onClick={handleBulkDelete}
            className="bulk-delete-btn"
          >
            Delete Selected
          </button>
        </div>
      )}
{status == "loading" ? (
  <div className="loader-container">
    <div className="spinner" />
    <p>Loading users...</p>
  </div>
) : (
      <div className="users-table-container">
        {users?.length === 0 ? (
          <div className="no-results">
            No users found matching your search criteria.
          </div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th onClick={() => requestSort('id')}>
                    ID{getSortIndicator('id')}
                  </th>
                  <th onClick={() => requestSort('name')}>
                    Name{getSortIndicator('name')}
                  </th>
                  <th onClick={() => requestSort('email')}>
                    Email{getSortIndicator('email')}
                  </th>
                  <th onClick={() => requestSort('role')}>
                    Role{getSortIndicator('role')}
                  </th>
                  <th onClick={() => requestSort('status')}>
                    Status{getSortIndicator('status')}
                  </th>
                  <th onClick={() => requestSort('lastLogin')}>
                    Last Login{getSortIndicator('lastLogin')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user,index) => (
                  <tr key={user?.uid}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user?.uid)}
                        onChange={() => toggleUserSelection(user?.uid)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{user?.firstName} {user?.lastName}</td>
                    <td>{user?.email}</td>
                    <td>
                      <span className={`role-badge ${user?.role?.toLowerCase()}`}>
                        {user?.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user?.status?.toLowerCase()}`}>
                        {user?.status}
                      </span>
                    </td>
                    <td>{user?.lastLogin}</td>
                    <td className="actions">
                      <Link to={`/admin/user/edit-user/${user?.uid}`} className="edit-btn">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(user?.uid)} 
                        className="delete-btn"
                      >
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
              pageCount={pageCount}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName={'pagination'}
              previousLinkClassName={'pagination__link'}
              nextLinkClassName={'pagination__link'}
              disabledClassName={'pagination__link--disabled'}
              activeClassName={'pagination__link--active'}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
            />
          </>
        )}
      </div>

   )}  
    </div>
  );
};

export default ManageUsers;