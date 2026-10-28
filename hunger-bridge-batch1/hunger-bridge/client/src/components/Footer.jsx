import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-bridge-100 bg-bridge-900 text-bridge-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg text-white">
              <Sprout className="h-5 w-5 text-harvest-400" />
              Hunger Bridge
            </div>
            <p className="mt-3 text-sm text-bridge-200">
              A bridge between surplus food and the people who need it, built by students who
              believe good food shouldn't go to waste.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-bridge-200">
              <li><a href="/#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="/#benefits" className="hover:text-white">Who it's for</a></li>
              <li><a href="/#food-safety" className="hover:text-white">Food safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Get involved</h4>
            <ul className="mt-3 space-y-2 text-sm text-bridge-200">
              <li><a href="/register" className="hover:text-white">Register as a donor</a></li>
              <li><a href="/register" className="hover:text-white">Register as an NGO</a></li>
              <li><a href="/login" className="hover:text-white">Log in</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">About this project</h4>
            <p className="mt-3 text-sm text-bridge-200">
              Hunger Bridge is a B.Tech CSE third-year mini-project demonstrating a full-stack
              food donation and redistribution workflow.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-bridge-800 pt-6 text-xs text-bridge-300">
          © {new Date().getFullYear()} Hunger Bridge. Built for academic demonstration purposes.
        </div>
      </div>
    </footer>
  );
}
