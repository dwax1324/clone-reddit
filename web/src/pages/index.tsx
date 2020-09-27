import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Heading, Link, Stack, Text, Flex, Button } from "@chakra-ui/core";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { UpdootSection } from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div> query failed </div>;
  }
  return (
    <Layout>
      <Box style={{ backgroundColor: "#fff" }}>
        <NextLink href="/create-post">
          <Flex>
            <Button
              w={"100%"}
              h={"100px"}
              mt="20px"
              mb="20px"
              backgroundColor={"#fff"}
              color={"#0179D3"}
              fontSize={"25px"}
              border={"1px solid #0179D3"}
              shadow={"0.02em 0.02em 0.02em #555"}
            >
              <Link>+new post</Link>
            </Button>
          </Flex>
        </NextLink>

        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8}>
            {!data
              ? null
              : data!.posts.posts.map((p) =>
                  !p ? null : (
                    <Box
                      shadow="md"
                      borderWidth="1px"
                      border="1px solid #666"
                      borderRadius="5px"
                      padding="15px"
                      key={p.id}
                    >
                      <Box>
                        <Flex>
                          <UpdootSection post={p} />
                          <Box>
                            {/* next js way to route */}
                            <NextLink href="post/[id]" as={`/post/${p.id}`}>
                              <Link>
                                <Heading fontSize="xl">{p.title}</Heading>
                              </Link>
                            </NextLink>

                            <Text> posted by {p.creator.username}</Text>
                            <Text mt={4}>{p.textSnippet}</Text>
                          </Box>

                          <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                          />
                        </Flex>
                      </Box>
                    </Box>
                  )
                )}
          </Stack>
        )}
      </Box>

      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => [
              setVariables({
                limit: 5,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              }),
            ]}
            w={"100%"}
            h={"100px"}
            m={"auto"}
            mt={"10px"}
            backgroundColor={"#fff"}
            fontSize={"25px"}
            color={"#0179D3"}
            border={"1px solid #0179D3"}
            shadow={"0.02em 0.02em 0.02em #555"}
          >
            load more...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
