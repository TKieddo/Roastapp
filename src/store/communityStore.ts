import { create } from 'zustand';

interface Community {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  members: number;
  roasts: number;
  isVerified?: boolean;
  isTrending?: boolean;
  isJoined?: boolean;
  creator: {
    name: string;
    avatar: string;
  };
}

interface CommunityStore {
  joinedCommunities: Set<number>;
  joinCommunity: (communityId: number) => void;
  leaveCommunity: (communityId: number) => void;
  isCommunityJoined: (communityId: number) => boolean;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  joinedCommunities: new Set(),
  joinCommunity: (communityId: number) => {
    set((state) => ({
      joinedCommunities: new Set([...state.joinedCommunities, communityId])
    }));
  },
  leaveCommunity: (communityId: number) => {
    set((state) => {
      const newJoinedCommunities = new Set(state.joinedCommunities);
      newJoinedCommunities.delete(communityId);
      return { joinedCommunities: newJoinedCommunities };
    });
  },
  isCommunityJoined: (communityId: number) => {
    return get().joinedCommunities.has(communityId);
  }
}));