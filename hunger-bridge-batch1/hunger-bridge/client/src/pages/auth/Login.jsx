import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { useAuth } from "../../context/AuthContext";
import { dashboardPathForRole } from "../../utils/roleRouting";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login(form);
      const redirectTo = location.state?.from?.pathname || dashboardPathForRole(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <Link to="/" className="flex items-center gap-2 font-display text-xl text-bridge-800">
        <Sprout className="h-6 w-6 text-bridge-500" />
        Hunger Bridge
      </Link>

      <h1 className="mt-8 font-display text-2xl text-bridge-900">Welcome back</h1>
      <p className="mt-1 text-sm text-bridge-600">Log in to manage your donations and requests.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-bridge-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-bridge-700 underline">
          Register here
        </Link>
      </p>

      <div className="mt-10 rounded border border-bridge-100 bg-bridge-50 p-4 text-xs text-bridge-600">
        <p className="font-medium text-bridge-800">Demo accounts (password: Password123!)</p>
        <p className="mt-1">Admin — admin@hungerbridge.com</p>
        <p>Donor — donor@hungerbridge.com</p>
        <p>Approved NGO — ngo.approved@hungerbridge.com</p>
      </div>
    </div>
  );
}
