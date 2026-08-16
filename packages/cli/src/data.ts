import { setPlatformService } from "@readany/core/services";
import { getPlatformService } from "@readany/core/services";
import type { Book, Highlight, Note } from "@readany/core/types";
import {
  createEpubDraft,
  discardEpubDraft,
  readEpubDraftHistory,
  undoEpubDraftOperation,
  type EpubDraftCreateResult,
} from "@readany/core/epub/draft";
import { diffEpubDraft } from "@readany/core/epub/diff";
import { exportEpubDraft } from "@readany/core/epub/export";
import { inspectEpubBytes, type EpubInspectResult } from "@readany/core/epub/inspect";
import {
  getAllHighlights,
  getAllNotes,
  getBook,
  getBooks,
  getBookmarks,
  getHighlights,
  getNotes,
  closeDB,
  initDatabase,
} from "@readany/core/db";
import {
  assertPatchableEpubChapterInDraft,
  patchEpubChapterInDraft,
  readEpubChapterFromBookFile,
  readEpubChapterFromDraft,
  type EpubChapterPatchResult,
} from "@readany/core/epub/chapter";
import { patchEpubMetadataInDraft } from "@readany/core/epub/metadata";
import { rebuildEpubTocInDraft } from "@readany/core/epub/toc";
import { validateEpubDraft } from "@readany/core/epub/validate";
import { exportBookNotes } from "@readany/core/export/notes-export";
import type { ExportFormat } from "@readany/core/export/annotation-exporter";
import {
  exportKnowledgeLibrary,
  type KnowledgeExportFormat,
} from "@readany/core/export/knowledge-export";
import { searchKnowledge, type KnowledgeSearchResult } from "@readany/core/knowledge/search";
import { createNodePlatformService } from "./platform/node-platform.js";

let initialized = false;
let initializedHome: string | undefined;

export async function ensureCoreInitialized(env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const nextHome = env.READANY_HOME;
  if (initialized && initializedHome === nextHome) return;
  if (initialized) {
    await closeDB();
  }
  setPlatformService(createNodePlatformService(env));
  await initDatabase();
  initialized = true;
  initializedHome = nextHome;
}

export async function listBooks(limit = 50, env: NodeJS.ProcessEnv = process.env) {
  await ensureCoreInitialized(env);
  const books = await getBooks();
  return books.slice(0, limit);
}

export async function searchBooks(query: string, limit = 20, env: NodeJS.ProcessEnv = process.env) {
  await ensureCoreInitialized(env);
  const needle = query.trim().toLowerCase();
  const books = await getBooks();
  return books
    .filter((book: Book) => {
      const haystack = [
        book.meta.title,
        book.meta.author,
        book.meta.description,
        ...(book.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .slice(0, limit);
}

export async function getBookById(bookId: string, env: NodeJS.ProcessEnv = process.env) {
  await ensureCoreInitialized(env);
  return getBook(bookId);
}

export type SearchAnnotationsOptions = {
  query?: string;
  bookId?: string;
  limit?: number;
  env?: NodeJS.ProcessEnv;
};

export async function listHighlights(options: SearchAnnotationsOptions = {}) {
  const { bookId, query, limit = 50, env = process.env } = options;
  await ensureCoreInitialized(env);
  const highlights = bookId ? await getHighlights(bookId) : await getAllHighlights(limit);
  const needle = query?.trim().toLowerCase();
  if (!needle) return highlights.slice(0, limit);
  return highlights
    .filter((highlight) =>
      `${highlight.text} ${highlight.note ?? ""} ${highlight.chapterTitle ?? ""}`
        .toLowerCase()
        .includes(needle),
    )
    .slice(0, limit);
}

export async function listNotes(options: SearchAnnotationsOptions = {}) {
  const { bookId, query, limit = 50, env = process.env } = options;
  await ensureCoreInitialized(env);
  const notes = bookId ? await getNotes(bookId) : await getAllNotes(limit);
  const needle = query?.trim().toLowerCase();
  if (!needle) return notes.slice(0, limit);
  return notes
    .filter((note) =>
      `${note.title} ${note.content} ${note.chapterTitle ?? ""} ${(note.tags ?? []).join(" ")}`
        .toLowerCase()
        .includes(needle),
    )
    .slice(0, limit);
}

export async function listBookmarks(bookId: string, env: NodeJS.ProcessEnv = process.env) {
  await ensureCoreInitialized(env);
  return getBookmarks(bookId);
}

export type EpubInspectBookResult = EpubInspectResult & {
  bookId: string;
  filePath: string;
};

export async function inspectEpubBook(
  bookId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<EpubInspectBookResult | null> {
  await ensureCoreInitialized(env);
  const book = await getBook(bookId);
  if (!book) return null;
  if (book.format !== "epub") {
    throw new Error(`Book ${bookId} is ${book.format}; only EPUB inspect is currently supported.`);
  }

  const platform = getPlatformService();
  const dataDir = await platform.getDataDir();
  const absolutePath = await platform.joinPath(dataDir, book.filePath);
  if (!(await platform.exists(absolutePath))) {
    throw new Error(`Book file was not found for ${bookId}: ${book.filePath}`);
  }

  const result = await inspectEpubBytes(await platform.readFile(absolutePath));
  return {
    ...result,
    bookId,
    filePath: book.filePath,
  };
}

export async function createEpubDraftForBook(
  bookId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<EpubDraftCreateResult | null> {
  await ensureCoreInitialized(env);
  const book = await getBook(bookId);
  if (!book) return null;
  return createEpubDraft(book);
}

export async function readEpubChapter(options: {
  bookId?: string;
  draftId?: string;
  chapterId: string;
  contentLimit?: number;
  contentFormat?: "text" | "xhtml";
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/epub/chapter").EpubChapterReadResult | null> {
  const { bookId, draftId, chapterId, contentLimit, contentFormat, env = process.env } = options;
  await ensureCoreInitialized(env);

  if (draftId) {
    return readEpubChapterFromDraft(draftId, chapterId, { contentLimit, contentFormat });
  }

  if (!bookId) return null;
  const book = await getBook(bookId);
  if (!book) return null;
  if (book.format !== "epub") {
    throw new Error(
      `Book ${bookId} is ${book.format}; only EPUB chapter reads are currently supported.`,
    );
  }
  return readEpubChapterFromBookFile(bookId, book.filePath, chapterId, {
    contentLimit,
    contentFormat,
  });
}

export async function patchEpubChapter(options: {
  draftId: string;
  chapterId: string;
  xhtml: string;
  env?: NodeJS.ProcessEnv;
}): Promise<EpubChapterPatchResult> {
  const { draftId, chapterId, xhtml, env = process.env } = options;
  await ensureCoreInitialized(env);
  return patchEpubChapterInDraft(draftId, chapterId, xhtml);
}

export type EpubChapterPatchPlanItem = {
  chapterId: string;
  xhtml: string;
};

export type EpubChaptersPatchResult = {
  draftId: string;
  bookId: string;
  requestedCount: number;
  patchedCount: number;
  changedCount: number;
  patches: EpubChapterPatchResult[];
  manifestPath: string;
  historyPath: string;
};

export async function patchEpubChapters(options: {
  draftId: string;
  patches: unknown;
  env?: NodeJS.ProcessEnv;
}): Promise<EpubChaptersPatchResult> {
  const { draftId, patches, env = process.env } = options;
  const patchPlan = assertEpubChapterPatchPlan(patches);
  await ensureCoreInitialized(env);
  for (const patch of patchPlan) {
    await assertPatchableEpubChapterInDraft(draftId, patch.chapterId, patch.xhtml);
  }

  const results: EpubChapterPatchResult[] = [];
  for (const patch of patchPlan) {
    results.push(await patchEpubChapterInDraft(draftId, patch.chapterId, patch.xhtml));
  }

  const first = results[0];
  if (!first) {
    throw new Error("epub chapters patch requires at least one patch");
  }

  return {
    draftId,
    bookId: first.bookId,
    requestedCount: patchPlan.length,
    patchedCount: results.length,
    changedCount: results.filter((result) => result.changed).length,
    patches: results,
    manifestPath: first.manifestPath,
    historyPath: first.historyPath,
  };
}

export function assertEpubChapterPatchPlan(patches: unknown): EpubChapterPatchPlanItem[] {
  if (!Array.isArray(patches) || patches.length === 0) {
    throw new Error("epub chapters patch requires at least one patch");
  }
  if (patches.length > 50) {
    throw new Error("epub chapters patch accepts at most 50 patches");
  }

  const seenChapterIds = new Set<string>();
  const plan: EpubChapterPatchPlanItem[] = [];
  for (const patch of patches) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      throw new Error("epub chapters patch requires every patch to be an object");
    }
    const item = patch as Record<string, unknown>;
    if (typeof item.chapterId !== "string" || !item.chapterId.trim()) {
      throw new Error("epub chapters patch requires every patch to include chapterId");
    }
    if (typeof item.xhtml !== "string" || !item.xhtml.trim()) {
      throw new Error("epub chapters patch requires every patch to include xhtml");
    }
    const chapterId = item.chapterId.trim();
    if (seenChapterIds.has(chapterId)) {
      throw new Error(`epub chapters patch contains duplicate chapterId: ${chapterId}`);
    }
    seenChapterIds.add(chapterId);
    plan.push({ chapterId, xhtml: item.xhtml });
  }
  return plan;
}

export async function patchEpubMetadata(options: {
  draftId: string;
  patch: import("@readany/core/epub/metadata").EpubMetadataPatch;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/epub/metadata").EpubMetadataPatchResult> {
  const { draftId, patch, env = process.env } = options;
  await ensureCoreInitialized(env);
  return patchEpubMetadataInDraft(draftId, patch);
}

export async function getEpubDraftHistory(
  draftId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<import("@readany/core/epub/draft").EpubDraftHistoryResult> {
  await ensureCoreInitialized(env);
  return readEpubDraftHistory(draftId);
}

export async function discardEpubDraftWorkspace(options: {
  draftId: string;
  reason?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/epub/draft").EpubDraftDiscardResult> {
  const { draftId, reason, env = process.env } = options;
  await ensureCoreInitialized(env);
  return discardEpubDraft(draftId, { reason });
}

export async function undoEpubDraftWorkspace(options: {
  draftId: string;
  operationId: string;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/epub/draft").EpubDraftUndoResult> {
  const { draftId, operationId, env = process.env } = options;
  await ensureCoreInitialized(env);
  return undoEpubDraftOperation(draftId, operationId);
}

export async function diffEpubDraftWorkspace(
  draftId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<import("@readany/core/epub/diff").EpubDiffResult> {
  await ensureCoreInitialized(env);
  return diffEpubDraft(draftId);
}

export async function rebuildEpubTocWorkspace(
  draftId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<import("@readany/core/epub/toc").EpubTocRebuildResult> {
  await ensureCoreInitialized(env);
  return rebuildEpubTocInDraft(draftId);
}

export async function validateEpubDraftWorkspace(
  draftId: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<import("@readany/core/epub/validate").EpubValidationResult> {
  await ensureCoreInitialized(env);
  return validateEpubDraft(draftId);
}

export async function exportEpubDraftWorkspace(options: {
  draftId: string;
  outputPath: string;
  overwrite?: boolean;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/epub/export").EpubExportResult> {
  const { draftId, outputPath, overwrite, env = process.env } = options;
  await ensureCoreInitialized(env);
  return exportEpubDraft(draftId, { outputPath, overwrite });
}

export async function exportBookNotesWorkspace(options: {
  bookId: string;
  outputPath: string;
  format?: ExportFormat;
  overwrite?: boolean;
  includeNotes?: boolean;
  includeHighlights?: boolean;
  groupByChapter?: boolean;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/export/notes-export").NotesExportResult> {
  const {
    bookId,
    outputPath,
    format,
    overwrite,
    includeNotes,
    includeHighlights,
    groupByChapter,
    env = process.env,
  } = options;
  await ensureCoreInitialized(env);
  return exportBookNotes(bookId, {
    outputPath,
    format,
    overwrite,
    includeNotes,
    includeHighlights,
    groupByChapter,
  });
}

export async function exportKnowledgeWorkspace(options: {
  outputPath: string;
  format?: KnowledgeExportFormat;
  overwrite?: boolean;
  includeBooks?: boolean;
  includeNotes?: boolean;
  includeHighlights?: boolean;
  limit?: number;
  env?: NodeJS.ProcessEnv;
}): Promise<import("@readany/core/export/knowledge-export").KnowledgeExportResult> {
  const {
    outputPath,
    format,
    overwrite,
    includeBooks,
    includeNotes,
    includeHighlights,
    limit,
    env = process.env,
  } = options;
  await ensureCoreInitialized(env);
  return exportKnowledgeLibrary({
    outputPath,
    format,
    overwrite,
    includeBooks,
    includeNotes,
    includeHighlights,
    limit,
  });
}

export async function searchKnowledgeWorkspace(options: {
  query: string;
  bookId?: string;
  limit?: number;
  contentLimit?: number;
  scanLimit?: number;
  includeBooks?: boolean;
  includeNotes?: boolean;
  includeHighlights?: boolean;
  env?: NodeJS.ProcessEnv;
}): Promise<KnowledgeSearchResult> {
  const {
    query,
    bookId,
    limit,
    contentLimit,
    scanLimit,
    includeBooks,
    includeNotes,
    includeHighlights,
    env = process.env,
  } = options;
  await ensureCoreInitialized(env);
  return searchKnowledge({
    query,
    bookId,
    limit,
    contentLimit,
    scanLimit,
    includeBooks,
    includeNotes,
    includeHighlights,
  });
}
