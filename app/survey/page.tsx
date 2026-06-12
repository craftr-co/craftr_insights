import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SurveyForm } from "@/components/SurveyForm";

export default async function SurveyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/?error=sign_in_required");
  }

  const name = session.user.name ?? session.user.email.split("@")[0];
  const email = session.user.email;
  const avatarUrl = session.user.image ?? null;

  return <SurveyForm name={name} email={email} avatarUrl={avatarUrl} />;
}
