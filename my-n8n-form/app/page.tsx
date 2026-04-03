"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const saveAsJson = (obj: any, filename = "response.json") => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);

      const output = {
        question,
        answer: data.answer,
        receivedAt: new Date().toISOString(),
      };
      saveAsJson(output, "qa-response.json");
    } catch (err) {
      setAnswer("Error: could not get response");
      console.error(err);
      const output = {
        question,
        error: String(err),
        receivedAt: new Date().toISOString(),
      };
      saveAsJson(output, "qa-response-error.json");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
          Ask me anything
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-3 border rounded-md w-full"
          />
          <button
            type="submit"
            className="bg-black text-white p-3 rounded-md"
          >
            {loading ? "Thinking..." : "Submit"}
          </button>
        </form>

        {answer && (
          <div className="mt-6 p-4 border rounded-md bg-gray-100 dark:bg-zinc-800 w-full">
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </main>
    </div>
  );
}