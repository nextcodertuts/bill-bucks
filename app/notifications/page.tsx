"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userIds, setUserIds] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification: {
            title,
            body: message,
            imageUrl: imageUrl.trim() || undefined,
          },
          data: {
            type: "general",
            timestamp: new Date().toISOString(),
          },
          userIds: userIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Notification sent successfully! (Success: ${result.results.success}, Failed: ${result.results.failure})`
        );
        setTitle("");
        setMessage("");
        setImageUrl("");
        setUserIds("");
      } else {
        throw new Error(result.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Send Push Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">
                Notification Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="message">
                Notification Message *
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="imageUrl">
                Image URL (optional)
              </label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="userIds">
                User IDs (optional, comma-separated)
              </label>
              <Input
                id="userIds"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                placeholder="Enter user IDs, comma-separated"
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to send to all users
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
