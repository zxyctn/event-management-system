from rest_framework import status
from rest_framework.test import APITestCase


class EventAPITestCase(APITestCase):
    def setUp(self):
        self.user1_data = {
            "username": "user1",
            "email": "user1@example.com",
            "password": "UYGbwefuyY134!@",
            "password2": "UYGbwefuyY134!@",
        }
        self.user2_data = {
            "username": "user2",
            "email": "user2@example.com",
            "password": "dsvWEFG2rf@#",
            "password2": "dsvWEFG2rf@#",
        }

        self.user1 = self.client.post("/signup/", self.user1_data, format="json")
        self.user1_tokens = self.user1.data

        self.user2 = self.client.post("/signup/", self.user2_data, format="json")
        self.user2_tokens = self.user2.data

        # Authenticate user1
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.user1_tokens['access']}"
        )

        # Create an event
        self.event_data = {
            "title": "Sample Event",
            "date_and_time": "2024-12-06T18:00:00Z",
            "duration": 120,
            "location": "Sample Location",
        }
        self.event_response = self.client.post(
            "/api/events/", self.event_data, format="json"
        )
        self.event = self.event_response.data

    def test_event_workflow(self):
        # Check event created by user1
        self.assertEqual(self.event_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.event["title"], self.event_data["title"])
        self.assertEqual(self.event["organizer"]["username"], "user1")

        # Authenticate user2
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.user2_tokens['access']}"
        )

        # Join the event as user2
        join_response = self.client.post(
            f"/api/events/{self.event['id']}/join/", {}, format="json"
        )
        self.assertEqual(join_response.status_code, status.HTTP_201_CREATED)
        self.assertIn("You have joined the event", join_response.data["message"])

        # Verify user2 joined
        event_details = self.client.get(
            f"/api/events/{self.event['id']}/", format="json"
        )
        self.assertEqual(len(event_details.data["joiners"]), 2)
        self.assertEqual(event_details.data["joiners"][0]["username"], "user1")
        self.assertEqual(event_details.data["joiners"][1]["username"], "user2")

        # Leave the event as user2
        leave_response = self.client.post(
            f"/api/events/{self.event['id']}/leave/", {}, format="json"
        )
        self.assertEqual(leave_response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify user2 left
        event_details_after_leave = self.client.get(
            f"/api/events/{self.event['id']}/", format="json"
        )
        self.assertEqual(len(event_details_after_leave.data["joiners"]), 1)

        # Delete the event as user1
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.user1_tokens['access']}"
        )
        delete_response = self.client.delete(f"/api/events/{self.event['id']}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify event deletion
        event_details_after_delete = self.client.get(f"/api/events/{self.event['id']}/")
        self.assertEqual(
            event_details_after_delete.status_code, status.HTTP_404_NOT_FOUND
        )
