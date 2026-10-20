import { useEffect, useState } from 'react';
import { useSite } from '../context';
import './ProjectDemos.css';

// Small web re-creations of university projects whose originals (Kotlin, C#)
// cannot run in a browser. They mimic the behaviour, not the original code.

/* ---------- Android task manager (Kotlin) ---------- */

const PHOTOS = ['🏔️', '🐎', '📚', '🛒', '🏋️', '🎧'];

export function TaskAppDemo() {
  const { lang } = useSite();
  const fr = lang === 'fr';
  const [tasks, setTasks] = useState(() => [
    { id: 1, title: fr ? 'Réviser le cours de Kotlin' : 'Review the Kotlin course', done: false, photo: '📚' },
    { id: 2, title: fr ? 'Faire les courses' : 'Go grocery shopping', done: true, photo: '🛒' },
    { id: 3, title: fr ? 'Séance de sport' : 'Workout session', done: false, photo: null },
  ]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const visible = tasks.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()));

  const save = (e) => {
    e.preventDefault();
    const title = editing.title.trim();
    if (!title) return;
    setTasks((ts) =>
      editing.id ? ts.map((t) => (t.id === editing.id ? { ...t, title, photo: editing.photo } : t)) : [...ts, { id: Date.now(), title, done: false, photo: editing.photo }]
    );
    setEditing(null);
  };

  const remove = () => {
    setTasks((ts) => ts.filter((t) => t.id !== editing.id));
    setEditing(null);
  };

  return (
    <div className="phone">
      <div className="phone__screen">
        <div className="phone__status">
          <span>9:41</span>
          <span>▮▮▮ 🔋</span>
        </div>
        <header className="droid__bar">{fr ? 'Mes tâches' : 'My tasks'}</header>
        <div className="droid__search">
          <span aria-hidden="true">🔍</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={fr ? 'Rechercher une tâche' : 'Search tasks'} aria-label={fr ? 'Rechercher' : 'Search'} />
        </div>
        <ul className="droid__list">
          {visible.map((t) => (
            <li key={t.id} className={`droid__task ${t.done ? 'is-done' : ''}`}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                aria-label={t.title}
              />
              <button className="droid__task-body" onClick={() => setEditing({ ...t })}>
                <span className="droid__task-title">{t.title}</span>
                <span className="droid__task-hint">{fr ? 'Toucher pour modifier' : 'Tap to edit'}</span>
              </button>
              {t.photo && (
                <span className="droid__thumb" aria-hidden="true">
                  {t.photo}
                </span>
              )}
            </li>
          ))}
          {visible.length === 0 && <li className="droid__empty">{fr ? 'Aucune tâche trouvée' : 'No task found'}</li>}
        </ul>
        <button className="droid__fab" onClick={() => setEditing({ id: null, title: '', photo: null })} aria-label={fr ? 'Ajouter une tâche' : 'Add a task'}>
          +
        </button>

        {editing && (
          <form className="droid__sheet" onSubmit={save}>
            <h4>{editing.id ? (fr ? 'Modifier la tâche' : 'Edit task') : fr ? 'Nouvelle tâche' : 'New task'}</h4>
            <input autoFocus value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder={fr ? 'Titre de la tâche' : 'Task title'} aria-label={fr ? 'Titre' : 'Title'} />
            <p className="droid__label">{fr ? 'Photo (galerie)' : 'Photo (gallery)'}</p>
            <div className="droid__photos">
              {PHOTOS.map((ph) => (
                <button type="button" key={ph} className={editing.photo === ph ? 'is-picked' : ''} onClick={() => setEditing({ ...editing, photo: editing.photo === ph ? null : ph })}>
                  {ph}
                </button>
              ))}
            </div>
            <div className="droid__actions">
              {editing.id && (
                <button type="button" className="droid__text-btn droid__text-btn--danger" onClick={remove}>
                  {fr ? 'Supprimer' : 'Delete'}
                </button>
              )}
              <button type="button" className="droid__text-btn" onClick={() => setEditing(null)}>
                {fr ? 'Annuler' : 'Cancel'}
              </button>
              <button type="submit" className="droid__text-btn droid__text-btn--primary">
                {fr ? 'Enregistrer' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- .NET MAUI: one app, several platforms, MVVM + local notifications ---------- */

const PLATFORMS = ['Android', 'iOS', 'Windows'];

export function MauiDemo() {
  const { lang } = useSite();
  const fr = lang === 'fr';
  const [platform, setPlatform] = useState('Android');
  const [text, setText] = useState(fr ? 'Rendre le rapport de stage' : 'Hand in the internship report');
  const [delay, setDelay] = useState(5);
  const [pending, setPending] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (pending.length === 0) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [pending.length]);

  useEffect(() => {
    const due = pending.filter((r) => r.at <= now);
    if (due.length === 0) return;
    setPending((p) => p.filter((r) => r.at > now));
    setToasts((t) => [...t, ...due]);
    due.forEach((r) => setTimeout(() => setToasts((t) => t.filter((x) => x.id !== r.id)), 5000));
  }, [now, pending]);

  const canSchedule = text.trim().length > 0;

  const schedule = (e) => {
    e.preventDefault();
    if (!canSchedule) return;
    const t = Date.now();
    setPending((p) => [...p, { id: t, text: text.trim(), at: t + delay * 1000 }]);
    setNow(t);
  };

  const viewModel = {
    Platform: platform,
    ReminderText: text,
    DelaySeconds: delay,
    PendingCount: pending.length,
    CanSchedule: canSchedule,
  };

  return (
    <div className="maui">
      <div className="maui__left">
        <div className="maui__switch" role="group" aria-label="Platform">
          {PLATFORMS.map((p) => (
            <button key={p} className={`maui__pf ${platform === p ? 'is-active' : ''}`} onClick={() => setPlatform(p)} aria-pressed={platform === p}>
              {p}
            </button>
          ))}
        </div>

        <div className={`maui__device maui__device--${platform.toLowerCase()}`}>
          {platform === 'Windows' ? (
            <div className="maui__titlebar">
              <span>Reminders</span>
              <span>— ☐ ✕</span>
            </div>
          ) : (
            <div className="maui__notch" />
          )}

          <div className="maui__toasts" aria-live="polite">
            {toasts.map((t) => (
              <div key={t.id} className="maui__toast">
                <strong>🔔 Reminders</strong>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          <form className="maui__view" onSubmit={schedule}>
            <h4>{fr ? 'Rappels' : 'Reminders'}</h4>
            <label>
              {fr ? 'Texte du rappel' : 'Reminder text'}
              <input value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <label>
              {fr ? 'Dans' : 'In'}
              <select value={delay} onChange={(e) => setDelay(Number(e.target.value))}>
                {[3, 5, 10].map((s) => (
                  <option key={s} value={s}>
                    {s} s
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="maui__cta" disabled={!canSchedule}>
              {fr ? 'Planifier la notification' : 'Schedule notification'}
            </button>
            <ul className="maui__pending">
              {pending.map((r) => (
                <li key={r.id}>
                  ⏱ {r.text} · {Math.max(0, Math.ceil((r.at - now) / 1000))} s
                </li>
              ))}
            </ul>
          </form>
        </div>
      </div>

      <aside className="maui__vm">
        <p className="maui__vm-title">ReminderViewModel</p>
        <pre>{JSON.stringify(viewModel, null, 2)}</pre>
        <p className="maui__vm-note">
          {fr
            ? 'La vue est liée (data binding) au ViewModel : modifiez un champ, l’état se met à jour. Le même code tourne sur les trois plateformes.'
            : 'The view is data-bound to the ViewModel: edit a field and the state updates. The same code runs on all three platforms.'}
        </p>
      </aside>
    </div>
  );
}
