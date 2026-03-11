import { useEffect, useState } from "react";

export default function App() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 6), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400&display=swap');`}</style>

      <div className="flex items-center">
        <span className="text-2xl font-bold text-stone-200 tracking-widest text-orange-400">
          On plan
        </span>

        <span className="ml-1 flex items-center gap-1">
          {[0,1,2,3,4].map(i => (
            <span
              key={i}
              className="text-2xl font-bold text-amber-500 text-white"
              style={{ opacity: i < dots ? 1 : 0 }}
            >
              .
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}