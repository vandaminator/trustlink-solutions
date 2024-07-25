import { atom } from "nanostores";

type user = {
  id: string;
  name: string;
  image?: string;
} | null;

export const userStore = atom<user>(null);
