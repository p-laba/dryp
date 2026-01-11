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
  best_colors_hex: string[];  // Added hex codes
  accent_colors: string[];
  accent_colors_hex: string[];  // Added hex codes
  avoid_colors: string[];
  metals: ('gold' | 'silver' | 'rose-gold' | 'copper')[];
  neutrals: string[];
  neutrals_hex: string[];  // Added hex codes
  description: string;
}

// Comprehensive color palettes for each season with HEX codes
export const COLOR_PALETTES: Record<ColorSubtype, ColorProfile> = {
  // SPRING - Warm undertones, clear and bright
  'light-spring': {
    season: 'spring',
    subtype: 'light-spring',
    undertone: 'warm',
    contrast: 'low',
    best_colors: ['peach', 'coral', 'warm pink', 'light turquoise', 'mint', 'camel', 'cream'],
    best_colors_hex: ['#FFDAB9', '#FF7F50', '#FF6B6B', '#40E0D0', '#98FB98', '#C19A6B', '#FFFDD0'],
    accent_colors: ['poppy red', 'aqua', 'bright coral'],
    accent_colors_hex: ['#E35335', '#00FFFF', '#FF6F61'],
    avoid_colors: ['black', 'dark brown', 'burgundy', 'charcoal'],
    metals: ['gold', 'rose-gold'],
    neutrals: ['ivory', 'warm beige', 'light camel', 'soft white'],
    neutrals_hex: ['#FFFFF0', '#F5DEB3', '#D4B896', '#FAF9F6'],
    description: 'Fresh, delicate, and youthful. Think spring garden colors.',
  },
  'warm-spring': {
    season: 'spring',
    subtype: 'warm-spring',
    undertone: 'warm',
    contrast: 'medium',
    best_colors: ['tangerine', 'warm coral', 'golden yellow', 'leaf green', 'warm turquoise'],
    best_colors_hex: ['#FF9966', '#FF6B6B', '#FFD700', '#6B8E23', '#48D1CC'],
    accent_colors: ['tomato red', 'orange', 'bright teal'],
    accent_colors_hex: ['#FF6347', '#FFA500', '#00CED1'],
    avoid_colors: ['cool pink', 'burgundy', 'black', 'silver-gray'],
    metals: ['gold', 'copper'],
    neutrals: ['camel', 'warm brown', 'buff', 'golden beige'],
    neutrals_hex: ['#C19A6B', '#8B4513', '#F0DC82', '#E8D4B8'],
    description: 'Energetic and sunny. Golden undertones throughout.',
  },
  'clear-spring': {
    season: 'spring',
    subtype: 'clear-spring',
    undertone: 'warm',
    contrast: 'high',
    best_colors: ['bright coral', 'warm red', 'emerald', 'turquoise', 'cobalt blue', 'hot pink'],
    best_colors_hex: ['#FF6F61', '#E34234', '#50C878', '#40E0D0', '#0047AB', '#FF69B4'],
    accent_colors: ['electric blue', 'lime green', 'bright orange'],
    accent_colors_hex: ['#7DF9FF', '#32CD32', '#FF5F15'],
    avoid_colors: ['muted colors', 'dusty tones', 'olive', 'mauve'],
    metals: ['gold', 'rose-gold'],
    neutrals: ['navy', 'warm black', 'bright white', 'camel'],
    neutrals_hex: ['#000080', '#1C1C1C', '#FFFFFF', '#C19A6B'],
    description: 'Bold and vivid. High contrast between hair and skin.',
  },

  // SUMMER - Cool undertones, soft and muted
  'light-summer': {
    season: 'summer',
    subtype: 'light-summer',
    undertone: 'cool',
    contrast: 'low',
    best_colors: ['powder blue', 'soft pink', 'lavender', 'soft aqua', 'rose', 'periwinkle'],
    best_colors_hex: ['#B0E0E6', '#FFB6C1', '#E6E6FA', '#7FFFD4', '#FF007F', '#CCCCFF'],
    accent_colors: ['soft raspberry', 'light plum', 'dusty blue'],
    accent_colors_hex: ['#E25098', '#DDA0DD', '#6699CC'],
    avoid_colors: ['orange', 'rust', 'mustard', 'warm brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['soft white', 'dove gray', 'taupe', 'soft navy'],
    neutrals_hex: ['#FAF9F6', '#8C8C8C', '#483C32', '#3B5998'],
    description: 'Ethereal and romantic. Soft, dusty pastels.',
  },
  'cool-summer': {
    season: 'summer',
    subtype: 'cool-summer',
    undertone: 'cool',
    contrast: 'medium',
    best_colors: ['raspberry', 'dusty rose', 'slate blue', 'soft teal', 'lavender', 'burgundy'],
    best_colors_hex: ['#E30B5C', '#DCAE96', '#6A5ACD', '#367588', '#E6E6FA', '#800020'],
    accent_colors: ['watermelon', 'plum', 'deep periwinkle'],
    accent_colors_hex: ['#FD4659', '#8E4585', '#5555FF'],
    avoid_colors: ['orange', 'rust', 'warm yellow', 'golden brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['charcoal', 'gray', 'navy', 'soft black'],
    neutrals_hex: ['#36454F', '#808080', '#000080', '#1C1C1C'],
    description: 'Elegant and sophisticated. Cool, muted palette.',
  },
  'soft-summer': {
    season: 'summer',
    subtype: 'soft-summer',
    undertone: 'neutral',
    contrast: 'low',
    best_colors: ['dusty blue', 'mauve', 'sage', 'soft teal', 'cocoa', 'stone'],
    best_colors_hex: ['#6699CC', '#E0B0FF', '#9DC183', '#367588', '#D2691E', '#928E85'],
    accent_colors: ['muted plum', 'dusty pink', 'soft burgundy'],
    accent_colors_hex: ['#8E4585', '#DCAE96', '#722F37'],
    avoid_colors: ['bright colors', 'neon', 'pure white', 'jet black'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['greige', 'mushroom', 'soft charcoal', 'stone'],
    neutrals_hex: ['#C5B9A8', '#9E8B7D', '#49494A', '#928E85'],
    description: 'Understated elegance. Soft, muted, and harmonious.',
  },

  // AUTUMN - Warm undertones, muted and rich
  'soft-autumn': {
    season: 'autumn',
    subtype: 'soft-autumn',
    undertone: 'warm',
    contrast: 'low',
    best_colors: ['soft teal', 'sage', 'dusty coral', 'warm gray', 'muted gold', 'soft olive'],
    best_colors_hex: ['#367588', '#9DC183', '#E9967A', '#808069', '#D4AF37', '#6B8E23'],
    accent_colors: ['terracotta', 'burnt sienna', 'soft rust'],
    accent_colors_hex: ['#E2725B', '#E97451', '#B7410E'],
    avoid_colors: ['bright colors', 'cool pink', 'icy colors', 'black'],
    metals: ['gold', 'copper', 'rose-gold'],
    neutrals: ['oyster', 'stone', 'warm gray', 'soft brown'],
    neutrals_hex: ['#E4DCCF', '#928E85', '#808069', '#8B7355'],
    description: 'Earthy and subtle. Soft, muted warmth.',
  },
  'warm-autumn': {
    season: 'autumn',
    subtype: 'warm-autumn',
    undertone: 'warm',
    contrast: 'medium',
    best_colors: ['terracotta', 'rust', 'olive', 'mustard', 'burnt orange', 'teal'],
    best_colors_hex: ['#E2725B', '#B7410E', '#808000', '#FFDB58', '#CC5500', '#008080'],
    accent_colors: ['tomato red', 'saffron', 'deep teal'],
    accent_colors_hex: ['#FF6347', '#F4C430', '#005F5F'],
    avoid_colors: ['cool pink', 'icy blue', 'silver-gray', 'black'],
    metals: ['gold', 'copper'],
    neutrals: ['camel', 'chocolate brown', 'cream', 'khaki'],
    neutrals_hex: ['#C19A6B', '#7B3F00', '#FFFDD0', '#C3B091'],
    description: 'Rich harvest colors. Golden, earthy warmth.',
  },
  'deep-autumn': {
    season: 'autumn',
    subtype: 'deep-autumn',
    undertone: 'warm',
    contrast: 'high',
    best_colors: ['olive', 'forest green', 'burnt orange', 'tomato red', 'teal', 'rust'],
    best_colors_hex: ['#808000', '#228B22', '#CC5500', '#FF6347', '#008080', '#B7410E'],
    accent_colors: ['emerald', 'pumpkin', 'deep coral'],
    accent_colors_hex: ['#50C878', '#FF7518', '#FF6F61'],
    avoid_colors: ['pastels', 'cool pink', 'icy colors', 'lavender'],
    metals: ['gold', 'copper'],
    neutrals: ['dark brown', 'charcoal brown', 'cream', 'khaki'],
    neutrals_hex: ['#654321', '#49413F', '#FFFDD0', '#C3B091'],
    description: 'Rich and intense. Deep, saturated earth tones.',
  },

  // WINTER - Cool undertones, high contrast
  'deep-winter': {
    season: 'winter',
    subtype: 'deep-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['black', 'pure white', 'burgundy', 'emerald', 'sapphire blue', 'deep purple'],
    best_colors_hex: ['#000000', '#FFFFFF', '#800020', '#50C878', '#0F52BA', '#301934'],
    accent_colors: ['ruby red', 'royal blue', 'bright magenta'],
    accent_colors_hex: ['#E0115F', '#4169E1', '#FF0090'],
    avoid_colors: ['muted colors', 'earth tones', 'orange', 'golden brown'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['black', 'pure white', 'charcoal', 'navy'],
    neutrals_hex: ['#000000', '#FFFFFF', '#36454F', '#000080'],
    description: 'Dramatic and bold. Rich, deep, and high contrast.',
  },
  'cool-winter': {
    season: 'winter',
    subtype: 'cool-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['true red', 'fuchsia', 'royal blue', 'emerald', 'icy pink', 'purple'],
    best_colors_hex: ['#FF0000', '#FF00FF', '#4169E1', '#50C878', '#F8B9D4', '#800080'],
    accent_colors: ['hot pink', 'electric blue', 'bright purple'],
    accent_colors_hex: ['#FF69B4', '#7DF9FF', '#BF00FF'],
    avoid_colors: ['orange', 'warm brown', 'mustard', 'peach'],
    metals: ['silver'],
    neutrals: ['black', 'white', 'gray', 'navy'],
    neutrals_hex: ['#000000', '#FFFFFF', '#808080', '#000080'],
    description: 'Cool and sophisticated. Pure, saturated colors.',
  },
  'clear-winter': {
    season: 'winter',
    subtype: 'clear-winter',
    undertone: 'cool',
    contrast: 'high',
    best_colors: ['true red', 'emerald', 'cobalt blue', 'hot pink', 'icy violet', 'black'],
    best_colors_hex: ['#FF0000', '#50C878', '#0047AB', '#FF69B4', '#7B68EE', '#000000'],
    accent_colors: ['fuchsia', 'bright turquoise', 'shocking pink'],
    accent_colors_hex: ['#FF00FF', '#00FFD0', '#FC0FC0'],
    avoid_colors: ['muted colors', 'dusty tones', 'warm browns', 'orange'],
    metals: ['silver', 'rose-gold'],
    neutrals: ['jet black', 'pure white', 'light gray', 'navy'],
    neutrals_hex: ['#000000', '#FFFFFF', '#D3D3D3', '#000080'],
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
  const isDarkHair = hair.includes('black') || hair.includes('dark') || hair.includes('brown') || hair.includes('brunette');
  const isLightHair = hair.includes('blonde') || hair.includes('light') || hair.includes('gray') || hair.includes('white') || hair.includes('silver');
  const isRedHair = hair.includes('red') || hair.includes('auburn') || hair.includes('ginger') || hair.includes('strawberry');
  const isWarmHair = hair.includes('golden') || hair.includes('copper') || hair.includes('chestnut') || hair.includes('honey') || hair.includes('caramel') || isRedHair;
  const isCoolHair = hair.includes('ash') || hair.includes('platinum') || hair.includes('silver') || hair.includes('cool');

  // Eye color analysis
  const eyes = (eye_color || '').toLowerCase();
  const isWarmEyes = eyes.includes('brown') || eyes.includes('hazel') || eyes.includes('amber') || eyes.includes('gold') || eyes.includes('honey');
  const isCoolEyes = eyes.includes('blue') || eyes.includes('gray') || eyes.includes('green') || eyes.includes('steel');
  const isDeepEyes = eyes.includes('dark') || eyes.includes('deep') || eyes.includes('black');

  // Skin tone analysis
  const skin = (skin_tone || '').toLowerCase();
  const isWarmSkin = skin.includes('golden') || skin.includes('olive') || skin.includes('warm') || skin.includes('yellow') || skin.includes('honey') || skin.includes('bronze') || skin.includes('tan');
  const isCoolSkin = skin.includes('pink') || skin.includes('cool') || skin.includes('rosy') || skin.includes('blue') || skin.includes('porcelain');
  const isFairSkin = skin.includes('fair') || skin.includes('light') || skin.includes('pale') || skin.includes('ivory');
  const isDarkSkin = skin.includes('dark') || skin.includes('deep') || skin.includes('ebony') || skin.includes('rich');

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
  if ((isDarkHair || isDeepEyes) && isFairSkin) {
    contrast = 'high';
  } else if (isLightHair && isDarkSkin) {
    contrast = 'high';
  } else if (isDarkHair && isDarkSkin) {
    contrast = 'low';
  } else if (isLightHair && isFairSkin) {
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
      subtype = isDarkHair ? 'deep-winter' : 'cool-winter';
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
  const { best_colors_hex, accent_colors_hex, neutrals_hex } = profile;

  return {
    monochromatic: [neutrals_hex[0], neutrals_hex[1], best_colors_hex[0]],
    complementary: [best_colors_hex[0], best_colors_hex[2], accent_colors_hex[0]],
    statement_piece: accent_colors_hex[0],
    everyday_palette: [...neutrals_hex.slice(0, 2), ...best_colors_hex.slice(0, 2)],
  };
}

// Get hex color for a color name
export function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    // Neutrals
    'black': '#000000',
    'white': '#FFFFFF',
    'ivory': '#FFFFF0',
    'cream': '#FFFDD0',
    'beige': '#F5F5DC',
    'camel': '#C19A6B',
    'tan': '#D2B48C',
    'taupe': '#483C32',
    'gray': '#808080',
    'charcoal': '#36454F',
    'navy': '#000080',

    // Warm colors
    'peach': '#FFDAB9',
    'coral': '#FF7F50',
    'terracotta': '#E2725B',
    'rust': '#B7410E',
    'burnt orange': '#CC5500',
    'mustard': '#FFDB58',
    'gold': '#FFD700',
    'olive': '#808000',

    // Cool colors
    'powder blue': '#B0E0E6',
    'lavender': '#E6E6FA',
    'periwinkle': '#CCCCFF',
    'dusty rose': '#DCAE96',
    'mauve': '#E0B0FF',
    'burgundy': '#800020',
    'plum': '#8E4585',

    // Bright colors
    'emerald': '#50C878',
    'teal': '#008080',
    'sapphire': '#0F52BA',
    'ruby': '#E0115F',
    'fuchsia': '#FF00FF',
  };

  const lower = colorName.toLowerCase();
  for (const [key, hex] of Object.entries(colorMap)) {
    if (lower.includes(key) || key.includes(lower)) {
      return hex;
    }
  }
  return '#808080'; // Default gray
}
