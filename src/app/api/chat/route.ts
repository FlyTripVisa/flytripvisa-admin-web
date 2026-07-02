import { NextResponse } from "next/server";
import { streamText, generateText, generateObject } from 'ai';
import { runChatWorkflow } from "@/lib/bot";
import { z } from 'zod';

// ড্যাশবোর্ড থেকে রিকোয়েস্ট হ্যান্ডল করার জন্য মাল্টি-চ্যানেল এপিআই রাউট
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, prompt, messages, textToExtract } = body;

    // ১. কন্ডিশন: এআই ফ্লাইট্রিপ ওয়ার্কফ্লো চ্যাট রান করা (ফ্লাইট সার্চ টুলসহ)
    if (action === "workflow" && messages) {
      const workflowResult = await runChatWorkflow(messages);
      return NextResponse.json(workflowResult);
    }

    // ২. কন্ডিশন: লাইভ ওয়েব চ্যাট স্ট্রমিং (GPT-5.5)
    if (action === "stream" && prompt) {
      const result = streamText({
        model: 'openai/gpt-5.5',
        prompt,
      });
      return result.toUIMessageStreamResponse();
    }

    // ৩. কন্ডিশন: পাসপোর্ট বা ডকুমেন্ট থেকে অটোমেটিক টেক্সট এবং ডাটা এক্সট্রাকশন
    if (action === "extract" && textToExtract) {
      const { object } = await generateObject({
        model: 'anthropic/claude-opus-4.8',
        schema: z.object({
          name: z.string().describe('পাসপোর্টে থাকা ফুল নেম'),
          passportNumber: z.string().describe('পাসপোর্ট নাম্বার'),
          nationality: z.string().describe('জাতীয়তা'),
          dob: z.string().describe('জন্ম তারিখ'),
        }),
        prompt: `এই পাসপোর্ট ডাটা থেকে প্রফেশনাল অবজেক্ট তৈরি করুন: ${textToExtract}`,
      });
      return NextResponse.json(object);
    }

    // ৪. ডিফল্ট রেসপন্স জেনারেটর
    const { text } = await generateText({
      model: 'anthropic/claude-opus-4.8',
      prompt: prompt || 'হ্যালো! ফ্লাইট্রিপ ভিসা অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম।',
    });

    return NextResponse.json({ text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}