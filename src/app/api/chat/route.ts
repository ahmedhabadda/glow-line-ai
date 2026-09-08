import { NextResponse } from "next/server";
import { generateClinicReply } from "@/lib/openai";
import { mockKnowledge } from "@/lib/mock-data";
import type { ChatTurn } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: ChatTurn[] };
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const result = await generateClinicReply(messages, mockKnowledge);
  return NextResponse.json(result);
}
