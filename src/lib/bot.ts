import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createWeChatAdapter } from "@chat-adapter/wechat";
import { createWhatsAppAdapter } from "@chat-adapter/whatsapp";
import { createFacebookAdapter } from "@chat-adapter/facebook";
import { createGoogleChatAdapter } from "@chat-adapter/googlechat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { WorkflowAgent, type ModelCallStreamPart } from '@ai-sdk/workflow';
import { convertToModelMessages, tool, type UIMessage } from 'ai';
import { getWritable } from 'workflow';
import { z } from 'zod';

// ১. প্রতিটি প্ল্যাটফর্মের জন্য অ্যাডাপ্টার কনফিগারেশন করা হচ্ছে
const telegramAdapter = createTelegramAdapter({
  mode: "webhook", // প্রোডাকশনের জন্য ওয়েবহুক মোড ব্যবহার করা হচ্ছে
});

const weChatAdapter = createWeChatAdapter({
  appId: process.env.WECHAT_APP_ID || "",
  appSecret: process.env.WECHAT_APP_SECRET || "",
  token: process.env.WECHAT_TOKEN || "",
  encodingAESKey: process.env.WECHAT_AES_KEY || "",
});

const whatsAppAdapter = createWhatsAppAdapter({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
});

const facebookAdapter = createFacebookAdapter({
  pageId: process.env.FACEBOOK_PAGE_ID || "",
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN || "",
  verifyToken: process.env.FACEBOOK_VERIFY_TOKEN || "",
  appSecret: process.env.FACEBOOK_APP_SECRET || "",
});

const googleChatAdapter = createGoogleChatAdapter({
  projectId: process.env.GOOGLE_CHAT_PROJECT_ID || "",
  privateKey: process.env.GOOGLE_CHAT_PRIVATE_KEY || "",
  clientEmail: process.env.GOOGLE_CHAT_CLIENT_EMAIL || "",
});

// ২. প্রধান চ্যাট বট সার্ভিস যা সব প্ল্যাটফর্মকে একটি কমন স্টেটের মাধ্যমে হ্যান্ডেল করবে
export const bot = new Chat({
  userName: "FlyTripVisaBot",
  adapters: {
    telegram: telegramAdapter,
    wechat: weChatAdapter,
    whatsapp: whatsAppAdapter,
    facebook: facebookAdapter,
    googlechat: googleChatAdapter,
    slack: createSlackAdapter(),
  },
  state: createRedisState({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  }),
});

// সব প্ল্যাটফর্মের কমন ইনকামিং মেসেজ ইভেন্ট লিসেনার
bot.onNewMessage(async (message) => {
  // ইউজার মেসেজ সেন্ড করলে বট এখানে ট্রিগার হবে
  const replyText = `হ্যালো! ফ্লাইট্রিপ এআই অ্যাসিস্ট্যান্ট আপনার মেসেজটি পেয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`;
  await message.reply(replyText);
});

// ৩. ফ্লাইটের জন্য এআই ওয়ার্কফ্লো স্টেপ লজিক
async function searchFlightsStep(input: {
  origin: string;
  destination: string;
  date: string;
}) {
  'use step';
  const response = await fetch(`https://api.flights.example/search?origin=${input.origin}&destination=${input.destination}&date=${input.date}`);
  if (!response.ok) return { error: "ফ্লাইট ডাটা রিট্রিভ করতে ব্যর্থ হয়েছে।" };
  return response.json();
}

// ৪. কাস্টম এআই ওয়ার্কফ্লো এজেন্ট
export async function runChatWorkflow(messages: UIMessage[]) {
  'use workflow';
  const modelMessages = await convertToModelMessages(messages);

  const agent = new WorkflowAgent({
    model: 'anthropic/claude-sonnet-4-6',
    instructions: 'আপনি একজন অ্যাডভান্সড ফ্লাইট্রিপ ভিসা এবং ফ্লাইট বুকিং অ্যাসিস্ট্যান্ট। কাস্টমারদের প্রশ্নের উত্তর প্রফেশনালভাবে দিন।',
    tools: {
      searchFlights: tool({
        description: 'বিভিন্ন আন্তর্জাতিক রুটের এভেইলেবল ফ্লাইট সার্চ করুন',
        inputSchema: z.object({
          origin: z.string().describe('যাত্রার প্রারম্ভিক শহর বা এয়ারপোর্ট কোড'),
          destination: z.string().describe('গন্তব্য শহর বা এয়ারপোর্ট কোড'),
          date: z.string().describe('ভ্রমণের তারিখ (YYYY-MM-DD ফরম্যাটে)'),
        }),
        execute: searchFlightsStep,
      }),
    },
  });

  const result = await agent.stream({
    messages: modelMessages,
    writable: getWritable<ModelCallStreamPart>(),
  });

  return { messages: result.messages };
}
