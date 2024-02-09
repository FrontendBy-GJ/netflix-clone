import { MagicUserMetadata } from '@magic-sdk/admin';

export async function myListVideos(token: string, userId: string) {
  const operationsDoc = `
  query myList($userId: String!) {
    stats(where: {userId: {_eq: $userId}, favorited: {_eq: 1}}) {
      videoId
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    'myList',
    {
      userId,
    },
    token
  );
  return response?.data?.stats;
}

export async function watchAgainVideos(token: string, userId: string) {
  const operationsDoc = `
  query watchAgainVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId},
      watched: {_eq: true},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    'watchAgainVideos',
    {
      userId,
    },
    token
  );
  return response?.data?.stats;
}

type Stats = {
  favorited: number;
  userId: string;
  videoId: string;
  watched: boolean;
};

export async function insertStats(
  token: string,
  { favorited, userId, watched, videoId }: Stats
) {
  const operationsDoc = `
  mutation insertStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {
      favorited: $favorited,
      userId: $userId,
      watched: $watched,
      videoId: $videoId
    }) {
        favorited
        userId
    }
  }
`;

  return await queryHasuraGraphQL(
    operationsDoc,
    'insertStats',
    { favorited, userId, watched, videoId },
    token
  );
}

export async function updateStats(
  token: string,
  { favorited, userId, watched, videoId }: Stats
) {
  const operationsDoc = `
mutation updateStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favorited: $favorited},
    where: {
      userId: {_eq: $userId},
      videoId: {_eq: $videoId}
    }) {
    returning {
      favorited,
      userId,
      watched,
      videoId
    }
  }
}
`;
  return await queryHasuraGraphQL(
    operationsDoc,
    'updateStats',
    { favorited, userId, videoId, watched },
    token
  );
}

export async function findVideoByUserId(
  token: string,
  userId: string,
  videoId: string
) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favorited
      watched
    }
  }
`;
  const response = await queryHasuraGraphQL(
    operationsDoc,
    'findVideoIdByUserId',
    {
      videoId,
      userId,
    },
    token
  );
  return response?.data?.stats;
}

export async function isNewUser(token: string, issuer: string) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    'isNewUser',
    { issuer },
    token
  );
  return response?.data?.users?.length === 0;
}

export async function createNewUser(
  token: string,
  metadata: MagicUserMetadata
) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
  `;

  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    'createNewUser',
    { issuer, email, publicAddress },
    token
  );
  return response;
}

async function queryHasuraGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, unknown>,
  token: string
): Promise<any> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_HASURA_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
