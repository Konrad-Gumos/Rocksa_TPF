import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "../../components/TopNav.tsx";
import { PageMeta } from "../../components/PageMeta.tsx";
import { JOURNAL_ARTICLES } from "../../data/journal-articles.ts";

export const Route = createFileRoute("/journal/$slug")({
  component: JournalArticlePage,
});

function JournalArticlePage() {
  const { slug } = Route.useParams();
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main className="p-10">
        <p className="text-ink-500">Article not found.</p>
        <Link to="/journal" className="text-brand-600">
          ← Back to journal
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <PageMeta title={`${article.title} — Rocksa Journal`} description={article.excerpt} />
      <TopNav />
      <article className="mx-auto max-w-2xl px-6 py-12 prose prose-ink">
        <Link to="/journal" className="text-sm text-brand-600 no-underline">
          ← Journal
        </Link>
        <p className="text-xs uppercase tracking-wider text-ink-500 mt-6">{article.date}</p>
        <h1 className="font-display text-4xl mt-2">{article.title}</h1>
        <p className="mt-6 text-ink-700 leading-relaxed">{article.body}</p>
      </article>
    </div>
  );
}
