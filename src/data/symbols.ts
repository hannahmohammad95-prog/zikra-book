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
    { id: "burj_khalifa", label: "Burj Khalifa", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570757/Cover_aju52n.svg" },
    { id: "uae_flag",     label: "UAE Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570756/2_k21awc.svg"     },
    { id: "desert",       label: "Desert",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570755/3_j1xrsp.svg"     },
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
    { id: "galata_tower", label: "Galata Tower",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570755/Tower_uagjs1.svg"       },
    { id: "turkish_tea",  label: "Turkish Tea",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570753/Tea_y7l4rg.svg"          },
    { id: "turkey_flag",  label: "Turkish Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570752/Turkey_Flag_io90ig.svg"   },
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
    { id: "tuk_tuk",     label: "Tuk Tuk",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570751/2_f5tq3f.svg"  },
    { id: "sunrise",     label: "Sunrise",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570749/1_mnkmiz.svg"  },
    { id: "thai_flag",   label: "Thai Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570749/3_ttojyy.svg"  },
  ],

  indonesia: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  vietnam: [
    { id: "conical_hat",    label: "Conical Hat",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570763/Cover_iuq8sd.svg" },
    { id: "vietnam_flag",   label: "Vietnam Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570762/2_aoiiia.svg"     },
    { id: "temple",         label: "Temple",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570761/3_w6jgvf.svg"     },
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

  uk: [
    { id: "england_flag",    label: "England Flag",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570760/2_web7uw.svg"  },
    { id: "british_guard",   label: "British Guard",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570759/3_ohqnxb.svg" },
    { id: "big_ben",         label: "Big Ben",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570758/1_b5kpze.svg" },
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
