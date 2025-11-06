import Moon from './icons/Moon';

export default function Header() {
  return (
    <header className="h-16 flex items-center px-4 w-full">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Moon width={34} height={34} />
      </div>

      {/* Título */}
      <p className="text-white text-lg font-semibold ml-3 truncate">
        NocturnaSounds
      </p>
    </header>
  );
}
