import Link from 'next/dist/client/link';
import Logo from '@/components/Logo';
import { useProfile } from '@/contexts/ProfileProvider';

export default function SideBar() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex w-[24%] flex-col gap-7 border-r-2 border-gray-8">
      <div className="pt-12 pl-12">
        <Logo gap={2} imageHeight={28} />
      </div>

      <div className="flex flex-col gap-8 pl-12">
        <p className="text-xl font-medium text-[#00000094]">
          Hi, {profileData.first_name}!
        </p>
        <Link href="/dashboard">
          <div className="flex flex-row items-center gap-3 rounded-lg pl-4">
            <p className="text-xl text-[#00000094]">Application</p>
          </div>
        </Link>
        <Link href="/history">
          <div className="flex flex-row items-center gap-3 rounded-lg pl-4">
            <p className="text-xl text-[#00000094]">History</p>
          </div>
        </Link>
        <div className="flex flex-row items-center gap-3 rounded-lg pl-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M5.624 4.424C3.965 5.182 2.75 6.986 2.75 9.137c0 2.197.9 3.891 2.188 5.343c1.063 1.196 2.349 2.188 3.603 3.154q.448.345.885.688c.526.415.995.778 1.448 1.043s.816.385 1.126.385s.674-.12 1.126-.385c.453-.265.922-.628 1.448-1.043q.437-.344.885-.687c1.254-.968 2.54-1.959 3.603-3.155c1.289-1.452 2.188-3.146 2.188-5.343c0-2.15-1.215-3.955-2.874-4.713c-1.612-.737-3.778-.542-5.836 1.597a.75.75 0 0 1-1.08 0C9.402 3.882 7.236 3.687 5.624 4.424M12 4.46C9.688 2.39 7.099 2.1 5 3.059C2.786 4.074 1.25 6.426 1.25 9.138c0 2.665 1.11 4.699 2.567 6.339c1.166 1.313 2.593 2.412 3.854 3.382q.43.33.826.642c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59s1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16q.396-.312.826-.642c1.26-.97 2.688-2.07 3.854-3.382c1.457-1.64 2.567-3.674 2.567-6.339c0-2.712-1.535-5.064-3.75-6.077c-2.099-.96-4.688-.67-7 1.399"
              clip-rule="evenodd"
            />
          </svg>
          <p className="text-xl text-[#00000094]">Donate</p>
        </div>

        <div className="flex flex-row items-center gap-3 rounded-lg pl-4">
          <p className="text-xl text-[#00000094]">Learn More</p>
        </div>
      </div>
    </div>
  );
}
