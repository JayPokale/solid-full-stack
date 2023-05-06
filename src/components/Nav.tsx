import { A } from "solid-start";
import { User } from "~/root";

const Nav = () => {
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
              <li class="overflow-hidden text-ellipsis">
                <A href={`user/${User()?.userId}`}>Profile</A>
              </li>
            ) : (
              <A href="/auth">
                <li class="px-3 py-1 cursor-pointer rounded-xl bg-black text-white">
                  Sign In
                </li>
              </A>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
