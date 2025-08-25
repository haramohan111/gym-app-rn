import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

export default function SignupLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      alert('Signup successful');
      await axios.post('http://localhost:5000/verify', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      alert('Login successful');
      await axios.post('http://localhost:5000/verify', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Signup / Login</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
