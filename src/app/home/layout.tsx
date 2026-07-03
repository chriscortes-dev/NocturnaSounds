import Header from '../../components/Header';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}
