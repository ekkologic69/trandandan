import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import { useLeaderBoard } from "../hooks/useLeaderBoard";
import LoadingSpinner from "./loading";
import ProfileCard from "./ProfileCard";

const Leaderboard: React.FC = () => {
  const { users, isLoading, error } = useLeaderBoard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Error loading leaderboard</p>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center space-y-4 bg-[#150142] p-4">
      {users.map((user) => (
        <ProfileCard key={user.id} profile={user} />
      ))}
    </div>
  );
};

export default Leaderboard;
