import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  createdUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Clerk Webhook Secret" },
      { status: 400 }
    );
  }

  const payload = await req.text();
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { type, data } = evt;

  try {
    if (type=== "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        username,
        first_name,
        last_name,
      } = evt.data;

      const user = await createdUser({
        clerkId: id,
        name: `${first_name} ${last_name}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url,
      });

      return NextResponse.json({ message: "okay", user }, { status: 201 });
    }

    if (type === "user.updated") {
      const {
        id,
        email_addresses,
        image_url,
        username,
        first_name,
        last_name,
      } = evt.data;

      const user = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name} ${last_name}`,
          username: username!,
          email: email_addresses[0].email_address,
          picture: image_url,
        },
        path: `/profile/${id}`,
      });

      return NextResponse.json({ message: "okay", user }, { status: 201 });
    }


    if (type === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser({ clerkId: id! });

      return NextResponse.json(
        { message: "okay", deletedUser },
        { status: 201 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
