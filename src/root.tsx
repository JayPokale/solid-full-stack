// @refuserh reload
import { createEffect, Suspense } from "solid-js";
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
import getCookie from "./utils/getToken";
import { emptyUser, setUser, user } from "./utils/user";
import { useLocation } from "@solidjs/router";
import { pageview } from "./utils/gtag";

export default function Root() {
  // const location = useLocation();
  // createEffect(() => pageview(location.pathname));

  createEffect(async () => {
    const userString: any = localStorage.getItem("user");
    let user: user = emptyUser;
    if (userString && userString !== "undefined") {
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
        {/* <script
          defer
          src="https://www.googletagmanager.com/gtag/js?id=G-0XLHW0KX3P"
        />
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0XLHW0KX3P');
          `}
        </script> */}
        <script
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4594992880793314"
          crossorigin="anonymous"
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
