import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient, 
} from '@tanstack/react-query'
import { createPost, createUserAccount, signInAccount, signOutAccount, getPostById, getRecentPosts, updatePost, likePost, savePost, deleteSavedPost, getCurrentUser, searchPosts, getInfinitePosts } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {email: string; password: string }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useGetPostById = (postId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
        },
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        postId,
        likesArray,
      }: {
        postId: string;
        likesArray: string[];
      }) => likePost(postId, likesArray),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, userId }: {postId: string; userId: string;}) =>
        savePost(postId, userId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
};

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts,
      getNextPageParam: (lastPage) => {
          if (!lastPage || lastPage.documents.length === 0) return null;
          return lastPage.documents[lastPage.documents.length - 1].$id;
      },
      initialPageParam: undefined, // Set the initial value
  });
};


export const useSearchPost = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm   
    })
}