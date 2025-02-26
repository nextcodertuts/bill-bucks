import { validateRequest } from "@/lib/auth";

export default async function UserProfilePage() {
  const { user } = await validateRequest();

  const userName = user?.name || "Anonymous";
  const userPhone = user?.phoneNumber || "Not provided";
  const isSubscribed = user?.subscribe || false;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="max-w-3xl mx-auto py-10 px-6  mt-24">
      {/* Profile Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        {/* Profile Avatar */}
        <div className="h-20 w-20 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md">
          {initials}
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold capitalize">{userName}</h1>
          <p className="text-gray-600 text-sm">📞 {userPhone}</p>

          {/* Subscription Status */}
          {/* <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              isSubscribed ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Not Subscribed"}
          </span> */}
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Membership Status:</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              isSubscribed ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
            }`}
          >
            {isSubscribed ? "Premium Member" : "Active User"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Account Created:</span>
          <span className="text-gray-500 text-sm">
            {new Date(user?.createdAt || "").toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}
