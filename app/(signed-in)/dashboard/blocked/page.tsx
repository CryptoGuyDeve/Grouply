"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCreateNewChat } from "@/hooks/useCreateChatClient";
import { useChatContext } from "stream-chat-react";

function BlockedPage() {
  const { user } = useUser();
  const router = useRouter();
  const blockedUsers = useQuery(
    api.users.listBlockedByMe,
    user?.id ? { blockerId: user.id } : "skip"
  );
  const unblock = useMutation(api.users.unblockUser);
  const createNewChat = useCreateNewChat();
  const { setActiveChannel } = useChatContext();

  const handleUnblock = async (blockedId: string) => {
    if (!user?.id) return;
    await unblock({ blockerId: user.id, blockedId });
  };

  const handleOpenChat = async (blockedUserId: string) => {
    if (!user?.id) return;
    // Ensure unblocked before opening chat
    const confirmUnblock = window.confirm(
      "To chat with this user you need to unblock them. Unblock now?"
    );
    if (!confirmUnblock) return;
    await unblock({ blockerId: user.id, blockedId: blockedUserId });

    // Open or create a DM channel and navigate to dashboard
    try {
      const channel = await createNewChat({
        members: [user.id, blockedUserId],
        createdBy: user.id,
      });
      setActiveChannel(channel);
      router.push("/dashboard");
    } catch (e) {
      console.error("Failed to open chat:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-xl font-semibold mb-4 text-center">Blocked Users</h1>

      {!blockedUsers || blockedUsers.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          You have not blocked anyone.
        </div>
      ) : (
        <div className="space-y-3">
          {blockedUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10">
                  <Image src={u.imageUrl} alt={u.name} fill className="rounded-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleUnblock(u.userId)}>Unblock</Button>
                <Button onClick={() => handleOpenChat(u.userId)}>Open Chat</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlockedPage;


