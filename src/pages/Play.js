import { Link, Navigate, useParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { projects } from '../content';
import LaticeGame from '../components/LaticeGame';
import PythonGames from '../components/PythonGames';
import { RobotSlot } from '../components/ui';
import './pages.css';

const GAMES = { latice: LaticeGame, python: PythonGames };

export default function Play() {
  const { game } = useParams();
  const { u, lang } = useSite();
  const project = projects.find((p) => p.demo === game);
  usePageTitle(project ? `${u.playTitle} — ${project.title[lang]}` : null);

  const Game = GAMES[game];
  if (!Game || !project) return <Navigate to="/projects?filter=demo" replace />;

  return (
    <section className="container play">
      <div className="play__head reveal">
        <Link to={`/projects/${project.id}`} className="text-link text-link--muted">
          ← {project.title[lang]}
        </Link>
        <p className="eyebrow">{u.playTitle}</p>
        <RobotSlot mode="play" className="robot-slot--mini" />
      </div>
      <div className="play__stage reveal reveal-2">
        <Game />
      </div>
    </section>
  );
}
