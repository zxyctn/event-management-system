from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import EventJoinerViewSet, EventViewSet

router = routers.DefaultRouter()
router.register(r"events", EventViewSet)
router.register(r"event-joiners", EventJoinerViewSet)

urlpatterns = router.urls
urlpatterns += [
    path("api-auth/", include("rest_framework.urls")),
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
