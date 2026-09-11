from rest_framework import serializers

LOCATION_CHOICES = [
    "Ahmedabad", "Bangalore", "Chennai", "Coimbatore", "Delhi",
    "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Mumbai", "Pune",
]

FUEL_TYPE_CHOICES = [
    "CNG", "Diesel", "Electric", "LPG", "Petrol",
]

TRANSMISSION_CHOICES = [
    "Automatic", "Manual",
]

OWNER_TYPE_CHOICES = [
    "First", "Fourth & Above", "Second", "Third",
]

BRAND_CHOICES = [
    "Audi", "BMW", "Bentley", "Chevrolet", "Datsun", "Fiat", "Force", "Ford",
    "Honda", "Hyundai", "ISUZU", "Isuzu", "Jaguar", "Jeep", "Lamborghini",
    "Land", "Mahindra", "Maruti", "Mercedes-Benz", "Mini", "Mitsubishi",
    "Nissan", "Porsche", "Renault", "Skoda", "Tata", "Toyota", "Volkswagen", "Volvo",
]

class CarPredictionSerializer(serializers.Serializer):
    Year = serializers.IntegerField(min_value=1900, max_value=2100)
    Kilometers_Driven = serializers.IntegerField(min_value=0)
    Mileage = serializers.FloatField(min_value=0.0)
    Engine = serializers.FloatField(min_value=1.0)
    Power = serializers.FloatField(min_value=0.0)
    Seats = serializers.IntegerField(min_value=1)
    Location = serializers.ChoiceField(choices=LOCATION_CHOICES)
    Fuel_Type = serializers.ChoiceField(choices=FUEL_TYPE_CHOICES)
    Transmission = serializers.ChoiceField(choices=TRANSMISSION_CHOICES)
    Owner_Type = serializers.ChoiceField(choices=OWNER_TYPE_CHOICES)
    Brand = serializers.ChoiceField(choices=BRAND_CHOICES)