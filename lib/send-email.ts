import nodemailer from "nodemailer";

type SubmissionEmail = {
  name: string;
  email: string;
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

function buildHtml(data: SubmissionEmail) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:140px;vertical-align:top">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111">${value.replace(/\n/g, "<br>")}</td></tr>`;

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#FF6B35;padding:20px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px">New survey response</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px">Craftr Insights · ${data.submittedAt}</p>
  </div>
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

export async function sendSubmissionEmail(data: SubmissionEmail) {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim() || user;

  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD are required");
  }
  if (!to) {
    throw new Error("NOTIFY_EMAIL or GMAIL_USER is required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Craftr Insights" <${user}>`,
    to,
    replyTo: data.email,
    subject: `[Craftr Insights] Survey from ${data.name}`,
    text: buildText(data),
    html: buildHtml(data),
  });
}
