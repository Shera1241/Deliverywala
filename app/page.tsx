import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <span className="text-xl font-bold text-orange-600">Deliverywala</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-orange-600"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Deliver Anything,{" "}
            <span className="text-orange-600">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Deliverywala is an open source delivery management platform. Manage
            orders, track deliveries, and empower your delivery agents — all in
            one place.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Order Management</h3>
            <p className="text-gray-600">
              Place delivery orders, track them in real-time, and get notified
              at every step of the journey.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">🛵</div>
            <h3 className="text-xl font-semibold mb-2">Agent Dashboard</h3>
            <p className="text-gray-600">
              Delivery agents get a dedicated dashboard to accept orders, update
              status, and manage their deliveries.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
            <p className="text-gray-600">
              Full control over users, orders, and agents. Assign deliveries and
              manage your entire operation.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t bg-white py-8 text-center text-sm text-gray-500">
        <p>
          Deliverywala — Open Source Delivery Platform •{" "}
          <a
            href="https://github.com/shera1241/deliverywala"
            className="text-orange-600 hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
