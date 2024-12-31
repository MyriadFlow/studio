import React from "react";

const Loader = () => {
  return (
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-e-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  );
};

export default Loader;
