import { Button } from '@/components/Button';
import Logo from '@/components/Logo';
import { useProfile } from '@/contexts/ProfileProvider';

export default function SideBar() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex w-[24%] flex-col gap-7 border-r-2 border-gray-8 bg-red-5">
      <div className="pt-12 pl-12">
        <Logo />
      </div>

      <div className="flex flex-col gap-8 pl-12">
        <p className="text-xl font-medium">Hi, {profileData.first_name}!</p>
        <Button>Application</Button>
        <Button>History</Button>
        <Button>Donate</Button>
        <Button>Learn More</Button>
      </div>
    </div>
  );
}
