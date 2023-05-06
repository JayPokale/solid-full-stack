import { Show, createSignal } from "solid-js";
import { createRouteAction } from "solid-start";
import { Form } from "solid-start/data/Form";
import { client } from "~/lib/trpc";
import { setUser } from "~/root";

export const Input = ({ type, label }: { type: string; label: string }) => {
  return (
    <div class="relative w-full">
      <input
        type={type}
        name={label}
        class="block pt-[10px] pb-[4px] px-4 w-full bg-transparent border-b-2 outline-none focus:outline-transparent peer"
        placeholder=" "
        required
      />
      <label class="absolute mx-[2px] px-4 duration-300 transform top-3 origin-top-left z-10 font-bold scale-[60%] -translate-y-4 md:-translate-y-5 lg:-translate-y-6 peer-placeholder-shown:-z-10 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:z-10 peer-focus:font-bold peer-focus:scale-[60%] peer-focus:-translate-y-4 peer-focus:md:-translate-y-5 peer-focus:md:lg:-translate-y-6">
        {label}
      </label>
    </div>
  );
};

const auth = () => {
  const [isNew, setIsNew] = createSignal(false);

  const [loginProgress, login] = createRouteAction(async (formData: any) => {
    const result: any = await client.user.loginUser.query({
      username: formData.Username.value,
      password: formData.Password.value,
    });
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
  });

  const [submitEmailProgress, submitEmail] = createRouteAction(
    async (formData: any) => {
      const result = await client.user.sendMailForAuth.query(formData.Email.value);
      console.log(result);
    }
  );

  return (
    <div class="h-[calc(100vh-3.5rem)] w-full grid place-items-center">
      <div class="w-full h-72 max-w-md flex flex-col gap-4 px-2 py-4 border rounded-md">
        <Show when={!isNew()}>
          <Form
            class="flex flex-col justify-between gap-4 h-full px-4 pb-4"
            onsubmit={(e: any) => login(e.target.elements)}
          >
            <div class="w-full items-center flex flex-col gap-4">
              <h1 class="text-lg">Sign In</h1>
              <Input {...{ type: "text", label: "Username" }} />
              <Input {...{ type: "password", label: "Password" }} />
            </div>
            <div class="w-full flex flex-col gap-4 justify-end">
              <input
                type="submit"
                value="Submit"
                class="w-full my-2 py-1 rounded-md text-green-600 bg-green-50 cursor-pointer"
              />
              <div class="w-full h-px flex justify-center bg-gray-300">
                <h1
                  class="absolute -translate-y-1/2 max-w-fit text-center text-gray-500 px-2 py-1 bg-white cursor-pointer"
                  onclick={() => setIsNew(true)}
                >
                  New user?
                </h1>
              </div>
            </div>
          </Form>
        </Show>

        <Show when={isNew()}>
          <Form
            class="flex flex-col justify-between gap-4 h-full px-4 pb-4"
            onsubmit={(e: any) => submitEmail(e.target.elements)}
          >
            <div class="w-full items-center flex flex-col gap-4">
              <h1 class="text-lg">Sign In</h1>
              <Input {...{ type: "email", label: "Email" }} />
            </div>
            <div class="w-full flex flex-col gap-4 justify-end">
              <input
                type="submit"
                value="Submit"
                class="w-full my-2 py-1 rounded-md text-green-600 bg-green-50 cursor-pointer"
              />
              <div class="w-full h-px flex justify-center bg-gray-300">
                <h1
                  class="absolute -translate-y-1/2 max-w-fit text-center text-gray-500 px-2 py-1 bg-white cursor-pointer"
                  onclick={() => setIsNew(false)}
                >
                  Already have account?
                </h1>
              </div>
            </div>
          </Form>
        </Show>
      </div>
    </div>
  );
};

export default auth;
