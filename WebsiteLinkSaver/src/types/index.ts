export interface WebsiteLink {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  description: string;
  category: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebsiteLinkInput {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
  category: string;
  isFavorite?: boolean;
}
