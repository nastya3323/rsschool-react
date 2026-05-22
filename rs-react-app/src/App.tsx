import { type JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import CardDetails from './components/Card/CardDetails';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route index element={<CardDetails />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
