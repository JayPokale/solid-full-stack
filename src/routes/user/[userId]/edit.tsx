import { createEffect, createSignal } from "solid-js";
import { For } from "solid-js";
import { Navigate, createRouteAction } from "solid-start";
import { Form } from "solid-start/data/Form";
import { Input } from "~/components/Input/Input";
import { InputNonReq } from "~/components/Input/InputNonReq";
import { client } from "~/lib/trpc";
import getFromLocalStorage from "~/utils/localStorageItem";
import uploadImage from "~/utils/uploadImage";
import { User } from "~/utils/user";

const edit = () => {
  createEffect(() => {
    if(!User().userId) {
      alert("Login required")
      return <Navigate href={"/"}/>
    }
  })

  const [profile, setProfile] = createSignal<string>();
  const [about, setAbout] = createSignal("");

  const platforms = [
    "Facebook",
    "Instagram",
    "Twitter",
    "Youtube",
    "Github",
    "LinkedIn",
  ];

  const [updateUserProgress, updateUserData] = createRouteAction(
    async (formData: any) => {
      const token = getFromLocalStorage("token");
      if (User().userId && token) {
        const query = {
          name: formData.Name.value,
          username: formData.Username.value,
          bio: formData.Bio?.value,
          location: formData.Location?.value,
          profilePhoto: profile(),
          about: about() !== "" ? about() : undefined,
          socialLinks: [] as { platform: string; link: string }[],
        };
        platforms.forEach((platform) => {
          if (formData[platform].value) {
            query.socialLinks.push({
              platform,
              link: formData[platform].value,
            });
          }
        });

        const result = await client.user.updateUser.query({
          token,
          query,
        });

        console.log(result);
      }
    }
  );

  return (
    <div class="max-w-screen-lg w-full mx-auto flex justify-center p-2">
      <Form
        class="w-full flex flex-col gap-4"
        onsubmit={(e: any) => updateUserData(e.target.elements)}
      >
        <div class="flex flex-wrap justify-center items-center">
          <div class="grid place-items-center">
            <div class="w-48 h-48 cursor-pointer">
              <input
                type="file"
                name="profilePhoto"
                id="profilePhoto"
                class="hidden"
                accept=".jpg, .jpeg, .png"
                onchange={async (e: any) => {
                  if (e.target.files?.[0]) {
                    let Image = URL.createObjectURL(e.target.files[0]);
                    setProfile(Image);
                    const imageUrl = await uploadImage(e.target.files[0]);
                    setProfile(imageUrl);
                  }
                }}
              />
              <img
                src={profile() || "/userNone.webp"}
                alt="profile"
                class="h-full w-full object-cover rounded-xl"
                onclick={() => document.getElementById("profilePhoto")?.click()}
              />
            </div>
          </div>
          <div class="w-full max-w-lg p-4 flex flex-col gap-4">
            <Input {...{ type: "text", label: "Name", name: "Name" }} />
            <Input {...{ type: "text", label: "Username", name: "Username" }} />
            <InputNonReq
              {...{ type: "text", label: "Short Bio", name: "Bio" }}
            />
            <InputNonReq
              {...{
                type: "text",
                label: "Location (Country)",
                name: "Location",
              }}
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="w-full max-w-3xl mx-auto text-gray-500">About</h1>
          <div
            contentEditable={true}
            class="contentEditable w-full max-w-3xl mx-auto px-4 py-2 outline-none border-l border-gray-300 focus:border-gray-300 duration-75 group"
            data-ph="About"
            onInput={(e) => setAbout((e.target as HTMLElement).innerText)}
          />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="w-full max-w-3xl mx-auto text-gray-500">Social Links</h1>
          <div class="w-full max-w-3xl mx-auto flex flex-col gap-4">
            <For each={platforms}>
              {(platform) => (
                <div class="flex flex-col sm:flex-row gap-2">
                  <div class="flex-1">
                    <InputNonReq
                      {...{ type: "url", label: platform, name: platform }}
                    />
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
        <input
          type="submit"
          value="Submit"
          class="w-full max-w-xs mx-auto my-2 py-1 rounded-md text-green-600 bg-green-100 cursor-pointer"
        />
      </Form>
    </div>
  );
};

export default edit;
