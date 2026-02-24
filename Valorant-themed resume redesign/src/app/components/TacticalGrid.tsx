export function TacticalGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,70,85,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,70,85,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-val-red/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-val-red/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-val-red/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-val-red/20" />
      {/* Crosshair center decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
        <div className="w-[400px] h-[400px] relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-val-red" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-val-red" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-val-red rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-val-red/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
