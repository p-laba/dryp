// Color Season Analysis System
// Based on professional color theory: undertones, contrast, and seasonal palettes

export type ColorSeason = 'spring' | 'summer' | 'autumn' | 'winter';
export type ColorSubtype =
  | 'light-spring' | 'warm-spring' | 'clear-spring'
  | 'light-summer' | 'cool-summer' | 'soft-summer'
  | 'soft-autumn' | 'warm-autumn' | 'deep-autumn'
  | 'deep-winter' | 'cool-winter' | 'clear-winter';

export interface ColorProfile {
  season: ColorSeason;
  subtype: ColorSubtype;
  undertone: 'warm' | 'cool' | 'neutral';
  contrast: 'high' | 'medium' | 'low';
  best_colors: string[];
  accent_colors: string[];
  avoid_colors: string[];
  metals: ('gold' | 'silver' | 'rose-gold' | 'copper')[];
  neutrals: string[];
  description: string;
}

// Comprehensive color palettes for each season
export const COLOR_PALETTES: Record<ColorSubtype, ColorProfile> = {
  // SPRING - Warm undertones, clear and bright
  'light-spring': {
    season: 'spring',
    subtype: 'light-spring',
    undertone: 'warm',
    contrast: 'low',
    best_colors: ['peach', 'coral', 'warm pink', 'light turquoise', 'mint', 'camel', 'cream'],
    accent_colors: ['poppy red', 'aqua', 'bright coral'],
    avoid_colors: ['black', 'dark brown', 'burgundy', 'charcoal'],
    metals: ['gold', 'rose-gold'],
    neutrals: ['ivory', 'warm beige', 'light camel', 'soft white'],
    description: 'Fresh, delicate, and youthful. Think spring garden colors.',
  },
  'warm-spring': {
    season: 'spring',
    subtype: 'warm-spring',
    undertone: 'warm',
    contrast: 'medium',
    best_colors: ['tangerine', 'warm coral', 'golden yellow', 'leaf green', 'warm turquoise'],
    accent_colors: ['tomato red', 'orange', 'bright teal'],
    avoid_colors: ['cool pink', 'burgundy', 'black', 'silver-gray'],
    metals: ['gold', 'copper'],
    neutrals: ['camel', 'warm brown', 'buff', 'golden beige'],
    description: 'Energetic and sunny. Golden undertones throughout.',
  },
  'clear-spring': {
    season: 'spring',
    subtype: 'clear-spring',
    undertone: 'warm',
    contrast: 'high',
    best_colors: ['bright coral', 'warm red', 'emerald', 'turquoise', 'cobalt blue', 'hot pink'],
    accent_colors: ['electric blue', 'lime green', 'bright orange'],
    avoid_colors: ['muted colors', 'dusty tones', 'olive', 'mauve'],
    metals: ['gold', 'rose-gold'],
    neutrals: ['navy', 'warm black', 'bright white', 'camel'],
    description: 'Bold and vivid. High contrast between hair and skin.',
  },

  // SUMMER - Cool undertones, soft and muted
  'light-summer': {
    season: 'summer',
    subtype: 'light-summer',
    undertone: 'cool',
    contrast: 'low',
    best_colors: ['powder blue', 'soft pink', 'lavender', 'soft aqua', 'rose', 'periwinkle'],
    accent_colors: ['soft raspberry', 'light plum', 'dusty blue'],
    avoid_colors: ['orange', 'rust', 'mustard', 'warm brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['soft white', 'dove gray', 'taupe', 'soft navy'],
    description: 'Ethereal and romantic. Soft, dusty pastels.',
  },
  'cool-summer': {
    season: 'summer',
    subtype: 'cool-summer',
    undertone: 'cool',
    contrast: 'medium',
    best_colors: ['raspberry', 'dusty rose', 'slate blue', 'soft teal', 'lavender', 'burgundy'],
    accent_colors: ['watermelon', 'plum', 'deep periwinkle'],
    avoid_colors: ['orange', 'rust', 'warm yellow', 'golden brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['charcoal', 'gray', 'navy', 'soft black'],
    description: 'Elegant and sophisticated. Cool, muted palette.',
  },
  'soft-summer': {
    season: 'summer',
    subtype: 'soft-summer',
    undertone: 'neutral',
    contrast: 'low',
    best_colors: ['dusty blue', 'mauve', 'sage', 'soft teal', 'cocoa', 'stone'],
    accent_colors: ['muted plum', 'dusty pink', 'soft burgundy'],
    avoid_colors: ['bright colors', 'neon', 'pure white', 'jet black'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['greige', 'mushroom', 'soft charcoal', 'stone'],
    description: 'Understated elegance. Soft, muted, and harmonious.',
  },

  // AUTUMN - Warm undertones, muted and rich
  'soft-autumn': {
    season: 'autumn',
    subtype: 'soft-autumn',
    undertone: 'warm',
    contrast: 'low',
    best_colors: ['soft teal', 'sage', 'dusty coral', 'warm gray', 'muted gold', 'soft olive'],
    accent_colors: ['terracotta', 'burnt sienna', 'soft rust'],
    avoid_colors: ['bright colors', 'cool pink', 'icy colors', 'black'],
    metals: ['gold', 'copper', 'rose-gold'],
    neutrals: ['oyster', 'stone', 'warm gray', 'soft brown'],
    description: 'Earthy and subtle. Soft, muted warmth.',
  },
  'warm-autumn': {
    season: 'autumn',
    subtype: 'warm-autumn',
    undertone: 'warm',
    contrast: 'medium',
    best_colors: ['terracotta', 'rust', 'olive', 'mustard', 'burnt orange', 'teal'],
    accent_colors: ['tomato red', 'saffron', 'deep teal'],
    avoid_colors: ['cool pink', 'icy blue', 'silver-gray', 'black'],
    metals: ['gold', 'copper'],
    neutrals: ['camel', 'chocolate brown', 'cream', 'khaki'],
    description: 'Rich harvest colors. Golden, earthy warmth.',
  },
  'deep-autumn': {
    season: 'autumn',
    subtype: 'deep-autumn',
    undertone: 'warm',
    contrast: 'high',
    best_colors: ['olive', 'forest green', 'burnt orange', 'tomato red', 'teal', 'rust'],
    accent_colors: ['emerald', 'pumpkin', 'deep coral'],
    avoid_colors: ['pastels', 'cool pink', 'icy colors', 'lavender'],
    metals: ['gold', 'copper'],
    neutrals: ['dark brown', 'charcoal brown', 'cream', 'khaki'],
    description: 'Rich and intense. Deep, saturated earth tones.',
  },

  // WINTER - Cool undertones, high contrast
  'deep-winter': {
    season: 'winter',
    subtype: 'deep-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['black', 'pure white', 'burgundy', 'emerald', 'sapphire blue', 'deep purple'],
    accent_colors: ['ruby red', 'royal blue', 'bright magenta'],
    avoid_colors: ['muted colors', 'earth tones', 'orange', 'golden brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['black', 'pure white', 'charcoal', 'navy'],
    description: 'Dramatic and bold. Rich, deep, and high contrast.',
  },
  'cool-winter': {
    season: 'winter',
    subtype: 'cool-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['true red', 'fuchsia', 'royal blue', 'emerald', 'icy pink', 'purple'],
    accent_colors: ['hot pink', 'electric blue', 'bright purple'],
    avoid_colors: ['orange', 'warm brown', 'mustard', 'peach'],
    metals: ['silver'],
    neutrals: ['black', 'white', 'gray', 'navy'],
    description: 'Cool and sophisticated. Pure, saturated colors.',
  },
  'clear-winter': {
    season: 'winter',
    subtype: 'clear-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['true red', 'emerald', 'cobalt blue', 'hot pink', 'icy violet', 'black'],
    accent_colors: ['fuchsia', 'bright turquoise', 'shocking pink'],
    avoid_colors: ['muted colors', 'dusty tones', 'warm browns', 'orange'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['jet black', 'pure white', 'light gray', 'navy'],
    description: 'Vivid and striking. Clear, bright, high-contrast.',
  },
};

// Analyze color season based on characteristics
export function analyzeColorSeason(characteristics: {
  hair_color?: string;
  eye_color?: string;
  skin_tone?: string;
  undertone_guess?: 'warm' | 'cool' | 'neutral';
}): ColorProfile {
  const { hair_color, eye_color, skin_tone, undertone_guess } = characteristics;

  // Default to neutral warm if no info
  let undertone: 'warm' | 'cool' | 'neutral' = undertone_guess || 'neutral';
  let contrast: 'high' | 'medium' | 'low' = 'medium';

  // Hair color analysis
  const hair = (hair_color || '').toLowerCase();
  const isDarkHair = hair.includes('black') || hair.includes('dark') || hair.includes('brown');
  const isLightHair = hair.includes('blonde') || hair.includes('light') || hair.includes('gray') || hair.includes('white');
  const isRedHair = hair.includes('red') || hair.includes('auburn') || hair.includes('ginger');
  const isWarmHair = hair.includes('golden') || hair.includes('copper') || hair.includes('chestnut') || isRedHair;
  const isCoolHair = hair.includes('ash') || hair.includes('platinum') || hair.includes('silver');

  // Eye color analysis
  const eyes = (eye_color || '').toLowerCase();
  const isWarmEyes = eyes.includes('brown') || eyes.includes('hazel') || eyes.includes('amber') || eyes.includes('gold');
  const isCoolEyes = eyes.includes('blue') || eyes.includes('gray') || eyes.includes('green');

  // Skin tone analysis
  const skin = (skin_tone || '').toLowerCase();
  const isWarmSkin = skin.includes('golden') || skin.includes('olive') || skin.includes('warm') || skin.includes('yellow');
  const isCoolSkin = skin.includes('pink') || skin.includes('cool') || skin.includes('rosy') || skin.includes('blue');

  // Determine undertone based on characteristics
  const warmIndicators = [isWarmHair, isWarmEyes, isWarmSkin, isRedHair].filter(Boolean).length;
  const coolIndicators = [isCoolHair, isCoolEyes, isCoolSkin].filter(Boolean).length;

  if (warmIndicators > coolIndicators) {
    undertone = 'warm';
  } else if (coolIndicators > warmIndicators) {
    undertone = 'cool';
  } else {
    undertone = 'neutral';
  }

  // Determine contrast (hair vs skin)
  if (isDarkHair && (skin.includes('fair') || skin.includes('light') || skin.includes('pale'))) {
    contrast = 'high';
  } else if (isLightHair && skin.includes('dark')) {
    contrast = 'high';
  } else if (isDarkHair && skin.includes('dark')) {
    contrast = 'low';
  } else if (isLightHair && (skin.includes('fair') || skin.includes('light'))) {
    contrast = 'low';
  }

  // Determine season and subtype
  let subtype: ColorSubtype;

  if (undertone === 'warm') {
    if (contrast === 'high') {
      subtype = isDarkHair ? 'deep-autumn' : 'clear-spring';
    } else if (contrast === 'low') {
      subtype = isLightHair ? 'light-spring' : 'soft-autumn';
    } else {
      subtype = isRedHair ? 'warm-autumn' : 'warm-spring';
    }
  } else if (undertone === 'cool') {
    if (contrast === 'high') {
      subtype = isDarkHair ? 'deep-winter' : 'clear-winter';
    } else if (contrast === 'low') {
      subtype = isLightHair ? 'light-summer' : 'soft-summer';
    } else {
      subtype = 'cool-summer';
    }
  } else {
    // Neutral - look at other factors
    if (contrast === 'high') {
      subtype = 'cool-winter';
    } else if (contrast === 'low') {
      subtype = 'soft-summer';
    } else {
      subtype = 'soft-autumn';
    }
  }

  return COLOR_PALETTES[subtype];
}

// Get complementary outfit colors
export function getOutfitColorSuggestions(profile: ColorProfile): {
  monochromatic: string[];
  complementary: string[];
  statement_piece: string;
  everyday_palette: string[];
} {
  const { best_colors, accent_colors, neutrals } = profile;

  return {
    monochromatic: [neutrals[0], neutrals[1], best_colors[0]],
    complementary: [best_colors[0], best_colors[2], accent_colors[0]],
    statement_piece: accent_colors[0],
    everyday_palette: [...neutrals.slice(0, 2), ...best_colors.slice(0, 2)],
  };
}
