import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl text-bridge-900">404</h1>
      <p className="mt-3 text-bridge-700">This page doesn't exist, or has moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
