import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context';
import './NetflixDemo.css';

// Web re-creation of the "Netflix" university project: a movie rental platform
// (React front end + Express/MongoDB API). Same catalogue as data/movies.json in
// the original repo, with posters replaced by genre colours; the API is simulated.

const MOVIES = [
  { id: 1, title: 'Inception', genre: 'Science-Fiction', year: 2010, duration: 148, price: 3.99, rating: 8.8 },
  { id: 2, title: 'The Dark Knight', genre: 'Action', year: 2008, duration: 152, price: 3.99, rating: 9.0 },
  { id: 3, title: 'Interstellar', genre: 'Science-Fiction', year: 2014, duration: 169, price: 4.99, rating: 8.6 },
  { id: 4, title: 'Pulp Fiction', genre: 'Thriller', year: 1994, duration: 154, price: 3.99, rating: 8.9 },
  { id: 5, title: 'Forrest Gump', genre: 'Drame', year: 1994, duration: 142, price: 3.99, rating: 8.8 },
  { id: 6, title: 'Dune', genre: 'Science-Fiction', year: 2021, duration: 155, price: 5.99, rating: 7.9 },
  { id: 9, title: 'Avengers', genre: 'Action', year: 2012, duration: 143, price: 3.99, rating: 7.7 },
  { id: 10, title: 'Parasite', genre: 'Thriller', year: 2019, duration: 132, price: 3.99, rating: 8.5 },
];

// Badge colours from MovieCard.jsx in the original front end.
const GENRE_COLORS = { Action: '#ef4444', 'Science-Fiction': '#a855f7', Thriller: '#6b7280', Drame: '#3b82f6' };
const DAY = 24 * 60 * 60 * 1000;
const RENTAL_DAYS = 7;
const euro = (n) => `${n.toFixed(2)}€`;
const baseLikes = (id) => 90 + id * 37;

function countdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 86400)}j ${Math.floor((s / 3600) % 24)}h ${Math.floor((s / 60) % 60)}m ${s % 60}s`;
}

export default function NetflixDemo() {
  const { lang } = useSite();
  const fr = lang === 'fr';
  const [screen, setScreen] = useState('home');
  const [genre, setGenre] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(null);
  const [likes, setLikes] = useState({});
  const [notice, setNotice] = useState(null);
  const [offset, setOffset] = useState(0);
  const [tick, setTick] = useState(Date.now());
  const [logs, setLogs] = useState([{ id: 0, method: 'GET', path: '/api/movies', status: 200 }]);
  const nextId = useRef(1);

  const now = tick + offset;

  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const log = (method, path, status) => setLogs((l) => [{ id: nextId.current++, method, path, status }, ...l].slice(0, 8));

  const genres = [...new Set(MOVIES.map((m) => m.genre))];
  const q = search.trim().toLowerCase();
  const visible = MOVIES.filter((m) => (genre === 'all' || m.genre === genre) && (!q || m.title.toLowerCase().includes(q)));
  const hero = MOVIES[0];

  const statusOf = (r) => (r.status === 'cancelled' ? 'cancelled' : r.expiresAt > now ? 'active' : 'expired');
  const activeFor = (movieId) => rentals.find((r) => r.movieId === movieId && statusOf(r) === 'active');
  const active = rentals.filter((r) => statusOf(r) === 'active');
  const expired = rentals.filter((r) => statusOf(r) === 'expired');

  const pickGenre = (g) => {
    setGenre(g);
    log('GET', g === 'all' ? '/api/movies' : `/api/movies?genre=${encodeURIComponent(g)}`, 200);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (q) log('GET', `/api/movies?search=${encodeURIComponent(search.trim())}`, 200);
  };

  // POST /api/rentals — same rule as rental.controller.js: no second active rental of a movie.
  const createRental = (movie) => {
    if (activeFor(movie.id)) {
      log('POST', '/api/rentals', 400);
      return false;
    }
    log('POST', '/api/rentals', 201);
    setRentals((rs) => [...rs, { id: nextId.current++, movieId: movie.id, price: movie.price, expiresAt: now + RENTAL_DAYS * DAY, status: 'active' }]);
    return true;
  };

  const rentMovie = (movie) => {
    if (createRental(movie)) setNotice({ ok: true, text: fr ? `${movie.title} loué pour 7 jours` : `${movie.title} rented for 7 days` });
    else setNotice({ ok: false, text: fr ? 'Vous avez déjà une location en cours pour ce film' : 'You already have an active rental for this movie' });
  };

  const rentCart = () => {
    const ok = cart.filter((id) => createRental(MOVIES.find((m) => m.id === id))).length;
    setCart([]);
    log('GET', '/api/rentals/my-rentals', 200);
    setScreen('rentals');
    setNotice({ ok: true, text: fr ? `${ok} film(s) loué(s) avec succès !` : `${ok} movie(s) rented successfully!` });
  };

  // Renting needs an account, like ProtectedRoute and the Cart page of the original front end.
  const requireUser = (action) => {
    if (user) {
      if (action.back) setScreen(action.back);
      action.run();
      return;
    }
    setPending(action);
    setScreen('login');
  };

  const login = () => {
    log('POST', '/api/auth/login', 200);
    setUser({ name: 'Barsbold' });
    setScreen(pending?.back || 'home');
    if (pending) pending.run();
    setPending(null);
  };

  const addToCart = (movie) => {
    if (cart.includes(movie.id) || activeFor(movie.id)) return;
    setCart((c) => [...c, movie.id]);
    setNotice({ ok: true, text: fr ? `${movie.title} ajouté au panier` : `${movie.title} added to cart` });
  };

  const toggleLike = (id) =>
    setLikes((l) => {
      const cur = l[id] || { n: baseLikes(id), liked: false };
      return { ...l, [id]: { n: cur.n + (cur.liked ? -1 : 1), liked: !cur.liked } };
    });

  const cancelRental = (r) => {
    log('DELETE', `/api/rentals/${r.id}`, 200);
    setRentals((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: 'cancelled' } : x)));
  };

  const skipWeek = () => {
    setOffset((o) => o + RENTAL_DAYS * DAY);
    log('GET', '/api/rentals/my-rentals', 200);
  };

  const cartMovies = cart.map((id) => MOVIES.find((m) => m.id === id));
  const total = cartMovies.reduce((s, m) => s + m.price, 0);
  const stats = {
    totalRentals: rentals.length,
    totalRevenue: Number(rentals.reduce((s, r) => s + r.price, 0).toFixed(2)),
    activeRentals: active.length,
    cancelledRentals: rentals.filter((r) => r.status === 'cancelled').length,
  };

  const tint = (m) => ({ '--g': GENRE_COLORS[m.genre] || '#374151' });
  const movieOf = (r) => MOVIES.find((m) => m.id === r.movieId);

  return (
    <div className="nfx">
      <div className="nfx__app">
        <nav className="nfx__nav">
          <button className="nfx__logo" onClick={() => setScreen('home')}>
            NETFLIX
          </button>
          <button className={`nfx__link ${screen === 'home' ? 'is-active' : ''}`} onClick={() => setScreen('home')}>
            {fr ? 'Films' : 'Movies'}
          </button>
          <button
            className={`nfx__link ${screen === 'rentals' ? 'is-active' : ''}`}
            onClick={() => requireUser({ back: 'rentals', run: () => log('GET', '/api/rentals/my-rentals', 200) })}
          >
            {fr ? 'Mes locations' : 'My rentals'}
          </button>
          <span className="nfx__spacer" />
          <button className={`nfx__cart ${screen === 'cart' ? 'is-active' : ''}`} onClick={() => setScreen('cart')} aria-label={fr ? 'Panier' : 'Cart'}>
            🛒{cart.length > 0 && <span className="nfx__badge">{cart.length}</span>}
          </button>
          {user ? (
            <span className="nfx__avatar" title={user.name}>
              B
            </span>
          ) : (
            <button className="nfx__signin" onClick={() => setScreen('login')}>
              {fr ? 'Connexion' : 'Sign in'}
            </button>
          )}
        </nav>

        <div className="nfx__body">
          {notice && <p className={`nfx__notice ${notice.ok ? '' : 'is-err'}`}>{notice.text}</p>}

          {screen === 'home' && (
            <>
              <section className="nfx__hero" style={tint(hero)}>
                <h4>{hero.title}</h4>
                <p className="nfx__meta">
                  <span className="nfx__score">{hero.rating.toFixed(1)}/10</span>
                  <span>{hero.year}</span>
                  <span>{hero.duration} min</span>
                  <span className="nfx__genre-tag">{hero.genre}</span>
                </p>
                <p className="nfx__desc">
                  {fr
                    ? 'Un voleur qui s’infiltre dans les rêves des gens pour voler leurs secrets doit accomplir l’inverse : implanter une idée.'
                    : 'A thief who steals secrets by entering people’s dreams must do the opposite: plant an idea.'}
                </p>
                <button className="nfx__btn" onClick={() => requireUser({ run: () => rentMovie(hero) })}>
                  ▶ {fr ? 'Louer pour' : 'Rent for'} {euro(hero.price)}
                </button>
              </section>

              <form className="nfx__tools" onSubmit={submitSearch}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={fr ? 'Rechercher un film… (Entrée)' : 'Search a movie… (Enter)'} aria-label={fr ? 'Rechercher' : 'Search'} />
                <div className="nfx__filters">
                  {['all', ...genres].map((g) => (
                    <button type="button" key={g} className={`nfx__chip ${genre === g ? 'is-active' : ''}`} onClick={() => pickGenre(g)}>
                      {g === 'all' ? (fr ? 'Tous' : 'All') : g}
                    </button>
                  ))}
                </div>
              </form>

              <div className="nfx__grid">
                {visible.map((m) => {
                  const rented = activeFor(m.id);
                  const inCart = cart.includes(m.id);
                  const like = likes[m.id] || { n: baseLikes(m.id), liked: false };
                  return (
                    <article key={m.id} className="nfx__card">
                      <div className="nfx__poster" style={tint(m)}>
                        <span className="nfx__rating">⭐ {m.rating.toFixed(1)}</span>
                        <span className="nfx__poster-title">{m.title}</span>
                        <span className="nfx__genre" style={{ background: GENRE_COLORS[m.genre] }}>
                          {m.genre}
                        </span>
                      </div>
                      <div className="nfx__card-foot">
                        <button className="nfx__btn nfx__btn--sm" disabled={Boolean(rented) || inCart} onClick={() => addToCart(m)}>
                          {rented ? (fr ? '✓ Loué' : '✓ Rented') : inCart ? (fr ? 'Au panier' : 'In cart') : `${fr ? 'Louer' : 'Rent'} ${euro(m.price)}`}
                        </button>
                        <button className={`nfx__like ${like.liked ? 'is-liked' : ''}`} onClick={() => toggleLike(m.id)} aria-pressed={like.liked}>
                          {like.liked ? '❤' : '🤍'} {like.n}
                        </button>
                      </div>
                    </article>
                  );
                })}
                {visible.length === 0 && <p className="nfx__muted">{fr ? 'Aucun film trouvé' : 'No movie found'}</p>}
              </div>
            </>
          )}

          {screen === 'cart' && (
            <section className="nfx__page">
              <h4>{fr ? 'Mon panier' : 'My cart'}</h4>
              {cartMovies.length === 0 ? (
                <div className="nfx__empty-box">
                  <p>{fr ? 'Votre panier est vide' : 'Your cart is empty'}</p>
                  <button className="nfx__btn" onClick={() => setScreen('home')}>
                    {fr ? 'Découvrir les films' : 'Browse movies'}
                  </button>
                </div>
              ) : (
                <div className="nfx__cart-layout">
                  <ul className="nfx__lines">
                    {cartMovies.map((m) => (
                      <li key={m.id}>
                        <span className="nfx__thumb" style={tint(m)} />
                        <span className="nfx__line-info">
                          <strong>{m.title}</strong>
                          <small>
                            {m.year} · {m.genre} · {m.duration}min
                          </small>
                        </span>
                        <span className="nfx__price">{euro(m.price)}</span>
                        <button className="nfx__x" onClick={() => setCart((c) => c.filter((id) => id !== m.id))} aria-label={fr ? 'Retirer' : 'Remove'}>
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="nfx__summary">
                    <p>
                      <span>{fr ? 'Nombre de films' : 'Movies'}</span>
                      <span>{cartMovies.length}</span>
                    </p>
                    <p>
                      <span>{fr ? 'Durée de location' : 'Rental period'}</span>
                      <span>{fr ? '7 jours' : '7 days'}</span>
                    </p>
                    <p className="nfx__total">
                      <span>Total</span>
                      <span>{euro(total)}</span>
                    </p>
                    <button className="nfx__btn" onClick={() => requireUser({ back: 'rentals', run: rentCart })}>
                      {fr ? 'Louer tout' : 'Rent all'} ({cartMovies.length})
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {screen === 'rentals' && (
            <section className="nfx__page">
              <div className="nfx__page-head">
                <h4>{fr ? 'Mes locations' : 'My rentals'}</h4>
                <button className="nfx__ghost" onClick={skipWeek}>
                  ⏩ {fr ? 'Simuler +7 jours' : 'Simulate +7 days'}
                </button>
              </div>
              {active.length === 0 && expired.length === 0 && <p className="nfx__muted">{fr ? 'Aucune location pour le moment' : 'No rentals yet'}</p>}
              {active.length > 0 && <p className="nfx__group nfx__group--ok">{fr ? `Actives (${active.length})` : `Active (${active.length})`}</p>}
              <ul className="nfx__lines">
                {active.map((r) => (
                  <li key={r.id}>
                    <span className="nfx__thumb" style={tint(movieOf(r))} />
                    <span className="nfx__line-info">
                      <strong>{movieOf(r).title}</strong>
                      <span className="nfx__countdown">
                        {fr ? 'Expire dans' : 'Expires in'} {countdown(r.expiresAt - now)}
                      </span>
                    </span>
                    <button className="nfx__ghost" onClick={() => cancelRental(r)}>
                      {fr ? 'Annuler' : 'Cancel'}
                    </button>
                  </li>
                ))}
              </ul>
              {expired.length > 0 && <p className="nfx__group">{fr ? `Expirées (${expired.length})` : `Expired (${expired.length})`}</p>}
              <ul className="nfx__lines is-expired">
                {expired.map((r) => (
                  <li key={r.id}>
                    <span className="nfx__thumb" style={tint(movieOf(r))} />
                    <span className="nfx__line-info">
                      <strong>{movieOf(r).title}</strong>
                      <span className="nfx__expired">{fr ? 'Expiré' : 'Expired'}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {screen === 'login' && (
            <section className="nfx__login">
              <h4>{fr ? 'Connexion' : 'Sign in'}</h4>
              <p className="nfx__muted">{fr ? 'Il faut être connecté pour louer un film.' : 'You need to be signed in to rent a movie.'}</p>
              <button className="nfx__btn" onClick={login}>
                {fr ? 'Se connecter avec le compte démo' : 'Sign in with the demo account'}
              </button>
            </section>
          )}
        </div>
      </div>

      <aside className="nfx__server">
        <p className="nfx__server-head">{fr ? 'Back-end · Express + MongoDB' : 'Back end · Express + MongoDB'}</p>
        <ol className="nfx__log">
          {logs.map((l) => (
            <li key={l.id}>
              <span className={`nfx__method nfx__method--${l.method.toLowerCase()}`}>{l.method}</span>
              <span className="nfx__path">{l.path}</span>
              <span className={`nfx__status ${l.status >= 400 ? 'is-err' : ''}`}>{l.status}</span>
            </li>
          ))}
        </ol>
        <p className="nfx__server-head">GET /api/rentals/stats</p>
        <pre className="nfx__stats">{JSON.stringify(stats, null, 2)}</pre>
      </aside>
    </div>
  );
}
