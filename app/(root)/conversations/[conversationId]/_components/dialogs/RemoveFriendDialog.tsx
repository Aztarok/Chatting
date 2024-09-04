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

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: removeFriend, pending } = useMutationState(
        api.friend.remove
    );
    const handleRemoveFriend = async () => {
        removeFriend({ conversationId })
            .then(() => {
                toast.success("Removed friend");
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
                        deleted, and you will not be able to message this user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-wrap gap-3">
                    <AlertDialogAction
                        disabled={pending}
                        onClick={handleRemoveFriend}
                        className="w-full !m-0 !p-0"
                    >
                        Remove Friend
                    </AlertDialogAction>
                    <AlertDialogCancel
                        disabled={pending}
                        className="w-full !m-0 !p-0"
                    >
                        Cancel
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveFriendDialog;
