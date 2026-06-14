import { LockIcon, ShieldIcon } from "../Icons.tsx";

const TRUST_ITEMS = [
  {
    icon: ShieldIcon,
    title: "Certificate of authenticity",
    detail: "Every specimen includes gemological documentation.",
  },
  {
    icon: LockIcon,
    title: "Insured secure shipping",
    detail: "Vault-to-door delivery with full transit coverage.",
  },
  {
    icon: LockIcon,
    title: "Complimentary shipping",
    detail: "Standard secure shipping included on qualifying orders.",
  },
] as const;

export const CheckoutTrustStrip = () => (
  <div className="grid gap-4 rounded-md border border-ink-700/5 bg-surface-muted p-5 sm:grid-cols-3">
    {TRUST_ITEMS.map(({ icon: Icon, title, detail }) => (
      <div key={title} className="flex gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink-900">{title}</p>
          <p className="mt-1 text-xs text-ink-500">{detail}</p>
        </div>
      </div>
    ))}
  </div>
);
