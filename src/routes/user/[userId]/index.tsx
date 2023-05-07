import { createEffect, For, JSX } from "solid-js";
import { A, createRouteData, useParams, useRouteData } from "solid-start";

export function routeData() {
  return createRouteData(async () => {
    const params = useParams();
    const userId = params.userId;
    let user: any;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/user/${userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      user = await response.json();
    } catch {
      user = { error: "An error occured" };
    }
    let html = null;
    if (user.error) {
      html = (
        <div class="max-w-screen-2xl mx-auto flex justify-center">
          <div class="p-12 text-2xl text-gray-400 font-semibold italic grid place-items-center gap-4">
            <p>User not found</p>
            <p>Pata nhi kahase aa jate hai muh uthake</p>
            <p>Chal ab aa hi gya hai to ye sun</p>
            <div class="w-max grid place-items-center text-xl">
              Aaj kamayega to kal khayega,
              <br />
              apni mehnat pr bharosa rakh,
              <br />
              pyar to dobara bhi ho jayega.
              <br />
              Haan meri jaan...
            </div>
          </div>
        </div>
      );
    } else {
      html = (
        <div class="max-w-screen-2xl w-full mx-auto flex justify-center">
          <div class="w-full flex flex-wrap md:flex-nowrap justify-center gap-4 my-4">
            <div class="w-full md:min-w-[320px] md:max-w-[320px] h-max flex flex-col gap-4 sticky top-[4.5rem]">
              {/* <ProfileBasicInfo /> */}
              <main
                class="w-full rounded-md p-4"
                style={{
                  "box-shadow":
                    "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
                }}
              >
                <div class="flex flex-wrap gap-4">
                  <img
                    src={user.profilePhoto || "/userNone.webp"}
                    alt="name here"
                    class="w-24 h-24 rounded-xl object-cover"
                  />
                  <div class="flex flex-col justify-evenly font-medium">
                    <p class="max-w-[176px]">{user.name}</p>
                    <p class="max-w-[176px] text-sm text-gray-600">
                      {user.username}
                    </p>
                    {/* <div class="max-w-[176px] flex items-baseline gap-1">
                      <p class="text-xl text-black font-semibold">
                        {user.followers}
                      </p>
                      <p class="text-sm text-gray-600 font-medium">Followers</p>
                    </div> */}
                    <p class="max-w-[176px] text-sm text-gray-600">
                      From: <span class="text-black">{user.location}</span>
                    </p>
                  </div>
                </div>
                {/* <div class="py-4">
                  <button class="w-full py-1 rounded-md text-green-600 bg-green-100">
                    Follow
                  </button>
                </div> */}
                {user.socialLinks.length ? (
                  <div class="relative flex flex-col items-center">
                    <div>
                      <p class="text-center text-gray-400">
                        Other social links
                      </p>
                    </div>
                    <div class="w-full grid grid-cols-2 gap-2 py-2">
                      <For each={user.socialLinks}>
                        {() => (
                          <A
                            href={user.socialLinks.link}
                            class="p-1 rounded-md bg-gray-100 text-gray-500"
                          >
                            {user.socialLinks.platform}
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </main>

              {/* <ProfileStats /> */}
              {/* <main
                class="w-full rounded-md px-6 py-4 flex justify-between items-center"
                style={{
                  "box-shadow":
                    "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
                }}
              >
                <div class="flex flex-col items-center w-28 gap-2">
                  <div class="w-20 h-20 rounded-full flex flex-col justify-center items-center text-gray-500 bg-gray-100">
                    <p class="font-semibold text-lg h-6">{user.totalPosts}</p>
                    <p class="text-sm">Articles</p>
                  </div>
                  <div class="text-sm text-gray-500">
                    <span class="font-semibold">{user.views}</span> Views
                  </div>
                </div>
                <div class="flex flex-col w-52 h-full gap-2 justify-evenly text-sm px-8 text-gray-500">
                  <div>
                    <span class="font-semibold">{user.likes}</span> Likes
                  </div>
                  <div>
                    <span class="font-semibold">{user.saves}</span> Saves
                  </div>
                  <div>
                    <span class="font-semibold">{user.comments}</span> Comments
                  </div>
                </div>
              </main> */}

              {/* <ProfileActivities /> */}
              {/* {user.liked ? (
                <main
                  class="w-full rounded-md p-4 flex flex-col gap-2"
                  style={{
                    "box-shadow":
                      "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
                  }}
                >
                  <p class="text-gray-400">
                    <span class="font-semibold">Activity:</span> Only visible to
                    you
                  </p>
                  <div class="flex gap-2 h-20 text-gray-500 px-2 cursor-pointer rounded-md duration-100 hover:bg-gray-100">
                    <p class="w-20 grid place-items-center font-semibold text-lg rounded-full bg-gray-100">
                      {user.liked}
                    </p>
                    <p class="grid place-items-center text-base">You liked</p>
                  </div>
                  <div class="flex gap-2 h-20 text-gray-500 px-2 cursor-pointer rounded-md duration-100 hover:bg-gray-100">
                    <p class="w-20 grid place-items-center font-semibold text-lg rounded-full bg-gray-100">
                      {user.saved}
                    </p>
                    <p class="grid place-items-center text-base">You saved</p>
                  </div>
                  <div class="flex gap-2 h-20 text-gray-500 px-2 cursor-pointer rounded-md duration-100 hover:bg-gray-100">
                    <p class="w-20 grid place-items-center font-semibold text-lg rounded-full bg-gray-100">
                      {user.followed}
                    </p>
                    <p class="grid place-items-center text-base">
                      You Followed
                    </p>
                  </div>
                </main>
              ) : (
                ""
              )} */}
            </div>
            <div class="max-w-4xl w-full flex flex-col gap-2">
              {/* <ProfileAbout /> */}
              <main
                class=" rounded-md p-4"
                style={{
                  "box-shadow":
                    "0 0 0 1px rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%), 0 12px 24px rgb(0 0 0 / 5%)",
                }}
              >
                <p class="text-lg font-semibold">About</p>
                {user.about ? (
                  <div class="indent-12 text-gray-600 text-justify flex flex-col gap-2 py-2">
                    {user.about}
                  </div>
                ) : (
                  <div class="text-gray-400 font-semibold italic">
                    No data available
                  </div>
                )}
              </main>

              {/* <ExploreList /> */}
            </div>
          </div>
        </div>
      );
    }
    return html;
  });
}

const profile = () => {
  const user = useRouteData<typeof routeData>() as any;
  let data = { ...user() }.t;
  createEffect(() => {
    const params = useParams();
    const userId = params.userId;
    if (data) sessionStorage.setItem(userId, data);
    else data = sessionStorage.getItem(userId);
    document.getElementById("outerHTML")!.outerHTML = data;
  });

  return <div id="outerHTML"></div>;
};

export default profile;
