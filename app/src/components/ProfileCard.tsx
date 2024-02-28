import React from "react";
import { Link } from "react-router-dom";
import { Profile } from "../types/profile";

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Link
      to={`/profile/${profile.id}`}
      className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer"
    >
      <img
        className="w-16 h-16 rounded-full"
        src={profile.avatarUrl}
        alt={profile.name}
      />
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{profile.name}</h3>
        <p className="text-gray-600">{profile.email}</p>
        <div className="mt-2">
          <p>Score: {profile.score}</p>
          <p>Rank: {profile.rank}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
