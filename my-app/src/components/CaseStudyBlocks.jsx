function HeroSection({ kicker, title, subtitle, image, stats = [], meta = {}, services = [], stack = [] }) {
  const safeMeta = meta || {};
  const safeStats = Array.isArray(stats) ? stats : [];
  const safeServices = Array.isArray(services) ? services : [];
  const safeStack = Array.isArray(stack) ? stack : [];

  const metaItems = [
    safeMeta.industry ? { label: 'Industry', value: safeMeta.industry } : null,
    safeMeta.duration ? { label: 'Duration', value: safeMeta.duration } : null,
  ].filter(Boolean);

  return (
    <section className="case-hero case-block">
      <div className="container case-hero-grid">
        <div>
          {kicker ? <span className="section-kicker">{kicker}</span> : null}
          <h1>{title || 'Untitled Project'}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
          {metaItems.length || safeServices.length || safeStack.length ? (
            <div className="case-meta-panel">
              {metaItems.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
              {safeServices.length ? (
                <div>
                  <span>Services</span>
                  <strong>{safeServices.join(', ')}</strong>
                </div>
              ) : null}
              {safeStack.length ? (
                <div>
                  <span>Technology</span>
                  <strong>{safeStack.join(', ')}</strong>
                </div>
              ) : null}
            </div>
          ) : null}
          {safeStats.length ? (
            <div className="case-stats">
              {safeStats.map((stat, idx) => (
                <div className="case-stat" key={`${stat?.value || idx}-${stat?.label || idx}`}>
                  <strong>{stat?.value || ''}</strong>
                  <span>{stat?.label || ''}</span>
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
  const safePoints = Array.isArray(points) ? points.filter(Boolean) : [];
  return (
    <section className={`section case-block ${band ? 'case-band' : ''}`}>
      <div className="container case-two-column">
        <div>
          {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
          <h2>{title || ''}</h2>
        </div>
        <div>
          {body ? <p>{body}</p> : null}
          {safePoints.length ? (
            <ul className="case-list">
              {safePoints.map((point, idx) => (
                <li key={typeof point === 'string' ? point : idx}>
                  {typeof point === 'string' ? point : JSON.stringify(point)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CardSection({ kicker, title, body, items = [], band = false }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return (
    <section className={`section case-block ${band ? 'case-band' : ''}`}>
      <div className="container">
        {title || kicker ? (
          <div className="section-title">
            {kicker ? <span className="section-kicker">{kicker}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {body ? <p>{body}</p> : null}
          </div>
        ) : null}
        {safeItems.length ? (
          <div className="case-card-grid">
            {safeItems.map((item, idx) => {
              const itemTitle = typeof item === 'object' ? (item?.title || item?.label || 'Untitled item') : String(item);
              const itemBody = typeof item === 'object' ? (item?.body || item?.description || '') : '';
              const itemLabel = typeof item === 'object' ? item?.label : null;
              const itemImg = typeof item === 'object' ? item?.image : null;
              return (
                <article className="case-card" key={idx}>
                  {itemLabel ? <span>{itemLabel}</span> : null}
                  {itemImg ? <img src={itemImg} alt="" /> : null}
                  <h3>{itemTitle}</h3>
                  {itemBody ? <p>{itemBody}</p> : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Gallery({ title, images = [] }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
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
          {safeImages.map((image, idx) => {
            const src = typeof image === 'string' ? image : image?.src;
            const alt = typeof image === 'object' ? image?.alt : '';
            const caption = typeof image === 'object' ? image?.caption : '';
            if (!src) return null;
            return (
              <figure key={idx}>
                <img src={src} alt={alt || ''} />
                {caption ? <figcaption>{caption}</figcaption> : null}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ quote, author, role }) {
  if (!quote) return null;
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
  const safeResults = Array.isArray(results) ? results.filter(Boolean) : [];
  return (
    <section className="section case-band case-block">
      <div className="container">
        <div className="section-title">
          <span className="section-kicker">Impact</span>
          <h2>{title || 'Impact'}</h2>
        </div>
        <div className="case-impact-grid">
          {safeResults.map((result, idx) => (
            <div className="case-impact" key={idx}>
              <strong>{result?.value || ''}</strong>
              <span>{result?.label || ''}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ title, items = [] }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return (
    <section className="section case-block">
      <div className="container">
        <div className="section-title centered">
          <span className="section-kicker">Timeline</span>
          <h2>{title || 'Timeline'}</h2>
        </div>
        <div className="process-timeline">
          {safeItems.map((item, index) => (
            <article className="timeline-item" key={index}>
              <div className="timeline-dot">{String(index + 1).padStart(2, '0')}</div>
              <div className="timeline-content">
                <h3>{item?.title || ''}</h3>
                <p>{item?.body || item?.description || ''}</p>
                {item?.label ? <span>{item.label}</span> : null}
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
          <h2>{title || 'Ready to start?'}</h2>
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
  if (!block || typeof block !== 'object') return null;
  const blockType = block.type || '';
  const data = block.data || {};
  const key = `${blockType}-${index}`;

  switch (blockType) {
    case 'hero':
      return <HeroSection key={key} {...data} />;
    case 'overview':
      return <TextSection key={key} eyebrow="Overview" {...data} />;
    case 'problem':
      return <CardSection key={key} kicker="Problem" band {...data} />;
    case 'objectives':
      return <CardSection key={key} kicker="Objectives" {...data} />;
    case 'solution':
      return <TextSection key={key} eyebrow="Solution" band {...data} />;
    case 'feature_grid':
    case 'features':
      return <CardSection key={key} kicker="Features" items={data.features || data.items || []} {...data} />;
    case 'gallery':
      return <Gallery key={key} {...data} />;
    case 'architecture':
      return <CardSection key={key} kicker="Architecture" band {...data} />;
    case 'impact':
      return <ImpactSection key={key} {...data} />;
    case 'challenge':
      return <CardSection key={key} kicker="Challenge" band {...data} />;
    case 'timeline':
      return <TimelineSection key={key} {...data} />;
    case 'faq':
      return <FaqSection key={key} {...data} />;
    case 'cta':
      return <CtaSection key={key} {...data} />;
    case 'quote':
      return <QuoteSection key={key} {...data} />;
    default:
      return <UnknownBlock key={key} type={blockType} />;
  }
}

export function CaseStudyPreview({ project }) {
  if (!project) return null;
  const blocks = Array.isArray(project.blocks) && project.blocks.length > 0
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

  return <>{blocks.map((block, idx) => renderCaseStudyBlock(block, idx))}</>;
}
