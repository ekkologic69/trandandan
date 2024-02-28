import { UseQueryResult } from "react-query";
import { Navigate } from "react-router-dom";
import { User } from "./interface";
import LoadingSpinner from "./loading";
import useCheckIsLoggedIn from "./query-hooks/useCheckIsLoggedIn";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo: UseQueryResult<User | undefined> = useCheckIsLoggedIn();
  if (userInfo.isSuccess && userInfo.data) {
    return <>{children}</>;
  } else if (userInfo.isLoading) {
    return <LoadingSpinner />;
  } else {
    return <Navigate to="/login" />;
  }
}
