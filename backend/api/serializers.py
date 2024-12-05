from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Event, EventJoiner


class EventSerializer(serializers.ModelSerializer):
    joiners = serializers.SerializerMethodField()
    organizer = serializers.SerializerMethodField()

    def get_joiners(self, obj):
        return [
            {"username": joiner.username, "id": joiner.id}
            for joiner in obj.joiners.all()
        ]

    def get_organizer(self, obj):
        return {"username": obj.organizer.username, "id": obj.organizer.id}

    class Meta:
        model = Event
        fields = "__all__"


class EventJoinerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventJoiner
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "password2")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        email = validated_data["email"]

        if not email:
            raise serializers.ValidationError({"email": "This field is required."})

        user = User.objects.create(username=validated_data["username"], email=email)
        password = validated_data.pop("password")
        user.set_password(password)
        user.save()

        return user
