import { Box, IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) return null;
  return (
    <Box ml={"auto"} mt={"auto"}>
      <NextLink href="../post/edit/[id]" as={`../post/edit/${id}`}>
        <Link>
          <IconButton
            shadow={"0.05em 0.05em 0.05em #009"}
            m={"8px 0px 0px 8px"}
            icon="edit"
            aria-label="Edit post"
            variantColor={"blue"}
            borderRadius={"50%"}
          />
        </Link>
      </NextLink>
      <IconButton
        shadow={"0.05em 0.1em 0.1em #900"}
        m={"8px 0px 0px 8px"}
        icon="delete"
        aria-label="Delete post"
        variantColor={"red"}
        borderRadius={"50%"}
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
