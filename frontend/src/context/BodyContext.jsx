import { useContext } from "react";
import { BodyContext } from "./BodyProvider";

export const useBody = () => {
        return useContext(BodyContext);
};
