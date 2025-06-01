import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

import { createdUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Clerk Webhook Secret" },
      { status: 400 }
    );
  }

  // Headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", {
      status: 400,
    });
  }

  // Payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    const user = await createdUser({
      clerkId: id,
      name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    return NextResponse.json({ message: "okay", user }, { status: 201 });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    const user = await updateUser({
      clerkId: id,
      updateData: {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url,
      },
      path: `/profile/${id}`,
    });

    return NextResponse.json({ message: "okay", user }, { status: 201 });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser({ clerkId: id! });

    return NextResponse.json(
      { message: "okay", deletedUser },
      { status: 201 }
    );
  }

  return new Response("ok", { status: 201 });
}


