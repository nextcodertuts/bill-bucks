/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, PhoneCall } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  name: string;
  phoneNumber: string;
}

export default function InviteFriendsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const requestContacts = async () => {
      try {
        if (window.ReactNativeWebView) {
          // Request contacts through React Native bridge
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: "GET_CONTACTS" })
          );

          // Listen for contacts data from React Native
          window.addEventListener("message", function handleMessage(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === "CONTACTS_RESULT") {
                if (data.error) {
                  toast.error("Failed to get contacts: " + data.error);
                } else {
                  setContacts(data.contacts);
                }
                setLoading(false);
              }
            } catch (e) {
              // Ignore non-JSON messages
            }
          });
        } else {
          // For web browser - show message that contacts are only available in app
          toast.error("Contact access is only available in the mobile app");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error accessing contacts:", error);
        toast.error("Failed to access contacts");
        setLoading(false);
      }
    };

    requestContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phoneNumber.includes(searchQuery)
  );

  const handleInvite = async (contact: Contact) => {
    try {
      if (window.ReactNativeWebView) {
        // Send invite through React Native
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "SEND_INVITE",
            data: {
              phoneNumber: contact.phoneNumber,
              message: `Hey! Join BillBuckz and start earning cashback on your bills. Use my referral code when signing up!`,
            },
          })
        );
      } else {
        // Fallback for web - show message that invites are only available in app
        toast.error("Invites are only available in the mobile app");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Failed to send invite");
    }
  };

  return (
    <div className="container mx-auto space-y-4 mt-4">
      <Card className="rounded-none border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Invite Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!window.ReactNativeWebView ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Contact access is only available in the mobile app.
                <br />
                Please download our app to invite your friends.
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 h-16 rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No contacts found
                    </p>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.phoneNumber}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {contact.name || "Unknown Contact"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.phoneNumber}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleInvite(contact)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
