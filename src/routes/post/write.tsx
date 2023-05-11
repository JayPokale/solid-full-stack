import { unstable_clientOnly } from "solid-start";

const WritePost = unstable_clientOnly(
  () => import("~/components/PostComponents/WritePost")
);

const write = () => {
  return (
    <div class="max-w-screen-2xl mx-auto flex justify-center">
      <WritePost />
    </div>
  );
};

export default write;
