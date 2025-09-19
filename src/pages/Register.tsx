import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/trips");
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-bold">Register</h1>
      <input
        type="email"
        className="p-2 border w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="p-2 border w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </form>
  );
}
