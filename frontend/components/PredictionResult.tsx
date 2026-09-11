import React from "react";
import type { CarPredictionInput } from "@/lib/api";

interface PredictionResultProps {
  predictedPrice: number;
  carData?: CarPredictionInput | null;
  onReset?: () => void;
}

export default function PredictionResult({
  predictedPrice,
  carData,
  onReset,
}: PredictionResultProps) {
  const formattedLakhs = predictedPrice.toFixed(2);
  const approximateInr = Math.round(predictedPrice * 100000).toLocaleString(
    "en-IN"
  );

  return (
    <div
      id="prediction-result"
      className="mt-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-sm sm:p-8"
      role="region"
      aria-labelledby="prediction-heading"
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Machine Learning Valuation
          </div>
          <h2
            id="prediction-heading"
            className="mt-3 text-sm font-medium tracking-wide uppercase text-zinc-600 dark:text-zinc-400"
          >
            Estimated Used Car Price
          </h2>
          <div className="mt-2 flex items-baseline justify-center gap-2 sm:justify-start">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              ₹{formattedLakhs}
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Lakh
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Approx. ₹{approximateInr} INR
          </p>
        </div>

        {onReset && (
          <div className="mt-6 sm:mt-0">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Estimate Another Car
            </button>
          </div>
        )}
      </div>

      {carData && (
        <div className="mt-6 border-t border-zinc-200/80 pt-5 dark:border-zinc-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Evaluated Specifications
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Year} {carData.Brand}
            </span>
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Kilometers_Driven.toLocaleString()} km
            </span>
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Fuel_Type} ({carData.Transmission})
            </span>
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Engine} CC • {carData.Power} bhp
            </span>
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Mileage} kmpl • {carData.Seats} Seats
            </span>
            <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {carData.Location} • {carData.Owner_Type} Owner
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
