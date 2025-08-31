import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../../styles/ManageUsers.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "../../redux/features/plan/planSlice";


const ManagePlans = () => {
  const { plans, status } = useSelector((state) => state.plans);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  // Sorting function
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlans = useMemo(() => {
    let sortable = [...plans];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [plans, sortConfig]);

  const filteredPlans = useMemo(() => {
    return sortedPlans.filter((plan) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        plan?.plans?.toLowerCase().includes(searchLower) ||
        plan?.price?.toLowerCase().includes(searchLower)
      );
    });
  }, [sortedPlans, searchTerm]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 3;
  const pageCount = Math.ceil(filteredPlans.length / plansPerPage);
  const offset = currentPage * plansPerPage;
  const currentPlans = filteredPlans.slice(offset, offset + plansPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    setSelectAll(false);
  };

  const togglePlanSelection = (id) => {
    setSelectedPlans((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(currentPlans.map((plan) => plan.id));
    }
    setSelectAll(!selectAll);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return null;
  };

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  return (
    <div className="manage-users-container">
      <div className="header">
        <h2>Manage Plans</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/plans/add-plans" className="add-user-btn">
            Add New Plan
          </Link>
        </div>
      </div>

      {selectedPlans.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedPlans.length} plan(s) selected</span>
          <button onClick={() => console.log("Delete", selectedPlans)}>
            Delete Selected
          </button>
        </div>
      )}

      {status === "loading" ? (
        <div className="loader-container">
          <div className="spinner" />
          <p>Loading plans...</p>
        </div>
      ) : (
        <div className="users-table-container">
          {currentPlans.length === 0 ? (
            <div className="no-results">No plans found</div>
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
                    <th onClick={() => requestSort("id")}>
                      ID {getSortIndicator("id")}
                    </th>
                    <th onClick={() => requestSort("plans")}>
                      Plan {getSortIndicator("plans")}
                    </th>
                    <th onClick={() => requestSort("price")}>
                      Price {getSortIndicator("price")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlans.map((plan, index) => (
                    <tr key={plan.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPlans.includes(plan.id)}
                          onChange={() => togglePlanSelection(plan.id)}
                        />
                      </td>
                      <td>{offset + index + 1}</td>
                      <td>{plan.plans}</td>
                      <td>{plan.price}</td>
                      <td className="actions">
                        <Link
                          to={`/admin/plans/edit-plan/${plan.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => console.log("Delete", plan.id)}
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
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName={"pagination"}
                activeClassName={"pagination__link--active"}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
