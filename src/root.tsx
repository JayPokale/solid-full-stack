// @refuserh reload
import { createSignal, Suspense } from "solid-js";
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
  var arrayb = document.cookie.split(";");
  for (const item of arrayb) {
    if (item.startsWith(`${key}=`)) {
      return item.substring(6);
    }
  }
}

export default function Root() {
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
