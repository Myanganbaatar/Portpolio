import { HashRouter, Route, Routes } from 'react-router-dom';
import { SiteProvider } from './context';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Play from './pages/Play';
import NotFound from './pages/NotFound';

// HashRouter keeps deep links working on GitHub Pages (no server-side rewrites).
export default function App() {
  return (
    <SiteProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="experience" element={<Experience />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="skills" element={<Skills />} />
            <Route path="contact" element={<Contact />} />
            <Route path="play/:game" element={<Play />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </SiteProvider>
  );
}
