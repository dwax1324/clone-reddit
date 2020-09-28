import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import { NavBar } from '../../components/NavBar';
import {
  MeQuery,
  useChangePasswordMutation,
  MeDocument,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage<{ token: string }> = ({ }) => {
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');
    const [changePassword] = useChangePasswordMutation();
    return (
        <>
            <NavBar/>
            <Formik initialValues={{ newPassword:"" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({
                  variables: {
                    newPassword: values.newPassword,
                    token:
                      typeof router.query.token === "string"
                        ? router.query.token
                        : "",
                  },
                  update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: "Query",
                        me: data?.changePassword.user,
                      },
                    });
                  },
                });
                if (response.data?.changePassword.errors) {
                    const errorMap = toErrorMap(response.data.changePassword.errors);
                    if ('token' in errorMap) {
                        setTokenError(errorMap.token);
                    }
                    setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        //worked
                        router.push('/');
                    }
                }}
                >
            {({ isSubmitting }) => (
                <Form>
                    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>              
                        <Box w={"30%"}>
                            <Box mb={'2%'} mt={'2%'}>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                        label="New password"
                        type="password"
                        />
                                </Box>
                                <Box display={'flex'}>
                            <Box>
                                {tokenError ? <Box color={'#F00'}>{tokenError}</Box> : ""}
                            </Box>
                            <Button bg={"#FFF"} ml={'auto'}  w={'100px'} h={'40px'}>
                            <NextLink href="/forgot-password">
                                <Link>expired?<br/> click to resend</Link>
                                </NextLink>
                                    </Button>
                                    </Box>
                        <Button
                            isLoading={isSubmitting}
                                type='submit'
                                backgroundColor="#0179D3"
                            variantColor="blue">
                            change password
                            </Button>
                        </Box>
                        </Flex>
                    </Form>
        
        )}
            </Formik>
        
            </>
    );
}


export default withApollo({ ssr: false })(ChangePassword);