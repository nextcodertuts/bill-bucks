import WithdrawalForm from "@/components/WithdrawalForm";
import WithdrawalHistory from "@/components/WithdrawalHistory";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WithdrawalsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Withdraw Funds</h1>
      <WithdrawalForm />
      <WithdrawalHistory />
    </div>
  );
}
