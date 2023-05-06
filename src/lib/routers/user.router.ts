import { z } from "zod";
import userModel from "../schemas/user.model";
import { procedure, router } from "../init";
import * as sgMail from "@sendgrid/mail";
import * as jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

sgMail.setApiKey(import.meta.env.VITE_SEND_GRID_KEY);

const userRouter = router({
  hello: procedure.input(z.string().nullish()).query(({ input }) => {
    return `Hi ${input ?? "world"}`;
  }),

  createUser: procedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      let { name, username, password, email } = input;
      try {
        if (await userModel.exists({ username })) {
          return { msg: "Username Exist", error: true };
        }
      } catch (error) {
        console.log(error);
      }
      try {
        email = (
          jwt.verify(email, import.meta.env.VITE_JWT_SECRET) as {
            email: string;
          }
        ).email;
        password = bcrypt.hashSync(password, 8);
        const user = await userModel.create({
          name,
          username,
          password,
          email,
          userId: randomBytes(6).toString("base64"),
          jwtKey: randomBytes(3).toString("base64"),
        });
        return {
          name: user.name,
          username: user.username,
          userId: user.userId,
          token: jwt.sign(
            { _id: user._id, jwtKey: user.jwtKey },
            import.meta.env.VITE_JWT_SECRET
          ),
          success: true,
          error: false,
        };
      } catch (error) {
        return { error };
      }
    }),

  loginUser: procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { username, password } = input;
      const user = await userModel.findOne({ username });
      try {
        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            name: user.name,
            username: user.username,
            userId: user.userId,
            token: jwt.sign(
              { _id: user._id, jwtKey: user.jwtKey },
              import.meta.env.VITE_JWT_SECRET
            ),
            success: true,
            error: false,
          };
        }
        return {
          msg: "Invalid Credentials",
          error: true,
        };
      } catch (error) {
        return { error };
      }
    }),

  sendMailForAuth: procedure
    .input(z.string().email())
    .query(async ({ input }) => {
      try {
        if (await userModel.exists({ email: input })) {
          return { msg: "Email Exist", error: true };
        }
      } catch (error) {
        console.log(error);
      }
      const verify = jwt.sign(
        { email: input },
        import.meta.env.VITE_JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const msg = {
        to: input,
        subject: "Verification email for AuthorsLog",
        from: "jay.pokale.35@gmail.com",
        text: "Authenticate using this link",
        html: `<a href=${
          import.meta.env.VITE_MAIN_URI
        }/auth/signup?verify=${verify}>AuthorsLog.com</a>`,
      };
      try {
        await sgMail.send(msg);
        return { success: true, error: false };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),
});

export default userRouter;
