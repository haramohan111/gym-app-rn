import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AddMusic.css";
import { addPlan } from "../../redux/features/plan/planSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    plans: "",
    price: "",
  });
  const { status, error } = useSelector((state) => state.plans);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plans.trim()) {
      newErrors.plans = "Plan is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    toast.error(error);
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formPayload = {
        duration: formData.plans,
        price: formData.price,
      };

      const result = await dispatch(addPlan(formPayload));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Plan added successfully!");

      }
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-music-container">
      <div className="card">
        <h2>Add New Plans</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plans">Plans</label>
              <select
                id="plans"
                name="plans"
                value={formData.plans}
                onChange={handleChange}
              >
                <option value="">Select Plans</option>
                <option value="1 Months">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="4 Months">4 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
              {errors.plans && <p className="error-message">{errors.plans}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
              {errors.price && <p className="error-message">{errors.price}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? "Uploading..." : "Add Plans"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/manage-plans")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlans;
