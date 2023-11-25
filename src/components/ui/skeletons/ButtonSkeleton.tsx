import React from "react";
import { Button } from "../button";
import { Skeleton } from "./skeleton";

const ButtonSkeleton = () => {
    return (
        <Skeleton className="h-10 w-32">
            <Button className="h-full w-full" disabled={true}></Button>
        </Skeleton>
    );
};

export default ButtonSkeleton;
