import path from 'path';
import { promises as fs } from 'fs';
import {
  disclosure,
  disclosureStatus,
  severity,
  disclosureHistory,
} from '~/shared/finding';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { FileFindingsStore, FileDisclosureStore } from '~/shared/backend_file';

const disclosureStore = new FileDisclosureStore();
export const disclosuresRouter = createTRPCRouter({
  updateDisclosureStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        status: z.nativeEnum(disclosureStatus),
      })
    )
    .mutation(async (opts): Promise<boolean> => {
      const { input } = opts;
      return await disclosureStore.updateDisclosureStatus(
        input.id,
        input.status
      );
    }),
  newDisclosure: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        template: z.string().nonempty(),
        hosts: z.string().nonempty().array(),
        severity: z.nativeEnum(severity),
        references: z.string().nonempty().array(),
        description: z.string().nonempty(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const newDisclosure = new disclosure(
        input.name,
        input.hosts,
        input.template,
        disclosureStatus.started,
        '',
        input.description,
        input.severity,
        input.references
      );
      return await disclosureStore.addDisclosure(newDisclosure);
    }),
  getDisclosures: protectedProcedure.query(async (): Promise<disclosure[]> => {
    return await disclosureStore.getDisclosures();
  }),
  generateDisclosureTemplate: protectedProcedure
    .input(z.string())
    .mutation(async (opts): Promise<string> => {
      const { input } = opts;
      return await disclosureStore.getDisclosureTemplate(input);
    }),
});
