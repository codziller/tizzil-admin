// Kindly read more https://zellwk.com/blog/media-query-units/

const mediaQueries = {
  small: "@media (min-width: 300px) and (max-width: 350px)",
  // medium: '@media (min-width: 375px) and (max-width: 499px)',
  medium: "@media(max-width:540px)",
  tablet: "@media (min-width: 500px) and (max-width: 768px)",
  semiLarge: "@media (min-width: 768px) and (max-width: 1024px)",
  landscapeScreen:
    "@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)",
  large: "@media (min-width: 1025px)",
};

export { mediaQueries };
