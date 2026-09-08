"use client";

import { useState } from "react";
import type { ChatTurn } from "@/lib/types";
import { Button } from "@/components/ui";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [provider, setProvider] = useState<"openai" | "placeholder" | null>(null);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Good evening. I'm Glowline for Maison Lumière. I can help with treatments, pricing, and after-hours booking even while the clinic is closed.",
    },
  ]);

  async function send() {
    const content = input.trim();
    if (!content || pending) return;

    const nextMessages: ChatTurn[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await response.json()) as {
        reply?: string;
        provider?: "openai" | "placeholder";
      };
      setProvider(data.provider ?? "placeholder");
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply ?? "I can take that enquiry and have the clinic confirm shortly.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I couldn't reach the assistant just now. Please try again or WhatsApp the clinic.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="mb-3 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-3xl border border-sand bg-white shadow-glow">
          <div className="bg-ink px-4 py-3 text-ivory">
            <p className="font-display text-lg">Glowline concierge</p>
            <p className="text-xs text-ivory/70">
              24/7 web capture {provider ? `· ${provider}` : ""}
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 ${
                  message.role === "assistant"
                    ? "bg-mist text-ink"
                    : "ml-auto bg-sage text-ivory"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-sand p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about PRF, hours, or a booking…"
              className="flex-1 rounded-full border border-sand px-3 py-2 text-sm outline-none"
            />
            <Button type="submit" disabled={pending}>
              Send
            </Button>
          </form>
        </div>
      ) : null}
      <Button variant="dark" onClick={() => setOpen((value) => !value)}>
        {open ? "Close chat" : "Chat with the clinic"}
      </Button>
    </div>
  );
}
