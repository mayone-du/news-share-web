import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: bigint;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: string;
};

export type CreateNewsInput = {
  url: Scalars['String'];
};

export type DeleteNewsInput = {
  nodeId: Scalars['ID'];
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTime'];
  id: Scalars['BigInt'];
  isLiked: Scalars['Boolean'];
  news: News;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  authUser?: Maybe<User>;
  createLike?: Maybe<Like>;
  createNews?: Maybe<News>;
  createSlackNotification?: Maybe<SlackNotification>;
  deleteNews?: Maybe<News>;
  postponeNewsList?: Maybe<Array<Maybe<News>>>;
  toggleLike?: Maybe<Like>;
  updateLike?: Maybe<Like>;
  updateMyUserInfo?: Maybe<User>;
  updateNews?: Maybe<News>;
};


export type MutationCreateLikeArgs = {
  input: ToggleLikeInput;
};


export type MutationCreateNewsArgs = {
  input: CreateNewsInput;
};


export type MutationDeleteNewsArgs = {
  input: DeleteNewsInput;
};


export type MutationPostponeNewsListArgs = {
  input: PostponeNewsListInput;
};


export type MutationToggleLikeArgs = {
  input: ToggleLikeInput;
};


export type MutationUpdateLikeArgs = {
  input: ToggleLikeInput;
};


export type MutationUpdateMyUserInfoArgs = {
  input: UpdateMyUserInfoInput;
};


export type MutationUpdateNewsArgs = {
  input: UpdateNewsInput;
};

export type News = {
  __typename?: 'News';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['BigInt'];
  imageUrl?: Maybe<Scalars['String']>;
  isImportant: Scalars['Boolean'];
  isViewed: Scalars['Boolean'];
  likes: Array<Like>;
  nodeId?: Maybe<Scalars['ID']>;
  sharedAt: Scalars['DateTime'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
  user: User;
};

export type NewsConnection = {
  __typename?: 'NewsConnection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<NewsEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type NewsEdge = {
  __typename?: 'NewsEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<News>;
};

export type NewsListInput = {
  sharedAt: Scalars['String'];
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars['String']>;
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PostponeNewsListInput = {
  nodeIds: Array<Scalars['ID']>;
  sharedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allNews?: Maybe<NewsConnection>;
  myUserInfo?: Maybe<User>;
  news?: Maybe<News>;
  newsList: Array<News>;
  searchNewsList: Array<News>;
  slackNotification?: Maybe<SlackNotification>;
  test?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<UserConnection>;
};


export type QueryAllNewsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryNewsArgs = {
  id: Scalars['BigInt'];
};


export type QueryNewsListArgs = {
  input: NewsListInput;
};


export type QuerySearchNewsListArgs = {
  input: SearchNewsListInput;
};


export type QueryTestArgs = {
  customArg?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  input: UserInput;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export enum Role {
  Admin = 'ADMIN',
  Developer = 'DEVELOPER',
  User = 'USER'
}

export type SearchNewsListInput = {
  description: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type SlackNotification = {
  __typename?: 'SlackNotification';
  createdAt: Scalars['DateTime'];
  id: Scalars['BigInt'];
  isSent: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export enum Status {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Inactive = 'INACTIVE'
}

export type ToggleLikeInput = {
  isLiked: Scalars['Boolean'];
  newsId: Scalars['BigInt'];
};

export type UpdateMyUserInfoInput = {
  displayName: Scalars['String'];
  selfIntroduction: Scalars['String'];
};

export type UpdateNewsInput = {
  description?: InputMaybe<Scalars['String']>;
  isImportant?: InputMaybe<Scalars['Boolean']>;
  isViewed?: InputMaybe<Scalars['Boolean']>;
  nodeId: Scalars['ID'];
  sharedAt?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  displayName: Scalars['String'];
  id: Scalars['BigInt'];
  likes: Array<Like>;
  newsList: Array<News>;
  oauthUserId: Scalars['String'];
  photoUrl: Scalars['String'];
  role?: Maybe<Role>;
  selfIntroduction: Scalars['String'];
  status?: Maybe<Status>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<User>;
};

export type UserInput = {
  oauthUserId: Scalars['String'];
};

export type LikeFragmentFragment = { __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } };

export type NewsFragmentFragment = { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string };

export type PageInfoFragmentFragment = { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null };

export type SlackNotificationFragmentFragment = { __typename?: 'SlackNotification', id: bigint, isSent: boolean, createdAt: string, updatedAt: string };

export type UserFragmentFragment = { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null };

export type ToggleLikeMutationVariables = Exact<{
  input: ToggleLikeInput;
}>;


export type ToggleLikeMutation = { __typename?: 'Mutation', toggleLike?: { __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } } | null };

export type CreateNewsMutationVariables = Exact<{
  input: CreateNewsInput;
}>;


export type CreateNewsMutation = { __typename?: 'Mutation', createNews?: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } } | null };

export type DeleteNewsMutationVariables = Exact<{
  input: DeleteNewsInput;
}>;


export type DeleteNewsMutation = { __typename?: 'Mutation', deleteNews?: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string } | null };

export type PostponeNewsListMutationVariables = Exact<{
  input: PostponeNewsListInput;
}>;


export type PostponeNewsListMutation = { __typename?: 'Mutation', postponeNewsList?: Array<{ __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } } | null> | null };

export type UpdateNewsMutationVariables = Exact<{
  input: UpdateNewsInput;
}>;


export type UpdateNewsMutation = { __typename?: 'Mutation', updateNews?: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } } | null };

export type NewsListQueryVariables = Exact<{
  input: NewsListInput;
}>;


export type NewsListQuery = { __typename?: 'Query', newsList: Array<{ __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }> };

export type SearchNewsListQueryVariables = Exact<{
  input: SearchNewsListInput;
}>;


export type SearchNewsListQuery = { __typename?: 'Query', searchNewsList: Array<{ __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }> };

export type CreateSlackNotificationMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateSlackNotificationMutation = { __typename?: 'Mutation', createSlackNotification?: { __typename?: 'SlackNotification', id: bigint, isSent: boolean, createdAt: string, updatedAt: string } | null };

export type SlackNotificationQueryVariables = Exact<{ [key: string]: never; }>;


export type SlackNotificationQuery = { __typename?: 'Query', slackNotification?: { __typename?: 'SlackNotification', id: bigint, isSent: boolean, createdAt: string, updatedAt: string } | null };

export type TestQueryVariables = Exact<{
  customArg: Scalars['String'];
}>;


export type TestQuery = { __typename?: 'Query', test?: string | null };

export type AuthUserMutationVariables = Exact<{ [key: string]: never; }>;


export type AuthUserMutation = { __typename?: 'Mutation', authUser?: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } | null };

export type UpdateMyUserInfoMutationVariables = Exact<{
  input: UpdateMyUserInfoInput;
}>;


export type UpdateMyUserInfoMutation = { __typename?: 'Mutation', updateMyUserInfo?: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } | null };

export type MyUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUserInfoQuery = { __typename?: 'Query', myUserInfo?: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } | null };

export type UserQueryVariables = Exact<{
  input: UserInput;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null, likes: Array<{ __typename?: 'Like', id: bigint, isLiked: boolean, createdAt: string, updatedAt: string, news: { __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }, user: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } }>, newsList: Array<{ __typename?: 'News', id: bigint, nodeId?: string | null, title: string, description: string, url: string, imageUrl?: string | null, isViewed: boolean, isImportant: boolean, createdAt: string, updatedAt: string, sharedAt: string }> } | null };

export type UsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
}>;


export type UsersQuery = { __typename?: 'Query', users?: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'UserEdge', cursor: string, node?: { __typename?: 'User', id: bigint, oauthUserId: string, displayName: string, selfIntroduction: string, photoUrl: string, role?: Role | null, status?: Status | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null } } | null };

export const NewsFragmentFragmentDoc = gql`
    fragment NewsFragment on News {
  id
  nodeId
  title
  description
  url
  imageUrl
  isViewed
  isImportant
  createdAt
  updatedAt
  sharedAt
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  oauthUserId
  displayName
  selfIntroduction
  photoUrl
  role
  status
}
    `;
export const LikeFragmentFragmentDoc = gql`
    fragment LikeFragment on Like {
  id
  isLiked
  createdAt
  updatedAt
  news {
    ...NewsFragment
  }
  user {
    ...UserFragment
  }
}
    ${NewsFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export const PageInfoFragmentFragmentDoc = gql`
    fragment PageInfoFragment on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
export const SlackNotificationFragmentFragmentDoc = gql`
    fragment SlackNotificationFragment on SlackNotification {
  id
  isSent
  createdAt
  updatedAt
}
    `;
export const ToggleLikeDocument = gql`
    mutation ToggleLike($input: ToggleLikeInput!) {
  toggleLike(input: $input) {
    ...LikeFragment
  }
}
    ${LikeFragmentFragmentDoc}`;
export type ToggleLikeMutationFn = Apollo.MutationFunction<ToggleLikeMutation, ToggleLikeMutationVariables>;

/**
 * __useToggleLikeMutation__
 *
 * To run a mutation, you first call `useToggleLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikeMutation, { data, loading, error }] = useToggleLikeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLikeMutation(baseOptions?: Apollo.MutationHookOptions<ToggleLikeMutation, ToggleLikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleLikeMutation, ToggleLikeMutationVariables>(ToggleLikeDocument, options);
      }
export type ToggleLikeMutationHookResult = ReturnType<typeof useToggleLikeMutation>;
export type ToggleLikeMutationResult = Apollo.MutationResult<ToggleLikeMutation>;
export type ToggleLikeMutationOptions = Apollo.BaseMutationOptions<ToggleLikeMutation, ToggleLikeMutationVariables>;
export const CreateNewsDocument = gql`
    mutation CreateNews($input: CreateNewsInput!) {
  createNews(input: $input) {
    ...NewsFragment
    likes {
      ...LikeFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${NewsFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export type CreateNewsMutationFn = Apollo.MutationFunction<CreateNewsMutation, CreateNewsMutationVariables>;

/**
 * __useCreateNewsMutation__
 *
 * To run a mutation, you first call `useCreateNewsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewsMutation, { data, loading, error }] = useCreateNewsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNewsMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewsMutation, CreateNewsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewsMutation, CreateNewsMutationVariables>(CreateNewsDocument, options);
      }
export type CreateNewsMutationHookResult = ReturnType<typeof useCreateNewsMutation>;
export type CreateNewsMutationResult = Apollo.MutationResult<CreateNewsMutation>;
export type CreateNewsMutationOptions = Apollo.BaseMutationOptions<CreateNewsMutation, CreateNewsMutationVariables>;
export const DeleteNewsDocument = gql`
    mutation DeleteNews($input: DeleteNewsInput!) {
  deleteNews(input: $input) {
    ...NewsFragment
  }
}
    ${NewsFragmentFragmentDoc}`;
export type DeleteNewsMutationFn = Apollo.MutationFunction<DeleteNewsMutation, DeleteNewsMutationVariables>;

/**
 * __useDeleteNewsMutation__
 *
 * To run a mutation, you first call `useDeleteNewsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNewsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNewsMutation, { data, loading, error }] = useDeleteNewsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteNewsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNewsMutation, DeleteNewsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNewsMutation, DeleteNewsMutationVariables>(DeleteNewsDocument, options);
      }
export type DeleteNewsMutationHookResult = ReturnType<typeof useDeleteNewsMutation>;
export type DeleteNewsMutationResult = Apollo.MutationResult<DeleteNewsMutation>;
export type DeleteNewsMutationOptions = Apollo.BaseMutationOptions<DeleteNewsMutation, DeleteNewsMutationVariables>;
export const PostponeNewsListDocument = gql`
    mutation PostponeNewsList($input: PostponeNewsListInput!) {
  postponeNewsList(input: $input) {
    ...NewsFragment
    likes {
      ...LikeFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${NewsFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export type PostponeNewsListMutationFn = Apollo.MutationFunction<PostponeNewsListMutation, PostponeNewsListMutationVariables>;

/**
 * __usePostponeNewsListMutation__
 *
 * To run a mutation, you first call `usePostponeNewsListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostponeNewsListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postponeNewsListMutation, { data, loading, error }] = usePostponeNewsListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostponeNewsListMutation(baseOptions?: Apollo.MutationHookOptions<PostponeNewsListMutation, PostponeNewsListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostponeNewsListMutation, PostponeNewsListMutationVariables>(PostponeNewsListDocument, options);
      }
export type PostponeNewsListMutationHookResult = ReturnType<typeof usePostponeNewsListMutation>;
export type PostponeNewsListMutationResult = Apollo.MutationResult<PostponeNewsListMutation>;
export type PostponeNewsListMutationOptions = Apollo.BaseMutationOptions<PostponeNewsListMutation, PostponeNewsListMutationVariables>;
export const UpdateNewsDocument = gql`
    mutation UpdateNews($input: UpdateNewsInput!) {
  updateNews(input: $input) {
    ...NewsFragment
    likes {
      ...LikeFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${NewsFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export type UpdateNewsMutationFn = Apollo.MutationFunction<UpdateNewsMutation, UpdateNewsMutationVariables>;

/**
 * __useUpdateNewsMutation__
 *
 * To run a mutation, you first call `useUpdateNewsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNewsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNewsMutation, { data, loading, error }] = useUpdateNewsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNewsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNewsMutation, UpdateNewsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNewsMutation, UpdateNewsMutationVariables>(UpdateNewsDocument, options);
      }
export type UpdateNewsMutationHookResult = ReturnType<typeof useUpdateNewsMutation>;
export type UpdateNewsMutationResult = Apollo.MutationResult<UpdateNewsMutation>;
export type UpdateNewsMutationOptions = Apollo.BaseMutationOptions<UpdateNewsMutation, UpdateNewsMutationVariables>;
export const NewsListDocument = gql`
    query NewsList($input: NewsListInput!) {
  newsList(input: $input) {
    ...NewsFragment
    likes {
      ...LikeFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${NewsFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;

/**
 * __useNewsListQuery__
 *
 * To run a query within a React component, call `useNewsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewsListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNewsListQuery(baseOptions: Apollo.QueryHookOptions<NewsListQuery, NewsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewsListQuery, NewsListQueryVariables>(NewsListDocument, options);
      }
export function useNewsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewsListQuery, NewsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewsListQuery, NewsListQueryVariables>(NewsListDocument, options);
        }
export type NewsListQueryHookResult = ReturnType<typeof useNewsListQuery>;
export type NewsListLazyQueryHookResult = ReturnType<typeof useNewsListLazyQuery>;
export type NewsListQueryResult = Apollo.QueryResult<NewsListQuery, NewsListQueryVariables>;
export const SearchNewsListDocument = gql`
    query SearchNewsList($input: SearchNewsListInput!) {
  searchNewsList(input: $input) {
    ...NewsFragment
    likes {
      ...LikeFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${NewsFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;

/**
 * __useSearchNewsListQuery__
 *
 * To run a query within a React component, call `useSearchNewsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchNewsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchNewsListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchNewsListQuery(baseOptions: Apollo.QueryHookOptions<SearchNewsListQuery, SearchNewsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchNewsListQuery, SearchNewsListQueryVariables>(SearchNewsListDocument, options);
      }
export function useSearchNewsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchNewsListQuery, SearchNewsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchNewsListQuery, SearchNewsListQueryVariables>(SearchNewsListDocument, options);
        }
export type SearchNewsListQueryHookResult = ReturnType<typeof useSearchNewsListQuery>;
export type SearchNewsListLazyQueryHookResult = ReturnType<typeof useSearchNewsListLazyQuery>;
export type SearchNewsListQueryResult = Apollo.QueryResult<SearchNewsListQuery, SearchNewsListQueryVariables>;
export const CreateSlackNotificationDocument = gql`
    mutation CreateSlackNotification {
  createSlackNotification {
    ...SlackNotificationFragment
  }
}
    ${SlackNotificationFragmentFragmentDoc}`;
export type CreateSlackNotificationMutationFn = Apollo.MutationFunction<CreateSlackNotificationMutation, CreateSlackNotificationMutationVariables>;

/**
 * __useCreateSlackNotificationMutation__
 *
 * To run a mutation, you first call `useCreateSlackNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSlackNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSlackNotificationMutation, { data, loading, error }] = useCreateSlackNotificationMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateSlackNotificationMutation(baseOptions?: Apollo.MutationHookOptions<CreateSlackNotificationMutation, CreateSlackNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSlackNotificationMutation, CreateSlackNotificationMutationVariables>(CreateSlackNotificationDocument, options);
      }
export type CreateSlackNotificationMutationHookResult = ReturnType<typeof useCreateSlackNotificationMutation>;
export type CreateSlackNotificationMutationResult = Apollo.MutationResult<CreateSlackNotificationMutation>;
export type CreateSlackNotificationMutationOptions = Apollo.BaseMutationOptions<CreateSlackNotificationMutation, CreateSlackNotificationMutationVariables>;
export const SlackNotificationDocument = gql`
    query SlackNotification {
  slackNotification {
    ...SlackNotificationFragment
  }
}
    ${SlackNotificationFragmentFragmentDoc}`;

/**
 * __useSlackNotificationQuery__
 *
 * To run a query within a React component, call `useSlackNotificationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlackNotificationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlackNotificationQuery({
 *   variables: {
 *   },
 * });
 */
export function useSlackNotificationQuery(baseOptions?: Apollo.QueryHookOptions<SlackNotificationQuery, SlackNotificationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SlackNotificationQuery, SlackNotificationQueryVariables>(SlackNotificationDocument, options);
      }
export function useSlackNotificationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SlackNotificationQuery, SlackNotificationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SlackNotificationQuery, SlackNotificationQueryVariables>(SlackNotificationDocument, options);
        }
export type SlackNotificationQueryHookResult = ReturnType<typeof useSlackNotificationQuery>;
export type SlackNotificationLazyQueryHookResult = ReturnType<typeof useSlackNotificationLazyQuery>;
export type SlackNotificationQueryResult = Apollo.QueryResult<SlackNotificationQuery, SlackNotificationQueryVariables>;
export const TestDocument = gql`
    query Test($customArg: String!) {
  test(customArg: $customArg)
}
    `;

/**
 * __useTestQuery__
 *
 * To run a query within a React component, call `useTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestQuery({
 *   variables: {
 *      customArg: // value for 'customArg'
 *   },
 * });
 */
export function useTestQuery(baseOptions: Apollo.QueryHookOptions<TestQuery, TestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestQuery, TestQueryVariables>(TestDocument, options);
      }
export function useTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQuery, TestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestQuery, TestQueryVariables>(TestDocument, options);
        }
export type TestQueryHookResult = ReturnType<typeof useTestQuery>;
export type TestLazyQueryHookResult = ReturnType<typeof useTestLazyQuery>;
export type TestQueryResult = Apollo.QueryResult<TestQuery, TestQueryVariables>;
export const AuthUserDocument = gql`
    mutation AuthUser {
  authUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type AuthUserMutationFn = Apollo.MutationFunction<AuthUserMutation, AuthUserMutationVariables>;

/**
 * __useAuthUserMutation__
 *
 * To run a mutation, you first call `useAuthUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authUserMutation, { data, loading, error }] = useAuthUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useAuthUserMutation(baseOptions?: Apollo.MutationHookOptions<AuthUserMutation, AuthUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthUserMutation, AuthUserMutationVariables>(AuthUserDocument, options);
      }
export type AuthUserMutationHookResult = ReturnType<typeof useAuthUserMutation>;
export type AuthUserMutationResult = Apollo.MutationResult<AuthUserMutation>;
export type AuthUserMutationOptions = Apollo.BaseMutationOptions<AuthUserMutation, AuthUserMutationVariables>;
export const UpdateMyUserInfoDocument = gql`
    mutation UpdateMyUserInfo($input: UpdateMyUserInfoInput!) {
  updateMyUserInfo(input: $input) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type UpdateMyUserInfoMutationFn = Apollo.MutationFunction<UpdateMyUserInfoMutation, UpdateMyUserInfoMutationVariables>;

/**
 * __useUpdateMyUserInfoMutation__
 *
 * To run a mutation, you first call `useUpdateMyUserInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyUserInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyUserInfoMutation, { data, loading, error }] = useUpdateMyUserInfoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMyUserInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMyUserInfoMutation, UpdateMyUserInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMyUserInfoMutation, UpdateMyUserInfoMutationVariables>(UpdateMyUserInfoDocument, options);
      }
export type UpdateMyUserInfoMutationHookResult = ReturnType<typeof useUpdateMyUserInfoMutation>;
export type UpdateMyUserInfoMutationResult = Apollo.MutationResult<UpdateMyUserInfoMutation>;
export type UpdateMyUserInfoMutationOptions = Apollo.BaseMutationOptions<UpdateMyUserInfoMutation, UpdateMyUserInfoMutationVariables>;
export const MyUserInfoDocument = gql`
    query MyUserInfo {
  myUserInfo {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMyUserInfoQuery__
 *
 * To run a query within a React component, call `useMyUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<MyUserInfoQuery, MyUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyUserInfoQuery, MyUserInfoQueryVariables>(MyUserInfoDocument, options);
      }
export function useMyUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyUserInfoQuery, MyUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyUserInfoQuery, MyUserInfoQueryVariables>(MyUserInfoDocument, options);
        }
export type MyUserInfoQueryHookResult = ReturnType<typeof useMyUserInfoQuery>;
export type MyUserInfoLazyQueryHookResult = ReturnType<typeof useMyUserInfoLazyQuery>;
export type MyUserInfoQueryResult = Apollo.QueryResult<MyUserInfoQuery, MyUserInfoQueryVariables>;
export const UserDocument = gql`
    query User($input: UserInput!) {
  user(input: $input) {
    ...UserFragment
    likes {
      ...LikeFragment
    }
    newsList {
      ...NewsFragment
    }
  }
}
    ${UserFragmentFragmentDoc}
${LikeFragmentFragmentDoc}
${NewsFragmentFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($first: Int = 100) {
  users(first: $first) {
    edges {
      node {
        ...UserFragment
      }
      cursor
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${UserFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;