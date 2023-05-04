import { createEffect, createSignal } from "solid-js";
import { A } from "solid-start";

const HomePage = () => {
  const [i, setI] = createSignal(0);
  const [windowActive, setWindowActive] = createSignal(true);

  createEffect(() => {
    window.addEventListener("focus", () => {
      setWindowActive(true);
    });
    window.addEventListener("blur", () => {
      setWindowActive(false);
    });
    setInterval(() => {
      windowActive() && setI((i() + 1) % 3);
    }, 2000);
  });

  return (
    <main class="max-w-screen-2xl flex flex-col items-center mx-auto gap-12 py-12">
      <div
        class="flex flex-col items-center text-4xl 2xs:text-5xl xs:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
        style={{ "font-family": "Signika" }}
      >
        <p class="drop-shadow-md hidden sm:block">EVERYTHING IS ABOUT</p>
        <p class="drop-shadow-md sm:hidden text-center">
          EVERYTHING
          <br />
          IS ABOUT
        </p>
        <div class="relative w-64 sm:w-80 h-max md:h-24 overflow-hidden">
          <span class="select-none">&nbsp;</span>
          <div
            class={`absolute top-0 h-max md:h-24 w-64 sm:w-80 grid place-items-center ${
              i() === 0
                ? "translate-y-32"
                : i() === 1
                ? "translate-y-0 duration-1000"
                : "-translate-y-32 duration-1000"
            }`}
          >
            <div>THINK</div>
          </div>
          <div
            class={`absolute top-0 h-max md:h-24 w-64 sm:w-80 grid place-items-center ${
              i() === 1
                ? "translate-y-32"
                : i() === 2
                ? "translate-y-0 duration-1000"
                : "-translate-y-32 duration-1000"
            }`}
          >
            <div>CREATE</div>
          </div>
          <div
            class={`absolute top-0 h-max md:h-24 w-64 sm:w-80 grid place-items-center ${
              i() === 2
                ? "translate-y-32"
                : i() === 0
                ? "translate-y-0 duration-1000"
                : "-translate-y-32 duration-1000"
            }`}
          >
            <div>EARN</div>
          </div>
        </div>
      </div>
      <h1 class="max-w-6xl text-center text-lg text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        placeat id consequuntur mollitia adipisci accusamus officiis maiores
        recusandae fugiat! Pariatur quas, illum nostrum modi doloremque dolore
        sapiente eligendi sit perferendis. Voluptatibus voluptas quibusdam nihil
        autem!
      </h1>
      <div class="flex gap-8 flex-col sm:flex-row">
        <A href="/post/write">
          <button
            class="w-60 py-2 rounded-lg bg-black text-white"
            style={{ "box-shadow": "0 4px 14px rgb(0 0 0 / 30%)" }}
          >
            Create Post
          </button>
        </A>
        <A href="/explore">
          <button
            class="w-60 py-2 rounded-lg bg-white"
            style={{ "box-shadow": "0 4px 14px rgb(0 0 0 / 10%)" }}
          >
            Explore
          </button>
        </A>
      </div>

      {/* Trending Categories */}
      <div class="flex flex-wrap gap-2 sm:gap-8 justify-center w-full">
        <button
          class="w-[calc(50%-4px)] sm:w-52 aspect-[4/3] rounded-xl duration-300 hover:bg-black/[0.015]"
          style={{
            "box-shadow":
              "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
          }}
        >
          Container 1
        </button>
        <button
          class="w-[calc(50%-4px)] sm:w-52 aspect-[4/3] rounded-xl duration-300 hover:bg-black/[0.015]"
          style={{
            "box-shadow":
              "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
          }}
        >
          Container 2
        </button>
        <button
          class="w-[calc(50%-4px)] sm:w-52 aspect-[4/3] rounded-xl duration-300 hover:bg-black/[0.015]"
          style={{
            "box-shadow":
              "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
          }}
        >
          Container 3
        </button>
        <button
          class="w-[calc(50%-4px)] sm:w-52 aspect-[4/3] rounded-xl duration-300 hover:bg-black/[0.015]"
          style={{
            "box-shadow":
              "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
          }}
        >
          Container 4
        </button>
      </div>
    </main>
  );
};

export default HomePage;
