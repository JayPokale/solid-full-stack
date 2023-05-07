import { createSignal } from "solid-js";

export interface user {
  name: string | null;
  username: string | null;
  userId: string | null;
}

export const emptyUser = {
  name: null,
  username: null,
  userId: null,
};

export const [User, setUser] = createSignal<user>(emptyUser);
