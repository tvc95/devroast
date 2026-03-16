ALTER TABLE "roasts" ADD COLUMN "ip" varchar(45);--> statement-breakpoint
CREATE INDEX "roasts_ip_created_at_idx" ON "roasts" USING btree ("ip","created_at");