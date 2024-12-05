import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Event


class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "events"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type")
        event_id = data.get("event_id")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "event_update",
                "event": data,
            },
        )

    async def event_update(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))


class EventInstanceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"event_{self.event_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def event_instance_update(self, event):
        await self.send(text_data=json.dumps(event))
