import { User } from "./user";
import { Profile } from "./profile";

export interface UseProfiles {
    users: Profile[];
    isLoading: boolean;
    error: unknown;
    mutate: unknown;
}

export interface UseProfile {
    user: Profile;
    isLoading: boolean;
    error: unknown;
    mutate: unknown;
}

export interface UseUser {
    user: User;
    isLoading: boolean;
    error: unknown;
    mutate: unknown;
}
