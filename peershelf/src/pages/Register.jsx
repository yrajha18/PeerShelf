import { useState } from "react";
import { signUp } from "../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { data, error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful 🎉");
      console.log(data);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;