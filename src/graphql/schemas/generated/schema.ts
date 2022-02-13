import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  SocialCamelJSON: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

export type CreateTaskMutationInput = {
  title: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  taskImage?: Maybe<Scalars['Upload']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTaskMutationPayload = {
  __typename?: 'CreateTaskMutationPayload';
  task?: Maybe<TaskNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};


export type DeleteTaskMutationInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTaskMutationPayload = {
  __typename?: 'DeleteTaskMutationPayload';
  task?: Maybe<TaskNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Social Auth Mutation */
  socialAuth?: Maybe<SocialAuth>;
  createTask?: Maybe<CreateTaskMutationPayload>;
  updateTask?: Maybe<UpdateTaskMutationPayload>;
  deleteTask?: Maybe<DeleteTaskMutationPayload>;
};


export type MutationSocialAuthArgs = {
  accessToken: Scalars['String'];
  provider: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskMutationInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskMutationInput;
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<UserNode>;
  allUsers?: Maybe<UserNodeConnection>;
  myUserInfo?: Maybe<UserNode>;
  task?: Maybe<TaskNode>;
  myAllTasks?: Maybe<TaskNodeConnection>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryAllUsersArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  username_Icontains?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_Icontains?: Maybe<Scalars['String']>;
  isStaff?: Maybe<Scalars['Boolean']>;
};


export type QueryTaskArgs = {
  id: Scalars['ID'];
};


export type QueryMyAllTasksArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  title_Icontains?: Maybe<Scalars['String']>;
};

/** Social Auth Mutation */
export type SocialAuth = {
  __typename?: 'SocialAuth';
  social?: Maybe<SocialType>;
};


export type SocialNode = Node & {
  __typename?: 'SocialNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  user: UserNode;
  provider: Scalars['String'];
  uid: Scalars['String'];
  extraData?: Maybe<Scalars['SocialCamelJSON']>;
  created: Scalars['DateTime'];
  modified: Scalars['DateTime'];
};

export type SocialNodeConnection = {
  __typename?: 'SocialNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SocialNodeEdge>>;
};

/** A Relay edge containing a `SocialNode` and its cursor. */
export type SocialNodeEdge = {
  __typename?: 'SocialNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<SocialNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type SocialType = {
  __typename?: 'SocialType';
  id: Scalars['ID'];
  user: UserNode;
  provider: Scalars['String'];
  uid: Scalars['String'];
  extraData?: Maybe<Scalars['SocialCamelJSON']>;
  created: Scalars['DateTime'];
  modified: Scalars['DateTime'];
};

export type Subscription = {
  __typename?: 'Subscription';
  countSeconds?: Maybe<Scalars['Float']>;
};


export type SubscriptionCountSecondsArgs = {
  upTo?: Maybe<Scalars['Int']>;
};

export type TaskNode = Node & {
  __typename?: 'TaskNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  createUser: UserNode;
  title: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  taskImage?: Maybe<Scalars['String']>;
  isDone: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type TaskNodeConnection = {
  __typename?: 'TaskNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TaskNodeEdge>>;
};

/** A Relay edge containing a `TaskNode` and its cursor. */
export type TaskNodeEdge = {
  __typename?: 'TaskNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<TaskNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type UpdateTaskMutationInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  isDone?: Maybe<Scalars['Boolean']>;
  taskImage?: Maybe<Scalars['Upload']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTaskMutationPayload = {
  __typename?: 'UpdateTaskMutationPayload';
  task?: Maybe<TaskNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};


export type UserNode = Node & {
  __typename?: 'UserNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  password: Scalars['String'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  /** 全ての権限を持っているとみなされます。 */
  isSuperuser: Scalars['Boolean'];
  username: Scalars['String'];
  email: Scalars['String'];
  isActive: Scalars['Boolean'];
  isStaff: Scalars['Boolean'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  createUser: TaskNodeConnection;
  socialAuth: SocialNodeConnection;
};


export type UserNodeCreateUserArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  title_Icontains?: Maybe<Scalars['String']>;
};


export type UserNodeSocialAuthArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  uid?: Maybe<Scalars['String']>;
  uid_In?: Maybe<Array<Maybe<Scalars['String']>>>;
  provider?: Maybe<Scalars['String']>;
  provider_In?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UserNodeConnection = {
  __typename?: 'UserNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserNodeEdge>>;
};

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
  __typename?: 'UserNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<UserNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type SocialAuthMutationVariables = Exact<{
  accessToken: Scalars['String'];
}>;


export type SocialAuthMutation = (
  { __typename?: 'Mutation' }
  & { socialAuth?: Maybe<(
    { __typename?: 'SocialAuth' }
    & { social?: Maybe<(
      { __typename?: 'SocialType' }
      & Pick<SocialType, 'id' | 'provider' | 'uid' | 'extraData' | 'created' | 'modified'>
      & { user: (
        { __typename?: 'UserNode' }
        & Pick<UserNode, 'id' | 'email' | 'isActive'>
      ) }
    )> }
  )> }
);

export type GetMyUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyUserInfoQuery = (
  { __typename?: 'Query' }
  & { myUserInfo?: Maybe<(
    { __typename?: 'UserNode' }
    & Pick<UserNode, 'id' | 'email' | 'username'>
  )> }
);

export type CountSecondsSubscriptionVariables = Exact<{
  seconds: Scalars['Int'];
}>;


export type CountSecondsSubscription = (
  { __typename?: 'Subscription' }
  & Pick<Subscription, 'countSeconds'>
);


export const SocialAuthDocument = gql`
    mutation SocialAuth($accessToken: String!) {
  socialAuth(provider: "google-oauth2", accessToken: $accessToken) {
    social {
      id
      user {
        id
        email
        isActive
      }
      provider
      uid
      extraData
      created
      modified
    }
  }
}
    `;
export type SocialAuthMutationFn = Apollo.MutationFunction<SocialAuthMutation, SocialAuthMutationVariables>;

/**
 * __useSocialAuthMutation__
 *
 * To run a mutation, you first call `useSocialAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialAuthMutation, { data, loading, error }] = useSocialAuthMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useSocialAuthMutation(baseOptions?: Apollo.MutationHookOptions<SocialAuthMutation, SocialAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SocialAuthMutation, SocialAuthMutationVariables>(SocialAuthDocument, options);
      }
export type SocialAuthMutationHookResult = ReturnType<typeof useSocialAuthMutation>;
export type SocialAuthMutationResult = Apollo.MutationResult<SocialAuthMutation>;
export type SocialAuthMutationOptions = Apollo.BaseMutationOptions<SocialAuthMutation, SocialAuthMutationVariables>;
export const GetMyUserInfoDocument = gql`
    query GetMyUserInfo {
  myUserInfo {
    id
    email
    username
  }
}
    `;

/**
 * __useGetMyUserInfoQuery__
 *
 * To run a query within a React component, call `useGetMyUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetMyUserInfoQuery, GetMyUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyUserInfoQuery, GetMyUserInfoQueryVariables>(GetMyUserInfoDocument, options);
      }
export function useGetMyUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyUserInfoQuery, GetMyUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyUserInfoQuery, GetMyUserInfoQueryVariables>(GetMyUserInfoDocument, options);
        }
export type GetMyUserInfoQueryHookResult = ReturnType<typeof useGetMyUserInfoQuery>;
export type GetMyUserInfoLazyQueryHookResult = ReturnType<typeof useGetMyUserInfoLazyQuery>;
export type GetMyUserInfoQueryResult = Apollo.QueryResult<GetMyUserInfoQuery, GetMyUserInfoQueryVariables>;
export const CountSecondsDocument = gql`
    subscription CountSeconds($seconds: Int!) {
  countSeconds(upTo: $seconds)
}
    `;

/**
 * __useCountSecondsSubscription__
 *
 * To run a query within a React component, call `useCountSecondsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCountSecondsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountSecondsSubscription({
 *   variables: {
 *      seconds: // value for 'seconds'
 *   },
 * });
 */
export function useCountSecondsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CountSecondsSubscription, CountSecondsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CountSecondsSubscription, CountSecondsSubscriptionVariables>(CountSecondsDocument, options);
      }
export type CountSecondsSubscriptionHookResult = ReturnType<typeof useCountSecondsSubscription>;
export type CountSecondsSubscriptionResult = Apollo.SubscriptionResult<CountSecondsSubscription>;