export type ProductImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type ProductSwatch = {
  name: string;
  value: string;
};

export type DeliveryPerk = {
  label: string;
  detail: string;
  icon: "truck" | "exchange" | "shield" | "card";
};

export type ProductCardType = {
  id: string;
  merchandiseId?: string;
  handle?: string;
  href?: string;
  image: string;
  alt: string;
  badge?: string;
  featured?: boolean;
  sizes?: string[];
  swatches: string[];
  gallery?: string[];
  name?: string;
  price?: string;
};

export type HighlightBlock = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
};

export type ProductDetail = {
  id?: string;
  merchandiseId?: string;
  slug: string;
  editLabel: string;
  title: string;
  breadcrumb: Array<{
    label: string;
    href?: string;
  }>;
  originalPrice: string;
  price: string;
  sold: string;
  rating: string;
  description: string;
  detailsBody: string;
  careNotes: string[];
  shippingNotes: string[];
  colorName: string;
  colors: ProductSwatch[];
  sizes?: string[];
  gallery: ProductImage[];
  deliveryPerks: DeliveryPerk[];
  tagline?: string;
  specifications?: string[];
  highlights?: HighlightBlock[];
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  hasVoted?: boolean;
};
