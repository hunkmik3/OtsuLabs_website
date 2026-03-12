import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllSlugs, projects } from '@/lib/projects';
import HeroSection from '@/components/work/project/HeroSection';
import AboutProjectSection from '@/components/work/project/AboutProjectSection';
import PreProductionSection from '@/components/work/project/PreProductionSection';
import ProductionSection from '@/components/work/project/ProductionSection';
import PostProductionSection from '@/components/work/project/PostProductionSection';
import PostProductionScenePairSection from '@/components/work/project/PostProductionScenePairSection';
import CreditsSection, { type CreditGroup } from '@/components/work/project/CreditsSection';
import MoreProjectsSection from '@/components/work/project/MoreProjectsSection';
import FooterSection from '@/components/FooterSection';
import projectStyles from '@/components/work/project/project.module.css';

export function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

const pixelmonCreditsLeft: CreditGroup[] = [
    { role: 'Producer', names: ['Khoa Trinh'] },
    { role: 'Director', names: ['Duc Nguyen'] },
    { role: 'Animation Director', names: ['Huu Tu'] },
    { role: 'Art Director', names: ['Long An'] },
    { role: 'Storyboard', names: ['Ngoc Huynh'] },
    { role: 'Head Manager', names: ['Raymond Trinh'] },
    { role: 'Production Assistant', names: ['Trung Nguyen', 'Khoa Trinh'] },
    { role: 'Concept Artists', names: ['Khang Nguyen', 'Long An'] },
    { role: 'Chief Animation Supervisors', names: ['Alejandro Jhon Belen'] },
    { role: 'Animation Supervisors', names: ['Alejandro Jhon Belen', 'Thuy Vy'] },
    { role: 'LO Animators', names: ['Huu Tu', 'Lucas', 'Aisha', 'Cesar D. deLeon JR', 'Anya'] },
];

const pixelmonCreditsRight: CreditGroup[] = [
    { role: 'Genga Animators', names: ['Cariza Gabito', 'Bonz Bolalin', 'Wencis Nico', 'Matiella Garia', 'Raissa Vinny'] },
    { role: 'Clean Ups Animators', names: ['Julius L. de Belen', 'RC', 'PewPew', 'Mark'] },
    { role: '2DFX Animator', names: ['Viet Nguyen'] },
    { role: 'Colorist', names: ['Long An', 'Khang Nguyen'] },
    { role: 'Background Artist', names: ['Giao Nguyen'] },
    { role: 'Lead Compositing', names: ['Daniel Laney'] },
    { role: 'Compositing Editors', names: ['Phuc Pham', 'Loc', 'Le Nguyen', 'Lam Nguyen'] },
    { role: 'Music Composer', names: ['Jakub Pietras'] },
    { role: 'SFX and Mastering', names: ['Jordan Wilberg'] },
    { role: 'Editor', names: ['Quang Nguyen'] },
];

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const isPixelmon = project.slug === 'pixelmon';
    const showcasePrimaryImage = isPixelmon
        ? '/images/projects/images_global/highligh1.png'
        : project.explorationSlides[0]?.image || project.characterSheetImages[0]?.src;
    const showcaseSecondaryImage = isPixelmon
        ? '/images/projects/images_global/highlight2.png'
        : project.explorationSlides[1]?.image || project.characterSheetImages[1]?.src;
    const showcaseCaption = project.characterSheetText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !/^\[?\s*place holder\s*\]?$/i.test(line))
        .join(' ')
        .replace(/\s+/g, ' ');
    const postProductionScenes = isPixelmon
        ? [
              { label: 'Scene 1', image: '/images/projects/Nova%20Thera/animationkey1.png', duration: '00:00:20' },
              { label: 'Scene 2', image: '/images/projects/Nova%20Thera/animationkey2.png', duration: '00:00:18' },
              { label: 'Scene 3', image: '/images/projects/Nova%20Thera/animationkey3.png', duration: '00:00:23' },
              { label: 'Scene 4', image: '/images/projects/Nova%20Thera/animationkey4.png', duration: '00:00:21' },
          ]
        : project.explorationSlides.slice(0, 4).map((slide, index) => ({
              label: `Scene ${index + 1}`,
              image: slide.image,
              duration: `00:00:${String(16 + index * 2).padStart(2, '0')}`,
          }));
    const postProductionPairLeftImage = isPixelmon
        ? '/images/projects/Nova%20Thera/keyhighlight1.png'
        : project.scopeImages.top[0] || project.explorationSlides[0]?.image || project.characterSheetImages[0]?.src;
    const postProductionPairRightImage = isPixelmon
        ? '/images/projects/Nova%20Thera/keyhighlight2.png'
        : project.scopeImages.top[1] || project.explorationSlides[1]?.image || project.characterSheetImages[1]?.src;
    const creditsLeft = isPixelmon ? pixelmonCreditsLeft : project.scopeOfWork.map((role) => ({ role, names: ['Otsu Team'] }));
    const creditsRight = isPixelmon ? pixelmonCreditsRight : [];
    const moreProjectCards = projects
        .filter((candidate) => candidate.slug !== project.slug)
        .slice(0, 2)
        .map((candidate) => ({
            slug: candidate.slug,
            title: candidate.projectTitle,
            subtitle: candidate.client === 'Pixelmon' ? 'Pixelmon™' : candidate.client,
            image: candidate.image || candidate.scopeImages.top[0] || candidate.explorationSlides[0]?.image || '/images/home/hero_banner.png',
            year: candidate.date.match(/\d{4}/)?.[0] || 'YEAR',
        }));

    return (
        <div className={projectStyles.projectPage}>
            <main className={projectStyles.projectMain}>
                <HeroSection
                    projectTitle={project.projectTitle}
                    date={project.date}
                    client={project.client}
                    heroVideo={project.heroVideo}
                    animationDuration={project.animationDuration}
                />
                <AboutProjectSection
                    aboutDescription={project.aboutDescription}
                    scopeOfWork={project.scopeOfWork}
                    scopeImages={project.scopeImages}
                />
                <PreProductionSection
                    preProductionDescription={project.preProductionDescription}
                    characterSheetText={project.characterSheetText}
                    characterSheetImages={project.characterSheetImages}
                    explorationSlides={project.explorationSlides}
                />
                {(showcasePrimaryImage || showcaseSecondaryImage) && (
                    <section className={projectStyles.postExplorationSection}>
                        <div className={`${projectStyles.postExplorationGallery} ${projectStyles.postExplorationGalleryNoTopMargin}`}>
                            {showcasePrimaryImage && (
                                <div className={projectStyles.postExplorationPrimary}>
                                    <img
                                        src={showcasePrimaryImage}
                                        alt="Primary concept artwork"
                                        className={projectStyles.postExplorationPrimaryImage}
                                    />
                                    {showcaseCaption && (
                                        <p className={projectStyles.postExplorationCaption}>{showcaseCaption}</p>
                                    )}
                                </div>
                            )}
                            {showcaseSecondaryImage && (
                                <div className={projectStyles.postExplorationSecondary}>
                                    <img
                                        src={showcaseSecondaryImage}
                                        alt="Secondary concept artwork"
                                        className={projectStyles.postExplorationSecondaryImage}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                )}
                <ProductionSection
                    description={'A short description of production/\nanimation goes like this.'}
                    videoSrc={project.heroVideo}
                    projectTitle={project.projectTitle}
                    duration={project.animationDuration}
                />
                <PostProductionSection
                    title="Animation key"
                    terms="Some technical terms | should go here"
                    scenes={postProductionScenes}
                />
                {postProductionPairLeftImage && postProductionPairRightImage && (
                    <PostProductionScenePairSection
                        leftImage={postProductionPairLeftImage}
                        rightImage={postProductionPairRightImage}
                        caption="SCENE'S NAME / DESCRIPTION"
                    />
                )}
                <CreditsSection
                    title={"Meet\nOtsu's Team"}
                    leftColumn={creditsLeft}
                    rightColumn={creditsRight}
                />
                <MoreProjectsSection cards={moreProjectCards} />
                <FooterSection />
            </main>
        </div>
    );
}
