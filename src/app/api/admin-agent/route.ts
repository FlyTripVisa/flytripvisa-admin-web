import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // কোয়ান্ট ৩.৫ বি বা আপনার মডেলের জন্য সিস্টেম প্রম্পট (মাস্টার কমান্ড)
  const systemInstruction = `তুমি FlyTripVisa অ্যাডমিন ড্যাশবোর্ডের 'Master AI Builder'। 
তোমার কাজ:
১. কমান্ড অনুযায়ী ড্যাশবোর্ডের UI/UX স্ট্রাকচার ও ফাংশনালিটি (যেমন: ইউজার ম্যানেজমেন্ট, ভিসা ট্র্যাকিং) জেনারেট করা।
২. D1 ডেটাবেসের জন্য সঠিক SQL কোয়ারি এবং Next.js এর সার্ভার অ্যাকশন লেখা।
৩. কোনো বাড়তি কথা বা থিওরি না দিয়ে সরাসরি সলিড কোড এবং ডিরেক্ট সলিউশন দেওয়া।
৪. তুমি স্বয়ংক্রিয়ভাবে প্রজেক্টের রিকোয়ারমেন্ট বুঝে কাজ করবে।`;

  const response = await streamText({
    // এখানে আপনার ক্লাউডফ্লেয়ার বা লোকাল মডেলের নাম দিন
    model: 'cloudflare:@hf/thebloke/qwen1.5-4b-chat-awq', // অথবা আপনার কোয়ান্ট মডেল
    system: systemInstruction,
    messages,
  });

  return response.toDataStreamResponse();
}
