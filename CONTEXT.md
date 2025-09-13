# Grouplyy – Project Context and Architecture

## Overview
Grouplyy is a Next.js 15 App Router application that enables authenticated users to chat in real time and start HD video calls. It integrates three managed services:
- Clerk for authentication and user management
- Convex for serverless data and user search/sync
- Stream for real-time chat (Stream Chat) and video (Stream Video)

The app provides:
- Auth-gated dashboard with modern glassmorphism sidebar and channel list
- Real-time messaging with Stream Chat integration
- New chat creation (1–1 and group chats), with duplicate 1–1 detection
- One-click jump from a chat channel to a video call bound to the channel id
- HD video calling with connection state handling and invite link copying
- Comprehensive user blocking system with Convex persistence
- Advanced group management with role-based permissions system
- Custom role creation and assignment with granular permission control
- Real-time permission enforcement across all group actions
- Blocked users management page with unblock functionality

## Core Technologies
- Next.js 15 (App Router) with React 19
- TypeScript
- Clerk (auth) – `@clerk/nextjs`
- Convex (DB/functions) – `convex` with `convex/react` and `convex/react-clerk`
- Stream Chat – `stream-chat` and `stream-chat-react`
- Stream Video – `@stream-io/video-react-sdk`
- Tailwind CSS v4 and custom UI components

## High-level Architecture
- Client: Next.js pages and components under `app/` render the marketing site and the signed-in dashboard. The dashboard mounts a `Chat` provider from Stream and renders a floating `Sidebar` with channel list and new chat flow.
- Auth: `middleware.ts` protects `/dashboard(.*)` using Clerk. `app/layout.tsx` wraps the app with `ClerkProvider` and `ConvexClientProvider` for authenticated Convex access.
- Data: Convex stores a minimal `users` table (synced from Clerk) and exposes queries/mutations for user lookup and search.
- Chat: Stream Chat is initialized on the client (`lib/stream.ts`) and on the server (`lib/streamServer.ts`) for token minting. `UserSyncWrapper` connects the Stream user on sign-in and disconnects on sign-out, and keeps Convex in sync.
- Video: Video calls are handled in a nested layout under `app/(signed-in)/dashboard/video-call/[id]/`. A Stream Video client is created per authenticated user; a `Call` is joined with the dynamic route id.

## Data Model (Convex)
File: `convex/schema.ts`
- Table `users`:
  - `userId` (Clerk user id)
  - `name`, `email`, `imageUrl`
  - Indexes: `by_userId`, `by_email`
- Table `blocks`:
  - `blockerId`, `blockedId` (Clerk user ids)
  - `createdAt` timestamp
  - Indexes: `by_blocker`, `by_blocked`, `by_pair`
- Table `groupRoles`:
  - `channelId` (Stream channel ID)
  - `roleName` (e.g., "CEO", "Admin", "Member")
  - `permissions` (array of permission strings)
  - `createdAt` timestamp, `createdBy` (Clerk user ID)
  - Indexes: `by_channel`, `by_channel_role`
- Table `groupMembers`:
  - `channelId`, `userId` (Stream channel ID, Clerk user ID)
  - `roleName` (assigned role name)
  - `assignedBy` (Clerk user ID who assigned the role)
  - `assignedAt` timestamp
  - Indexes: `by_channel`, `by_user`, `by_channel_user`

Server functions: `convex/users.ts`
- `getUserByClerkId(userId)` – returns a single user
- `upsertUser({ userId, name, email, imageUrl })` – inserts or patches
- `searchUsers({ searchTerm })` – simple in-memory filter by name/email (limited to 20 results)
- `blockUser({ blockerId, blockedId })` – creates block record
- `unblockUser({ blockerId, blockedId })` – removes block record
- `listBlockedByMe({ blockerId })` – returns blocked users with profile data
- `isUserBlocked({ blockerId, blockedId })` – checks if user is blocked
- `getBlockedUserIds({ blockerId })` – returns array of blocked user IDs
- `createGroupRole({ channelId, roleName, permissions, createdBy })` – creates custom role
- `assignGroupRole({ channelId, userId, roleName, assignedBy })` – assigns role to user
- `getUserGroupRole({ channelId, userId })` – gets user's role in group
- `getGroupRoles({ channelId })` – gets all roles for a group
- `getGroupMembersWithRoles({ channelId })` – gets members with their roles
- `hasGroupPermission({ channelId, userId, permission })` – checks user permission
- `deleteGroupRole({ channelId, roleName })` – deletes custom role
- `initializeGroupRoles({ channelId, createdBy })` – creates default CEO/Member roles

## Authentication Flow
- `middleware.ts` uses Clerk to enforce auth on `/dashboard(.*)`.
- `app/layout.tsx` wraps the tree in `ClerkProvider` and `ConvexClientProvider` (which binds Convex to Clerk via `ConvexProviderWithClerk`).
- `components/Header.tsx` and `components/app-sidebar.tsx` render `UserButton` and sign-in buttons as appropriate.

## User Sync and Chat Initialization
Component: `components/UserSyncWrapper.tsx`
- On mount with an authenticated user:
  0) 
  1) Calls `api.users.upsertUser` to sync Clerk user into Convex.
  2) Connects the Stream Chat client with a token provider that calls the server action `actions/createToken.ts`.
- On unmount or sign-out, disconnects the Stream user.

## Creating Chats
Hook: `hooks/useCreateChatClient.ts`
- Prevents duplicate 1–1 channels by querying for an exact `members` match and identical size.
- Creates a new channel with unique id. Uses type `messaging` for 1–1 and `team` for groups; sets `name` for groups.

Component: `components/NewChatDialog.tsx`
- Uses `UserSearch` (Convex-backed) to select members and optionally set a group name.
- Invokes `useCreateNewChat` and sets the active channel.

Sidebar and Messaging UI:
- `components/app-sidebar.tsx` renders a modern glassmorphism sidebar with Stream `ChannelList` filtered to channels containing the current user, sorted by `last_message_at`.
- Each channel row includes a three-dots dropdown menu with context-aware options:
  - **For DMs**: Block user, Close DM
  - **For Groups**: Settings, View Members, Invite Member, Close DM, Block (if applicable)
- `app/(signed-in)/dashboard/page.tsx` renders the active `Channel` with header, `MessageList`, `MessageInput`, and `Thread`.
- Users can leave a chat; for empty channels (only current member), a friendly header is shown.
- Blocked users are filtered out from search results and channel lists.

## User Blocking System
- **Blocking**: Users can block others via three-dots menu in sidebar or chat header
- **Persistence**: Block records stored in Convex `blocks` table with proper indexing
- **Enforcement**: Blocked users are filtered from:
  - User search results (`components/UserSearch.tsx`)
  - New chat creation (`hooks/useCreateChatClient.ts`)
  - Channel list display (hidden from sidebar)
- **Stream Integration**: Blocked users are muted in Stream Chat and channels are hidden
- **Management**: Dedicated blocked users page at `/dashboard/blocked` with unblock functionality
- **Chat Reopening**: "Open Chat" on blocked page unblocks user and creates/reopens DM

## Role-Based Permission System
- **Custom Role Creation**: Create roles with custom names and specific permission sets
- **Permission Types**: 8 granular permissions (send_messages, view_members, invite_members, kick_members, edit_group_settings, manage_roles, assign_roles, delete_group)
- **Default Roles**: CEO (all permissions) and Member (basic permissions) created automatically
- **Role Assignment**: Assign custom roles to group members via 3-dot dropdown menu
- **Permission Enforcement**: Real-time permission checks before all group actions
- **UI-Level Security**: Buttons/options only show for users with appropriate permissions
- **Role Management**: Create, edit, delete, and assign roles with proper validation

## Group Management Features
- **Invite Members**: Add new members to existing group chats via search dialog (permission-controlled)
- **View Members**: Display all group members with roles, online status, name, email, and join date
- **Group Settings**: Modify group name, image URL, and kick members (permission-controlled)
- **Member Kicking**: Remove members from groups with confirmation and UI refresh (permission-controlled)
- **Role Management Interface**: Three-tab dialog (Settings, Roles, Members) for comprehensive group control
- **Real-time Updates**: All group changes sync immediately across all members

## Video Calling
- Route: `app/(signed-in)/dashboard/video-call/[id]/`
- Layout initializes `StreamVideoClient` for the Clerk user and joins a `Call` with id from the URL.
- `page.tsx` renders `SpeakerLayout` and `CallControls` with states for joining/reconnecting. If alone, an overlay offers a one-click "Copy Link".
- From a chat, `handleCall` navigates to `/dashboard/video-call/${channel.id}` so the call id matches the chat channel id.

## Environment Variables
Required at build/runtime:
- `NEXT_PUBLIC_CONVEX_URL` – Convex deployment URL (client)
- `NEXT_PUBLIC_CLERK_FRONTEND_API_KEY` – used by Convex auth config
- `NEXT_PUBLIC_STREAM_API_KEY` – Stream public key (chat + video)
- `STREAM_API_SECRET_KEY` – Stream secret key (server-side token minting)

Notes:
- The server action `actions/createToken.ts` uses `lib/streamServer.ts`, which throws if either key is missing.
- In production, store secrets in your hosting provider (Vercel) and Stream/Convex dashboards.

## Key Modules
- `app/layout.tsx`: Root layout with fonts, Clerk, Convex providers
- `app/page.tsx`: Marketing/landing page with feature showcase
- `app/(signed-in)/layout.tsx`: Chat provider, glassmorphism sidebar, and header with blocked users link
- `app/(signed-in)/dashboard/page.tsx`: Chat window with dropdown actions (block, leave chat)
- `app/(signed-in)/dashboard/blocked/page.tsx`: Blocked users management with unblock and chat reopening
- `app/(signed-in)/dashboard/video-call/[id]/layout.tsx`: Stream Video client + call lifecycle
- `app/(signed-in)/dashboard/video-call/[id]/page.tsx`: Video UI and controls
- `components/ConvexClientProvider.tsx`: Convex client binding to Clerk
- `components/UserSyncWrapper.tsx`: Sync Clerk user to Convex + connect Stream user
- `components/app-sidebar.tsx`: Modern sidebar with channel list, three-dots menus, role-based permission system, and comprehensive group management dialogs
- `components/NewChatDialog.tsx`: New chat creation with user search and group naming
- `components/UserSearch.tsx`: User search component with blocked user filtering
- `hooks/useUserSearch.ts`: Debounced user search via Convex
- `hooks/useCreateChatClient.ts`: Create or reuse chat channels with blocked user validation
- `lib/stream.ts`: Client Stream Chat instance
- `lib/streamServer.ts`: Server Stream Chat (for token creation)
- `actions/createToken.ts`: Server action to mint Stream token for a user id
- `convex/schema.ts`, `convex/users.ts`, `convex/auth.config.ts`: Data model, user management, blocking system, and role-based permissions
- `middleware.ts`: Clerk route protection
- `next.config.ts`: Next.js config with image optimization for external URLs

## Project Scripts
- `dev`: next dev — uses Turbopack
- `build`: next build — uses Turbopack
- `start`: next start

## Directory Structure (selected)
- `app/` – App Router routes and layouts
- `components/` – UI and feature components
- `convex/` – Convex schema and functions
- `hooks/` – Custom React hooks
- `lib/` – Third-party client setup (Stream)
- `actions/` – Server actions (Next.js)

## Local Development
Prerequisites:
- Node.js 18+
- Accounts and configured projects for Clerk, Convex, and Stream

Setup:
1) Create environment variables (see README) in `.env.local` and in Convex/Stream dashboards as needed.
2) Install dependencies: `npm i` (or `yarn`/`pnpm`/`bun`).
3) Run `npm run dev` and open `http://localhost:3000`.

## Security & Privacy Considerations
- All `/dashboard` routes require authentication (Clerk middleware).
- Stream token minting happens only server-side. Do not expose `STREAM_API_SECRET_KEY` to the client.
- Convex stores a minimal user profile and blocking relationships; no messages are stored locally—chat history lives in Stream.
- Blocked users are completely filtered from UI interactions and cannot be contacted.
- Group management actions require proper permissions and validation.
- Role-based permissions are enforced at both UI and action levels for security.
- Custom roles can be created with granular permission control.

## UI/UX Features
- **Modern Design**: Glassmorphism sidebar with backdrop blur and modern styling
- **Responsive Layout**: Mobile-friendly with collapsible sidebar
- **Context-Aware Menus**: Three-dots dropdowns show relevant options based on chat type and user permissions
- **Permission-Based UI**: Interface elements show/hide based on user's role permissions
- **Role Management Interface**: Intuitive three-tab dialog for comprehensive group control
- **Real-time Updates**: All changes sync immediately across all connected clients
- **Image Optimization**: Next.js Image component with external URL support for group avatars
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Known Limitations / Future Work
- User search uses a naive in-memory filter on the Convex side; consider full-text search or incremental sync for large user bases.
- Add tests (unit/integration) and CI.
- Add message notifications, typing indicators, read receipts customization.
- Add call lobby (mic/cam preview) and permissions prompts.
- Add presence/online indicators and user status.
- Add message reactions and file sharing capabilities.
- Add message search and chat history export.
- Add role hierarchy system (e.g., CEO > Admin > Moderator > Member).
- Add bulk role assignment and permission templates.
- Add audit logs for role changes and permission modifications.
