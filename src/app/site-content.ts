type LinkActiveOptions = {
  exact: boolean;
};

export interface NavItem {
  label: string;
  route: string;
  exact?: LinkActiveOptions;
}

export interface BannerSlide {
  imageUrl: string;
  animationDelay: string;
  animationDuration: string;
  position: string;
}

export interface SampleRender {
  src: string;
  alt: string;
}

export interface RoadmapItem {
  timeline: string;
  version: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: '/home', exact: { exact: true } },
  { label: 'Download', route: '/download' },
  { label: 'How it works', route: '/wiki' },
  { label: 'Roadmap', route: '/new' },
  { label: 'GitHub', route: '/github' }
];

export const BANNER_TAGS = ['Datapack support', 'Alpha to 26.2', '15 styles', 'Block filters'];

export const BANNER_IMAGE_PATHS = Array.from(
  { length: 15 },
  (_, index) => `asset/banner_slideshow/${index}.png`
);

export const BANNER_SLIDE_POSITIONS = ['50% 52%', '50% 48%', '50% 48%', '50% 50%'];

export const BANNER_SLIDE_SECONDS = 4.5;

export const HOME_SAMPLES: SampleRender[] = Array.from({ length: 9 }, (_, index) => ({
  src: `asset/home_slideshow/${index}.png`,
  alt: 'Mapee sample render'
}));

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    timeline: 'Coming October 2025',
    version: 'Version 2.0.0',
    description:
      'Major update bringing cross-platform builds, extended world compatibility, a CLI, and significant visual improvements.'
  },
  {
    timeline: 'Current',
    version: 'Version 1.2.0',
    description:
      'Windows installer for rendering local Minecraft Java worlds from Alpha to 26.2 without modifying world files.'
  }
];

export function buildImageSequence(images: readonly string[], imageCount: number): string[] {
  const imageSequence: string[] = [];

  while (imageSequence.length < imageCount && images.length > 0) {
    const nextImages = shuffleImages(images);
    const previousImage = imageSequence.at(-1);

    if (previousImage && nextImages.length > 1 && nextImages[0] === previousImage) {
      const swapIndex = nextImages.findIndex((image) => image !== previousImage);
      [nextImages[0], nextImages[swapIndex]] = [nextImages[swapIndex], nextImages[0]];
    }

    imageSequence.push(...nextImages.slice(0, imageCount - imageSequence.length));
  }

  return imageSequence;
}

function shuffleImages(images: readonly string[]): string[] {
  const shuffledImages = [...images];

  for (let index = shuffledImages.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledImages[index], shuffledImages[swapIndex]] = [shuffledImages[swapIndex], shuffledImages[index]];
  }

  return shuffledImages;
}
