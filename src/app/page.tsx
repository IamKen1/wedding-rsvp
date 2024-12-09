import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Entourage from './components/Entourage';
import RSVP from './components/RSVP';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main className="relative bg-white">
      <Navigation />
      <div id="top">
        <Header />
      </div>
      <Hero />
      <div id="schedule" className="relative z-10">
        <Schedule />
      </div>
      <div id="entourage" className="relative z-10">
        <Entourage />
      </div>
      <div id="rsvp" className="relative z-10">
        <RSVP />
      </div>
      <Footer />
    </main>
  );
}
