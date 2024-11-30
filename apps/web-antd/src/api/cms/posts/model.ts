import type { Optional } from '#/api/core/optional';

export declare namespace PostsApi {
  export interface View {
    postsId: string;
    title: string;
    customSummaries: string;
    alias: string;
    commentsAreAllowed: boolean;
    pinnedOrNot: boolean;
    cover: string;
    template: string;
    visibility: string;
    likeCount: number;
    shareCount: number;
    content: string;
    status: string;
    publicationTime?: string;
    userId: string;
  }

  export interface ListParams {
    title?: string;
    status?: string;
  }

  export type List = View[];

  export type CreateParams = Optional<View, 'postsId' | 'userId'>;
}
