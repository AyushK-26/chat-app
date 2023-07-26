import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  // HANDLING ON SUBMIT EVENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      // USER PROMISE
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // UPLOADING AVATAR IN THE STORAGE BUCKET
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("File is uploading...");
        },
        (error) => {
          setErr(true);
        },
        async () => {
          // UPDATING USER OBJECT WITH DISPLAY NAME AND AVATAR URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          // ADDING THE DOCUMENT INTO THE FIRESTORE DATABASE COLLECTION
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");
        }
      );
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter display name" />
          <input type="email" placeholder="Enter email" />
          <input type="password" placeholder="Enter password" />
          <input style={{ display: "none" }} type="file" id="file" required />
          <label htmlFor="file">
            <img src={Add} alt="Add Avatar" />
            <span>Add an avatar</span>
          </label>
          <button type="submit">Sign Up</button>
          {err && <span>Something went wrong!</span>}
        </form>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
