import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness, Check,
  Cloud, Code2, Github, Linkedin, Mail, Menu, Network, ShieldCheck,
  Terminal, Workflow, X, Zap
} from "lucide-react";
import TerraformSimulator from "./components/TerraformSimulator.jsx";
import { expertise, experience, projects } from "./data.js";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

function SectionTitle({ eyebrow, title, accent, description }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title} <span className="gradient-text">{accent}</span></h2>{description && <p className="section-intro">{description}</p>}</div></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = ["About", "Expertise", "Experience", "Projects", "Simulator", "Contact"];
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="#home" className="brand" onClick={closeMenu}><span className="brand-mark">DS</span><span>DAMANPREET<span className="brand-dot">.</span></span></a>
        <button className="mobile-menu" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Let's connect <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-grid">
            <motion.div className="hero-copy" initial="hidden" animate="visible" variants={fadeUp}>
              <div className="availability"><span className="availability-dot" /> OPEN TO CLOUD & ARCHITECTURE OPPORTUNITIES</div>
              <p className="hero-kicker">HELLO, I'M</p>
              <h1>Damanpreet<br /><span className="gradient-text">Singh Chadha.</span></h1>
              <h2>Cloud Solutions Architect <span className="hero-separator">/</span> AWS Engineer</h2>
              <p className="hero-description">I design, secure and modernize enterprise infrastructure across AWS, hybrid cloud, networking and automation. I bring an engineering-first approach to building platforms that teams can operate with confidence.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">Explore my work <ArrowRight size={16} /></a>
                <a className="button button-outline" href="#contact">Get in touch <Mail size={16} /></a>
              </div>
              <div className="hero-proof">
                <div><strong>18+</strong><span>Years in IT</span></div>
                <i />
                <div><strong>4+</strong><span>Years AWS in Canada</span></div>
                <i />
                <div><strong>30+</strong><span>Engineers supported</span></div>
              </div>
            </motion.div>
            <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="hero-glow" />
              <div className="profile-monogram">DS<span>.</span></div>
              <div className="floating-card card-aws"><Cloud size={17} /><span>AWS Cloud</span><b>●</b></div>
              <div className="floating-card card-terraform"><Code2 size={17} /><span>Terraform IaC</span><b>●</b></div>
              <div className="floating-card card-k8s"><Workflow size={17} /><span>Kubernetes</span><b>●</b></div>
              <div className="visual-caption"><span className="live-dot" /> ENGINEERING • ARCHITECTURE • OPERATIONS</div>
            </motion.div>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        </section>

        <section className="section section-wrap" id="about">
          <SectionTitle eyebrow="01 / ABOUT" title="Engineering depth." accent="Architectural thinking." />
          <div className="about-grid">
            <div className="about-main">
              <p className="about-lead">I am an IT infrastructure and cloud architecture professional with <strong>18+ years of experience</strong> across enterprise networking, systems administration, hybrid infrastructure and public cloud.</p>
              <p>My career has progressed from ISP and network engineering through systems administration and infrastructure leadership to cloud solution architecture. That breadth helps me connect architectural decisions to the realities of security, operations, reliability and cost.</p>
              <p>My recent work has focused on AWS foundations, multi-account governance, private Kubernetes platforms, Terraform automation, CI/CD identity, cloud networking and production support for engineering teams.</p>
              <div className="about-callout"><Award size={20} /><div><strong>Outcome-oriented infrastructure</strong><span>Architecture that balances resilience, security, cost and operational supportability.</span></div></div>
            </div>
            <div className="about-stats">
              <div className="stat-card"><span>PROFESSIONAL EXPERIENCE</span><strong>18<span>+</span></strong><small>Years across IT & infrastructure</small></div>
              <div className="stat-card"><span>ENGINEERING ENABLEMENT</span><strong>5</strong><small>Engineering teams supported</small></div>
              <div className="stat-card"><span>DOCUMENTED SAVINGS</span><strong>$200K<span>+</span></strong><small>Across multiple initiatives and periods</small></div>
            </div>
          </div>
        </section>

        <section className="section section-wrap" id="expertise">
          <SectionTitle eyebrow="02 / TECHNICAL EXPERTISE" title="The platforms behind" accent="the architecture." description="A practical mix of cloud engineering, enterprise infrastructure, automation and security." />
          <div className="expertise-grid">
            {expertise.map((group, index) => {
              const Icon = [Cloud, Network, Code2, ShieldCheck][index];
              return <motion.div className="expertise-card" key={group.group} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="expertise-icon"><Icon size={21} /></div><h3>{group.group}</h3>
                <div className="tag-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
              </motion.div>;
            })}
          </div>
        </section>

        <section className="section section-wrap" id="experience">
          <SectionTitle eyebrow="03 / CAREER JOURNEY" title="Built through" accent="hands-on experience." description="A progression from connectivity and systems to enterprise infrastructure leadership and cloud architecture." />
          <div className="timeline">
            {experience.map((item, index) => <motion.div className="timeline-item" key={item.company + item.role} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="timeline-marker">{String(index + 1).padStart(2, "0")}</div>
              <div className="timeline-content"><span className="timeline-company">{item.company}</span><h3>{item.role}</h3><p>{item.detail}</p></div>
            </motion.div>)}
          </div>
        </section>

        <section className="section section-wrap" id="projects">
          <SectionTitle eyebrow="04 / SELECTED WORK" title="Practical architecture." accent="Real-world outcomes." description="Representative initiatives from cloud infrastructure, platform engineering, security and modernization work." />
          <div className="project-grid">
            {projects.map((project) => <article className="project-card" key={project.number}>
              <div className="project-top"><span>{project.number} / CASE STUDY</span><ArrowUpRight size={17} /></div>
              <span className="project-category">{project.category}</span>
              <h3>{project.title}</h3><p>{project.summary}</p>
              <div className="project-outcome"><Check size={15} /><span>{project.outcome}</span></div>
              <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>)}
          </div>
          <p className="content-note">Project descriptions are concise summaries. Detailed architecture diagrams and implementation specifics can be added as individual case studies.</p>
        </section>

        <section className="section section-wrap architecture-band">
          <div><span className="eyebrow">ARCHITECTURE PRINCIPLES</span><h2>Design for the day<br />after go-live.</h2><p>Resilience is not just a diagram. Good architecture also considers failure modes, access boundaries, recovery objectives, observability, operational ownership and cost over time.</p></div>
          <div className="principle-list">
            {["Security and least privilege by design", "Resilience aligned to business RTO / RPO", "Repeatable infrastructure through IaC", "Operational visibility and recoverability", "Cost transparency and lifecycle management"].map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong><Check size={16} /></div>)}
          </div>
        </section>

        <TerraformSimulator />

        <section className="section section-wrap contact-section" id="contact">
          <div className="contact-panel">
            <span className="eyebrow">LET'S CONNECT</span>
            <h2>Have a cloud challenge<br /><span className="gradient-text">worth solving?</span></h2>
            <p>I'm interested in AWS Cloud Engineer, Cloud Solutions Architect and infrastructure engineering opportunities across Ontario.</p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:YOUR_EMAIL_ADDRESS"> <Mail size={16} /> Email me</a>
              <a className="button button-outline" href="https://www.linkedin.com/in/damanpreet-singh-chadha/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
              <a className="button button-outline" href="https://github.com/damanpreet-cloud" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
            </div>
            <small className="contact-edit-note">Before publishing: replace YOUR_EMAIL_ADDRESS with your preferred professional email.</small>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap"><a href="#home" className="brand"><span className="brand-mark">DS</span><span>DAMANPREET<span className="brand-dot">.</span></span></a><span>Designed to communicate engineering, not just list technologies.</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    </div>
  );
}

export default App;