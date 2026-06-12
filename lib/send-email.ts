import nodemailer from "nodemailer";

function getMailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim() || user;

  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD are required");
  }
  if (!to) {
    throw new Error("NOTIFY_EMAIL or GMAIL_USER is required");
  }

  return {
    to,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
    from: `"Craftr Insights" <${user}>`,
  };
}

const PROFILE_CID = "profile-picture";

function getProfileEmailParts(imageUrl?: string | null) {
  if (!imageUrl?.trim()) {
    return { attachments: [], profileHtml: "" };
  }

  return {
    attachments: [
      {
        filename: "profile.jpg",
        path: imageUrl,
        cid: PROFILE_CID,
      },
    ],
    profileHtml: `<img src="cid:${PROFILE_CID}" alt="Google profile photo" width="72" height="72" style="border-radius:50%;display:block;margin-bottom:16px;border:2px solid #eee" />`,
  };
}

type SignInEmail = {
  name: string;
  email: string;
  signedInAt: string;
  imageUrl?: string | null;
};

type SubmissionEmail = {
  name: string;
  email: string;
  imageUrl?: string | null;
  phone: string;
  interests: string[];
  giftHusband: string;
  giftBestFriend: string;
  giftMother: string;
  giftFather: string;
  occasions: string[];
  additionalNotes: string;
  submittedAt: string;
};

function formatList(items: string[]) {
  return items.length ? items.map((i) => `  • ${i}`).join("\n") : "  (none)";
}

function buildText(data: SubmissionEmail) {
  return [
    "New Craftr Insights survey submission",
    "========================================",
    "",
    `Submitted: ${data.submittedAt}`,
    "",
    "— Part 1: Contact —",
    `Name:  ${data.name}`,
    `Email: ${data.email} (verified via Google)`,
    ...(data.imageUrl ? [`Photo: ${data.imageUrl}`] : []),
    `Phone: ${data.phone}`,
    "",
    "— Part 2: Interests —",
    formatList(data.interests),
    "",
    "— Gift ideas —",
    `Husband / partner: ${data.giftHusband || "(blank)"}`,
    `Best friend:       ${data.giftBestFriend || "(blank)"}`,
    `Mother:            ${data.giftMother || "(blank)"}`,
    `Father:            ${data.giftFather || "(blank)"}`,
    "",
    "— Occasions that matter —",
    formatList(data.occasions),
    "",
    "— Additional notes —",
    data.additionalNotes || "(none)",
  ].join("\n");
}

function buildHtml(data: SubmissionEmail, profileHtml: string) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:140px;vertical-align:top">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111">${value.replace(/\n/g, "<br>")}</td></tr>`;

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#FF6B35;padding:20px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px">New survey response</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px">Craftr Insights · ${data.submittedAt}</p>
  </div>
  ${profileHtml ? `<div style="padding:20px 24px 0">${profileHtml}</div>` : ""}
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${row("Name", data.name)}
    ${row("Email", `${data.email} <span style="color:#16a34a;font-size:12px">✓ Google verified</span>`)}
    ${row("Phone", data.phone)}
    ${row("Interests", data.interests.join(", ") || "—")}
    ${row("Gift — husband", data.giftHusband || "—")}
    ${row("Gift — best friend", data.giftBestFriend || "—")}
    ${row("Gift — mother", data.giftMother || "—")}
    ${row("Gift — father", data.giftFather || "—")}
    ${row("Occasions", data.occasions.join(", ") || "—")}
    ${row("Notes", data.additionalNotes || "—")}
  </table>
</div>
</body></html>`;
}

function buildSignInText(data: SignInEmail) {
  return [
    "Someone just signed in to Craftr Insights",
    "==========================================",
    "",
    `Signed in: ${data.signedInAt}`,
    "",
    `Name:  ${data.name}`,
    `Email: ${data.email} (verified via Google)`,
    ...(data.imageUrl ? [`Photo: ${data.imageUrl}`] : []),
    "",
    "They were redirected to the survey. If you do not receive a full survey",
    "submission email shortly, they may have left before completing the form.",
    "You can reply to this email to reach them directly.",
  ].join("\n");
}

function buildSignInHtml(data: SignInEmail, profileHtml: string) {
  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#FF6B35;padding:20px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px">New sign-in</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px">Craftr Insights · ${data.signedInAt}</p>
  </div>
  <div style="padding:20px 24px;font-size:14px;color:#111;line-height:1.6">
    ${profileHtml}
    <p style="margin:0 0 16px"><strong>${data.name}</strong> just signed in with Google and was sent to the survey.</p>
    <p style="margin:0 0 8px"><span style="color:#666">Email:</span> ${data.email} <span style="color:#16a34a;font-size:12px">✓ verified</span></p>
    <p style="margin:16px 0 0;padding:12px 14px;background:#fff7ed;border-radius:8px;color:#9a3412;font-size:13px">
      If you do not get a full survey submission email, they may have left before finishing. Reply to reach them directly.
    </p>
  </div>
</div>
</body></html>`;
}

export async function sendSignInEmail(data: SignInEmail) {
  const { transporter, from, to } = getMailConfig();
  const { attachments, profileHtml } = getProfileEmailParts(data.imageUrl);

  await transporter.sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `[Craftr Insights] Sign-in: ${data.name}`,
    text: buildSignInText(data),
    html: buildSignInHtml(data, profileHtml),
    attachments,
  });
}

export async function sendSubmissionEmail(data: SubmissionEmail) {
  const { transporter, from, to } = getMailConfig();
  const { attachments, profileHtml } = getProfileEmailParts(data.imageUrl);

  await transporter.sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `[Craftr Insights] Survey from ${data.name}`,
    text: buildText(data),
    html: buildHtml(data, profileHtml),
    attachments,
  });
}
