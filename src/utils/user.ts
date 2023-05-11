import { createSignal } from "solid-js";

export interface user {
  name: string;
  username: string;
  userId: string;
}

export const emptyUser = {
  name: "",
  username: "",
  userId: "",
};

export const [User, setUser] = createSignal<user>(emptyUser);
