import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../../../components/Layout";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import InputField from "../../../components/InputField";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useGetIntId } from "../../../utils/useGetIntId";
import { withApollo } from "../../../utils/withApollo";

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return <Layout>loading...</Layout>;
  }
  if (!data?.post) {
    return <Layout>cout not find post</Layout>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data.post.title,
          text: data.post.text,
        }}
        onSubmit={async (values, {}) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="title" />
            <Box mb={5} mt={5}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="text"
                type="text"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              type="submit"
              backgroundColor="#0179D3"
              variantColor="blue"
              color="white"
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
