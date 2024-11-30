import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">
            My Blog
          </Link>
        </h1>
        <nav>
          <Link href="/register" className="mr-4 hover:underline">
            Register
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
