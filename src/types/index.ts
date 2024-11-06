export type LinkType = 'product' | 'link' | 'form' | 'folder' | 'image' | 'video' | 'podcast' | 'social' | 'poll';

export interface Profile {
  name: string;
  bio: string;
  avatar?: string;
}

export interface Theme {
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
  fontFamily: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  platform: 'shopify' | 'woocommerce';
  url: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface LinkItem {
  id: string;
  type: LinkType;
  data: Product | {
    title: string;
    url?: string;
    icon?: string;
    description?: string;
    thumbnail?: string;
    platform?: string;
    // Form specific fields
    formFields?: FormField[];
    // Poll specific fields
    question?: string;
    options?: PollOption[];
    allowMultiple?: boolean;
    endDate?: string;
  };
}