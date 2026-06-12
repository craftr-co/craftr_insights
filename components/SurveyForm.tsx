"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Loader2, MapPin } from "lucide-react";
import type { SharedLocation } from "@/lib/location";
import { cn } from "@/lib/utils";
import { playfair } from "@/lib/fonts";
import {
  INTEREST_OPTIONS,
  OCCASION_OPTIONS,
  type SurveyPayload,
} from "@/lib/survey";
import { CraftrNavbarLogo } from "@/components/CraftrLogo";

type Props = {
  name: string;
  email: string;
  avatarUrl: string | null;
};

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all",
        selected
          ? "border-craftr-primary bg-craftr-primary/15 text-craftr-text shadow-[0_0_12px_rgba(255,107,53,0.2)]"
          : "border-craftr-border bg-craftr-card text-craftr-muted hover:border-craftr-primary/50 hover:text-craftr-text"
      )}
    >
      {selected ? "✓ " : ""}
      {label}
    </button>
  );
}

export function SurveyForm({ name, email, avatarUrl }: Props) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [giftHusband, setGiftHusband] = useState("");
  const [giftBestFriend, setGiftBestFriend] = useState("");
  const [giftMother, setGiftMother] = useState("");
  const [giftFather, setGiftFather] = useState("");
  const [occasions, setOccasions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedLocation, setSharedLocation] = useState<SharedLocation | null>(null);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function shareLocation() {
    setLocationMessage(null);

    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this device.");
      return;
    }

    setLocationBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSharedLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationMessage("Location shared. Thank you — this helps us serve you better.");
        setLocationBusy(false);
      },
      (geoError) => {
        setLocationBusy(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setLocationMessage("Location access was denied. You can still submit the survey.");
          return;
        }
        setLocationMessage("Could not get your location. You can still submit the survey.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone || trimmedPhone.length < 8) {
      setError("Please enter a valid phone number with country code (e.g. +91 98765 43210).");
      return;
    }

    const hasGift =
      giftHusband.trim() ||
      giftBestFriend.trim() ||
      giftMother.trim() ||
      giftFather.trim();

    if (interests.length === 0 && !hasGift) {
      setError("Please select at least one interest or fill in at least one gift idea.");
      return;
    }

    const payload: SurveyPayload = {
      phone: trimmedPhone,
      interests,
      gift_husband: giftHusband.trim(),
      gift_best_friend: giftBestFriend.trim(),
      gift_mother: giftMother.trim(),
      gift_father: giftFather.trim(),
      occasions,
      additional_notes: additionalNotes.trim(),
      ...(sharedLocation ? { shared_location: sharedLocation } : {}),
    };

    setBusy(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      router.push("/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-craftr-bg">
      <header className="border-b border-craftr-border bg-craftr-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <CraftrNavbarLogo />
          <span className="text-xs text-craftr-muted">Insights survey</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
        <div className="text-center">
          <h1 className={cn(playfair.className, "text-3xl font-bold text-white md:text-4xl")}>
            Help us understand what you love
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-craftr-muted">
            Your answers shape the gifts we build at Craftr. This takes about 3 minutes.
          </p>
        </div>

        {/* Part 1 — verified identity */}
        <section className="mt-10 rounded-2xl border border-craftr-border bg-craftr-card p-6 shadow-glow">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-craftr-primary text-xs font-bold text-white">
              1
            </span>
            <h2 className={cn(playfair.className, "text-lg font-semibold text-white")}>
              Your details
            </h2>
          </div>
          <p className="mt-2 text-sm text-craftr-muted">
            Name and email are verified through your Google account.
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-xl border border-craftr-border bg-craftr-bg p-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-craftr-border object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-craftr-primary/20 text-lg font-semibold text-craftr-primary">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-craftr-text">{name}</p>
              <p className="truncate text-sm text-craftr-muted">{email}</p>
            </div>
            <span className="hidden items-center gap-1 rounded-full border border-craftr-success/30 bg-craftr-success/10 px-2.5 py-1 text-xs text-craftr-success sm:flex">
              <Check className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>

          <div className="mt-5">
            <label htmlFor="phone" className="block text-sm font-medium text-craftr-text">
              Phone number <span className="text-craftr-primary">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-craftr-border bg-craftr-bg px-4 py-3 text-sm text-craftr-text placeholder:text-craftr-muted focus:border-craftr-primary focus:outline-none focus:ring-1 focus:ring-craftr-primary"
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-craftr-text">Share location to serve you better</p>
            <p className="mt-1 text-xs text-craftr-muted">
              Optional. Helps us understand where customers are visiting from.
            </p>
            <button
              type="button"
              onClick={shareLocation}
              disabled={locationBusy || !!sharedLocation}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition disabled:opacity-60",
                sharedLocation
                  ? "border-craftr-success/40 bg-craftr-success/10 text-craftr-success"
                  : "border-craftr-border bg-craftr-bg text-craftr-text hover:border-craftr-primary/50"
              )}
            >
              {locationBusy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting location…
                </>
              ) : sharedLocation ? (
                <>
                  <Check className="h-4 w-4" />
                  Location shared
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Share location to serve you better
                </>
              )}
            </button>
            {locationMessage ? (
              <p
                className={cn(
                  "mt-2 text-xs",
                  sharedLocation ? "text-craftr-success" : "text-craftr-muted"
                )}
              >
                {locationMessage}
              </p>
            ) : null}
          </div>
        </section>

        {/* Part 2 — questions */}
        <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-6">
          <section className="rounded-2xl border border-craftr-border bg-craftr-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-craftr-primary text-xs font-bold text-white">
                2
              </span>
              <h2 className={cn(playfair.className, "text-lg font-semibold text-white")}>
                Your interests
              </h2>
            </div>
            <p className="mt-2 text-sm text-craftr-muted">What kind of things excite you? Pick all that apply.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={interests.includes(item)}
                  onToggle={() => toggleItem(interests, item, setInterests)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-craftr-border bg-craftr-card p-6">
            <h2 className={cn(playfair.className, "text-lg font-semibold text-white")}>
              Gift ideas for special occasions
            </h2>
            <p className="mt-2 text-sm text-craftr-muted">
              Imagine their birthday or anniversary is coming up — what would you gift them?
            </p>

            <div className="mt-5 space-y-5">
              {[
                { id: "husband", label: "Husband / partner", value: giftHusband, set: setGiftHusband },
                { id: "friend", label: "Best friend", value: giftBestFriend, set: setGiftBestFriend },
                { id: "mother", label: "Mother", value: giftMother, set: setGiftMother },
                { id: "father", label: "Father", value: giftFather, set: setGiftFather },
              ].map(({ id, label, value, set }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-craftr-text">
                    {label}
                  </label>
                  <textarea
                    id={id}
                    rows={2}
                    placeholder={`What would you gift your ${label.toLowerCase()}?`}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-craftr-border bg-craftr-bg px-4 py-3 text-sm text-craftr-text placeholder:text-craftr-muted focus:border-craftr-primary focus:outline-none focus:ring-1 focus:ring-craftr-primary"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-craftr-border bg-craftr-card p-6">
            <h2 className={cn(playfair.className, "text-lg font-semibold text-white")}>
              Occasions that matter to you
            </h2>
            <p className="mt-2 text-sm text-craftr-muted">Which celebrations do you shop gifts for most?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={occasions.includes(item)}
                  onToggle={() => toggleItem(occasions, item, setOccasions)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-craftr-border bg-craftr-card p-6">
            <label htmlFor="notes" className={cn(playfair.className, "text-lg font-semibold text-white")}>
              Anything else?
            </label>
            <p className="mt-2 text-sm text-craftr-muted">
              Dream gifts, budgets, styles you love — tell us anything that helps.
            </p>
            <textarea
              id="notes"
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Optional"
              className="mt-4 w-full resize-none rounded-xl border border-craftr-border bg-craftr-bg px-4 py-3 text-sm text-craftr-text placeholder:text-craftr-muted focus:border-craftr-primary focus:outline-none focus:ring-1 focus:ring-craftr-primary"
            />
          </section>

          {error ? (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-craftr-primary text-base font-semibold text-white transition hover:bg-[#e85f2f] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit responses"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
