import { Box, Heading } from "@chakra-ui/core";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  if (loading) {
    return <Layout>loading...</Layout>;
  }

  if (!data?.post) {
    return <Layout>cout not find post</Layout>;
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
