import localFont from "next/font/local";

export const VTB_Font = localFont({
    src: [
        {
            path: "./../public/VTBGroupUI-SemiBold.woff2",
            style: "normal",
            weight: "600",
        },
        {
            path: "./../public/VTBGroupUI-Medium.woff2",
            style: "normal",
            weight: "500",
        },
        {
            path: "./../public/VTBGroupUI-Regular.woff2",
            style: "normal",
            weight: "400",
        },
    ],
})