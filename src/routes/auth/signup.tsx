import { createSignal } from "solid-js";
import { Navigate, createRouteAction, useSearchParams } from "solid-start";
import { Form } from "solid-start/data/Form";
import { Input } from "~/components/Input/Input";
import { client } from "~/lib/trpc";
import { setUser } from "~/utils/user";

const auth = () => {
  const [nevigate, setNevigate] = createSignal("");
  const [params] = useSearchParams();
  const verify = { ...params }.verify;

  const [signUpProgress, signUp] = createRouteAction(async (formData: any) => {
    const result: any = await client.user.createUser.query({
      name: formData.Name.value,
      username: formData.Username.value,
      password: formData.Password.value,
      email: verify,
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
      // document.cookie = `token=${result.token}`;
      localStorage.setItem("token", result.token);
      setNevigate("/");
    }
  });

  if (!verify) return <Navigate href={"/"} />;

  return (
    <div class="h-[calc(100vh-3.5rem)] w-full grid place-items-center">
      {nevigate() !== "" && <Navigate href={nevigate()} />}
      <div class="w-full h-72 max-w-md flex flex-col gap-4 px-2 py-4 border rounded-md">
        <Form
          class="flex flex-col justify-between gap-4 h-full px-4 pb-4"
          onsubmit={(e: any) => signUp(e.target.elements)}
        >
          <div class="w-full items-center flex flex-col gap-4">
            <h1 class="text-lg">Create Credentials</h1>
            <Input {...{ type: "text", label: "Name", name: "Name" }} />
            <Input {...{ type: "text", label: "Username", name: "Username" }} />
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
          </div>
        </Form>
      </div>
    </div>
  );
};

export default auth;
