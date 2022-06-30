export const overlayAnimation = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {ease: "easeOut", duration: 0.3}
}

export const modalAnimation = {
    initial: {opacity: 0, scale: 0.5},
    animate: {opacity: 1, scale: 1},
    exit: {opacity: 0, scale: 0},
    transition: {ease: "easeOut", duration: 0.3}
}