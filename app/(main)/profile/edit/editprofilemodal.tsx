// import EditProfileForm from 'components/EditProfilePage.tsx';
import EditProfileForm from '@/components/EditProfilePage';
import { Profile } from '@/types/schema';
import EditProfilePage from './page';

interface EditProfileModalProps {
  profileData: Profile;
  onClose: () => void;
}

export default function EditProfileModal({
  profileData,
  onClose,
}: EditProfileModalProps) {
  return (
    // Dark backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // clicking outside closes the modal
    >
      {/* Modal box — stop clicks from bubbling to the backdrop */}
      <div
        className="flex max-h-[90vh] w-[480px] flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-medium">Update Profile</p>
          {/* X button to close */}
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Edit Profile Form */}
        <EditProfileForm profile={profileData} />
      </div>
    </div>
  );
}
