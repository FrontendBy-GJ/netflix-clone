import { verifyToken } from '@/lib/utils';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

const useRedirectUser = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const token = context.req ? context.req.cookies?.token : null;
  let userId;

  if (token) {
    userId = (await verifyToken(token)) as string;
  }

  return { token, userId };
};

export default useRedirectUser;
