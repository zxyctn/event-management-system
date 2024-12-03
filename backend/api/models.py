from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Event(models.Model):
    title = models.CharField(max_length=100)
    organizer = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    date_and_time = models.DateTimeField()
    duration = models.PositiveIntegerField()
    location = models.CharField(max_length=100)
    joiners = models.ManyToManyField(
        "auth.User", through="EventJoiner", related_name="events"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


@receiver(post_save, sender=Event)
def create_event_participant(sender, instance, created, **kwargs):
    if created:
        EventJoiner.objects.create(event=instance, joiner=instance.organizer)


class EventJoiner(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    joiner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event.title} - {self.joiner.username}"
