import React from "react";
import {FormData} from "../../common/types";

export interface TProps {
    className?: string;
    title?: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    value?: string | null;
    IsDisable?: (value: boolean) => void;
    items?: FormData;
    selectDate?: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface TimeSlot {
    time: string;
    id: number;
}