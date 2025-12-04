import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Clerk Webhook Secret" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  // Verify webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  console.log("✅ Clerk event:", eventType);

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } = evt.data
      

    const user = await createUser({
      clerkId: id,
      name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    return NextResponse.json(
      { message: "User created", user },
      { status: 201 }
    );
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, username, first_name, last_name } = evt.data

    const user = await updateUser({
      clerkId: id,
      updateData: {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url,
      },
      path: `/profile/${id}`
    });
      console.log(user)
    return NextResponse.json(
      { message: "User updated", user },
      { status: 200 }
    );
  }

  if (eventType === "user.deleted") {
    if (!data.id) {
      return NextResponse.json(
        { error: "Missing user id in event data" },
        { status: 400 }
      );
    }
    const deletedUser = await deleteUser({ clerkId: data.id });
    return NextResponse.json(
      { message: "User deleted", deletedUser },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Event ignored" }, { status: 200 });
}
