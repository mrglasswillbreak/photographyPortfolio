import type { CSSProperties } from 'react';

export const FONT_WEIGHT_OPTIONS = ['light', 'normal', 'medium', 'semibold', 'bold'] as const;
export type FontWeightOption = typeof FONT_WEIGHT_OPTIONS[number];

export const LETTER_SPACING_OPTIONS = ['normal', 'tight', 'wide', 'wider'] as const;
export type LetterSpacingOption = typeof LETTER_SPACING_OPTIONS[number];

export interface TypographySettings {
  headingWeight: FontWeightOption;
  bodyWeight: FontWeightOption;
  buttonWeight: FontWeightOption;
  emphasisWeight: FontWeightOption;
  emphasisItalic: boolean;
  siteNameWeight: FontWeightOption;
  siteNameItalic: boolean;
  headingLetterSpacing: LetterSpacingOption;
  siteNameLetterSpacing: LetterSpacingOption;
}

export const TYPOGRAPHY_UPDATED_EVENT = 'typography-settings-updated';

export const TYPOGRAPHY_CONTENT_KEYS = {
  headingWeight: 'style_heading_weight',
  bodyWeight: 'style_body_weight',
  buttonWeight: 'style_button_weight',
  emphasisWeight: 'style_emphasis_weight',
  emphasisItalic: 'style_emphasis_italic',
  siteNameWeight: 'style_site_name_weight',
  siteNameItalic: 'style_site_name_italic',
  headingLetterSpacing: 'style_heading_letter_spacing',
  siteNameLetterSpacing: 'style_site_name_letter_spacing',
} as const;

const TYPOGRAPHY_CONTENT_KEY_SET = new Set<string>(Object.values(TYPOGRAPHY_CONTENT_KEYS));

export const TYPOGRAPHY_DEFAULTS: TypographySettings = {
  headingWeight: 'light',
  bodyWeight: 'normal',
  buttonWeight: 'medium',
  emphasisWeight: 'semibold',
  emphasisItalic: true,
  siteNameWeight: 'semibold',
  siteNameItalic: false,
  headingLetterSpacing: 'normal',
  siteNameLetterSpacing: 'wide',
};

const FONT_WEIGHT_TO_NUMBER: Record<FontWeightOption, number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const LETTER_SPACING_TO_VALUE: Record<LetterSpacingOption, string> = {
  normal: 'normal',
  tight: '-0.01em',
  wide: '0.08em',
  wider: '0.14em',
};

function isFontWeightOption(value: unknown): value is FontWeightOption {
  return typeof value === 'string' && (FONT_WEIGHT_OPTIONS as readonly string[]).includes(value);
}

function isLetterSpacingOption(value: unknown): value is LetterSpacingOption {
  return typeof value === 'string' && (LETTER_SPACING_OPTIONS as readonly string[]).includes(value);
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return fallback;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }
  return fallback;
}

export function parseTypographySettings(content: Record<string, unknown>): TypographySettings {
  const headingWeight = content[TYPOGRAPHY_CONTENT_KEYS.headingWeight];
  const bodyWeight = content[TYPOGRAPHY_CONTENT_KEYS.bodyWeight];
  const buttonWeight = content[TYPOGRAPHY_CONTENT_KEYS.buttonWeight];
  const emphasisWeight = content[TYPOGRAPHY_CONTENT_KEYS.emphasisWeight];
  const siteNameWeight = content[TYPOGRAPHY_CONTENT_KEYS.siteNameWeight];
  const headingLetterSpacing = content[TYPOGRAPHY_CONTENT_KEYS.headingLetterSpacing];
  const siteNameLetterSpacing = content[TYPOGRAPHY_CONTENT_KEYS.siteNameLetterSpacing];

  return {
    headingWeight: isFontWeightOption(headingWeight) ? headingWeight : TYPOGRAPHY_DEFAULTS.headingWeight,
    bodyWeight: isFontWeightOption(bodyWeight) ? bodyWeight : TYPOGRAPHY_DEFAULTS.bodyWeight,
    buttonWeight: isFontWeightOption(buttonWeight) ? buttonWeight : TYPOGRAPHY_DEFAULTS.buttonWeight,
    emphasisWeight: isFontWeightOption(emphasisWeight) ? emphasisWeight : TYPOGRAPHY_DEFAULTS.emphasisWeight,
    emphasisItalic: parseBoolean(content[TYPOGRAPHY_CONTENT_KEYS.emphasisItalic], TYPOGRAPHY_DEFAULTS.emphasisItalic),
    siteNameWeight: isFontWeightOption(siteNameWeight) ? siteNameWeight : TYPOGRAPHY_DEFAULTS.siteNameWeight,
    siteNameItalic: parseBoolean(content[TYPOGRAPHY_CONTENT_KEYS.siteNameItalic], TYPOGRAPHY_DEFAULTS.siteNameItalic),
    headingLetterSpacing: isLetterSpacingOption(headingLetterSpacing)
      ? headingLetterSpacing
      : TYPOGRAPHY_DEFAULTS.headingLetterSpacing,
    siteNameLetterSpacing: isLetterSpacingOption(siteNameLetterSpacing)
      ? siteNameLetterSpacing
      : TYPOGRAPHY_DEFAULTS.siteNameLetterSpacing,
  };
}

export type TypographyCssVariables = CSSProperties & Record<`--typography-${string}`, string>;

export function getTypographyCssVariables(settings: TypographySettings): TypographyCssVariables {
  return {
    '--typography-heading-weight': String(FONT_WEIGHT_TO_NUMBER[settings.headingWeight]),
    '--typography-body-weight': String(FONT_WEIGHT_TO_NUMBER[settings.bodyWeight]),
    '--typography-button-weight': String(FONT_WEIGHT_TO_NUMBER[settings.buttonWeight]),
    '--typography-emphasis-weight': String(FONT_WEIGHT_TO_NUMBER[settings.emphasisWeight]),
    '--typography-emphasis-style': settings.emphasisItalic ? 'italic' : 'normal',
    '--typography-site-name-weight': String(FONT_WEIGHT_TO_NUMBER[settings.siteNameWeight]),
    '--typography-site-name-style': settings.siteNameItalic ? 'italic' : 'normal',
    '--typography-heading-letter-spacing': LETTER_SPACING_TO_VALUE[settings.headingLetterSpacing],
    '--typography-site-name-letter-spacing': LETTER_SPACING_TO_VALUE[settings.siteNameLetterSpacing],
  };
}

export function toStyleContentMap(updates: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, value] of Object.entries(updates)) {
    const contentKey = key.startsWith('style_') ? key : `style_${key}`;
    if (TYPOGRAPHY_CONTENT_KEY_SET.has(contentKey)) {
      map[contentKey] = value;
    }
  }
  return map;
}

export function typographySettingsToContentMap(settings: TypographySettings): Record<string, string> {
  return {
    [TYPOGRAPHY_CONTENT_KEYS.headingWeight]: settings.headingWeight,
    [TYPOGRAPHY_CONTENT_KEYS.bodyWeight]: settings.bodyWeight,
    [TYPOGRAPHY_CONTENT_KEYS.buttonWeight]: settings.buttonWeight,
    [TYPOGRAPHY_CONTENT_KEYS.emphasisWeight]: settings.emphasisWeight,
    [TYPOGRAPHY_CONTENT_KEYS.emphasisItalic]: String(settings.emphasisItalic),
    [TYPOGRAPHY_CONTENT_KEYS.siteNameWeight]: settings.siteNameWeight,
    [TYPOGRAPHY_CONTENT_KEYS.siteNameItalic]: String(settings.siteNameItalic),
    [TYPOGRAPHY_CONTENT_KEYS.headingLetterSpacing]: settings.headingLetterSpacing,
    [TYPOGRAPHY_CONTENT_KEYS.siteNameLetterSpacing]: settings.siteNameLetterSpacing,
  };
}
