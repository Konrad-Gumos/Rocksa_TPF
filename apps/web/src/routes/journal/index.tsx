import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardBody } from "@rocksa/ui";
import { TopNav } from "../../components/TopNav.tsx";
import { PageMeta } from "../../components/PageMeta.tsx";
import { JOURNAL_ARTICLES } from "../../data/journal-articles.ts";

export const Route = createFileRoute("/journal/")({
  component: JournalIndex,
});

function JournalIndex() {
  return (
    <div className="min-h-screen">
      <PageMeta
        title="Journal — Rocksa"
        description="Editorial guides on gem care, provenance, and collecting."
      />
      <TopNav />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-5xl">Journal</h1>
        <p className="mt-2 text-ink-500">Curated editorial for collectors and curators.</p>
        <ul className="mt-10 space-y-4">
          {JOURNAL_ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link to="/journal/$slug" params={{ slug: article.slug }}>
                <Card className="transition hover:border-brand-200">
                  <CardBody>
                    <p className="text-xs uppercase tracking-wider text-ink-500">{article.date}</p>
                    <h2 className="font-display text-2xl mt-1">{article.title}</h2>
                    <p className="text-sm text-ink-500 mt-2">{article.excerpt}</p>
                  </CardBody>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
