import HeroSection from "@/components/work/project/HeroSection";
import AboutProjectSection from "@/components/work/project/AboutProjectSection";
import PreProductionSection from "@/components/work/project/PreProductionSection";
import ProductionSection from "@/components/work/project/ProductionSection";
import PostProductionSection from "@/components/work/project/PostProductionSection";
import PostProductionScenePairSection from "@/components/work/project/PostProductionScenePairSection";
import CreditsSection from "@/components/work/project/CreditsSection";
import MoreProjectsSection from "@/components/work/project/MoreProjectsSection";
import PostExplorationGallerySection from "@/components/work/project/PostExplorationGallerySection";
import RelatedServicesLinks from "@/components/work/project/RelatedServicesLinks";
import FooterSection from "@/components/FooterSection";
import type { ProjectDetailRenderModel } from "@/lib/cms/project-detail-mapper";
import styles from "@/components/work/project/project.module.css";

interface ProjectDetailRendererProps {
    model: ProjectDetailRenderModel;
}

export default function ProjectDetailRenderer({ model }: ProjectDetailRendererProps) {
    return (
        <div className={styles.projectPage}>
            <main className={styles.projectMain}>
                {model.sections.map((section) => {
                    switch (section.type) {
                        case "hero":
                            return <HeroSection key={section.id} {...section.props} />;
                        case "aboutProject":
                            return <AboutProjectSection key={section.id} {...section.props} />;
                        case "preProduction":
                            return <PreProductionSection key={section.id} {...section.props} />;
                        case "postExplorationGallery":
                            return <PostExplorationGallerySection key={section.id} {...section.props} />;
                        case "production":
                            return <ProductionSection key={section.id} {...section.props} />;
                        case "animationKey":
                            return <PostProductionSection key={section.id} {...section.props} />;
                        case "keyHighlightPair":
                            return <PostProductionScenePairSection key={section.id} {...section.props} />;
                        case "credits":
                            return <CreditsSection key={section.id} {...section.props} />;
                        case "moreProjects":
                            return <MoreProjectsSection key={section.id} {...section.props} />;
                        default:
                            return null;
                    }
                })}
                <RelatedServicesLinks services={model.relatedServices} />
                <FooterSection />
            </main>
        </div>
    );
}
