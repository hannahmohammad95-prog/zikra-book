export type Template = {
  id:       string;
  name:     string;
  imageUrl: string;
};

// Add more templates here as you get them.
// Key = country/occasion slug (must match the URL slug exactly)
export const TEMPLATES: Record<string, Template[]> = {
  thailand: [
    {
      id:       "thailand-1",
      name:     "Thailand Classic",
      imageUrl: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777033035/Thailand_gvu1m7.png",
    },
  ],
  greece: [
    {
      id:       "greece-1",
      name:     "Greece Classic",
      imageUrl: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777033035/Greece_dguinn.png",
    },
  ],
};
