"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical, LogOutIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import streamClient from "@/lib/stream";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();
  const blockUser = useMutation(api.users.blockUser);

  const handleCall = () => {
    if (!channel) return;
    router.push(`/dashboard/video-call/${channel.id}`);
    setOpen(false); // Close sidebar on mobile after navigating
  };

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
      console.log('No channel or user ID found');
      return;
    }

    // Confirm before leaving
    const confirm = window.confirm("Are you sure you want to leave this chat?");
    if (!confirm) return;

    try {
      // Remove user from channel members
      await channel.removeMembers([user.id]);

      // Clear the active channel
      setActiveChannel(undefined);

      // Redirect to dashboard after leaving
      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving the chat:", error);
    }
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1">
                  <h3 className="text-sm font-semibold">
                    {channel.data?.member_count === 1
                      ? "Everyone else has left this chat!"
                      : String(((channel.data as any)?.name) || channel.id)}
                  </h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted/60 transition-colors"
                      aria-label="Channel actions"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      disabled={channel.data?.member_count !== 2}
                      onClick={async () => {
                        if (!channel || !user?.id) return;
                        const memberIds = Object.keys(channel.state.members || {});
                        const otherUserId = memberIds.find((id) => id !== user.id);
                        if (!otherUserId) return;
                        const confirmed = window.confirm(
                          "Block this user? You will mute them and hide the conversation."
                        );
                        if (!confirmed) return;
                        try {
                          await streamClient.muteUser(otherUserId);
                          await channel.hide();
                          await blockUser({ blockerId: user.id, blockedId: otherUserId });
                        } catch (e) {
                          console.error("Failed to block user:", e);
                        }
                      }}
                      className="text-red-600 focus:text-red-700"
                    >
                      Block
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLeaveChat}
                      disabled={!channel}
                    >
                      Close DM
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon className="w-4 h-4" />
                  Video Call
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLeaveChat}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Leave Chat
                </Button>
              </div>
            </div>
            <MessageList />

            <div className="sticky bottom-0 w-full">
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or start a new conversation.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
