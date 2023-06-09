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
import { Navigate } from "solid-start";
import uploadImage from "~/utils/uploadImage";
import getFromLocalStorage from "~/utils/localStorageItem";
import { client } from "~/lib/trpc";
import { User } from "~/utils/user";

const EditPost = () => {
  if (!User().userId) {
    alert("Login required");
    return <Navigate href={"/"} />;
  }

  const [title, setTitle] = createSignal("");
  const [subtitle, setSubtitle] = createSignal("");
  const [thumbnail, setThumbnail] = createSignal("");
  const [nevigate, setNevigate] = createSignal("");

  const EDITOR_JS_TOOLS = {
    header: Header,
    list: List,
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
    // codeBox: CodeBox,
    // quote: Quote,
    // checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
  };

  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    placeholder: "Let`s write an awesome story!",
  });

  const handleClear = () => {
    setTitle("");
    setSubtitle("");
    setThumbnail("");
    for (const element of document.getElementsByClassName(
      "contentEditable"
    ) as HTMLCollectionOf<HTMLElement>) {
      element.innerText = "";
    }
    editor.clear();
  };

  const handleSubmit = async () => {
    if (!title()) return alert("Title is required");
    if (!subtitle()) return alert("Subtitle is required");
    const formController: any = document.getElementById("formController");
    formController.classList.add("hidden");
    const data = await editor.save();
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    const result: any = await client.post.createPost.query({
      token,
      payload: {
        title: title(),
        subtitle: subtitle(),
        thumbnail: thumbnail(),
        content: data.blocks,
      },
    });
    formController.classList.remove("hidden");
    if (!result.success) return;
    handleClear();
    setNevigate(`/post/${result.postId}`);
  };

  const handleDraft = async () => {
    if (!title()) return alert("Title is required");
    if (!subtitle()) return alert("Subtitle is required");
    const formController: any = document.getElementById("formController");
    formController.classList.add("hidden");
    const data = await editor.save();
    const token = getFromLocalStorage("token");
    if (!token) return alert("Login Required");
    const result: any = await client.post.createPost.query({
      token,
      payload: {
        title: title(),
        subtitle: subtitle(),
        thumbnail: thumbnail(),
        content: data.blocks,
        draft: true,
      },
    });
    formController.classList.remove("hidden");
    console.log(result);
    if (!result.success) {
      return;
    }
    handleClear();
    setNevigate(`/post/edit/${result.postId}`);
  };

  return (
    <main class="max-w-3xl w-full px-4 py-8 flex flex-col gap-4">
      <div id="formController" class="w-full flex justify-end gap-2">
        {nevigate() !== "" && <Navigate href={nevigate()} />}
        <button
          class="py-1 px-4 rounded-md text-gray-500 bg-gray-100"
          onclick={handleSubmit}
        >
          Publish
        </button>
        <button
          class="py-1 px-4 rounded-md text-gray-500 bg-gray-100"
          onclick={handleDraft}
        >
          Draft
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
        />
        <div
          contentEditable={true}
          class="contentEditable w-full px-4 py-2 text-xl outline-none border-l border-transparent focus:border-gray-300 duration-75 group text-gray-500"
          data-ph="Subtitle"
          onInput={(e) => setSubtitle((e.target as HTMLElement).innerText)}
        />
      </div>
      {thumbnail() && (
        <label for="thumbnail">
          <img id="thumbnailImage" class="max-w-2xl w-full mx-auto" />
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
            (document as any)
              .getElementById("thumbnailImage")
              .setAttribute("src", URL.createObjectURL(e.target.files[0]));
          }
        }}
      />
      <div id="editorJsContent">
        <div id="editorjs" class="cursor-text"></div>
      </div>
    </main>
  );
};

export default EditPost;
