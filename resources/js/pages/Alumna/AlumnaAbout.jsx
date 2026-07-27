import AlumnaLayout from "@/layouts/alumna-layout";
import cectBuilding from "@/assets/cect_building.jpg";
import graduationBg from "@/assets/grad_pic.jpg";
import {Heart, Handshake, Trophy, Scale, Sparkles } from 'lucide-react';

/* ── icon helpers ─────────────────────────────────────────── */
const IconPeople = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);
const IconChart = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 10"/>
  </svg>
);
const IconHandshake = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l3-3 2 2 4-4m-1 9H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3"/>
  </svg>
);
const IconTarget = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
  </svg>
);
const IconEye = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);
const IconGrad = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.25a12.083 12.083 0 01-9 0 12.083 12.083 0 01-9-3.194 12.083 12.083 0 012.84-2.578L12 14z"/>
  </svg>
);

/* ── purpose cards ────────────────────────────────────────── */
const purposes = [
  { Icon: IconPeople,   title: "Connect Alumni",         desc: "Maintain a lifelong connection between the college and its alumni community." },
  { Icon: IconChart,    title: "Track Career Growth",    desc: "Gather relevant data on graduates' employment and industry experience." },
  { Icon: IconHandshake,title: "Alumni Engagement",      desc: "Provide a platform for alumni involvement, events, and opportunities to collaborate with the institution." },
];

/* ── core values ──────────────────────────────────────────── */
const coreValues = [
  { emoji: <Heart/>,  en: "COMPASSION",    fil: "Malasakit",     desc: "We express profound empathy through selfless acts of service to alleviate suffering, promote understanding, and cultivate kindness in our interactions with living beings and the environment transcending boundaries of cultural differences.",                  border: "border-red-400"   },
  { emoji: <Handshake/> ,  en: "HARMONY",       fil: "Pagkakaisa",    desc: "We ardently cultivate a collaborative spirit, cherishing diverse perspectives that enrich our academic landscape. We embody interdisciplinary synergy that dismantles academic boundaries, fostering an environment where ideas converge for innovation. Rooted in Christian values and traditions, we thrive on principles of integrity and mutual respect in creating an inclusive academic community.",                       border: "border-yellow-400"},
  { emoji: <Scale/>,  en: "ACCOUNTABILITY",fil: "Pananagutan",   desc: "We ensure responsibility for all actions, behaviors, performance, and their consequences, and demonstrate stewardship in utilizing both tangible and intangible resources. We uphold integrity in fulfilling our roles and capacities as models of servant leadership.",             border: "border-blue-400"  },
  { emoji: <Sparkles/>,  en: "SPIRITUALITY",  fil: "Espiritwalidad",desc: "We live by the principles of ecumenism and interfaith dialogues as part of our spiritual formation with great dependence on the graces flowing from God. We live a life ruled by social holiness in accordance with His mission and teachings until we are formed in Him.",                 border: "border-cyan-400"  },
  { emoji: <Trophy/>,  en: "EXCELLENCE",    fil: "Husay",         desc: "We strive for greatness through a relentless commitment to the highest standards across all aspects of academic and institutional life reflected in the active pursuit of scholarly distinction by undertaking knowledge-generation endeavors, cultivation of critical thinking, and fostering an environment that encourages continuous improvement and development.",         border: "border-orange-400"},
];

export default function AlumnaAbout() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════════════════════
          1. HERO — building bg + text overlay
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] flex items-center overflow-hidden">

        {/* bg image */}
        <img
          src={cectBuilding}
          alt="CECT Building"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* gradient overlay — left dark, right lighter */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/70 to-blue-600/40" />

        {/* text — pinned to left half */}
        <div className="relative z-10 w-full justify-center items-center flex flex-col px-6 sm:px-10 py-16">
          <div className="max-w-xl">
            <h1 className="text-center text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
              ALUMNI CONNECT
            </h1>
            {/* left-border accent paragraph */}
            <p className=" text-center mt-3 text-white/90 lg:text-lg sm:text-base leading-relaxed">
              Strengthening connections between the College of Engineering and Computer Technology graduates and the institution.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. WELCOME
      ═══════════════════════════════════════════════════════ */}
      <section className=" lg:py-16 sm:py-16 px-6 sm:px-10 mb-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-5 mt-5">
            <IconPeople />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5">
            Welcome to Alumni Connect
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
            Alumni Connect is a web-based alumni tracer study and update portal for the College of Engineering and Computer Technology (CECT).
            It serves as a centralized platform for alumni information management, communication, and tracer study participation.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
           Through this portal, alumni can update their personal and employment information, participate in tracer study surveys, receive announcements, and stay connected with the college.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. OUR PURPOSE — dark image bg, icon cards
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative py-14 sm:py-16 px-6 sm:px-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${graduationBg})` }}
      >
        <div className="absolute inset-0 bg-blue-900/75" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-10">
            Our Purpose
          </h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-4xl mx-auto">
            {purposes.map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 w-full sm:w-[250px] shrink-0">
                {/* circle icon */}
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white shrink-0">
                  <Icon />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base">{title}</h3>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-[250px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. WHY IT MATTERS — white bg, left icon accent
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-14 sm:py-16 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-8 items-center">

          {/* icon blob */}
          <div className="shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <IconGrad />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Why It Matters</h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
              The information collected through the tracer study helps the college understand where graduates work and how they are doing after graduation. This information helps the college improve its services and better support current and future students.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
             By staying connected and joining the tracer study, alumni help make CECT stronger and support the success of future graduates.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. MISSION & VISION — light gray bg, two cards
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-14 sm:py-16 px-6 sm:px-10 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">

          {/* heading */}
          <div className="text-center mb-10">
            <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-1">
              Wesleyan University-Philippines
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Our Mission &amp; Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* MISSION card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <IconTarget />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase">
                    Wesleyan University-Philippines pledges to:
                  </p>
                  <h3 className="text-blue-700 font-extrabold text-sm tracking-widest uppercase">MISSION</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "To promote transformative leadership evidenced through good governance;",
                  "To develop highly-skilled, highly motivated, and conscientious learners;",
                  "To produce competent and virtuous learners equipped with state-of-the-art facilities;",
                  "To foster successful and sustainable partnerships locally and internationally in instruction and research;",
                  "To be at the forefront in conducting innovative research relevant to nation-building.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VISION card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 sm:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                  <IconEye />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase">By 2029</p>
                  <h3 className="text-green-600 font-extrabold text-sm tracking-widest uppercase">VISION</h3>
                </div>
              </div>
              <blockquote className="flex-1 flex items-center">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic border-l-4 border-green-400 pl-5">
                  "Wesleyan University-Philippines is a globally competitive institution that embodies Wesleyan
                  spirituality in providing transformative education."
                </p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. CORE VALUES — dark navy bg, icon cards in a row
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#004680] to-[#4484BA] py-14 px-4 sm:py-16 sm:px-10">
        <div className="max-w-8xl mx-auto">

          {/* heading */}
          <div className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
              What We Stand For
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {coreValues.map(({ emoji, en, fil, desc, border }) => (
              <div
              key={en}
              className={`flex flex-col items-center text-center text-white gap-2 border-t-4 ${border}
                bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-colors
                w-full`}
              >
                <span className="text-4xl p-6 rounded-full bg-blue-100/20">{emoji}</span>
                <h4 className='font-extrabold text-lg sm:text-base lg:text-lg tracking-wide leading-tight'>{en}</h4>
                <p className="text-sm lg:text-[15px]">({fil})</p>
                <p className="text-xs sm:text-sm lg:text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

AlumnaAbout.layout = (page) => <AlumnaLayout>{page}</AlumnaLayout>;
