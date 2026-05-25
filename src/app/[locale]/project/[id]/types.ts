export interface LinkProps {
  title: string;
  url: string;
}

export interface ImageProps {
  description: string;
  url: string;
}

export interface ProjectDetailProps {
  title: string;
  meta_desc: string;
  description?: string[];
  links?: LinkProps[];
  images?: ImageProps[];
  dev_stack?: string[];
}
