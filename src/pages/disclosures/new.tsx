import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  createFindingFilterFn,
  disclosure,
  disclosureStatus,
  disclsoureFindingInfo,
  finding,
} from '~/shared/finding';
import { createCompareFn } from '~/shared/helpers';
import { api } from '~/utils/api';

const NewDisclosure: NextPage = () => {
  const { data: findings, status: findingsStatus } =
    api.findings.getFindings.useQuery();
  const [findingSearch, setFindingSearch] = useState('');
  const [newDisclosure, setNewDisclosure] = useState<disclosure | null>(
    new disclosure('', '', '', disclosureStatus.disclosed, '', '', null)
  );
  return (
    <>
      <Head>
        <title>Create New Disclosure</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex h-full w-full flex-col text-white">
          <form className="flex-auto">
            <p className="prose prose-xl ">Create New Disclosure</p>
            <div className="mb-6">
              <span className="relative w-full">
                <input
                  aria-label="search"
                  type="search"
                  id="search"
                  placeholder="Search findings"
                  className="w-full appearance-none rounded border border-transparent bg-gray-900 px-2 py-3 pl-10 leading-normal text-white transition focus:border-gray-400 focus:outline-none"
                  value={findingSearch}
                  onChange={(e) => setFindingSearch(e.target.value)}
                />

                <div
                  className={`min-h-12 m-x-10 max-h-36 w-full overflow-y-scroll bg-slate-400 `}
                >
                  <table className="w-full table-fixed">
                    <tbody>
                      {findings &&
                        findings
                          .sort(createCompareFn('severity', 'desc'))
                          .filter(createFindingFilterFn(findingSearch))
                          .map((f) => (
                            <tr
                              className=" border-b-2 border-gray-900 bg-slate-700 hover:bg-white/20"
                              key={f.id}
                            >
                              <td>
                                <button
                                  onClick={() => {
                                    const d: disclosure = new disclosure(
                                      f.name,
                                      f.host,
                                      f.template,
                                      disclosureStatus.disclosed,
                                      '',
                                      f.matchedAt,
                                      new disclsoureFindingInfo(f)
                                    );
                                    setNewDisclosure(d);
                                  }}
                                >
                                  {f.name}
                                </button>
                              </td>
                              <td>{f.host}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="search-icon absolute"
                  style={{ top: '0.1rem', left: '.8rem' }}
                >
                  <svg
                    className="pointer-events-none h-4 w-4 fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                  </svg>
                </div>
              </span>{' '}
            </div>
            aa{newDisclosure && newDisclosure.name}bb cc
            {newDisclosure && newDisclosure.hosts}dd
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewDisclosure;
