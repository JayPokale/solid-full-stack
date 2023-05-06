// vite.config.ts
import solid from "file:///home/jay/Desktop/full-stack-solid-author/node_modules/solid-start/vite/plugin.js";
import vercel from "file:///home/jay/Desktop/full-stack-solid-author/node_modules/solid-start-vercel/index.js";
import { defineConfig } from "file:///home/jay/Desktop/full-stack-solid-author/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    {
      ...(await import("file:///home/jay/Desktop/full-stack-solid-author/node_modules/@mdx-js/rollup/index.js")).default({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx"
      }),
      enforce: "pre"
    },
    solid({
      extensions: [".mdx", ".md"],
      adapter: vercel()
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qYXkvRGVza3RvcC9mdWxsLXN0YWNrLXNvbGlkLWF1dGhvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvamF5L0Rlc2t0b3AvZnVsbC1zdGFjay1zb2xpZC1hdXRob3Ivdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvamF5L0Rlc2t0b3AvZnVsbC1zdGFjay1zb2xpZC1hdXRob3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgc29saWQgZnJvbSBcInNvbGlkLXN0YXJ0L3ZpdGVcIjtcbmltcG9ydCB2ZXJjZWwgZnJvbSBcInNvbGlkLXN0YXJ0LXZlcmNlbFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHtcbiAgICAgIC4uLihhd2FpdCBpbXBvcnQoXCJAbWR4LWpzL3JvbGx1cFwiKSkuZGVmYXVsdCh7XG4gICAgICAgIGpzeDogdHJ1ZSxcbiAgICAgICAganN4SW1wb3J0U291cmNlOiBcInNvbGlkLWpzXCIsXG4gICAgICAgIHByb3ZpZGVySW1wb3J0U291cmNlOiBcInNvbGlkLW1keFwiLFxuICAgICAgfSksXG4gICAgICBlbmZvcmNlOiBcInByZVwiLFxuICAgIH0sXG4gICAgc29saWQoe1xuICAgICAgZXh0ZW5zaW9uczogW1wiLm1keFwiLCBcIi5tZFwiXSxcbiAgICAgIGFkYXB0ZXI6IHZlcmNlbCgpXG4gICAgfSksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsT0FBTyxXQUFXO0FBQy9ULE9BQU8sWUFBWTtBQUNuQixTQUFTLG9CQUFvQjtBQUU3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUDtBQUFBLE1BQ0UsSUFBSSxNQUFNLE9BQU8sMEZBQW1CLFFBQVE7QUFBQSxRQUMxQyxLQUFLO0FBQUEsUUFDTCxpQkFBaUI7QUFBQSxRQUNqQixzQkFBc0I7QUFBQSxNQUN4QixDQUFDO0FBQUEsTUFDRCxTQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osWUFBWSxDQUFDLFFBQVEsS0FBSztBQUFBLE1BQzFCLFNBQVMsT0FBTztBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
