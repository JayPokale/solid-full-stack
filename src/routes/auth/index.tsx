import { Show, createSignal } from "solid-js";
import { Navigate, createRouteAction } from "solid-start";
import { Form } from "solid-start/data/Form";
import { Input } from "~/components/Input/Input";
import { client } from "~/lib/trpc";
import { setUser } from "~/utils/user";

const auth = () => {
  const [isNew, setIsNew] = createSignal(false);
  const [nevigate, setNevigate] = createSignal("");

  const [loginProgress, login] = createRouteAction(async (formData: any) => {
    const result: any = await client.user.loginUser.query({
      username: formData.Username.value,
      password: formData.Password.value,
    });
    if (result.success) {
      const user = {
        name: result.name,
        username: result.username,
        userId: result.userId,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${result.token}`;
      setNevigate("/");
    }
  });

  const [submitEmailProgress, submitEmail] = createRouteAction(
    async (formData: any) => {
      const result: any = await client.user.sendMailForAuth.query(
        formData.Email.value
      );
      if (result.success) setNevigate("/");
    }
  );

  return (
    <div class="h-[calc(100vh-3.5rem)] w-full grid place-items-center">
      {nevigate() !== "" && <Navigate href={nevigate()} />}
      <div class="w-full h-72 max-w-md flex flex-col gap-4 px-2 py-4 border rounded-md">
        <Show when={!isNew()}>
          <Form
            class="flex flex-col justify-between gap-4 h-full px-4 pb-4"
            onsubmit={(e: any) => login(e.target.elements)}
          >
            <div class="w-full items-center flex flex-col gap-4">
              <h1 class="text-lg">Sign In</h1>
              <Input
                {...{ type: "text", label: "Username", name: "Username" }}
              />
              <Input
                {...{ type: "password", label: "Password", name: "Password" }}
              />
            </div>
            <div class="w-full flex flex-col gap-4 justify-end">
              <input
                type="submit"
                value="Submit"
                class="w-full my-2 py-1 rounded-md text-green-600 bg-green-100 cursor-pointer"
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
              <Input {...{ type: "email", label: "Email", name: "Email" }} />
            </div>
            <div class="w-full flex flex-col gap-4 justify-end">
              <input
                type="submit"
                value="Submit"
                class="w-full my-2 py-1 rounded-md text-green-600 bg-green-100 cursor-pointer"
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
