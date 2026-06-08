import api from "@/shared/api";
import request from "@/shared/api/request";
import type {
    DocumentTemplate,
    DocumentTemplatesResponse,
    FetchGeneratedDocumentsParams,
    GenerateDocumentRequest,
    GeneratedDocument,
    GeneratedDocumentsResponse,
} from "../types";
import { chatService } from "@/features/chat/helpers";

const documentGenerationPath = `${chatService}/tasks/document-generation`;

export const fetchDocumentTemplates = () =>
    request<DocumentTemplatesResponse>(
        api.get(`${documentGenerationPath}/templates`)
    );

export const fetchDocumentTemplate = (templateId: string) =>
    request<DocumentTemplate>(
        api.get(`${documentGenerationPath}/templates/${templateId}`)
    );

export const generateDocument = (body: GenerateDocumentRequest) =>
    request<GeneratedDocument>(
        api.post(documentGenerationPath, body)
    );

export const fetchGeneratedDocuments = ({
    page = 1,
    size = 10,
    sortOrder = "DESC",
}: FetchGeneratedDocumentsParams = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortOrder,
    });

    return request<GeneratedDocumentsResponse>(
        api.get(`${documentGenerationPath}?${params.toString()}`)
    );
};
