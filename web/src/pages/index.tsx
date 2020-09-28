import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { useState } from "react";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import Layout from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { PostQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore , variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
  });

  if (!loading && !data) {
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

        {!data && loading ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8} style={{ backgroundColor: "#fff" }}>
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
                    backgroundColor={"white !important"}
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
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostQuery
                //   }

                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostQuery).post.hasMore,
                //       posts: [
                //         ...(previousValue as PostQuery).posts.posts,
                //         ...(fetchMoreResult as PostQuery).post.posts
                //       ]
                //     }
                //   }

                // }
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

export default withApollo({ ssr:true })(Index);
