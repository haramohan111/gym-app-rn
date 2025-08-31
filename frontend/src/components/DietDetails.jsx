// src/components/DietDetails.jsx
import React from "react";
import "../styles/DietDetails.css"; // optional CSS for styling

const weeklyDiet = {
  Monday: {
    breakfast: "Oats with milk, 2 boiled eggs, and a banana",
    lunch: "Grilled chicken, brown rice, and steamed vegetables",
    dinner: "Fish curry with quinoa and salad",
    snacks: "Almonds, protein shake, and fruits",
    supplements: "Multivitamin, Whey Protein, Omega-3",
  },
  Tuesday: {
    breakfast: "Scrambled eggs, whole grain toast, and an apple",
    lunch: "Paneer curry with brown rice",
    dinner: "Grilled salmon with sweet potato",
    snacks: "Greek yogurt with nuts",
    supplements: "Vitamin D, Omega-3",
  },
  Wednesday: {
    breakfast: "Smoothie (banana, spinach, whey protein)",
    lunch: "Chicken breast with quinoa",
    dinner: "Dal, roti, and vegetable curry",
    snacks: "Trail mix and fruits",
    supplements: "Multivitamin",
  },
  Thursday: {
    breakfast: "Idli with sambhar",
    lunch: "Grilled chicken wrap",
    dinner: "Fish curry with brown rice",
    snacks: "Protein bar and nuts",
    supplements: "Whey Protein",
  },
  Friday: {
    breakfast: "Poha with peanuts",
    lunch: "Rajma with brown rice",
    dinner: "Chicken tikka with salad",
    snacks: "Boiled eggs and fruits",
    supplements: "Omega-3",
  },
  Saturday: {
    breakfast: "Paratha with curd",
    lunch: "Paneer tikka with roti",
    dinner: "Grilled prawns with vegetables",
    snacks: "Protein shake and almonds",
    supplements: "Multivitamin",
  },
  Sunday: {
    breakfast: "Dosa with chutney",
    lunch: "Biryani (brown rice, chicken, boiled egg)",
    dinner: "Light salad with chicken",
    snacks: "Fruits and dry fruits",
    supplements: "Vitamin D",
  },
};

const DietDetails = () => {
  return (
    <div className="diet-details">
      <h2 className="diet-title">Weekly Diet Plan</h2>

      <div className="diet-grid">
        {Object.entries(weeklyDiet).map(([day, meals]) => (
          <div key={day} className="diet-day-box">
            <h3>{day}</h3>
            <p><strong>Breakfast:</strong> {meals.breakfast}</p>
            <p><strong>Lunch:</strong> {meals.lunch}</p>
            <p><strong>Dinner:</strong> {meals.dinner}</p>
            <p><strong>Snacks:</strong> {meals.snacks}</p>
            <p><strong>Supplements:</strong> {meals.supplements}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietDetails;
