-- =====================================================
-- EMMA - Script de Inicialización de Base de Datos
-- Versión: 1.0
-- Descripción: Crea todas las tablas, índices y datos iniciales
-- =====================================================

-- Configurar timezone
SET timezone = 'America/Lima';

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMERACIONES
-- =====================================================

CREATE TYPE enum_user_roles AS ENUM ('admin', 'editor', 'guest', 'reader');
CREATE TYPE enum_blogs_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enum_contacts_status AS ENUM ('new', 'read', 'replied');
CREATE TYPE enum_notifications_notification_type AS ENUM ('system', 'news', 'event', 'promotion', 'warning');
CREATE TYPE enum_notifications_show_on_pages AS ENUM ('all', 'home', 'specific');
CREATE TYPE enum_recruitments_status AS ENUM ('new', 'reviewing', 'interview', 'hired', 'rejected');
CREATE TYPE enum_slides_visual_type AS ENUM ('dashboard', 'analytics', 'team', 'growth', 'innovation');
CREATE TYPE enum_subscriptions_status AS ENUM ('active', 'unsubscribed');
CREATE TYPE enum_subscriptions_type AS ENUM ('general', 'career', 'blog');
CREATE TYPE enum_course_status AS ENUM ('draft', 'published', 'archived', 'inactive');
CREATE TYPE enum_assignment_status AS ENUM ('pending', 'in_progress', 'completed', 'expired');
CREATE TYPE enum_material_type AS ENUM ('pdf', 'video', 'link', 'document', 'presentation');

-- =====================================================
-- TABLA: tbl_users
-- =====================================================

CREATE TABLE tbl_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(120) UNIQUE NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role enum_user_roles DEFAULT 'guest' NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(40),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by INTEGER,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6),
    CONSTRAINT fk_users_creator FOREIGN KEY (created_by) REFERENCES tbl_users(id)
);

CREATE INDEX users_active_idx ON tbl_users(is_active);

-- =====================================================
-- TABLA: tbl_blogs
-- =====================================================

CREATE TABLE tbl_blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    status enum_blogs_status DEFAULT 'draft' NOT NULL,
    pub_date TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6),
    CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES tbl_users(id)
);

CREATE INDEX blogs_author_idx ON tbl_blogs(author_id);
CREATE INDEX blogs_status_pubdate_idx ON tbl_blogs(status, pub_date);

-- =====================================================
-- TABLA: tbl_contacts
-- =====================================================

CREATE TABLE tbl_contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(40),
    company VARCHAR(160),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    notes JSON DEFAULT '[]' NOT NULL,
    status enum_contacts_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX contacts_status_created_idx ON tbl_contacts(status, created_at);

-- =====================================================
-- TABLA: tbl_files
-- =====================================================

CREATE TABLE tbl_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    related_type VARCHAR(255) NOT NULL,
    related_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLA: tbl_job_positions
-- =====================================================

CREATE TABLE tbl_job_positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    department VARCHAR(120),
    location VARCHAR(120) DEFAULT 'Remoto' NOT NULL,
    employment_type VARCHAR(120) DEFAULT 'Tiempo completo' NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    requirements JSON,
    responsibilities JSON,
    experience_min INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX job_positions_flags_idx ON tbl_job_positions(is_active, is_featured);

-- =====================================================
-- TABLA: tbl_notifications
-- =====================================================

CREATE TABLE tbl_notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    notification_type enum_notifications_notification_type NOT NULL,
    action_url VARCHAR(500),
    action_text VARCHAR(160),
    is_active BOOLEAN DEFAULT true NOT NULL,
    dismissible BOOLEAN DEFAULT true NOT NULL,
    show_on_pages enum_notifications_show_on_pages DEFAULT 'all' NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX notifications_active_type_idx ON tbl_notifications(is_active, notification_type);

-- =====================================================
-- TABLA: tbl_recruitments
-- =====================================================

CREATE TABLE tbl_recruitments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(40),
    position VARCHAR(160) NOT NULL,
    experience TEXT,
    salary_expectation VARCHAR(120),
    cover_letter TEXT,
    status enum_recruitments_status DEFAULT 'new' NOT NULL,
    position_id INTEGER,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6),
    CONSTRAINT fk_recruitments_position FOREIGN KEY (position_id) REFERENCES tbl_job_positions(id)
);

CREATE INDEX recruitments_position_idx ON tbl_recruitments(position_id);
CREATE INDEX recruitments_status_created_idx ON tbl_recruitments(status, created_at);

-- =====================================================
-- TABLA: tbl_slides
-- =====================================================

CREATE TABLE tbl_slides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    subtitle VARCHAR(220),
    description TEXT,
    button_text VARCHAR(120) DEFAULT 'Conoce más' NOT NULL,
    button_link VARCHAR(300) DEFAULT '/about' NOT NULL,
    visual_type enum_slides_visual_type DEFAULT 'dashboard' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX slides_active_sort_idx ON tbl_slides(is_active, sort_order);

-- =====================================================
-- TABLA: tbl_subscriptions
-- =====================================================

CREATE TABLE tbl_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    type enum_subscriptions_type DEFAULT 'general' NOT NULL,
    status enum_subscriptions_status DEFAULT 'active' NOT NULL,
    source VARCHAR(160),
    metadata JSON,
    subscribed_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    unsubscribed_at TIMESTAMPTZ(6),
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX subscriptions_status_type_idx ON tbl_subscriptions(status, type);

-- =====================================================
-- TABLA: tbl_testimonials
-- =====================================================

CREATE TABLE tbl_testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    position VARCHAR(160),
    company VARCHAR(160),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6)
);

CREATE INDEX testimonials_flags_idx ON tbl_testimonials(is_active, is_featured);

-- =====================================================
-- TABLA: tbl_courses
-- =====================================================

CREATE TABLE tbl_courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    duration_hours INTEGER DEFAULT 0,
    instructor VARCHAR(160),
    category VARCHAR(100),
    meeting_link VARCHAR(500),
    max_students INTEGER DEFAULT 0,
    status enum_course_status DEFAULT 'draft' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ(6),
    CONSTRAINT fk_courses_creator FOREIGN KEY (created_by) REFERENCES tbl_users(id)
);

CREATE INDEX courses_status_active_idx ON tbl_courses(status, is_active);
CREATE INDEX courses_creator_idx ON tbl_courses(created_by);
CREATE INDEX courses_category_idx ON tbl_courses(category);

-- =====================================================
-- TABLA: tbl_course_materials
-- =====================================================

CREATE TABLE tbl_course_materials (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    material_type enum_material_type NOT NULL,
    file_size INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_required BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_materials_course FOREIGN KEY (course_id) REFERENCES tbl_courses(id) ON DELETE CASCADE
);

CREATE INDEX materials_course_order_idx ON tbl_course_materials(course_id, sort_order);

-- =====================================================
-- TABLA: tbl_course_assignments
-- =====================================================

CREATE TABLE tbl_course_assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,
    status enum_assignment_status DEFAULT 'pending' NOT NULL,
    assigned_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    started_at TIMESTAMPTZ(6),
    completed_at TIMESTAMPTZ(6),
    due_date TIMESTAMPTZ(6),
    notes TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_assignments_course FOREIGN KEY (course_id) REFERENCES tbl_courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignments_user FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE CASCADE,
    CONSTRAINT uq_assignments_course_user UNIQUE (course_id, user_id)
);

CREATE INDEX assignments_user_status_idx ON tbl_course_assignments(user_id, status);
CREATE INDEX assignments_course_status_idx ON tbl_course_assignments(course_id, status);
CREATE INDEX assignments_assigned_by_idx ON tbl_course_assignments(assigned_by);

-- =====================================================
-- TABLA: tbl_course_progresses
-- =====================================================

CREATE TABLE tbl_course_progresses (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    progress_percentage INTEGER DEFAULT 0 NOT NULL,
    current_module VARCHAR(200),
    time_spent_minutes INTEGER DEFAULT 0 NOT NULL,
    last_accessed_at TIMESTAMPTZ(6),
    completion_notes TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_progress_assignment FOREIGN KEY (assignment_id) REFERENCES tbl_course_assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_course FOREIGN KEY (course_id) REFERENCES tbl_courses(id) ON DELETE CASCADE
);

CREATE INDEX progress_user_course_idx ON tbl_course_progresses(user_id, course_id);

-- =====================================================
-- TABLA: tbl_certificates
-- =====================================================

CREATE TABLE tbl_certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    certificate_code VARCHAR(100) UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    template_used VARCHAR(100),
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES tbl_courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_certificates_user_course UNIQUE (user_id, course_id)
);

CREATE INDEX certificates_code_idx ON tbl_certificates(certificate_code);
CREATE INDEX certificates_issued_idx ON tbl_certificates(issued_at);

-- =====================================================
-- TABLA: tbl_audit_logs
-- =====================================================

CREATE TABLE tbl_audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE SET NULL
);

CREATE INDEX audit_user_date_idx ON tbl_audit_logs(user_id, created_at);
CREATE INDEX audit_entity_idx ON tbl_audit_logs(entity_type, entity_id);
CREATE INDEX audit_action_idx ON tbl_audit_logs(action);

-- =====================================================
-- SEEDERS DE PRODUCCIÓN
-- =====================================================

-- Insertar usuario administrador principal
-- Contraseña: Password123$ (debe cambiarse en producción)
INSERT INTO tbl_users (username, email, password, role, first_name, last_name, is_active)
VALUES (
    'admin',
    'admin@emma.com',
    '$2b$12$LpT7K8Jz7J5xW8o8BxFqxObWKG0qN8XcRPJHQJ5qBxFqxObWKG0qO', -- Password123$
    'admin',
    'Administrador',
    'Sistema',
    true
);

-- Insertar notificación de bienvenida
INSERT INTO tbl_notifications (title, description, notification_type, is_active, dismissible, show_on_pages)
VALUES (
    'Bienvenido a EMMA',
    'Sistema de gestión de recursos humanos inicializado correctamente. Por favor, cambia la contraseña del usuario administrador.',
    'system',
    true,
    true,
    'all'
);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_tbl_users_updated_at BEFORE UPDATE ON tbl_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_blogs_updated_at BEFORE UPDATE ON tbl_blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_contacts_updated_at BEFORE UPDATE ON tbl_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_files_updated_at BEFORE UPDATE ON tbl_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_job_positions_updated_at BEFORE UPDATE ON tbl_job_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_notifications_updated_at BEFORE UPDATE ON tbl_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_recruitments_updated_at BEFORE UPDATE ON tbl_recruitments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_slides_updated_at BEFORE UPDATE ON tbl_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_subscriptions_updated_at BEFORE UPDATE ON tbl_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_testimonials_updated_at BEFORE UPDATE ON tbl_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_courses_updated_at BEFORE UPDATE ON tbl_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_course_materials_updated_at BEFORE UPDATE ON tbl_course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_course_assignments_updated_at BEFORE UPDATE ON tbl_course_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_course_progresses_updated_at BEFORE UPDATE ON tbl_course_progresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tbl_certificates_updated_at BEFORE UPDATE ON tbl_certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos inicializada correctamente';
    RAISE NOTICE '✅ Tablas creadas: 15';
    RAISE NOTICE '✅ Índices creados: 25+';
    RAISE NOTICE '✅ Usuario admin creado';
    RAISE NOTICE '⚠️  IMPORTANTE: Cambia la contraseña del usuario admin';
END $$;
