from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Event, EventJoiner


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


class EventJoinerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventJoiner
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
