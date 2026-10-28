import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSite } from "../context";
import AUPAIR from "./aupairData";
import "./InternshipDemos.css";

// Web re-creations of the three internship projects (IT Partner). The source code
// is private, so these demos only rebuild the screens and the rules: storage is
// in memory and nothing is sent anywhere.

/* =====================================================================
   Shared in-memory "database" of the headless CMS. The Au Pair demo reads
   the same store, exactly like the real site reads the CMS REST API.
   ===================================================================== */

const now = () => new Date().toISOString();
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Field types of the Content-Type Builder (admin/src/pages/content-types/new.tsx).
const FIELD_TYPES = [
  "string",
  "text",
  "richtext",
  "email",
  "integer",
  "float",
  "boolean",
  "date",
  "datetime",
  "enumeration",
  "json",
  "media",
  "relation",
  "uid",
];

// Collections used by mongolian-aupair.com (lib/api.ts of the site).
const SEED_TYPES = [
  {
    uid: "site-setting",
    name: "Site Setting",
    plural: "site-setting",
    single: true,
    fields: [
      { name: "hero_title", type: "string", required: true },
      { name: "hero_subtitle", type: "string" },
      { name: "hero_description", type: "text" },
      { name: "hero_cta_text", type: "string" },
    ],
  },
  {
    uid: "page",
    name: "Page",
    plural: "pages",
    fields: [
      { name: "title", type: "string", required: true },
      { name: "slug", type: "uid" },
      { name: "nav_label", type: "string" },
      { name: "hero_tagline", type: "text" },
      { name: "cover_image", type: "media" },
      { name: "sort_order", type: "integer" },
      { name: "is_active", type: "boolean" },
    ],
  },
  {
    uid: "program-benefit",
    name: "Program Benefit",
    plural: "program-benefits",
    fields: [
      { name: "title", type: "string", required: true },
      { name: "description", type: "text" },
      { name: "sort_order", type: "integer" },
      { name: "page", type: "relation" },
    ],
  },
  {
    uid: "faq-item",
    name: "FAQ Item",
    plural: "faq-items",
    fields: [
      { name: "question", type: "string", required: true },
      { name: "answer", type: "richtext" },
      { name: "sort_order", type: "integer" },
      { name: "page", type: "relation" },
    ],
  },
  {
    uid: "testimonial",
    name: "Testimonial",
    plural: "testimonials",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "role", type: "string" },
      { name: "content", type: "text" },
      { name: "avatar", type: "media" },
      { name: "is_featured", type: "boolean" },
    ],
  },
];

function seedEntries() {
  let id = 0;
  const entry = (attrs) => {
    const t = now();
    id += 1;
    return {
      id,
      attrs,
      live: attrs,
      createdAt: t,
      updatedAt: t,
      publishedAt: t,
    };
  };
  const site = AUPAIR.site;
  const entries = {
    "site-setting": [
      entry({
        hero_title: site.hero_title,
        hero_subtitle: site.hero_subtitle,
        hero_description: site.hero_description,
        hero_cta_text: site.hero_cta_text,
      }),
    ],
    page: [],
    "program-benefit": [],
    "faq-item": [],
    testimonial: [],
  };
  AUPAIR.programs.forEach((p, i) => {
    entries.page.push(
      entry({
        title: p.title,
        slug: p.slug,
        nav_label: p.nav,
        hero_tagline: "",
        sort_order: i + 1,
        is_active: true,
      }),
    );
    p.benefits.forEach((b, k) =>
      entries["program-benefit"].push(
        entry({
          title: b.title,
          description: b.description,
          sort_order: k + 1,
          page: p.slug,
        }),
      ),
    );
    p.faq.forEach((f, k) =>
      entries["faq-item"].push(
        entry({
          question: f.question,
          answer: f.answer,
          sort_order: k + 1,
          page: p.slug,
        }),
      ),
    );
  });
  return { entries, nextId: id + 1 };
}

function createStore(types, seed) {
  const seeded = seed();
  let state = {
    types,
    entries: seeded.entries,
    nextId: seeded.nextId,
    // what the live preview should show after a publish: { uid, key, slug, question, n }
    focus: { uid: null, key: null, slug: null, question: null, n: 0 },
  };
  const listeners = new Set();
  return {
    get: () => state,
    set: (fn) => {
      state = fn(state);
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

// Content of the CMS demo: a small fictional café website, in French, easy to try.
const CAFE_TYPES = [
  {
    uid: "site-setting",
    name: "Site Setting",
    plural: "site-setting",
    single: true,
    fields: [
      { name: "title", type: "string", required: true },
      { name: "subtitle", type: "string" },
      { name: "opening_hours", type: "string" },
      { name: "button_text", type: "string" },
    ],
  },
  {
    uid: "product",
    name: "Product",
    plural: "products",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "price", type: "float" },
      { name: "description", type: "text" },
    ],
  },
  {
    uid: "faq-item",
    name: "FAQ Item",
    plural: "faq-items",
    fields: [
      { name: "question", type: "string", required: true },
      { name: "answer", type: "richtext" },
    ],
  },
];

function seedCafe() {
  let id = 0;
  const entry = (attrs) => {
    const t = now();
    id += 1;
    return { id, attrs, live: attrs, createdAt: t, updatedAt: t, publishedAt: t };
  };
  return {
    entries: {
      "site-setting": [
        entry({
          title: "Le café du coin, fait maison",
          subtitle: "Pâtisseries du jour et café torréfié à Limoges.",
          opening_hours: "Du mardi au dimanche · 8 h – 18 h",
          button_text: "Voir la carte",
        }),
      ],
      product: [
        entry({ name: "Croissant", price: 1.4, description: "Pur beurre, cuit le matin." }),
        entry({ name: "Café crème", price: 2.8, description: "Avec du lait de la ferme." }),
        entry({ name: "Tarte aux pommes", price: 3.5, description: "Pommes du Limousin." }),
        entry({ name: "Chocolat chaud", price: 3.2, description: "Chocolat noir et chantilly." }),
      ],
      "faq-item": [
        entry({ question: "Peut-on réserver une table ?", answer: "Oui, par téléphone ou directement au comptoir." }),
        entry({ question: "Avez-vous des options sans gluten ?", answer: "Oui, une tarte sans gluten chaque jour." }),
        entry({ question: "Acceptez-vous la carte bancaire ?", answer: "Oui, à partir de 1 €." }),
      ],
    },
    nextId: id + 1,
  };
}

const cms = createStore(CAFE_TYPES, seedCafe);
const useCms = () => useSyncExternalStore(cms.subscribe, cms.get);

// The Au Pair site demo keeps its own data (real texts of the site).
const aupair = createStore(SEED_TYPES, seedEntries);
const useAuPair = () => useSyncExternalStore(aupair.subscribe, aupair.get);

// GET /api/:pluralName — same { data, meta } shape as backend/src/utils/response.ts.
function apiList(state, type, preview) {
  const rows = state.entries[type.uid].filter((e) => preview || e.publishedAt);
  const pick = (e) => (preview ? e.attrs : e.live);
  return {
    data: rows.map((e) => ({
      id: e.id,
      attributes: {
        ...pick(e),
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        publishedAt: e.publishedAt,
      },
    })),
    meta: {
      pagination: { page: 1, pageSize: 25, pageCount: 1, total: rows.length },
    },
  };
}

/* ---------- small lucide-like icons ---------- */
const ICONS = {
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8",
  db: "M12 2C7 2 3 3.3 3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5c0-1.7-4-3-9-3zM3 5c0 1.7 4 3 9 3s9-1.3 9-3M3 12c0 1.7 4 3 9 3s9-1.3 9-3",
  image:
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  plus: "M12 5v14M5 12h14",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  back: "M19 12H5M12 19l-7-7 7-7",
  trash:
    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
};

function Icon({ name, size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

function BrowserFrame({ url, children, className = "" }) {
  return (
    <div className={`browser ${className}`}>
      <div className="browser__bar">
        <span className="browser__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url">{url}</span>
      </div>
      {children}
    </div>
  );
}

/* =====================================================================
   1. Headless CMS — admin panel (Next.js + Tailwind, "Strapi Clone")
   ===================================================================== */

const NAV = [
  {
    label: "Content",
    items: [
      { key: "content-manager", label: "Content Manager", icon: "file" },
      { key: "content-types", label: "Content-Type Builder", icon: "db" },
      { key: "media", label: "Media Library", icon: "image", off: true },
    ],
  },
  {
    label: "Administration",
    items: [
      { key: "users", label: "Team", icon: "users", off: true },
      { key: "roles", label: "Roles & Permissions", icon: "shield", off: true },
      { key: "settings", label: "Settings", icon: "settings", off: true },
      { key: "api-reference", label: "API Reference", icon: "code" },
    ],
  },
];

function FieldInput({ field, value, onChange, pages }) {
  const id = `cms-f-${field.name}`;
  let input;
  switch (field.type) {
    case "text":
    case "richtext":
    case "json":
      input = (
        <textarea
          id={id}
          rows={field.type === "richtext" ? 5 : 3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "integer":
    case "float":
      input = (
        <input
          id={id}
          type="number"
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      );
      break;
    case "boolean":
      input = (
        <div className="cms__bool" role="group" aria-labelledby={`${id}-l`}>
          {[false, true].map((b) => (
            <button
              type="button"
              key={String(b)}
              className={Boolean(value) === b ? "is-on" : ""}
              onClick={() => onChange(b)}
            >
              {b ? "True" : "False"}
            </button>
          ))}
        </div>
      );
      break;
    case "date":
    case "datetime":
      input = (
        <input
          id={id}
          type={field.type === "date" ? "date" : "datetime-local"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "relation":
      input = (
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">— select —</option>
          {pages.map((p) => (
            <option key={p.id} value={p.attrs.slug}>
              {p.attrs.title}
            </option>
          ))}
        </select>
      );
      break;
    case "media":
      input = (
        <p className="cms__muted">Media Library — disabled in this demo</p>
      );
      break;
    default:
      input = (
        <input
          id={id}
          type={field.type === "email" ? "email" : "text"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
  return (
    <div
      className={`cms__field ${["text", "richtext", "json"].includes(field.type) ? "cms__field--wide" : ""}`}
    >
      <label htmlFor={id} id={`${id}-l`}>
        {field.name}
        {field.required && <span className="cms__req"> *</span>}
        <small>{field.type}</small>
      </label>
      {input}
    </div>
  );
}

function EntryEditor({ type, entry, onBack, toast }) {
  const state = useCms();
  const [attrs, setAttrs] = useState(() => (entry ? { ...entry.attrs } : {}));
  const [error, setError] = useState("");
  const editable = type.fields;
  const first = type.fields[0];

  // publish: true = publish the form, false = unpublish, undefined = save the draft
  const save = (publish) => {
    const missing = type.fields.find(
      (f) => f.required && !String(attrs[f.name] ?? "").trim(),
    );
    if (missing) {
      setError(`${missing.name} is required`);
      return;
    }
    setError("");
    const t = now();
    let savedId = entry && entry.id;
    cms.set((s) => {
      const list = s.entries[type.uid];
      let next;
      let nextId = s.nextId;
      if (entry) {
        next = list.map((e) =>
          e.id === entry.id
            ? {
                ...e,
                attrs,
                updatedAt: t,
                publishedAt:
                  publish === undefined ? e.publishedAt : publish ? t : null,
                live:
                  publish === undefined
                    ? e.live
                    : publish
                      ? { ...attrs }
                      : null,
              }
            : e,
        );
      } else {
        savedId = nextId;
        next = [
          ...list,
          {
            id: nextId,
            attrs,
            createdAt: t,
            updatedAt: t,
            publishedAt: publish ? t : null,
            live: publish ? { ...attrs } : null,
          },
        ];
        nextId += 1;
      }
      // tell the live preview where to look
      const focus =
        publish === undefined
          ? s.focus
          : {
              uid: type.uid,
              key: attrs[type.fields[0].name],
              slug: null,
              question: null,
              n: s.focus.n + 1,
            };
      return {
        ...s,
        nextId,
        focus,
        entries: { ...s.entries, [type.uid]: next },
      };
    });
    toast(
      publish === true
        ? "Published"
        : publish === false
          ? "Unpublished"
          : "Saved",
    );
    if (!entry) onBack(savedId);
  };

  const current = entry
    ? state.entries[type.uid].find((e) => e.id === entry.id)
    : null;
  const published = current && current.publishedAt;
  // published, but the form differs from what the site shows
  const modified =
    published && JSON.stringify(attrs) !== JSON.stringify(current.live);

  return (
    <div className="cms__page">
      {!type.single && (
        <button className="cms__back" onClick={() => onBack()}>
          <Icon name="back" size={15} /> Back
        </button>
      )}
      <div className="cms__head">
        <div>
          <h2>
            {entry
              ? attrs[first.name] || `${type.name} #${entry.id}`
              : "Create an entry"}
          </h2>
          <p className="cms__muted">
            {type.name} · API ID <code>{type.uid}</code>
            {entry && (
              <span
                className={`cms__badge ${modified ? "is-mod" : published ? "is-pub" : ""}`}
              >
                {modified ? "Modified" : published ? "Published" : "Draft"}
              </span>
            )}
          </p>
        </div>
        <div className="cms__actions">
          <button
            className="cms__btn cms__btn--ghost"
            onClick={() => save(undefined)}
          >
            Save
          </button>
          {published && !modified ? (
            <button
              className="cms__btn cms__btn--ghost"
              onClick={() => save(false)}
            >
              Unpublish
            </button>
          ) : (
            <button className="cms__btn" onClick={() => save(true)}>
              Publish
            </button>
          )}
        </div>
      </div>
      {error && <p className="cms__error">{error}</p>}
      <div className="cms__card cms__form">
        <p className="cms__section">General Information</p>
        {editable.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={attrs[f.name]}
            pages={state.entries.page || []}
            onChange={(v) => setAttrs((a) => ({ ...a, [f.name]: v }))}
          />
        ))}
      </div>
    </div>
  );
}

function ContentManager({ toast }) {
  const state = useCms();
  const [uid, setUid] = useState("site-setting");
  const [editing, setEditing] = useState(null); // null | 'new' | entry id
  const [query, setQuery] = useState("");
  const type = state.types.find((t) => t.uid === uid) || state.types[0];
  const rows = state.entries[type.uid] || [];
  const first = type.fields[0].name;
  const shown = rows.filter((e) =>
    String(e.attrs[first] ?? "")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  // a single type (Site Setting) has one entry: it opens straight in the editor
  const single = type.single ? rows[0] : null;
  const editor =
    single || editing ? (
      <EntryEditor
        key={`${type.uid}-${single ? single.id : editing}`}
        type={type}
        entry={
          single ||
          (editing === "new" ? null : rows.find((e) => e.id === editing))
        }
        toast={toast}
        onBack={(createdId) => setEditing(createdId || null)}
      />
    ) : null;
  const status = (e) =>
    !e.publishedAt
      ? ["Draft", ""]
      : JSON.stringify(e.attrs) !== JSON.stringify(e.live)
        ? ["Modified", "is-mod"]
        : ["Published", "is-pub"];

  return (
    <div className="cms__split">
      <aside className="cms__types">
        {[
          ["Single Types", state.types.filter((t) => t.single)],
          ["Collection Types", state.types.filter((t) => !t.single)],
        ].map(([title, list]) => (
          <div key={title}>
            <p className="cms__nav-label">{title}</p>
            {list.map((t) => (
              <button
                key={t.uid}
                className={t.uid === type.uid ? "is-active" : ""}
                onClick={() => {
                  setUid(t.uid);
                  setEditing(null);
                }}
              >
                {t.name}
                {!t.single && (
                  <span>{(state.entries[t.uid] || []).length}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </aside>
      {/* narrow CMS (next to the live preview): the types become a dropdown */}
      <label className="cms__type-bar">
        <span>Content type</span>
        <select
          value={type.uid}
          onChange={(e) => {
            setUid(e.target.value);
            setEditing(null);
          }}
        >
          {state.types.map((t) => (
            <option key={t.uid} value={t.uid}>
              {t.name}
              {t.single ? " (single)" : ""}
            </option>
          ))}
        </select>
      </label>
      {editor || (
        <div className="cms__page">
          <div className="cms__head">
            <div>
              <h2>{type.name}</h2>
              <p className="cms__muted">
                {rows.length} entries · <code>GET /api/{type.plural}</code>
              </p>
            </div>
            <button className="cms__btn" onClick={() => setEditing("new")}>
              <Icon name="plus" size={15} /> Create new entry
            </button>
          </div>
          <input
            className="cms__search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search entries"
          />
          <div className="cms__card cms__table-wrap">
            {shown.length === 0 ? (
              <p className="cms__empty">No entries yet</p>
            ) : (
              <table className="cms__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{first}</th>
                    <th>Status</th>
                    <th>Updated at</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((e) => (
                    <tr key={e.id} onClick={() => setEditing(e.id)}>
                      <td className="cms__muted">{e.id}</td>
                      <td className="cms__cell-main">
                        {String(e.attrs[first] ?? "—")}
                      </td>
                      <td>
                        <span className={`cms__badge ${status(e)[1]}`}>
                          {status(e)[0]}
                        </span>
                      </td>
                      <td className="cms__muted">
                        {new Date(e.updatedAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <button
                          className="cms__icon-btn"
                          aria-label="Delete this entry"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            cms.set((s) => ({
                              ...s,
                              entries: {
                                ...s.entries,
                                [type.uid]: s.entries[type.uid].filter(
                                  (x) => x.id !== e.id,
                                ),
                              },
                            }));
                            toast("Deleted");
                          }}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentTypeBuilder({ toast, openApi }) {
  const state = useCms();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [fields, setFields] = useState([
    { name: "title", type: "string", required: true },
  ]);
  const [error, setError] = useState("");

  const uid = slugify(name);
  const plural = uid ? `${uid}s` : "";

  const create = (e) => {
    e.preventDefault();
    const names = fields.map((f) => f.name.trim());
    if (!uid) return setError("Display name is required");
    if (state.types.some((t) => t.uid === uid))
      return setError(`"${uid}" already exists`);
    if (names.some((n) => !/^[a-z][a-z0-9_]*$/.test(n)))
      return setError("Field names: lowercase letters, digits and _ only");
    if (
      names.some((n) =>
        ["id", "createdAt", "updatedAt", "publishedAt", "locale"].includes(n),
      )
    )
      return setError("This field name is reserved");
    if (new Set(names).size !== names.length)
      return setError("Field names must be unique");
    cms.set((s) => ({
      ...s,
      types: [...s.types, { uid, name: name.trim(), plural, fields }],
      entries: { ...s.entries, [uid]: [] },
    }));
    toast(`Collection "${name.trim()}" created — /api/${plural} is ready`);
    setCreating(false);
    setName("");
    setFields([{ name: "title", type: "string", required: true }]);
    setError("");
  };

  if (creating) {
    return (
      <form className="cms__page" onSubmit={create}>
        <button
          type="button"
          className="cms__back"
          onClick={() => setCreating(false)}
        >
          <Icon name="back" size={15} /> Back
        </button>
        <div className="cms__head">
          <div>
            <h2>New Collection Type</h2>
            <p className="cms__muted">
              The REST API is generated automatically.
            </p>
          </div>
          <button className="cms__btn" type="submit">
            Save
          </button>
        </div>
        {error && <p className="cms__error">{error}</p>}
        <div className="cms__card cms__form">
          <div className="cms__field">
            <label htmlFor="cms-ct-name">
              Display name <span className="cms__req">*</span>
            </label>
            <input
              id="cms-ct-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Article, Product…"
              autoFocus
            />
          </div>
          <div className="cms__field">
            <label>API ID</label>
            <p className="cms__api-id">
              {uid ? `api::${uid}.${uid} → /api/${plural}` : "—"}
            </p>
          </div>
        </div>
        <div className="cms__card cms__fields">
          <div className="cms__fields-head">
            <p className="cms__section">Fields</p>
            <button
              type="button"
              className="cms__btn cms__btn--ghost"
              onClick={() =>
                setFields((f) => [
                  ...f,
                  { name: "", type: "string", required: false },
                ])
              }
            >
              <Icon name="plus" size={14} /> Add field
            </button>
          </div>
          {fields.map((f, i) => (
            <div className="cms__field-row" key={i}>
              <input
                aria-label="Field name"
                placeholder="field_name"
                value={f.name}
                onChange={(e) =>
                  setFields((fs) =>
                    fs.map((x, k) =>
                      k === i ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
              <select
                aria-label="Field type"
                value={f.type}
                onChange={(e) =>
                  setFields((fs) =>
                    fs.map((x, k) =>
                      k === i ? { ...x, type: e.target.value } : x,
                    ),
                  )
                }
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <label className="cms__check">
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={(e) =>
                    setFields((fs) =>
                      fs.map((x, k) =>
                        k === i ? { ...x, required: e.target.checked } : x,
                      ),
                    )
                  }
                />
                required
              </label>
              <button
                type="button"
                className="cms__icon-btn"
                aria-label="Remove field"
                disabled={fields.length === 1}
                onClick={() => setFields((fs) => fs.filter((_, k) => k !== i))}
              >
                <Icon name="trash" size={15} />
              </button>
            </div>
          ))}
        </div>
      </form>
    );
  }

  return (
    <div className="cms__page">
      <div className="cms__head">
        <div>
          <h2>Content-Type Builder</h2>
          <p className="cms__muted">
            Build and manage your dynamic collections
          </p>
        </div>
        <button className="cms__btn" onClick={() => setCreating(true)}>
          <Icon name="plus" size={15} /> Create new collection type
        </button>
      </div>
      <div className="cms__grid">
        {state.types.map((t) => (
          <div className="cms__card cms__type" key={t.uid}>
            <div className="cms__type-head">
              <span className="cms__type-icon">
                <Icon name="layers" size={16} />
              </span>
              <div>
                <b>{t.name}</b>
                <small>
                  api::{t.uid} · {t.fields.length} fields
                </small>
              </div>
            </div>
            <div className="cms__chips">
              {t.fields.map((f) => (
                <span key={f.name}>
                  {f.name}
                  <em>{f.type}</em>
                </span>
              ))}
            </div>
            <button className="cms__link" onClick={() => openApi(t.uid)}>
              GET /api/{t.plural} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiReference({ initial }) {
  const state = useCms();
  const [uid, setUid] = useState(initial || "faq-item");
  const [preview, setPreview] = useState(false);
  const type = state.types.find((t) => t.uid === uid) || state.types[0];
  const json = useMemo(
    () => JSON.stringify(apiList(state, type, preview), null, 2),
    [state, type, preview],
  );
  const total = state.entries[type.uid].length;
  const live = state.entries[type.uid].filter((e) => e.publishedAt).length;

  return (
    <div className="cms__page">
      <div className="cms__head">
        <div>
          <h2>API Reference</h2>
          <p className="cms__muted">
            Auto-generated REST endpoints: GET · POST · PUT · DELETE
            /api/:pluralName
          </p>
        </div>
      </div>
      <div className="cms__request">
        <span className="cms__verb">GET</span>
        <select
          value={type.uid}
          onChange={(e) => setUid(e.target.value)}
          aria-label="Collection"
        >
          {state.types.map((t) => (
            <option key={t.uid} value={t.uid}>
              /api/{t.plural}
            </option>
          ))}
        </select>
        <label className="cms__check">
          <input
            type="checkbox"
            checked={preview}
            onChange={(e) => setPreview(e.target.checked)}
          />
          publicationState=preview
        </label>
      </div>
      <p className="cms__muted cms__note">
        {preview
          ? `${total} entries (drafts included)`
          : `${live} published of ${total} — drafts are hidden from the public API`}
      </p>
      <pre className="cms__json">
        <span className="cms__status">200 OK · application/json</span>
        {"\n"}
        {json}
      </pre>
    </div>
  );
}

// A small client website, scaled down next to the CMS: it only shows published data.
const PREVIEW_W = 700;
const euro = (n) =>
  n === null || n === undefined || n === ""
    ? ""
    : `${Number(n).toFixed(2).replace(".", ",")} €`;

function CafeSite() {
  const state = useCms();
  const { focus } = state;
  const scroller = useRef(null);
  const live = (uid) =>
    state.entries[uid].filter((e) => e.publishedAt).map((e) => e.live);
  const site = live("site-setting")[0] || {};
  const products = live("product");
  const faq = live("faq-item");
  const flash = (uid, key) =>
    focus.n > 0 && focus.uid === uid && (key === undefined || focus.key === key)
      ? "cafe__flash"
      : "";

  // scroll to what was just published
  useEffect(() => {
    const el = scroller.current;
    if (!el || !focus.n) return;
    const target = el.querySelector(".cafe__flash");
    el.scrollTop = target && focus.uid !== "site-setting" ? target.offsetTop - 70 : 0;
  }, [focus]);

  return (
    <BrowserFrame url="localhost:3001 · site du client" className="cafe-frame">
      <div className="cafe" ref={scroller}>
        <header className="cafe__nav">
          <b>☕ Café Lumière</b>
          <span>Carte · FAQ · Contact</span>
        </header>
        <section key={`h-${focus.n}`} className={`cafe__hero ${flash("site-setting")}`}>
          <h1>{site.title || "—"}</h1>
          {site.subtitle && <p>{site.subtitle}</p>}
          {site.opening_hours && <p className="cafe__hours">🕗 {site.opening_hours}</p>}
          {site.button_text && <span className="cafe__btn">{site.button_text}</span>}
        </section>
        <section className="cafe__section">
          <h2>Notre carte</h2>
          {products.length === 0 && <p className="cafe__empty">Aucun produit publié.</p>}
          <ul className="cafe__menu">
            {products.map((p) => (
              <li key={`${p.name}-${focus.n}`} className={flash("product", p.name)}>
                <div>
                  <b>{p.name}</b>
                  {p.description && <small>{p.description}</small>}
                </div>
                <span>{euro(p.price)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="cafe__section">
          <h2>Questions fréquentes</h2>
          {faq.length === 0 && <p className="cafe__empty">Aucune question publiée.</p>}
          {faq.map((f) => (
            <details
              key={`${f.question}-${focus.n}`}
              className={`cafe__faq ${flash("faq-item", f.question)}`}
              open={Boolean(flash("faq-item", f.question))}
            >
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </section>
        <footer className="cafe__footer">Café Lumière · site de démonstration</footer>
      </div>
    </BrowserFrame>
  );
}

function SitePreview({ fr }) {
  const box = useRef(null);
  const [k, setK] = useState(0.55);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => setK(el.clientWidth / PREVIEW_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="cms-preview">
      <p className="cms-preview__label">
        <span className="cms-preview__dot" />
        {fr ? "Site du client · données publiées" : "Client website · published data"}
      </p>
      <div className="cms-preview__box" ref={box} style={{ height: 640 * k }}>
        <div
          className="cms-preview__scale"
          style={{ width: PREVIEW_W, transform: `scale(${k})` }}
        >
          <CafeSite />
        </div>
      </div>
    </div>
  );
}

export function CmsDemo() {
  const [page, setPage] = useState("content-manager");
  const [apiType, setApiType] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const toast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  };

  const { lang } = useSite();
  const label = NAV.flatMap((s) => s.items).find((i) => i.key === page).label;

  const fr = lang === "fr";
  return (
    <>

      <div className="cms-split">
        <BrowserFrame url={`localhost:3000/${page}`} className="cms-frame">
          <div className="cms">
            <aside className="cms__sidebar">
              <div className="cms__brand">
                <span>S</span>
                <div>
                  <b>Strapi Clone</b>
                  <small>Workspace · au-pair</small>
                </div>
              </div>
              <nav aria-label="CMS">
                {NAV.map((s) => (
                  <div key={s.label}>
                    <p className="cms__nav-label">{s.label}</p>
                    {s.items
                      .filter((it) => !it.off)
                      .map((it) => (
                        <button
                          key={it.key}
                          className={page === it.key ? "is-active" : ""}
                          disabled={it.off}
                          title={
                            it.off ? "Not included in the demo" : undefined
                          }
                          onClick={() => {
                            setApiType(null);
                            setPage(it.key);
                          }}
                        >
                          <Icon name={it.icon} />{" "}
                          <span className="cms__nav-text">{it.label}</span>
                        </button>
                      ))}
                  </div>
                ))}
              </nav>
              <div className="cms__user">
                <span>BM</span>
                <div>
                  <b>Barsbold M.</b>
                  <small>Super Admin</small>
                </div>
              </div>
            </aside>
            <div className="cms__main">
              <header className="cms__topbar">
                <span className="cms__muted">Strapi Clone /</span> {label}
              </header>
              {page === "content-manager" && <ContentManager toast={toast} />}
              {page === "content-types" && (
                <ContentTypeBuilder
                  toast={toast}
                  openApi={(uid) => {
                    setApiType(uid);
                    setPage("api-reference");
                  }}
                />
              )}
              {page === "api-reference" && (
                <ApiReference key={apiType || "api"} initial={apiType} />
              )}
            </div>
            {toastMsg && (
              <div className="cms__toast" role="status">
                ✓ {toastMsg}
              </div>
            )}
          </div>
        </BrowserFrame>
        <SitePreview fr={fr} />
      </div>
    </>
  );
}

/* =====================================================================
   2. mongolian-aupair.com — Next.js site that reads the CMS
   ===================================================================== */

const CONTACT_PROGRAMS = [
  "Au-pair хөтөлбөр",
  "Оюутны зуны ажил",
  "Ausbildung",
  "FSJ & BFD хөтөлбөр",
  "Гадаадын их дээд сургууль коллеж",
];

function FaqItem({ q, a, flash = false }) {
  const [open, setOpen] = useState(flash);
  return (
    <div
      className={`ap__faq ${open ? "is-open" : ""} ${flash ? "is-flash" : ""}`}
    >
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {q}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <p>{a}</p>}
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    program: "",
    note: "",
  });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("ok"), 700);
  };

  return (
    <section className="ap__contact" id="ap-contact">
      <div>
        <span className="ap__contact-icon" aria-hidden="true">
          ✎
        </span>
        <h3>Бүртгүүлж хөтөлбөрийн талаар дэлгэрэнгүй мэдээлэл аваарай!</h3>
        <p>
          Таны бүртгүүлсэн мэдээллийн дагуу манайхаас холбогдож уулзалтын цаг
          болон сургалтын зуучийн мэдээллийг хүн бүрт өгөх тул өөрийн мэдээллээ
          үнэн зөв бөглөнө үү! Баярлалаа.
        </p>
      </div>
      {status === "ok" ? (
        <p className="ap__ok">
          Таны мэдээлэл амжилттай илгээгдлээ! Бид тантай удахгүй холбогдох
          болно.
        </p>
      ) : (
        <form onSubmit={submit} className="ap__form">
          <label>
            Нэр *<input required value={values.name} onChange={set("name")} />
          </label>
          <label>
            Гар утас *
            <input
              required
              type="tel"
              value={values.phone}
              onChange={set("phone")}
            />
          </label>
          <label>
            Мэйл хаяг *
            <input
              required
              type="email"
              value={values.email}
              onChange={set("email")}
            />
          </label>
          <label>
            Сонирхож буй хөтөлбөр *
            <select required value={values.program} onChange={set("program")}>
              <option value="">Сонгох</option>
              {CONTACT_PROGRAMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="ap__form-wide">
            Бүртгэлтэй холбоотой санал хүсэлт
            <input value={values.note} onChange={set("note")} />
          </label>
          <button
            className="ap__btn ap__form-wide"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Илгээж байна..." : "Илгээх"}
          </button>
          <small className="ap__form-wide ap__demo-note">
            Démo : rien n’est envoyé.
          </small>
        </form>
      )}
    </section>
  );
}

export function AuPairDemo({ follow = false }) {
  const state = useAuPair();
  const [slug, setSlug] = useState(null);
  const [menu, setMenu] = useState(false);
  const scroller = useRef(null);
  // hero texts come from the published Site Setting entry
  const setting = state.entries["site-setting"][0];
  const s = { ...AUPAIR.site, ...((setting && setting.live) || {}) };
  const { focus } = state;

  const live = (uid) =>
    state.entries[uid].filter((e) => e.publishedAt).map((e) => e.live);
  const pages = live("page")
    .filter((p) => p.is_active)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const page = slug && pages.find((p) => p.slug === slug);
  const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const benefits = page
    ? live("program-benefit")
        .filter((b) => b.page === slug)
        .sort(bySort)
    : [];
  const faq = page
    ? live("faq-item")
        .filter((f) => f.page === slug)
        .sort(bySort)
    : [];

  const open = (p) => {
    setSlug(p);
    setMenu(false);
    if (scroller.current) scroller.current.scrollTop = 0;
  };

  // in the preview next to the CMS: jump to what was just published
  useEffect(() => {
    if (!follow || !focus.n) return;
    setSlug(focus.slug);
    setMenu(false);
    const el = scroller.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const target = focus.question && el.querySelector(".ap__faq.is-flash");
      el.scrollTop = target ? target.offsetTop - 80 : 0;
    });
  }, [follow, focus]);

  return (
    <BrowserFrame
      url={`mongolian-aupair.com/${slug || ""}`}
      className="ap-frame"
    >
      <div className={`ap ${follow ? "ap--preview" : ""}`} ref={scroller}>
        <header className="ap__nav">
          <button className="ap__logo" onClick={() => open(null)}>
            Extratour
          </button>
          <nav>
            <div className="ap__menu">
              <button onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
                Зуучлалийн хөтөлбөрүүд <span aria-hidden="true">▾</span>
              </button>
              {menu && (
                <ul>
                  {pages.map((p) => (
                    <li key={p.slug}>
                      <button onClick={() => open(p.slug)}>
                        {p.nav_label || p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="ap__cta"
              onClick={() => {
                const el = document.getElementById("ap-contact");
                if (el) el.scrollIntoView({ block: "start" });
              }}
            >
              Мэдээлэл авах
            </button>
          </nav>
        </header>

        {!page ? (
          <>
            <section className="ap__hero">
              <div>
                <p className="ap__eyebrow">{s.hero_subtitle}</p>
                <h1
                  key={`t-${focus.n}`}
                  className={follow && focus.n ? "ap__flash" : ""}
                >
                  {s.hero_title}
                </h1>
                <p>{s.hero_description}</p>
                <button
                  className="ap__btn"
                  onClick={() =>
                    document
                      .getElementById("ap-contact")
                      ?.scrollIntoView({ block: "start" })
                  }
                >
                  {s.hero_cta_text}
                </button>
              </div>
              <div className="ap__hero-art" aria-hidden="true">
                <span className="ap__flag ap__flag--de" />
                <span className="ap__flag ap__flag--at" />
                <b>{s.experience_years}</b>
                <small>жилийн туршлага</small>
              </div>
            </section>

            <section className="ap__stats">
              <p>{s.stats_label}</p>
              <div>
                {[
                  [s.stat_graduates, "Амжилттай төгсөгчид"],
                  [s.stat_programs, "Мэргэжлийн хөтөлбөр"],
                  [s.stat_success_rate, "Амжилттай төгсөлт"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="ap__section">
              <p className="ap__eyebrow">{s.programs_subtitle}</p>
              <h2>{s.programs_title}</h2>
              <div className="ap__programs">
                {pages.map((p, i) => (
                  <button
                    key={p.slug}
                    className="ap__program"
                    onClick={() => open(p.slug)}
                  >
                    <span
                      className={`ap__program-img ap__program-img--${i % 4}`}
                      aria-hidden="true"
                    >
                      {p.title.split(" ")[0]}
                    </span>
                    <b>{p.title}</b>
                    <span className="ap__more">Дэлгэрэнгүй</span>
                  </button>
                ))}
              </div>
              {pages.length === 0 && (
                <p className="ap__muted">
                  Хөтөлбөр алга — publish a Page in the CMS.
                </p>
              )}
            </section>

            <section className="ap__section ap__section--soft">
              <p className="ap__eyebrow">{s.why_us_subtitle}</p>
              <h2>{s.why_us_title}</h2>
              <div className="ap__benefits">
                {AUPAIR.benefits.map((b) => (
                  <div key={b.title}>
                    <b>{b.title}</b>
                    <p>{b.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="ap__program-hero">
              <button onClick={() => open(null)}>← Нүүр</button>
              <h1>{page.title}</h1>
            </section>
            {benefits.length > 0 && (
              <section className="ap__section">
                <h2>Хөтөлбөрийн давуу талууд</h2>
                <div className="ap__benefits">
                  {benefits.map((b) => (
                    <div key={b.title}>
                      <b>{b.title}</b>
                      <p>{b.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="ap__section ap__section--soft">
              <h2>Түгээмэл асуултууд</h2>
              {faq.length === 0 ? (
                <p className="ap__muted">—</p>
              ) : (
                faq.map((f) => (
                  <FaqItem
                    key={`${f.question}-${focus.n}`}
                    q={f.question}
                    a={f.answer}
                    flash={follow && focus.question === f.question}
                  />
                ))
              )}
            </section>
          </>
        )}

        <ContactForm />
        <footer className="ap__footer">{s.copyright_text}</footer>
      </div>
    </BrowserFrame>
  );
}

/* =====================================================================
   3. correctURL — URL shortener with click analytics (Next.js + PostgreSQL)
   ===================================================================== */

const HOST = "url.easyhub.mn";
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const RESERVED = new Set(["api", "stats", "favicon", "_next"]);

const randomCode = (len = 6) =>
  Array.from(
    { length: len },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");

// Validation of app/api/shorten/route.ts
function validate(url) {
  if (!url.trim()) return "Veuillez saisir une URL";
  try {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url);
    const ok =
      parsed.hostname.includes(".") &&
      /^[a-zA-Z0-9]([a-zA-Z0-9\-.]{0,251}[a-zA-Z0-9])?$/.test(
        parsed.hostname,
      ) &&
      (parsed.protocol === "http:" || parsed.protocol === "https:");
    return ok ? "" : "Format d’URL invalide";
  } catch {
    return "Format d’URL invalide";
  }
}

function detect() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Other";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  return { browser, os };
}

// Example link with sample visits, so the statistics page is not empty.
function seedLinks() {
  const base = Date.now() - 3 * 86400000;
  const sample = [
    ["Chrome", "Android", "Mongolie", "Oulan-Bator"],
    ["Safari", "iOS", "Mongolie", "Oulan-Bator"],
    ["Chrome", "Windows", "Mongolie", "Darkhan"],
    ["Chrome", "Android", "Allemagne", "Berlin"],
    ["Edge", "Windows", "Mongolie", "Oulan-Bator"],
    ["Safari", "iOS", "Autriche", "Vienne"],
    ["Chrome", "Android", "Mongolie", "Erdenet"],
    ["Firefox", "Linux", "France", "Limoges"],
  ];
  return [
    {
      code: "Xk7pQa",
      originalUrl:
        "https://mongolian-aupair.com/au-pair?utm_source=facebook&utm_campaign=2026",
      createdAt: new Date(base).toISOString(),
      visits: sample.map(([browser, os, country, city], i) => ({
        at: new Date(base + (i + 1) * 7200000 * 3).toISOString(),
        browser,
        os,
        country,
        city,
      })),
    },
  ];
}

function BarList({ visits, keyName }) {
  const counts = {};
  visits.forEach((v) => {
    counts[v[keyName]] = (counts[v[keyName]] || 0) + 1;
  });
  const items = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = items.length ? items[0][1] : 1;
  if (!items.length) return <p className="cu__no-data">Aucune donnée</p>;
  return (
    <ul className="cu__bars">
      {items.map(([name, n]) => (
        <li key={name}>
          <span className="cu__bar-name">{name}</span>
          <span className="cu__bar-track">
            <span style={{ width: `${(n / max) * 100}%` }} />
          </span>
          <span className="cu__bar-count">{n}</span>
        </li>
      ))}
    </ul>
  );
}

export function ShortenerDemo() {
  const [page, setPage] = useState("home"); // home | links | stats
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [links, setLinks] = useState(seedLinks);
  const [statsCode, setStatsCode] = useState(null);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);

  const shorten = () => {
    const url = input.trim();
    const err = validate(url);
    setError(err);
    if (err) return;
    setLoading(true);
    setTimeout(() => {
      setLinks((list) => {
        if (list.some((l) => l.originalUrl === url)) return list; // same URL → same code
        const taken = new Set(list.map((l) => l.code));
        let code = randomCode();
        while (RESERVED.has(code) || taken.has(code)) code = randomCode();
        return [
          {
            code,
            originalUrl: url,
            createdAt: new Date().toISOString(),
            visits: [],
          },
          ...list,
        ];
      });
      setLoading(false);
      setInput("");
      setPage("links");
    }, 400);
  };

  // GET /:code logs the visit (browser, OS, geo) then redirects; here we only log it.
  const visit = (code) => {
    const { browser, os } = detect();
    setLinks((list) =>
      list.map((l) =>
        l.code === code
          ? {
              ...l,
              visits: [
                ...l.visits,
                {
                  at: new Date().toISOString(),
                  browser,
                  os,
                  country: "—",
                  city: "—",
                },
              ],
            }
          : l,
      ),
    );
  };

  const copy = (code) => {
    const text = `https://${HOST}/${code}`;
    if (navigator.clipboard)
      navigator.clipboard.writeText(text).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const link = links.find((l) => l.code === statsCode);
  const fmt = (d, o) => new Date(d).toLocaleString("fr-FR", o);
  const urlBar =
    page === "home" ? "" : page === "links" ? "links" : `stats/${statsCode}`;

  return (
    <BrowserFrame url={`${HOST}/${urlBar}`} className="cu-frame">
      <div className="cu">
        <header className="cu__header">
          <h1>Raccourcisseur d’URL</h1>
          {page !== "stats" && (
            <p>Raccourcissez vos longues URL et obtenez un lien propre</p>
          )}
        </header>

        {page === "home" && (
          <div className="cu__card cu__input-card">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && shorten()}
              placeholder="Collez votre longue URL ici…"
              aria-label="URL"
            />
            {error && <p className="cu__err">{error}</p>}
            <div className="cu__btn-row">
              <button
                className="cu__btn cu__btn--primary"
                onClick={shorten}
                disabled={loading}
              >
                {loading ? "Raccourcissement…" : "Raccourcir"}
              </button>
              <button
                className="cu__btn cu__btn--ghost"
                onClick={() => setPage("links")}
              >
                Mes liens →
              </button>
              <button
                className="cu__btn cu__btn--ghost cu__btn--try"
                onClick={() =>
                  setInput(
                    "https://www.iut.unilim.fr/formations/but-informatique/",
                  )
                }
              >
                Exemple
              </button>
            </div>
          </div>
        )}

        {page === "links" && (
          <>
            <div className="cu__center">
              <button
                className="cu__btn cu__btn--primary"
                onClick={() => setPage("home")}
              >
                + Raccourcir une nouvelle URL
              </button>
            </div>
            {links.length === 0 && (
              <div className="cu__card cu__empty">
                Aucun lien. Cliquez sur « + Raccourcir une nouvelle URL » pour commencer.
              </div>
            )}
            {links.map((l) => (
              <div className="cu__card cu__link" key={l.code}>
                <div className="cu__link-top">
                  <span className="cu__badge">Lien court</span>
                  <span className="cu__visits">
                    {l.visits.length} visites
                  </span>
                </div>
                <button
                  className="cu__short"
                  onClick={() => visit(l.code)}
                  title="Ouvrir (simulé : la visite est enregistrée)"
                >
                  https://{HOST}/{l.code}
                </button>
                <p className="cu__orig">{l.originalUrl}</p>
                <div className="cu__btn-row">
                  <button
                    className="cu__btn cu__btn--primary"
                    onClick={() => visit(l.code)}
                  >
                    Ouvrir →
                  </button>
                  <button
                    className={`cu__copy ${copied === l.code ? "is-copied" : ""}`}
                    onClick={() => copy(l.code)}
                  >
                    {copied === l.code ? "✓ Copié" : "Copier"}
                  </button>
                  <button
                    className="cu__btn cu__btn--ghost"
                    onClick={() => {
                      setStatsCode(l.code);
                      setPage("stats");
                    }}
                  >
                    Statistiques
                  </button>
                  <button
                    className="cu__delete"
                    aria-label="Delete"
                    onClick={() =>
                      setLinks((list) => list.filter((x) => x.code !== l.code))
                    }
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {page === "stats" && link && (
          <>
            <div className="cu__card">
              <span className="cu__badge cu__badge--purple">Statistiques</span>
              <p className="cu__stats-short">
                https://{HOST}/{link.code}
              </p>
              <p className="cu__orig">{link.originalUrl}</p>
              <p className="cu__meta">
                Créé le :{" "}
                {fmt(link.createdAt, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="cu__stat-grid">
              {[
                ["Visites totales", link.visits.length],
                [
                  "Visiteurs uniques",
                  new Set(link.visits.map((v) => v.browser + v.os + v.city))
                    .size,
                ],
                [
                  "Dernière visite",
                  link.visits.length
                    ? fmt(link.visits[link.visits.length - 1].at, {
                        month: "short",
                        day: "numeric",
                      })
                    : "—",
                ],
              ].map(([l, v]) => (
                <div className="cu__card cu__stat" key={l}>
                  <b>{v}</b>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <div className="cu__charts">
              {[
                ["Pays", "country"],
                ["Navigateur", "browser"],
                ["Système", "os"],
              ].map(([t, k]) => (
                <div className="cu__card" key={k}>
                  <h2>{t}</h2>
                  <BarList visits={link.visits} keyName={k} />
                </div>
              ))}
            </div>
            {link.visits.length > 0 && (
              <div className="cu__card">
                <h2>Dernières visites</h2>
                <div className="cu__table-wrap">
                  <table className="cu__table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Navigateur</th>
                        <th>Système</th>
                        <th>Pays</th>
                        <th>Ville</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...link.visits]
                        .reverse()
                        .slice(0, 6)
                        .map((v, i) => (
                          <tr key={i}>
                            <td>
                              {fmt(v.at, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td>{v.browser}</td>
                            <td>{v.os}</td>
                            <td>{v.country}</td>
                            <td>{v.city}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="cu__center">
              <button className="cu__back" onClick={() => setPage("links")}>
                ← Retour
              </button>
            </div>
          </>
        )}
      </div>
    </BrowserFrame>
  );
}
