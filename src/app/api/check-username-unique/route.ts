import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// Zod schema expects an object with a 'username' property
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    //* req.url will look like:
    //* http://localhost:3000.api/cuu?username=aviral&phone=ios

    // Must pass an object — keys must match schema keys
    const queryParam = {
      username: searchParams.get("username"),
    };

    // safeParse validates only the keys defined in the schema
    const result = UsernameQuerySchema.safeParse(queryParam);
    // console.log("result:", result); //TODO: remove this

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      const usernameErrors = tree.properties?.username?.errors || [];
      console.log("username errors:", usernameErrors);
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error checking username", err);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
