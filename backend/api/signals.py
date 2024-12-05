from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Event, EventJoiner


@receiver(post_save, sender=Event)
def create_event_joiner(sender, instance, created, **kwargs):
    if created:
        EventJoiner.objects.create(event=instance, joiner=instance.organizer)


@receiver(post_save, sender=Event)
def event_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        "id": instance.id,
        "title": instance.title,
        "date_and_time": instance.date_and_time.isoformat(),
        "location": instance.location,
        "organizer": {
            "id": instance.organizer.id,
            "username": instance.organizer.username,
        },
        "duration": instance.duration,
        "joiners": [
            {"id": joiner.id, "username": joiner.username}
            for joiner in instance.joiners.all()
        ],
    }
    event_type = "created" if created else "updated"

    # Notify global events listeners
    async_to_sync(channel_layer.group_send)(
        "events",
        {
            "type": "event_update",
            "event": {"type": event_type, "data": data},
        },
    )

    # Notify event's listeners
    async_to_sync(channel_layer.group_send)(
        f"event_{instance.id}",
        {
            "type": "event_instance_update",
            "event": {"type": event_type, "data": data},
        },
    )


@receiver(post_delete, sender=Event)
def event_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = {"id": instance.id, "title": instance.title}

    # Notify gloabal events listeners
    async_to_sync(channel_layer.group_send)(
        "events",
        {
            "type": "event_update",
            "event": {"type": "deleted", "data": data},
        },
    )

    # Notify event's listeners
    async_to_sync(channel_layer.group_send)(
        f"event_{instance.id}",
        {
            "type": "event_instance_update",
            "event": {"type": "deleted", "data": data},
        },
    )


@receiver(post_save, sender=EventJoiner)
def event_joiner_created(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    event = instance.event
    data = {
        "event_id": event.id,
        "joiners": [
            {"id": joiner.id, "username": joiner.username}
            for joiner in event.joiners.all()
        ],
    }

    # Notify gloabal events listeners
    async_to_sync(channel_layer.group_send)(
        f"event_{event.id}",
        {
            "type": "event_instance_update",
            "event": {"type": "joiner_created", "data": data},
        },
    )

    # Notify event's listeners
    async_to_sync(channel_layer.group_send)(
        "events",
        {
            "type": "event_update",
            "event": {"type": "joiner_created", "data": data},
        },
    )


@receiver(post_delete, sender=EventJoiner)
def event_joiner_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    event = instance.event
    data = {
        "event_id": event.id,
        "joiners": [
            {"id": joiner.id, "username": joiner.username}
            for joiner in event.joiners.all()
        ],
    }

    # Notify gloabal events listeners
    async_to_sync(channel_layer.group_send)(
        f"event_{event.id}",
        {
            "type": "event_instance_update",
            "event": {"type": "joiner_deleted", "data": data},
        },
    )

    # Notify event's listeners
    async_to_sync(channel_layer.group_send)(
        "events",
        {
            "type": "event_update",
            "event": {"type": "joiner_deleted", "data": data},
        },
    )
