import React from "react";
import {Image} from "@nextui-org/react";

const LoadingComponent = () => {
        return (
        <div>
            <Image
                src="./loadingFlight.gif"
                alt="Loading..."
                width={300}
                height={200}/>
        </div>
    );
};

export default LoadingComponent;