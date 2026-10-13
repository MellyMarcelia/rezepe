import type { Comment, Recipe } from '@/types'

import sopBuntut from '@/assets/img/food/sop-buntut.webp'
import rendang from '@/assets/img/food/rendang.webp'
import pumpkinPie from '@/assets/img/food/pumpkin-pie.webp'
import roastTurkey from '@/assets/img/food/roast-turkey.webp'
import mulledWine from '@/assets/img/food/mulled-wine.webp'
import chocolateCake from '@/assets/img/food/chocolate-cake.webp'
import bolognese from '@/assets/img/food/bolognese.webp'
import chickenSoup from '@/assets/img/food/chicken-soup.webp'
import cardamomBuns from '@/assets/img/food/cardamom-buns.webp'

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** Extra recipes so every family circle has a lived-in cookbook. */
export function moreRecipes(ago: (ms: number) => number): {
  recipes: Recipe[]
  comments: Comment[]
} {
  const recipes: Recipe[] = [
    {
      id: 'sop-buntut',
      title: 'Sop Buntut',
      cuisine: 'Indonesian',
      authorId: 'grandma',
      groupId: 'grandmas-cookbook',
      cover: sopBuntut,
      sinceYear: 1979,
      servings: 6,
      minutes: 210,
      story:
        'My mother made this oxtail soup on every rainy Sunday, but she never wrote it down. After she passed I spent ten years trying to find it again by taste. I finally did — so here it is, written properly, so nobody in this family has to search for it again.',
      ingredients: [
        {
          items: [
            { qty: 1.5, unit: 'kg', name: 'oxtail, cut into pieces' },
            { qty: 3, unit: 'l', name: 'water' },
            { qty: 3, name: 'carrots, in thick slices' },
            { qty: 3, name: 'potatoes, in chunks' },
            { qty: 2, name: 'tomatoes, quartered' },
            { qty: 2, unit: 'stalks', name: 'celery leaves' },
            { qty: 3, unit: 'stalks', name: 'spring onions' },
          ],
        },
        {
          title: 'Spice paste',
          items: [
            { qty: 6, name: 'shallots' },
            { qty: 5, unit: 'cloves', name: 'garlic' },
            { qty: 0.5, unit: 'tsp', name: 'nutmeg, grated' },
            { qty: 1, unit: 'tsp', name: 'white pepper' },
            { qty: 3, name: 'cloves' },
            { qty: 1, name: 'cinnamon stick' },
          ],
        },
      ],
      steps: [
        'Boil the oxtail in water for 10 minutes, then drain and rinse. This keeps the broth clear.',
        'Cover the oxtail with 3 litres of fresh water and simmer gently for 2 hours, skimming now and then.',
        'Blend the shallots and garlic, then fry with the nutmeg and pepper for 3 minutes until fragrant.',
        'Stir the paste into the broth with the cloves and cinnamon. Add the carrots and potatoes and simmer for 25 minutes.',
        'Add the tomatoes, celery and spring onions for the last 5 minutes. Season with salt.',
        'Serve with rice, fried shallots, sambal and a squeeze of lime.',
      ],
      allergens: ['celery'],
      createdAt: ago(18 * DAY),
      loves: [
        { personId: 'mom', at: ago(17 * DAY) },
        { personId: 'auntie-kate', at: ago(16 * DAY) },
        { personId: 'cousin-james', at: ago(10 * DAY) },
        { personId: 'sistur', at: ago(4 * DAY) },
        { personId: 'me', at: ago(2 * DAY) },
      ],
      saves: [
        { personId: 'me', at: ago(2 * DAY) },
        { personId: 'mom', at: ago(17 * DAY) },
      ],
    },
    {
      id: 'rendang',
      title: 'Beef Rendang',
      cuisine: 'Indonesian',
      authorId: 'mom',
      groupId: 'grandmas-cookbook',
      cover: rendang,
      sinceYear: 1998,
      servings: 6,
      minutes: 240,
      story:
        'Grandma taught me this the week before my wedding. "If you can make rendang, you can make anything." It takes all afternoon — that’s the point. Put on music and stir.',
      ingredients: [
        {
          items: [
            { qty: 1, unit: 'kg', name: 'beef chuck, in large cubes' },
            { qty: 800, unit: 'ml', name: 'coconut milk' },
            { qty: 2, unit: 'stalks', name: 'lemongrass, bruised' },
            { qty: 4, name: 'kaffir lime leaves' },
            { qty: 2, name: 'turmeric leaves (optional)' },
            { qty: 100, unit: 'g', name: 'toasted grated coconut (kerisik)' },
            { qty: 1, unit: 'tbsp', name: 'palm sugar' },
          ],
        },
        {
          title: 'Spice paste',
          items: [
            { qty: 10, name: 'shallots' },
            { qty: 6, unit: 'cloves', name: 'garlic' },
            { qty: 10, name: 'dried chillies, soaked' },
            { qty: 4, unit: 'cm', name: 'galangal' },
            { qty: 3, unit: 'cm', name: 'ginger' },
            { qty: 3, unit: 'cm', name: 'turmeric' },
          ],
        },
      ],
      steps: [
        'Blend all the spice paste ingredients until smooth.',
        'Fry the paste in a little oil over medium heat for 10 minutes, until it darkens and the oil separates.',
        'Add the beef, lemongrass and leaves and stir to coat. Pour in the coconut milk and bring to a simmer.',
        'Cook uncovered on low heat for 3 hours, stirring every 15 minutes, until the sauce has almost disappeared.',
        'Stir in the kerisik and palm sugar, then keep stirring for 20 minutes until the beef is dark and dry.',
      ],
      allergens: [],
      createdAt: ago(14 * DAY),
      loves: [
        { personId: 'grandma', at: ago(14 * DAY) },
        { personId: 'ericaa', at: ago(9 * DAY) },
        { personId: 'uncle-robert', at: ago(3 * DAY) },
      ],
      saves: [{ personId: 'ericaa', at: ago(9 * DAY) }],
    },
    {
      id: 'pumpkin-pie',
      title: 'Pumpkin Pie',
      cuisine: 'American',
      authorId: 'auntie-kate',
      groupId: 'thanksgiving',
      cover: pumpkinPie,
      sinceYear: 1972,
      servings: 8,
      minutes: 75,
      story:
        'Copied word for word from great-grandma’s index card — the one with the butter stain in the corner. She wrote “bake in hot oven”, so I worked out the temperatures for you.',
      ingredients: [
        {
          items: [
            { qty: 1, name: 'unbaked pie shell (23 cm)' },
            { qty: 2, name: 'eggs, slightly beaten' },
            { qty: 425, unit: 'g', name: 'pumpkin purée' },
            { qty: 150, unit: 'g', name: 'sugar' },
            { qty: 0.5, unit: 'tsp', name: 'salt' },
            { qty: 1, unit: 'tsp', name: 'cinnamon' },
            { qty: 0.5, unit: 'tsp', name: 'ground ginger' },
            { qty: 0.25, unit: 'tsp', name: 'ground cloves' },
            { qty: 350, unit: 'ml', name: 'evaporated milk' },
          ],
        },
      ],
      steps: [
        'Preheat the oven to 220°C.',
        'Mix the eggs, pumpkin, sugar, salt and spices, then slowly whisk in the evaporated milk.',
        'Pour into the pie shell. Bake for 15 minutes.',
        'Reduce the oven to 175°C and bake for 45 minutes more, until a knife inserted in the centre comes out clean.',
        'Cool on a rack for at least 2 hours before slicing.',
      ],
      allergens: ['gluten', 'egg', 'milk'],
      createdAt: ago(45 * DAY),
      loves: [
        { personId: 'mom', at: ago(40 * DAY) },
        { personId: 'uncle-robert', at: ago(38 * DAY) },
        { personId: 'me', at: ago(20 * DAY) },
      ],
      saves: [],
    },
    {
      id: 'roast-turkey',
      title: 'Herb-Butter Roast Turkey',
      cuisine: 'American',
      authorId: 'mom',
      groupId: 'thanksgiving',
      cover: roastTurkey,
      sinceYear: 2004,
      servings: 10,
      minutes: 240,
      story:
        'The first year I hosted, the turkey was still frozen in the middle. This is the version I perfected afterwards. Dry-brine it the day before — trust me.',
      ingredients: [
        {
          items: [
            { qty: 5, unit: 'kg', name: 'whole turkey' },
            { qty: 3, unit: 'tbsp', name: 'coarse salt' },
            { qty: 150, unit: 'g', name: 'butter, softened' },
            { qty: 2, unit: 'tbsp', name: 'fresh thyme, chopped' },
            { qty: 1, unit: 'tbsp', name: 'fresh sage, chopped' },
            { qty: 1, name: 'lemon, halved' },
            { qty: 1, name: 'onion, quartered' },
          ],
        },
      ],
      steps: [
        'The day before, rub the turkey all over with the salt and leave it uncovered in the fridge overnight.',
        'Take the turkey out 1 hour before roasting. Preheat the oven to 220°C.',
        'Mix the butter and herbs and push it under the skin of the breast. Put the lemon and onion inside.',
        'Roast for 30 minutes, then lower to 165°C and roast for about 2 hours more, basting every 30 minutes.',
        'Rest under foil for 30 minutes before carving.',
      ],
      allergens: ['milk'],
      createdAt: ago(50 * DAY),
      loves: [{ personId: 'auntie-kate', at: ago(48 * DAY) }],
      saves: [],
    },
    {
      id: 'mulled-wine',
      title: 'Glühwein',
      cuisine: 'German',
      authorId: 'uncle-robert',
      groupId: 'christmas-eve',
      cover: mulledWine,
      sinceYear: 1990,
      servings: 8,
      minutes: 30,
      story:
        'From my years in Munich. The house smells like Christmas for two days afterwards. Never let it boil — the alcohol is the whole point.',
      ingredients: [
        {
          items: [
            { qty: 1.5, unit: 'l', name: 'dry red wine' },
            { qty: 2, name: 'oranges, sliced' },
            { qty: 100, unit: 'g', name: 'brown sugar' },
            { qty: 3, name: 'cinnamon sticks' },
            { qty: 6, name: 'cloves' },
            { qty: 2, name: 'star anise' },
            { qty: 100, unit: 'ml', name: 'rum or brandy (optional)' },
          ],
        },
      ],
      steps: [
        'Put everything except the rum into a large pot.',
        'Warm over low heat for 20 minutes without letting it boil.',
        'Stir in the rum, ladle into mugs and add a slice of orange to each.',
      ],
      allergens: [],
      createdAt: ago(70 * DAY),
      loves: [
        { personId: 'grandma', at: ago(60 * DAY) },
        { personId: 'auntie-kate', at: ago(60 * DAY) },
      ],
      saves: [],
    },
    {
      id: 'chocolate-cake',
      title: 'Midnight Chocolate Cake',
      cuisine: 'Home baking',
      authorId: 'mom',
      groupId: 'birthday',
      cover: chocolateCake,
      sinceYear: 2000,
      servings: 12,
      minutes: 90,
      story:
        'Every birthday since you were born. I bake it at midnight so it’s a surprise in the morning — that’s where the name comes from.',
      ingredients: [
        {
          title: 'Cake',
          items: [
            { qty: 250, unit: 'g', name: 'plain flour' },
            { qty: 75, unit: 'g', name: 'cocoa powder' },
            { qty: 300, unit: 'g', name: 'sugar' },
            { qty: 2, unit: 'tsp', name: 'baking soda' },
            { qty: 2, name: 'eggs' },
            { qty: 250, unit: 'ml', name: 'buttermilk' },
            { qty: 125, unit: 'ml', name: 'vegetable oil' },
            { qty: 250, unit: 'ml', name: 'hot coffee' },
          ],
        },
        {
          title: 'Ganache',
          items: [
            { qty: 200, unit: 'g', name: 'dark chocolate, chopped' },
            { qty: 200, unit: 'ml', name: 'double cream' },
          ],
        },
      ],
      steps: [
        'Preheat the oven to 175°C and grease two 20 cm tins.',
        'Whisk the dry ingredients together. Add the eggs, buttermilk and oil, then stir in the hot coffee — the batter will be thin.',
        'Divide between the tins and bake for 35 minutes, until a skewer comes out clean. Cool completely.',
        'Heat the cream until steaming, pour over the chocolate, wait 5 minutes, then stir until glossy.',
        'Sandwich and cover the cakes with ganache. Candles optional, singing mandatory.',
      ],
      allergens: ['gluten', 'egg', 'milk'],
      createdAt: ago(33 * DAY),
      loves: [
        { personId: 'sistur', at: ago(30 * DAY) },
        { personId: 'me', at: ago(30 * DAY) },
      ],
      saves: [{ personId: 'sistur', at: ago(30 * DAY) }],
    },
    {
      id: 'bolognese',
      title: 'Weeknight Bolognese',
      cuisine: 'Italian',
      authorId: 'me',
      groupId: 'nuclear-family',
      cover: bolognese,
      servings: 4,
      minutes: 60,
      story:
        'My student-flat survival recipe, slowly upgraded every time I came home. Mom still says it needs more garlic.',
      ingredients: [
        {
          items: [
            { qty: 500, unit: 'g', name: 'minced beef' },
            { qty: 1, name: 'onion, finely chopped' },
            { qty: 1, name: 'carrot, finely chopped' },
            { qty: 1, unit: 'stalks', name: 'celery, finely chopped' },
            { qty: 3, unit: 'cloves', name: 'garlic, minced' },
            { qty: 2, unit: 'tbsp', name: 'tomato paste' },
            { qty: 400, unit: 'g', name: 'chopped tomatoes' },
            { qty: 150, unit: 'ml', name: 'red wine' },
            { qty: 400, unit: 'g', name: 'spaghetti' },
          ],
        },
      ],
      steps: [
        'Soften the onion, carrot and celery in olive oil for 10 minutes.',
        'Add the beef and garlic and brown well. Stir in the tomato paste and cook for 2 minutes.',
        'Pour in the wine and let it bubble away, then add the tomatoes. Simmer for 30 minutes.',
        'Cook the spaghetti, toss with the sauce and a splash of pasta water, and serve with parmesan.',
      ],
      allergens: ['gluten', 'celery'],
      createdAt: ago(6 * DAY),
      loves: [
        { personId: 'mom', at: ago(5 * DAY) },
        { personId: 'sistur', at: ago(4 * DAY) },
      ],
      saves: [],
    },
    {
      id: 'chicken-soup',
      title: 'Flu-Season Chicken Soup',
      cuisine: 'Home cooking',
      authorId: 'cousin-james',
      groupId: 'comfort-foods',
      cover: chickenSoup,
      servings: 6,
      minutes: 90,
      story:
        'Auntie Kate brought this to my flat when I had the flu in first year. I asked for the recipe the second I could taste again.',
      ingredients: [
        {
          items: [
            { qty: 1, name: 'whole chicken (about 1.5 kg)' },
            { qty: 3, name: 'carrots, sliced' },
            { qty: 3, unit: 'stalks', name: 'celery, sliced' },
            { qty: 1, name: 'onion, halved' },
            { qty: 2, name: 'bay leaves' },
            { qty: 200, unit: 'g', name: 'egg noodles' },
            { qty: 1, unit: 'bunch', name: 'dill, chopped' },
          ],
        },
      ],
      steps: [
        'Cover the chicken, onion and bay leaves with cold water. Bring to a simmer and cook for 60 minutes.',
        'Lift out the chicken, shred the meat and discard the skin and bones.',
        'Add the carrots and celery to the broth and simmer for 15 minutes.',
        'Add the noodles and chicken and cook for 6 minutes more. Finish with dill, salt and pepper.',
      ],
      allergens: ['gluten', 'egg', 'celery'],
      createdAt: ago(3 * DAY),
      loves: [{ personId: 'auntie-kate', at: ago(3 * DAY) }],
      saves: [],
    },
    {
      id: 'cardamom-buns',
      title: 'Cardamom Knots',
      cuisine: 'Swedish',
      authorId: 'me',
      groupId: 'birthday',
      cover: cardamomBuns,
      parentId: 'cinnamon-rolls',
      twistNote:
        'Swapped the cinnamon for freshly ground cardamom, tied them into knots and topped with pearl sugar.',
      servings: 12,
      minutes: 150,
      story:
        'After a trip to Stockholm I couldn’t stop thinking about kardemummabullar. Sistur says these are allowed on birthdays now.',
      ingredients: [
        {
          title: 'Dough',
          items: [
            { qty: 500, unit: 'g', name: 'plain flour' },
            { qty: 250, unit: 'ml', name: 'warm milk' },
            { qty: 7, unit: 'g', name: 'dried yeast' },
            { qty: 75, unit: 'g', name: 'butter, melted' },
            { qty: 60, unit: 'g', name: 'sugar' },
            { qty: 1, unit: 'tsp', name: 'ground cardamom' },
          ],
        },
        {
          title: 'Filling',
          items: [
            { qty: 100, unit: 'g', name: 'soft butter' },
            { qty: 80, unit: 'g', name: 'sugar' },
            { qty: 1, unit: 'tbsp', name: 'freshly ground cardamom' },
            { qty: 2, unit: 'tbsp', name: 'pearl sugar' },
          ],
        },
      ],
      steps: [
        'Make the dough as for the cinnamon rolls, adding the cardamom with the flour. Leave to rise for 60 minutes.',
        'Roll out, spread with the filling, fold in thirds and cut into 12 strips.',
        'Twist each strip and tie it into a knot. Rise for 30 minutes.',
        'Brush with egg, sprinkle with pearl sugar and bake at 200°C for 12 minutes.',
      ],
      allergens: ['gluten', 'milk', 'egg'],
      createdAt: ago(2 * HOUR),
      loves: [
        { personId: 'sistur', at: ago(90 * MIN) },
        { personId: 'mom', at: ago(45 * MIN) },
      ],
      saves: [{ personId: 'sistur', at: ago(80 * MIN) }],
    },
  ]

  const comments: Comment[] = [
    {
      id: 'c5',
      recipeId: 'sop-buntut',
      authorId: 'mom',
      text: 'I cried reading this, Mama. It tastes exactly like Oma’s.',
      createdAt: ago(17 * DAY),
    },
    {
      id: 'c6',
      recipeId: 'sop-buntut',
      authorId: 'cousin-james',
      text: 'Made it in my tiny student kitchen. Took all day. Worth it.',
      createdAt: ago(9 * DAY),
    },
    {
      id: 'c7',
      recipeId: 'rendang',
      authorId: 'grandma',
      text: 'Good. But stir more.',
      createdAt: ago(13 * DAY),
    },
    {
      id: 'c8',
      recipeId: 'pumpkin-pie',
      authorId: 'uncle-robert',
      text: 'Reserving two slices now.',
      createdAt: ago(38 * DAY),
    },
    {
      id: 'c9',
      recipeId: 'cardamom-buns',
      authorId: 'sistur',
      text: 'Okay these might be better than mine. Might.',
      createdAt: ago(70 * MIN),
    },
    {
      id: 'c10',
      recipeId: 'bolognese',
      authorId: 'mom',
      text: 'More garlic.',
      createdAt: ago(5 * DAY),
    },
    {
      id: 'c11',
      recipeId: 'mulled-wine',
      authorId: 'auntie-kate',
      text: 'The only reason I survive Christmas Eve.',
      createdAt: ago(60 * DAY),
    },
  ]

  return { recipes, comments }
}
