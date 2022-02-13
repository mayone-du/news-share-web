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
  BigInt: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
};

export type CreateNewsInput = {
  url: Scalars['String'];
  nickname: Scalars['String'];
};

export type CreateUserInput = {
  username: Scalars['String'];
  nickname: Scalars['String'];
  email: Scalars['String'];
  role: Role;
  status: Status;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNews?: Maybe<News>;
  updateNews?: Maybe<News>;
  postponeNewsList?: Maybe<Array<Maybe<News>>>;
  deleteNews?: Maybe<News>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
};


export type MutationCreateNewsArgs = {
  input: CreateNewsInput;
};


export type MutationUpdateNewsArgs = {
  input: UpdateNewsInput;
};


export type MutationPostponeNewsListArgs = {
  input: PostponeNewsListInput;
};


export type MutationDeleteNewsArgs = {
  id: Scalars['BigInt'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type News = {
  __typename?: 'News';
  id: Scalars['BigInt'];
  title: Scalars['String'];
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  url: Scalars['String'];
  nickname: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  sharedAt: Scalars['DateTime'];
  nodeId?: Maybe<Scalars['ID']>;
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
  sharedAt: Scalars['DateTime'];
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars['String']>;
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars['String']>;
};

export type PostponeNewsListInput = {
  nodeIds: Array<Scalars['ID']>;
  sharedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  news?: Maybe<News>;
  newsList: Array<News>;
  searchNewsList: Array<News>;
  allNews?: Maybe<NewsConnection>;
  user?: Maybe<User>;
};


export type QueryNewsArgs = {
  id: Scalars['BigInt'];
};


export type QueryNewsListArgs = {
  input: NewsListInput;
};


export type QuerySearchNewsListArgs = {
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
};


export type QueryAllNewsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['BigInt']>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SlackNotification = {
  __typename?: 'SlackNotification';
  id: Scalars['BigInt'];
  isSent: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deleted = 'DELETED'
}

export type UpdateNewsInput = {
  nodeId: Scalars['ID'];
  url?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  sharedAt?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateUserInput = {
  id: Scalars['BigInt'];
  email: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['BigInt'];
  username: Scalars['String'];
  nickname: Scalars['String'];
  email: Scalars['String'];
  role?: Maybe<Role>;
  status?: Maybe<Status>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type NewsFragmentFragment = { __typename?: 'News', id: any, nodeId?: string | null, title: string, description: string, url: string, imageUrl: string, nickname: string, createdAt: any, sharedAt: any };

export type NewsListQueryVariables = Exact<{
  input: NewsListInput;
}>;


export type NewsListQuery = { __typename?: 'Query', newsList: Array<{ __typename?: 'News', id: any, nodeId?: string | null, title: string, description: string, url: string, imageUrl: string, nickname: string, createdAt: any, sharedAt: any }> };

export const NewsFragmentFragmentDoc = gql`
    fragment NewsFragment on News {
  id
  nodeId
  title
  description
  url
  imageUrl
  nickname
  createdAt
  sharedAt
}
    `;
export const NewsListDocument = gql`
    query NewsList($input: NewsListInput!) {
  newsList(input: $input) {
    ...NewsFragment
  }
}
    ${NewsFragmentFragmentDoc}`;

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