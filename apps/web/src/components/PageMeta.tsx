import { useEffect } from "react";

interface Props {
  title: string;
  description?: string;
}

export const PageMeta = ({ title, description }: Props) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "description");
        document.head.appendChild(el);
      }
      el.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};
