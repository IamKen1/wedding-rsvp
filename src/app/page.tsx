import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Entourage from './components/Entourage';
import RSVP from './components/RSVP';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <div id="top">
        <Header />
      </div>
      <Hero />
      <div id="schedule">
        <Schedule />
      </div>
      <div id="entourage">
        <Entourage />
      </div>
      <div id="rsvp">
        <RSVP />
      </div>
      <Footer />
    </main>
  );
}
