import React, { useEffect } from "react";
import { Box } from "@chakra-ui/core";
import { NavBar } from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  let hi = 0;
  useEffect(() => {
    hi = window.outerHeight;
  });
  return (
    <>
      <NavBar />
      <Box
        style={{
          backgroundColor: "#DAE0E6",
          padding: "0",
          margin: "0",
          height: hi,
          width: "100%",
        }}
      >
        <Wrapper variant={variant}>{children}</Wrapper>
      </Box>
    </>
  );
};

export default Layout;
