import { createEffect } from "solid-js";
import { Navigate, unstable_clientOnly } from "solid-start";
import { User } from "~/utils/user";

const WritePost = unstable_clientOnly(
  () => import("~/components/PostComponents/WritePost")
);

const write = () => {
  createEffect(() => {
    if (!User().userId) {
      alert("Login required");
      return <Navigate href="/" />;
    }
  });

  return (
    <div class="max-w-screen-2xl mx-auto flex justify-center">
      <WritePost />
    </div>
  );
};

export default write;
