import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CraftrNavbarLogo } from "@/components/CraftrLogo";
import { cn } from "@/lib/utils";
import { playfair, dmSans } from "@/lib/fonts";

export default function ThankYouPage() {
  return (
    <div className={cn(dmSans.className, "flex min-h-screen flex-col bg-craftr-bg")}>
      <header className="border-b border-craftr-border px-4 py-4">
        <CraftrNavbarLogo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-12 text-center">
        <div className="rounded-full border border-craftr-success/30 bg-craftr-success/10 p-4">
          <CheckCircle2 className="h-12 w-12 text-craftr-success" />
        </div>
        <h1 className={cn(playfair.className, "mt-8 text-3xl font-bold text-white md:text-4xl")}>
          Thank you!
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-craftr-muted">
          Your responses have been sent. They help us craft better gifts at Craftr.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-xl border border-craftr-border px-6 py-3 text-sm text-craftr-muted transition hover:border-craftr-primary/50 hover:text-craftr-text"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
