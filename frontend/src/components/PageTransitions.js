export const pageVariant = {
  initial: {
    opacity: 0,
  },

  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

export const pageTransitions = {
  transition: "linear",
  type: "spring",
  /*
    ease : "anticipate",
    duration: 0.5,
    */
  stiffness: "28",
};

export const pageStyle = {
  position: "absolute",
};
