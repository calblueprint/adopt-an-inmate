import { TbLogout } from 'react-icons/tb';

export default function LogoutButton() {
  return (
    <div className="rounded-2xl bg-gray-13 px-4 pt-3 pb-2">
      <div className="flex flex-row items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-gray-9" />
        <p className="text-lg">Ethan Tam</p>
        <TbLogout className="h-5 w-5 text-red-12" />
      </div>
    </div>
  );
}
