import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import RSVP from './components/RSVP';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Schedule />
      <RSVP />
      <Footer />
    </main>
  );
}
