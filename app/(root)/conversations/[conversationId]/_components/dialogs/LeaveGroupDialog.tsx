"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

const LeaveGroupDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: leaveGroup, pending } = useMutationState(
        api.conversation.leaveGroup
    );
    const handleLeaveGroup = async () => {
        leaveGroup({ conversationId })
            .then(() => {
                toast.success("Group left");
            })
            .catch((error) => {
                toast.error(
                    error instanceof ConvexError
                        ? error.data
                        : "Failed to remove friend"
                );
            });
        setOpen(false);
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action can't be undone. You will not be able to
                        message this group.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-wrap gap-3">
                    <AlertDialogAction
                        disabled={pending}
                        onClick={handleLeaveGroup}
                        className="w-full !m-0 !p-0"
                    >
                        Leave
                    </AlertDialogAction>
                    <AlertDialogCancel
                        className="w-full !m-0 !p-0"
                        disabled={pending}
                    >
                        Cancel
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LeaveGroupDialog;
