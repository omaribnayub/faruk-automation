import { useState } from "react";
import "./App.css";
import { defaultContent } from "./content/defaultContent";
import { submitLead } from "./content/cmsService";

function Section({ id, className = "", title, children }) {
  return (
    <section id={id} className={className}>
      <div className="container">
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}

function App({ content = defaultContent }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: ""
  });
  const [sendState, setSendState] = useState({
    loading: false,
    message: "",
    error: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setSendState({ loading: true, message: "", error: "" });

    try {
      await submitLead(formState);
      setSendState({
        loading: false,
        message: "Message sent successfully. We will contact you soon.",
        error: ""
      });
      setFormState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: ""
      });
    } catch {
      setSendState({
        loading: false,
        message: "",
        error: "Failed to send your message. Please try again."
      });
    }
  };

  return (
    <>
      <header className="hero">
        <div className="container">
          <h1>{content.hero.headline}</h1>
          <p className="hero-subheadline">
            {content.hero.subheadline}
          </p>
          <div className="btn-group">
            <a className="btn btn-primary" href="#contact">
              {content.hero.primaryButtonText}
            </a>
            <a className="btn btn-outline" href="#projects">
              {content.hero.secondaryButtonText}
            </a>
          </div>
        </div>
      </header>

      <section className="trust-bar">
        <div className="container">
          <ul className="trust-list">
            {content.trustBar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="services" className="light-bg" title={content.servicesTitle}>
        <div className="card-grid">
          {content.services.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="industries" title={content.industriesTitle}>
        <div className="card-grid industries-grid">
          {content.industries.map((item) => (
            <div key={item} className="card industry-card">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section id="projects" className="light-bg" title={content.projectsTitle}>
        <div className="card-grid">
          {content.projects.map((item) => (
            <article key={item.title} className="card project-card">
              <h3>{item.title}</h3>
              <p>
                <strong>Problem:</strong> {item.problem}
              </p>
              <p>
                <strong>Solution:</strong> {item.solution}
              </p>
              <p>
                <strong>Result:</strong> {item.result}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="tools" title={content.technologiesTitle}>
        <ul className="technology-list">
          {content.technologies.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="why-us" className="light-bg" title={content.whyTitle}>
        <ul className="check-list">
          {content.whyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="about" title={content.aboutTitle}>
        {content.aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Section>

      <section className="cta">
        <div className="container">
          <h2>{content.cta.title}</h2>
          <div className="btn-group centered">
            <a className="btn btn-primary" href="#contact">
              {content.cta.primaryButtonText}
            </a>
            <a className="btn btn-outline" href="#contact">
              {content.cta.secondaryButtonText}
            </a>
          </div>
        </div>
      </section>

      <Section id="packages" title={content.packagesTitle}>
        <div className="card-grid package-grid">
          {content.packages.map((item) => (
            <article key={item.name} className="card package-card">
              <h3>{item.name}</h3>
              <p className="package-price">
                {item.price}
                <span>{item.period}</span>
              </p>
              <ul className="package-features">
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a className="btn btn-secondary" href="#contact">
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="contact" className="light-bg" title={content.contact.title}>
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-grid">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+880..."
                  value={formState.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="projectType">Project Type</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formState.projectType}
                  onChange={handleChange}
                >
                  <option value="">Select project type</option>
                  <option>PLC Programming</option>
                  <option>SCADA/HMI Development</option>
                  <option>Automation Design</option>
                  <option>Retrofit & Upgrade</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="full-width">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project..."
                  value={formState.message}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={sendState.loading}>
              {sendState.loading ? "Sending..." : "Send Message"}
            </button>
            {sendState.message ? <p className="admin-message success">{sendState.message}</p> : null}
            {sendState.error ? <p className="admin-message error">{sendState.error}</p> : null}
          </form>

          <aside className="contact-info">
            <h3>{content.contact.directContactTitle}</h3>
            <p>Email: {content.contact.email}</p>
            <p>Phone: {content.contact.phone}</p>
            <a
              className="whatsapp-btn"
              href={content.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </aside>
        </div>
      </Section>

      <Section id="insights" title={content.insightsTitle}>
        <div className="card-grid">
          {content.insights.map((item) => (
            <article key={item.title} className="card upgrade-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <footer>
        <div className="container footer-grid">
          <div>
            <h3>{content.footer.quickLinksTitle}</h3>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{content.footer.servicesTitle}</h3>
            <ul>
              <li>PLC Programming</li>
              <li>SCADA Development</li>
              <li>Motor Protection</li>
              <li>System Upgrades</li>
            </ul>
          </div>
          <div>
            <h3>{content.footer.contactInfoTitle}</h3>
            <ul>
              <li>{content.contact.email}</li>
              <li>{content.contact.phone}</li>
              <li>WhatsApp Available</li>
            </ul>
          </div>
          <div>
            <h3>{content.footer.socialTitle}</h3>
            <ul>
              <li>
                <a href="#0">LinkedIn</a>
              </li>
              <li>
                <a href="#0">Facebook</a>
              </li>
              <li>
                <a href="#0">YouTube</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="copyright">{content.footer.copyright}</p>
      </footer>
    </>
  );
}

export default App;
