import { NextResponse } from "next/server";
import { bot } from "@/lib/bot";

// ডাইনামিক প্ল্যাটফর্ম ওয়েবহুক হ্যান্ডলার
export async function POST(
  request: Request,
  { params }: { params: { platform: string } }
): Promise<Response> {
  const platform = params.platform;

  try {
    // ১. টেলিগ্রাম ওয়েবহুক প্রসেসিং
    if (platform === "telegram") {
      return await bot.webhooks.telegram(request);
    }
    
    // ২. উইচ্যাট ওয়েবহুক প্রসেসিং (উইচ্যাট সিগনেচার ভেরিফিকেশন সহ)
    if (platform === "wechat") {
      return await bot.webhooks.wechat(request);
    }

    // ৩. হোয়াটসঅ্যাপ ক্লাউড এপিআই ওয়েবহুক প্রসেসিং
    if (platform === "whatsapp") {
      return await bot.webhooks.whatsapp(request);
    }

    // ৪. ফেসবুক মেসেঞ্জার ওয়েবহুক প্রসেসিং
    if (platform === "facebook") {
      return await bot.webhooks.facebook(request);
    }

    // ৫. গুগল চ্যাট ওয়েবহুক প্রসেসিং
    if (platform === "googlechat") {
      return await bot.webhooks.googlechat(request);
    }

    // ৬. স্ল্যাক ওয়েবহুক প্রসেসিং
    if (platform === "slack") {
      return await bot.webhooks.slack(request);
    }

    return NextResponse.json({ error: `প্ল্যাটফর্ম ${platform} সাপোর্ট করে না` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ফেসবুক, হোয়াটসঅ্যাপ এবং উইচ্যাট গেটওয়ের ভেরিফিকেশনের জন্য GET হ্যান্ডলার (Webhook Handshake)
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
): Promise<Response> {
  const platform = params.platform;
  const { searchParams } = new URL(request.url);

  // হোয়াটসঅ্যাপ ও ফেসবুক ভেরিফিকেশন হ্যান্ডশেক লজিক
  if (platform === "whatsapp" || platform === "facebook") {
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const configuredToken = platform === "whatsapp" 
      ? process.env.WHATSAPP_VERIFY_TOKEN 
      : process.env.FACEBOOK_VERIFY_TOKEN;

    if (mode === "subscribe" && token === configuredToken) {
      return new Response(challenge, { status: 200 });
    }
    return NextResponse.json({ error: "ভেরিফিকেশন টোকেন মিলেনি" }, { status: 403 });
  }

  // উইচ্যাট হ্যান্ডশেক লজিক
  if (platform === "wechat") {
    const signature = searchParams.get("signature");
    const timestamp = searchParams.get("timestamp");
    const nonce = searchParams.get("nonce");
    const echostr = searchParams.get("echostr");

    // উইচ্যাট এপিআই হ্যান্ডশেক সফল হলে echostr রিটার্ন করে
    if (signature && timestamp && nonce && echostr) {
      return new Response(echostr, { status: 200 });
    }
  }

  return NextResponse.json({ message: "ওয়েবহুক হ্যান্ডশেক চেক করা হয়েছে" }, { status: 200 });
}
