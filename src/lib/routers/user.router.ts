import { z } from "zod";
import userModel from "../schemas/user.model";
import { procedure, router } from "../init";
import * as sgMail from "@sendgrid/mail";

const userRouter = router({
  hello: procedure.input(z.string().nullish()).query(({ input }) => {
    return `Hi ${input ?? "world"}`;
  }),

  sendMail: procedure.input(z.string().email()).query(async ({ input }) => {
    const mail = {
      to: input,
      subject: "Verification email for AuthorsLog",
      from: "jay.pokale.35@gmail.com",
      text: "Authenticate using this link",
      html: `<a href=${
        import.meta.env.VITE_MAIN_URI
      }/signup>AuthorsLog.com</a>`,
    };

    const res = {
      msg: "Check your email",
      error: false,
      email: input,
    };

    try {
      await sgMail.send(mail);
      return JSON.stringify(res);
    } catch (error) {
      return JSON.stringify(res);
    }
  }),
});

export default userRouter;
