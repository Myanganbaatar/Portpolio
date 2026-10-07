import { Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { RobotSlot } from '../components/ui';
import './pages.css';

export default function NotFound() {
  const { u } = useSite();
  usePageTitle('404');
  return (
    <section className="container not-found reveal">
      <RobotSlot mode="lost" className="robot-slot--lost" />
      <p className="not-found__code">404</p>
      <p className="page-lead">{u.notFound}</p>
      <Link to="/" className="btn btn--primary">
        {u.backHome}
      </Link>
    </section>
  );
}
