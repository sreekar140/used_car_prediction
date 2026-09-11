import CarPredictionForm from "@/components/CarPredictionForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                Used Car Price Predictor
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Machine Learning Valuation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Random Forest Pipeline Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero Section */}
        <section className="mb-8 text-center sm:mb-12 sm:text-left">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <span>Enterprise ML Valuation</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Django REST Backend</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Estimate the Market Value of a Used Car
              </h2>
              <p className="mt-2.5 text-base text-zinc-600 dark:text-zinc-400">
                Predict the fair market value of any used car in India based on its
                specifications, mileage, power, engine capacity, and historical usage.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:flex-col sm:items-end sm:gap-1.5">
              <span className="inline-flex items-center rounded-lg bg-zinc-200/60 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                11 Evaluated Features
              </span>
              <span className="inline-flex items-center rounded-lg bg-zinc-200/60 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Trained on 6,000+ Cars
              </span>
            </div>
          </div>
        </section>

        {/* Prediction Card */}
        <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <CarPredictionForm />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Used Car Price Predictor • Powered by Scikit-Learn Random Forest
            Regressor &amp; Django REST Framework
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>Accuracy: Optimized via CV MAE</span>
            <span>Target Currency: ₹ Lakhs (INR)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
