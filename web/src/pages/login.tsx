import React from 'react'
import {Formik, Form} from 'formik'
import { Box,Button,Flex,Link } from '@chakra-ui/core';
import Wrapper from "../components/Wrapper"
import InputField  from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link'
import { NavBar } from '../components/NavBar';
import Layout from '../components/Layout';
interface loginProps {
}


const Login: React.FC<loginProps> = ({ }) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
        <>
        
        <Layout variant="small">
            <Formik initialValues={{
            usernameOrEmail: "",
            password: ""    
        }}
        onSubmit={async (values , {setErrors})=> {
            const response = await login(values);
            if (response.data?.login.errors) {
                [{field:'username',message:'something wrong'}]
                setErrors(toErrorMap(response.data.login.errors))
            } else if (response.data?.login.user) {
                
                if (typeof router.query.next === 'string') {
                    router.push(router.query.next);
                } else {
                    router.push('/');
                }
                //worked
            }
        }}
        >
                {({ isSubmitting }) => (
                <Form>
                        <InputField
                            name="usernameOrEmail"
                            placeholder="username or Email"
                            label="Username or Email"
                        
                        />
                        <Box mb={5} mt ={5}>
                        
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                            />
                        </Box>
                        <Flex>
                            <Box ml={'auto'}>
                                <NextLink href='/forgot-password'>
                                    <Link>
                                        forgot password?
                                             </Link>
                                         </NextLink>
                        </Box>
                            </Flex>
                        <Button
                            isLoading={isSubmitting}
                            type='submit'
                                backgroundColor="#0179D3"
                                variantColor="blue"
                                color="white"
                            >login</Button>
                    </Form>
        
        )}
        
            </Formik>
            </Layout>
            </>
    )   
}

export default withUrqlClient(createUrqlClient)(Login);