import { createEffect } from "solid-js";
import { A, createRouteData, useParams, useRouteData } from "solid-start";
import { format } from "timeago.js";
import "../../components/PostComponents/Editor.css";
import { User } from "~/utils/user";
import { client } from "~/lib/trpc";

const convertDataToHtml = (blocks: [Object]) => {
  var convertedHtml = "";
  blocks.map((block: any) => {
    switch (block.type) {
      case "header":
        convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        break;
      case "paragraph":
        convertedHtml += `<p>${block.data.text}</p>`;
        break;
      case "delimiter":
        convertedHtml +=
          "<div class='text-2xl h-16 grid place-items-center'>* * *</div>";
        break;
      case "image":
        convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><em>${block.data.caption}</em>`;
        break;
      case "list":
        convertedHtml += "<ul>";
        block.data.items.forEach(function (li: any) {
          convertedHtml += `<li>${li}</li>`;
        });
        convertedHtml += "</ul>";
        break;
      default:
        break;
    }
  });
  return convertedHtml;
};

export function routeData() {
  return createRouteData(async () => {
    const params = useParams();
    const postId = params.PostId;
    const result: any = await client.post.fetchPost.query(postId);
    let html = null;
    let editorJsContent = null;
    let userId = null;

    if (!result.success) {
      html = (
        <div class="max-w-screen-2xl mx-auto flex justify-center">
          <div class="p-12 text-2xl text-gray-400 font-semibold italic grid place-items-center gap-4">
            <p>Post not found</p>
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
      const user = result.user;
      const post = result.post;
      userId = user.userId;
      html = (
        <div class="max-w-screen-2xl mx-auto flex justify-center">
          <div class="lg:border-r w-full max-w-2xl">
            <main class="w-full px-4">
              <div class="w-full py-4 border-b flex justify-between">
                <div class="flex gap-3">
                  <a href={`/user/${user.userId}`} link={true}>
                    <img
                      src={user.profilePhoto || "/userNone.webp"}
                      alt={user.name}
                      class="w-12 h-12 rounded-full"
                    />
                  </a>
                  <div class="flex flex-col justify-evenly">
                    <a href={`/user/${user.userId}`} link={true}>
                      <p class="text-sm">{user.name}</p>
                    </a>
                    <p class="text-xs text-gray-600">
                      {format(post.createdAt)}
                    </p>
                  </div>
                </div>
                {/* <div class="flex items-center gap-4 text-sm">
                  <p class="cursor-pointer">Follow</p>
                  <a href={`/user/${user.userId}`} link={true}>
                    <p class="cursor-pointer">Visit</p>
                  </a>
                </div> */}
              </div>
              <article class="py-4">
                <h1
                  class="text-2xl font-bold pb-2 flex justify-between items-center"
                  style={{ "font-family": "Raleway, sans-serif" }}
                >
                  <span class="w-full">{post.title}</span>
                  <div id="editPost"></div>
                </h1>
                <h2
                  class="text-xl text-gray-500 pb-2"
                  style={{ "font-family": "Raleway, sans-serif" }}
                >
                  {post.subtitle}
                </h2>
                {post.thumbnail ?? (
                  <img
                    src={post.thumbnail}
                    alt="Article thumbnail"
                    class="py-4"
                  />
                )}
                <div
                  class="text-justify space-y-4 py-4 text-lg"
                  style={{ "font-family": "Inter" }}
                >
                  <div id="editorJsContent"></div>
                </div>
              </article>
            </main>
          </div>
          <div class="w-80 py-2 hidden lg:block sticky top-14 h-max">
            <div class="w-full p-4 border-b flex flex-col gap-2">
              <div class="flex flex-wrap gap-4">
                <img
                  src={user.profilePhoto || "/userNone.webp"}
                  alt="name here"
                  class="w-24 h-24 rounded-xl"
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
              <div>
                <p class="text-sm text-gray-500">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      );
      editorJsContent = convertDataToHtml(post.content);
    }
    return { html, editorJsContent, userId, postId };
  });
}

const article = () => {
  const params = useParams();
  const postId = params.PostId;

  const post: any = useRouteData<typeof routeData>();
  let data: any = { ...{ ...post() }.html }.t;
  if (data)
    data = data.replace(
      '<div id="editorJsContent"></div>',
      `${{ ...post() }.editorJsContent}`
    );
  if ({ ...post() }.userId === User().userId) {
    data = data.replace(
      '<div id="editPost"></div>',
      `<a href='/post/edit/${postId}' link={true}><button class="w-12 h-6 bg-gray-100 text-gray-400 rounded-md text-sm">Edit</button></a>`
    );
  }
  createEffect(() => {
    if (data) sessionStorage.setItem(postId, data);
    else data = sessionStorage.getItem(postId);
    document.getElementById("outerHTML")!.outerHTML = data;
  });

  return <div id="outerHTML"></div>;
};

export default article;
