"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical, LogOutIcon, VideoIcon, Users, MessageSquare, Send } from "lucide-react";
import { SendPaymentDialog } from "@/components/SendPaymentDialog";
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
    <div className="flex flex-col w-full flex-1 bg-white">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex flex-col h-[calc(100vh-8rem)] bg-white">
              <div className="sticky top-0 z-10 bg-white/90 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1">
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-black">
                      {channel.data?.member_count === 1
                        ? "Everyone else has left this chat!"
                        : String(((channel.data as any)?.name) || channel.id)}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted/60 border border-transparent hover:border-black/10 transition-colors"
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
                  {/* Send Payment Button - only show for 1-on-1 chats */}
                  {channel.data?.member_count === 2 && (
                    <SendPaymentDialog
                      receiverId={Object.keys(channel.state.members || {}).find((id) => id !== user?.id) || ""}
                      receiverName={(() => {
                        const memberIds = Object.keys(channel.state.members || {});
                        const otherUserId = memberIds.find((id) => id !== user?.id);
                        if (!otherUserId) return "Unknown User";
                        const otherMember = channel.state.members[otherUserId];
                        return otherMember?.user?.name || "Unknown User";
                      })()}
                      receiverImage={(() => {
                        const memberIds = Object.keys(channel.state.members || {});
                        const otherUserId = memberIds.find((id) => id !== user?.id);
                        if (!otherUserId) return "/vercel.svg";
                        const otherMember = channel.state.members[otherUserId];
                        return otherMember?.user?.image || "/vercel.svg";
                      })()}
                      channelId={channel.id}
                    >
                      <Button
                        variant="outline"
                        className="border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-4 py-2"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Money
                      </Button>
                    </SendPaymentDialog>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleCall}
                    className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl px-4 py-2"
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLeaveChat}
                    className="border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-xl px-4 py-2"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Leave Chat
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <MessageList />
              </div>

              <div className="w-full bg-white/90 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-t px-2 py-2">
                <MessageInput />
              </div>
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="w-full max-w-xl border-2 border-black rounded-3xl p-10 text-center shadow-2xl bg-white">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-3">No chat selected</h2>
            <p className="text-gray-600 mb-8">Select a chat from the sidebar or start a new conversation.</p>
            <div className="flex justify-center">
              <Button
                onClick={() => setOpen(true)}
                className="bg-black hover:bg-gray-800 text-white rounded-2xl px-6 py-5 font-bold"
              >
                <Users className="w-4 h-4 mr-2" />
                Start a new chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;