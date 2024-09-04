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

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: deleteGroup, pending } = useMutationState(
        api.conversation.deleteGroup
    );
    const handleDeleteGroup = async () => {
        deleteGroup({ conversationId })
            .then(() => {
                toast.success("Group deleted");
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
                        This action can't be undone. All messages will be
                        deleted, and you will not be able to message this group.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-wrap gap-3">
                    <AlertDialogAction
                        disabled={pending}
                        onClick={handleDeleteGroup}
                        className="w-full !m-0 !p-0"
                    >
                        Delete Group
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

export default DeleteGroupDialog;
