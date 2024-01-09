import { initEdgeStoreClient } from '@edgestore/server/core';
import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler, type CreateContextOptions } from '@edgestore/server/adapters/next/app';
import { z } from 'zod'; 

type Context = {
  userId: string;
  userRole: 'employee';
};
const es = initEdgeStore.context<Context>().create();

function createContext(_opts: CreateContextOptions): Context {
  return {
    userId: '123',
    userRole: 'employee',
  };
}

const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 2 * 1024 * 1024,
      accept: ['image/*'],
    })
    .input(z.object({
      type: z.enum(['employees'])
    }))
    .path(({ ctx, input }: { ctx: any; input: any }) => [{ type: input.type }, { author: ctx.userId }])
    .metadata(({ ctx }) => ({
      role: ctx.userRole,
    })),
});
export const UploaderHandler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});
