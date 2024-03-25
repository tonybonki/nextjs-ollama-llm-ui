import React, { useEffect } from "react";

interface UsernameFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UsernameForm({ setOpen }: UsernameFormProps) {
    useEffect(() => {
        localStorage.setItem("ollama_user", "jake");
        setOpen(false);
    }, [setOpen]);

    // Render nothing since we're bypassing the form
    return null;
}
