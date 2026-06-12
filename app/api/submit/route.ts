import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSubmissionEmail } from "@/lib/send-email";
import { getIpLocationFromRequest, parseSharedLocation } from "@/lib/location";
import type { SurveyPayload } from "@/lib/survey";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: SurveyPayload;
  try {
    body = (await request.json()) as SurveyPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  if (!phone || phone.length < 8) {
    return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
  }

  const interests = Array.isArray(body.interests) ? body.interests.filter(Boolean) : [];
  const occasions = Array.isArray(body.occasions) ? body.occasions.filter(Boolean) : [];
  const giftHusband = body.gift_husband?.trim() ?? "";
  const giftBestFriend = body.gift_best_friend?.trim() ?? "";
  const giftMother = body.gift_mother?.trim() ?? "";
  const giftFather = body.gift_father?.trim() ?? "";
  const additionalNotes = body.additional_notes?.trim() ?? "";

  const hasGift = giftHusband || giftBestFriend || giftMother || giftFather;
  if (interests.length === 0 && !hasGift) {
    return NextResponse.json(
      { error: "Select at least one interest or provide a gift idea" },
      { status: 400 }
    );
  }

  const name = session.user?.name ?? email.split("@")[0];
  const sharedLocation = parseSharedLocation(body.shared_location);
  const approxLocation = getIpLocationFromRequest(request);

  try {
    await sendSubmissionEmail({
      name,
      email,
      imageUrl: session.user?.image,
      phone,
      sharedLocation,
      approxLocation,
      interests,
      giftHusband,
      giftBestFriend,
      giftMother,
      giftFather,
      occasions,
      additionalNotes,
      submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });
  } catch (emailErr) {
    console.error("Email notification failed:", emailErr);
    return NextResponse.json(
      { error: "Could not send email. Check GMAIL_USER and GMAIL_APP_PASSWORD." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
