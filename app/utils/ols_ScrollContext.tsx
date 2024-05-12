import { createContext, RefObject } from "react";

interface ScrollContextProps {
    topViewRef: RefObject<HTMLDivElement> | null;
    setTopViewRef: (ref: RefObject<HTMLDivElement>) => void;
}

export const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);
