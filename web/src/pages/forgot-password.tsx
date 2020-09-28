import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import React, { useState } from 'react';
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({ }) => {
    const [compelete,setComplete] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    return (
        <>
          <Layout variant="small">
            <Formik initialValues={{email:""}}
        onSubmit={async (values)=> {
            await forgotPassword({ variables: values });
            setComplete(true);
        }}
        >
                {({ isSubmitting }) => compelete ?
                    <>
                        <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Box userSelect={'none'} height={"100px"} fontSize={"25px"} textAlign={"center"}>
                        ✉️an email has been sent✈️
                    </Box>
                    
                    <NextLink href="/">
                    <Link>
                            <Button >
                            go to home
                            </Button>
                        </Link>
                            </NextLink>
                            </Flex>
                        </>
                :(
                <Form>
                        <InputField
                            name="email"
                            placeholder="email"
                            label="email"
                            type ="email"                        
                        />
                        <Button mt={5}
                            isLoading={isSubmitting}
                                type='submit'
                                backgroundColor="#0179D3"
                            variantColor="blue">send</Button>
                    </Form>
        
        )}
        
            </Formik>
            </Layout>
            </>
    )
};

export default withApollo({ ssr: false })(ForgotPassword);