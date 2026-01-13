-- CreateEnum
CREATE TYPE "enum_blogs_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "enum_contacts_status" AS ENUM ('new', 'read', 'replied');

-- CreateEnum
CREATE TYPE "enum_notifications_notification_type" AS ENUM ('system', 'news', 'event', 'promotion', 'warning');

-- CreateEnum
CREATE TYPE "enum_notifications_show_on_pages" AS ENUM ('all', 'home', 'specific');

-- CreateEnum
CREATE TYPE "enum_recruitments_status" AS ENUM ('new', 'reviewing', 'interview', 'hired', 'rejected');

-- CreateEnum
CREATE TYPE "enum_slides_visual_type" AS ENUM ('dashboard', 'analytics', 'team', 'growth', 'innovation');

-- CreateEnum
CREATE TYPE "enum_subscriptions_status" AS ENUM ('active', 'unsubscribed');

-- CreateEnum
CREATE TYPE "enum_subscriptions_type" AS ENUM ('general', 'career', 'blog');

-- CreateEnum
CREATE TYPE "enum_user_roles" AS ENUM ('admin', 'editor', 'guest', 'reader');

-- CreateEnum
CREATE TYPE "enum_course_status" AS ENUM ('draft', 'published', 'archived', 'inactive');

-- CreateEnum
CREATE TYPE "enum_assignment_status" AS ENUM ('pending', 'in_progress', 'completed', 'expired');

-- CreateEnum
CREATE TYPE "enum_material_type" AS ENUM ('pdf', 'video', 'link', 'document', 'presentation');

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "enum_user_roles" NOT NULL DEFAULT 'guest',
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(40),
    "avatar_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_blogs" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "status" "enum_blogs_status" NOT NULL DEFAULT 'draft',
    "pub_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_contacts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(40),
    "company" VARCHAR(160),
    "subject" VARCHAR(200),
    "message" TEXT NOT NULL,
    "notes" JSONB NOT NULL DEFAULT '[]',
    "status" "enum_contacts_status" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_files" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "related_type" VARCHAR(255) NOT NULL,
    "related_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_job_positions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "department" VARCHAR(120),
    "location" VARCHAR(120) NOT NULL DEFAULT 'Remoto',
    "employment_type" VARCHAR(120) NOT NULL DEFAULT 'Tiempo completo',
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "requirements" JSONB,
    "responsibilities" JSONB,
    "experience_min" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_job_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_notifications" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "notification_type" "enum_notifications_notification_type" NOT NULL,
    "action_url" VARCHAR(500),
    "action_text" VARCHAR(160),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "dismissible" BOOLEAN NOT NULL DEFAULT true,
    "show_on_pages" "enum_notifications_show_on_pages" NOT NULL DEFAULT 'all',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_recruitments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(40),
    "position" VARCHAR(160) NOT NULL,
    "experience" TEXT,
    "salary_expectation" VARCHAR(120),
    "cover_letter" TEXT,
    "status" "enum_recruitments_status" NOT NULL DEFAULT 'new',
    "position_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_recruitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_slides" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "subtitle" VARCHAR(220),
    "description" TEXT,
    "button_text" VARCHAR(120) NOT NULL DEFAULT 'Conoce más',
    "button_link" VARCHAR(300) NOT NULL DEFAULT '/about',
    "visual_type" "enum_slides_visual_type" NOT NULL DEFAULT 'dashboard',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_subscriptions" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "type" "enum_subscriptions_type" NOT NULL DEFAULT 'general',
    "status" "enum_subscriptions_status" NOT NULL DEFAULT 'active',
    "source" VARCHAR(160),
    "metadata" JSONB,
    "subscribed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_testimonials" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "position" VARCHAR(160),
    "company" VARCHAR(160),
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_courses" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "duration_hours" INTEGER DEFAULT 0,
    "instructor" VARCHAR(160),
    "category" VARCHAR(100),
    "meeting_link" VARCHAR(500),
    "max_students" INTEGER DEFAULT 0,
    "status" "enum_course_status" NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tbl_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_course_materials" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "file_path" VARCHAR(500),
    "file_url" VARCHAR(500),
    "material_type" "enum_material_type" NOT NULL,
    "file_size" INTEGER DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_course_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_course_assignments" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assigned_by" INTEGER NOT NULL,
    "status" "enum_assignment_status" NOT NULL DEFAULT 'pending',
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "due_date" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_course_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_course_progresses" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "current_module" VARCHAR(200),
    "time_spent_minutes" INTEGER NOT NULL DEFAULT 0,
    "last_accessed_at" TIMESTAMPTZ(6),
    "completion_notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_course_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_certificates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "certificate_code" VARCHAR(100) NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" VARCHAR(500),
    "file_url" VARCHAR(500),
    "template_used" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_username_key" ON "tbl_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_email_key" ON "tbl_users"("email");

-- CreateIndex
CREATE INDEX "users_active_idx" ON "tbl_users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_blogs_slug_key" ON "tbl_blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_author_idx" ON "tbl_blogs"("author_id");

-- CreateIndex
CREATE INDEX "blogs_status_pubdate_idx" ON "tbl_blogs"("status", "pub_date");

-- CreateIndex
CREATE INDEX "contacts_status_created_idx" ON "tbl_contacts"("status", "created_at");

-- CreateIndex
CREATE INDEX "job_positions_flags_idx" ON "tbl_job_positions"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "notifications_active_type_idx" ON "tbl_notifications"("is_active", "notification_type");

-- CreateIndex
CREATE INDEX "recruitments_position_idx" ON "tbl_recruitments"("position_id");

-- CreateIndex
CREATE INDEX "recruitments_status_created_idx" ON "tbl_recruitments"("status", "created_at");

-- CreateIndex
CREATE INDEX "slides_active_sort_idx" ON "tbl_slides"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_subscriptions_email_key" ON "tbl_subscriptions"("email");

-- CreateIndex
CREATE INDEX "tbl_subscriptions_status_type_idx" ON "tbl_subscriptions"("status", "type");

-- CreateIndex
CREATE INDEX "testimonials_flags_idx" ON "tbl_testimonials"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "courses_status_active_idx" ON "tbl_courses"("status", "is_active");

-- CreateIndex
CREATE INDEX "courses_creator_idx" ON "tbl_courses"("created_by");

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "tbl_courses"("category");

-- CreateIndex
CREATE INDEX "materials_course_order_idx" ON "tbl_course_materials"("course_id", "sort_order");

-- CreateIndex
CREATE INDEX "assignments_user_status_idx" ON "tbl_course_assignments"("user_id", "status");

-- CreateIndex
CREATE INDEX "assignments_course_status_idx" ON "tbl_course_assignments"("course_id", "status");

-- CreateIndex
CREATE INDEX "assignments_assigned_by_idx" ON "tbl_course_assignments"("assigned_by");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_course_assignments_course_id_user_id_key" ON "tbl_course_assignments"("course_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_course_progresses_assignment_id_key" ON "tbl_course_progresses"("assignment_id");

-- CreateIndex
CREATE INDEX "progress_user_course_idx" ON "tbl_course_progresses"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_certificates_certificate_code_key" ON "tbl_certificates"("certificate_code");

-- CreateIndex
CREATE INDEX "certificates_code_idx" ON "tbl_certificates"("certificate_code");

-- CreateIndex
CREATE INDEX "certificates_issued_idx" ON "tbl_certificates"("issued_at");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_certificates_user_id_course_id_key" ON "tbl_certificates"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "audit_user_date_idx" ON "tbl_audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_entity_idx" ON "tbl_audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_action_idx" ON "tbl_audit_logs"("action");

-- AddForeignKey
ALTER TABLE "tbl_users" ADD CONSTRAINT "tbl_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "tbl_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_blogs" ADD CONSTRAINT "tbl_blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_recruitments" ADD CONSTRAINT "tbl_recruitments_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "tbl_job_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_courses" ADD CONSTRAINT "tbl_courses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_materials" ADD CONSTRAINT "tbl_course_materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "tbl_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_assignments" ADD CONSTRAINT "tbl_course_assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "tbl_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_assignments" ADD CONSTRAINT "tbl_course_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_progresses" ADD CONSTRAINT "tbl_course_progresses_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "tbl_course_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_progresses" ADD CONSTRAINT "tbl_course_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_course_progresses" ADD CONSTRAINT "tbl_course_progresses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "tbl_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_certificates" ADD CONSTRAINT "tbl_certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_certificates" ADD CONSTRAINT "tbl_certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "tbl_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_audit_logs" ADD CONSTRAINT "tbl_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
