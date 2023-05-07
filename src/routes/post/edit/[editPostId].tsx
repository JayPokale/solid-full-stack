import { createEffect } from "solid-js";
import { isServer } from "solid-js/web";
import { Navigate, unstable_clientOnly } from "solid-start";
import { User } from "~/utils/user";

const EditPost = unstable_clientOnly(
  () => import("~/components/PostComponents/EditPost")
);

const editPost = () => {
  createEffect(() => {
    if (!isServer && !User().userId) {
      alert("Login required");
      return <Navigate href="/" />;
    }
  });

  return (
    <div class="max-w-screen-2xl mx-auto flex justify-center">
      {User().userId && <EditPost />}
    </div>
  );
};

export default editPost;
