/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Document design data interface
 */
export interface DocumentDesignData {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  status: string;
  version: string;
}

/**
 * Response type for /api/document-designs/:type
 */
export interface DocumentDesignResponse {
  documentType: string;
  data: DocumentDesignData[];
}
