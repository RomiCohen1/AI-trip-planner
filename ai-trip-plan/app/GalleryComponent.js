import React from "react";
import {Image} from "@nextui-org/react";
import styles from "./page.module.css";


const GalleryComponent = ({imageComp}) => {
    return (
        <div className={styles.grid}>
                {imageComp.map((imageData, index) => (
                    <div className={styles.card}>
                        <h2>
                            {imageData[1]}
                        </h2>
                        <Image
                            key={index} // Added key for list rendering
                            isZoomed
                            width={240}
                            alt="NextUI Fruit Image with Zoom"
                            src={imageData[0]}
                        />
                    </div>
                ))}
        </div>

    );
}
export default GalleryComponent;

