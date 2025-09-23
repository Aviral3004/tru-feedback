import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  //* We get the session of the logged in user by providing authOptions into getServerSession from next-auth
  const session = await getServerSession(authOptions);
  //* This User imported form next-auth helps in giving the type of the user which is specified below
  //* User :- defines the shape of session.user for type safety
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id); //* This conversion is needed for aggregation pipeline so proper mongoose id is needed, not in string
  try {
    const user = await UserModel.aggregate([
      //* pipelines
      { $match: { _id: userId } },

      //* now we add pipeline for unwinding arrays (converting each array element to corresponding each object)
      { $unwind: "$messages" },

      //* adding pipeline to sort in ascending order by giving -1
      { $sort: { "messages.createdAt": -1 } },

      //* Now we finally add pipeline to group all these objects
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or there are no messages for the user yet",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpected error occured:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
