"use client";

interface WikiSidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WikiSidebarSearch({ value, onChange }: Readonly<WikiSidebarSearchProps>) {
  return (
    <label className="block">
      <span className="sr-only">Search wiki</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search wiki"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
    </label>
  );
}
