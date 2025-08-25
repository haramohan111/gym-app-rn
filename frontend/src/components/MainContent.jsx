import React from 'react';
import Header from './Header';

function MainContent() {
  return (

     

      <div className="row g-3">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">1 Month - 1999</h5>
              <p className="card-text">Plan details here</p>
              <button className="btn btn-primary w-100">Add Membership</button>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">2 month - 29999</h5>
              <p className="card-text">Plan details here</p>
              <button className="btn btn-primary w-100">Add Membership</button>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">3 month - 3999</h5>
              <p className="card-text">Plan details here</p>
              <button className="btn btn-primary w-100">Add Membership</button>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">4 month - 4999</h5>
              <p className="card-text">Plan details here</p>
              <button className="btn btn-primary w-100">Add Membership</button>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default MainContent;
