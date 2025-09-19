"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { ChannelList } from "stream-chat-react";
import { ChannelFilters, ChannelSort } from "stream-chat";
import { NewChatDialog } from "./NewChatDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical, UserPlus, Users, Settings } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import Image from "next/image";
import streamClient from "@/lib/stream";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import UserSearch from "./UserSearch";
import { XIcon, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
// Removed per request: channel actions moved to chat header

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  // Channel actions are handled in the chat header, not in the sidebar header
  const blockUser = useMutation(api.users.blockUser);
  
  // Get blocked user IDs to filter channels
  const blockedUserIds = useQuery(
    api.users.getBlockedUserIds,
    user?.id ? { blockerId: user.id } : "skip"
  ) || [];

  const filters: ChannelFilters = {
    members: { $in: [user?.id as string] },
    type: { $in: ["messaging", "team"] }, // Show both 1-1 chats and group chats
  };
  const options = { presence: true, state: true };
  const sort: ChannelSort = { last_message_at: -1 };

  function ChannelPreview({ channel, setActiveChannel, activeChannel }: any) {
    const memberIds = Object.keys(channel.state?.members || {});
    const isDM = (channel.data?.type || channel.type) === "messaging" && memberIds.length === 2;
    const isGroup = !isDM && memberIds.length > 2;
    const otherUserId = user?.id ? memberIds.find((id) => id !== user.id) : undefined;
    
    // Don't show channels with blocked users
    if (isDM && otherUserId && blockedUserIds.includes(otherUserId)) {
      return null;
    }
    
    const otherMember = otherUserId ? channel.state.members[otherUserId] : undefined;
    const displayName = (channel.data?.name as string) || otherMember?.user?.name || channel.id;
    const avatar = (channel.data?.image as string) || otherMember?.user?.image || "/vercel.svg";

    const isActive = activeChannel?.id === channel.id;

    // Get permissions for group actions
    const hasInvitePermission = useQuery(
      api.users.hasGroupPermission,
      user?.id && isGroup ? { channelId: channel.id, userId: user.id, permission: "invite_members" } : "skip"
    );
    const hasViewMembersPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id && isGroup ? { channelId: channel.id, userId: user.id, permission: "view_members" } : "skip"
    );
    const hasEditSettingsPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id && isGroup ? { channelId: channel.id, userId: user.id, permission: "edit_group_settings" } : "skip"
    );

    const onOpen = () => setActiveChannel?.(channel);

    const onBlock = async () => {
      if (!isDM || !otherUserId) return;
      const confirmed = window.confirm("Block this user? You will mute them and hide the conversation.");
      if (!confirmed) return;
      try {
        await streamClient.muteUser(otherUserId);
        await channel.hide();
        if (user?.id) {
          await blockUser({ blockerId: user.id, blockedId: otherUserId });
        }
        if (isActive) {
          // If this channel is open, close it in the UI
          setActiveChannel?.(undefined);
        }
      } catch (e) {
        console.error("Failed to block user:", e);
      }
    };

    const onCloseDM = async () => {
      if (!user?.id) return;
      const confirmed = window.confirm("Close this DM? You will leave the conversation.");
      if (!confirmed) return;
      try {
        await channel.removeMembers([user.id]);
        if (isActive) {
          setActiveChannel?.(undefined);
        }
      } catch (e) {
        console.error("Failed to close DM:", e);
      }
    };

    const onInviteMember = async (selectedUser: any) => {
      if (!user?.id) return;
      
      // Check if user has invite permission
      if (!hasInvitePermission) {
        alert("You don't have permission to invite members. You need the 'invite_members' permission.");
        return;
      }
      
      try {
        await channel.addMembers([selectedUser.userId]);
      } catch (e: any) {
        console.error("Failed to add member:", e);
        if (e.message?.includes("UpdateChannelMembers")) {
          alert("You don't have permission to invite members. Only users with 'invite_members' permission can invite members.");
        } else {
          alert(e.message || "Failed to add member. Please try again.");
        }
      }
    };

    const onViewMembers = () => {
      // This will be handled by the ViewMembersDialog component
    };

    const onGroupSettings = () => {
      // This will be handled by the GroupSettingsDialog component
    };

    return (
      <div
        onClick={onOpen}
        className={`flex items-center justify-between px-3 py-2 mx-2 my-1 rounded-lg cursor-pointer hover:bg-accent ${isActive ? "bg-accent/70" : ""}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-8 w-8">
            <Image src={avatar} alt={displayName} fill className="rounded-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">
              {(channel.data?.last_message_at as any)?.toString?.() || "Nothing yet..."}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted/60 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Channel actions"
            >
              <EllipsisVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
            {isGroup && (
              <>
                {hasEditSettingsPermission && (
                  <GroupSettingsDialog channel={channel}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </GroupSettingsDialog>
                )}
                {hasViewMembersPermission && (
                  <ViewMembersDialog channel={channel}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Users className="h-4 w-4 mr-2" />
                      View Members
                    </DropdownMenuItem>
                  </ViewMembersDialog>
                )}
                {hasInvitePermission && (
                  <InviteMemberDialog channel={channel} onInvite={onInviteMember}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </DropdownMenuItem>
                  </InviteMemberDialog>
                )}
              </>
            )}
            <DropdownMenuItem onClick={onCloseDM} disabled={!isDM}>
              Close DM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlock} disabled={!isDM} className="text-red-600 focus:text-red-700">
              Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  function MemberRoleDropdown({ 
    member, 
    currentRole,
    availableRoles, 
    onAssignRole 
  }: { 
    member: any, 
    currentRole: string,
    availableRoles: any[], 
    onAssignRole: (roleName: string) => void 
  }) {
    const [open, setOpen] = useState(false);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted/60 transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label="Member actions"
          >
            <EllipsisVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            Assign Role
          </div>
          {availableRoles.map((role) => (
            <DropdownMenuItem
              key={role.roleName}
              onClick={() => {
                onAssignRole(role.roleName);
                setOpen(false);
              }}
              disabled={role.roleName === currentRole}
              className="flex items-center justify-between"
            >
              <span>{role.roleName}</span>
              {role.roleName === currentRole && (
                <span className="text-xs text-muted-foreground">(Current)</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function GroupSettingsDialog({ channel, children }: { channel: any, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState(channel.data?.name || "");
    const [groupImage, setGroupImage] = useState(channel.data?.image || "");
    const [refreshKey, setRefreshKey] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"settings" | "roles" | "members">("settings");
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [showCreateRole, setShowCreateRole] = useState(false);
    const { user } = useUser();

    // Get all users to match with channel members
    const allUsers = useQuery(api.users.searchUsers, { searchTerm: "" }) || [];
    const userMap = new Map(allUsers.map(u => [u.userId, u]));

    // Role management queries and mutations
    const userRole = useQuery(
      api.users.getUserGroupRole,
      user?.id ? { channelId: channel.id, userId: user.id } : "skip"
    );
    const groupRoles = useQuery(api.users.getGroupRoles, { channelId: channel.id });
    const groupMembersWithRoles = useQuery(api.users.getGroupMembersWithRoles, { channelId: channel.id });
    const hasEditPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id ? { channelId: channel.id, userId: user.id, permission: "edit_group_settings" } : "skip"
    );
    const hasKickPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id ? { channelId: channel.id, userId: user.id, permission: "kick_members" } : "skip"
    );
    const hasInvitePermission = useQuery(
      api.users.hasGroupPermission,
      user?.id ? { channelId: channel.id, userId: user.id, permission: "invite_members" } : "skip"
    );
    const hasManageRolesPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id ? { channelId: channel.id, userId: user.id, permission: "manage_roles" } : "skip"
    );
    const hasAssignRolesPermission = useQuery(
      api.users.hasGroupPermission,
      user?.id ? { channelId: channel.id, userId: user.id, permission: "assign_roles" } : "skip"
    );
    const initializeRoles = useMutation(api.users.initializeGroupRoles);
    const assignRole = useMutation(api.users.assignGroupRole);
    const createRole = useMutation(api.users.createGroupRole);
    const deleteRole = useMutation(api.users.deleteGroupRole);

    // Available permissions for role creation
    const availablePermissions = [
      { id: "send_messages", label: "Send Messages", description: "Can send messages in the group" },
      { id: "view_members", label: "View Members", description: "Can view group member list" },
      { id: "invite_members", label: "Invite Members", description: "Can invite new members to the group" },
      { id: "kick_members", label: "Kick Members", description: "Can remove members from the group" },
      { id: "edit_group_settings", label: "Edit Group Settings", description: "Can modify group name and image" },
      { id: "manage_roles", label: "Manage Roles", description: "Can create, edit, and delete roles" },
      { id: "assign_roles", label: "Assign Roles", description: "Can assign roles to other members" },
      { id: "delete_group", label: "Delete Group", description: "Can delete the entire group" },
    ];

    const handleCreateRole = async () => {
      if (!newRoleName.trim() || selectedPermissions.length === 0) {
        setError("Please provide a role name and select at least one permission.");
        return;
      }

      try {
        setError(null);
        await createRole({
          channelId: channel.id,
          roleName: newRoleName.trim(),
          permissions: selectedPermissions,
          createdBy: user?.id || "",
        });
        
        setNewRoleName("");
        setSelectedPermissions([]);
        setShowCreateRole(false);
      } catch (e: any) {
        setError(e.message || "Failed to create role. Please try again.");
      }
    };

    const handleDeleteRole = async (roleName: string) => {
      if (roleName === "CEO") {
        setError("Cannot delete the CEO role.");
        return;
      }

      const confirmed = window.confirm(`Are you sure you want to delete the "${roleName}" role?`);
      if (!confirmed) return;

      try {
        setError(null);
        await deleteRole({ channelId: channel.id, roleName });
      } catch (e: any) {
        setError(e.message || "Failed to delete role. Please try again.");
      }
    };

    const memberIds = Object.keys(channel.state?.members || {});
    const members = memberIds.map(memberId => {
      const member = channel.state.members[memberId];
      const userData = userMap.get(memberId);
      return {
        userId: memberId,
        name: userData?.name || member?.user?.name || "Unknown User",
        email: userData?.email || member?.user?.email || "",
        imageUrl: userData?.imageUrl || member?.user?.image || "/vercel.svg",
        isCurrentUser: memberId === user?.id,
      };
    }); // Show all members including current user for role management

    const handleSaveSettings = async () => {
      try {
        setError(null);
        
        // Check permissions
        if (!hasEditPermission) {
          setError("You don't have permission to edit group settings.");
          return;
        }

        await channel.update({
          name: groupName.trim() || undefined,
          image: groupImage.trim() || undefined,
        });
        setOpen(false);
      } catch (e: any) {
        console.error("Failed to update group settings:", e);
        if (e.message?.includes("UpdateChannelMembers")) {
          setError("You don't have permission to update group settings. Only group owners and admins can modify group settings.");
        } else {
          setError(e.message || "Failed to update group settings. Please try again.");
        }
      }
    };

    const handleKickMember = async (memberId: string) => {
      const confirmed = window.confirm(`Are you sure you want to remove this member from the group?`);
      if (!confirmed) return;
      
      try {
        setError(null);
        
        // Check if user has kick permission
        if (!hasKickPermission) {
          setError("You don't have permission to remove members from this group. You need the 'kick_members' permission.");
          return;
        }

        // Remove member from channel
        await channel.removeMembers([memberId]);
        
        // Force refresh the channel to update member list
        await channel.watch();
        
        console.log(`Successfully removed member ${memberId} from group`);
        
        // Force UI refresh by updating the refresh key
        setRefreshKey(prev => prev + 1);
      } catch (e: any) {
        console.error("Failed to kick member:", e);
        if (e.message?.includes("UpdateChannelMembers")) {
          setError("You don't have permission to remove members. Only users with 'kick_members' permission can kick members.");
        } else {
          setError(e.message || "Failed to remove member. Please try again.");
        }
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Manage your group chat settings and members
            </DialogDescription>
          </DialogHeader>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "settings" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "roles" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "members" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Members
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label htmlFor="groupName" className="text-sm font-medium">
                  Group Name
                </label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full"
              />
            </div>

            {/* Group Image */}
            <div className="space-y-2">
              <label htmlFor="groupImage" className="text-sm font-medium">
                Group Image URL
              </label>
              <Input
                id="groupImage"
                value={groupImage}
                onChange={(e) => setGroupImage(e.target.value)}
                placeholder="Enter image URL..."
                className="w-full"
              />
              {groupImage && (
                <div className="mt-2">
                  <Image
                    src={groupImage}
                    alt="Group preview"
                    width={60}
                    height={60}
                    className="h-15 w-15 rounded-lg object-cover border"
                    onError={() => setGroupImage("")}
                  />
                </div>
              )}
            </div>

            {/* Kick Members */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Remove Members</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {members.filter(member => !member.isCurrentUser).map((member) => (
                  <div
                    key={`${member.userId}-${refreshKey}`}
                    className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {hasKickPermission && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleKickMember(member.userId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {members.filter(member => !member.isCurrentUser).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No other members to remove
                  </p>
                )}
              </div>
            </div>
          </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Role Management</h3>
                {hasManageRolesPermission && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (user?.id) {
                          initializeRoles({ channelId: channel.id, createdBy: user.id });
                        }
                      }}
                    >
                      Initialize Default Roles
                    </Button>
                    <Button 
                      onClick={() => setShowCreateRole(true)}
                    >
                      Create Custom Role
                    </Button>
                  </div>
                )}
              </div>

              {!hasManageRolesPermission && (
                <p className="text-sm text-muted-foreground">
                  You don't have permission to manage roles. You need the 'manage_roles' permission.
                </p>
              )}

              {/* Create Role Form */}
              {showCreateRole && hasManageRolesPermission && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Create New Role</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role Name</label>
                    <Input
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter role name..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Permissions</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <label key={permission.id} className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, permission.id]);
                              } else {
                                setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id));
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{permission.label}</div>
                            <div className="text-xs text-muted-foreground">{permission.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateRole} disabled={!newRoleName.trim() || selectedPermissions.length === 0}>
                      Create Role
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowCreateRole(false);
                      setNewRoleName("");
                      setSelectedPermissions([]);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Existing Roles */}
              <div className="space-y-3">
                <h4 className="font-medium">Existing Roles</h4>
                {groupRoles && groupRoles.length > 0 ? (
                  <div className="space-y-2">
                    {groupRoles.map((role) => (
                      <div key={role.roleName} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{role.roleName}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.permissions.length} permission(s): {role.permissions.join(", ")}
                          </div>
                        </div>
                        {hasManageRolesPermission && role.roleName !== "CEO" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role.roleName)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No roles found. Initialize default roles to get started.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Member Management</h3>
              <p className="text-muted-foreground text-sm">
                View and manage group members with their roles
              </p>
              
              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((member) => {
                    // Find the member's current role
                    const memberRole = groupMembersWithRoles?.find(m => m.userId === member.userId);
                    const currentRole = memberRole?.roleName || "Member";
                    
                    return (
                      <div key={member.userId} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                {currentRole}
                              </span>
                            </div>
                          </div>
                        </div>
                        {hasAssignRolesPermission && (
                          <MemberRoleDropdown
                            member={member}
                            currentRole={currentRole}
                            availableRoles={groupRoles || []}
                            onAssignRole={async (roleName: string) => {
                              try {
                                setError(null);
                                await assignRole({
                                  channelId: channel.id,
                                  userId: member.userId,
                                  roleName,
                                  assignedBy: user?.id || "",
                                });
                              } catch (e: any) {
                                setError(e.message || "Failed to assign role. Please try again.");
                              }
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No members found</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {activeTab === "settings" && (
              <Button onClick={handleSaveSettings}>
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  function ViewMembersDialog({ channel, children }: { channel: any, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    // Get all users to match with channel members
    const allUsers = useQuery(api.users.searchUsers, { searchTerm: "" }) || [];
    const userMap = new Map(allUsers.map(u => [u.userId, u]));

    const memberIds = Object.keys(channel.state?.members || {});
    const members = memberIds.map(memberId => {
      const member = channel.state.members[memberId];
      const userData = userMap.get(memberId);
      return {
        userId: memberId,
        name: userData?.name || member?.user?.name || "Unknown User",
        email: userData?.email || member?.user?.email || "",
        imageUrl: userData?.imageUrl || member?.user?.image || "/vercel.svg",
        isOnline: member?.user?.online || false,
        joinedAt: member?.created_at || new Date().toISOString(),
        isCurrentUser: memberId === user?.id,
      };
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Members of {channel.data?.name || "Group"}</DialogTitle>
            <DialogDescription>
              {members.length} member{members.length !== 1 ? 's' : ''} in this group
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      {member.isCurrentUser && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.isOnline ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs">Offline</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  function InviteMemberDialog({ channel, onInvite, children }: { channel: any, onInvite: (user: any) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const handleSelectUser = (user: any) => {
      if (!selectedUsers.find((u) => u._id === user._id)) {
        setSelectedUsers((prev) => [...prev, user]);
      }
    };

    const removeUser = (userId: string) => {
      setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
    };

    const handleInvite = async () => {
      for (const user of selectedUsers) {
        await onInvite(user);
      }
      setSelectedUsers([]);
      setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSelectedUsers([]);
      }
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invite Members to {channel.data?.name || "Group"}</DialogTitle>
            <DialogDescription>
              Search for users to add to this group chat
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <UserSearch onSelectUser={handleSelectUser} className="w-full" />

            {selectedUsers.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Selected Users ({selectedUsers.length})
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={user.imageUrl}
                          alt={user.name}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeUser(user._id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={selectedUsers.length === 0}
              onClick={handleInvite}
            >
              Invite {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full rounded-xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-background/70 to-background/30 backdrop-blur-xl px-3 py-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    G
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Welcome back
                    </span>
                    <span className="text-sm font-semibold">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SettingsDialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/60"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SettingsDialog>
                  <UserButton signInUrl="/sign-in" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-3">
            <NewChatDialog>
              <Button className="w-full rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground shadow-md">
                Start New Chat
              </Button>
            </NewChatDialog>

            <div className="px-2 pt-1 pb-0 text-[10px] uppercase tracking-widest text-muted-foreground/80">
              Channels
            </div>

            {/* Channels List */}
            <div className="rounded-xl bg-background/60 backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden shadow-sm">
              <ChannelList
                sort={sort}
                filters={filters}
                options={options}
                Preview={(p: any) => <ChannelPreview {...p} />}
                EmptyStateIndicator={() => (
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                    <div className="text-6xl mb-6 opacity-20">☁</div>
                    <h2 className="text-sm font-medium text-foreground mb-1">
                      Ready to Chat?
                    </h2>
                    <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[220px]">
                      Your conversations will appear here once you start
                      chatting with others.
                    </p>
                  </div>
                )}
              />
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
