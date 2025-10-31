import Image from 'next/image';
import CoolIconImg from '@/assets/images/coolicon.png';
import UserIconImg from '@/assets/images/User_02.png';
import CustomLink from '@/components/CustomLink';

const applicationCardProps = {
  name: 'Jane Doe',
  status: 'Pending',
};

export default function ApplicationCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-gray-5 px-2 pt-2 pb-1">
      <div className="flex flex-col gap-y-22 rounded-2xl bg-white py-2 pr-50 pl-5">
        <Image src={UserIconImg} height={24} alt="Logo" priority />

        <div>
          <p className="text-sm font-medium">Jane Doe</p>
          <p className="text-xs font-medium">Status: Pending</p>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-x-1 pt-1 pr-4 pb-1">
        <CustomLink href="/app" variant="tertiary">
          Go to app
        </CustomLink>
        <Image src={CoolIconImg} width={14} height={10} alt="Logo" priority />
      </div>
    </div>
  );
}
