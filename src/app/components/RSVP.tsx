"use client";

export default function RSVP() {
  return (
    <div className="py-20 bg-white relative z-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-5xl font-script text-primary mb-4">Will You Join Us?</h3>
          <p className="text-gray-600">We would be honored to have you celebrate with us</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full h-[800px] overflow-hidden">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdSm-semlyFsZnUpKwApKadrEdvskNWRsxBSSake0dmDUCszA/viewform?embedded=true&usp=pp_url&theme=light"
              className="absolute top-0 left-0 w-full h-full border-0 scale-[0.98]"
              loading="lazy"
              style={{
                minHeight: '800px',
                backgroundColor: 'transparent'
              }}
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

