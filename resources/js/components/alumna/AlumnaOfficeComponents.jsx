/* ===================== COMPONENT ===================== */

export function AlumnaOfficeSection({ title, bg, staff }) {
  return (
    <div className="w-full flex flex-col">

      {/* FULL-WIDTH HERO IMAGE with centered text overlay */}
      <div className="relative w-full h-[260px] md:h-[500px]">
        
        <img
          src={bg}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />

        {/* TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-2xl md:text-5xl font-bold tracking-wide drop-shadow-lg">
            {title}
          </h2>
        </div>

      </div>

      {/* STAFF CARDS — centered, constrained width */}
      <div className="w-full max-w-2xl mx-auto mt-10 px-4 pb-20">
        <div className="bg-white rounded-xl shadow-lg p-6">

          <div className="flex flex-col gap-8">
            {staff.map((person, index) => (
              <OfficeCard key={index} person={person} />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

/* ===================== CARD ===================== */

export function OfficeCard({ person }) {
  return (
    <div className="flex flex-col items-center text-center bg-[#F3F7FA] rounded-2xl shadow-md p-8 hover:shadow-xl transition">

      <div className="w-20 h-20 flex items-center justify-center bg-[#001D4A] text-white rounded-full text-xl font-bold">
        {person.initial}
      </div>

      <h3 className="mt-4 font-semibold text-[#45556C] uppercase">
        {person.role}
      </h3>

      <p className="mt-2 text-sm text-[#45556C]">
        {person.name}
      </p>

      <p className="text-sm text-gray-500">
        {person.email}
      </p>

    </div>
  );
}
