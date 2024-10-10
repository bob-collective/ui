function getImageUrl(name: string) {
  return `/assets/partners/${name.split(' ').join('').toLowerCase()}.png`;
}

const fallbackImg = '/assets/spice-shape-background.jpg';

const getAppLogo = (
  name: string,
  logos: {
    default?: string;
  }
) => {
  // Prioritize using the default logo from partner data
  let logoSrc = logos?.default || getImageUrl(name);

  // If the image URL construction failed, use fallback image
  if (!logos?.default && logoSrc.endsWith('undefined')) {
    logoSrc = fallbackImg;
  }

  return logoSrc;
};

export { getAppLogo };
