import { Link, useLocation } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChartIcon,
  DiamondIcon,
  DocIcon,
  TriangleIcon,
  TruckIcon,
  VaultIcon,
  VolcanoIcon,
} from "./Icons.tsx";
import { defaultTransition, slideInLeft, staggerContainer, staggerItem } from "../lib/motion.ts";
import { stickySidebarClassName } from "../lib/layout.ts";

const CATEGORY_ICONS: Record<string, typeof DiamondIcon> = {
  igneous: VolcanoIcon,
  metamorphic: DiamondIcon,
  sedimentary: TriangleIcon,
  crystals: DiamondIcon,
};

const CATEGORIES = [
  { slug: "igneous", label: "Igneous" },
  { slug: "metamorphic", label: "Metamorphic" },
  { slug: "sedimentary", label: "Sedimentary" },
  { slug: "crystals", label: "Crystals" },
] as const;

export const STOREFRONT_LINKS = [
  { label: "Collections", to: "/" as const, icon: DiamondIcon },
  { label: "Custom Design", to: "/custom-design" as const, icon: VaultIcon },
  { label: "Investment", to: "/investment" as const, icon: ChartIcon },
  { label: "Journal", to: "/journal" as const, icon: DocIcon },
] as const;

interface ExtraLink {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: any;
  icon?: typeof DiamondIcon;
}

interface Props {
  heading?: string;
  subheading?: string;
  extra?: ExtraLink[];
}

const linkClass = (active: boolean) =>
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
  (active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-brand-50");

export const StorefrontSidebar = ({
  heading = "The Collection",
  subheading = "Discover",
  animated = true,
}: Pick<Props, "heading" | "subheading"> & { animated?: boolean }) => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const motionOn = animated && !reduce;

  const storeActive = (to: string) => {
    if (to === "/") return pathname === "/" || pathname.startsWith("/c/");
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const Aside = motionOn ? motion.aside : "aside";
  const asideProps = motionOn
    ? {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: slideInLeft,
        transition: { ...defaultTransition, duration: 0.5 },
      }
    : {};

  const NavWrap = motionOn ? motion.div : "div";
  const navItemProps = motionOn ? { variants: staggerItem } : {};

  return (
    <Aside
      className={
        "hidden w-60 shrink-0 border-r border-ink-700/5 bg-surface-muted p-6 lg:block " +
        stickySidebarClassName
      }
      {...asideProps}
    >
      <NavWrap
        className="mb-6"
        {...(motionOn
          ? {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { ...defaultTransition, delay: 0.1 },
            }
          : {})}
      >
        <p className="font-display text-xl text-ink-900">{heading}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">{subheading}</p>
      </NavWrap>

      <NavWrap
        className="space-y-1"
        {...(motionOn ? { initial: "hidden", animate: "visible", variants: staggerContainer } : {})}
      >
        {STOREFRONT_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavWrap key={link.to} {...navItemProps}>
              <Link to={link.to} className={linkClass(storeActive(link.to))}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            </NavWrap>
          );
        })}
      </NavWrap>

      <p className="mb-3 mt-8 text-xs uppercase tracking-wider text-ink-500">Categories</p>
      <NavWrap
        className="space-y-1"
        {...(motionOn ? { initial: "hidden", animate: "visible", variants: staggerContainer } : {})}
      >
        {CATEGORIES.map((it) => {
          const Icon = CATEGORY_ICONS[it.slug] ?? DiamondIcon;
          const active = pathname.startsWith(`/c/${it.slug}`);
          return (
            <NavWrap key={it.slug} {...navItemProps}>
              <Link to="/c/$category" params={{ category: it.slug }} className={linkClass(active)}>
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            </NavWrap>
          );
        })}
      </NavWrap>
    </Aside>
  );
};

// Workspace + legacy category-only sidebar
const ITEMS = CATEGORIES;

export const CategorySidebar = ({
  heading = "The Collection",
  subheading = "Curator's Workspace",
  extra,
}: Props) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={
        "w-60 shrink-0 border-r border-ink-700/5 bg-surface-muted p-6 " + stickySidebarClassName
      }
    >
      <div className="mb-8">
        <p className="font-display text-xl text-ink-900">{heading}</p>
        <p className="text-xs uppercase tracking-wider text-ink-500 mt-1">{subheading}</p>
      </div>
      <nav className="space-y-1">
        {ITEMS.map((it) => {
          const Icon = CATEGORY_ICONS[it.slug] ?? DiamondIcon;
          const to = `/c/${it.slug}`;
          const active = pathname.startsWith(to);
          return (
            <Link
              key={it.slug}
              to="/c/$category"
              params={{ category: it.slug }}
              className={linkClass(active)}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
        {extra?.map((it) => {
          const Icon = it.icon ?? DocIcon;
          const active = pathname === it.to;
          return (
            <Link key={it.to} to={it.to} className={linkClass(active)}>
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export const WorkspaceSidebar = () => (
  <CategorySidebar
    extra={[
      { label: "Overview", to: "/workspace/overview", icon: ChartIcon },
      { label: "Inventory", to: "/workspace/inventory", icon: VaultIcon },
      { label: "Acquisitions", to: "/workspace/acquisitions", icon: TruckIcon },
      { label: "Reports", to: "/workspace/reports", icon: DocIcon },
      { label: "Analytics", to: "/workspace/analytics", icon: ChartIcon },
    ]}
  />
);
