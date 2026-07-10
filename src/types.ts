export interface Ingredient {
  name: string;
  amount: string; // Keep as string to support "1/2", "szczypta", "3", "300"
  unit: string;   // e.g., "g", "ml", "szt.", "łyżka", "łyżeczka", "szklanka", "ząbek", "opakowanie"
}

export type RecipeDifficulty = 'Łatwy' | 'Średni' | 'Trudny';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Obiad", "Deser", "Śniadanie", "Kolacja", "Przystawki", "Wypieki"
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: RecipeDifficulty;
  portions: number;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  isFavorite?: boolean;
}

export const CATEGORIES = [
  "Wszystkie",
  "Śniadanie",
  "Obiad",
  "Kolacja",
  "Desery",
  "Wypieki",
  "Przekąski"
];

export const RECIPE_CATEGORIES_WITHOUT_ALL = CATEGORIES.slice(1);

export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "szt.",
  "łyżka",
  "łyżeczka",
  "szklanka",
  "szczypta",
  "ząbek",
  "pęczek",
  "opakowanie",
  "do smaku"
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Tradycyjny Barszcz Czerwony",
    description: "Głęboki w smaku, aromatyczny, prawdziwie świąteczny barszcz czerwony na domowym zakwasie buraczanym z nutą majeranku i czosnku.",
    category: "Obiad",
    prepTime: 20,
    cookTime: 120,
    difficulty: "Średni",
    portions: 6,
    ingredients: [
      { name: "Buraki ćwikłowe", amount: "1.5", unit: "kg" },
      { name: "Włoszczyzna (marchew, pietruszka, seler, por)", amount: "1", unit: "opakowanie" },
      { name: "Zakwas buraczany", amount: "500", unit: "ml" },
      { name: "Czosnek", amount: "4", unit: "ząbek" },
      { name: "Suszone grzyby", amount: "4", unit: "szt." },
      { name: "Majeranek suszony", amount: "2", unit: "łyżka" },
      { name: "Liść laurowy", amount: "3", unit: "szt." },
      { name: "Ziele angielskie", amount: "5", unit: "szt." },
      { name: "Sól i świeżo mielony pieprz", amount: "1", unit: "do smaku" },
      { name: "Sok z cytryny lub ocet jabłkowy", amount: "1", unit: "łyżka" }
    ],
    steps: [
      "Suszone grzyby opłucz i namocz w szklance zimnej wody przez kilka godzin, a następnie ugotuj do miękkości.",
      "Buraki dokładnie umyj, obierz i pokrój w średniej grubości plastry. Włoszczyznę obierz.",
      "Do dużego garnka włóż buraki, włoszczyznę, ugotowane grzyby wraz z wywarem oraz przyprawy: liście laurowe, ziele angielskie i pieprz ziarnisty.",
      "Zalej całość zimną wodą (około 2.5 litra) i powoli doprowadź do wrzenia. Gotuj na bardzo małym ogniu przez około 1.5 - 2 godziny, aż buraki oddadzą cały swój kolor i aromat.",
      "Wyjmij warzywa z wywaru. Dodaj przeciśnięte przez praskę ząbki czosnku i roztarty w dłoniach majeranek.",
      "Wlej zakwas buraczany. Od tego momentu barszczu nie wolno już gotować (wrzenie zniszczy piękny rubinowy kolor i smak zakwasu).",
      "Dopraw barszcz solą, pieprzem oraz sokiem z cytryny lub octem jabłkowym według uznania. Odstaw pod przykryciem na 15 minut, aby smaki idealnie się połączyły. Podawaj z domowymi uszkami."
    ],
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800",
    createdBy: "Babcia Marysia",
    createdAt: "2026-07-01T12:00:00Z",
    isFavorite: true
  },
  {
    id: "2",
    title: "Szarlotka na Kruchym Cieście z Kruszonką",
    description: "Puszyste, pachnące cynamonem jabłka zamknięte pod maślaną, chrupiącą kruszonką. Przepis przekazywany w naszej rodzinie od pokoleń.",
    category: "Desery",
    prepTime: 35,
    cookTime: 50,
    difficulty: "Łatwy",
    portions: 12,
    ingredients: [
      { name: "Mąka pszenna", amount: "400", unit: "g" },
      { name: "Masło (zimne)", amount: "250", unit: "g" },
      { name: "Cukier puder", amount: "100", unit: "g" },
      { name: "Żółtka jaj", amount: "4", unit: "szt." },
      { name: "Proszek do pieczenia", amount: "1", unit: "łyżeczka" },
      { name: "Jabłka (najlepiej szara reneta)", amount: "1.5", unit: "kg" },
      { name: "Cynamon mielony", amount: "2", unit: "łyżeczka" },
      { name: "Cukier waniliowy", amount: "1", unit: "opakowanie" },
      { name: "Skrobia ziemniaczana", amount: "1", unit: "łyżka" }
    ],
    steps: [
      "Mąkę przesiej z proszkiem do pieczenia i cukrem pudrem. Dodaj pokrojone w kostkę zimne masło i szybko posiekaj nożem lub rozgnieć palcami na kruszonkę.",
      "Dodaj żółtka i szybko zagnieć jednolite ciasto. Podziel je na dwie części (60% i 40%). Mniejszą część owiń folią i włóż do zamrażalnika. Większą częścią wylep spód tortownicy (śr. 26cm) wyłożonej papierem do pieczenia i nakłuj widelcem. Wstaw do lodówki na 30 minut.",
      "Jabłka obierz, usuń gniazda nasienne i zetrzyj na tarce o grubych oczkach lub pokrój w kostkę. Umieść w garnku z dodatkiem łyżki wody i praż przez około 10-15 minut, aż lekko zmiękną. Pod koniec dodaj cynamon, cukier waniliowy oraz skrobię ziemniaczaną (która wchłonie nadmiar soku). Ostudź.",
      "Piekarnik nagrzej do 180°C. Podpiecz spód ciasta przez około 12-15 minut na złoty kolor.",
      "Na podpieczony spód wyłóż przygotowane jabłka. Na wierzch zetrzyj na tarce schłodzone w zamrażalniku ciasto (40%).",
      "Piecz przez około 45-50 minut w temperaturze 180°C, aż wierzch będzie piękny i złocisty. Przed podaniem możesz oprószyć cukrem pudrem."
    ],
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    createdBy: "Mama Ania",
    createdAt: "2026-07-03T15:30:00Z",
    isFavorite: true
  },
  {
    id: "3",
    title: "Puszyste Racuchy z Jabłkami",
    description: "Szybkie, domowe racuchy na maślance lub zsiadłym mleku. Są niezwykle puszyste w środku i chrupiące z zewnątrz.",
    category: "Śniadanie",
    prepTime: 15,
    cookTime: 15,
    difficulty: "Łatwy",
    portions: 4,
    ingredients: [
      { name: "Mąka pszenna", amount: "250", unit: "g" },
      { name: "Maślanka lub kefir", amount: "250", unit: "ml" },
      { name: "Jajko", amount: "1", unit: "szt." },
      { name: "Cukier", amount: "1.5", unit: "łyżka" },
      { name: "Soda oczyszczona", amount: "1", unit: "łyżeczka" },
      { name: "Jabłka średnie", amount: "2", unit: "szt." },
      { name: "Olej do smażenia", amount: "4", unit: "łyżka" },
      { name: "Cukier puder do posypania", amount: "2", unit: "łyżka" }
    ],
    steps: [
      "Jabłka obierz, usuń gniazda nasienne i pokrój w cienkie półplasterki lub małą kostkę.",
      "W misce wymieszaj trzepaczką jajko, maślankę, cukier oraz sodę oczyszczoną.",
      "Stopniowo dodawaj przesianą mąkę, cały czas mieszając, aż powstanie gęste, gładkie ciasto.",
      "Do gotowego ciasta dodaj pokrojone jabłka i delikatnie wymieszaj łyżką.",
      "Na patelni dobrze rozgrzej olej. Nakładaj porcje ciasta łyżką, formując okrągłe placuszki.",
      "Smaż na średnim ogniu przez około 2-3 minuty z każdej strony, aż racuchy będą ładnie wyrośnięte i rumiane.",
      "Odsącz z nadmiaru tłuszczu na ręczniku papierowym. Podawaj jeszcze ciepłe, obficie posypane cukrem pudrem."
    ],
    imageUrl: "https://images.unsplash.com/photo-1554520735-0a6b8b6cd8b7?auto=format&fit=crop&q=80&w=800",
    createdBy: "Ciocia Halinka",
    createdAt: "2026-07-05T08:00:00Z"
  },
  {
    id: "4",
    title: "Kotlet Schabowy Maślany",
    description: "Idealny polski kotlet schabowy, delikatny i soczysty dzięki wielogodzinnemu moczeniu w mleku z cebulą przed panierowaniem.",
    category: "Obiad",
    prepTime: 30,
    cookTime: 15,
    difficulty: "Łatwy",
    portions: 4,
    ingredients: [
      { name: "Schab bez kości", amount: "4", unit: "szt." },
      { name: "Mleko", amount: "300", unit: "ml" },
      { name: "Cebula", amount: "1", unit: "szt." },
      { name: "Czosnek", amount: "2", unit: "ząbek" },
      { name: "Jajka", amount: "2", unit: "szt." },
      { name: "Mąka pszenna", amount: "4", unit: "łyżka" },
      { name: "Bułka tarta", amount: "6", unit: "łyżka" },
      { name: "Smalec do smażenia (lub olej rzepakowy)", amount: "100", unit: "g" },
      { name: "Sól i świeżo mielony czarny pieprz", amount: "1", unit: "do smaku" }
    ],
    steps: [
      "Plastry schabu oczyść i delikatnie rozbij tłuczkiem z obu stron na cienkie kotlety (najlepiej przez folię spożywczą, aby nie uszkodzić mięsa).",
      "Włóż rozbite mięso do miski, zalej mlekiem, dodaj pokrojoną w talarki cebulę oraz zmiażdżone ząbki czosnku. Odstaw do lodówki na minimum 2 godziny (najlepiej na całą noc).",
      "Wyjmij mięso z marynaty, dokładnie osusz ręcznikiem papierowym, oprósz z obu stron solą i świeżo mielonym pieprzem.",
      "Przygotuj trzy talerze: z mąką, z roztrzepanymi jajkami (lekko posolonymi) oraz z bułką tartą.",
      "Każdy kotlet obtocz najpierw w mące, potem w jajku, a na końcu w bułce tartej, delikatnie dociskając panierkę.",
      "Na patelni mocno rozgrzej smalec lub olej. Kotlety smaż na średnim ogniu po około 3-4 minuty z każdej strony na złocisto-brązowy kolor.",
      "Po usmażeniu odsącz z tłuszczu na papierowym ręczniku. Podawaj z purée ziemniaczanym i zasmażaną kapustą lub mizerią."
    ],
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    createdBy: "Tata Mikołaj",
    createdAt: "2026-07-06T14:10:00Z"
  }
];
