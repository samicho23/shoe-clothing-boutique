CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "respondedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
CREATE INDEX "NewsArticle_isPublished_publishedAt_idx" ON "NewsArticle"("isPublished", "publishedAt");
CREATE INDEX "GalleryItem_isVisible_sortOrder_idx" ON "GalleryItem"("isVisible", "sortOrder");
CREATE INDEX "ContactSubmission_isResolved_createdAt_idx" ON "ContactSubmission"("isResolved", "createdAt");

ALTER TABLE "ContactSubmission"
  ADD CONSTRAINT "ContactSubmission_respondedById_fkey"
  FOREIGN KEY ("respondedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
