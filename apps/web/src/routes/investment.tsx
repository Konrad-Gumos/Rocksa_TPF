import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { PageMeta } from "../components/PageMeta.tsx";
import { StorefrontLayout } from "../components/StorefrontLayout.tsx";
import { FadeInSection } from "../components/motion/FadeInSection.tsx";
import { storefrontMainClassName } from "../lib/layout.ts";

export const Route = createFileRoute("/investment")({ component: InvestmentPage });

function InvestmentPage() {
  return (
    <>
      <PageMeta
        title="Investment Grade Minerals — Rocksa"
        description="Appreciation potential, certification, and portfolio diversification for mineral assets."
      />
      <StorefrontLayout>
        <main className={`${storefrontMainClassName} space-y-8 max-w-3xl`}>
          <FadeInSection>
            <h1 className="font-display text-5xl">Investment Grade</h1>
            <p className="text-ink-700 leading-relaxed">
              Premium mineral specimens can appreciate when accompanied by gemological
              documentation, verified provenance, and insured vault storage. Rocksa surfaces
              compare-at pricing and stock transparency so buyers can evaluate relative value before
              acquisition.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.08}>
            <Card>
              <CardBody className="space-y-3">
                <h2 className="font-display text-2xl">High-value categories</h2>
                <p className="text-sm text-ink-500">
                  Explore crystals and metamorphic specimens with documented origin and
                  certification.
                </p>
                <Button asChild>
                  <Link to="/c/$category" params={{ category: "crystals" }}>
                    Browse crystals
                  </Link>
                </Button>
              </CardBody>
            </Card>
          </FadeInSection>
        </main>
      </StorefrontLayout>
    </>
  );
}
