import streamClient from "@/lib/stream";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";

export const useCreateNewChat = () => {
  const { user } = useUser();
  
  // Get blocked user IDs to prevent creating chats with them
  const blockedUserIds = useQuery(
    api.users.getBlockedUserIds,
    user?.id ? { blockerId: user.id } : "skip"
  ) || [];
  
  // Mutation to initialize group roles
  const initializeRoles = useMutation(api.users.initializeGroupRoles);

  const createNewChat = async ({
    members,
    createdBy,
    groupName,
  }: {
    members: string[];
    createdBy: string;
    groupName?: string; // Optional group name for group chats
  }) => {
    // Check if any member is blocked
    const hasBlockedUser = members.some(memberId => blockedUserIds.includes(memberId));
    if (hasBlockedUser) {
      throw new Error("Cannot create chat with blocked users");
    }

    const isGroupChat = members.length > 2; // More than 2 members indicates a group chat

    // Check for existing 1-1 chat
    if (!isGroupChat) {
      const exisitingChannel = await streamClient.queryChannels(
        {
          type: "messaging",
          members: { $eq: members }, // Check for channels with exactly these members
        },
        { created_at: -1 },
        { limit: 1 }
      );

      if (exisitingChannel.length > 0) {
        const channel = exisitingChannel[0];
        const channelMembers = Object.keys(channel.state.members);

        // For 1-1 chats, ensure the channel has exactly the two members
        if (
          channelMembers.length === 2 &&
          members.length === 2 &&
          members.every((member) => channelMembers.includes(member))
        ) {
          console.log("Found existing 1-1 chat channel:");
          return channel;
        }
      }
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; // Always Unique ID

    try {
      // Create channel with appropriate configuration for group vs 1-1 chat
      const ChannelData: {
        members: string[];
        created_by_id: string;
        name?: string;
      } = {
        members,
        created_by_id: createdBy,
      };

      // For group chats, add group-specific metadata
      if (isGroupChat) {
        ChannelData.name =
          groupName || `Group chat (${members.length} members)`;
      }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        ChannelData
      );

      await channel.watch({
        presence: true,
      });

      // Initialize roles for group chats
      if (isGroupChat && user?.id && channel.id) {
        try {
          await initializeRoles({ channelId: channel.id, createdBy: user.id });
        } catch (error) {
          console.error("Failed to initialize group roles:", error);
          // Don't throw here - the chat was created successfully, roles are optional
        }
      }

      return channel;
    } catch (error) {
        throw error;
    }
  };

  return createNewChat;
};
