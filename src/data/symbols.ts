export type BookSymbol = {
  id:    string;
  label: string;
  url:   string;
};

export const SYMBOLS: Record<string, BookSymbol[]> = {

  // ── DONE ──────────────────────────────────────────────────────────────────
  italy: [
    { id: "pizza",         label: "Pizza",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777392823/pizza1_5f651d.png"   },
    { id: "italian_flag",  label: "Italian Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777452984/Italian_Flag_h3ypoe.svg" },
    { id: "leaning_tower", label: "Leaning Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777452805/Leaning_Tower_yi3lqr.svg" },
  ],

  // ── TO DO — upload 3 symbols each to Cloudinary, paste URLs below ─────────

  qatar: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  uae: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "saudi-arabia": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  jordan: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  egypt: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  morocco: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  turkey: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  france: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  spain: [
    { id: "spain_flag", label: "Spain Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453663/Spain_Flag_qqbb1n.svg" },
    { id: "fan",        label: "Fan",        url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453663/Fan_b4e9yu.svg"        },
    { id: "dance",      label: "Dance",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453661/Dance_qhnrnq.svg"      },
  ],

  portugal: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  greece: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  australia: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "new-zealand": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  japan: [
    { id: "japan_flag",     label: "Japan Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454036/Japan_Flag_lqmvga.svg"     },
    { id: "blossom_tree",   label: "Blossom Tree",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454024/Blossom_Tree_dlyscf.svg"   },
    { id: "blossom_flower", label: "Blossom Flower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454021/Blossom_Flower_yokgm3.svg" },
  ],

  singapore: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  china: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  thailand: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  indonesia: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  vietnam: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "south-africa": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  tanzania: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  canada: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  mexico: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  peru: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  argentina: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  ecuador: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "puerto-rico": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "sri-lanka": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  // ── OCCASIONS ─────────────────────────────────────────────────────────────
  wedding: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  birthday: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  graduation: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  pregnancy: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  // ── FAMILY ────────────────────────────────────────────────────────────────
  "sibling-book": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "mothers-day": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "fathers-day": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "annual-book": [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  reunion: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

};
