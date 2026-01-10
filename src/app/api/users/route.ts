import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Middleware para verificar permisos según el rol
async function checkPermissions(requiredRoles: string[], req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  if (!requiredRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  
  return null;
}

// GET - Listar usuarios
export async function GET(req: NextRequest) {
  const permissionCheck = await checkPermissions(['admin', 'editor', 'reader'], req);
  if (permissionCheck) return permissionCheck;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const isActive = searchParams.get('is_active');
  
  try {
    const where: any = {
      deleted_at: null,
    };

    // Si es editor o reader, solo ve usuarios que él creó o está permitido ver
    if (session.user.role === 'editor' || session.user.role === 'reader') {
      where.created_by = parseInt(session.user.id);
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== null) {
      where.is_active = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.tbl_users.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          first_name: true,
          last_name: true,
          phone: true,
          avatar_url: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          creator: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.tbl_users.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Crear usuario
export async function POST(req: NextRequest) {
  const permissionCheck = await checkPermissions(['admin', 'editor'], req);
  if (permissionCheck) return permissionCheck;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    const {
      username,
      email,
      password,
      role,
      first_name,
      last_name,
      phone,
    } = await req.json();

    // Validaciones
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Editor solo puede crear usuarios guest
    if (session.user.role === 'editor' && role !== 'guest') {
      return NextResponse.json(
        { error: "You can only create guest users" },
        { status: 403 }
      );
    }

    // Verificar que el username y email no existan
    const existingUser = await prisma.tbl_users.findFirst({
      where: {
        username,
        email,
        deleted_at: null,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.tbl_users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'guest',
        first_name,
        last_name,
        phone,
        created_by: parseInt(session.user.id),
      },
      select: {
        id: true,
        username: true,
        role: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
        created_at: true,
      },
    });

    // Log de auditoría
    await prisma.tbl_audit_logs.create({
      data: {
        user_id: parseInt(session.user.id),
        action: 'CREATE_USER',
        entity_type: 'users',
        entity_id: newUser.id,
        new_values: { username, role },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
