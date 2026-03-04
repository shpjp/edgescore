"use client";

// useFormStatus must be called inside a component that is a *descendant* of
// the <form> — that's why SubmitButton is its own component here rather than
// being inlined in NewSessionForm.
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { createSession } from "@/actions/create-session";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="warm"
      disabled={pending}
      className="self-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Creating session…
        </>
      ) : (
        "Create Session"
      )}
    </Button>
  );
}

export default function NewSessionForm() {
  return (
    <form action={createSession} className="flex flex-col gap-5">
      {/* Session type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="type" className="text-sm font-medium text-[#1f1f1f]">
          Session Type
        </label>
        <select
          id="type"
          name="type"
          required
          className="flex h-9 w-full rounded-md border border-[#e8e2d9] bg-[#f7f3ed] px-3 py-1 text-sm text-[#1f1f1f] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9c5ab]"
        >
          <option value="behavioral">Behavioral</option>
          <option value="dsa">DSA</option>
          <option value="system_design">System Design</option>
        </select>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="question" className="text-sm font-medium text-[#1f1f1f]">
          Question
        </label>
        <Textarea
          id="question"
          name="question"
          required
          rows={4}
          placeholder="e.g. Tell me about a time you resolved a conflict on your team."
          className="resize-none border-[#e8e2d9] bg-[#f7f3ed] focus-visible:ring-[#d9c5ab]"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
