export interface CarPredictionInput {
  Year: number;
  Kilometers_Driven: number;
  Mileage: number;
  Engine: number;
  Power: number;
  Seats: number;
  Location: string;
  Fuel_Type: string;
  Transmission: string;
  Owner_Type: string;
  Brand: string;
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface ApiErrorDetail {
  [key: string]: string[] | string | undefined;
  error?: string;
  detail?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Sends a car prediction payload to the Django REST Framework backend
 * and returns the estimated market price in Lakhs.
 */
export async function predictCarPrice(
  data: CarPredictionInput
): Promise<PredictionResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err: unknown) {
    // Network errors (e.g. backend offline, connection refused)
    throw new Error(
      "Unable to connect to the prediction server. Please make sure the Django backend is running at " +
        API_BASE_URL
    );
  }

  if (!response.ok) {
    let errorJson: ApiErrorDetail | null = null;
    try {
      errorJson = await response.json();
    } catch {
      // Body is not JSON (e.g. HTML error page)
    }

    if (response.status === 400 && errorJson) {
      // DRF field-level serializer errors
      const errorEntries = Object.entries(errorJson)
        .filter(([k]) => k !== "error" && k !== "detail")
        .map(([field, errs]) => {
          const formattedErrs = Array.isArray(errs) ? errs.join(" ") : String(errs);
          return `${field}: ${formattedErrs}`;
        });

      if (errorEntries.length > 0) {
        throw new Error(errorEntries.join(" | "));
      }
      if (errorJson.error || errorJson.detail) {
        throw new Error(String(errorJson.error || errorJson.detail));
      }
      throw new Error("Invalid car data submitted. Please check the form fields.");
    }

    if (response.status === 500) {
      throw new Error(
        errorJson?.error ||
          "A server error occurred during prediction. Please verify your inputs and try again."
      );
    }

    const fallbackMsg =
      errorJson?.error ||
      errorJson?.detail ||
      `Prediction failed with status ${response.status} (${response.statusText})`;
    throw new Error(String(fallbackMsg));
  }

  const result: unknown = await response.json();

  if (
    !result ||
    typeof result !== "object" ||
    !("predicted_price" in result) ||
    typeof (result as { predicted_price: unknown }).predicted_price !== "number" ||
    isNaN((result as { predicted_price: number }).predicted_price)
  ) {
    throw new Error("Invalid prediction response received from the backend.");
  }

  return result as PredictionResponse;
}
