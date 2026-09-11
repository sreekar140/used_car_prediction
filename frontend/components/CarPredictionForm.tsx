"use client";

import React, { useState } from "react";
import {
  BRAND_OPTIONS,
  FUEL_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  OWNER_TYPE_OPTIONS,
  SAMPLE_CAR,
  TRANSMISSION_OPTIONS,
} from "@/lib/constants";
import {
  predictCarPrice,
  type CarPredictionInput,
  type PredictionResponse,
} from "@/lib/api";
import PredictionResult from "@/components/PredictionResult";

interface FormErrors {
  [key: string]: string;
}

interface FormState {
  Year: string;
  Kilometers_Driven: string;
  Mileage: string;
  Engine: string;
  Power: string;
  Seats: string;
  Location: string;
  Fuel_Type: string;
  Transmission: string;
  Owner_Type: string;
  Brand: string;
}

const INITIAL_FORM_STATE: FormState = {
  Year: "",
  Kilometers_Driven: "",
  Mileage: "",
  Engine: "",
  Power: "",
  Seats: "5",
  Location: "",
  Fuel_Type: "",
  Transmission: "",
  Owner_Type: "",
  Brand: "",
};

export default function CarPredictionForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [lastSubmittedCar, setLastSubmittedCar] =
    useState<CarPredictionInput | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on input interaction
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const loadSampleData = () => {
    setFormData({
      Year: String(SAMPLE_CAR.Year),
      Kilometers_Driven: String(SAMPLE_CAR.Kilometers_Driven),
      Mileage: String(SAMPLE_CAR.Mileage),
      Engine: String(SAMPLE_CAR.Engine),
      Power: String(SAMPLE_CAR.Power),
      Seats: String(SAMPLE_CAR.Seats),
      Location: SAMPLE_CAR.Location,
      Fuel_Type: SAMPLE_CAR.Fuel_Type,
      Transmission: SAMPLE_CAR.Transmission,
      Owner_Type: SAMPLE_CAR.Owner_Type,
      Brand: SAMPLE_CAR.Brand,
    });
    setErrors({});
    setApiError(null);
    setPrediction(null);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setApiError(null);
    setPrediction(null);
    setLastSubmittedCar(null);
  };

  const validate = (): CarPredictionInput | null => {
    const newErrors: FormErrors = {};

    // 1. Brand
    if (!formData.Brand.trim()) {
      newErrors.Brand = "Please select a brand.";
    }

    // 2. Year
    const yearVal = parseInt(formData.Year, 10);
    const currentYear = new Date().getFullYear();
    if (!formData.Year.trim() || isNaN(yearVal)) {
      newErrors.Year = "Please enter a valid year.";
    } else if (yearVal < 1900 || yearVal > currentYear + 1) {
      newErrors.Year = `Year must be between 1900 and ${currentYear + 1}.`;
    }

    // 3. Location
    if (!formData.Location.trim()) {
      newErrors.Location = "Please select a location.";
    }

    // 4. Kilometers Driven
    const kmVal = parseInt(formData.Kilometers_Driven, 10);
    if (!formData.Kilometers_Driven.trim() || isNaN(kmVal)) {
      newErrors.Kilometers_Driven = "Please enter kilometers driven.";
    } else if (kmVal < 0) {
      newErrors.Kilometers_Driven = "Kilometers driven cannot be negative.";
    }

    // 5. Fuel Type
    if (!formData.Fuel_Type.trim()) {
      newErrors.Fuel_Type = "Please select fuel type.";
    }

    // 6. Transmission
    if (!formData.Transmission.trim()) {
      newErrors.Transmission = "Please select transmission.";
    }

    // 7. Owner Type
    if (!formData.Owner_Type.trim()) {
      newErrors.Owner_Type = "Please select owner type.";
    }

    // 8. Mileage
    const mileageVal = parseFloat(formData.Mileage);
    if (!formData.Mileage.trim() || isNaN(mileageVal)) {
      newErrors.Mileage = "Please enter mileage.";
    } else if (mileageVal < 0) {
      newErrors.Mileage = "Mileage cannot be negative.";
    }

    // 9. Engine
    const engineVal = parseFloat(formData.Engine);
    if (!formData.Engine.trim() || isNaN(engineVal)) {
      newErrors.Engine = "Please enter engine displacement (CC).";
    } else if (engineVal <= 0) {
      newErrors.Engine = "Engine displacement must be a positive number.";
    }

    // 10. Power
    const powerVal = parseFloat(formData.Power);
    if (!formData.Power.trim() || isNaN(powerVal)) {
      newErrors.Power = "Please enter power (bhp).";
    } else if (powerVal < 0) {
      newErrors.Power = "Power cannot be negative.";
    }

    // 11. Seats
    const seatsVal = parseInt(formData.Seats, 10);
    if (!formData.Seats.trim() || isNaN(seatsVal)) {
      newErrors.Seats = "Please enter number of seats.";
    } else if (seatsVal < 1 || seatsVal > 20) {
      newErrors.Seats = "Seats must be at least 1 (max 20).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    return {
      Year: yearVal,
      Kilometers_Driven: kmVal,
      Mileage: mileageVal,
      Engine: engineVal,
      Power: powerVal,
      Seats: seatsVal,
      Location: formData.Location,
      Fuel_Type: formData.Fuel_Type,
      Transmission: formData.Transmission,
      Owner_Type: formData.Owner_Type,
      Brand: formData.Brand,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const validPayload = validate();
    if (!validPayload) {
      // Focus on first error element
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey);
        element?.focus();
      }
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const result = await predictCarPrice(validPayload);
      setPrediction(result);
      setLastSubmittedCar(validPayload);

      // Smooth scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById("prediction-result");
        resultElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during price prediction.";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Action Header: Sample loader & Reset */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Vehicle Specification Form
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            All 11 parameters are required for accurate ML valuation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSampleData}
            disabled={isLoading}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            title="Load sample car data: 2018 Honda Diesel"
          >
            Load Example
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Global API / Network Error Alert */}
      {apiError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400"
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold">Prediction Failed</p>
              <p className="mt-1">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Prediction Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* GROUP 1: Vehicle Overview */}
        <fieldset className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
          <legend className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            1. Vehicle Overview
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div>
              <label
                htmlFor="Brand"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Car Brand <span className="text-red-500">*</span>
              </label>
              <select
                id="Brand"
                name="Brand"
                value={formData.Brand}
                onChange={handleInputChange}
                aria-invalid={!!errors.Brand}
                aria-describedby={errors.Brand ? "Brand-error" : undefined}
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Brand
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              >
                <option value="">Select Brand</option>
                {BRAND_OPTIONS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.Brand && (
                <p id="Brand-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Brand}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="Year"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Registration Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="Year"
                name="Year"
                min="1900"
                max="2100"
                placeholder="e.g. 2018"
                value={formData.Year}
                onChange={handleInputChange}
                aria-invalid={!!errors.Year}
                aria-describedby={errors.Year ? "Year-error" : undefined}
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Year
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              />
              {errors.Year && (
                <p id="Year-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Year}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="Location"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                City Location <span className="text-red-500">*</span>
              </label>
              <select
                id="Location"
                name="Location"
                value={formData.Location}
                onChange={handleInputChange}
                aria-invalid={!!errors.Location}
                aria-describedby={
                  errors.Location ? "Location-error" : undefined
                }
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Location
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              >
                <option value="">Select Location</option>
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.Location && (
                <p id="Location-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Location}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* GROUP 2: Usage & Ownership */}
        <fieldset className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
          <legend className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            2. Usage & Configuration
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Kilometers Driven */}
            <div>
              <label
                htmlFor="Kilometers_Driven"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Kilometers Driven <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  id="Kilometers_Driven"
                  name="Kilometers_Driven"
                  min="0"
                  step="500"
                  placeholder="e.g. 50000"
                  value={formData.Kilometers_Driven}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.Kilometers_Driven}
                  aria-describedby={
                    errors.Kilometers_Driven
                      ? "Kilometers_Driven-error"
                      : undefined
                  }
                  className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 pr-12 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                    errors.Kilometers_Driven
                      ? "border-red-500 focus-visible:outline-red-500"
                      : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-medium text-zinc-400">
                  km
                </span>
              </div>
              {errors.Kilometers_Driven && (
                <p
                  id="Kilometers_Driven-error"
                  className="mt-1.5 text-xs text-red-500"
                >
                  {errors.Kilometers_Driven}
                </p>
              )}
            </div>

            {/* Fuel Type */}
            <div>
              <label
                htmlFor="Fuel_Type"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                id="Fuel_Type"
                name="Fuel_Type"
                value={formData.Fuel_Type}
                onChange={handleInputChange}
                aria-invalid={!!errors.Fuel_Type}
                aria-describedby={
                  errors.Fuel_Type ? "Fuel_Type-error" : undefined
                }
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Fuel_Type
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              >
                <option value="">Select Fuel</option>
                {FUEL_TYPE_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              {errors.Fuel_Type && (
                <p
                  id="Fuel_Type-error"
                  className="mt-1.5 text-xs text-red-500"
                >
                  {errors.Fuel_Type}
                </p>
              )}
            </div>

            {/* Transmission */}
            <div>
              <label
                htmlFor="Transmission"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                id="Transmission"
                name="Transmission"
                value={formData.Transmission}
                onChange={handleInputChange}
                aria-invalid={!!errors.Transmission}
                aria-describedby={
                  errors.Transmission ? "Transmission-error" : undefined
                }
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Transmission
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              >
                <option value="">Select Transmission</option>
                {TRANSMISSION_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.Transmission && (
                <p
                  id="Transmission-error"
                  className="mt-1.5 text-xs text-red-500"
                >
                  {errors.Transmission}
                </p>
              )}
            </div>

            {/* Owner Type */}
            <div>
              <label
                htmlFor="Owner_Type"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Ownership History <span className="text-red-500">*</span>
              </label>
              <select
                id="Owner_Type"
                name="Owner_Type"
                value={formData.Owner_Type}
                onChange={handleInputChange}
                aria-invalid={!!errors.Owner_Type}
                aria-describedby={
                  errors.Owner_Type ? "Owner_Type-error" : undefined
                }
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Owner_Type
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              >
                <option value="">Select Ownership</option>
                {OWNER_TYPE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o} Owner
                  </option>
                ))}
              </select>
              {errors.Owner_Type && (
                <p
                  id="Owner_Type-error"
                  className="mt-1.5 text-xs text-red-500"
                >
                  {errors.Owner_Type}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* GROUP 3: Technical Specifications */}
        <fieldset className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
          <legend className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            3. Technical Specifications
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Engine Displacement */}
            <div>
              <label
                htmlFor="Engine"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Engine <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  id="Engine"
                  name="Engine"
                  min="1"
                  step="10"
                  placeholder="e.g. 1500"
                  value={formData.Engine}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.Engine}
                  aria-describedby={
                    errors.Engine ? "Engine-error" : undefined
                  }
                  className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 pr-12 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                    errors.Engine
                      ? "border-red-500 focus-visible:outline-red-500"
                      : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-medium text-zinc-400">
                  CC
                </span>
              </div>
              {errors.Engine && (
                <p id="Engine-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Engine}
                </p>
              )}
            </div>

            {/* Power */}
            <div>
              <label
                htmlFor="Power"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Max Power <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  id="Power"
                  name="Power"
                  min="0"
                  step="1"
                  placeholder="e.g. 120"
                  value={formData.Power}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.Power}
                  aria-describedby={errors.Power ? "Power-error" : undefined}
                  className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 pr-12 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                    errors.Power
                      ? "border-red-500 focus-visible:outline-red-500"
                      : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-medium text-zinc-400">
                  bhp
                </span>
              </div>
              {errors.Power && (
                <p id="Power-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Power}
                </p>
              )}
            </div>

            {/* Mileage */}
            <div>
              <label
                htmlFor="Mileage"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Fuel Economy <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  id="Mileage"
                  name="Mileage"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 18.5"
                  value={formData.Mileage}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.Mileage}
                  aria-describedby={
                    errors.Mileage ? "Mileage-error" : undefined
                  }
                  className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 pr-14 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                    errors.Mileage
                      ? "border-red-500 focus-visible:outline-red-500"
                      : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-medium text-zinc-400">
                  kmpl
                </span>
              </div>
              {errors.Mileage && (
                <p id="Mileage-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Mileage}
                </p>
              )}
            </div>

            {/* Seats */}
            <div>
              <label
                htmlFor="Seats"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Seating Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="Seats"
                name="Seats"
                min="1"
                max="20"
                placeholder="e.g. 5"
                value={formData.Seats}
                onChange={handleInputChange}
                aria-invalid={!!errors.Seats}
                aria-describedby={errors.Seats ? "Seats-error" : undefined}
                className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 ${
                  errors.Seats
                    ? "border-red-500 focus-visible:outline-red-500"
                    : "border-zinc-300 focus-visible:outline-emerald-600 dark:border-zinc-700"
                }`}
              />
              {errors.Seats && (
                <p id="Seats-error" className="mt-1.5 text-xs text-red-500">
                  {errors.Seats}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Submit Button Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 sm:flex-row dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Clicking predict sends a live valuation request to the Django ML
            inference API.
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Predicting...</span>
              </>
            ) : (
              <>
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Predict Price</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Render Prediction Result when available */}
      {prediction && (
        <PredictionResult
          predictedPrice={prediction.predicted_price}
          carData={lastSubmittedCar}
          onReset={resetForm}
        />
      )}
    </div>
  );
}
