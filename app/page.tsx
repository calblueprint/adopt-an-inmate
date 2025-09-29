import Image from 'next/image';
import BPLogo from '@/assets/images/bp-logo.png';
import CustomLink from '@/components/CustomLink';

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <Image className="mb-2 h-20 w-20" src={BPLogo} alt="Blueprint Logo" />
      <div>
        <p>Directory:</p>
        <ul className="list-disc pl-4">
          <li>
            <CustomLink href="/applications">Applications</CustomLink>
          </li>
          <li>
            <CustomLink href="/sign-up">Sign up</CustomLink>
          </li>
          <li>
            <CustomLink href="/login">Login</CustomLink>
          </li>
        </ul>
      </div>
    </main>
  );
}
