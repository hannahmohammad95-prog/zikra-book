export type BookSymbol = {
  id:    string;
  label: string;
  url:   string;
};

export const SYMBOLS: Record<string, BookSymbol[]> = {
  italy: [
    { id: "pizza",         label: "Pizza",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777385313/Picture1_k1dzol.png" },
    { id: "italian_flag",  label: "Italian Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777384054/2_pkjxcd.svg"      },
    { id: "leaning_tower", label: "Leaning Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777384055/3_kvidwj.svg"      },
  ],
  // Add more countries below as you upload their symbols to Cloudinary
  // Copy the URL from Cloudinary (click image → Copy URL) and paste it here
  // france: [
  //   { id: "eiffel",    label: "Eiffel Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v.../..." },
  //   { id: "croissant", label: "Croissant",     url: "..." },
  //   { id: "flag",      label: "French Flag",   url: "..." },
  // ],
};
