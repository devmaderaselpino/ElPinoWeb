import { ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
 
    const httpLink = createHttpLink({
        uri: "http://localhost:4000/graphql",
    });

    const authLink = setContext((_,{header})=>{
        return {
            header: {
                ...header,
                authorization: localStorage.getItem("token")
            }
        }
    })

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache
    });

export default client;