import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness, Check,
  Cloud, Code2, Fingerprint, Github, Home, LifeBuoy, Linkedin, Mail, Network, ShieldCheck,
  Terminal, Workflow, Zap, ChevronDown
} from "lucide-react";
import TerraformSimulator from "./components/TerraformSimulator.jsx";
import { expertise, experience, projects, repos, recommendations, education, highlights } from "./data.js";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

function SectionTitle({ eyebrow, title, accent, description }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title} <span className="gradient-text">{accent}</span></h2>{description && <p className="section-intro">{description}</p>}</div></div>;
}


function Ticker() {
  const items = [...highlights, ...highlights];
  return (
    <div className="ticker" role="region" aria-label="Highlights for recruiters">
      <div className="ticker-label"><span className="ticker-pulse" />HIGHLIGHTS</div>
      <div className="ticker-window">
        <div className="ticker-track">
          {items.map((h, i) => (
            <a className="ticker-item" key={i} href={h.href} aria-hidden={i >= highlights.length ? "true" : undefined} tabIndex={i >= highlights.length ? -1 : undefined}>
              <b>{h.tag}</b><span>{h.text}</span><i aria-hidden="true">◆</i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ r, hidden, onToggle }) {
  const [open, setOpen] = useState(false);
  const toggle = () => { setOpen((v) => !v); onToggle(!open); };
  return (
    <figure className={open ? "quote-card open" : "quote-card"} aria-hidden={hidden ? "true" : undefined}>
      <blockquote>{r.text}</blockquote>
      <button type="button" className="quote-more" onClick={toggle} tabIndex={hidden ? -1 : 0}>{open ? "Show less" : "Read full recommendation"}<ChevronDown size={13} /></button>
      <figcaption><strong>{r.name}</strong><span>{r.role}</span></figcaption>
    </figure>
  );
}

function RecommendationsCarousel() {
  const ref = useRef(null);
  const paused = useRef(false);
  const expanded = useRef(0);
  const resumeTimer = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let raf; let last = performance.now(); let pos = el.scrollLeft;
    const speed = 38; // pixels per second
    const tick = (now) => {
      const dt = Math.min(now - last, 64) / 1000; last = now;
      const half = el.scrollWidth / 2;
      if (!paused.current && expanded.current === 0 && half > el.clientWidth) {
        pos += speed * dt;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hold = () => { paused.current = true; clearTimeout(resumeTimer.current); };
  const release = (delay = 1800) => { clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => { paused.current = false; }, delay); };
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft <= 0 && paused.current) el.scrollLeft += half;
  };
  const onToggle = (isOpen) => { expanded.current += isOpen ? 1 : -1; };
  const list = [...recommendations, ...recommendations];

  return (
    <div className="quote-carousel" ref={ref} onMouseEnter={hold} onMouseLeave={() => release(400)} onTouchStart={hold} onTouchEnd={() => release(2200)} onFocus={hold} onBlur={() => release(400)} onScroll={onScroll} tabIndex={0} aria-label="Colleague recommendations, scrolling automatically. Hover, touch or focus to pause.">
      {list.map((r, i) => <RecommendationCard key={i} r={r} hidden={i >= recommendations.length} onToggle={onToggle} />)}
    </div>
  );
}

const tabs = [
  { id: "home", label: "Home", Icon: Home },
  { id: "experience", label: "Experience", Icon: BriefcaseBusiness },
  { id: "projects", label: "Projects", Icon: Code2 },
  { id: "simulator", label: "Lab", Icon: Terminal },
  { id: "contact", label: "Contact", Icon: Mail }
];

function TabBar() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const ids = ["home", "about", "expertise", "experience", "projects", "repos", "simulator", "references", "education", "contact"];
    const map = { about: "home", expertise: "experience", repos: "projects", references: "contact", education: "contact" };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { const id = e.target.id; setActive(map[id] || id); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const n = document.getElementById(id); if (n) obs.observe(n); });
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="tab-bar" aria-label="Primary">
      {tabs.map(({ id, label, Icon }) => (
        <a key={id} href={`#${id}`} className={active === id ? "tab active" : "tab"} aria-current={active === id ? "true" : undefined}>
          <Icon size={20} strokeWidth={active === id ? 2.4 : 1.9} /><span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

function App() {
  const nav = ["About", "Expertise", "Experience", "Projects", "Repos", "Simulator", "Contact"];

  return (
    <div className="app-shell">
      <Ticker />
      <header className="site-header">
        <a href="#home" className="brand"><span className="brand-mark">DS</span><span>DAMANPREET<span className="brand-dot">.</span></span></a>
        <a className="header-connect" href="#contact">Connect <ArrowUpRight size={13} /></a>
        <nav className="nav-links">
          {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
          <a className="nav-cta" href="#contact">Let's connect <ArrowUpRight size={14} /></a>
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
              <p>My career has progressed from network engineering and Linux systems administration through infrastructure leadership to cloud solution architecture. That breadth helps me connect architectural decisions to the realities of security, operations, reliability and cost.</p>
              <p>My recent work has focused on AWS foundations, multi-account governance, private Kubernetes platforms, Terraform automation, CI/CD identity, cloud networking and production support for engineering teams.</p>
              <div className="about-callout"><Award size={20} /><div><strong>Outcome-oriented infrastructure</strong><span>Architecture that balances resilience, security, cost and operational supportability.</span></div></div>
            </div>
            <div className="about-stats">
              <div className="stat-card"><span>PROFESSIONAL EXPERIENCE</span><strong>18<span>+</span></strong><small>Years across IT & infrastructure</small></div>
              <div className="stat-card"><span>ENGINEERING ENABLEMENT</span><strong>5</strong><small>Engineering teams supported</small></div>
              <div className="stat-card"><span>CUMULATIVE SAVINGS</span><strong>$100K<span>+</span></strong><small>Contributed across optimization initiatives (not annual)</small></div>
            </div>
          </div>
        </section>

        <section className="section section-wrap" id="expertise">
          <SectionTitle eyebrow="02 / TECHNICAL EXPERTISE" title="The platforms behind" accent="the architecture." description="A practical mix of cloud engineering, enterprise infrastructure, automation and security." />
          <div className="expertise-grid">
            {expertise.map((group, index) => {
              const Icon = [Cloud, Network, Code2, ShieldCheck, Fingerprint, LifeBuoy][index];
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
              <div className="timeline-content"><span className="timeline-company">{item.company}</span><h3>{item.role}</h3>{item.dates && <span className="timeline-dates">{item.dates}</span>}<p>{item.detail}</p>{item.link && <a className="repo-link timeline-link" href={item.link} target="_blank" rel="noreferrer"><Linkedin size={14} /> View on LinkedIn <ArrowUpRight size={13} /></a>}</div>
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
              {project.repo && <a className="repo-link" href={`https://github.com/damanpreet-cloud/${project.repo}`} target="_blank" rel="noreferrer"><Github size={14} /> Reference repo: {project.repo} <ArrowUpRight size={13} /></a>}
              <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>)}
          </div>
          <p className="content-note">These cards summarize work I supported in my roles. Linked repositories are separate reference implementations built with placeholder names, not copies of any employer’s environment.</p>
        </section>

        <section className="section section-wrap" id="repos">
          <SectionTitle eyebrow="05 / REFERENCE IMPLEMENTATIONS" title="Code you can" accent="read and run." description="Built with placeholder names and account IDs. They show how I approach landing zones, keyless CI/CD, reusable modules, cost, resilience and AI agent safety." />
          <div className="repo-grid">
            {repos.map((repo) => <a className="repo-card" key={repo.name} href={`https://github.com/damanpreet-cloud/${repo.name}`} target="_blank" rel="noreferrer">
              <div className="repo-top"><Github size={16} /><span>{repo.name}</span><ArrowUpRight size={15} /></div>
              {repo.personal && <span className="repo-badge">PERSONAL PROJECT</span>}
              <p>{repo.summary}</p>
              <div className="tag-list">{repo.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </a>)}
          </div>
        </section>

        <section className="section section-wrap architecture-band">
          <div><span className="eyebrow">ARCHITECTURE PRINCIPLES</span><h2>Design for the day<br />after go-live.</h2><p>Resilience is not just a diagram. Good architecture also considers failure modes, access boundaries, recovery objectives, observability, operational ownership and cost over time.</p></div>
          <div className="principle-list">
            {["Security and least privilege by design", "Resilience aligned to business RTO / RPO", "Repeatable infrastructure through IaC", "Operational visibility and recoverability", "Cost transparency and lifecycle management"].map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong><Check size={16} /></div>)}
          </div>
        </section>

        <TerraformSimulator />

        <section className="section section-wrap" id="references">
          <SectionTitle eyebrow="06 / REFERENCES" title="What colleagues" accent="say." description="LinkedIn recommendations from people I worked with at Numeris." />
          <RecommendationsCarousel />
        </section>

        <section className="section section-wrap" id="education">
          <SectionTitle eyebrow="07 / EDUCATION" title="Education &" accent="credentials." />
          <ul className="edu-list">
            {education.map((e) => <li key={e.title}><div><strong>{e.title}</strong><span>{e.detail}</span></div><small>{e.year}</small></li>)}
          </ul>
        </section>

        <section className="section section-wrap contact-section" id="contact">
          <div className="contact-panel">
            <span className="eyebrow">LET'S CONNECT</span>
            <h2>Have a cloud challenge<br /><span className="gradient-text">worth solving?</span></h2>
            <p>I'm interested in AWS Cloud Engineer, Cloud Solutions Architect and infrastructure engineering opportunities across Ontario.</p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:only.daman@gmail.com"><Mail size={16} /> Email me</a>
              <a className="button button-outline" href="https://www.linkedin.com/in/damanpreet-singh-chadha/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
              <a className="button button-outline" href="https://github.com/damanpreet-cloud" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
            </div>
            <small className="contact-edit-note">only.daman@gmail.com · Kitchener, Ontario, Canada</small>
          </div>
        </section>
      </main>
      <TabBar />

      <footer className="site-footer section-wrap"><a href="#home" className="brand"><span className="brand-mark">DS</span><span>DAMANPREET<span className="brand-dot">.</span></span></a><span>Kitchener, Ontario, Canada · Cloud, Security &amp; Enterprise Infrastructure</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    </div>
  );
}

export default App;