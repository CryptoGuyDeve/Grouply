"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Circle, Moon, Shield, Wifi } from "lucide-react";
import { useState } from "react";

interface StatusDialogProps {
  children: React.ReactNode;
}

const statusOptions = [
  {
    id: "online",
    label: "Online",
    description: "You're active and available",
    icon: Circle,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
  {
    id: "idle",
    label: "Idle",
    description: "You're away from keyboard",
    icon: Moon,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
  },
  {
    id: "dnd",
    label: "Do Not Disturb",
    description: "You don't want to be disturbed",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    id: "offline",
    label: "Offline",
    description: "You appear offline",
    icon: Wifi,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
  },
];

export function StatusDialog({ children }: StatusDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const updateStatus = useMutation(api.users.updateUserStatus);
  const updateUsername = useMutation(api.users.updateUsername);
  
  // Get current user data
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { userId: user.id } : "skip"
  );

  const handleStatusChange = async (status: string) => {
    if (!user?.id) return;
    
    try {
      setIsUpdating(true);
      await updateStatus({ userId: user.id, status });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = currentUser?.status || "online";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Set Status</DialogTitle>
          <DialogDescription>
            Choose how you want to appear to other users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const isSelected = currentStatus === status.id;
            
            return (
              <Button
                key={status.id}
                variant={isSelected ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-4 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
                onClick={() => handleStatusChange(status.id)}
                disabled={isUpdating}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${status.color}`} />
                    <div 
                      className={`absolute -bottom-1 -right-1 h-3 w-3 ${status.bgColor} rounded-full border-2 border-background`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{status.label}</div>
                    <div className="text-sm opacity-70">{status.description}</div>
                  </div>
                  {isSelected && (
                    <div className="text-xs opacity-70">Current</div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <strong>Username:</strong> {currentUser?.username || "Not set"}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <strong>Current Status:</strong> {statusOptions.find(s => s.id === currentStatus)?.label || "Online"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            You can change your username in your profile settings
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
