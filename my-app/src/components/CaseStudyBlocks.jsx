function HeroSection({ kicker, title, subtitle, image, stats = [], meta = {}, services = [], stack = [] }) {
  const metaItems = [
    meta.industry ? { label: 'Industry', value: meta.industry } : null,
    meta.duration ? { label: 'Duration', value: meta.duration } : null,
  ].filter(Boolean);

  return (
    <section className="case-hero case-block">
      <div className="container case-hero-grid">
        <div>
          {kicker ? <span className="section-kicker">{kicker}</span> : null}
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
          {metaItems.length || services.length || stack.length ? (
            <div className="case-meta-panel">
              {metaItems.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
              {services.length ? (
                <div>
                  <span>Services</span>
                  <strong>{services.join(', ')}</strong>
                </div>
              ) : null}
              {stack.length ? (
                <div>
                  <span>Technology</span>
                  <strong>{stack.join(', ')}</strong>
                </div>
              ) : null}
            </div>
          ) : null}
          {stats.length ? (
            <div className="case-stats">
              {stats.map((stat) => (
                <div className="case-stat" key={`${stat.value}-${stat.label}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="case-hero-image">
            <img src={image} alt="" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TextSection({ eyebrow, title, body, points = [], band = false }) {
  return (
    <section className={`section case-block ${band ? 'case-band' : ''}`}>
      <div className="container case-two-column">
        <div>
          {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        <div>
          {body ? <p>{body}</p> : null}
          {points.length ? (
            <ul className="case-list">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CardSection({ kicker, title, body, items = [], band = false }) {
  return (
    <section className={`section case-block ${band ? 'case-band' : ''}`}>
      <div className="container">
        <div className="section-title">
          {kicker ? <span className="section-kicker">{kicker}</span> : null}
          <h2>{title}</h2>
          {body ? <p>{body}</p> : null}
        </div>
        {items.length ? (
          <div className="case-card-grid">
            {items.map((item) => (
              <article className="case-card" key={item.title || item.label || item}>
                {item.label ? <span>{item.label}</span> : null}
                {item.image ? <img src={item.image} alt="" /> : null}
                <h3>{item.title || item.label || 'Untitled item'}</h3>
                {item.body || item.description ? <p>{item.body || item.description}</p> : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Gallery({ title, images = [] }) {
  return (
    <section className="section case-band case-block">
      <div className="container">
        {title ? (
          <div className="section-title">
            <span className="section-kicker">Gallery</span>
            <h2>{title}</h2>
          </div>
        ) : null}
        <div className="case-gallery">
          {images.map((image) => (
            <figure key={image.src}>
              <img src={image.src} alt={image.alt || ''} />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ quote, author, role }) {
  return (
    <section className="section case-block">
      <div className="container">
        <blockquote className="case-quote">
          <p>{quote}</p>
          {author ? (
            <footer>
              <strong>{author}</strong>
              {role ? <span>{role}</span> : null}
            </footer>
          ) : null}
        </blockquote>
      </div>
    </section>
  );
}

function ImpactSection({ title, results = [] }) {
  return (
    <section className="section case-band case-block">
      <div className="container">
        <div className="section-title">
          <span className="section-kicker">Impact</span>
          <h2>{title}</h2>
        </div>
        <div className="case-impact-grid">
          {results.map((result) => (
            <div className="case-impact" key={`${result.value}-${result.label}`}>
              <strong>{result.value}</strong>
              <span>{result.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ title, items = [] }) {
  return (
    <section className="section case-block">
      <div className="container">
        <div className="section-title centered">
          <span className="section-kicker">Timeline</span>
          <h2>{title}</h2>
        </div>
        <div className="process-timeline">
          {items.map((item, index) => (
            <article className="timeline-item" key={`${item.title}-${index}`}>
              <div className="timeline-dot">{String(index + 1).padStart(2, '0')}</div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.label ? <span>{item.label}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ title, items = [] }) {
  return <CardSection kicker="FAQ" title={title} items={items} band />;
}

function CtaSection({ title, body, label, href = '/#contact' }) {
  return (
    <section className="section cta-section case-block">
      <div className="container">
        <div className="cta-banner">
          <span className="section-kicker">Next Step</span>
          <h2>{title}</h2>
          {body ? <p>{body}</p> : null}
          {label ? (
            <a href={href} className="btn btn-primary">
              {label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function UnknownBlock({ type }) {
  return (
    <section className="section case-block">
      <div className="container">
        <div className="case-card">
          <h3>Unsupported block: {type}</h3>
          <p>Add a renderer for this block type in CaseStudyBlocks.jsx.</p>
        </div>
      </div>
    </section>
  );
}

function renderCaseStudyBlock(block, index) {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case 'hero':
      return <HeroSection key={key} {...block.data} />;
    case 'overview':
      return <TextSection key={key} eyebrow="Overview" {...block.data} />;
    case 'problem':
      return <CardSection key={key} kicker="Problem" band {...block.data} />;
    case 'objectives':
      return <CardSection key={key} kicker="Objectives" {...block.data} />;
    case 'solution':
      return <TextSection key={key} eyebrow="Solution" band {...block.data} />;
    case 'feature_grid':
    case 'features':
      return <CardSection key={key} kicker="Features" items={block.data.features || block.data.items || []} {...block.data} />;
    case 'gallery':
      return <Gallery key={key} {...block.data} />;
    case 'architecture':
      return <CardSection key={key} kicker="Architecture" band {...block.data} />;
    case 'impact':
      return <ImpactSection key={key} {...block.data} />;
    case 'challenge':
      return <CardSection key={key} kicker="Challenge" band {...block.data} />;
    case 'timeline':
      return <TimelineSection key={key} {...block.data} />;
    case 'faq':
      return <FaqSection key={key} {...block.data} />;
    case 'cta':
      return <CtaSection key={key} {...block.data} />;
    case 'quote':
      return <QuoteSection key={key} {...block.data} />;
    default:
      return <UnknownBlock key={key} type={block.type} />;
  }
}

export function CaseStudyPreview({ project }) {
  const blocks = project.blocks?.length
    ? project.blocks
    : [
        {
          type: 'hero',
          data: {
            kicker: project.category || 'Case Study',
            title: project.title || 'Untitled Project',
            subtitle: project.description,
            image: project.coverImage || project.image,
          },
        },
      ];

  return <>{blocks.map(renderCaseStudyBlock)}</>;
}
