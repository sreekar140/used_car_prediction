
import pandas as pd
# Create your views here.
from .serializers import CarPredictionSerializer

import joblib
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

model = joblib.load(settings.BASE_DIR / "car_price_model.pkl")

@api_view(["POST"])
def predict_price(request):
    serializer = CarPredictionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    input_df = pd.DataFrame([data])
    try:
        prediction = model.predict(input_df)
        return Response({"predicted_price": round(float(prediction[0]), 2)})
    except Exception as e:
        return Response(
            {"error": f"Model inference failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )