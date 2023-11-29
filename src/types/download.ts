export type DownloadData = {
    downloads: Download[] | [];
}

export interface Download {
    title: string,
    filePath: string,
    dataCount: number,
    fileCount: number,
    libraryCount: number,
    visitCount: number,
    createdAt: Date,
    token: string,
    status: string
}
  