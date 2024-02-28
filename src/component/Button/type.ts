import React from "react";

export interface ButtonProps {
    className?: string;
    isDisabled?: boolean;
    title: string;
    type?: "submit" | "reset" | "button";
    onClick?: (event: React.MouseEvent) => void;
}