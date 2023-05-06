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
} from "solid-start";
import Nav from "./components/Nav";
import "./root.css";
import { client } from "./lib/trpc";

interface user {
  name: string | null;
  username: string | null;
  userId: string | null;
}
const emptyUser = {
  name: null,
  username: null,
  userId: null,
};
export const [User, setUser] = createSignal<user>(emptyUser);

export function getCookie(key: string) {
  var array = document.cookie.split(";");
  for (const item of array) {
    if (item.startsWith(`${key}=`)) {
      return item.substring(key.length + 1);
    }
  }
}

export default function Root() {
  createEffect(async () => {
    const userString: any = localStorage.getItem("user");
    let user: user = emptyUser;
    if (userString !== "undefined") {
      user = await JSON.parse(userString);
      setUser(user);
    }
    const token = getCookie("token");
    if (!user.userId && token?.length) {
      const result: any = client.user.thisUser.query(token);
      console.log(result);
      if (result.success) {
        const user = {
          name: result.name,
          username: result.username,
          userId: result.userId,
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `token=${result.token}`;
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
