'use client';
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../Components/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import '../Login/NewLogin.css'

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");  // State for phone number
  const [phoneError, setPhoneError] = useState("");  // State for phone number validation error

  // Function to validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/;  // Regular expression to check 10 digits
    return regex.test(phoneNumber);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate phone number before submitting
    if (!validatePhoneNumber(phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

   
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          phone: phone, // Save phone number in Firestore
          wallet:0,
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (

    <div className="auth-wrapper mt-10 ">
      

      <div className="auth-inner " >
        <form onSubmit={handleRegister}>
        <div className="logo-img">
          <img src="campuslogo.png" alt="Campus Logo" />
        </div>
          <h3>Sign Up</h3>

          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number"
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
            />
            {phoneError && <div style={{ color: "red", marginTop: "5px" }}>{phoneError}</div>}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered? <a href="/login">Login</a>
          </p>
        </form>

        </div>
    </div>
  );
}

export default Signup;
