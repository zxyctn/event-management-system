from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

import api.consumers as consumers
from api.views import (
    EventJoinerViewSet,
    EventViewSet,
    JoinEventView,
    LeaveEventView,
    LogoutView,
    MeView,
    SignUpView,
)

router = routers.DefaultRouter()
router.register(r"events", EventViewSet)
router.register(r"event-joiners", EventJoinerViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/", SignUpView.as_view(), name="auth_signup"),
    path("me/", MeView.as_view(), name="auth_me"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("api/events/<int:id>/join/", JoinEventView.as_view(), name="join_event"),
    path("api/events/<int:id>/leave/", LeaveEventView.as_view(), name="leave_event"),
]


websocket_urlpatterns = [
    path("ws/events/", consumers.EventConsumer.as_asgi()),
    path("ws/event/<int:id>/", consumers.EventInstanceConsumer.as_asgi()),
]
