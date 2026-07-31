export type NavItem = {
  id: string;
  label: string;
  href: string;
  isPrimaryCta?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  links: Array<{ id: string; label: string; href: string }>;
};
