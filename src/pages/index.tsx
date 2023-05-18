import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '~/utils/api';
function createCompareFn<T extends object>(
  property: keyof T,
  sort_order: 'asc' | 'desc'
) {
  const compareFn = (a: T, b: T) => {
    const val1 = a[property];
    const val2 = b[property];
    const order = sort_order !== 'desc' ? 1 : -1;

    switch (typeof val1) {
      case 'number': {
        const valb = val2 as number;
        const result = val1 - valb;
        return result * order;
      }
      case 'string': {
        const valb = val2 as string;
        const result = val1.localeCompare(valb);
        return result * order;
      }
      // add other cases like boolean, etc.
      default:
        return 0;
    }
  };
  return compareFn;
}
const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const { data: findings, status: findingsStatus } =
    api.findings.getFindings.useQuery();
  const f2 = api.findings.getFindings.useQuery();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex h-full w-full flex-col text-white">
          <table className="table-auto">
            <thead className="borderb border-collapse border-gray-600 bg-white/10">
              <tr className="border border-gray-600">
                <th className="border border-gray-600">Finding</th>
                <th className="border border-gray-600">Severity</th>
                <th className="border border-gray-600">Host</th>
                <th className="border border-gray-600">Description</th>
                <th className="border border-gray-600">Template</th>
              </tr>
            </thead>
            <tbody>
              {findings &&
                findings.sort(createCompareFn('severity', 'asc')).map((f) => (
                  <tr className="even:bg-white/5 " key={f.timestamp}>
                    <td className="border border-y-0 border-l-0 border-gray-700">
                      {f.name}
                    </td>
                    <td className="border border-y-0 border-l-0 border-gray-700">
                      {f.severity}
                    </td>
                    <td className="border border-y-0 border-l-0 border-gray-700">
                      {f.host}
                    </td>
                    <td className="border border-y-0 border-l-0 border-gray-700">
                      {f.description}
                    </td>
                    <td className="border border-y-0 border-l-0 border-gray-700">
                      {f.template}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {findingsStatus && findingsStatus == 'loading' && (
          <button
            type="button"
            className="inline-flex cursor-not-allowed items-center rounded-md bg-white px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400"
            disabled
          >
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </button>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : 'Loading tRPC query...'}
          </p>
          <AuthShowcase />
        </div>
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
    </div>
  );
};
