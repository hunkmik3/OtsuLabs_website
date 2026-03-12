import styles from "./contact.module.css";
import FooterSection from "@/components/FooterSection";

const faqItems = [
  {
    question: "Q: What services does Otsu Labs specialize in?",
    answer:
      "A: Otsu Labs is a 2D animation studio with a primary focus on anime style. We offer a full range of end-to-end services, including commercial animation content, TikTok/YouTube shorts, episodic content, and short films, plus concept creation and full-service production to post-production.",
    defaultOpen: true,
  },
  {
    question: "Q: What is the typical timeline for an animation project?",
    answer:
      "A: Depending on scope and complexity, timelines usually range from 4 to 12 weeks. We define milestones clearly at kickoff and keep a transparent weekly production cadence.",
  },
  {
    question: "Q: How much do you charge?",
    answer:
      "A: Pricing is based on scope, runtime, visual complexity, and delivery schedule. Share your brief and target deadline, and we will provide a clear quote with production options.",
  },
  {
    question: "Q: Why Otsu Labs?",
    answer:
      "A: We blend strong anime craft with production reliability. From concept to final delivery, our pipeline is built to keep quality high while staying on schedule.",
  },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.contactShell}>
          <div className={styles.contactGrid}>
            <div className={styles.visualCol} aria-hidden="true">
              <img
                src="/images/home/banner_production.png"
                alt=""
                className={styles.characterVisual}
              />
            </div>

            <div className={styles.formCol}>
              <h1 className={styles.title}>Let&apos;s get in touch</h1>
              <p className={styles.description}>
                A quick hello 👋 is all it takes to start something great.
                Share about your project or idea below. We&apos;ll get back to
                you with next steps.
              </p>

              <span className={styles.badge}>Contact Form</span>

              <form className={styles.form}>
                <div className={styles.rowTwo}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="First Name"
                    aria-label="First Name"
                  />
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Last Name"
                    aria-label="Last Name"
                  />
                </div>

                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Phone Number"
                  aria-label="Phone Number"
                />

                <input
                  type="email"
                  className={styles.input}
                  placeholder="Your Email"
                  aria-label="Your Email"
                />

                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="How can we help?"
                  aria-label="How can we help?"
                />

                <label className={`${styles.input} ${styles.uploadRow}`}>
                  <input
                    type="file"
                    className={styles.fileInput}
                    aria-label="Upload File"
                  />
                  <span className={styles.uploadIcon} aria-hidden="true">
                    📎
                  </span>
                  <span>Upload File</span>
                </label>

                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.faqLayout}>
            <span className={styles.faqBadge}>FAQ</span>

            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className={styles.faqItem}
                  open={item.defaultOpen}
                >
                  <summary className={styles.faqQuestion}>{item.question}</summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </main>
    </div>
  );
}

