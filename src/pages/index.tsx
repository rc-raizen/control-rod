/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  severity,
  type finding,
  createFindingFilterFn,
} from '~/shared/finding';
import { api } from '~/utils/api';
import { useAtom } from 'jotai';
import { atomSearch } from '~/shared/atoms';
import { createCompareFn } from '~/shared/helpers';
import moment from 'moment';
import { DisclosureStatusTag } from '~/components/disclosure-status';
import { FindingsDetailBlock } from '~/components/findings/findings-detail-block';
import { SeverityLabel } from '~/components/findings/severity-label';
import { ScanInformationBlock } from '~/components/findings/scan-info-block';

const Home: NextPage = () => {
  const [expanded, setExpanded] = useState('');
  const [search] = useAtom(atomSearch);
  const { data: findings, status: findingsStatus } =
    api.findings.getFindings.useQuery();

  return (
    <>
      <Head>
        <title>Findings</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container flex flex-col items-center justify-center gap-12 px-2 py-16 ">
        <div className="flex h-full w-full flex-col text-white">
          <table className="table-auto">
            <thead className="borderb border-collapse border-gray-600 bg-white/10">
              <tr className="border border-gray-600">
                <th className="border border-gray-600">Finding</th>
                <th className="border border-gray-600">Severity</th>
                <th className="border border-gray-600">Host</th>

                <th className="border border-gray-600">Description</th>
                <th className="border border-gray-600">Disclosure</th>
                <th className="border border-gray-600">Template</th>
              </tr>
            </thead>
            <tbody>
              {findings &&
                findings
                  .sort(createCompareFn('severity', 'desc'))
                  .filter(createFindingFilterFn(search))
                  .map((f) => (
                    <>
                      <tr
                        onClick={() => {
                          setExpanded(f.id);
                        }}
                        className="every_two_rows hover:cursor-pointer hover:bg-white/20"
                        key={f.id}
                      >
                        <td className="border border-y-0 border-l-0 border-gray-700  ">
                          {f.name}
                        </td>
                        <td className="border  border-y-0 border-l-0 border-gray-700  px-1 text-center  ">
                          <SeverityLabel sval={f.severity} />
                        </td>
                        <td className="border border-y-0 border-l-0 border-gray-700 px-1">
                          {f.host}
                        </td>
                        <td className="border border-y-0 border-l-0 border-gray-700 px-1">
                          {f.description}
                        </td>
                        <td className="border border-y-0 border-l-0 border-gray-700 px-1">
                          {f.disclosure?.status ?? 'Not Started'}
                        </td>
                        <td className="border border-y-0 border-l-0 border-gray-700 px-1">
                          {f.template}
                        </td>
                      </tr>
                      <tr className="every_two_rows mt-4 border-x-2 border-y-2 border-gray-400">
                        <td colSpan={6} className="" hidden={f.id !== expanded}>
                          <div className="flex flex-row ">
                            <div className="w-24 shrink">
                              <button
                                className="align-center m-2 w-10 rotate-180 justify-center rounded bg-indigo-400 p-2 hover:bg-indigo-300"
                                onClick={() => {
                                  setExpanded('');
                                }}
                              >
                                <img
                                  alt="expand finding"
                                  src="expand.svg"
                                ></img>
                              </button>
                            </div>
                            <div className=" flex grow basis-1/2 flex-col justify-start py-4">
                              <FindingsDetailBlock
                                finding={f}
                              ></FindingsDetailBlock>
                            </div>
                            <div className="flex grow basis-1/2 flex-col  py-4 pl-4">
                              <ScanInformationBlock
                                finding={f}
                              ></ScanInformationBlock>
                              <ul className="mt-4 flex grow flex-col">
                                <li>
                                  Disclosure Information:{' '}
                                  {f.disclosure?.status ?? 'Not Started'}
                                </li>
                                <li>
                                  <Link href="/disclosures/create">
                                    <button
                                      className="my-2 inline-flex  items-center rounded bg-indigo-400 p-2 align-middle text-white hover:bg-indigo-300"
                                      onClick={() => {
                                        setExpanded('');
                                      }}
                                    >
                                      <img
                                        alt="create new disclosure"
                                        className="mr-2 h-8 w-8 fill-white"
                                        src="new-document.svg"
                                      ></img>{' '}
                                      <span>Create new disclosure</span>
                                    </button>
                                  </Link>
                                </li>
                                <li>Ticket Status: Unknown</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
            </tbody>
          </table>
        </div>

        {findingsStatus && findingsStatus == 'loading' && (
          <button
            type="button"
            className="inline-flex cursor-not-allowed items-center rounded-md  bg-indigo-400 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out"
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
        {findingsStatus &&
          findingsStatus != 'loading' &&
          findings &&
          findings.length == 0 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-white">
                  No Findings found, have you run any scans?
                </p>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default Home;
