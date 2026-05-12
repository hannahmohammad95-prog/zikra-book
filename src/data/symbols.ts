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
    { id: "qatar_flag",  label: "Qatar Flag",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570691/Cover_iobw5z.svg" },
    { id: "towers",      label: "Traditional Towers", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570690/2_roxs8d.svg"     },
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
    { id: "jordan_flag", label: "Jordan Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570671/2_nb9cgh.svg" },
    { id: "petra",       label: "Petra",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570670/1_qrfyx7.svg" },
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
    { id: "eiffel_tower", label: "Eiffel Tower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570660/Cover_pvfzlw.svg" },
    { id: "croissant",    label: "Croissant",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570659/2_tm85z9.svg"    },
    { id: "france_flag",  label: "French Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570657/3_bpogrz.svg"    },
  ],

  spain: [
    { id: "spain_flag", label: "Spain Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453663/Spain_Flag_qqbb1n.svg" },
    { id: "fan",        label: "Fan",        url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453663/Fan_b4e9yu.svg"        },
    { id: "dance",      label: "Dance",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777453661/Dance_qhnrnq.svg"      },
  ],

  portugal: [
    { id: "rooster",      label: "Rooster of Barcelos", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570686/Cover_zqffw0.svg" },
    { id: "portugal_flag", label: "Portugal Flag",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570685/2_lj5lq2.svg"    },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  greece: [
    { id: "evil_eye",      label: "Evil Eye",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570663/Cover_gyzoq3.svg" },
    { id: "santorini",     label: "Santorini",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570662/2_o7cd9w.svg"    },
    { id: "greece_flag",   label: "Greek Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570661/3_rha6ch.svg"    },
  ],

  australia: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "new-zealand": [
    { id: "kiwi",       label: "Kiwi Bird",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570677/Cover_pf7fym.svg" },
    { id: "nz_flag",    label: "NZ Flag",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570676/2_iupplv.svg"    },
    { id: "maori",      label: "Māori Warrior",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570675/3_u5avke.svg"    },
  ],

  japan: [
    { id: "japan_flag",     label: "Japan Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454036/Japan_Flag_lqmvga.svg"     },
    { id: "blossom_tree",   label: "Blossom Tree",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454024/Blossom_Tree_dlyscf.svg"   },
    { id: "blossom_flower", label: "Blossom Flower", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1777454021/Blossom_Flower_yokgm3.svg" },
  ],

  singapore: [
    { id: "merlion",        label: "Merlion",          url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570693/Cover_mebdju.svg" },
    { id: "singapore_flag", label: "Singapore Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570692/2_pzq48g.svg"    },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  china: [
    { id: "dragon",          label: "Dragon",           url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570655/Cover_hcbu6o.svg" },
    { id: "temple_of_heaven",label: "Temple of Heaven", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570654/2_ue6ar7.svg"    },
    { id: "china_flag",      label: "Chinese Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570652/3_kcxdpl.svg"    },
  ],

  thailand: [
    { id: "tuk_tuk",     label: "Tuk Tuk",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570751/2_f5tq3f.svg"  },
    { id: "sunrise",     label: "Sunrise",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570749/1_mnkmiz.svg"  },
    { id: "thai_flag",   label: "Thai Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570749/3_ttojyy.svg"  },
  ],

  indonesia: [
    { id: "bali_temple",   label: "Balinese Temple", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570669/Cover_cwx9c2.svg" },
    { id: "barong_mask",   label: "Barong Mask",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570668/2_a99ppx.svg"    },
    { id: "indonesia_flag",label: "Indonesia Flag",  url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570667/3_rjcqfo.svg"    },
  ],

  vietnam: [
    { id: "conical_hat",    label: "Conical Hat",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570763/Cover_iuq8sd.svg" },
    { id: "vietnam_flag",   label: "Vietnam Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570762/2_aoiiia.svg"     },
    { id: "temple",         label: "Temple",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570761/3_w6jgvf.svg"     },
  ],

  "south-africa": [
    { id: "lion",        label: "Lion",             url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570743/Cover_yteutc.svg" },
    { id: "sa_flag",     label: "South Africa Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570696/2_enxqe2.svg"   },
    { id: "safari",      label: "Safari Giraffe",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570695/3_hrbqnj.svg"    },
  ],

  tanzania: [
    { id: "palm_tree",      label: "Palm Tree",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570747/Cover_uiyppf.svg" },
    { id: "african_drums",  label: "African Drums",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570746/2_axiaqh.svg"     },
    { id: "tanzania_flag",  label: "Tanzania Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570745/3_qgw08d.svg"     },
  ],

  canada: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  mexico: [
    { id: "taco",        label: "Taco",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570674/Cover_sbn0pn.svg" },
    { id: "mexico_flag", label: "Mexican Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570673/2_yomv7q.svg"    },
    { id: "sombrero",    label: "Sombrero",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570672/3_suprh0.svg"    },
  ],

  peru: [
    { id: "llamas",      label: "Llamas",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570684/Cover_yhebmf.svg" },
    { id: "peru_flag",   label: "Peru Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570683/2_vguufg.svg"    },
    { id: "machu_picchu", label: "Machu Picchu", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570682/3_vwwd0m.svg"  },
  ],

  argentina: [
    // { id: "symbol1", label: "Label 1", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol2", label: "Label 2", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  ecuador: [
    { id: "galapagos_turtle", label: "Galápagos Turtle", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570657/Cover_ejcbec.svg" },
    { id: "ecuador_flag",     label: "Ecuador Flag",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570656/2_xqesow.svg"     },
    // { id: "symbol3", label: "Label 3", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/..." },
  ],

  "puerto-rico": [
    { id: "tropical_beach", label: "Tropical Beach",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570689/Cover_jiw83n.svg" },
    { id: "toucan",         label: "Toucan",           url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570688/2_ivwv9b.svg"     },
    { id: "pr_flag",        label: "Puerto Rico Flag", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570687/3_fwbn4i.svg"     },
  ],

  uk: [
    { id: "england_flag",    label: "England Flag",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570760/2_web7uw.svg"  },
    { id: "british_guard",   label: "British Guard",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570759/3_ohqnxb.svg" },
    { id: "big_ben",         label: "Big Ben",         url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570758/1_b5kpze.svg" },
  ],

  "sri-lanka": [
    { id: "moorish_arch",   label: "Moorish Arch",      url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570747/2_imdlhk.svg"  },
    { id: "lion_sword",     label: "Lion with Sword",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570744/3_dfblfw.svg"  },
    { id: "srilanka_flag",  label: "Sri Lanka Flag",    url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570743/1_l3xtvt.svg"  },
  ],

  hungary: [
    { id: "chimney_cake",   label: "Chimney Cake",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570666/Cover_sadfsu.svg" },
    { id: "hungary_flag",   label: "Hungary Flag",       url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570665/2_vxqpkx.svg"    },
    { id: "parliament",     label: "Budapest Parliament",url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570664/3_tmlfyf.svg"    },
  ],

  palestine: [
    { id: "palestine_flag",  label: "Palestine Flag",   url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570681/2_z56i3n.svg"  },
    { id: "dome_of_rock",    label: "Dome of the Rock", url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570680/3_ourvcj.svg"  },
    { id: "olive_branch",    label: "Olive Branch",     url: "https://res.cloudinary.com/dis5pqgzn/image/upload/v1778570679/1_scg6mi.svg"  },
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
