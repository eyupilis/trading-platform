export const COLORS = {
  primary: '#2c3e50',
  secondary: '#34495e',
  accent: '#3498db',
  success: '#2ecc71',
  error: '#e74c3c',
  warning: '#f1c40f',
  white: '#ffffff',
  black: '#000000',
  gray: '#7f8c8d',
  lightGray: '#f5f6fa',
  border: '#dcdde1',
};

export const SIZES = {
  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  padding: 20,
  margin: 20,
  radius: 10,
};

export const FONTS = {
  largeTitle: { fontSize: SIZES.largeTitle },
  h1: { fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontSize: SIZES.h5, lineHeight: 22 },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 22 },
  body5: { fontSize: SIZES.body5, lineHeight: 22 },
};

export default { COLORS, SIZES, FONTS };
