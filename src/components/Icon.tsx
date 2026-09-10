const paths = {
  plus: "M12 4.5v15m7.5-7.5h-15",
  briefcase:
    "M3.75 8.25A2.25 2.25 0 0 1 6 6h12a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25v-9ZM9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6M3.75 12h16.5",
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6h15A1.5 1.5 0 0 1 21 7.5v12A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-12A1.5 1.5 0 0 1 4.5 6Z",
  users:
    "M15 19.5v-1.5a3.75 3.75 0 0 0-3.75-3.75h-4.5A3.75 3.75 0 0 0 3 18v1.5M16.5 8.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 19.5v-1.5a3.75 3.75 0 0 0-2.632-3.578M15.75 5.365a3 3 0 0 1 0 5.77",
  inbox:
    "M3.75 12h4.019a1.5 1.5 0 0 1 1.342.83l.5 1.34a1.5 1.5 0 0 0 1.342.83h2.094a1.5 1.5 0 0 0 1.342-.83l.5-1.34a1.5 1.5 0 0 1 1.342-.83H20.25M6.75 4.5h10.5l2.75 7.5v6a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-6l2.75-7.5Z",
  check: "M4.5 12.75l6 6 9-13.5",
  document:
    "M9 12h6M9 15.75h6M9 8.25h1.5M6.75 3.75h6.879a1.5 1.5 0 0 1 1.06.44l3.372 3.371a1.5 1.5 0 0 1 .439 1.061V18.75a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z",
  academicCap:
    "M12 3 2.25 8.25 12 13.5l9.75-5.25L12 3ZM5.25 10.5v4.5c0 .69 3.02 3 6.75 3s6.75-2.31 6.75-3v-4.5",
};

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
