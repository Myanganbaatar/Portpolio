import { useEffect, useRef, useState } from 'react';
import { useStill } from '../context';
import './ProjectDemos.css';

// Web re-creations of university projects whose originals (Kotlin, C#, PHP + MariaDB)
// cannot run in a browser. Screens, texts, colours and rules come from the real
// repositories; only the storage is replaced by in-memory state.

const IMG = (p) => `${process.env.PUBLIC_URL}/images/demos/${p}`;

/* Material icons used by the Compose app (24px paths). */
const MI = {
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  sweep: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z',
  filter: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  category: 'M12 2l-5.5 9h11L12 2zm5.5 11a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM3 21.5h8v-8H3v8z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  clear: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  work: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  bag: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z',
  repeat: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  photo: 'M19 7v3h-2V7h-3V5h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z',
};

function Mi({ d, size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} fill={color} />
    </svg>
  );
}

// Lets the visitor pick a real picture; it stays in the browser (object URL).
function usePhotoPicker(onPick) {
  const ref = useRef(null);
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files && e.target.files[0];
        if (file) onPick(URL.createObjectURL(file));
        e.target.value = '';
      }}
    />
  );
  return [input, () => ref.current && ref.current.click()];
}

/* =====================================================================
   Android task manager — Projet-Kotlin (Jetpack Compose, Material 3)
   ===================================================================== */

const STATUSES = ['TODO', 'LATE', 'DONE'];
const PERIODS = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORIES = ['WORK', 'PERSONAL', 'SHOPPING', 'OTHER'];
const PRIORITY_COLOR = { HIGH: '#ff0000', MEDIUM: '#ffa500', LOW: '#0000ff' };
const PRIORITY_POINTS = { HIGH: 30, MEDIUM: 20, LOW: 10 };
const CATEGORY_ICON = { WORK: MI.work, PERSONAL: MI.home, SHOPPING: MI.bag, OTHER: MI.category };

// mockTasks from MainActivity.kt
const MOCK_TASKS = [
  { id: 1, title: 'Acheter du café', description: 'Indispensable pour coder', status: 'TODO', periodicity: 'DAILY', priority: 'HIGH', category: 'WORK', image: null },
  { id: 2, title: 'Préparer la présentation', description: 'Pour le 13 mars', status: 'DONE', periodicity: 'NONE', priority: 'MEDIUM', category: 'WORK', image: null },
  { id: 3, title: 'Sport', description: 'Ne pas oublier !', status: 'LATE', periodicity: 'WEEKLY', priority: 'LOW', category: 'PERSONAL', image: null },
];

const rankFor = (points) => (points >= 100 ? 'Expert 🏆' : points >= 50 ? 'Intermédiaire ⭐' : 'Débutant 🌱');

// animateIntAsState: the score counts up instead of jumping.
function useCountUp(target) {
  const still = useStill();
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (still || shown === target) {
      setShown(target);
      return undefined;
    }
    const id = setInterval(() => setShown((v) => (v < target ? Math.min(target, v + 2) : Math.max(target, v - 2))), 16);
    return () => clearInterval(id);
  }, [target, shown, still]);
  return shown;
}

function DroidMenu({ label, icon, items, onPick }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="kt__menu">
      <button className="kt__icon-btn" onClick={() => setOpen((o) => !o)} aria-label={label} aria-expanded={open}>
        <Mi d={icon} />
      </button>
      {open && (
        <ul className="kt__dropdown" role="menu">
          {items.map((it) => (
            <li key={it.label}>
              <button
                role="menuitem"
                onClick={() => {
                  onPick(it.value);
                  setOpen(false);
                }}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DroidSelect({ label, value, options, onChange }) {
  return (
    <label className="kt__field kt__field--select">
      <span className="kt__field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TaskForm({ initial, isNew, onSave, onBack }) {
  const [task, setTask] = useState(initial);
  const set = (k) => (v) => setTask((t) => ({ ...t, [k]: v }));
  const [picker, openPicker] = usePhotoPicker(set('image'));

  return (
    <div className="kt__screen">
      <header className="kt__appbar kt__appbar--small">
        <button className="kt__icon-btn" onClick={onBack} aria-label="Back">
          <Mi d={MI.back} />
        </button>
        <h4>{isNew ? 'Add New Task' : 'Edit Task'}</h4>
      </header>
      <form
        className="kt__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (task.title.trim()) onSave({ ...task, title: task.title.trim() });
        }}
      >
        <label className="kt__field">
          <span className="kt__field-label">Title</span>
          <input value={task.title} onChange={(e) => set('title')(e.target.value)} autoFocus={isNew} />
        </label>
        <label className="kt__field">
          <span className="kt__field-label">Description</span>
          <input value={task.description} onChange={(e) => set('description')(e.target.value)} />
        </label>
        <DroidSelect label="Category" value={task.category} options={CATEGORIES} onChange={set('category')} />
        <DroidSelect label="Status" value={task.status} options={STATUSES} onChange={set('status')} />
        <DroidSelect label="Periodicity" value={task.periodicity} options={PERIODS} onChange={set('periodicity')} />
        <DroidSelect label="Priority" value={task.priority} options={PRIORITIES} onChange={set('priority')} />
        {isNew && (
          <div className="kt__photo-row">
            {picker}
            <button type="button" className="kt__btn kt__btn--tonal" onClick={openPicker}>
              <Mi d={MI.photo} size={18} /> Add Photo
            </button>
            {task.image && <img src={task.image} alt="Selected" className="kt__photo-preview" />}
          </div>
        )}
        <button type="submit" className="kt__btn" disabled={!task.title.trim()}>
          {isNew ? 'Add Task' : 'Update Task'}
        </button>
      </form>
    </div>
  );
}

export function TaskAppDemo() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [points, setPoints] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [query, setQuery] = useState('');
  const [route, setRoute] = useState({ name: 'taskList' });
  const shownPoints = useCountUp(points);

  // onTaskUpdated: points are earned only when a task becomes DONE.
  const updateTask = (updated) => {
    const before = tasks.find((t) => t.id === updated.id);
    if (before && before.status !== 'DONE' && updated.status === 'DONE') setPoints((p) => p + PRIORITY_POINTS[updated.priority]);
    setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  };

  const q = query.toLowerCase();
  const order = { HIGH: 2, MEDIUM: 1, LOW: 0 };
  const visible = tasks
    .filter((t) => (!statusFilter || t.status === statusFilter) && (!categoryFilter || t.category === categoryFilter))
    .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    .sort((a, b) => order[b.priority] - order[a.priority]);

  let screen;
  if (route.name === 'addTask') {
    screen = (
      <TaskForm
        isNew
        initial={{ id: 0, title: '', description: '', status: 'TODO', periodicity: 'NONE', priority: 'MEDIUM', category: 'OTHER', image: null }}
        onBack={() => setRoute({ name: 'taskList' })}
        onSave={(task) => {
          setTasks((ts) => [...ts, { ...task, id: Math.max(0, ...ts.map((t) => t.id)) + 1 }]);
          setRoute({ name: 'taskList' });
        }}
      />
    );
  } else if (route.name === 'editTask') {
    const task = tasks.find((t) => t.id === route.id);
    screen = (
      <TaskForm
        initial={task}
        onBack={() => setRoute({ name: 'taskList' })}
        onSave={(t) => {
          setTasks((ts) => ts.map((x) => (x.id === t.id ? t : x)));
          setRoute({ name: 'taskList' });
        }}
      />
    );
  } else {
    screen = (
      <div className="kt__screen">
        <header className="kt__appbar">
          <div className="kt__title">
            <h4>My Todo List</h4>
            <p>
              <Mi d={MI.star} size={14} color="#fbc02d" /> {shownPoints} pts - {rankFor(points)}
            </p>
          </div>
          <button className="kt__icon-btn" onClick={() => setTasks((ts) => ts.filter((t) => t.status !== 'DONE'))} aria-label="Purge DONE">
            <Mi d={MI.sweep} />
          </button>
          <DroidMenu
            label="Filter by Status"
            icon={MI.filter}
            onPick={setStatusFilter}
            items={[{ label: 'All Status', value: null }, ...STATUSES.map((s) => ({ label: s, value: s }))]}
          />
          <DroidMenu
            label="Filter by Category"
            icon={MI.category}
            onPick={setCategoryFilter}
            items={[{ label: 'All Categories', value: null }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]}
          />
        </header>

        <div className="kt__search">
          <Mi d={MI.search} size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une tâche..." aria-label="Rechercher une tâche" />
          {query && (
            <button className="kt__icon-btn kt__icon-btn--sm" onClick={() => setQuery('')} aria-label="Effacer">
              <Mi d={MI.clear} size={18} />
            </button>
          )}
        </div>

        {(statusFilter || categoryFilter) && (
          <p className="kt__active-filter">
            {[statusFilter, categoryFilter].filter(Boolean).join(' · ')}
            <button
              onClick={() => {
                setStatusFilter(null);
                setCategoryFilter(null);
              }}
            >
              ✕
            </button>
          </p>
        )}

        <ul className="kt__list">
          {visible.map((t) => (
            <li key={t.id} className={`kt__card kt__card--${t.status.toLowerCase()}`}>
              <span className="kt__prio" style={{ background: PRIORITY_COLOR[t.priority] }} />
              <input
                type="checkbox"
                className="kt__check"
                checked={t.status === 'DONE'}
                onChange={(e) => updateTask({ ...t, status: e.target.checked ? 'DONE' : 'TODO' })}
                aria-label={t.title}
              />
              {t.image && <img src={t.image} alt="" className="kt__thumb" />}
              <button className="kt__card-body" onClick={() => setRoute({ name: 'editTask', id: t.id })}>
                <span className="kt__card-title">
                  <Mi d={CATEGORY_ICON[t.category]} size={14} color="#808080" /> {t.title}
                </span>
                {t.description && <span className="kt__card-desc">{t.description}</span>}
                <span className="kt__card-meta">
                  {t.periodicity !== 'NONE' && (
                    <>
                      <Mi d={MI.repeat} size={12} color="#808080" /> {t.periodicity.toLowerCase()}
                      &nbsp;&nbsp;
                    </>
                  )}
                  <span className="kt__tag">#{t.category.toLowerCase()}</span>
                </span>
              </button>
              <span className="kt__card-side">
                <span className={t.status === 'LATE' ? 'is-late' : ''}>{t.status}</span>
                <b style={{ color: PRIORITY_COLOR[t.priority] }}>{t.priority}</b>
              </span>
            </li>
          ))}
        </ul>

        <button className="kt__fab" onClick={() => setRoute({ name: 'addTask' })} aria-label="Add Task">
          <Mi d={MI.add} size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="phone__screen kt">
        <div className="phone__status">
          <span>9:41</span>
          <span>▮▮▮ ▮</span>
        </div>
        {screen}
        <div className="phone__gesture" />
      </div>
    </div>
  );
}

/* =====================================================================
   Explorateur de Pays — ProjetMAUI (.NET MAUI, C#, MVVM)
   ===================================================================== */

// ObtenirPaysTest() fallback of ApiService.cs, extended so each filter shows something.
const FALLBACK_COUNTRIES = [
  ['France', 'Paris', 67000000, 'Europe', 'fr'],
  ['Mongolia', 'Ulan Bator', 3300000, 'Asia', 'mn'],
  ['Japan', 'Tokyo', 125000000, 'Asia', 'jp'],
  ['Portugal', 'Lisbon', 10300000, 'Europe', 'pt'],
  ['Morocco', 'Rabat', 37000000, 'Africa', 'ma'],
  ['Senegal', 'Dakar', 17200000, 'Africa', 'sn'],
  ['Brazil', 'Brasília', 212500000, 'Americas', 'br'],
  ['Canada', 'Ottawa', 38000000, 'Americas', 'ca'],
  ['Australia', 'Canberra', 25700000, 'Oceania', 'au'],
  ['New Zealand', 'Wellington', 5100000, 'Oceania', 'nz'],
].map(([name, capital, population, region, code]) => ({ name, capital, population, region, flag: `https://flagcdn.com/w320/${code}.png` }));

const CONTINENTS = [
  ['Tous', 'All'],
  ['Afrique', 'Africa'],
  ['Amériques', 'Americas'],
  ['Asie', 'Asia'],
  ['Europe', 'Europe'],
  ['Océanie', 'Oceania'],
];

const TABS = [
  { key: 'home', title: 'Home', icon: 'home_icone.png' },
  { key: 'profile', title: 'Profile', icon: 'profil_icone.png' },
  { key: 'add', title: 'Add', icon: 'ajout_icone.png' },
  { key: 'settings', title: 'Settings', icon: 'settings_icone.png' },
];

// ApiService.GetCountriesAsync() calls restcountries.com/v3.1, which now answers with a
// redirect; the demo therefore shows the app's own fallback (ObtenirPaysTest), like the app does.
function useCountries() {
  const [state, setState] = useState({ loading: true, list: [] });
  useEffect(() => {
    const id = setTimeout(() => setState({ loading: false, list: FALLBACK_COUNTRIES }), 600);
    return () => clearTimeout(id);
  }, []);
  return state;
}

function Switch({ checked, onChange, label }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} className={`mz__switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

export function MauiDemo() {
  const still = useStill();
  const [tab, setTab] = useState('home');
  const [dark, setDark] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [items, setItems] = useState([]);
  const [slide, setSlide] = useState(0);
  const [gif, setGif] = useState(false);
  const [continent, setContinent] = useState('All');
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ titre: '', description: '', image: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [alert, setAlert] = useState(false);
  const countries = useCountries();
  const [picker, openPicker] = usePhotoPicker((url) => setForm((f) => ({ ...f, image: url })));

  const flags = ['mongolia.png', 'france.png', 'portugal.png'];

  // CarouselView Loop="True"
  useEffect(() => {
    if (still || tab !== 'home') return undefined;
    const id = setInterval(() => setSlide((s) => (s + 1) % flags.length), 2500);
    return () => clearInterval(id);
  }, [still, tab, flags.length]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // AjoutViewModel.AjouterItem(): same validation messages, notification, then alert.
  const ajouter = (e) => {
    e.preventDefault();
    const errs = {
      titre: form.titre.trim() ? '' : 'Le titre est obligatoire',
      description: form.description.trim() ? '' : 'La description est obligatoire',
      image: form.image ? '' : 'Veuillez sélectionner une image',
    };
    setErrors(errs);
    if (errs.titre || errs.description || errs.image) return;
    setItems((list) => [...list, { ...form, date: new Date() }]);
    if (notifs) setToast({ title: '📖 Nouvel élément !', text: `L'élément '${form.titre}' a été ajouté à votre collection.` });
    setAlert(true);
    setForm({ titre: '', description: '', image: '' });
  };

  // ParametresViewModel: turning notifications on sends a confirmation one second later.
  const toggleNotifs = (on) => {
    setNotifs(on);
    if (on) setTimeout(() => setToast({ title: '🔔 Succès !', text: 'Les notifications sont maintenant activées.' }), 1000);
  };

  const shown = continent === 'All' ? countries.list : countries.list.filter((c) => c.region === continent);
  const fmtDate = (d) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  let page;
  if (detail) {
    page = (
      <div className="mz__page mz__detail">
        <header className="mz__navbar">
          <button onClick={() => setDetail(null)} aria-label="Retour">
            ←
          </button>
          <span>{detail.name}</span>
        </header>
        <img src={detail.flag} alt={`Drapeau : ${detail.name}`} className="mz__detail-flag" />
        <h3>{detail.name}</h3>
        <div className="mz__frame">
          <p className="mz__frame-title">Informations détaillées</p>
          <p>🏙️ Capitale : {detail.capital}</p>
          <p>👥 Population : {detail.population.toLocaleString('fr-FR')} habitants</p>
          <p>🌍 Région : {detail.region}</p>
        </div>
      </div>
    );
  } else if (tab === 'home') {
    page = (
      <div className="mz__page mz__home">
        <h3>Explorateur de Pays</h3>
        <p className="mz__sub">Le monde à portée de main</p>
        <div className="mz__icons">
          <img src={IMG('maui/airplane.png')} alt="" />
          <img src={IMG('maui/location.png')} alt="" />
        </div>
        <div className="mz__carousel">
          {flags.map((f, i) => (
            <img key={f} src={IMG(`maui/${f}`)} alt="" className={i === slide ? 'is-current' : ''} />
          ))}
        </div>
        <button className="mz__btn-blue" onClick={() => setGif(true)}>
          Voir l'animation
        </button>
      </div>
    );
  } else if (tab === 'profile') {
    page = (
      <div className="mz__page mz__profile">
        <div className="mz__hero">
          <span className="mz__avatar">
            <img src={IMG('maui/profil_icone.png')} alt="" />
          </span>
          <div>
            <h3>Mon Profil</h3>
            <p>Gérez vos éléments et découvrez le monde</p>
          </div>
        </div>
        <section className="mz__section">
          <h4>Mes Éléments</h4>
          {items.length === 0 ? (
            <div className="mz__empty">
              <span>📬</span>
              <p>Aucun élément ajouté</p>
              <small>Ajoutez-en un dans l'onglet '+'</small>
            </div>
          ) : (
            <ul className="mz__items">
              {items.map((it, i) => (
                <li key={i}>
                  <img src={it.image} alt="" />
                  <b>{it.titre}</b>
                  <small>{fmtDate(it.date)}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="mz__section">
          <h4>🌎 Explorer le Monde</h4>
          <div className="mz__chips">
            {CONTINENTS.map(([label, value]) => (
              <button key={value} className={continent === value ? 'is-active' : ''} onClick={() => setContinent(value)} aria-pressed={continent === value}>
                {label}
              </button>
            ))}
          </div>
          {countries.loading ? (
            <p className="mz__loading">Chargement des pays...</p>
          ) : (
            <ul className="mz__countries">
              {shown.slice(0, 40).map((c) => (
                <li key={c.name}>
                  <button onClick={() => setDetail(c)}>
                    <img src={c.flag} alt="" loading="lazy" />
                    <span>
                      <b>{c.name}</b>
                      <small>{c.capital}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    );
  } else if (tab === 'add') {
    page = (
      <form className="mz__page mz__add" onSubmit={ajouter} noValidate>
        <h3>Ajouter un élément</h3>
        <label>
          Titre
          <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Entrez le titre" />
        </label>
        {errors.titre && <p className="mz__error">{errors.titre}</p>}
        <label>
          Description
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Entrez la description" />
        </label>
        {errors.description && <p className="mz__error">{errors.description}</p>}
        {picker}
        <button type="button" className="mz__btn-photo" onClick={openPicker}>
          📷 Ajouter une photo
        </button>
        {form.image ? <img src={form.image} alt="Aperçu" className="mz__preview" /> : <p className="mz__hint">Aucune image sélectionnée</p>}
        {errors.image && <p className="mz__error">{errors.image}</p>}
        <button type="submit" className="mz__btn-primary">
          Ajouter l'élément
        </button>
      </form>
    );
  } else {
    page = (
      <div className="mz__page mz__settings">
        <h3>Réglages de l'application</h3>
        <div className="mz__frame mz__setting">
          <div>
            <b>Mode Sombre</b>
            <small>Activer le thème sombre</small>
          </div>
          <Switch checked={dark} onChange={setDark} label="Mode Sombre" />
        </div>
        <div className="mz__frame mz__setting">
          <div>
            <b>Notifications</b>
            <small>Recevoir des alertes</small>
          </div>
          <Switch checked={notifs} onChange={toggleNotifs} label="Notifications" />
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className={`phone__screen mz ${dark ? 'mz--dark' : ''}`}>
        <div className="phone__status">
          <span>9:41</span>
          <span>▮▮▮ ▮</span>
        </div>

        {toast && (
          <div className="mz__notif" role="status">
            <small>BarsboldApp · maintenant</small>
            <b>{toast.title}</b>
            <span>{toast.text}</span>
          </div>
        )}

        <div className="mz__body">{page}</div>

        <nav className="mz__tabbar" aria-label="TabBar">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key && !detail ? 'is-active' : ''}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => {
                setDetail(null);
                setTab(t.key);
              }}
            >
              <span className="mz__tab-icon" style={{ WebkitMaskImage: `url(${IMG(`maui/${t.icon}`)})`, maskImage: `url(${IMG(`maui/${t.icon}`)})` }} />
              {t.title}
            </button>
          ))}
        </nav>

        {gif && (
          <div className="mz__modal" role="dialog" aria-label="Animation">
            <img src={IMG('maui/mongif.gif')} alt="Animation : la Mongolie" />
            <button onClick={() => setGif(false)}>Fermer</button>
          </div>
        )}
        {alert && (
          <div className="mz__modal" role="alertdialog" aria-label="Succès">
            <div className="mz__alert">
              <b>Succès</b>
              <p>L'élément a été ajouté avec succès</p>
              <button onClick={() => setAlert(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   Questionary — php-mariadb-Questionary (PHP MVC, Vue.js, Chart.js)
   ===================================================================== */

const DEMO_PIN = '482913';

// "iut_annuel" template from src/Configurations/Templates_IUT.php
const QUESTIONNAIRE = {
  title: 'Évaluation Annuelle - Licence Pro / BUT',
  description: "Sondage de satisfaction globale sur l'année universitaire écoulée à l'IUT.",
  questions: [
    { id: 'q1', type: 'scale', label: 'Globalement, êtes-vous satisfait de votre année ?', min: 'Pas du tout', max: 'Totalement' },
    {
      id: 'q2',
      type: 'single_choice',
      label: 'Quel aspect de la formation avez-vous le plus apprécié ?',
      options: ['Les cours magistraux', 'Les travaux pratiques (TP)', 'Les projets de groupe', 'Les stages / alternance', 'Autre'],
      openEnded: 'Autre',
    },
    { id: 'q3', type: 'long_text', label: 'Quelles sont vos suggestions pour améliorer le département (locaux, matériels, organisation) ?' },
    { id: 'q4', type: 'scale', label: "Évaluez la qualité de l'accompagnement pédagogique des enseignants.", min: 'Médiocre', max: 'Excellente' },
  ],
};

// Sample answers already "in the database" so the analysis page has something to show.
const SEED = {
  q1: [1, 2, 4, 9, 7],
  q2: [2, 6, 8, 5, 2],
  q3: ['Plus de salles libres pour travailler en groupe.', 'Des prises électriques dans l’amphi.', 'Planning publié plus tôt.'],
  q4: [0, 1, 6, 10, 6],
};

const DASHBOARD = [
  { titre: 'Évaluation Annuelle - Licence Pro / BUT', tags: ['BUT3', '2025-2026'], pin: DEMO_PIN, live: true },
  { titre: "Bilan d'Expérience Professionnelle (Stage/Alternance)", tags: ['BUT2'], pin: '730155' },
  { titre: 'Vie Étudiante', tags: ['BUT1'], pin: '219864' },
  { titre: 'Évaluation de Matière — R5.03', tags: ['BUT3'], pin: '904417' },
];

function Bars({ labels, counts }) {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <ul className="qy__bars">
      {labels.map((l, i) => (
        <li key={l}>
          <span className="qy__bar-label">{l}</span>
          <span className="qy__bar-track">
            <span className="qy__bar-fill" style={{ width: `${(counts[i] / total) * 100}%` }} />
          </span>
          <span className="qy__bar-value">
            {counts[i]} · {Math.round((counts[i] / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export function QuestionaryDemo() {
  const [page, setPage] = useState('home');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [answers, setAnswers] = useState({ q1: 3, q4: 3 });
  const [autre, setAutre] = useState('');
  const [modal, setModal] = useState(false);
  const [results, setResults] = useState(SEED);
  const scrollRef = useRef(null);

  const go = (p) => {
    setPage(p);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const valider = (e) => {
    e.preventDefault();
    if (pin.trim() === DEMO_PIN) {
      setPinError('');
      go('form');
    } else setPinError('Aucun questionnaire ne correspond à ce code.');
  };

  // Stores the answer like the INSERTs of the PHP model, then shows merci.php.
  const confirmer = () => {
    setResults((r) => {
      const next = { ...r, q1: [...r.q1], q2: [...r.q2], q4: [...r.q4], q3: [...r.q3] };
      next.q1[Number(answers.q1) - 1] += 1;
      next.q4[Number(answers.q4) - 1] += 1;
      if (answers.q2 != null) next.q2[answers.q2] += 1;
      if (answers.q3 && answers.q3.trim()) next.q3.unshift(answers.q3.trim());
      return next;
    });
    setModal(false);
    go('merci');
  };

  const total = results.q1.reduce((a, b) => a + b, 0);

  const exportCsv = () => {
    const rows = [['Question', 'Réponse', 'Nombre']];
    QUESTIONNAIRE.questions.forEach((q) => {
      if (q.type === 'scale') results[q.id].forEach((n, i) => rows.push([q.label, String(i + 1), n]));
      else if (q.type === 'single_choice') q.options.forEach((o, i) => rows.push([q.label, o, results[q.id][i]]));
      else results[q.id].forEach((txt) => rows.push([q.label, txt, 1]));
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = 'questionary-reponses.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const url = { home: '?c=home', form: `?c=home&a=valider&pin=${DEMO_PIN}`, merci: '?c=merci', dash: '?c=tableauDeBord', analyse: '?c=analyse&id=12' }[page];

  let body;
  if (page === 'home') {
    body = (
      <main className="qy__center">
        <div className="qy__grid">
          <section className="qy__card" aria-label="Accéder à un questionnaire">
            <form onSubmit={valider}>
              <div className="qy__input-wrap">
                <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" placeholder="Code pin" aria-label="Code pin" />
                {pin && (
                  <button type="button" className="qy__clear" onClick={() => setPin('')} aria-label="Effacer le code">
                    ✕
                  </button>
                )}
              </div>
              {pinError && <p className="qy__error">{pinError}</p>}
              <button className="qy__btn" type="submit">
                Valider
              </button>
            </form>
            <p className="qy__demo-hint">
              Démo : code <button onClick={() => setPin(DEMO_PIN)}>{DEMO_PIN}</button>
            </p>
          </section>
          <section className="qy__description">
            <h1>La puissance pour créer. La simplicité pour répondre.</h1>
            <p>
              QUESTIONARY est conçue pour optimiser l'ensemble du processus. Un constructeur de formulaires avancé permet de bâtir des enquêtes complexes rapidement,
              tandis que l'interface de réponse, épurée et réactive, assure une expérience utilisateur intuitive sur tous les appareils.
            </p>
          </section>
        </div>
        <footer className="qy__footer">Conditions générales | Confidentialité | Utilisation des cookies</footer>
      </main>
    );
  } else if (page === 'form') {
    body = (
      <main className="qy__qcm">
        <h1>{QUESTIONNAIRE.title}</h1>
        <p className="qy__muted">{QUESTIONNAIRE.description}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModal(true);
          }}
        >
          {QUESTIONNAIRE.questions.map((q, index) => (
            <fieldset key={q.id} className="qy__question">
              <legend>
                <span>{index + 1}.</span> {q.label}
              </legend>
              {q.type === 'scale' && (
                <div className="qy__scale">
                  <input type="range" min="1" max="5" step="1" value={answers[q.id]} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} aria-label={q.label} />
                  <div className="qy__scale-nums">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={Number(answers[q.id]) === n ? 'is-on' : ''}>
                        {n}
                      </span>
                    ))}
                  </div>
                  <div className="qy__scale-labels">
                    <span>{q.min}</span>
                    <span>{q.max}</span>
                  </div>
                </div>
              )}
              {q.type === 'single_choice' &&
                q.options.map((o, i) => (
                  <div key={o}>
                    <label className={`qy__option ${answers[q.id] === i ? 'is-selected' : ''}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === i} onChange={() => setAnswers({ ...answers, [q.id]: i })} />
                      <span>{o}</span>
                    </label>
                    {o === q.openEnded && answers[q.id] === i && (
                      <input className="qy__text qy__text--indent" value={autre} onChange={(e) => setAutre(e.target.value)} placeholder="Veuillez préciser..." aria-label="Veuillez préciser" />
                    )}
                  </div>
                ))}
              {q.type === 'long_text' && (
                <textarea className="qy__text" rows={3} value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} placeholder="Votre réponse..." aria-label={q.label} />
              )}
            </fieldset>
          ))}
          <button type="submit" className="qy__btn qy__btn--red">
            Envoyer mes réponses ➤
          </button>
        </form>
        {modal && (
          <div className="qy__overlay">
            <div className="qy__modal" role="dialog" aria-labelledby="qy-confirm">
              <h3 id="qy-confirm">Confirmer l'envoi</h3>
              <p>
                Êtes-vous sûr de vouloir envoyer vos réponses ?<br />
                Cette action est définitive.
              </p>
              <div>
                <button className="qy__btn-cancel" onClick={() => setModal(false)}>
                  Annuler
                </button>
                <button className="qy__btn-confirm" onClick={confirmer}>
                  Oui, envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  } else if (page === 'merci') {
    body = (
      <main className="qy__center">
        <div className="qy__card qy__merci">
          <div className="qy__check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1>Merci !</h1>
          <p>
            Vos réponses ont bien été enregistrées.
            <br />
            Merci d'avoir pris le temps de compléter ce questionnaire.
          </p>
          <button className="qy__btn" onClick={() => go('home')}>
            Retour à l'accueil
          </button>
          <button className="qy__link" onClick={() => go('analyse')}>
            Voir côté enseignant : analyse des résultats →
          </button>
        </div>
      </main>
    );
  } else if (page === 'dash') {
    body = (
      <main className="qy__dash">
        <div className="qy__create-row">
          <div className="qy__create">
            <span>+</span>Créer un questionnaire
          </div>
          <div className="qy__create">
            <span>⎘</span>Choisir un modèle IUT
          </div>
          <div className="qy__create">
            <span>⇩</span>Importer un questionnaire
          </div>
        </div>
        <h2>Vos Questionnaires</h2>
        <div className="qy__qgrid">
          {DASHBOARD.map((q) => (
            <button key={q.pin} className="qy__qcard" onClick={() => q.live && go('analyse')} disabled={!q.live} title={q.live ? 'Voir l’analyse' : 'Exemple non interactif'}>
              <b>{q.titre}</b>
              <span className="qy__tags">
                {q.tags.map((t) => (
                  <em key={t}>{t}</em>
                ))}
              </span>
              <span className="qy__qcard-foot">
                <span>PIN {q.pin}</span>
                <span>{q.live ? `${total} réponses` : '—'}</span>
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  } else {
    body = (
      <main className="qy__analyse">
        <div className="qy__analyse-head">
          <div>
            <h1>Analyse des résultats</h1>
            <p className="qy__muted">
              {QUESTIONNAIRE.title} · <b>{total}</b> réponses collectées
            </p>
          </div>
          <button className="qy__export" onClick={exportCsv}>
            ⇩ Exporter les réponses
          </button>
        </div>
        {QUESTIONNAIRE.questions.map((q, i) => (
          <section key={q.id} className="qy__question">
            <h3>
              <span>{i + 1}.</span> {q.label}
            </h3>
            {q.type === 'scale' && <Bars labels={['1', '2', '3', '4', '5']} counts={results[q.id]} />}
            {q.type === 'single_choice' && <Bars labels={q.options} counts={results[q.id]} />}
            {q.type === 'long_text' && (
              <ul className="qy__texts">
                {results[q.id].slice(0, 4).map((t, k) => (
                  <li key={k}>« {t} »</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>
    );
  }

  return (
    <div className="browser">
      <div className="browser__bar">
        <span className="browser__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url">localhost/questionary/index.php{url}</span>
      </div>
      <div className="qy" ref={scrollRef}>
        <header className="qy__topbar">
          <button className="qy__logo" onClick={() => go('home')}>
            <span className="qy__appicon" style={{ WebkitMaskImage: `url(${IMG('questionary/appicon.png')})`, maskImage: `url(${IMG('questionary/appicon.png')})` }} />
            QUESTIONARY
          </button>
          <nav className="qy__nav">
            <button className={page === 'dash' || page === 'analyse' ? 'is-active' : ''} onClick={() => go('dash')}>
              Mon espace
            </button>
            <span className="qy__uni">
              <img src={IMG('questionary/unicon.png')} alt="" />
              <span>Université de Limoges</span>
            </span>
          </nav>
        </header>
        {body}
      </div>
    </div>
  );
}
