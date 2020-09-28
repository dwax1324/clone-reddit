import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";
interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <>
      <Layout variant="small">
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  },
                });
              },
            });
            if (response.data?.register.errors) {
              [{ field: "username", message: "something wrong" }];
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              //worked
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mb={5} mt={5}>
                <InputField name="email" placeholder="email" label="email" />
              </Box>
              <Box mb={5} mt={5}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>

              <Button
                isLoading={isSubmitting}
                type="submit"
                backgroundColor="#0179D3"
                variantColor="blue"
              >
                register
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
};

export default withApollo({ ssr: false })(Register);
