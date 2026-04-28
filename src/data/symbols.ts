export type BookSymbol = {
  id:    string;
  label: string;
  url:   string;
};

export const SYMBOLS: Record<string, BookSymbol[]> = {
  italy: [
    { id: "pizza",         label: "Pizza",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777380729/Cover_kqpqdr.jpg"  },
    { id: "italian_flag",  label: "Italian Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777380728/2_iccjwa.jpg"      },
    { id: "leaning_tower", label: "Leaning Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777380729/3_hrxlt5.jpg"      },
  ],
  // Add more countries below as you upload their symbols to Cloudinary
  // Copy the URL from Cloudinary (click image → Copy URL) and paste it here
  // france: [
  //   { id: "eiffel",    label: "Eiffel Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v.../..." },
  //   { id: "croissant", label: "Croissant",     url: "..." },
  //   { id: "flag",      label: "French Flag",   url: "..." },
  // ],
};
