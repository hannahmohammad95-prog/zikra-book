import { Resend } from "resend";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const resend = new Resend(process.env.RESEND_API_KEY);

cloudinary.config({
  cloud_name: "dis5pqgzn",
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Qatar time (UTC+3)
function getQatarTime() {
  return new Date().toLocaleString("en-GB", {
    timeZone:    "Asia/Qatar",
    day:         "2-digit",
    month:       "short",
    year:        "numeric",
    hour:        "2-digit",
    minute:      "2-digit",
    hour12:      true,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, contact, contactType, category, subcategory, pages, notes, photos } = body;

  const photoLinks = photos
    .map((p: { url: string }, i: number) => `<li><a href="${p.url}">Photo ${i + 1}</a></li>`)
    .join("");

  const orderTime = getQatarTime();

  // Generate a signed zip download URL (no API call needed — signed client-side)
  const publicIds: string[] = photos
    .map((p: { publicId: string }) => p.publicId)
    .filter(Boolean);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zipUrl: string | null = publicIds.length > 0
    ? (cloudinary.utils as any).download_zip_url({ public_ids: publicIds, resource_type: "image" })
    : null;

  try {
    // ── Email to Hannah ─────────────────────────────────────────────────────
    await resend.emails.send({
      from:    "Zikra Book Orders <hello@zikrabook.com>",
      to:      "hello@zikrabook.com",
      subject: `📖 New Order — ${name} | ${subcategory} (${pages} pages)`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1A1208;">
          <h1 style="font-size: 28px; margin-bottom: 8px;">New Zikra Book Order 📖</h1>
          <p style="color: #A87C3C; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Order Notification</p>
          <p style="color: #6B4A10; font-size: 12px;">Received: ${orderTime} (Qatar time)</p>
          <hr style="border: 1px solid #E8D9A8; margin: 24px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Customer</td><td style="padding: 8px 0; font-size: 15px;"><strong>${name}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Contact (${contactType})</td><td style="padding: 8px 0; font-size: 15px;">${contact}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Category</td><td style="padding: 8px 0; font-size: 15px; text-transform: capitalize;">${category}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Book</td><td style="padding: 8px 0; font-size: 15px; text-transform: capitalize;">${subcategory.replace(/-/g, " ")}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Pages</td><td style="padding: 8px 0; font-size: 15px;">${pages} pages</td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Special Requests</td><td style="padding: 8px 0; font-size: 15px;">${notes || "None"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B4A10; font-size: 13px;">Photos</td><td style="padding: 8px 0; font-size: 15px;">${photos.length} uploaded</td></tr>
          </table>

          <hr style="border: 1px solid #E8D9A8; margin: 24px 0;" />
          <h3 style="font-size: 16px; margin-bottom: 12px;">Photos (${photos.length} uploaded)</h3>

          ${zipUrl
            ? `<a href="${zipUrl}" style="display:inline-block; margin-bottom:20px; padding: 14px 28px; background: linear-gradient(135deg,#D4B483,#A87C3C); color:#fff; border-radius:999px; font-size:13px; text-decoration:none; letter-spacing:2px; font-family:sans-serif;">⬇ DOWNLOAD ALL PHOTOS (ZIP)</a>`
            : `<p style="font-size:13px; color:#6B4A10;">Individual photo links below:</p>`
          }

          <ul style="font-size: 14px; line-height: 2;">${photoLinks}</ul>
        </div>
      `,
    });

    // ── Confirmation email to customer ───────────────────────────────────────
    if (contactType === "email") {
      await resend.emails.send({
        from:    "Zikra Book <hello@zikrabook.com>",
        to:      contact,
        subject: "Your Zikra Book order is under preparation ✨",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1A1208;">
            <h1 style="font-size: 28px; margin-bottom: 8px;">Thank you, ${name}! ✨</h1>
            <p style="color: #A87C3C; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Your order is under preparation</p>
            <hr style="border: 1px solid #E8D9A8; margin: 24px 0;" />

            <p style="font-size: 15px; line-height: 1.8;">
              We have received your photos and layout for your <strong style="text-transform: capitalize;">${subcategory.replace(/-/g, " ")}</strong> book (${pages} pages).
              Our team is reviewing everything and will be in touch with you very soon.
            </p>

            <div style="background: #FDFAF4; border: 1px solid #E8D9A8; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <p style="color: #A87C3C; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">What happens next</p>
              <ol style="font-size: 14px; line-height: 2.2; padding-left: 20px; margin: 0;">
                <li>Our team reviews your photos and layout</li>
                <li>We contact you to confirm your order and arrange payment</li>
                <li>You approve the final design</li>
                <li>We print and deliver your book to your door 📦</li>
              </ol>
            </div>

            <p style="font-size: 13px; color: #6B4A10;">Have questions? Reply to this email or message us anytime.</p>
            <p style="font-size: 20px; font-style: italic; color: #A87C3C; margin-top: 32px;">Every journey deserves a page.</p>
            <p style="font-size: 13px; color: #3D2D18;">— The Zikra Book Team</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
