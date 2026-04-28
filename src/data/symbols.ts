export type BookSymbol = {
  id:    string;
  label: string;
  url:   string;
};

const CLOUD = "https://res.cloudinary.com/dis5pqgzn/image/upload/f_auto,q_auto";

// Add 3 symbols per country as you upload them to Cloudinary
// Folder structure: zikra_book/SYMBOLS/{COUNTRY}/{filename}
export const SYMBOLS: Record<string, BookSymbol[]> = {
  italy: [
    { id: "leaning_tower", label: "Leaning Tower", url: `${CLOUD}/zikra_book/SYMBOLS/ITALY/leaning%20tower` },
    { id: "italian_flag",  label: "Italian Flag",  url: `${CLOUD}/zikra_book/SYMBOLS/ITALY/italian%20flag`  },
    { id: "pizza",         label: "Pizza",         url: `${CLOUD}/zikra_book/SYMBOLS/ITALY/pizza`           },
  ],
  // Add more countries below as you upload their symbols:
  // france: [
  //   { id: "eiffel",    label: "Eiffel Tower",  url: `${CLOUD}/zikra_book/symbols/france/eiffel`    },
  //   { id: "croissant", label: "Croissant",      url: `${CLOUD}/zikra_book/symbols/france/croissant` },
  //   { id: "flag",      label: "French Flag",    url: `${CLOUD}/zikra_book/symbols/france/flag`      },
  // ],
};
