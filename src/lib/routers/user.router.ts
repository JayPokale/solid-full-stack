import { z } from "zod";
import userModel from "../schemas/user.model";
import { procedure, router } from "../init";
import * as sgMail from "@sendgrid/mail";
import * as jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

sgMail.setApiKey(import.meta.env.VITE_SEND_GRID_KEY);

const userRouter = router({
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
          return { msg: "Username Exist", error: false };
        }
        email = (
          jwt.verify(email, import.meta.env.VITE_JWT_SECRET) as {
            email: string;
          }
        ).email;
        password = bcrypt.hashSync(password, 8);
        const userId = randomBytes(6).toString("base64").replaceAll("/","_").replaceAll("+","-");
        const jwtKey = randomBytes(3).toString("base64").replaceAll("/","_").replaceAll("+","-");
        const user = await userModel.create({
          name,
          username,
          password,
          email,
          userId,
          jwtKey,
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
        console.log(error);
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
      try {
        const user = await userModel.findOne(
          { username },
          { password: 1, name: 1, username: 1, userId: 1, jwtKey: 1 }
        );
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
        console.log(error);
        return { error };
      }
    }),

  thisUser: procedure.input(z.string()).query(async ({ input }) => {
    const { _id, jwtKey } = jwt.verify(
      input,
      import.meta.env.VITE_JWT_SECRET
    ) as { _id: string; jwtKey: string };

    try {
      const user = await userModel.findById(_id, {
        name: 1,
        username: 1,
        userId: 1,
        jwtKey: 1,
        _id: 0,
      });
      if (user?.jwtKey !== jwtKey) {
        return {
          msg: "Logged out",
          error: false,
        };
      }
      return {
        name: user.name,
        username: user.username,
        userId: user.userId,
        token: input,
        success: true,
        error: false,
      };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }),

  sendMailForAuth: procedure
    .input(z.string().email())
    .query(async ({ input }) => {
      try {
        if (await userModel.exists({ email: input })) {
          return { msg: "Email Exist", error: false };
        }
      } catch (error) {
        console.log(error);
        return { error };
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

  updateUser: procedure
    .input(
      z.object({
        token: z.string(),
        query: z.object({
          name: z.string(),
          username: z.string(),
          bio: z.string().optional(),
          location: z.string().optional(),
          profilePhoto: z.string().optional(),
          about: z.string().optional(),
          socialLinks: z.array(
            z.object({
              platform: z.string().optional(),
              link: z.string().optional(),
            })
          ),
        }),
      })
    )
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const user = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (user?.jwtKey !== jwtKey) {
          return { msg: "Not a valid user", error: false };
        }
        if (await userModel.exists({ username: input.query.username })) {
          return { msg: "Username Exist", error: false };
        }
        await userModel.findByIdAndUpdate(_id, { $set: input.query });
        return { success: true, error: false };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  fetchUser: procedure
    .input(z.object({ idToFetch: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await userModel
          .findOne({ userId: input.idToFetch })
          .select(
            "-password -__v -createdAt -updatedAt -drafts -liked -viewed -saved -commented -followed -jwtKey"
          );
        return { user, success: true, error: false };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  logoutAll: procedure.input(z.string()).query(async ({ input }) => {
    const { _id, jwtKey } = jwt.verify(
      input,
      import.meta.env.VITE_JWT_SECRET
    ) as { _id: string; jwtKey: string };
    try {
      const user = await userModel.findById(_id, { _id: 1, jwtKey: 1 });
      if (user?.jwtKey === jwtKey) {
        await userModel.findByIdAndUpdate(_id, {
          $set: { jwtKey: randomBytes(3).toString("base64").replaceAll("/","_").replaceAll("+","-") },
        });
      } else {
        return {
          msg: "Not a valid user",
          error: false,
        };
      }
    } catch (error) {
      console.log(error);
      return { error };
    }
  }),
});

export default userRouter;
