export interface ExplorationSlide {
    image: string;
    title: string;
    description: string;
}

export interface ProjectData {
    id: number;
    slug: string;
    client: string;
    projectTitle: string;
    scope: string;
    image: string;
    date: string;
    heroVideo: string;
    animationDuration: string;
    aboutDescription: string;
    scopeOfWork: string[];
    scopeImages: { top: [string, string]; bottom: string };
    preProductionDescription: string;
    characterSheetText: string;
    characterSheetImages: { src: string; label?: string }[];
    explorationSlides: ExplorationSlide[];
}

export const projects: ProjectData[] = [
    {
        id: 1,
        slug: 'pixelmon',
        client: 'Pixelmon',
        projectTitle: 'Nova Thera: Initiation',
        scope: 'Animation & Key Visual',
        image: '/images/home/selected_works_1.png',
        date: '[OCTOBER, 2025]',
        heroVideo: '/images/home/showreels.mp4',
        animationDuration: '00:00:36',
        aboutDescription:
            'Pixelmon\u2122 Official Anime Teaser. Crafted with passion by our studio, this teaser marks the beginning of a journey, a glimpse into the heart of Pixelmon as you\u2019ve never seen before.',
        scopeOfWork: [
            'Creative Direction',
            'Script Writing',
            'Animation Production',
            'Storyboard',
            'Narrative Design',
            'Cinematic Planning',
            'Stillomatic',
            'Compositing & Finishing',
        ],
        scopeImages: {
            top: ['/images/home/selected_works_1.png', '/images/home/hero_banner.png'],
            bottom: '/images/home/feature_image.png',
        },
        preProductionDescription: 'A short description of development process goes like this.',
        characterSheetText:
            '[Place holder]\nWe build worlds,\ncreate memorable\ncharacters and craft\nanimations that\nawaken people\'s\ninner weeb.',
        characterSheetImages: [
            { src: '/images/projects/images/nova model 1.png', label: '[NAME OF CHARACTER]' },
            { src: '/images/projects/images/nova model 4.png', label: '[NAME OF CHARACTER]' },
            { src: '/images/projects/images/nova model2 .png', label: '[NAME OF CHARACTER]' },
            { src: '/images/projects/images/novamodal3.png', label: '[NAME OF CHARACTER]' },
        ],
        explorationSlides: [
            { image: '/images/projects/images/dragon1 .png', title: '[The Dragon Name]', description: 'A short process description goes here' },
            { image: '/images/projects/images/dragon 2.png', title: '[The Phoenix]', description: 'Creature exploration and iteration' },
            { image: '/images/projects/images/dragon3.png', title: '[The Serpent]', description: 'Final concept art for production' },
            { image: '/images/projects/images/dragon 4 .png', title: '[The Guardian]', description: 'Boss character design exploration' },
        ],
    },
    {
        id: 2,
        slug: 'nova-thera',
        client: 'Nova Thera',
        projectTitle: 'Nova Thera: Genesis',
        scope: 'Concept Art & Motion',
        image: '/images/home/hero_banner.png',
        date: '[NOVEMBER, 2025]',
        heroVideo: '/images/home/showreels.mp4',
        animationDuration: '00:01:12',
        aboutDescription:
            'A cinematic exploration of light and shadow, blending traditional anime aesthetics with cutting-edge digital techniques for a new generation.',
        scopeOfWork: [
            'Creative Direction',
            'Concept Art',
            'Motion Design',
            'Storyboard',
            'Compositing & Finishing',
        ],
        scopeImages: {
            top: ['/images/home/hero_banner.png', '/images/home/feature_image.png'],
            bottom: '/images/home/banner_production.png',
        },
        preProductionDescription: 'Exploring the boundaries of light and shadow in anime production.',
        characterSheetText:
            '[Place holder]\nWe build worlds,\ncreate memorable\ncharacters and craft\nanimations that\nawaken people\'s\ninner weeb.',
        characterSheetImages: [
            { src: '/images/home/hero_banner.png', label: 'Character A' },
            { src: '/images/home/selected_works_1.png', label: 'Character B' },
            { src: '/images/home/feature_image.png', label: 'Character C' },
        ],
        explorationSlides: [
            { image: '/images/home/hero_banner.png', title: '[Light Study]', description: 'Atmospheric exploration' },
            { image: '/images/home/feature_image.png', title: '[Shadow Play]', description: 'Contrast development' },
            { image: '/images/home/banner_production.png', title: '[Final Scene]', description: 'Scene assembly and composition' },
        ],
    },
    {
        id: 3,
        slug: 'ronin-labs',
        client: 'Ronin Labs',
        projectTitle: 'Ronin: Awakening',
        scope: 'Character Design & Storyboard',
        image: '/images/home/feature_image.png',
        date: '[DECEMBER, 2025]',
        heroVideo: '/images/home/showreels.mp4',
        animationDuration: '00:00:48',
        aboutDescription:
            'Bold character work and dynamic storyboards that push the boundaries of visual storytelling in the web3 space.',
        scopeOfWork: [
            'Character Design',
            'Storyboard',
            'Animation Production',
            'Narrative Design',
            'Compositing & Finishing',
        ],
        scopeImages: {
            top: ['/images/home/feature_image.png', '/images/home/selected_works_1.png'],
            bottom: '/images/home/hero_banner.png',
        },
        preProductionDescription: 'Character-driven storytelling from sketch to screen.',
        characterSheetText:
            '[Place holder]\nWe build worlds,\ncreate memorable\ncharacters and craft\nanimations that\nawaken people\'s\ninner weeb.',
        characterSheetImages: [
            { src: '/images/home/feature_image.png', label: 'Ronin A' },
            { src: '/images/home/selected_works_1.png', label: 'Ronin B' },
            { src: '/images/home/hero_banner.png', label: 'Ronin C' },
            { src: '/images/home/banner_production.png', label: 'Ronin D' },
        ],
        explorationSlides: [
            { image: '/images/home/feature_image.png', title: '[The Ronin]', description: 'Main character exploration' },
            { image: '/images/home/selected_works_1.png', title: '[The Blade]', description: 'Weapon and prop design' },
            { image: '/images/home/hero_banner.png', title: '[The Arena]', description: 'Environment concept art' },
        ],
    },
    {
        id: 4,
        slug: 'aether-studios',
        client: 'Aether Studios',
        projectTitle: 'Aether: Convergence',
        scope: 'Full Production Pipeline',
        image: '/images/home/banner_production.png',
        date: '[JANUARY, 2026]',
        heroVideo: '/images/home/showreels.mp4',
        animationDuration: '00:02:05',
        aboutDescription:
            'End-to-end animation production from concept to final cut, delivering a breathtaking visual experience for the community.',
        scopeOfWork: [
            'Creative Direction',
            'Script Writing',
            'Animation Production',
            'Storyboard',
            'Cinematic Planning',
            'Compositing & Finishing',
        ],
        scopeImages: {
            top: ['/images/home/banner_production.png', '/images/home/selected_works_1.png'],
            bottom: '/images/home/feature_image.png',
        },
        preProductionDescription: 'Full pipeline production from concept to delivery.',
        characterSheetText:
            '[Place holder]\nWe build worlds,\ncreate memorable\ncharacters and craft\nanimations that\nawaken people\'s\ninner weeb.',
        characterSheetImages: [
            { src: '/images/home/banner_production.png', label: 'Aether A' },
            { src: '/images/home/selected_works_1.png', label: 'Aether B' },
            { src: '/images/home/hero_banner.png', label: 'Aether C' },
        ],
        explorationSlides: [
            { image: '/images/home/banner_production.png', title: '[The Core]', description: 'Central concept development' },
            { image: '/images/home/selected_works_1.png', title: '[The Rift]', description: 'Dimensional exploration art' },
            { image: '/images/home/hero_banner.png', title: '[The Nexus]', description: 'Final convergence scene' },
            { image: '/images/home/feature_image.png', title: '[The Echo]', description: 'Aftermath sequence design' },
        ],
    },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
    return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
    return projects.map((p) => p.slug);
}
