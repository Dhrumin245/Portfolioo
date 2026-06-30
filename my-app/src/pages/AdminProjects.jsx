import { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../utils/api';
import { Link } from 'react-router-dom';
import { CaseStudyPreview } from '../components/CaseStudyBlocks';
import '../assets/css/style.css';

const techOptions = ['React', 'FastAPI', 'Node.js', 'MongoDB', 'Docker', 'Redis', 'AWS', 'Python'];
const tagOptions = ['AI', 'SaaS', 'Automation', 'ML', 'Dashboard', 'API', 'Web App', 'MLOps'];
const sectionTypes = [
  ['hero', 'Hero'],
  ['overview', 'Overview'],
  ['problem', 'Problem'],
  ['objectives', 'Objectives'],
  ['solution', 'Solution'],
  ['feature_grid', 'Features'],
  ['gallery', 'Gallery'],
  ['architecture', 'Architecture'],
  ['impact', 'Impact'],
  ['challenge', 'Challenge'],
  ['timeline', 'Timeline'],
  ['faq', 'FAQ'],
  ['cta', 'CTA'],
  ['quote', 'Quote'],
];

const defaultProject = {
  title: '',
  slug: '',
  category: '',
  description: '',
  tags: [],
  stack: [],
  image: '',
  coverImage: '',
  status: 'draft',
  blocks: [],
  versions: [],
};

const newBlock = (type) => {
  const defaults = {
    hero: {
      kicker: 'Case Study',
      title: 'Project Title',
      subtitle: 'Short project summary.',
      image: '',
      meta: { industry: '', duration: '' },
      services: [],
      stack: [],
      stats: [],
    },
    overview: { title: 'Overview', body: '', points: [] },
    problem: { title: 'Problem', body: '', items: [] },
    objectives: { title: 'Objectives', body: '', items: [] },
    solution: { title: 'Solution', body: '', points: [] },
    feature_grid: { title: 'Features', features: [], items: [] },
    gallery: { title: 'Gallery', images: [] },
    architecture: { title: 'Architecture', body: '', items: [] },
    impact: { title: 'Impact', results: [] },
    challenge: { title: 'Challenge', body: '', items: [] },
    timeline: { title: 'Timeline', items: [] },
    faq: { title: 'FAQ', items: [] },
    cta: { title: 'Ready to build something similar?', body: '', label: 'Start a Project', href: '/#contact' },
    quote: { quote: '', author: '', role: '' },
  };

  return {
    type,
    data: defaults[type] || {},
  };
};

const labelFor = (type) => sectionTypes.find(([value]) => value === type)?.[1] || type;

function textListToString(items = []) {
  return items.join('\n');
}

function stringToTextList(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(defaultProject);
  const [editingSlug, setEditingSlug] = useState('');
  const [selectedType, setSelectedType] = useState('hero');
  const [status, setStatus] = useState('');
  const [dragIndex, setDragIndex] = useState(null);

  const previewProject = useMemo(() => project, [project]);

  const getAdminKey = () => import.meta.env.VITE_ADMIN_API_KEY;

  const safeErrorFromResponse = async (res) => {
    try {
      const text = await res.text();
      if (!text) return `Request failed with status ${res.status}`;
      try {
        const json = JSON.parse(text);
        return json.error || json.message || text;
      } catch {
        return text;
      }
    } catch {
      return `Request failed with status ${res.status}`;
    }
  };

  const authHeaders = () => {
    const key = getAdminKey();
    if (!key) {
      throw new Error('Admin API key is not set. Configure VITE_ADMIN_API_KEY in frontend env.');
    }
    return { 'x-admin-api-key': key };
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(apiUrl('/api/projects'));
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setStatus('Could not load projects. Check that the backend is running.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateProject = (field, value) => {
    setProject((current) => ({ ...current, [field]: value }));
  };

  const updateBlock = (index, data) => {
    setProject((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, data: { ...block.data, ...data } } : block
      ),
    }));
  };

  const updateBlockData = (index, updater) => {
    setProject((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, data: updater(block.data) } : block
      ),
    }));
  };

  const toggleChip = (field, value) => {
    setProject((current) => {
      const values = current[field] || [];
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [field]: next };
    });
  };

  const uploadImage = async (file) => {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch(apiUrl('/api/projects/upload-image'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ filename: file.name, dataUrl }),
    });

    if (!res.ok) {
      const errMsg = await safeErrorFromResponse(res);
      throw new Error(errMsg || 'Failed to upload image');
    }

    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (file) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      updateProject('coverImage', url);
      updateProject('image', url);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const addSection = () => {
    setProject((current) => ({ ...current, blocks: [...current.blocks, newBlock(selectedType)] }));
  };

  const removeSection = (index) => {
    setProject((current) => ({ ...current, blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index) }));
  };

  const moveSection = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= project.blocks.length) return;

    setProject((current) => {
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...current, blocks };
    });
  };

  const editProject = (item) => {
    setEditingSlug(item.slug);
    setProject({
      ...defaultProject,
      ...item,
      tags: item.tags || [],
      stack: item.stack || [],
      blocks: item.blocks || [],
      versions: item.versions || [],
    });
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProject = () => {
    setEditingSlug('');
    setProject(defaultProject);
    setStatus('');
  };

  const saveProject = async (nextStatus) => {
    const slug = project.slug.trim().toLowerCase();
    const payload = {
      ...project,
      slug,
      id: slug,
      title: project.title.trim(),
      category: project.category.trim(),
      description: project.description.trim(),
      status: nextStatus,
      stack: project.stack,
      tags: project.tags,
      coverImage: project.coverImage,
      image: project.image || project.coverImage,
    };

    if (!payload.title || !payload.slug) {
      setStatus('Title and slug are required.');
      return;
    }

    try {
      const res = await fetch(apiUrl(editingSlug ? `/api/projects/${editingSlug}` : '/api/projects'), {
        method: editingSlug ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await safeErrorFromResponse(res);
        throw new Error(errMsg || 'Failed to save project');
      }

      const saved = await res.json();
      setProject({
        ...defaultProject,
        ...saved,
        tags: saved.tags || [],
        stack: saved.stack || [],
        blocks: saved.blocks || [],
      });
      setEditingSlug(saved.slug);
      setStatus(nextStatus === 'published' ? 'Project published.' : 'Draft saved.');
      await fetchProjects();
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  const restoreVersion = async (index) => {
    if (!editingSlug) return;

    try {
      const res = await fetch(apiUrl(`/api/projects/${editingSlug}/restore/${index}`), {
        method: 'POST',
        headers: {
          ...authHeaders(),
        },
      });

      if (!res.ok) {
        const errMsg = await safeErrorFromResponse(res);
        throw new Error(errMsg || 'Failed to restore version');
      }

      const restored = await res.json();
      editProject(restored);
      setStatus('Version restored.');
      await fetchProjects();
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  const deleteProject = async (item) => {
    if (!window.confirm(`Delete ${item.title}?`)) return;

    try {
      const res = await fetch(apiUrl(`/api/projects/${item.slug}`), {
        method: 'DELETE',
        headers: {
          ...authHeaders(),
        },
      });

      if (!res.ok) {
        const errMsg = await safeErrorFromResponse(res);
        throw new Error(errMsg || 'Failed to delete project');
      }

      if (editingSlug === item.slug) resetProject();
      setStatus('Project deleted.');
      await fetchProjects();
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  return (
    <>
      <header id="header" className="scrolled">
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              Dhrumin's <span>Tech world</span>
            </Link>
            <div className="footer-links admin-nav">
              <Link to="/">Home</Link>
              <Link to="/#work">Work</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="cms-page">
        <section className="cms-sidebar">
          <div className="cms-sidebar-header">
            <h2>Projects</h2>
            <button type="button" onClick={resetProject}>
              + New Project
            </button>
          </div>
          <div className="cms-project-list">
            {projects.length ? (
              projects.map((item) => (
                <article className="cms-project-card" key={item.slug}>
                  <div className="cms-thumb">{item.coverImage ? <img src={item.coverImage} alt="" /> : null}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      <span className={`status-pill ${item.status === 'published' ? 'published' : ''}`}>{item.status || 'draft'}</span>
                      Updated {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </p>
                    <div className="cms-project-actions">
                      <button type="button" onClick={() => editProject(item)}>
                        Edit
                      </button>
                      <Link to={`/projects/${item.slug}`}>Preview</Link>
                      <button type="button" onClick={() => deleteProject(item)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p>No projects saved yet.</p>
            )}
          </div>
        </section>

        <section className="cms-editor">
          <div className="cms-editor-header">
            <div>
              <span className="section-kicker">{editingSlug ? 'Edit Case Study' : 'New Case Study'}</span>
              <h1>Project CMS</h1>
            </div>
            <div className="cms-save-actions">
              <button type="button" className="btn btn-secondary" onClick={() => saveProject('draft')}>
                Save Draft
              </button>
              {editingSlug ? (
                <Link className="btn btn-secondary" to={`/projects/${project.slug}`}>
                  Preview
                </Link>
              ) : null}
              <button type="button" className="submit-btn" onClick={() => saveProject('published')}>
                Publish
              </button>
            </div>
          </div>

          {status ? <p className="admin-status">{status}</p> : null}

          <div className="cms-split">
            <div className="cms-form-column">
              <BasicInfo project={project} updateProject={updateProject} toggleChip={toggleChip} handleCoverUpload={handleCoverUpload} />

              <section className="cms-panel">
                <div className="cms-panel-title">
                  <h2>Content</h2>
                  <div className="add-section-control">
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                      {sectionTypes.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={addSection}>
                      + Add Section
                    </button>
                  </div>
                </div>

                <div className="section-stack">
                  {project.blocks.map((block, index) => (
                    <section
                      className="block-editor"
                      key={`${block.type}-${index}`}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex !== null) moveSection(dragIndex, index);
                        setDragIndex(null);
                      }}
                    >
                      <div className="block-editor-header">
                        <strong>☰ {labelFor(block.type)}</strong>
                        <div>
                          <button type="button" onClick={() => moveSection(index, index - 1)}>
                            ↑
                          </button>
                          <button type="button" onClick={() => moveSection(index, index + 1)}>
                            ↓
                          </button>
                          <button type="button" onClick={() => removeSection(index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <BlockFields block={block} index={index} updateBlock={updateBlock} updateBlockData={updateBlockData} uploadImage={uploadImage} />
                    </section>
                  ))}
                </div>
              </section>

              {project.versions?.length ? (
                <section className="cms-panel">
                  <h2>Version History</h2>
                  <div className="version-list">
                    {project.versions.map((version, index) => (
                      <article key={`${version.savedAt}-${index}`}>
                        <div>
                          <strong>{version.label || `Version ${index + 1}`}</strong>
                          <span>{new Date(version.savedAt).toLocaleString()}</span>
                        </div>
                        <button type="button" onClick={() => restoreVersion(index)}>
                          Restore
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="cms-preview">
              <div className="cms-preview-header">
                <h2>Live Preview</h2>
                <span>{project.status}</span>
              </div>
              <div className="preview-frame">
                <CaseStudyPreview project={previewProject} />
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function BasicInfo({ project, updateProject, toggleChip, handleCoverUpload }) {
  return (
    <section className="cms-panel">
      <h2>Basic Info</h2>
      <div className="admin-form-row">
        <label>
          Title
          <input className="form-control" value={project.title} onChange={(e) => updateProject('title', e.target.value)} required />
        </label>
        <label>
          Slug
          <input
            className="form-control"
            value={project.slug}
            onChange={(e) => updateProject('slug', e.target.value)}
            placeholder="evomind"
            required
          />
        </label>
      </div>
      <label>
        Description
        <textarea className="form-control" value={project.description} onChange={(e) => updateProject('description', e.target.value)}></textarea>
      </label>
      <label>
        Category
        <input className="form-control" value={project.category} onChange={(e) => updateProject('category', e.target.value)} />
      </label>
      <ChipGroup title="Technology Stack" values={project.stack} options={techOptions} onToggle={(value) => toggleChip('stack', value)} />
      <ChipGroup title="Tags" values={project.tags} options={tagOptions} onToggle={(value) => toggleChip('tags', value)} />
      <label>
        Upload Cover
        <input className="form-control" type="file" accept="image/*" onChange={(e) => handleCoverUpload(e.target.files?.[0])} />
      </label>
      {project.coverImage ? (
        <div className="image-preview">
          <img src={project.coverImage} alt="" />
        </div>
      ) : null}
    </section>
  );
}

function ChipGroup({ title, values = [], options, onToggle }) {
  return (
    <div>
      <span className="field-label">{title}</span>
      <div className="chip-list">
        {options.map((option) => (
          <button
            type="button"
            className={values.includes(option) ? 'chip selected' : 'chip'}
            key={option}
            onClick={() => onToggle(option)}
          >
            {values.includes(option) ? '✓ ' : '+ '}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlockFields({ block, index, updateBlock, updateBlockData, uploadImage }) {
  const data = block.data;

  if (block.type === 'hero') {
    return (
      <div className="block-field-grid">
        <Input label="Title" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Input label="Kicker" value={data.kicker} onChange={(value) => updateBlock(index, { kicker: value })} />
        <Textarea label="Subtitle" value={data.subtitle} onChange={(value) => updateBlock(index, { subtitle: value })} />
        <Input label="Industry" value={data.meta?.industry} onChange={(value) => updateBlock(index, { meta: { ...data.meta, industry: value } })} />
        <Input label="Duration" value={data.meta?.duration} onChange={(value) => updateBlock(index, { meta: { ...data.meta, duration: value } })} />
        <ListField label="Services" values={data.services} onChange={(values) => updateBlock(index, { services: values })} />
        <ListField label="Technology Stack" values={data.stack} onChange={(values) => updateBlock(index, { stack: values })} />
        <ImageField label="Upload Cover" value={data.image} onUpload={async (file) => updateBlock(index, { image: await uploadImage(file) })} />
        <Repeater label="Stats" items={data.stats || []} fields={['value', 'label']} onChange={(stats) => updateBlock(index, { stats })} />
      </div>
    );
  }

  if (['overview', 'solution'].includes(block.type)) {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Textarea label="Description" value={data.body} onChange={(value) => updateBlock(index, { body: value })} />
        <ListField label="Points" values={data.points} onChange={(values) => updateBlock(index, { points: values })} />
      </div>
    );
  }

  if (['problem', 'objectives', 'architecture', 'challenge', 'faq'].includes(block.type)) {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Textarea label="Description" value={data.body} onChange={(value) => updateBlock(index, { body: value })} />
        <Repeater label="Items" items={data.items || []} fields={['title', 'body']} onChange={(items) => updateBlock(index, { items })} />
      </div>
    );
  }

  if (block.type === 'feature_grid') {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Repeater
          label="Features"
          items={data.features || data.items || []}
          fields={['label', 'title', 'body']}
          onChange={(features) => updateBlock(index, { features, items: features })}
          uploadImage={uploadImage}
        />
      </div>
    );
  }

  if (block.type === 'gallery') {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <GalleryField images={data.images || []} uploadImage={uploadImage} onChange={(images) => updateBlock(index, { images })} />
      </div>
    );
  }

  if (block.type === 'impact') {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Repeater label="Results" items={data.results || []} fields={['value', 'label']} onChange={(results) => updateBlock(index, { results })} />
      </div>
    );
  }

  if (block.type === 'timeline') {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Repeater label="Timeline Items" items={data.items || []} fields={['label', 'title', 'body']} onChange={(items) => updateBlock(index, { items })} />
      </div>
    );
  }

  if (block.type === 'cta') {
    return (
      <div className="block-field-grid">
        <Input label="Heading" value={data.title} onChange={(value) => updateBlock(index, { title: value })} />
        <Textarea label="Description" value={data.body} onChange={(value) => updateBlock(index, { body: value })} />
        <Input label="Button Label" value={data.label} onChange={(value) => updateBlock(index, { label: value })} />
        <Input label="Button Link" value={data.href} onChange={(value) => updateBlock(index, { href: value })} />
      </div>
    );
  }

  if (block.type === 'quote') {
    return (
      <div className="block-field-grid">
        <Textarea label="Quote" value={data.quote} onChange={(value) => updateBlock(index, { quote: value })} />
        <Input label="Author" value={data.author} onChange={(value) => updateBlock(index, { author: value })} />
        <Input label="Role" value={data.role} onChange={(value) => updateBlock(index, { role: value })} />
      </div>
    );
  }

  return (
    <Textarea
      label="Content"
      value={JSON.stringify(data, null, 2)}
      onChange={(value) => {
        try {
          updateBlockData(index, () => JSON.parse(value));
        } catch {
          updateBlockData(index, (current) => current);
        }
      }}
    />
  );
}

function Input({ label, value = '', onChange }) {
  return (
    <label>
      {label}
      <input className="form-control" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Textarea({ label, value = '', onChange }) {
  return (
    <label>
      {label}
      <textarea className="form-control" value={value || ''} onChange={(e) => onChange(e.target.value)}></textarea>
    </label>
  );
}

function ListField({ label, values = [], onChange }) {
  return (
    <label>
      {label}
      <textarea
        className="form-control compact-textarea"
        value={textListToString(values)}
        onChange={(e) => onChange(stringToTextList(e.target.value))}
        placeholder="One item per line"
      ></textarea>
    </label>
  );
}

function ImageField({ label, value, onUpload }) {
  return (
    <label>
      {label}
      <input className="form-control" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      {value ? (
        <div className="image-preview small">
          <img src={value} alt="" />
        </div>
      ) : null}
    </label>
  );
}

function Repeater({ label, items = [], fields, onChange, uploadImage }) {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="repeater">
      <div className="repeater-header">
        <span>{label}</span>
        <button type="button" onClick={() => onChange([...items, {}])}>
          + Add
        </button>
      </div>
      {items.map((item, index) => (
        <div className="repeater-item" key={index}>
          {fields.map((field) =>
            field === 'body' ? (
              <Textarea key={field} label={field} value={item[field]} onChange={(value) => updateItem(index, field, value)} />
            ) : (
              <Input key={field} label={field} value={item[field]} onChange={(value) => updateItem(index, field, value)} />
            )
          )}
          {uploadImage ? (
            <ImageField label="Image" value={item.image} onUpload={async (file) => updateItem(index, 'image', await uploadImage(file))} />
          ) : null}
          <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function GalleryField({ images = [], uploadImage, onChange }) {
  const addImages = async (files) => {
    const uploaded = await Promise.all(
      [...files].map(async (file) => ({
        src: await uploadImage(file),
        alt: '',
        caption: '',
      }))
    );
    onChange([...images, ...uploaded]);
  };

  return (
    <div className="gallery-field">
      <label>
        Upload Images
        <input className="form-control" type="file" accept="image/*" multiple onChange={(e) => addImages(e.target.files || [])} />
      </label>
      <div className="gallery-admin-grid">
        {images.map((image, index) => (
          <div className="gallery-admin-item" key={`${image.src}-${index}`}>
            <img src={image.src} alt="" />
            <input
              className="form-control"
              value={image.caption || ''}
              onChange={(e) =>
                onChange(images.map((item, itemIndex) => (itemIndex === index ? { ...item, caption: e.target.value } : item)))
              }
              placeholder="Caption"
            />
            <button type="button" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProjects;

