import { Box, Flex, Link, Button} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { createClient } from 'urql';
import Wrapper from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import InputField from '../components/InputField'
import { useForgotPasswordMutation } from '../generated/graphql';
import { NavBar } from '../components/NavBar';
import Layout from '../components/Layout';

const ForgotPassword: React.FC<{}> = ({ }) => {
    const [compelete,setComplete] = useState(false);
    const [,forgotPassword] = useForgotPasswordMutation();
    return (
        <>
          <Layout variant="small">
            <Formik initialValues={{email:""}}
        onSubmit={async (values)=> {
            await forgotPassword(values);
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

export default withUrqlClient(createUrqlClient)(ForgotPassword);