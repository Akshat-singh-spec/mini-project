import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Building2,
  ClipboardCheck,
  Truck,
  PackageCheck,
  ShieldCheck,
  Clock,
  ThermometerSun,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: UtensilsCrossed,
    title: "A donor lists surplus food",
    text: "Restaurants, hotels, caterers, and event hosts publish details of food that's ready to go — quantity, type, and pickup window.",
  },
  {
    icon: Building2,
    title: "A verified NGO requests it",
    text: "Nearby NGOs browse listings by city and food type, then send a request for the donations that match who they serve.",
  },
  {
    icon: ClipboardCheck,
    title: "The donor confirms",
    text: "The donor reviews incoming requests and accepts the NGO best placed to collect and distribute the food quickly.",
  },
  {
    icon: Truck,
    title: "Collection is coordinated",
    text: "Both sides get notified immediately, and the donation's status is tracked from pickup through to delivery.",
  },
  {
    icon: PackageCheck,
    title: "Food reaches people who need it",
    text: "The NGO distributes the food and marks the donation complete, closing the loop from surplus to plate.",
  },
];

const DONOR_BENEFITS = [
  "Turn surplus into impact instead of waste disposal costs",
  "Simple listing flow — post a donation in under two minutes",
  "Stay in control: review and accept requests yourself",
  "Track every donation's status from listing to completion",
];

const NGO_BENEFITS = [
  "Browse real-time listings filtered by city and food type",
  "Request donations that match the people you serve",
  "Verified badge builds trust with donors",
  "In-app notifications the moment a donor accepts",
];

const FOOD_SAFETY_POINTS = [
  {
    icon: Clock,
    title: "Time-bound listings",
    text: "Every donation includes an expiry window, so NGOs always know how urgently food needs to be collected.",
  },
  {
    icon: ThermometerSun,
    title: "Clear food categorisation",
    text: "Cooked meals, raw ingredients, bakery, and packaged items are labelled separately so handling expectations are clear.",
  },
  {
    icon: ShieldCheck,
    title: "Verified NGOs only",
    text: "Every NGO account is manually reviewed by an admin before it can collect donations on the platform.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-bridge-900 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grain)" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-harvest-300">
              A bridge, not a bin
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
              Surplus food finds its way to people who need it&nbsp;— before it's too late.
            </h1>
            <p className="mt-5 max-w-md text-bridge-100">
              Hunger Bridge connects restaurants, hotels, caterers, and event organizers with
              verified NGOs, so good food is collected and redistributed within hours, not thrown
              away.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-accent">
                List a donation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-secondary border-bridge-200 text-white hover:bg-white/10">
                Join as an NGO
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="card border-bridge-700 bg-bridge-800/60 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-harvest-300">Live on the platform</p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Surplus Veg Thali", qty: "60 plates", city: "Greater Noida" },
                  { name: "Packaged Bakery Items", qty: "25 packets", city: "Greater Noida" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded border border-bridge-700 bg-bridge-900/40 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-bridge-300">{item.city}</p>
                    </div>
                    <span className="rounded bg-harvest-400/20 px-2 py-1 text-xs font-medium text-harvest-300">
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <h2 className="font-display text-3xl text-bridge-900">About Hunger Bridge</h2>
          <div className="space-y-4 text-bridge-700">
            <p>
              Every day, kitchens, banquet halls, and events across the city end up with more food
              than they can use — while nearby, NGOs are stretched thin trying to feed people who
              have none. Hunger Bridge exists to close that gap.
            </p>
            <p>
              The platform gives donors a fast way to list what they have, gives NGOs a live feed
              of what's available near them, and keeps both sides accountable with a request-and-accept
              workflow, status tracking, and notifications at every step.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-bridge-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl text-bridge-900">How it works</h2>
          <p className="mt-3 max-w-xl text-bridge-700">
            Five steps take a donation from a full kitchen to a family's table.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bridge-500 text-white">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-bridge-900">{step.title}</h3>
                <p className="mt-2 text-sm text-bridge-700">{step.text}</p>
                {index < STEPS.length - 1 && (
                  <div className="mt-4 hidden h-px w-full bg-bridge-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-bridge-900">Built for both sides of the bridge</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="font-display text-xl text-bridge-900">For donors</h3>
            <p className="mt-2 text-sm text-bridge-600">
              Restaurants, hotels, caterers, and event organizers
            </p>
            <ul className="mt-6 space-y-3">
              {DONOR_BENEFITS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-bridge-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bridge-500" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary mt-8">
              Register as a donor
            </Link>
          </div>

          <div className="card p-8">
            <h3 className="font-display text-xl text-bridge-900">For NGOs</h3>
            <p className="mt-2 text-sm text-bridge-600">Verified organizations that distribute food</p>
            <ul className="mt-6 space-y-3">
              {NGO_BENEFITS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-bridge-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-400" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-accent mt-8">
              Register as an NGO
            </Link>
          </div>
        </div>
      </section>

      <section id="food-safety" className="bg-bridge-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl text-white">Food safety, built into the workflow</h2>
          <p className="mt-3 max-w-xl text-bridge-200">
            Hunger Bridge doesn't move food itself — it makes sure the people who do have the
            information they need to handle it responsibly.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {FOOD_SAFETY_POINTS.map((point) => (
              <div key={point.title} className="rounded-lg border border-bridge-700 bg-bridge-800/50 p-6">
                <point.icon className="h-6 w-6 text-harvest-300" />
                <h3 className="mt-4 text-base font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm text-bridge-200">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-bridge-900">Ready to be part of the bridge?</h2>
        <p className="mx-auto mt-3 max-w-md text-bridge-700">
          Whether you have food to give or people to feed, it takes two minutes to get started.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-primary">
            Create an account
          </Link>
          <Link to="/login" className="btn-secondary">
            I already have one
          </Link>
        </div>
      </section>
    </div>
  );
}
