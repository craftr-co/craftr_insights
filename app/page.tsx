import { Suspense } from "react";
import LandingPage from "./LandingPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-craftr-bg text-craftr-muted">
          Loading…
        </div>
      }
    >
      <LandingPage />
    </Suspense>
  );
}
