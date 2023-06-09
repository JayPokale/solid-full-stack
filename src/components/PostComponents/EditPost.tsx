import { createSignal } from "solid-js";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// import CodeBox from "@bomdi/codebox";
import Image from "@editorjs/image";
// import Quote from "@editorjs/quote";
// import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import "./Editor.css";
import { Navigate, useParams } from "solid-start";
import { User } from "~/utils/user";
import getFromLocalStorage from "~/utils/localStorageItem";
import { client } from "~/lib/trpc";

const WritePost = () => {
  if(!User().userId) {
    alert("Login required")
    return <Navigate href={"/"}/>
  }
  
  const [title, setTitle] = createSignal("");
  const [subtitle, setSubtitle] = createSignal("");
  const [thumbnail, setThumbnail] = createSignal("");
  const [nevigate, setNevigate] = createSignal("");
  const [content, setContent] = createSignal([]);
  const [loded, setLoded] = createSignal(false);
  const params = useParams();
  const postId = params.editPostId;
  let result: any;

  const fetchEditPost = async () => {
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    result = await client.post.fetchPostForEdit.query({ token, postId });
    setTitle(result.post.title);
    setSubtitle(result.post.subtitle);
    setThumbnail(result.post.thumbnail);
    setContent(result.post.content);
    setLoded(true);

    editor.isReady.then(() => {
      if (content().length)
        editor.blocks.render({
          blocks: content(),
        });
    });
  };

  try {
    fetchEditPost();
  } catch (error) {
    console.log({ error });
  }

  const uploadImage = async (image: File) => {
    if (!User().userId) return;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDNAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDNAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch {
      return "An error occured";
    }
  };

  const EDITOR_JS_TOOLS = {
    header: Header,
    list: List,
    // codeBox: CodeBox,
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            return {
              success: 1,
              file: {
                url: await uploadImage(file),
              },
            };
          },
        },
      },
    },
    // quote: Quote,
    // checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
  };

  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    placeholder: "Let`s write an awesome story!",
  });

  const handleDelete = async () => {
    const formController: any = document.getElementById("formController");
    formController.classList.add("hidden");
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    const res = await client.post.deletePost.query({
      token,
      _id: result?.post?._id,
    });
    formController.classList.remove("hidden");
    if (!res.error) {
      setTitle("");
      setSubtitle("");
      setThumbnail("");
      for (const element of document.getElementsByClassName(
        "contentEditable"
      ) as HTMLCollectionOf<HTMLElement>) {
        element.innerText = "";
      }
      editor.clear();
      sessionStorage.removeItem(postId);
      setNevigate("/");
    }
    return alert(res.error ? "An error occured" : "Post Deleted");
  };

  const handlePublish = async () => {
    if (!title()) return alert("Title is required");
    if (!subtitle()) return alert("Subtitle is required");
    const formController: any = document.getElementById("formController");
    formController.classList.add("hidden");
    const data = await editor.save();
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    const res: any = await client.post.updatePost.query({
      token,
      _id: result?.post?._id,
      user_id: result?.post?.user_id,
      payload: {
        draft: false,
        title: title(),
        subtitle: subtitle(),
        thumbnail: thumbnail(),
        content: data.blocks,
      },
    });
    formController.classList.remove("hidden");
    if (!res.success) return;
    // sessionStorage.removeItem(postId);
    setNevigate(`/post/${postId}`);
  };

  const handleDraft = async () => {
    if (!title()) return alert("Title is required");
    if (!subtitle()) return alert("Subtitle is required");
    const formController: any = document.getElementById("formController");
    formController.classList.add("hidden");
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    const data = await editor.save();
    const res: any = await client.post.updatePost.query({
      token,
      _id: result?.post?._id,
      user_id: result?.post?.user_id,
      payload: {
        draft: true,
        title: title(),
        subtitle: subtitle(),
        thumbnail: thumbnail(),
        content: data.blocks,
      },
    });
    formController.classList.remove("hidden");
    if (res.success) sessionStorage.removeItem(postId);
    setNevigate(`/post/edit/${postId}`);
  };

  return (
    <main class="max-w-3xl w-full px-4 py-8 flex flex-col gap-4">
      <div id="formController" class="w-full flex justify-end gap-2">
        {nevigate() !== "" && <Navigate href={nevigate()} />}
        <button
          class="py-1 px-4 rounded-md text-gray-500 bg-gray-100"
          onclick={handlePublish}
        >
          Publish
        </button>
        <button
          class="py-1 px-4 rounded-md text-gray-500 bg-gray-100"
          onclick={handleDraft}
        >
          Draft
        </button>
        <button
          class="py-1 px-4 rounded-md text-gray-500 bg-gray-100"
          onclick={handleDelete}
        >
          Delete
        </button>
      </div>
      <div class="w-full" style={{ "font-family": "Raleway, sans-serif" }}>
        <div
          contentEditable={true}
          class={`contentEditable w-full px-4 py-2 text-2xl outline-none border-l ${
            title() ? "border-transparent" : "border-gray-300"
          } focus:border-gray-300 duration-75 group`}
          data-ph="Title"
          onInput={(e) => setTitle((e.target as HTMLElement).innerText)}
        >
          {loded() && result.post.title}
        </div>
        <div
          contentEditable={true}
          class="contentEditable w-full px-4 py-2 text-xl outline-none border-l border-transparent focus:border-gray-300 duration-75 group text-gray-500"
          data-ph="Subtitle"
          onInput={(e) => setSubtitle((e.target as HTMLElement).innerText)}
        >
          {loded() && result.post.subtitle}
        </div>
      </div>
      {thumbnail() && (
        <label for="thumbnail">
          <img
            id="thumbnailImage"
            src={thumbnail()}
            class="max-w-2xl w-full mx-auto"
          />
        </label>
      )}
      {!thumbnail() && (
        <label
          for="thumbnail"
          class="flex gap-2 justify-center items-center text-gray-500 rounded-md border py-4 drop-shadow-sm cursor-pointer bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <rect
              width="14"
              height="14"
              x="5"
              y="5"
              stroke="currentColor"
              stroke-width="2"
              rx="4"
            ></rect>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"
            ></path>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.7778 9.33331H13.7867"
            ></path>
          </svg>
          Select an image
        </label>
      )}
      <input
        type="file"
        id="thumbnail"
        class="hidden"
        accept=".jpg, .jpeg, .png"
        onchange={async (e: any) => {
          if (e.target.files?.[0]) {
            const res = await uploadImage(e.target.files[0]);
            setThumbnail(res);
          }
        }}
      />
      <div id="editorJsContent">
        <div id="editorjs" class="cursor-text"></div>
      </div>
    </main>
  );
};

export default WritePost;
