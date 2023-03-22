import Image from "next/image";
import { useState } from "react";

// Image component with blur effect while loading image and if image not available then display no image
const ImageBlur = (props: any) => {
    const { src, alt } = props;
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <>
            {src ? (
                <Image
                    onLoadingComplete={() => setImageLoaded(true)}
                    src={src}
                    alt={alt}
                    className={`w-full h-64 object-fit ${!imageLoaded ? 'animate-pulse bg-slate-100' : ''
                        }`}
                    width={1600}
                    height={900}
                />
            ) : (
                <div className="flex-c justify-center w-full h-64 bg-slate-300">
                    <span className="text-2xl font-bold">No Image</span>
                </div>
            )}
        </>
    );
};

export default ImageBlur;