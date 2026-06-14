import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, CardBody, Input, Label } from "@rocksa/ui";
import { TopNav } from "../components/TopNav.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { apiOptional } from "../lib/api.ts";

export const Route = createFileRoute("/custom-design")({ component: CustomDesignPage });

function CustomDesignPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await apiOptional<{ ok: boolean }>("/v1/inquiries", {
      method: "POST",
      auth: false,
      body: { name, email, brief },
    });
    if (res?.ok) setSent(true);
    else setError("Could not send inquiry. Please try again.");
  };

  return (
    <div className="min-h-screen">
      <PageMeta
        title="Custom Design — Rocksa"
        description="Commission bespoke mineral settings and private acquisitions."
      />
      <TopNav />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="font-display text-5xl">Custom Design</h1>
        <p className="mt-2 text-ink-500">
          Tell us about your vision. A senior curator will respond within two business days.
        </p>
        <Card className="mt-8">
          <CardBody>
            {sent ? (
              <p className="text-ink-700">Thank you — your inquiry has been received.</p>
            ) : (
              <form className="space-y-4" onSubmit={submit}>
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Project brief</Label>
                  <Input value={brief} onChange={(e) => setBrief(e.target.value)} required />
                </div>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <Button type="submit" className="w-full">
                  Submit inquiry
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
