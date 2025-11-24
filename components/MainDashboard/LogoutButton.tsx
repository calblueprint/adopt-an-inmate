import { TbLogout } from 'react-icons/tb';

export default function LogoutButton() {
  return (
    <div className="cursor-pointer rounded-2xl bg-black/3 px-4 py-3">
      <div className="flex flex-row items-center gap-14">
        <div className="flex flex-row gap-3">
          <div className="h-7 w-7 rounded-full bg-black/25" />
          <p className="text-lg font-medium">Ethan Tam</p>
        </div>

        <div>
          <TbLogout className="h-5 w-5 text-red-12" />
        </div>
      </div>
    </div>
  );
}
