// @refuserh reload
import { createEffect, createSignal, Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useSearchParams,
} from "solid-start";
import Nav from "./components/Nav";
import "./root.css";

interface user {
  name: string | null;
  username: string | null;
  email: string | null;
  userId: string | null;
}
const emptyUser = {
  name: null,
  username: null,
  email: null,
  userId: null,
};
export const [User, setUser] = createSignal<user>(emptyUser);

export function getCookie(key: string) {
  var arrayb = document.cookie.split(";");
  for (const item of arrayb) {
    if (item.startsWith(`${key}=`)) {
      return item.substring(6);
    }
  }
}

const verifyUser = async (verifyToken: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/verify/${verifyToken}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const verifiedUser = await res.json();
  return verifiedUser;
};

const thisUser = async (token: string) => {
  if (!token) return { error: "An error occured" };
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/this`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token,
    },
    method: "GET",
  });
  const result = await res.json();
  return result;
};

export default function Root() {
  const [params] = useSearchParams();
  const token = { ...params }.token;
  const verify = { ...params }.verify;

  createEffect(async () => {
    const userString = localStorage.getItem("user");
    if (userString !== "undefined")
      var user: user = await JSON.parse(userString);
    if (user) setUser(user);
    else {
      if (token) document.cookie = `token=${token}`;
      if (verify) var verifiedUser = await verifyUser(verify);
      if (!verifiedUser?.error) {
        setUser(verifiedUser);
        localStorage.setItem("user", JSON.stringify(verifiedUser));
      }
    }

    if (!verify || !verifiedUser || !verifiedUser.userId) {
      const user = await thisUser(getCookie("token"));
      if (!user.error) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  });

  return (
    <Html lang="en">
      <Head>
        <Title>AuthorsLog</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <Body>
        <ErrorBoundary>
          <Suspense>
            <Nav />
            <main class="mt-14">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
