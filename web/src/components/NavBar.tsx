import { Button, Flex, Box, Link, Image, Heading } from "@chakra-ui/core";
//자동으로 라우팅해준다
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import Router, { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;
  //loading
  if (fetching) {
    body = null;
  }
  //not logged in
  else if (!data?.me) {
    body = (
      <Box>
        <NextLink href="/">
          <Link>
            <Heading
              style={{ opacity: 0.7 }}
              fontFamily={"cursive"}
              position={"absolute"}
              left={"15px"}
              userSelect={"none"}
            >
              Rabbit🐰
            </Heading>
          </Link>
        </NextLink>
        <NextLink href="/login">
          <Link p={"10px"} _hover={{ textDecoration: "none" }}>
            <Button color="#0179D3" bg="#fff" border="2px solid #0179D3">
              LOG IN
            </Button>
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link p={"10px"} _hover={{ textDecoration: "none" }}>
            <Button color="#fff" bg="#0179D3" variantColor="blue">
              SIGN UP
            </Button>
          </Link>
        </NextLink>
      </Box>
    );
  }
  //logged in
  else if (data?.me) {
    body = (
      <Flex>
        <NextLink href="/">
          <Link>
            <Heading
              style={{ opacity: 0.7 }}
              fontFamily={"cursive"}
              position={"absolute"}
              left={"15px"}
              userSelect={"none"}
            >
              Rabbit🐰
            </Heading>
          </Link>
        </NextLink>
        <Box userSelect={"none"} mt={"6px"} mr={"50px"}>
          <span style={{ marginRight: "15px" }}>hello</span>
          <span>{data.me.username}</span>
        </Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          outline={"none"}
          p={"10px"}
          bg={"#0179D3"}
          color={"#FFF"}
          ml={"5px"}
          variantColor={"blue"}
          mr={"10px"}
        >
          LOG OUT
        </Button>
      </Flex>
    );
  }
  return (
    <Flex w={"100vw"} bg="#000" color={"#ddd"} p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
