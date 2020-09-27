import {
  Flex,
  PseudoBox,
  IconButton,
  Box,
  Text,
  Heading,
} from "@chakra-ui/core";
import React, { useState } from "react";
import {
  PostsQuery,
  RegularPostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: RegularPostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex>
      <PseudoBox cursor={"pointer"} display={"flex"} flexDirection={"column"}>
        <Flex
          p={"10px"}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            onClick={async () => {
              if (post.voteStatus === 1) return;
              setLoadingState("updoot-loading");
              await vote({
                postId: post.id,
                value: 1,
              });
              setLoadingState("not-loading");
            }}
            isLoading={loadingState === "updoot-loading"}
            aria-label="updoot post"
            backgroundColor={"#fff"}
            color={"#878A8C"}
            icon="triangle-up"
            borderRadius={"10px"}
            p={"4px 8px 6px 8px"}
            _hover={{ backgroundColor: "#ee4444", transition: ".25s" }}
          />
          <Box fontWeight="bolder">{post.points}</Box>
          <IconButton
            onClick={async () => {
              if (post.voteStatus === -1) return;
              setLoadingState("downdoot-loading");
              await vote({
                postId: post.id,
                value: -1,
              });
              setLoadingState("not-loading");
            }}
            isLoading={loadingState === "downdoot-loading"}
            aria-label="downdoot post"
            backgroundColor={"#fff"}
            color={"#878A8C"}
            icon="triangle-down"
            borderRadius={"10px"}
            p={"4px 8px 6px 8px"}
            _hover={{ backgroundColor: "#0179D3", transition: ".25s" }}
          />
        </Flex>
      </PseudoBox>
    </Flex>
  );
};
