import React from "react";

export interface Props {
    title: string;
    required: boolean;
    id: string;
    type: string;
    IsDisable?: (value: boolean) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}
export interface PropsFile {
    title: string;
    id?: string;
    required: boolean;
    IsDisable?: (value: boolean) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface PropsRange {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    id?: string;
    IsDisable?: (value: boolean) => void;
    required: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
    onChange?(value: number): void;
    onDragStart?(): void;
    onDragEnd?(value: number): void
}