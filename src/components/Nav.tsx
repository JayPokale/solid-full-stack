import { createSignal, Show } from "solid-js";
import { A } from "solid-start";
import { User } from "~/root";

const Nav = () => {
  const [authEmail, setAuthEmail] = createSignal(false);
  const [Email, setEmail] = createSignal("");

  return (
    <nav
      class="bg-white fixed w-full top-0 px-4 left-0 border-b"
      style={{ "z-index": "20" }}
    >
      <div class="mx-auto max-w-screen-2xl h-14 flex justify-between items-center">
        <div>
          <A href="/">
            <h1 class="text-2xl font-bold" style={{ "font-family": "Signika" }}>
              AuthorsLog<span class="text-xs">.com</span>
            </h1>
          </A>
        </div>
        <div>
          <ul class="flex gap-4">
            {User()?.userId ? (
              // For logout remove: [cookie(token), localstorage(user), setUser(all null)]
              <li class="overflow-hidden text-ellipsis">
                <A href={`user/${User()?.userId}`}>Profile</A>
              </li>
            ) : (
              <li
                class="px-3 py-1 cursor-pointer rounded-xl bg-black text-white"
                onclick={() => setAuthEmail(true)}
              >
                Sign In
              </li>
            )}
          </ul>
        </div>
      </div>
      <Show when={authEmail()}>
        <form
          class="z-10 absolute w-full grid place-items-center gap-2"
          onsubmit={async () => {
            setAuthEmail(false);
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/users/verify`,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  email: Email(),
                }),
              }
            );
            const result = await response.json();
            alert(result.msg);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={Email()}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            class="w-full max-w-xs py-2 px-4 rounded-md outline-none"
          />
          <button
            type="submit"
            class="w-full max-w-xs rounded-md py-1 text-white text-lg font-medium bg-green-500/80"
          >
            Send
          </button>
        </form>
      </Show>
      <Show when={authEmail()}>
        <div
          class="absolute top-0 left-0 w-full h-screen backdrop-blur-sm bg-black/30 grid place-items-center"
          onclick={() => setAuthEmail(false)}
        />
      </Show>
    </nav>
  );
};

export default Nav;
