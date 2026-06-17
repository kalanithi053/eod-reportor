import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  email: string;
  userProfileUrl: string;
  configuration: Partial<Configuration>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface SheetConfiguration {
  id: string | null;
  sheetTabName: string | null;
  taskNameIndex: number | null;
  durationIndex: number | null;
  statusIndex: number | null;
  dateIndex: number | null;
}
export interface Configuration {
  validatedGoogle: boolean;
  googleRefreshToken: string;
  validatedZoho: boolean;
  zohoRefreshToken: string | null;
  cronOption: string | null;
  protalId: string | null;
  zohoUserId: string | null;
  projects: any[];
  sheet: SheetConfiguration;
  eodMailRecipient: string | null;
  jobFailureTriggerRecipient: string | null;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateConfiguration: (configuration: Partial<Configuration>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateConfiguration: (configuration) =>
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              configuration: {
                ...state.user.configuration,
                ...configuration,
              },
            },
          };
        }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);
