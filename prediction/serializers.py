from rest_framework import serializers

class CarPredictionSerializer(serializers.Serializer):
    Year = serializers.IntegerField()
    Kilometers_Driven = serializers.IntegerField()
    Mileage = serializers.FloatField()
    Engine = serializers.FloatField()
    Power = serializers.FloatField()
    Seats = serializers.IntegerField()
    Location = serializers.CharField()
    Fuel_Type = serializers.CharField()
    Transmission = serializers.CharField()
    Owner_Type = serializers.CharField()
    Brand = serializers.CharField()