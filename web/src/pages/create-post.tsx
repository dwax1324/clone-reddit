import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import React from 'react'
import InputField from '../components/InputField'
import { useCreatePostMutation } from '../generated/graphql';
import {useRouter} from "next/router"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';


const CreatePost: React.FC<{}> = ({ }) => {
    const router = useRouter();
    useIsAuth();
    const [,createPost] = useCreatePostMutation();
    return (
        <Layout variant='small'>
            <Formik initialValues={{
            title: "",
            text: ""
        }}
        onSubmit={async (values , {})=> {
            const { error } = await createPost({ input: values })
            if (!error) {
                router.push('/');
            }
        }}
        >
                {({ isSubmitting }) => (
                <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="title"
                        
                        />
                        <Box mb={5} mt ={5}>
                        
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
                            type='submit'
                                backgroundColor="#0179D3"
                                variantColor="blue"
                                color="white"
                            >post</Button>
                    </Form>
        
        )}
        
            </Formik>
            </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);