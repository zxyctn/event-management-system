from rest_framework import permissions, viewsets

from .models import Event, EventJoiner
from .serializers import EventJoinerSerializer, EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventJoinerViewSet(viewsets.ModelViewSet):
    queryset = EventJoiner.objects.all()
    serializer_class = EventJoinerSerializer
    permission_classes = [permissions.IsAuthenticated]
