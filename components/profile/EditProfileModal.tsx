import EditProfileForm from '@/components/profile/EditProfileForm';
import { Profile } from '@/types/schema';

interface EditProfileModalProps {
  profileData: Profile;
  onClose: () => void;
}

export default function EditProfileModal({
  profileData,
  onClose,
}: EditProfileModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-[480px] flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-medium">Update Profile</p>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500 hover:bg-gray-200 hover:text-black"
          >
            ✕
          </button>
        </div>

        <EditProfileForm profile={profileData} onClose={onClose} />
      </div>
    </div>
  );
}
