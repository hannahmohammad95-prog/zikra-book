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
  const { name, contact, contactType, category, subcategory, pages, notes, photos, color, symbol, year, textSize, iconSize, arrangement } = body;

  const photoLinks = photos
    .map((p: { url: string }, i: number) => `<li><a href="${p.url}">Photo ${i + 1}</a></li>`)
    .join("");

  const orderTime = getQatarTime();

  // Generate a signed zip download URL
  const publicIds: string[] = photos
    .map((p: { publicId: string }) => p.publicId)
    .filter(Boolean);

  console.log("📦 Order received — publicIds:", publicIds);

  let zipUrl: string | null = null;
  if (publicIds.length > 0) {
    try {
      const result = cloudinary.utils.download_zip_url({
        public_ids:    publicIds,
        resource_type: "image",
      });
      zipUrl = result && typeof result === "string" && result.length > 0 ? result : null;
      console.log("📦 zipUrl:", zipUrl);
    } catch (e) {
      console.error("❌ download_zip_url failed:", e);
    }
  }

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

          <!-- Cover design -->
          <h3 style="font-size: 15px; margin-bottom: 12px; color: #1A1208;">Cover Design</h3>
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
            <div style="width:64px; height:80px; border-radius:6px; flex-shrink:0; background:${color ?? "#7eb8d4"}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
              ${symbol ? `<img src="https://res.cloudinary.com/dis5pqgzn/image/upload/zikra_book/symbols/${subcategory}/${symbol}" width="28" height="28" style="object-fit:contain;" />` : ""}
              <span style="color:white; font-size:7px; letter-spacing:1px; text-align:center; padding:0 4px;">${(subcategory ?? "").replace(/-/g, " ").toUpperCase()}</span>
            </div>
            <div>
              <p style="font-size:13px; color:#6B4A10; margin:0 0 4px;">Cover colour: <strong>${color ?? "—"}</strong></p>
              <p style="font-size:13px; color:#6B4A10; margin:0 0 4px;">Symbol: <strong>${symbol ? symbol.replace(/_/g, " ") : "None"}</strong></p>
              <p style="font-size:13px; color:#6B4A10; margin:0 0 4px;">Text size: <strong>${textSize ?? "—"}px</strong></p>
              <p style="font-size:13px; color:#6B4A10; margin:0 0 4px;">Icon size: <strong>${iconSize ?? "—"}px</strong></p>
              <p style="font-size:13px; color:#6B4A10; margin:0;">Spine year: <strong>${year || "—"}</strong></p>
            </div>
          </div>

          <hr style="border: 1px solid #E8D9A8; margin: 24px 0;" />

          <!-- Page arrangement -->
          <h3 style="font-size: 15px; margin-bottom: 4px; color: #1A1208;">Page Layout (${pages} pages · ${(arrangement ?? []).length} sides)</h3>
          <p style="font-size:12px; color:#6B4A10; margin-bottom:12px;">Each box = one side of a page</p>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:20px;">
            ${(arrangement ?? []).map((side: { side: string; layout: string; photos: ({ url: string; name: string } | null)[] }) => {
              const [photo1, photo2] = side.photos;
              const isTwoPhoto = side.layout === "two" || side.layout === "two-vertical";
              return `
                <div style="border:1px solid #E8D9A8; border-radius:6px; overflow:hidden; font-family:sans-serif;">
                  <div style="background:#F5EFE0; padding:3px 6px; font-size:9px; color:#6B4A10; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${side.side}</div>
                  ${isTwoPhoto ? `
                    <div style="${side.layout === "two" ? "display:flex;" : "display:flex; flex-direction:column;"}">
                      ${photo1 ? `<img src="${photo1.url}" width="${side.layout === "two" ? "50%" : "100%"}" height="40" style="object-fit:cover;" />` : `<div style="width:${side.layout === "two" ? "50%" : "100%"}; height:40px; background:#EDE8DC; display:flex; align-items:center; justify-content:center; font-size:9px; color:#A8996E;">empty</div>`}
                      ${photo2 ? `<img src="${photo2.url}" width="${side.layout === "two" ? "50%" : "100%"}" height="40" style="object-fit:cover;" />` : `<div style="width:${side.layout === "two" ? "50%" : "100%"}; height:40px; background:#EDE8DC; display:flex; align-items:center; justify-content:center; font-size:9px; color:#A8996E;">empty</div>`}
                    </div>
                  ` : `
                    ${photo1 ? `<img src="${photo1.url}" width="100%" height="60" style="object-fit:cover; display:block;" />` : `<div style="height:60px; background:#EDE8DC; display:flex; align-items:center; justify-content:center; font-size:9px; color:#A8996E;">empty</div>`}
                  `}
                </div>
              `;
            }).join("")}
          </div>

          <!-- Download all photos -->
          <h3 style="font-size: 15px; margin-bottom: 12px; color: #1A1208;">All Photos (${photos.length} uploaded)</h3>
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
