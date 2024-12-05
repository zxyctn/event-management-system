from django.contrib.auth.models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Event, EventJoiner
from .serializers import EventJoinerSerializer, EventSerializer, UserSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class EventJoinerViewSet(viewsets.ModelViewSet):
    queryset = EventJoiner.objects.all()
    serializer_class = EventJoinerSerializer
    permission_classes = [permissions.IsAuthenticated]


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            "user": {
                "username": user.username,
                "email": user.email,
            },
            "access": access_token,
            "refresh": refresh_token,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class JoinEventView(generics.GenericAPIView):
    queryset = EventJoiner.objects.all()
    serializer_class = EventJoinerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = self.kwargs["id"]
        event = Event.objects.get(id=event_id)

        event_joiner = EventJoiner.objects.create(event=event, joiner=request.user)

        return Response(
            {"message": "You have joined the event", "event": event.title},
            status=status.HTTP_201_CREATED,
        )


class LeaveEventView(generics.GenericAPIView):
    queryset = EventJoiner.objects.all()
    serializer_class = EventJoinerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = self.kwargs["id"]
        event = Event.objects.get(id=event_id)

        event_joiner = EventJoiner.objects.get(event=event, joiner=request.user)
        event_joiner.delete()

        return Response(
            {"event": event.title, "message": "You have left the event"},
            status=status.HTTP_204_NO_CONTENT,
        )
