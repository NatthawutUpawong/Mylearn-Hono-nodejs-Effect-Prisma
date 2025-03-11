/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `projectRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projectRelation_projectId_key" ON "projectRelation"("projectId");
