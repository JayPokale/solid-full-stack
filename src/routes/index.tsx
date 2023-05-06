import { createRouteData, useRouteData } from "solid-start";
import Blocks from "~/components/HomePage/Blocks";
import HomePage from "~/components/HomePage/HomePage";
import { client } from "~/lib/trpc";

// export function routeData() {
//   return createRouteData(async () => {
//     const result = await client.user.hello.query("Jay");
//     return result;
//   });
// }

const index = () => {
  // const data = useRouteData<typeof routeData>();
  // console.log(data());

  return (
    <div>
      <HomePage />
      <Blocks />
    </div>
  );
};

export default index;
