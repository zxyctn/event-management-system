from django.contrib import admin

from .models import Event, EventJoiner

admin.site.register(Event)
admin.site.register(EventJoiner)
