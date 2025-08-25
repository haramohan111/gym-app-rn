import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../styles/ManageMusic.css';

const ManageMusic = () => {
  // Dummy music data
  const dummyMusic = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Song ${i + 1}`,
    artist: `Artist ${(i % 5) + 1}`,
    album: `Album ${(i % 3) + 1}`,
    genre: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical'][i % 5],
    duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    plays: Math.floor(Math.random() * 10000),
    status: i % 4 === 0 ? 'Inactive' : 'Active'
  }));

  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;

  // Sort music data
  const sortedMusic = [...dummyMusic].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Special handling for duration (convert to seconds)
    if (sortConfig.key === 'duration') {
      const aParts = a.duration.split(':');
      const bParts = b.duration.split(':');
      const aSeconds = parseInt(aParts[0]) * 60 + parseInt(aParts[1]);
      const bSeconds = parseInt(bParts[0]) * 60 + parseInt(bParts[1]);
      return sortConfig.direction === 'asc' ? aSeconds - bSeconds : bSeconds - aSeconds;
    }

    // Standard string/number comparison for other fields
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter music based on search term
  const filteredMusic = sortedMusic.filter(music => {
    const searchLower = searchTerm.toLowerCase();
    return (
      music.title.toLowerCase().includes(searchLower) ||
      music.artist.toLowerCase().includes(searchLower) ||
      music.album.toLowerCase().includes(searchLower) ||
      music.genre.toLowerCase().includes(searchLower) ||
      music.id.toString().includes(searchTerm)
    );
  });

  // Calculate current items to display
  const pageCount = Math.ceil(filteredMusic.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredMusic.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    setSelectAll(false);
    setSelectedItems([]);
  };

  // Handle music deletion
  const handleDelete = (musicId) => {
    console.log(`Music ${musicId} would be deleted`);
    alert(`Music ${musicId} would be deleted in a real application`);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      alert('Please select items to delete');
      return;
    }
    console.log(`Deleting items: ${selectedItems.join(', ')}`);
    alert(`The following items would be deleted in a real application: ${selectedItems.join(', ')}`);
    setSelectedItems([]);
    setSelectAll(false);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (musicId) => {
    setSelectedItems(prev =>
      prev.includes(musicId)
        ? prev.filter(id => id !== musicId)
        : [...prev, musicId]
    );
  };

  // Handle select all checkbox change
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const currentPageIds = currentItems.map(item => item.id);
      setSelectedItems(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Request sort for a specific column
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(0); // Reset to first page when sorting
  };

  // Get sort indicator for a column
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
    setSelectAll(false);
    setSelectedItems([]);
  }, [searchTerm]);

  // Update select all checkbox when items change
  useEffect(() => {
    const allCurrentSelected = currentItems.every(item => selectedItems.includes(item.id));
    setSelectAll(currentItems.length > 0 && allCurrentSelected);
  }, [selectedItems, currentItems]);

  return (
    <div className="manage-music-container">
      <div className="header">
        <h2>Manage Music</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search music..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/add-music" className="add-music-btn">
            Add New Music
          </Link>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <button onClick={handleBulkDelete} className="bulk-delete-btn">
            Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}

      <div className="music-table-container">
        {filteredMusic.length === 0 ? (
          <div className="no-results">
            No music found matching your search criteria.
          </div>
        ) : (
          <>
            <table className="music-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      className="select-all-checkbox"
                    />
                  </th>
                  <th>ID</th>
                  <th onClick={() => requestSort('title')} className="sortable-header">
                    Title {getSortIndicator('title')}
                  </th>
                  <th onClick={() => requestSort('artist')} className="sortable-header">
                    Artist {getSortIndicator('artist')}
                  </th>
                  <th onClick={() => requestSort('album')} className="sortable-header">
                    Album {getSortIndicator('album')}
                  </th>
                  <th onClick={() => requestSort('genre')} className="sortable-header">
                    Genre {getSortIndicator('genre')}
                  </th>
                  <th onClick={() => requestSort('duration')} className="sortable-header">
                    Duration {getSortIndicator('duration')}
                  </th>
                  <th>Plays</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(music => (
                  <tr key={music.id} className={selectedItems.includes(music.id) ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(music.id)}
                        onChange={() => handleCheckboxChange(music.id)}
                        className="item-checkbox"
                      />
                    </td>
                    <td>{music.id}</td>
                    <td>{music.title}</td>
                    <td>{music.artist}</td>
                    <td>{music.album}</td>
                    <td>
                      <span className={`genre-badge ${music.genre.toLowerCase().replace(' ', '-')}`}>
                        {music.genre}
                      </span>
                    </td>
                    <td>{music.duration}</td>
                    <td>{music.plays.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${music.status.toLowerCase()}`}>
                        {music.status}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/admin/edit-music/${music.id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(music.id)} 
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
    </div>
  );
};

export default ManageMusic;