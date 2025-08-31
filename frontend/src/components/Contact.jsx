import React from "react";

const Contact = () => {
  return (
    <div className="container py-5">
      {/* Contact Heading */}
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row">
        {/* Contact Info */}
        <div className="col-md-5">
          <h4>Gym Location</h4>
          <p><strong>Address:</strong> 123 Fitness Street, Bhubaneswar, Odisha</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> info@mygym.com</p>
          <p><strong>Working Hours:</strong> Mon - Sat: 6:00 AM - 10:00 PM</p>
        </div>

        {/* Contact Form */}
        <div className="col-md-7">
          <h4>Send us a Message</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="4" placeholder="Enter your message"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-5">
        <h4 className="text-center mb-3">Find Us Here</h4>
        <div className="ratio ratio-16x9">
          <iframe
            title="gym-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.810301312345!2d85.83125821476318!3d20.296058586387188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7f1aaf74f7b%3A0x8a67af482d3efea5!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1693311223344!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
