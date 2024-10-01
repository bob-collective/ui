function getImageUrl(name: string) {
  return new URL(`../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url);
}

const fallbackImg = new URL(`../../assets/spice-shape-background.jpg`, import.meta.url);

const getAppLogo = (
  name: string,
  logos: {
    default?: string;
  }
) => {
  // Prioritize using the default logo from partner data
  let logoSrc = logos?.default || getImageUrl(name).href;

  // If the image URL construction failed, use fallback image
  if (!logos?.default && logoSrc.endsWith('undefined')) {
    logoSrc = fallbackImg.href;
  }

  return logoSrc;
};

export { getAppLogo };
