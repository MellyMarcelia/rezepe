import type { Db, Recipe } from '@/types'

import me from '@/assets/img/avatars/me.webp'
import grandma from '@/assets/img/avatars/grandma.webp'
import mom from '@/assets/img/avatars/mom.webp'
import ericaa from '@/assets/img/avatars/ericaa.webp'
import sistur from '@/assets/img/avatars/sistur.webp'
import uncleRobert from '@/assets/img/avatars/uncle-robert.webp'
import cousinJames from '@/assets/img/avatars/cousin-james.webp'
import auntieKate from '@/assets/img/avatars/auntie-kate.webp'

import grandmasCookbook from '@/assets/img/groups/grandmas-cookbook.webp'
import thanksgiving from '@/assets/img/groups/thanksgiving.webp'
import nuclearFamily from '@/assets/img/groups/nuclear-family.webp'
import birthday from '@/assets/img/groups/birthday.webp'
import comfortFoods from '@/assets/img/groups/comfort-foods.webp'
import christmasEve from '@/assets/img/groups/christmas-eve.webp'

import grandmaNoodles from '@/assets/img/food/grandma-noodles.webp'
import mieGoreng from '@/assets/img/food/mie-goreng.webp'
import dumplings from '@/assets/img/food/dumplings.webp'
import butterCookies from '@/assets/img/food/butter-cookies.webp'
import blanquette from '@/assets/img/food/blanquette.webp'
import chickenNuggets from '@/assets/img/food/chicken-nuggets.webp'
import airFryerNuggets from '@/assets/img/food/air-fryer-nuggets.webp'
import braisedRibs from '@/assets/img/food/braised-ribs.webp'
import cinnamonRolls from '@/assets/img/food/cinnamon-rolls.webp'
import lumpia from '@/assets/img/food/lumpia.webp'
import { moreRecipes } from './moreRecipes'

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const SEED_VERSION = 2

export function createSeed(now = Date.now()): Db {
  const ago = (ms: number) => now - ms

  const recipes: Recipe[] = [
    {
      id: 'mie-goreng',
      title: 'Mie Goreng',
      cuisine: 'Indonesian',
      authorId: 'grandma',
      groupId: 'grandmas-cookbook',
      cover: grandmaNoodles,
      sinceYear: 2005,
      servings: 4,
      minutes: 35,
      story:
        "Heyy kiddos, I know instant noodles are good, but believe me, my fried noodles are even better. I never used a recipe — I cooked with my heart. But I kept seeing my children and grandchildren trying to recreate it, and though their noodles aren't quite the same, their laughter and effort remind me that my mie goreng is more than a meal. It's my legacy, carried on in their hands. So I finally wrote it down.",
      ingredients: [
        {
          items: [
            { qty: 1, unit: 'pack', name: 'egg noodles' },
            { qty: 2, name: 'eggs, beaten' },
            { qty: 3, unit: 'stalks', name: 'spring onions, chopped' },
            { qty: 1, name: 'red chilli, sliced' },
            { qty: 2, unit: 'cloves', name: 'garlic, minced' },
            { qty: 150, unit: 'g', name: 'cabbage, shredded' },
            { qty: 200, unit: 'g', name: 'chicken thigh, sliced' },
          ],
        },
        {
          title: 'For the sauce',
          items: [
            { qty: 2, unit: 'tbsp', name: 'kecap manis (sweet soy sauce)' },
            { qty: 1, unit: 'tbsp', name: 'oyster sauce' },
            { qty: 1, unit: 'tbsp', name: 'chilli sauce or sambal' },
            { qty: 1, unit: 'tsp', name: 'MSG' },
          ],
        },
        {
          title: 'To garnish (optional)',
          items: [
            { qty: 1, name: 'fried egg' },
            { qty: 4, unit: 'slices', name: 'cucumber' },
            { qty: 2, unit: 'wedges', name: 'tomato' },
          ],
        },
      ],
      steps: [
        'Cook the noodles according to the package instructions. Drain and set aside.',
        'In a small bowl, mix together all the sauce ingredients: kecap manis, oyster sauce, chilli sauce and MSG. Set aside.',
        'Heat a splash of oil in a large pan or wok over medium heat. Add the eggs and scramble them. Remove and set aside.',
        'In the same pan, add a bit more oil, then the garlic and chicken. Cook for 5 minutes, until browned and cooked through.',
        'Add the chilli and spring onions and sauté for 1 minute until fragrant. Add the cabbage and cook until just wilted.',
        'Add back the noodles and eggs. Pour in the sauce and toss for 2 minutes, until everything is coated and the noodles caramelise slightly. Taste and adjust the salt.',
        'If you like, fry an egg in another pan while the noodles finish.',
        'Plate the noodles, top with the fried egg and garnish with cucumber and tomato.',
      ],
      allergens: ['gluten', 'egg', 'soy', 'shellfish'],
      createdAt: ago(40 * DAY),
      loves: [
        { personId: 'mom', at: ago(30 * DAY) },
        { personId: 'ericaa', at: ago(12 * DAY) },
        { personId: 'cousin-james', at: ago(5 * DAY) },
        { personId: 'me', at: ago(3 * DAY) },
      ],
      saves: [{ personId: 'me', at: ago(3 * DAY) }],
    },
    {
      id: 'mushroom-mie-goreng',
      title: 'Mushroom Mie Goreng',
      cuisine: 'Indonesian',
      authorId: 'ericaa',
      groupId: 'grandmas-cookbook',
      cover: mieGoreng,
      parentId: 'mie-goreng',
      twistNote:
        'Swapped the chicken for king oyster mushrooms and added bok choy. Use vegetarian oyster sauce to make it fully meat-free.',
      servings: 4,
      minutes: 30,
      story:
        'I stopped eating meat last year and thought I\'d lost Grandma\'s noodles forever. Turns out mushrooms soak up the sauce even better. Grandma tried it and said "not bad" — which from her is a gold medal.',
      ingredients: [
        {
          items: [
            { qty: 1, unit: 'pack', name: 'egg noodles' },
            { qty: 2, name: 'eggs, beaten' },
            { qty: 3, unit: 'stalks', name: 'spring onions, chopped' },
            { qty: 1, name: 'red chilli, sliced' },
            { qty: 3, unit: 'cloves', name: 'garlic, minced' },
            { qty: 250, unit: 'g', name: 'king oyster mushrooms, torn' },
            { qty: 2, unit: 'heads', name: 'bok choy, halved' },
          ],
        },
        {
          title: 'For the sauce',
          items: [
            { qty: 2, unit: 'tbsp', name: 'kecap manis (sweet soy sauce)' },
            { qty: 1, unit: 'tbsp', name: 'vegetarian oyster sauce' },
            { qty: 1, unit: 'tbsp', name: 'sambal oelek' },
          ],
        },
      ],
      steps: [
        'Cook the noodles according to the package instructions. Drain and set aside.',
        'Mix the kecap manis, oyster sauce and sambal in a small bowl.',
        'Scramble the eggs in a hot wok with a little oil. Remove and set aside.',
        'Add more oil and fry the mushrooms without moving them for 4 minutes, until golden. Add the garlic and chilli.',
        'Add the bok choy and spring onions and cook for 2 minutes.',
        'Return the noodles and eggs, pour over the sauce and toss until glossy.',
      ],
      allergens: ['gluten', 'egg', 'soy'],
      createdAt: ago(37 * MIN),
      loves: [
        { personId: 'grandma', at: ago(20 * MIN) },
        { personId: 'sistur', at: ago(10 * MIN) },
      ],
      saves: [],
    },
    {
      id: 'chinese-dumplings',
      title: 'Chinese Dumplings',
      cuisine: 'Chinese',
      authorId: 'grandma',
      groupId: 'grandmas-cookbook',
      cover: dumplings,
      sinceYear: 2007,
      servings: 6,
      minutes: 90,
      story:
        'I hope one day you understand how much effort I put in just so you can enjoy homemade food. Every New Year we sat around the table folding these together — the ugly ones were always the tastiest.',
      ingredients: [
        {
          title: 'Dough',
          items: [
            { qty: 300, unit: 'g', name: 'plain flour' },
            { qty: 160, unit: 'ml', name: 'warm water' },
            { qty: 1, unit: 'pinch', name: 'salt' },
          ],
        },
        {
          title: 'Filling',
          items: [
            { qty: 400, unit: 'g', name: 'minced pork' },
            { qty: 200, unit: 'g', name: 'napa cabbage, finely chopped' },
            { qty: 2, unit: 'tbsp', name: 'soy sauce' },
            { qty: 1, unit: 'tbsp', name: 'Shaoxing wine' },
            { qty: 1, unit: 'tsp', name: 'sesame oil' },
            { qty: 1, unit: 'tbsp', name: 'ginger, grated' },
            { qty: 3, unit: 'stalks', name: 'spring onions, chopped' },
          ],
        },
      ],
      steps: [
        'Mix the flour and salt, then slowly stir in the warm water until a shaggy dough forms. Knead for 10 minutes until smooth. Cover and rest for 30 minutes.',
        'Salt the chopped cabbage, leave for 10 minutes, then squeeze out as much water as you can.',
        'Mix the pork, cabbage, soy sauce, Shaoxing wine, sesame oil, ginger and spring onions. Stir in one direction until sticky.',
        'Roll the dough into a log, cut it into 40 pieces and roll each one into a thin circle.',
        'Place a teaspoon of filling in the centre, fold the wrapper in half and pleat the edges to seal.',
        'Boil the dumplings in batches for 6 minutes, until they float and the filling is cooked through.',
      ],
      allergens: ['gluten', 'soy', 'sesame'],
      createdAt: ago(60 * DAY),
      loves: [
        { personId: 'mom', at: ago(50 * DAY) },
        { personId: 'auntie-kate', at: ago(20 * DAY) },
      ],
      saves: [],
    },
    {
      id: 'butter-cookies',
      cover: butterCookies,
      title: 'Butter Cookies',
      cuisine: 'Dutch',
      authorId: 'grandma',
      groupId: 'christmas-eve',
      sinceYear: 1988,
      servings: 30,
      minutes: 45,
      story:
        'The tin was always hidden on top of the fridge, and somehow it was always half empty by Christmas morning. I know it was you, Robert.',
      ingredients: [
        {
          items: [
            { qty: 250, unit: 'g', name: 'unsalted butter, softened' },
            { qty: 125, unit: 'g', name: 'icing sugar' },
            { qty: 1, name: 'egg yolk' },
            { qty: 1, unit: 'tsp', name: 'vanilla extract' },
            { qty: 300, unit: 'g', name: 'plain flour' },
            { qty: 1, unit: 'pinch', name: 'salt' },
          ],
        },
      ],
      steps: [
        'Preheat the oven to 170°C and line two trays with baking paper.',
        'Beat the butter and icing sugar for 3 minutes until pale and fluffy.',
        'Beat in the egg yolk and vanilla, then fold in the flour and salt until just combined.',
        'Pipe rosettes onto the trays using a star nozzle.',
        'Bake for 14 minutes, until the edges are just golden. Cool on the tray.',
      ],
      allergens: ['gluten', 'egg', 'milk'],
      createdAt: ago(90 * DAY),
      loves: [{ personId: 'uncle-robert', at: ago(2 * HOUR) }],
      saves: [],
    },
    {
      id: 'blanquette-de-veau',
      cover: blanquette,
      title: 'Blanquette de Veau',
      cuisine: 'French',
      authorId: 'me',
      groupId: 'nuclear-family',
      servings: 6,
      minutes: 150,
      story:
        "I learned this during my semester in Lyon, from the landlady who fed me every Sunday. It's become our family's rainy-day dinner.",
      ingredients: [
        {
          items: [
            { qty: 1.2, unit: 'kg', name: 'veal shoulder, cubed' },
            { qty: 2, name: 'carrots, cut into chunks' },
            { qty: 1, name: 'onion, studded with 2 cloves' },
            { qty: 1, name: 'bouquet garni' },
            { qty: 250, unit: 'g', name: 'button mushrooms' },
            { qty: 40, unit: 'g', name: 'butter' },
            { qty: 40, unit: 'g', name: 'plain flour' },
            { qty: 200, unit: 'ml', name: 'crème fraîche' },
            { qty: 2, name: 'egg yolks' },
            { qty: 0.5, name: 'lemon, juiced' },
          ],
        },
      ],
      steps: [
        'Put the veal in a large pot, cover with cold water and bring to a boil. Skim off the foam.',
        'Add the carrots, onion and bouquet garni. Simmer gently for 90 minutes, until the veal is tender.',
        'Meanwhile, sauté the mushrooms in a little butter until golden.',
        'Strain the meat, keeping 1 litre of the broth. Melt the butter, whisk in the flour, then slowly add the broth to make a velouté.',
        'Whisk the crème fraîche, egg yolks and lemon juice together, and stir into the sauce off the heat.',
        'Return the veal and mushrooms to the sauce, warm through gently and serve with rice.',
      ],
      allergens: ['gluten', 'egg', 'milk', 'celery'],
      createdAt: ago(25 * DAY),
      loves: [{ personId: 'mom', at: ago(7 * DAY) }],
      saves: [{ personId: 'mom', at: ago(7 * DAY) }],
    },
    {
      id: 'chicken-nuggets',
      cover: chickenNuggets,
      title: "Mom's Chicken Nuggets",
      cuisine: 'American',
      authorId: 'mom',
      groupId: 'nuclear-family',
      sinceYear: 2001,
      servings: 4,
      minutes: 40,
      story:
        'Every Friday after swimming lessons. The secret is the cornflakes — never tell your father.',
      ingredients: [
        {
          items: [
            { qty: 500, unit: 'g', name: 'chicken breast, cut into pieces' },
            { qty: 100, unit: 'g', name: 'cornflakes, crushed' },
            { qty: 50, unit: 'g', name: 'plain flour' },
            { qty: 2, name: 'eggs, beaten' },
            { qty: 1, unit: 'tsp', name: 'smoked paprika' },
            { qty: 1, unit: 'tsp', name: 'garlic powder' },
          ],
        },
      ],
      steps: [
        'Preheat the oven to 200°C.',
        'Season the flour with paprika, garlic powder, salt and pepper.',
        'Dip each piece of chicken in flour, then egg, then cornflakes.',
        'Bake on a lined tray for 20 minutes, turning halfway, until golden and cooked through.',
      ],
      allergens: ['gluten', 'egg'],
      createdAt: ago(80 * DAY),
      loves: [{ personId: 'me', at: ago(30 * DAY) }],
      saves: [],
    },
    {
      id: 'air-fryer-nuggets',
      cover: airFryerNuggets,
      title: 'Air-Fryer Chicken Nuggets',
      cuisine: 'American',
      authorId: 'ericaa',
      groupId: 'nuclear-family',
      parentId: 'chicken-nuggets',
      twistNote: 'Air-fried instead of baked, and a spoon of parmesan in the cornflake crumb.',
      servings: 4,
      minutes: 25,
      story: 'Same Friday feeling, half the time. Mom approved (after a lot of convincing).',
      ingredients: [
        {
          items: [
            { qty: 500, unit: 'g', name: 'chicken breast, cut into pieces' },
            { qty: 80, unit: 'g', name: 'cornflakes, crushed' },
            { qty: 20, unit: 'g', name: 'parmesan, finely grated' },
            { qty: 50, unit: 'g', name: 'plain flour' },
            { qty: 2, name: 'eggs, beaten' },
            { qty: 1, unit: 'tsp', name: 'smoked paprika' },
          ],
        },
      ],
      steps: [
        'Mix the cornflakes and parmesan.',
        'Coat the chicken in seasoned flour, then egg, then the cornflake crumb.',
        'Air-fry at 190°C for 12 minutes, shaking the basket halfway.',
      ],
      allergens: ['gluten', 'egg', 'milk'],
      createdAt: ago(10 * DAY),
      loves: [],
      saves: [],
    },
    {
      id: 'braised-ribs',
      cover: braisedRibs,
      title: 'Braised Short Ribs',
      cuisine: 'Korean',
      authorId: 'uncle-robert',
      groupId: 'thanksgiving',
      sinceYear: 2012,
      servings: 6,
      minutes: 180,
      story:
        'Brought these to Thanksgiving once as an experiment. Now I am not allowed to come without them.',
      ingredients: [
        {
          items: [
            { qty: 1.5, unit: 'kg', name: 'beef short ribs' },
            { qty: 120, unit: 'ml', name: 'soy sauce' },
            { qty: 1, name: 'Asian pear, grated' },
            { qty: 6, unit: 'cloves', name: 'garlic, minced' },
            { qty: 2, unit: 'tbsp', name: 'brown sugar' },
            { qty: 1, unit: 'tbsp', name: 'sesame oil' },
            { qty: 2, name: 'carrots, in chunks' },
          ],
        },
      ],
      steps: [
        'Soak the ribs in cold water for 30 minutes to draw out the blood. Drain.',
        'Mix the soy sauce, pear, garlic, sugar and sesame oil.',
        'Brown the ribs in a heavy pot, then pour over the sauce and 500 ml of water.',
        'Cover and braise on low heat for 2 hours. Add the carrots for the last 30 minutes.',
      ],
      allergens: ['soy', 'sesame'],
      createdAt: ago(120 * DAY),
      loves: [{ personId: 'cousin-james', at: ago(9 * HOUR) }],
      saves: [],
    },
    {
      id: 'cinnamon-rolls',
      cover: cinnamonRolls,
      title: 'Cinnamon Rolls',
      cuisine: 'Swedish',
      authorId: 'sistur',
      groupId: 'birthday',
      servings: 12,
      minutes: 150,
      story:
        'Birthday-morning rolls. Whoever has a birthday gets the middle one — that is the law.',
      ingredients: [
        {
          title: 'Dough',
          items: [
            { qty: 500, unit: 'g', name: 'plain flour' },
            { qty: 250, unit: 'ml', name: 'warm milk' },
            { qty: 7, unit: 'g', name: 'dried yeast' },
            { qty: 75, unit: 'g', name: 'butter, melted' },
            { qty: 60, unit: 'g', name: 'sugar' },
          ],
        },
        {
          title: 'Filling',
          items: [
            { qty: 100, unit: 'g', name: 'soft butter' },
            { qty: 100, unit: 'g', name: 'brown sugar' },
            { qty: 2, unit: 'tbsp', name: 'cinnamon' },
          ],
        },
      ],
      steps: [
        'Mix the warm milk, yeast and sugar and leave for 5 minutes until foamy.',
        'Add the flour and melted butter and knead for 10 minutes. Leave to rise for 60 minutes.',
        'Roll out into a rectangle, spread with the filling and roll up tightly.',
        'Cut into 12 rolls, place in a tin and rise for 30 minutes more.',
        'Bake at 190°C for 20 minutes until golden.',
      ],
      allergens: ['gluten', 'milk'],
      createdAt: ago(25 * MIN),
      loves: [],
      saves: [],
    },
    {
      id: 'lumpia',
      cover: lumpia,
      title: 'Lumpia',
      cuisine: 'Filipino',
      authorId: 'auntie-kate',
      groupId: 'comfort-foods',
      sinceYear: 1995,
      servings: 30,
      minutes: 75,
      story:
        'Rolled by the hundreds for every family party. Kids get the job of sealing the edges.',
      ingredients: [
        {
          items: [
            { qty: 500, unit: 'g', name: 'minced pork' },
            { qty: 2, name: 'carrots, finely grated' },
            { qty: 1, name: 'onion, finely chopped' },
            { qty: 4, unit: 'cloves', name: 'garlic, minced' },
            { qty: 2, unit: 'tbsp', name: 'soy sauce' },
            { qty: 30, name: 'spring roll wrappers' },
          ],
        },
      ],
      steps: [
        'Mix the pork, carrots, onion, garlic and soy sauce.',
        'Spoon a thin line of filling along one edge of each wrapper, fold in the sides and roll tightly. Seal with water.',
        'Deep-fry at 175°C for 5 minutes until golden and crisp.',
      ],
      allergens: ['gluten', 'soy'],
      createdAt: ago(30 * DAY),
      loves: [],
      saves: [],
    },
  ]

  const extra = moreRecipes(ago)
  recipes.push(...extra.recipes)

  return {
    version: SEED_VERSION,
    meId: 'me',
    people: [
      { id: 'me', name: 'Melly Marcelia', relation: 'You', avatar: me },
      { id: 'grandma', name: 'Grandma', relation: 'Grandmother', avatar: grandma },
      { id: 'mom', name: 'Mom', relation: 'Mother', avatar: mom },
      { id: 'ericaa', name: 'Ericaa', relation: 'Cousin', avatar: ericaa },
      { id: 'sistur', name: 'Sistur', relation: 'Sister', avatar: sistur },
      { id: 'uncle-robert', name: 'Uncle Robert', relation: 'Uncle', avatar: uncleRobert },
      { id: 'cousin-james', name: 'Cousin James', relation: 'Cousin', avatar: cousinJames },
      { id: 'auntie-kate', name: 'Auntie Kate', relation: 'Aunt', avatar: auntieKate },
    ],
    groups: [
      {
        id: 'grandmas-cookbook',
        name: "Grandma's Cookbook",
        cover: grandmasCookbook,
        description: 'Everything Grandma ever made us — written down at last.',
        memberIds: [
          'me',
          'grandma',
          'mom',
          'ericaa',
          'sistur',
          'uncle-robert',
          'cousin-james',
          'auntie-kate',
        ],
        createdAt: ago(60 * DAY),
      },
      {
        id: 'thanksgiving',
        name: 'Thanksgiving Menus',
        cover: thanksgiving,
        description: 'The dishes that have to be on the table, every year.',
        memberIds: ['me', 'mom', 'uncle-robert', 'cousin-james', 'auntie-kate'],
        createdAt: ago(120 * DAY),
      },
      {
        id: 'nuclear-family',
        name: 'Nuclear Family',
        cover: nuclearFamily,
        description: 'Weeknight dinners from our house.',
        memberIds: ['me', 'mom', 'sistur', 'ericaa'],
        createdAt: ago(100 * DAY),
      },
      {
        id: 'birthday',
        name: 'Birthday Party',
        cover: birthday,
        description: 'Cakes, rolls and everything with candles on top.',
        memberIds: ['me', 'sistur', 'mom'],
        createdAt: ago(45 * DAY),
      },
      {
        id: 'comfort-foods',
        name: 'Comfort Foods',
        cover: comfortFoods,
        description: 'For cold nights and bad days.',
        memberIds: ['me', 'auntie-kate', 'grandma', 'cousin-james'],
        createdAt: ago(35 * DAY),
      },
      {
        id: 'christmas-eve',
        name: 'Christmas Eve Edition',
        cover: christmasEve,
        description: 'The long table, the candles, the cookie tin.',
        memberIds: ['me', 'grandma', 'uncle-robert', 'mom', 'auntie-kate'],
        createdAt: ago(90 * DAY),
      },
    ],
    recipes,
    comments: [
      {
        id: 'c1',
        recipeId: 'mie-goreng',
        authorId: 'mom',
        text: 'I always add a little more kecap manis than you, Mama. Don’t be mad.',
        createdAt: ago(10 * MIN),
      },
      {
        id: 'c2',
        recipeId: 'mie-goreng',
        authorId: 'cousin-james',
        text: 'Made this for my flatmates — they asked for the recipe, so I sent them here!',
        createdAt: ago(2 * DAY),
      },
      {
        id: 'c3',
        recipeId: 'butter-cookies',
        authorId: 'uncle-robert',
        text: 'I plead the fifth on the cookie tin.',
        createdAt: ago(2 * HOUR),
      },
      {
        id: 'c4',
        recipeId: 'lumpia',
        authorId: 'cousin-james',
        text: 'Still the best thing at every party.',
        createdAt: ago(2 * DAY),
      },
      ...extra.comments,
    ],
    activitySeenAt: ago(5 * HOUR),
    settings: { units: 'metric', readAloud: true },
    recentlyOpened: [
      'sop-buntut',
      'mie-goreng',
      'chinese-dumplings',
      'pumpkin-pie',
      'blanquette-de-veau',
    ],
  }
}
