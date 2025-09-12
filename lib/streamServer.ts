import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not defined");
}

if (!process.env.STREAM_API_SECRET_KEY) {
    throw new Error("STREAM_API_SECRET_KEY is not defined");
}

// Initialize Stream Chat server-side client
export const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_API_SECRET_KEY
);